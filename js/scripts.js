//listen for click and change color
$(".headerColorChangeButton").click(function() {
//alert("don't use me!")
var color = getRandomColor();
$("#header").css('background', color);
$('#head_text').text('Header Color: ' + color);
})

//random color generator
function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

var count = 1;

$('.counterIncrementButton').click(function() {
count = count + 1
$('.currentCount').text(count)
})

$('li').mouseover(function() {
var text = $(this).text()
console.log('You moused over ' + text);
})

$('#addNewColor').click(function() {
var r = $("#red").val(); var g = $("#green").val(); var b = $("#blue").val(); $("#body").css("background-color", "rgb(" + r + "," + g +", " + b + ")");
$('.currentColor').text("Background Color: rgb(" + r + "," + g +", " + b + ")");
})

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
