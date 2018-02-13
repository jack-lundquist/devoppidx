//map variable
var map = L.map('my-map').setView([40.692874,-73.939018], 10);

//basemap
L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png', {
 attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
 subdomains: 'abcd',
 maxZoom: 19
}).addTo(map);

function onEachFeature(feature, layer) {
    // does this feature have a property named popupContent?
    if (feature.properties && feature.properties.Address) {
        layer.bindPopup(feature.properties.Address);
    }
}

var myStyle = {
    "color": "#ff7800",
};

L.geoJSON(prelim_data_one, {
    onEachFeature: onEachFeature,
    style: myStyle
}).addTo(map);

// prelim_data_one.forEach(function(object) {
//   address= object.Address;
//   marker.bindPopup(address)
// });



// var pizzaData = [
//   {
//     name: 'Chris',
//     pizzaShop: "Ben's Pizza",
//     lat: 40.730376,
//     lon: -74.0008582,
//     school: 'Wagner',
//   },
//   {
//     name: 'Maxwell',
//     pizzaShop: "Joe's",
//     lat: 40.7305876,
//     lon: -74.002141,
//     school: 'Wagner',
//   },
//   {
//     name: 'Paolo',
//     pizzaShop: "John's of Bleeker",
//     lat: 40.725717,
//     lon: -73.991492,
//     school: 'Wagner',
//   },
//   {
//     name: 'Rigel',
//     pizzaShop: "Di Fara",
//     lat: 40.6250156,
//     lon: -73.9659225,
//     school: 'Life',
//   },
//   {
//     name: 'Jack',
//     pizzaShop: "Paulie Gee's",
//     lat: 40.729662,
//     lon: -73.958579,
//     school: 'CUSP',
//   },
//   {
//     name: 'Lisanne',
//     pizzaShop: "ZuriLee",
//     lat: 40.6545,
//     lon: -73.9594,
//     school: 'Life',
//   },
//   {
//     name: 'Niki',
//     pizzaShop: "Pizza Palace",
//     lat: 40.77638,
//     lon: -73.9112052,
//     school: 'Life',
//   },
//   {
//     name: 'Monica',
//     pizzaShop: "Percy's Pizza",
//     lat: 40.72915,
//     lon: -74.001398,
//     school: 'Wagner',
//   },
// ];
//
// //add a marker for each object in array
// pizzaData.forEach(function(object) {
//   var latlon = [object.lat,object.lon];
//   var schoolColor = 'black';
//   if(object.school == 'Wagner') schoolColor = 'purple';
//   if(object.school == 'CUSP') schoolColor = 'green';
//   if(object.school == 'Life') schoolColor = 'orange';
//   var options = {
//     radius: 10,
//     fillColor: schoolColor,
//     weight: 6,
//     stroke: false,
//     fillOpacity: .75,
//   };
//   L.circleMarker(latlon, options).addTo(map)
//       .bindPopup(object.name + " likes to eat at " + object.pizzaShop);
// });
//
// $('#fly_to').click(function() {
//   var randomPizza = pizzaData[(Math.floor(Math.random()*pizzaData.length))];
//   map.flyTo([randomPizza.lat, randomPizza.lon], 20);
// });

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

$('#updateBox').click(function() {
var r = $("#red").val(); var g = $("#green").val(); var b = $("#blue").val();
$('.currentColor').css("background-color", "rgb(" + r + "," + g +", " + b + ")");
if($('#changeBorder').prop('checked')) {
  $('.currentColor').css("border", "0px");
  $('.currentColor').text("Box Color: " + "rgb(" + r + "," + g +", " + b + ")" +
  "\n" + "Border Color: N/A");
} else {
  $('.currentColor').css("border", "25px solid green");
  $('.currentColor').text("Box Color: " + "rgb(" + r + "," + g +", " + b + ")" +
  "\n" + "Border Color: green");
}
});

var sliderRed = document.getElementById("red");
var outputRed = document.getElementById("redval");
outputRed.innerHTML = sliderRed.value;

sliderRed.oninput = function() {
  outputRed.innerHTML = this.value;
}

var sliderGreen = document.getElementById("green");
var outputGreen = document.getElementById("greenval");
outputGreen.innerHTML = sliderGreen.value;

sliderGreen.oninput = function() {
  outputGreen.innerHTML = this.value;
}

var sliderBlue = document.getElementById("blue");
var outputBlue = document.getElementById("blueval");
outputBlue.innerHTML = sliderBlue.value;

sliderBlue.oninput = function() {
  outputBlue.innerHTML = this.value;
}
