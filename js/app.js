

 let deck = $('.deck');
 let cards= [];
 let listOfOpenCards = [];
 let countMatchPairCards = 0;
 let countMove = 0;
 let moves = $('.moves');
 let startDate;
 let endDate;
 let timerOn = false;
 let gameTime;
 let timeCounter = $('<div class="time">minutes + ":" + seconds</div>');
 let mainGameView = $('.container');
 let afterWinningInfo = $(`<div class="div">
   <h1 class="winInfo">Congratulations!You win the game</h1>
   <p></p>
   <div><button type= "submit" class="button">Play again?</button></div>
   </div>`);

  funRestart();

 function initializeDeck () {
   for (i=1; i<=16; i++) {
    cards.push($('.deck li:nth-child(' + i + ')'));
  }
}

initializeDeck();
shuffle(cards);

function addEachCardToHtml() {
  for (i=0; i<cards.length; i++)
  cards[i].appendTo(deck);
}

addEachCardToHtml();

let restart = $('.restart');
function funRestart() {
  $('.deck .card').removeClass('open show match');
  countMove = 0;
  moves.html(countMove);
  $('.stars li:nth-child(1)').show();
  $('.stars li:nth-child(2)').show();
}

restart.on('click', funRestart);

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

function moveCounter () {
    countMove = countMove + 1;
    moves.html(countMove);
    starRating();
  }

function starRating () {
  if (countMove > 22 && countMove <=32) {
    $('.stars li:nth-child(1)').hide();
  } else if (countMove > 32) {
    $('.stars li:nth-child(2)').hide();
  }
}

function formatTimer(min, sec) {
  let result = "";
  if (min >= 10) {
  result = result + min;
} else {
  result = "0" + min;
}
  if (sec >= 10) {
    result = result + ":" + sec;
  } else {
    result = result + ":" + "0" + sec;
  }
  return result;
}


function display () {
  if (timerOn === false){
    timerOn = true;
    startDate = new Date();
  }
  if ($(this).hasClass('open show') || $(this).hasClass('match')) {
    return;
  } else {
  moveCounter();
  $(this).addClass('open show');
  listOfOpenCards.push($(this));
  comparison($(this));
}
}

deck.on('click', 'li', display);

function wrongMatch (){
  listOfOpenCards[0].removeClass('open show');
  listOfOpenCards[1].removeClass('open show');
  listOfOpenCards = [];
  deck.on( "click", 'li', display);
}

function continueGame () {
mainGameView.appendTo('body');
afterWinningInfo.remove();
funRestart ();
deck.on('click', 'li', display);
}

function afterWinning () {
  countMatchPairCards = 0;
  // let p =
  mainGameView.remove();
  afterWinningInfo.appendTo('body');
    $('button').on('click', continueGame);
    }
    // afterWinning();

function comparison (element) {
  if (listOfOpenCards.length > 1) {
    let className2 = element.children().attr('class').split(' ')[1];
    let className1 = listOfOpenCards[0].children().attr('class').split(' ')[1];
    if (className2 === className1) {
      listOfOpenCards[0].removeClass('open show').addClass('match');
      listOfOpenCards[1].removeClass('open show').addClass('match');
      listOfOpenCards = [];
      countMatchPairCards = countMatchPairCards + 1;
      if (countMatchPairCards === 8) {
        afterWinning ();
        endDate = new Date();
        let interval = (endDate - startDate) / 1000;
        let minutes = interval / 60;
        let seconds = interval % 60;
        gameTime = formatTimer(minutes, seconds);
        console.log(gameTime);
      }

    } else {
        deck.off( "click", 'li', display);
        setTimeout(wrongMatch, 1000);

    }
  }
}

// window.location.reload(true);

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */
