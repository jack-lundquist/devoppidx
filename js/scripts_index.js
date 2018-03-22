//Popup intro modal on load
$('#useModal').modal('show');


//Initialize tooltips
$(document).ready(function(){
    $('[data-toggle="tooltip"]').tooltip();
});

//Create the map variable
var map = L.map('my-map', {
    scrollWheelZoom: false
}).setView([40.692874, -73.939018], 12);

//Add the basemap
L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png', {
	attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
	subdomains: 'abcd',
	maxZoom: 19
}).addTo(map);

//Choropleth Function
function getColor(d) {
  return d > 15 ? '#4FDE02' :
      d > 10 ? '#83E002' :
      d > 5 ? '#B8E202' :
      d > 0 ? '#E4D902' :
      d > -5 ? '#E6A603' :
      d > -10 ? '#E87203' :
      d > -15 ? '#EA3E03' :
      '#EC0803';
};


//Initializaing function for each feature in the geojson
function onEachFeature(feature, layer) {
    scores = [];
    //Get buttons
    var selections = [$("#vacancy"), $("#shortTrip"), $("#highRent"), $("#renters"),
        $("#owners"), $("#recentMove"), $("#unemployed"), $("#white"),
        $("#poverty"), $("#elderly"), $("#children"), $("#highIncome"),
        $("#hsMinus"), $("#collegePlus"), $("#oldHousing"), $("#newHousing")
    ];
    //Check if button values are in the right range and change if not
    for (var i = 0; i < selections.length; i++) {
      selections[i].val(parseInt(selections[i].val()));
        if (selections[i].val() > 10) {
            alert('Please choose values <= 10! Value changed to 10 in index calculation.');
            selections[i].val(10);
        };
        if (selections[i].val() < -10) {
            alert('Please choose values => -10! Value changed to -10 in index calculation.');
            selections[i].val(-10);
        };
    };
    //array of weightings
    var idx = [$("#vacancy").val(), $("#shortTrip").val(), $("#highRent").val(), $("#renters").val(),
        $("#owners").val(), $("#recentMove").val(), $("#unemployed").val(), $("#white").val(),
        $("#poverty").val(), $("#elderly").val(), $("#children").val(), $("#highIncome").val(),
        $("#hsMinus").val(), $("#collegePlus").val(), $("#oldHousing").val(), $("#newHousing").val()
    ];

    //calculate index score
    feature.properties.idx = 0;
    features = [layer.feature.properties.pct_vacantunits_norm, layer.feature.properties.pct_traveltime_under30mins_norm,
        layer.feature.properties.pct_rent_2000plus_norm, layer.feature.properties.pct_renters_norm,
        layer.feature.properties.pct_ownership_norm, layer.feature.properties.pct_movedin_2010orlater_norm,
        layer.feature.properties.pct_unemployed_norm, layer.feature.properties.pct_white_norm,
        layer.feature.properties.pct_inPoverty_norm, layer.feature.properties.pct_olderthan65_norm,
        (1 - layer.feature.properties.pct_olderthan18_norm), layer.feature.properties.pct_HHincomegreater100k_norm,
        layer.feature.properties.pct_withoutHS_norm, layer.feature.properties.pct_withcollegeplus_norm,
        layer.feature.properties.pct_builtbefore1940_norm, layer.feature.properties.pct_builtafter2010_norm
    ];
    var score = 0;
    for (var i = 0; i < idx.length; i++) {
        score += idx[i] * features[i];
    };
    layer.feature.properties.idx = score;
    //get color, make popup and style layer
    layer.feature.properties.color = getColor(score);
    if (layer.feature.properties && layer.feature.properties.Address) {
        layer.bindPopup("Address: " + layer.feature.properties.Address + "\n" + "BBL: " + layer.feature.properties.BBL +
            "\n" + "Index Score: " + layer.feature.properties.idx);
    };
    layer.setStyle({
        fillColor: layer.feature.properties.color,
        weight: 0,
        opacity: 0,
        color: "lightgrey",
        // dashArray: '3',
        fillOpacity: 1
    });
};


//Function to get Top N values
function getTopN(arr, prop, n) {
    var clone = arr.slice(0);
    // sort descending
    clone.sort(function(x, y) {
        if (x[prop] == y[prop]) return 0;
        else if (parseInt(x[prop]) < parseInt(y[prop])) return 1;
        else return -1;
    });
    return clone.slice(0, n);
};

//function to populate the list
function makeUL(array) {
    // Create the list element:
    var list = document.createElement('ol');
    list.style.cssText = 'display:inline-block; text-align: left'

    for(var i = 0; i < array.length; i++) {
        // Create the list item and get the relevant features:
        property = array[i].properties;
        address = property.Address;
        index = parseInt(property.idx);
        far = property.ResidFAR;
        value = property.AssessTot;
        var item = document.createElement('li');

        // Set its contents:
        item.appendChild(document.createTextNode("Address: " + address +
        "; Index Score: " + index + "; FAR: " + far + "; Assessed Value: $" +value));
        // Add it to the list:
        list.appendChild(item);
    }

    // Finally, return the constructed list:
    return list;
}

//initialize layer for the first time around (need something to clear)
var filteredLayer = L.geoJSON(data_norm, {
  onEachFeature: onEachFeature,
});
//Update Map Function - called whenever values change or the apply filter button is pushed
function updateMap() {
  // start by reading the current state of the dropdowns
  var selectedN = $('#numProp1')
    .find(":selected")
    .val();

  var selectedFAR = parseInt(
    $('#farMin1')
      .find(":selected")
      .text()
      .charAt(0)
  );

  // filter the features for those greater than selectedFAR
  var features = data_norm.features
    .filter(d => d.properties.ResidFAR >= selectedFAR);

  // if anything other than 'all' is selected, getTopN()
  features = (selectedN === 'all') ? features : getTopN(features, 'idx', selectedN);

  // build a valid GeoJSON FeatureCollection around the now-filtered array of features.
  var FC = {
    type: 'FeatureCollection',
    features: features,
  };
  filteredLayer.clearLayers();
  // create a Leaflet geojson layer from the FeatureCollection
  filteredLayer = L.geoJSON(FC, {
    onEachFeature: onEachFeature,
  });

  filteredLayer.addTo(map);
  features = getTopN(features, 'idx', 25);
  // make a list from the array of features
  $("#property_list").html('');
  document.getElementById('property_list').appendChild(makeUL(features));
};

//first map populated!
updateMap();


//Create legend
var legend = L.control({
    position: 'bottomright'
});

legend.onAdd = function(map) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [16, 14, 9, 4, -4, -9, -14, -16],
        labels = ['Greater than 15', '10 to 15', '5 to 10', '0 to 5', "-5 to 0",
            "-10 to -5", '-15 to -10', 'Less than -15'
        ];
    div.innerHTML = '<div><b>Legend</b></div>';

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML += '<i style="background:' + getColor(grades[i]) + '">&nbsp;</i>&nbsp;&nbsp;' +
            labels[i] + '<br/>';
    }

    return div;
};

legend.addTo(map);

//When reset filter button is pushed - clears all filters + resets filter buttons and updates map
function resetFilters() {
  $("#numProp1").val("all");
  $("#farMin1").val('0');
  updateMap();
};


//fill weightings with stakeholder presets and updates map
function devFilter() {
  $("#vacancy").val(-5);
  $("#shortTrip").val(2);
  $("#highRent").val(5);
  $("#renters").val(0);
  $("#owners").val(5);
  $("#recentMove").val(7);
  $("#unemployed").val(-7);
  $("#white").val(5);
  $("#poverty").val(-7);
  $("#elderly").val(0);
  $("#children").val(0);
  $("#highIncome").val(7);
  $("#hsMinus").val(-5);
  $("#collegePlus").val(7);
  $("#oldHousing").val(0);
  $("#newHousing").val(7);
  updateMap();
};

function commFilter() {
  $("#vacancy").val(5);
  $("#shortTrip").val(7);
  $("#highRent").val(-5);
  $("#renters").val(0);
  $("#owners").val(0);
  $("#recentMove").val(0);
  $("#unemployed").val(5);
  $("#white").val(-5);
  $("#poverty").val(5);
  $("#elderly").val(5);
  $("#children").val(5);
  $("#highIncome").val(3);
  $("#hsMinus").val(5);
  $("#collegePlus").val(3);
  $("#oldHousing").val(3);
  $("#newHousing").val(3);
  updateMap();
};

function govFilter() {
  $("#vacancy").val(7);
  $("#shortTrip").val(3);
  $("#highRent").val(0);
  $("#renters").val(5);
  $("#owners").val(0);
  $("#recentMove").val(0);
  $("#unemployed").val(7);
  $("#white").val(0);
  $("#poverty").val(5);
  $("#elderly").val(5);
  $("#children").val(5);
  $("#highIncome").val(0);
  $("#hsMinus").val(5);
  $("#collegePlus").val(0);
  $("#oldHousing").val(0);
  $("#newHousing").val(0);
  updateMap();
};
