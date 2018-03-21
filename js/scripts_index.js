//Load intro modal on load
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
L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png', {
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
    var idx = [$("#vacancy").val(), $("#shortTrip").val(), $("#highRent").val(), $("#renters").val(),
        $("#owners").val(), $("#recentMove").val(), $("#unemployed").val(), $("#white").val(),
        $("#poverty").val(), $("#elderly").val(), $("#children").val(), $("#highIncome").val(),
        $("#hsMinus").val(), $("#collegePlus").val(), $("#oldHousing").val(), $("#newHousing").val()
    ];
    for (var i = 0; i < idx.length; i++) {
        if (idx[i] > 10) {
            alert('Please choose values <= 10! Value changed to 10 in index calculation.');
            idx[i] == 10;
        };
        if (idx[i] < -10) {
            alert('Please choose values => -10! Value changed to -10 in index calculation.');
            idx[i] == -10;
        }
    };
    // does this feature have a property named popupContent?
    if (feature.properties && feature.properties.Address) {
        layer.bindPopup("Address: " + feature.properties.Address + "\n" + "BBL: " + feature.properties.BBL);
    }
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
//
//
// function makeUL(array) {
//     // Create the list element:
//     var list = document.createElement('ul');
//
//     for(var i = 0; i < array.length; i++) {
//         // Create the list item:
//         var item = document.createElement('li');
//
//         // Set its contents:
//         item.appendChild(document.createTextNode(array[i]));
//
//         // Add it to the list:
//         list.appendChild(item);
//     }
//
//     // Finally, return the constructed list:
//     return list;
// }

//Update Map Function - called whenever values change or the apply filter button is pushed
function updateMap() {
  var val = $('#numProp1').find(":selected").text();
  var prop_layer = L.geoJSON(data_norm, {
      onEachFeature: onEachFeature,
  });
  var features = data_norm.features;
  var prop_layer = features.filter(a=>a.ResidFAR>(parseInt($('#farMin1').find(":selected").text().charAt(0))));
  console.log(prop_layer);
  var prop_layer_100 = getTopN(features, 'idx', 100);
  var prop_layer_50 = getTopN(features, 'idx', 50);
  var prop_layer_25 = getTopN(features, 'idx', 25);
  if(val == "Show Top 100") {
    prop_layer_100.addTo(map);
  }
  else if (val == "Show Top 50") {
    prop_layer_50.addTo(map);
  }
  else if (val == "Show Top 25") {
    prop_layer_25.addTo(map);
  }
  else {prop_layer.addTo(map);
  };
  console.log(prop_layer_100);
  console.log(parseInt($('#farMin1').find(":selected").text().charAt(0)));
  console.log(val);
  document.getElementById('property_list').appendChild(makeUL(JSONparse(prop_layer_25).features));
};

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

//When reset filter button is pushed - clears all filters + resets filter buttons
function resetFilters() {
  $("#numProp1").val("all");
  $("#farMin1").val('0');
};
