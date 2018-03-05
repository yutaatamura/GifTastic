$(document).ready(function() {

    topics = [];

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
            var stillGif = gifResults[i].images.fixed_height_small_still.url;
            var dyanmicGif = gifResults[i].images.fixed_height_small.url;
            var rating = gifResults[i].rating;
            var showGif = $("<img>");   
            showGif.attr("src", stillGif);
            showGif.attr("data-gif", dynamicGif)
            $('#gif-container').append(showGif);
            $('#gif-container').append("<p> Rating: " + rating + "</p>");
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