/*
 * Create a list that holds all of your cards

 */
  funRestart();
 let deck = $('.deck');
 let cards= [];
 let listOfOpenCards = [];
 let countMatchPairCards = 0;
 let 

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
}

restart.on('click', funRestart);


/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

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

function display () {
  if ($(this).hasClass('open show')){
    return;
  } else {
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

function comparison (element) {
  if (listOfOpenCards.length > 1) {
    let className2 = element.children().attr('class').split(' ')[1];
    let className1 = listOfOpenCards[0].children().attr('class').split(' ')[1];
    if (className2 === className1) {
      listOfOpenCards[0].removeClass('open show').addClass('match');
      listOfOpenCards[1].removeClass('open show').addClass('match');
      listOfOpenCards = [];
      countMatchPairCards = countMatchPairCards + 1;
      if (count === 8) {
      $('.container').remove();

      }

    } else {
        deck.off( "click", 'li', display);
        setTimeout(wrongMatch, 1000);

    }
  }
}

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
