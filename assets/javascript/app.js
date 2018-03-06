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
        
        var rowIndex = 0;
        var colIndex = 0;
            for (var i = 0; i<gifResults.length;i++) {
                var stillGif = gifResults[i].images.fixed_height_small_still.url;
                var dynamicGif = gifResults[i].images.fixed_height_small.url;
                var rating = gifResults[i].rating;
    
                
                
    
                var showGif = $("<img>");   
                showGif.attr("src", stillGif);
                showGif.attr("data-still", stillGif);
                showGif.attr("class", "topicGif img-thumbnail");
                showGif.attr("data-dynamic", dynamicGif);
                showGif.attr("data-index", i);
            
                if (colIndex === 4 || colIndex === 0) {
                    colIndex === 0;
                    console.log('i am colIndex='+colIndex)
                    $('#gif-container').append(gifRowWrap);
                    
                    var gifRowWrap = $("<div>");
                    gifRowWrap.attr("class", "row");
                    gifRowWrap.attr("id", "gifRow"+rowIndex);
                    console.log('i am rowIndex='+rowIndex)
                    $('#gifRow'+rowIndex).append(gifDivWrap);
                    console.log('i appended the div')
                    var gifDivWrap = $("<div>");
                    gifDivWrap.attr("class", "col-md-3");
                    gifDivWrap.attr("id", "gifDiv"+i);
                    colIndex++;
                    console.log(colIndex)
                    rowIndex++;
                    $('#gifDiv'+i).append(showGif);
                    $('#gifDiv'+i).append("<p> Rating: " + rating + "</p>");
                } else {
                    $('#gifRow'+rowIndex).append(gifDivWrap);
                    colIndex++;
                    console.log('colindex is='+colIndex)
                    $('#gifDiv'+i).append(showGif);
                    $('#gifDiv'+i).append("<p> Rating: " + rating + "</p>");
                }
         
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

//Make the GIF dynamic on click 
    $(document).on("click", ".topicGif", function(event) {
        var placeHolder = $(this).attr("data-index");
        console.log(placeHolder);
        var stillGifURL = $(this).attr("data-still");
        console.log(stillGifURL);
        var dynamicGifURL = $(this).attr("data-dynamic");
        console.log(dynamicGifURL);

        if ($(this).attr("src") === stillGifURL) {
            $(this).attr("src", dynamicGifURL)
        } else if ($(this).attr("src") === dynamicGifURL) {
            $(this).attr("src", stillGifURL)
        }
            
        
    })



})