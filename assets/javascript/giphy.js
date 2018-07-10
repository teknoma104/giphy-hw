var existingAnimalButtons = ["dog", "cat", "rabbit", "hamster", "skunk", "goldfish", "bird", "ferret", "turtle", "sugar glider", "chinchilla", "hedeghog", "hermit crab", "gerbil",
    "pgymy goat", "chicken", "capybara", "teacup pig", "serval", "salamander", "frog"];

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
    console.log("clicked");

    $("#animals").empty();

    event.preventDefault();

    var readAnimalName = $(this).attr("animalID");

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
            newDiv.attr("class", "animals");
            var animalIMG = $("<img>");

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

    existingAnimalButtons.push(queryAnimal);

    generateExistingAnimalButtons();
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