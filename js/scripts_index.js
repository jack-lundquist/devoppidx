//map variable
var map = L.map('my-map').setView([40.692874,-73.939018], 10);

//basemap
L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png', {
	attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
	subdomains: 'abcd',
 maxZoom: 19
}).addTo(map);

function getColor(d) {
    return d > 120 ? '#005a32' :
           d > 80  ? '#238443' :
           d > 40  ? '#41ab5d' :
           d > 0  ? '#78c679' :
           d > -40   ? '#addd8e' :
           d > -80   ? '#d9f0a3' :
           d > -120   ? '#f7fcb9' :
                      '#ffffe5';
}



function onEachFeature(feature, layer) {
    // does this feature have a property named popupContent?
    if (feature.properties && feature.properties.Address) {
        layer.bindPopup("Address: " + feature.properties.Address + "\n" + "BBL: " + feature.properties.BBL);
    }
    feature.properties.idx = 0
}

function style(feature) {
    return {
      fillColor: getColor(feature.properties.idx),
      weight: 0,
      opacity: 0,
      color: "lightgrey",
      // dashArray: '3',
      fillOpacity: 1
    };
};

var prop_layer = L.geoJSON(data_norm, {
    onEachFeature: onEachFeature,
    style: {
      fillColor: '#78c679',
      weight: 0,
      opacity: 0,
      color: "lightgrey",
      // dashArray: '3',
      fillOpacity: 1
    }
});

prop_layer.addTo(map);


$('li').mouseover(function() {
var text = $(this).text()
console.log('You moused over ' + text);
});


$('#updateBox').click(function() {
  var idx = [$("#vacancy").val(), $("#shortTrip").val(), $("#highRent").val(), $("#renters").val(),
  $("#owners").val(), $("#recentMove").val(), $("#unemployed").val(), $("#white").val(),
  $("#poverty").val(), $("#elderly").val(), $("#children").val(), $("#highIncome").val(),
  $("#hsMinus").val(), $("#collegePlus").val(), $("#oldHousing").val(), $("#newHousing").val()];
  prop_layer.eachLayer(function(layer, feature) {
		if (layer.feature.properties && layer.feature.properties.Address) {
        layer.bindPopup(layer.feature.properties.Address);
    };
		var score = parseFloat(((parseFloat(idx[15])*parseFloat(layer.feature.properties.pct_builtafter2010_norm)) +
    (parseFloat(idx[14])*parseFloat(layer.feature.properties.pct_builtbefore1940_norm)) +
    (parseFloat(idx[13])*parseFloat(layer.feature.properties.pct_withcollegeplus_norm)) +
    (parseFloat(idx[12])*parseFloat(layer.feature.properties.pct_withoutHS_norm)) +
    (parseFloat(idx[11])*parseFloat(layer.feature.properties.pct_HHincomegreater100k_norm)) +
    (parseFloat(idx[10])*parseFloat(layer.feature.properties.pct_children_norm)) +
    (parseFloat(idx[9])*parseFloat(layer.feature.properties.pct_olderthan65_norm)) +
    (parseFloat(idx[8])*parseFloat(layer.feature.properties.pct_inPoverty_norm)) +
    (parseFloat(idx[7])*parseFloat(layer.feature.properties.pct_white_norm)) +
    (parseFloat(idx[6])*parseFloat(layer.feature.properties.pct_unemployed_norm)) +
    (parseFloat(idx[5])*parseFloat(layer.feature.properties.pct_movedin_2010pct_movedin_2010orlater_norm)) +
    (parseFloat(idx[4])*parseFloat(layer.feature.properties.pct_ownership_norm)) +
    (parseFloat(idx[3])*parseFloat(layer.feature.properties.pct_renters_norm)) +
    (parseFloat(idx[2])*parseFloat(layer.feature.properties.pct_rent_2000pct_rent_2000plus_norm)) +
    (parseFloat(idx[1])*parseFloat(layer.feature.properties.pct_traveltime_under30mins_norm)) +
    (parseFloat(idx[0])*parseFloat(layer.feature.properties.pct_vacantunits_norm))));
    layer.feature.properties.idx = score;
		layer.feature.properties.color = getColor(score);
		console.log(score);
		console.log(idx);
		layer.setStyle({
			fillColor: layer.feature.properties.color,
      weight: 0,
      opacity: 0,
      color: "lightgrey",
      // dashArray: '3',
      fillOpacity: 1
		});
  });
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
