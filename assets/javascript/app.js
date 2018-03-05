$(document).ready(function() {

topics = [
    "raccoons",
    "cats",
    "corgi"
];

function createButtons() {
    $('#buttons-container').empty();

    for (var i=0; i< topics.length; i++) {
        var button = $("<button>");
        button.addClass("topic-btn");
        button.attr("data-name", topics[i]);
        button.text(topics[i]);
        $('#buttons-container').append(button);
    }
}


function displayGif() {


var topic = $(this).attr("data-name");
console.log(topic);
var queryURL = "http://api.giphy.com/v1/gifs/search?q=" + topic + "&api_key=641SVLMQJGCVM4YinHwMvsgdZ3Sd1RJi&limit=10";
console.log(queryURL); 

$.ajax({
    url: queryURL,
    method: "GET"
}).then(function(response) {
console.log(response)
var gifResults = response.data;
for (var i = 0; i<gifResults.length;i++) {
    var source = gifResults[i].images.fixed_height_downsampled.url;
    var showGif = $("<img>");
    showGif.attr("src", source);
    $('#gif-container').append(showGif);
}

    
})

}

$("#add-topic").on("click", function(event) {
    event.preventDefault();
    var topic = $('#topic-input').val().trim();
    topics.push(topic);
    createButtons();
})

$(document).on("click", ".topic-btn", displayGif);






})