// $(window).on('load',function(){
//         $('#useModal').modal('show');
//     });

//map variable
var map = L.map('my-map', {scrollWheelZoom:false}).setView([40.692874,-73.939018], 11);

//basemap
L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png', {
	attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
	subdomains: 'abcd',
	maxZoom: 19
}).addTo(map);

function getColor(d) {
    return d > 15 ? '#4FDE02' :
           d > 10  ? '#83E002' :
           d > 5  ? '#B8E202' :
           d > 0  ? '#E4D902' :
           d > -5   ? '#E6A603' :
           d > -10   ? '#E87203' :
           d > -15   ? '#EA3E03' :
                      '#EC0803';
}


function onEachFeature(feature, layer) {
	scores = [];
	var idx = [$("#vacancy").val(), $("#shortTrip").val(), $("#highRent").val(), $("#renters").val(),
	$("#owners").val(), $("#recentMove").val(), $("#unemployed").val(), $("#white").val(),
	$("#poverty").val(), $("#elderly").val(), $("#children").val(), $("#highIncome").val(),
	$("#hsMinus").val(), $("#collegePlus").val(), $("#oldHousing").val(), $("#newHousing").val()];
	for (var i = 0; i < idx.length; i++) {
		if(idx[i] > 10) {idx[i] == 10; alert('Please choose values <= 10! Value changed to 10 in index calculation.')};
		if(idx[i] < -10) {idx[i] == -10; alert('Please choose values => -10! Value changed to -10 in index calculation.')}
	}


		// does this feature have a property named popupContent?
    if (feature.properties && feature.properties.Address) {
        layer.bindPopup("Address: " + feature.properties.Address + "\n" + "BBL: " + feature.properties.BBL);
    }
    feature.properties.idx = 0
		features = [layer.feature.properties.pct_vacantunits_norm, layer.feature.properties.pct_traveltime_under30mins_norm,
		layer.feature.properties.pct_rent_2000plus_norm, layer.feature.properties.pct_renters_norm,
		layer.feature.properties.pct_ownership_norm, layer.feature.properties.pct_movedin_2010orlater_norm,
		layer.feature.properties.pct_unemployed_norm, layer.feature.properties.pct_white_norm,
		layer.feature.properties.pct_inPoverty_norm, layer.feature.properties.pct_olderthan65_norm,
		(1-layer.feature.properties.pct_olderthan18_norm), layer.feature.properties.pct_HHincomegreater100k_norm,
		layer.feature.properties.pct_withoutHS_norm, layer.feature.properties.pct_withcollegeplus_norm,
		layer.feature.properties.pct_builtbefore1940_norm, layer.feature.properties.pct_builtafter2010_norm];
		var score = 0;
		for(var i=0; i< idx.length; i++) {
    	score += idx[i]*features[i];
				}
    layer.feature.properties.idx = score;
		layer.feature.properties.color = getColor(score);
		if (layer.feature.properties && layer.feature.properties.Address) {
        layer.bindPopup("Address: " + layer.feature.properties.Address + "\n" + "BBL: " + layer.feature.properties.BBL
			+ "\n" + "Index Score: " + layer.feature.properties.idx);
    };

		layer.setStyle({
			fillColor: layer.feature.properties.color,
      weight: 0,
      opacity: 0,
      color: "lightgrey",
      // dashArray: '3',
      fillOpacity: 1
		});
}

var prop_layer = L.geoJSON(data_norm, {
    onEachFeature: onEachFeature,
});

prop_layer.addTo(map);

var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [16, 14, 9, 4, -4, -9, -14, -16],
        labels = ['Greater than 15', '10 to 15', '5 to 10', '0 to 5', "-5 to 0",
				 "-10 to -5", '-15 to -10', 'Less than -15'];
		div.innerHTML = '<div><b>Legend</b></div>';

    // loop through our density intervals and generate a label with a colored square for each interval
		for(var i=0; i <grades.length; i++){
                    div.innerHTML+='<i style="background:'+getColor(grades[i])+'">&nbsp;</i>&nbsp;&nbsp;'
                    +labels[i]+'<br/>';
    }

    return div;
};

legend.addTo(map);


function updateMap() {
	scores = []; //define an array to store coordinates
  var idx = [$("#vacancy").val(), $("#shortTrip").val(), $("#highRent").val(), $("#renters").val(),
  $("#owners").val(), $("#recentMove").val(), $("#unemployed").val(), $("#white").val(),
  $("#poverty").val(), $("#elderly").val(), $("#children").val(), $("#highIncome").val(),
  $("#hsMinus").val(), $("#collegePlus").val(), $("#oldHousing").val(), $("#newHousing").val()];
	for (var i = 0; i < idx.length; i++) {
    if(idx[i] > 10) {idx[i] == 10; alert('Please choose values <= 10! Value changed to 10 in index calculation.')};
		if(idx[i] < -10) {idx[i] == -10; alert('Please choose values => -10! Value changed to -10 in index calculation.')}
    //Do something
	}
  prop_layer.eachLayer(function(layer, feature) {
		features = [layer.feature.properties.pct_vacantunits_norm, layer.feature.properties.pct_traveltime_under30mins_norm,
		layer.feature.properties.pct_rent_2000plus_norm, layer.feature.properties.pct_renters_norm,
		layer.feature.properties.pct_ownership_norm, layer.feature.properties.pct_movedin_2010orlater_norm,
		layer.feature.properties.pct_unemployed_norm, layer.feature.properties.pct_white_norm,
		layer.feature.properties.pct_inPoverty_norm, layer.feature.properties.pct_olderthan65_norm,
		(1-layer.feature.properties.pct_olderthan18_norm), layer.feature.properties.pct_HHincomegreater100k_norm,
		layer.feature.properties.pct_withoutHS_norm, layer.feature.properties.pct_withcollegeplus_norm,
		layer.feature.properties.pct_builtbefore1940_norm, layer.feature.properties.pct_builtafter2010_norm];
		var score = 0;
		for(var i=0; i< idx.length; i++) {
    	score += idx[i]*features[i];
				}
    layer.feature.properties.idx = score;
		layer.feature.properties.color = getColor(score);
		if (layer.feature.properties && layer.feature.properties.Address) {
        layer.bindPopup("Address: " + layer.feature.properties.Address + "\n" + "BBL: " + layer.feature.properties.BBL
			+ "\n" + "Index Score: " + layer.feature.properties.idx);
    };

		layer.setStyle({
			fillColor: layer.feature.properties.color,
      weight: 0,
      opacity: 0,
      color: "lightgrey",
      // dashArray: '3',
      fillOpacity: 1
		});
		scores.push(layer.feature.properties.idx);
  });
	var scores_addresses = prop_layer.features.map(function(feature) {
  return [feature.properties.idx, feature.properties.Address];
	});
	console.log(scores_addresses);
	// var top25_1 = prop_layer.idx.sort(function(a, b) {
  //   return b - a;
	// }).slice(0,25);
	// console.log(top25);
	var top25_2 = data_norm.sort(function(a, b) { return a.idx < b.idx ? 1 : -1; }).slice(0, 25);
	console.log(top25_2);
};

function resetFilters() {
	updateMap();
	$( "#top25" ).prop( "checked", false );
	$( "#top50" ).prop( "checked", false );
	$( "#top100" ).prop( "checked", false );
	$( "#allTop" ).prop( "checked", true );
	$('input[name=farInput').val('');
	$('input[name=farInput').placeholder("Choose a Minimum Floor Area Ratio (FAR)");
};

function applyFilters() {
	if($('#top25').checked) {
		var propCount = 25;
	}
	else if($('#top50').checked) {
		var propCount = 50;
	}
	else if($('#top100').checked) {
		var propCount = 100;
	}
	else{updateMap();};
	if(propCount > 100){
		updateMap();
	}
}
