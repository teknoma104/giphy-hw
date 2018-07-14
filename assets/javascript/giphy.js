// Stores the name of all animals that were preset + new ones the user can/will enter in
var existingAnimalButtons = ["dog", "cat", "rabbit", "hamster", "skunk", "goldfish", "bird", "ferret", "turtle", "sugar glider", "chinchilla", "hedeghog", "hermit crab", "gerbil",
    "pgymy goat", "chicken", "capybara", "teacup pig", "serval", "salamander", "frog"];

// Used to store favorite list of GIFs as an array of objects 
var savedFavorites = JSON.parse(localStorage.getItem("favoriteGIFObject"));

// internalCounter variable is used to help with the add +10 gif button
// since the AJAX query call gets 10 at a time, this counter is used as
// an index to keep pushing the AJAX query to the next data objects
var internalCounter = 0;

// Variable used to keep track of the animal button that was last clicked,
// this is to help facilitate the +10 more gif button so we can pass this
// variable as the query topic in the AJAX call
var globalAnimal;

// Variable used in the favorites area, it is used as a counter+index for each
// favorite gif added to the favorites area
var indexCounter = 0;


// First function that gets called when the document loads
// Using existingAnimalButtons variable, it generates buttons for each animal
// in the array
function generateExistingAnimalButtons() {
    $("#top-row").empty();

    for (var x = 0; x < existingAnimalButtons.length; x++) {
        var animalButtons = $("<button>");

        // animalButtons.addClass("animal-button");
        animalButtons.attr({
            animalID: existingAnimalButtons[x],
            class: "animal-button"
        });
        animalButtons.text(existingAnimalButtons[x]);
        $("#top-row").append(animalButtons);
    }
}


// Function that gets called when an animal button gets clicked at the top of the page
// Whatever animal name is shown on the button, it will display 10 GIFs related to that animal
$(document).on("click", ".animal-button", function () {
    console.log("animal button clicked");

    $("#animals").empty();

    event.preventDefault();

    var readAnimalName = $(this).attr("animalID");

    globalAnimal = readAnimalName;
    internalCounter = 10;

    console.log("globalAnimal is: " + globalAnimal);
    console.log("readAnimalName: " + readAnimalName);

    // Different method of putting together the query URL
    // I saw this method used in the New York Times API example and thought it was much easier to work with
    // because you're not concatenating strings, instead you are just assigning values to different parameters
    // which makes it easier to edit the parameters
    var url = "https://api.giphy.com/v1/gifs/search";
    url += '?' + $.param({
        'api_key': "OlI2yq3pYhsQKi6Vx54oNO0YI17mxE5h",
        'q': readAnimalName,
        'limit': 10
    });
    $.ajax({
        url: url,
        method: 'GET',
    }).done(function (result) {
        console.log(result);
        console.log(result.data.length);

        for (var x = 0; x < result.data.length; x++) {

            console.log("Entering for loop from ajax call");

            var newDiv = $("<div>").attr("class", "animal-list");
            var animalIMG = $("<img>");

            // Used awesomefont icon to represent favoriting an item with a Heart icon that will overlay the GIF in the top left corner
            var favIcon = $("<p>").html("<i class='fas fa-heart'></i>").attr("class", "favicon");

            // var saveButton = $("<button>").text("Save GIF").attr("onclick", "save()");
            // var saveLink = $("<a>").text("Click here to download image").attr( { href: result.data[x].images.fixed_height.url, download : globalAnimal+".gif" } );
            // onclick: "this.href = $('.animal-list img:first').attr('src')",

            var title = $("<p>").text("Title: " + result.data[x].title).attr("class", "title");
            var rating = $("<p>").text("Rating: " + result.data[x].rating).attr("class", "rating");

            var sauceHREF = result.data[x].bitly_gif_url;

            var sauceAnchor = $("<a>").attr({ href: sauceHREF, target: "_blank" }).text(sauceHREF);

            var sauce = $("<p>").text("Giphy Source: ").attr("class", "sauce");
            sauce.append(sauceAnchor);

            var imgStill = result.data[x].images.fixed_height_still.url;
            var imgAnimate = result.data[x].images.fixed_height.url;

            animalIMG.attr({
                "src": imgStill,
                "class": "animal-image",
                "data-still": imgStill,
                "data-animate": imgAnimate,
                "data-state": "still"
            });

            newDiv.append(title);
            newDiv.append(rating);
            newDiv.append(sauce);
            newDiv.append(animalIMG);
            newDiv.append(favIcon);

            $("#animals").append(newDiv);


            console.log(result.data[x].title);
            console.log(result.data[x].rating);
            console.log(result.data[x].source);
            console.log(result.data[x].images.fixed_height.url);
            console.log(result.data[x].images.fixed_height_still.url);
        }
    }).fail(function (err) {
        throw err;
    });
});


// Click listener event for the Submit button
// Takes the value typed in the text box and appends a button to list
// of animal buttons at the top
$(document).on("click", "#addAnimal", function () {
    console.log("clicked");

    event.preventDefault();

    var queryAnimal = $("#animal-input").val().trim();

    console.log("queryAnimal: " + queryAnimal);

    if (queryAnimal === "")
        alert("Empty submit box, please type in a valid animal");
    else {
        existingAnimalButtons.push(queryAnimal);
        generateExistingAnimalButtons();
    }
});

// Function to add 10 more GIFs of the last animal button that was clicked
// uses the internalCounter variable to set the range of query results
$(document).on("click", "#moar", function () {
    console.log("add 10 more gifs clicked");

    event.preventDefault();

    console.log("globalAnimal is: " + globalAnimal);
    console.log("internalCounter is: " + internalCounter);

    var url = "https://api.giphy.com/v1/gifs/search";
    url += '?' + $.param({
        'api_key': "OlI2yq3pYhsQKi6Vx54oNO0YI17mxE5h",
        'q': globalAnimal,
        'limit': internalCounter + 10
    });
    $.ajax({
        url: url,
        method: 'GET',
    }).done(function (result) {
        console.log(result);
        console.log(result.data.length);

        // I used the starting index at internalCounter so we will get the next 10 GIFs that are newer
        for (var x = internalCounter; x < result.data.length; x++) {

            console.log("Entering for loop for adding +10 more gifs");

            var newDiv = $("<div>").attr("class", "animal-list");
            var animalIMG = $("<img>");

            var favIcon = $("<p>").html("<i class='fas fa-heart'></i>").attr("class", "favicon");

            var title = $("<p>").text("Title: " + result.data[x].title).attr("class", "title");
            var rating = $("<p>").text("Rating: " + result.data[x].rating).attr("class", "rating");

            var sauceHREF = result.data[x].bitly_gif_url;

            var sauceAnchor = $("<a>").attr({ href: sauceHREF, target: "_blank" }).text(sauceHREF);

            var sauce = $("<p>").text("Giphy Source: ").attr("class", "sauce");
            sauce.append(sauceAnchor);

            var imgStill = result.data[x].images.fixed_height_still.url;
            var imgAnimate = result.data[x].images.fixed_height.url;

            animalIMG.attr({
                "src": imgStill,
                "class": "animal-image",
                "data-still": imgStill,
                "data-animate": imgAnimate,
                "data-state": "still"
            });

            newDiv.append(title);
            newDiv.append(rating);
            newDiv.append(sauce);
            newDiv.append(animalIMG);
            newDiv.append(favIcon);
            // newDiv.append(saveButton);

            $("#animals").prepend(newDiv);


            console.log(result.data[x].title);
            console.log(result.data[x].rating);
            console.log(result.data[x].source);
            console.log(result.data[x].images.fixed_height.url);
            console.log(result.data[x].images.fixed_height_still.url);
        }
        // Increments internalCounter by 10 for the next time this click function is called
        internalCounter += 10;
    }).fail(function (err) {
        throw err;
    });
});

// Reused the example given from a in-class activity involving pausing/unpausing GIFs
$(document).on("click", ".animal-image", function () {
    // The attr jQuery method allows us to get or set the value of any attribute on our HTML element
    var state = $(this).attr("data-state");
    // If the clicked image's state is still, update its src attribute to what its data-animate value is.
    // Then, set the image's data-state to animate
    // Else set src to the data-still value
    if (state === "still") {
        $(this).attr("src", $(this).attr("data-animate"));
        $(this).attr("data-state", "animate");
    } else {
        $(this).attr("src", $(this).attr("data-still"));
        $(this).attr("data-state", "still");
    }
});

// Bonus Goal of adding a GIF you want to save into Favorites section 
$("#animals").on("click", ".favicon", function () {
    console.log("favorite button clicked");

    // Testing and console.log'ing some new methods I learned about grabbing the nearest tag/object and getting their attribute values
    console.log("trying to get src: " + $(this).closest("div.animal-list").find("img.animal-image").attr("src"));
    console.log("trying to get src: " + $(this).closest('.animal-list').find('img.animal-image').attr('src'));
    console.log("trying to get still: " + $(this).closest('.animal-list').find('img.animal-image').attr('data-still'));
    console.log("trying to get animate: " + $(this).closest('.animal-list').find('img.animal-image').attr('data-animate'));

    var favDiv = $("<div>").attr("class", "fav-animal-list");
    var favIMG = $("<img>");

    // Used the times (X) icon from awesome fonts as the graphic to represent the delete action
    // The icon will be overlayed in the top left corner of the gif
    // it is given an attribute with data-index to help delete the correct favorited gif from the localstorage saved array
    var deleteIcon = $("<p>").html("<i class='fas fa-times'></i>").attr({ class: "deleteicon", "data-index": indexCounter });

    var favSauce = $(this).closest('.animal-list').find('img.animal-image').attr('src');
    var favStill = $(this).closest('.animal-list').find('img.animal-image').attr('data-still');
    var favAnimate = $(this).closest('.animal-list').find('img.animal-image').attr('data-animate');

    savedFavorites.push({ "src": favSauce, "datastill": favStill, "dataanimate": favAnimate });
    console.log(savedFavorites);

    // Put the object into storage
    localStorage.setItem('favoriteGIFObject', JSON.stringify(savedFavorites));

    // Retrieve the object from storage, mostly used for checking the results in console.log in the next line
    var retrievedObject = localStorage.getItem("favoriteGIFObject");
    console.log('retrievedObject: ', JSON.parse(retrievedObject));

    favIMG.attr({
        "src": favSauce,
        "class": "animal-image",
        "data-still": favStill,
        "data-animate": favAnimate,
        "data-state": "still"
    });

    favDiv.append(favIMG);
    favDiv.append(deleteIcon);

    $("#fav-column").prepend(favDiv);

    indexCounter++;

});


// Delete gif function for the favorites section
$("#fav-column").on("click", ".deleteicon", function () {
    console.log("delete icon clicked");

    // Variable grabbing the latest object array in Localstorage first
    var favlist = JSON.parse(localStorage.getItem("favoriteGIFObject"));
    
    // Gets the index # for the gif where the user clicked the red X icon
    var currentIndex = $(this).attr("data-index");

    console.log($(this).attr("data-index"));
    
    // deletes the entire div
    $(this).closest('div').remove();

    // removes same gif that was added as an object in localstorage
    favlist.splice(currentIndex, 1);
    
    // passes the updated local list of objects back into this variable
    savedFavorites = favlist;
    console.log("savedFavorites: " + savedFavorites);

    // then pushes that variable to update the list of objects in localstorage
    localStorage.setItem("favoriteGIFObject", JSON.stringify(favlist));
});

// Trash can functionality that deletes EVERYTHING in the favorites section and clears out localstorage
// Also resets indexCounter which is used for the favorites section
$("#fav-row").on("click", ".fa-trash-alt", function () {
    console.log("trash icon clicked");
    $("#fav-column").empty();
    localStorage.clear();

    indexCounter = 0;
});

// Function used to display whatever GIFs that the user saved as their favorites in the favorites section from data stored in localstorage 
function putOnPage() {

    console.log("putOnPage called");

    // empties out the html
    $("#fav-column").empty(); 

    var insideList = JSON.parse(localStorage.getItem("favoriteGIFObject"));

    // Checks to see if we have any favorites saved in localStorage
    // If we do, then the for loop will function correctly and appends all the gifs to favorites section
    // Otherwise set the local insideList variable to an empty array
    if (!Array.isArray(insideList)) {
        insideList = [];
    }

    // render our insideList todos to the page
    for (var i = 0; i < insideList.length; i++) {
        console.log("loop #" + i);
        console.log(insideList[i].src);
        console.log(insideList[i].dataanimate);
        console.log(insideList[i].datastill);

        console.log("indexCounter: " + indexCounter);

        var favDiv = $("<div>").attr("class", "fav-animal-list");
        var favIMG = $("<img>");

        var deleteIcon = $("<p>").html("<i class='fas fa-times'></i>").attr({ class: "deleteicon", "data-index": indexCounter });

        var favSauce = insideList[i].src;
        var favStill = insideList[i].dataanimate;
        var favAnimate = insideList[i].datastill;

        //   var p = $("<p>").text(insideList[i]);
        //   var b = $("<button class='delete'>").text("x").attr("data-index", i);
        //   p.prepend(b);
        //   $("#todo-list").prepend(p);

        favIMG.attr({
            "src": favSauce,
            "class": "animal-image",
            "data-still": favStill,
            "data-animate": favAnimate,
            "data-state": "still"
        });

        favDiv.append(favIMG);
        favDiv.append(deleteIcon);

        $("#fav-column").prepend(favDiv);

        indexCounter++;
    }
}


$(document).ready(function () {
    console.log("ready!");
    generateExistingAnimalButtons();

    if (!Array.isArray(savedFavorites)) {
        savedFavorites = [];
    }

    putOnPage();


    // Re-using tooltip hover from unit-4 (TMNT) game
    var tooltip = $('#tooltip'),
        offset = {
            x: 20,
            y: 20
        };

    // Mouse hover tooltip 
    $('.fa-trash-alt').hover(function () {
        tooltip.show()
    }, function () {
        tooltip.hide();
    }).mousemove(function (e) {
        tooltip.css({
            top: e.pageY + offset.y,
            left: e.pageX + offset.x
        }).text("Click to empty your favorites.");
    });
});

