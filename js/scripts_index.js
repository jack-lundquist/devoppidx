//map variable
var map = L.map('my-map').setView([40.692874,-73.939018], 10);

//basemap
L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png', {
 attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
 subdomains: 'abcd',
 maxZoom: 19
}).addTo(map);

function getColor(d) {
    return d > 120 ? '#800026' :
           d > 80  ? '#BD0026' :
           d > 40  ? '#E31A1C' :
           d > 0  ? '#FC4E2A' :
           d > -40   ? '#FD8D3C' :
           d > -80   ? '#FEB24C' :
           d > -120   ? '#FED976' :
                      '#FFEDA0';
}



function onEachFeature(feature, layer) {
    // does this feature have a property named popupContent?
    if (feature.properties && feature.properties.Address) {
        layer.bindPopup(feature.properties.Address);
    }
    feature.properties.idx = 0
}

function style(feature) {
    return {
        fillColor: getColor(feature.properties.idx),
        weight: .25,
        // opacity: 1,
        color: getColor(feature.properties.idx),
        // dashArray: '3',
        // fillOpacity: 1
    };
}


L.geoJSON(prelim_data_one, {
    onEachFeature: onEachFeature,
    style: style
}).addTo(map);



//random color generator
function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

$('li').mouseover(function() {
var text = $(this).text()
console.log('You moused over ' + text);
});

function getMax(arr, prop) {
    var max;
    for (var i=0 ; i<arr.length ; i++) {
        if (!max || parseInt(arr[i][prop]) > parseInt(max[prop]))
            max = arr[i];
    }
    return max;
}

function getMin(arr, prop) {
    var min;
    for (var i=0 ; i<arr.length ; i++) {
        if (!min || parseInt(arr[i][prop]) < parseInt(min[prop]))
            min = arr[i];
    }
    return min;
}

function minMaxNorm(min, max, val) {
  norm = (val - min) / (max - min)
  return norm
}

var vacancyMin = getMin("prelim_data_one", 'vacancy');
var vacancyMax = getMax("prelim_data_one", 'vacancy');
var tripMin = getMin("prelim_data_one", 'shortTrip');
var tripMax = getMax("prelim_data_one", 'shortTrip');
var highRentMin = getMin("prelim_data_one", 'highRent');
var highRentMax = getMax("prelim_data_one", 'highRent');
var renterMin = getMin("prelim_data_one", 'renter');
var renterMax = getMax("prelim_data_one", 'renter');
var ownerMin = getMin("prelim_data_one", 'owners');
var ownerMax = getMax("prelim_data_one", 'owners');
var recentMoveMin = getMin("prelim_data_one", 'recentMove');
var recentMoveMax = getMax("prelim_data_one", 'recentMove');
var unemployedMin = getMin("prelim_data_one", 'unemployed');
var unemployedMax = getMax("prelim_data_one", 'unemployed');
var whiteMin = getMin("prelim_data_one", 'white');
var whiteMax = getMax("prelim_data_one", 'white');
var povertyMin = getMin("prelim_data_one", 'poverty');
var povertyMax = getMax("prelim_data_one", 'poverty');
var elderlyMin = getMin("prelim_data_one", 'elderly');
var elderlyMax = getMax("prelim_data_one", 'elderly');
var childrenMin = getMin("prelim_data_one", 'children');
var childrenMax = getMax("prelim_data_one", 'children');
var highIncomeMin = getMin("prelim_data_one", 'highIncome');
var highIncomeMax = getMax("prelim_data_one", 'highIncome');
var hsMinusMin = getMin("prelim_data_one", 'hsMinus');
var hsMinusMax = getMax("prelim_data_one", 'hsMinus');
var collegePlusMin = getMin("prelim_data_one", 'collegePlus');
var collegePlusMax = getMax("prelim_data_one", 'collegePlus');
var oldHousingMin = getMin("prelim_data_one", 'renter');
var oldHousingMax = getMax("prelim_data_one", 'renter');
var newHousingMin = getMin("prelim_data_one", 'renter');
var newHousingMax = getMax("prelim_data_one", 'renter');

$('#updateBox').click(function() {
  var idx = [$("#vacancy").val(), $("#shortTrip").val(), $("#highRent").val(), $("#renter").val(),
  $("#owners").val(), $("#recentMove").val(), $("#unemployed").val(), $("#white").val(),
  $("#poverty").val(), $("#elderly").val(), $("#children").val(), $("#highIncome").val(),
  $("#hsMinus").val(), $("#collegePlus").val(), $("#oldHousing").val(), $("#newHousing").val()];
  // L.geoJSON.clearLayers();
  function onEachFeature_fun(feature, layer) {
    var score = (idx[15]*minMaxNorm(newHousingMin, newHousingMax, feature.properties.pct_builtafter2010) +
    idx[14]*minMaxNorm(oldHousingMin, oldHousingMax, feature.properties.pct_builtbefore1940) +
    idx[13]*minMaxNorm(collegePlusMin, collegePlusMax, feature.properties.pct_withcollegeplus) +
    idx[12]*minMaxNorm(hsMinusMin, hsMinusMax, feature.properties.pct_withoutHS) +
    idx[11]*minMaxNorm(highIncomeMin, highIncomeMax, feature.properties.pct_HHincomegreater100k) +
    idx[10]*minMaxNorm(childrenMin, childrenMax, feature.properties.pct_children) +
    idx[9]*minMaxNorm(elderlyMin, elderlyMax, feature.properties.pct_olderthan65) +
    idx[8]*minMaxNorm(povertyMin, povertyMax, (1-feature.properties.pct_notinpoverty)) +
    idx[7]*minMaxNorm(whiteMin, whiteMax, feature.properties.pct_white) +
    idx[6]*minMaxNorm(unemployedMin, unemployedMax, feature.properties.pct_unemployed) +
    idx[5]*minMaxNorm(recentMoveMin, recentMoveMax, feature.properties.pct_movedin_2010orlater) +
    idx[4]*minMaxNorm(ownerMin, ownerMax, feature.properties.pct_ownership) +
    idx[3]*minMaxNorm(renterMin, renterMax, feature.properties.pct_renters) +
    idx[2]*minMaxNorm(highRentMin, highRentMax, feature.properties.pct_rent_2000plus) +
    idx[1]*minMaxNorm(tripMin, tripMax, feature.properties.pct_traveltime_under30mins) +
    idx[0]*minMaxNorm(vacancyMin, vacancyMax, feature.properties.pct_vacantunits));
    feature.properties.idx = score
  };
  function style(feature) {
      return {
          fillColor: getColor(feature.properties.idx),
          weight: 2,
          opacity: 1,
          color: 'white',
          dashArray: '3',
          fillOpacity: 0.7
      };
  };
  L.geoJSON(prelim_data_one, {
      onEachFeature: onEachFeature_fun,
      style: style
  }).addTo(map);
})


// var sliderRed = document.getElementById("red");
// var outputRed = document.getElementById("redval");
// outputRed.innerHTML = sliderRed.value;
//
// sliderRed.oninput = function() {
//   outputRed.innerHTML = this.value;
// }
//
// var sliderGreen = document.getElementById("green");
// var outputGreen = document.getElementById("greenval");
// outputGreen.innerHTML = sliderGreen.value;
//
// sliderGreen.oninput = function() {
//   outputGreen.innerHTML = this.value;
// }
//
// var sliderBlue = document.getElementById("blue");
// var outputBlue = document.getElementById("blueval");
// outputBlue.innerHTML = sliderBlue.value;
//
// sliderBlue.oninput = function() {
//   outputBlue.innerHTML = this.value;
// }
