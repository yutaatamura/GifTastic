$(document).ready(function() {

    topics = [];
    var rowIndex = 0;
    var colIndex = 0;
    var lastClick;
    var clicked = [];

    function createButtons() {
        $('#buttons-container').empty();

        for (var i=0; i< topics.length; i++) {
            var button = $("<button>");
            button.addClass("topic-btn btn btn-info");
            button.attr("data-name", topics[i]);
            button.text(topics[i]);
            $('#buttons-container').append(button);
        }
    }


    function displayGif() {
        // for (var i=0; i<topics.length; i++) {
        //         console.log("im in")
        //         $("button[data-name=\""+topics[i]+"\"]").prop("disabled", true);
        //     }
        clicked.push($(this).attr("data-name"))
        var topic = $(this).attr("data-name");  
        console.log(topic);
        var queryURL = "http://api.giphy.com/v1/gifs/search?q=" + topic + "&api_key=641SVLMQJGCVM4YinHwMvsgdZ3Sd1RJi&limit=10";
        console.log(queryURL); 
        lastClick = $(this).attr("data-name");
        console.log("lastclick="+lastClick)
        
        hideClickedBtn();

        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function(response) {
        console.log(response)
        var gifResults = response.data;
        
        
            for (var i = 0; i<gifResults.length;i++) {
                var stillGif = gifResults[i].images.original_still.url;
                // fixed_height_small_still.url;
                var dynamicGif = gifResults[i].images.original.url;
                // fixed_height_small.url;
                var rating = gifResults[i].rating;
    
                var showGif = $("<img>");   
                showGif.attr("src", stillGif);
                showGif.attr("data-still", stillGif);
                showGif.attr("class", "topicGif img-thumbnail");
                showGif.attr("data-dynamic", dynamicGif);
                showGif.attr("data-index", i);

                var gifDivWrap = $("<div>");
                gifDivWrap.attr("class", "col-md-3 "+topic+"");
                gifDivWrap.attr("id", topic+"gifDiv"+i);

                if (colIndex === 4 || colIndex === 0) {
                    colIndex = 0;
                    console.log('i am colIndex='+colIndex)
                    // $('#gif-container').append(gifRowWrap);
                    rowIndex++;
                    var gifRowWrap = $("<div>");
                    gifRowWrap.attr("class", "row "+topic+"");
                    gifRowWrap.attr("id", "gifRow"+rowIndex);
                    console.log('i am rowIndex='+rowIndex);

                    // not working 
                    // $('#gif-container').find('#gifRow'+rowIndex).append(gifDivWrap);
                    // $('#gifRow'+rowIndex).append(gifDivWrap);
                    
                    //Have to create div row and div col in JS, then append to HTML. Appending the Row first, then trying to append the col div afterwards did not work. 
                    var kitty = gifRowWrap.append(gifDivWrap);
                    $('#gif-container').append(kitty);
                    
                    colIndex++;
                    console.log(colIndex)
                    
                    //append the gif and rating to the div;
                    $('#'+topic+'gifDiv'+i).append(showGif);
                    $('#'+topic+'gifDiv'+i).append("<p> Rating: " + rating + "</p>");
                } else {

                    $('#gifRow'+rowIndex).append(gifDivWrap);
                    colIndex++;
                    console.log('colindex is='+colIndex)
                    $('#'+topic+'gifDiv'+i).append(showGif);
                    $('#'+topic+'gifDiv'+i).append("<p> Rating: " + rating + "</p>");

                    
                }
                
            }  
            colIndex = 0;
            console.log("return colIndex to "+colIndex)
             
        })
    
    }

    $("#add-topic").on("click", function(event) {
        event.preventDefault();
        var topic = $('#topic-input').val().trim();
        var search = topics.indexOf(topic);

        if (search !== -1) {
            $('#messageDiv').text("You have already created this topic! Try another.");
            $('#topic-input').val('');
            setTimeout(clearMessage, 5000);
            topics.pop();
            return;
        }
        
        topics.push(topic);
        console.log("topics"+topics)
        
        console.log("search="+search)
        if (topic === null || topic === "") {
            $('#messageDiv').text("Please input a topic!");
            setTimeout(clearMessage, 5000);
            console.log(topics)
            //removes the last item in the array
            topics.pop();
            return;
        } else {    
        createButtons();
        hideClickedBtn();
        //Clear the input field box after each submit
        $('#topic-input').val('');
        }
    })

    $('#delete-topic').on("click", function(event) {
        event.preventDefault();
        var deletedTopic = topics.indexOf(lastClick);
        if (deletedTopic !== -1) {
            $('.'+lastClick+'').remove();
            arraySplice();
            console.log("remaining in topics array="+topics)
            createButtons();
            hideClickedBtn();
        } else {
            $('#messageDiv').text("You have already removed the last topic. Create another topic or click an existing button!");
            setTimeout(clearMessage, 5000);
        }
    
    })

    function arraySplice() {
        console.log("i am in arraySplice and lastclick is="+lastClick)
        var index = topics.indexOf(lastClick);
        var clickedIndex = clicked.indexOf(lastClick)
        console.log("clicked array before:"+clicked)
        if (index !== -1) {
            topics.splice(index, 1);
        }
        if (clickedIndex !== -1) {
            clicked.splice(clickedIndex, 1)
            console.log("clicked array after:"+clicked)
        }
    }

    function clearMessage() {
        $('#messageDiv').text("");
    }

    $('#clearBtns').on("click", function(event) {
        event.preventDefault();
        $('.topic-btn').remove();
        $('#gif-container').empty();
        topics = [];
        clicked = [];
    });

    function hideClickedBtn() {
        for (var i=0; i<clicked.length; i++) {
            $("button[data-name=\""+clicked[i]+"\"]").prop("disabled", true);
        }
    }

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