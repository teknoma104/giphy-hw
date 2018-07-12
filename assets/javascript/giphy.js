var existingAnimalButtons = ["dog", "cat", "rabbit", "hamster", "skunk", "goldfish", "bird", "ferret", "turtle", "sugar glider", "chinchilla", "hedeghog", "hermit crab", "gerbil",
    "pgymy goat", "chicken", "capybara", "teacup pig", "serval", "salamander", "frog"];

var internalCounter = 0;
var globalAnimal;

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

$(document).on("click", ".animal-button", function () {
    console.log("animal button clicked");

    $("#animals").empty();

    event.preventDefault();

    var readAnimalName = $(this).attr("animalID");

    
    globalAnimal = readAnimalName;
    internalCounter = 10;

    console.log("globalAnimal is: " + globalAnimal);
    console.log("readAnimalName: " + readAnimalName);

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

            console.log("Entering loop");

            var newDiv = $("<div>");
            newDiv.attr("class", "animal-list");
            var animalIMG = $("<img>");

            // var saveButton = $("<button").text("Save GIF").attr("onclick", "save()");

            var saveLink = $("<a>").text("Click here to download image").attr( { href: result.data[x].images.fixed_height.url,  download : globalAnimal+".gif" } );

            // onclick: "this.href = $('.animal-list img:first').attr('src')",

            var title = $("<p>").text("Title: " + result.data[x].title);
            var rating = $("<p>").text("Rating: " + result.data[x].rating);
            // var slug = $("<p>").text("Slug: " + result.data[x].slug);
            var sauce = $("<p>").text("Giphy Source: " + result.data[x].bitly_gif_url);
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
            // newDiv.append(slug);
            newDiv.append(sauce);
            newDiv.append(animalIMG);
            // newDiv.append(saveButton);
            newDiv.append(saveLink);

            $("#animals").append(newDiv);


            console.log(result.data[x].title);
            console.log(result.data[x].rating);
            console.log(result.data[x].slug);
            console.log(result.data[x].source);
            console.log(result.data[x].images.fixed_height.url);
            console.log(result.data[x].images.fixed_height_still.url);
        }
    }).fail(function (err) {
        throw err;
    });
});



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

        for (var x = internalCounter - 1; x < result.data.length; x++) {

            console.log("Entering loop");

            var newDiv = $("<div>");
            newDiv.attr("class", "animals");
            var animalIMG = $("<img>");

            var saveButton = $("<button").text("Save GIF").attr("onclick", "save()");

            var title = $("<p>").text("Title: " + result.data[x].title);
            var rating = $("<p>").text("Rating: " + result.data[x].rating);
            // var slug = $("<p>").text("Slug: " + result.data[x].slug);
            var sauce = $("<p>").text("Giphy Source: " + result.data[x].bitly_gif_url);
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
            // newDiv.append(slug);
            newDiv.append(sauce);
            newDiv.append(animalIMG);
            newDiv.append(saveButton);

            $("#animals").prepend(newDiv);


            console.log(result.data[x].title);
            console.log(result.data[x].rating);
            console.log(result.data[x].slug);
            console.log(result.data[x].source);
            console.log(result.data[x].images.fixed_height.url);
            console.log(result.data[x].images.fixed_height_still.url);
        }

        internalCounter += 10;
    }).fail(function (err) {
        throw err;
    });
});


$("#animals").on("click", ".animal-image", function () {
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

$(document).ready(function () {
    console.log("ready!");
    generateExistingAnimalButtons();

});