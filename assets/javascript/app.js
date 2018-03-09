$(document).ready(function() {
    //create topics array to input user inputs
    //create row and col index to track rows and columns
    //create clicked array to track with buttons have already been clicked, to utilize hide feature
    topics = [];
    var rowIndex = 0;
    var colIndex = 0;
    var lastClick;
    var clicked = [];

    //create buttons function
    function createButtons() {
        //empty the buttons container div in HTML
        $('#buttons-container').empty();

        //iterate through each topic in the array and create a button
        for (var i=0; i< topics.length; i++) {
            var button = $("<button>");
            //attach topic-btn class for future calls
            button.addClass("topic-btn btn btn-light");
            //attach a data-name attribute with the topic name for reference in displayGif function
            button.attr("data-name", topics[i]);
            //attach topic name as the button name
            button.text(topics[i]);
            //append these buttons to the buttons container div in HTML
            $('#buttons-container').append(button);
        }
    }

    //function to create the GIFs and append them onto the page in neat rows and columns 
    function displayGif() {
        //push the data-name into the clicked array to track which buttons had been pressed; used for hiding function
        clicked.push($(this).attr("data-name"))

        //set up AJAX call arguments; interested in search query
        var topic = $(this).attr("data-name");  
        console.log(topic);
        var queryURL = "HTTPS://api.giphy.com/v1/gifs/search?q=" + topic + "&api_key=641SVLMQJGCVM4YinHwMvsgdZ3Sd1RJi&limit=10";
        console.log(queryURL);
        
        //track which button was clicked last for reference to function that will allow user to delete the last clicked button and associated GIFs 
        lastClick = $(this).attr("data-name");
        console.log("lastclick="+lastClick)
        
        //hide all the clicked buttons to prevent user from creating redundant GIFs of same topic name
        hideClickedBtn();

        //AJAX call to giphy API
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function(response) {
        console.log(response)
        //save the API JSON object into variable
        var gifResults = response.data;
        
            //create divs and img elements for each GIF; create rows per 4 columns of GIFs; 
            for (var i = 0; i<gifResults.length;i++) {
                //save still version of GIF into variable
                var stillGif = gifResults[i].images.original_still.url;
                //save dynamic version of GIF into variable
                var dynamicGif = gifResults[i].images.original.url;
                //save GIF rating into variable
                var rating = gifResults[i].rating;
                //create img eleement for GIF
                var showGif = $("<img>");   
                //set source; default GIF to still version
                showGif.attr("src", stillGif);
                //attach data-still attribute with url of still version for stop/pause swap function 
                showGif.attr("data-still", stillGif);
                //attach topicGif class for call
                showGif.attr("class", "topicGif img-thumbnail");
                //attach data-dyanmic attribute with url of dynamic version for stop/pause swap function
                showGif.attr("data-dynamic", dynamicGif);
                //attach a data-index to index each GIF
                showGif.attr("data-index", i);

                //create column divs for each GIF; assign unique ID to each GIF
                var gifDivWrap = $("<div>");
                    gifDivWrap.attr("class", "col-md-3 "+topic+"");
                    gifDivWrap.attr("id", topic+"gifDiv"+i);

                //if column index = 0 or 4, create new row
                if (colIndex === 4 || colIndex === 0) {
                    colIndex = 0;
                    console.log('i am colIndex='+colIndex)
                    
                    rowIndex++;
                    //create row divs for every 4 columns; assign rowIndex to each row to track
                    var gifRowWrap = $("<div>");
                        gifRowWrap.attr("class", "row "+topic+"");
                        gifRowWrap.attr("id", "gifRow"+rowIndex);
                        console.log('i am rowIndex='+rowIndex);

                    // not working 
                    // $('#gif-container').find('#gifRow'+rowIndex).append(gifDivWrap);
                    // $('#gifRow'+rowIndex).append(gifDivWrap);
                    
                    //Have to create div row and div col in JS, then append to HTML. Appending the Row first, then trying to append the col div afterwards did not work. 
                    var divBuild = gifRowWrap.append(gifDivWrap);
                    //append to HTML gif-container
                    $('#gif-container').append(divBuild);
                    
                    colIndex++;
                    console.log(colIndex)
                    
                    //append the GIF and rating to each column divs;
                    $('#'+topic+'gifDiv'+i).append(showGif);
                    $('#'+topic+'gifDiv'+i).append("<p> Rating: " + rating + "</p>");
                //if column index is not 0 or 4, keep appending GIF and rating to next column
                } else {

                    $('#gifRow'+rowIndex).append(gifDivWrap);
                    colIndex++;
                    console.log('colindex is='+colIndex)
                    $('#'+topic+'gifDiv'+i).append(showGif);
                    $('#'+topic+'gifDiv'+i).append("<p> Rating: " + rating + "</p>"); 
                }     
            }  
            //reset column index to 0 after all 10 GIFs are appended so that the next call will return the next set of 10 GIFs starting on a new row
            colIndex = 0;
            console.log("return colIndex to "+colIndex)
        })
    }

    //take user input from form and create buttons
    $("#add-topic").on("click", function(event) {
        //prevent the submit from refreshing the page
        event.preventDefault();
        //take user input value and save to variable upon submit
        var topic = $('#topic-input').val().trim();
        //search the topics array to see whether the topic has already been entered
        var search = topics.indexOf(topic);

        //if the topic has already been submitted, display error message; return form to empty; delete that last input from array; and end function
        if (search !== -1) {
            $('#messageDiv').text("You have already created this topic! Try another.");
            $('#topic-input').val('');
            setTimeout(clearMessage, 5000);
            topics.pop();
            return;
        }
        
        //push the user input into the topics array
        topics.push(topic);
        console.log("topics"+topics)
        
        console.log("search="+search)
        //if the topic is a blank, or a null, display alarm mesage, delete that last input, and end function
        if (topic === null || topic === "") {
            $('#messageDiv').text("Please input a topic!");
            setTimeout(clearMessage, 5000);
            console.log(topics)
            //removes the last item in the array
            topics.pop();
            return;
        //if it is a valid input, create the button. Since all the buttons are regenerated each round, re-hide any buttons with topics that have been previously clicked
        } else {    
        createButtons();
        hideClickedBtn();
        //Clear the input field box after each submit
        $('#topic-input').val('');
        }
    })

    //allow user to delete the very last generation of button and GIFs. lastClick is used in the case the user clicks buttons in a different order from which they were initially generated, so always identifies the very last clicked topic
    $('#delete-topic').on("click", function(event) {
        //prevent the submit from refreshing the page
        event.preventDefault();
        //lastClick tracks the data-name of the very last clicked button; search the topics array to see whether this topic exists
        var deletedTopic = topics.indexOf(lastClick);
        //if the topic does exist in array, remove all div's with the class of that topic name and remove the topic from topics array
        if (deletedTopic !== -1) {
            $('.'+lastClick+'').remove();
            //function to remove the topic from the array
            arraySplice();
            console.log("remaining in topics array="+topics)
            createButtons();
            hideClickedBtn();
        //if the topic does not exist in the array, it has already been deleted; display error message
        } else {
            $('#messageDiv').text("You have already removed the last topic. Create another topic or click an existing button!");
            setTimeout(clearMessage, 5000);
        }
    
    })

    //function to remove the specific topic from topics array
    function arraySplice() {
        console.log("i am in arraySplice and lastclick is="+lastClick)
        var index = topics.indexOf(lastClick);
        var clickedIndex = clicked.indexOf(lastClick)
        console.log("clicked array before:"+clicked)
        //if the lastClicked topic is found in topics array, splice it out to update
        if (index !== -1) {
            topics.splice(index, 1);
        }
        //if the lastClicked topic is found in the clicked array, splice it out to update
        if (clickedIndex !== -1) {
            clicked.splice(clickedIndex, 1)
            console.log("clicked array after:"+clicked)
        }
    }

    //function to clear the form after every input
    function clearMessage() {
        $('#messageDiv').text("");
    }

    //clear all the buttons and GIFs from page
    $('#clearBtns').on("click", function(event) {
        //prevent the submit from refreshing the page
        event.preventDefault();
        $('.topic-btn').remove();
        $('#gif-container').empty();
        //reset the topics and clicked arrays
        topics = [];
        clicked = [];
    });

    //function to hide all clicked buttons from clicked array
    function hideClickedBtn() {
        for (var i=0; i<clicked.length; i++) {
            $("button[data-name=\""+clicked[i]+"\"]").prop("disabled", true);
        }
    }

    //initiate the displayGif function upon clicking each dynamically created button
    $(document).on("click", ".topic-btn", displayGif);  

    //Make the GIF stop and start on click 
    $(document).on("click", ".topicGif", function(event) {
        var placeHolder = $(this).attr("data-index");
        console.log(placeHolder);
        var stillGifURL = $(this).attr("data-still");
        console.log(stillGifURL);
        var dynamicGifURL = $(this).attr("data-dynamic");
        console.log(dynamicGifURL);

        //if the source is set to the still GIF url, swap it to the dynamic url. If the source is set to the dyanmic GIF url, swap it to the still url. Still and dynamic URLs are saved as attributes data-still and data-dynamic in each GIF
        if ($(this).attr("src") === stillGifURL) {
            $(this).attr("src", dynamicGifURL)
        } else if ($(this).attr("src") === dynamicGifURL) {
            $(this).attr("src", stillGifURL)
        }
    })


})