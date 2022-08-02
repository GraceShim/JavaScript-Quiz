// Declared variables
var highScore = document.querySelector("#highScore");
var clear = document.querySelector("#clear");

var currentQuestion = 0;
var initialsInput = $("#initials-text");
var initialsArray = [];
var secondsLeft = (questions.length) * 15;
var xInterval = null;
var newInitials = null;

// Once the user clicks "start quiz", timer will start.

$(".start").click(function () {
  setTimer();
  $(".start").hide();
  $(".quiz").show();
  showQuestion();
});

// start up timer function.

function setTimer() {
  xInterval = setInterval(function () {
    $("#timer").html(secondsLeft);
    secondsLeft--;
    if (secondsLeft <= 0) {
      clearInterval(xInterval);
      timeUp();
    }
  }, 1000);
}

// Clicking on the start quiz button hides the start page and shows the quiz page while firing the showQuestion() function

function showQuestion() {
  var choices = questions[currentQuestion].choices;
  var question = questions[currentQuestion].title;
  $(".quiz h2").text(question);
  $(".quiz ul").html("");
  for (var i = 0; i < parseInt(choices.length); i++) {
    var show = questions[currentQuestion].choices[i];
    $(".quiz ul").append(`<li class="button-select" id="${i}">${show}</li>`);
  }

  // Comparing user's guests with correct answer with click if/else statement. Feedback is appended and styled.

  $("li").click(function () {
    var guessid = $(this).attr("id");
    var guess = questions[currentQuestion].choices[guessid];
    var answer = questions[currentQuestion].answer;

    // Check for correct answer.

    if (answer === guess) {
      $(".feedback").fadeIn(200);
      $(".feedback")
        .html("<h4>Correct!<h4>")
        .fadeOut(900);
      $(".feedback").css({
        color: "green",
        "text-align": "center",
        "border-top": "lightgrey",
        "border-top-width": "1px",
        "border-top-style": "solid"
      });
      currentQuestion++;
      showScorePage();

    } else {
      $(".feedback").fadeIn(200);
      $(".feedback")
        .html("<h4>Wrong!<h4>")
        .fadeOut(900);
      $(".feedback").css({
        color: "red",
        "text-align": "center",
        "border-top": "grey",
        "border-top-width": "1px",
        "border-top-style": "solid"
      });

       // For each wrong submission, timer and score will reduces by 10 seconds.

      secondsLeft = secondsLeft -= 10;
      currentQuestion++;
      showScorePage();
    }
  });
}

// Timer changes feature as user answers questions or does not answer the question in a timely manner.

function showScorePage() {
  if (currentQuestion < questions.length) {
    showQuestion();
  } else {
    $("#timer").remove();
    $(".quiz").hide();
    $(".scoreContainer").show();
    $("#scoreNumber").append(secondsLeft);
    clearInterval(xInterval);
  }
}

// While appending remaining time in seconds to the resulted score of the user.

function timeUp() {
  $("#timer").text("expired!");
  $(".quiz").hide();
  $(".scoreContainer").show();
  $("#scoreNumber").append(secondsLeft);
  clearInterval(xInterval);
}

// Three local storage functions start with on-click #submit-initials button

$("#submit-initials").click(function(e) {
  e.preventDefault();
  loadScores();
  saveScores();
  showScores();
  highScoresPage();
});

// Save every new input of user's initials and resulted score. Push that info to an array. Stringify array's content to save to local storage.

function saveScores() {
  var scoreName = initialsInput.val();
  var highScores = scoreName + " : " + secondsLeft;
  initialsArray.push(highScores);

  // + add sort method to the array to show higher score first

  initialsArray.sort(function(a, b){return b-a}); 
  localStorage.setItem("listOfItems", JSON.stringify(initialsArray));
}

// Get stored in local storage info and parse it back into an object format (from string). 

function loadScores() {
  var savedScores = localStorage.getItem("listOfItems");
  var allScores = JSON.parse(savedScores);

  // If score were retrieved from local storage we need to update initialsArray to it.
  
  if (allScores != null) {
    initialsArray = allScores;
  }
}

// For each new result submitted, it will create a new line and append that to ordered list on the highscore page.

function showScores() {
  for (i = 0; i < initialsArray.length; i++) {
    newInitials = $("<li></li>").append(initialsArray[i]);
    $("#scoreList").append(newInitials);    
  }
}

// After all 3 local storage functions run show the new div.

function highScoresPage() {
  $(".highScorePage").show();
  $("#initialsArray").hide();
}

// Ability to check highscores by implementing click function to highscore page.

$("#view-highscores").click(function(){
  $(".highScorePage").toggle();
});

// Functions for to clear and reload once "try-again" is clicked.

$("#go-back").click(function () {
  window.location.reload();
});

$("#clear").click(function (e) {
  e.preventDefault();
  $("#scoreList").css('display', 'none');
  localStorage.clear();
});
