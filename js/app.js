const deck = $('.deck');
const cards = [];
const restart = $('.restart');
let listOfOpenCards = [];
let countMatchPairCards = 0;
let countMove = 0;
const moves = $('.moves');
let rating = '0 Stars';
const timer = $('.timer');
let seconds = -1;
let minutes = -1;
let timerOn = false;
let timerTimeOut;
const MOVES_TEXT = ' Moves';
const TIME_TEXT = 'Time ';
let gameTime = TIME_TEXT + '00:00';
const mainGameView = $('.container');
const afterWinningInfo = $(`<div class="win-info">
   <h1>Congratulations! You won the game.</h1>
   <p></p>
   <div class="new-game"><button type= "submit" class="button">Play again?</button></div>
   </div>`);

preparationGame();
// zawiera funkcje uruchamiane na poczatku, po zaladowaniu strony z gra.
function preparationGame() {
  restartGame();
  initializeDeck();
  shuffle(cards);
  addEachCardToHtml();
  restart.on('click', restartGame);
  deck.on('click', 'li', handleClick);
}

// uzupełnia tablice cards kolejnymi dziecmi elementu html-owego <ul>.Kolejne dziecko <ul> dodaje na koniec tablicy cards
function initializeDeck() {
  for (i = 1; i <= 16; i++) {
    cards.push($('.deck li:nth-child(' + i + ')')); //<-- dwa stringi, pomiedzy nimi iterator. !!!
  }
}

// elementy tablicy cards zostaną przeniesione do celu - deck (html <ul>). Nie będą one sklonowane stąd 16 a nie 32 elementy, tylko zostanie zwrócony nowy zestaw <ul> składający się z kolejnych elementów tablicy cards
function addEachCardToHtml() {
  for (i = 0; i < cards.length; i++)
    cards[i].appendTo(deck);
}

// funkcja ta, losowo ustawia karty w tablicy cards, dodaje je do html-a. Tablice listOfOpenCards ustawia na pustą, by zakonczyc działanie funkcji wrongMatch, która uruchamia się po 1 sek.(kiedy ona sie wykonuje w tablicy sa 2 elementy, funkcja restartGame czysci tablice !!nie kumam zapytac!! i chyba automatycznie przerywa działanie funkcji wrongMatch).Przypiasanie zmiennej countMatchPairCards wartosci zero zapobiega ukonczeniu gry z mniejsza iloscia dopasowanych kart. w poprzedniej dopasowalam 3 pary, wciskam restart button i nową gre ukoncze po dopasowaniu 4 par.
function restartGame() {
  shuffle(cards);
  addEachCardToHtml();
  listOfOpenCards = [];
  countMatchPairCards = 0;
  $('.deck .card').removeClass('open show match'); // <-- odwraca karty symbolem w dół
  countMove = 0; //<-- ustawia countMove na zero
  moves.text(countMove + MOVES_TEXT); //<-- przekazuje wartość countMove w tym przypadku 0 do html-a, po restarcie widzimy tam zero
  $('.stars li:nth-child(1)').show(); //<--pokazuje/ustawia wczesniej zakryte gwiazdki
  $('.stars li:nth-child(2)').show(); //<--
  timerOn = false; //<--  w funkcji handleClick ustawiono te zmienna na true i czas dalej biegnie ale od zero bo tu ustawiam go na zero
  gameTime = TIME_TEXT + '00:00'; // <-- przypisanie/ zerowanie timera (tego nie widzisz na stronie)
  seconds = -1;
  minutes = -1;
  timer.text(gameTime); //<--przekazanie tego zerowego timera do html-a(dopiero teraz widzisz 00:00 na stronie)
  clearTimeout(timerTimeOut);
}

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
  var currentIndex = array.length,
    temporaryValue, randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

// funkcja uruchamiana przy kazdym kliknięciu na pole na planszy gry. Najpierw sprawdzany jest warunek logiczny: czy timer jest fałszem. jesli prawda to ustaw timer na prawde i uruchom funkcje timedCount naliczajaca czas. Służy to temu żeby wystartowac timer tylk raz, jezeli kolejny warunek jest prawda ( ten klikniety element posiada klase odkrywajaca symbol i ustawiającą element odkryty lub element ten posiada klase dopasowujaca element) to wtedy nic nie robi. w przeciwnym wypadku uruchamiana jest funkcja moveCounter, kliknietemu elementowi nadana zostaje klasa (open i show / symbol karty zostaje odkryty), zostaje dodany do tablicy listOfOpenCards oraz uruchamiana zostaje funkcja porownujaca ten element.( czy ta funkcja nie powinna byc moveCounter. uruchamiana gdy countMove = 2??)
function handleClick() {
  if (timerOn === false) {
    timerOn = true;
    timedCount();
  }

  if ($(this).hasClass('open show') || $(this).hasClass('match')) { //<-- zabobiega naliczaniu ruchow poprzez klikniecie na ten sam element
    return;
  } else {
    moveCounter();
    $(this).addClass('open show');
    listOfOpenCards.push($(this));
    comparison($(this));
  }
}

// funkcja uruchamiana po kliknieciu na polu gry. Licznik countMove z wartosci 0 zwiekszyl sie o ten jeden klik(kazdy kolejny wiadomo). wartosc tej zmiennej zostaje przekazana do elementu moves html i uruchomiana zostaje finkcja starRating tez po kliku pierwszym. musi tu byc bo to jak sie zachowuje/co zwraca zalezy od ilosci wykonanych ruchow
function moveCounter() {
  countMove += 1;
  moves.text(countMove + MOVES_TEXT);
  starRating();
}

// funkcja  w zależności od spełnienia podanych przypadkow, które to definiują ilości wykonanych kliknięć, zwraca zmienna rating z konkretnym stringiem oraz ukrywa lub nie element html- ikone gwiazdki.
function starRating() {
  if (countMove <= 24) {
    rating = '3 Stars and the title "Badass flipper!"';
  } else if (countMove > 24 && countMove <= 32) {
    $('.stars li:nth-child(1)').hide();
    rating = '2 Stars and the title "Solid spotter!"';
  } else if (countMove > 32) {
    $('.stars li:nth-child(2)').hide();
    rating = '1 Star and the title "Junior clicker!"';
  }
}

// funkcja sprawdza warunek logiczny. jezeli zmienna timerOn jest prawda(a jest bo w funckcji handleClick zostala ustawiona na true) to nalicza sekundy. i jesli reszta z dzielania sumy sekund wynosi 0 to wtedy minuty zaczynaja sie liczyc a sekundy ustawiane sa na 0.( sytuacja startowa 00:00, po kilku sekundach 00:15, warunek( 00:59 --> + 1 sek 01:00,  dalej bedzie 01:01)) i uruchamia funkcje z 1 sekundowym opoznieniem (dlatego na poczatku seconds i minutes = -1 chyba!!), updatuje zmienna gameTime (ktora na biezaco formatuje czas) i ustawia elementowi html-owemu te zmienna.
//Time count funkcjon from here https://stackoverflow.com/questions/6623516/jquery-time-counter
function timedCount() {
  seconds += 1;
  if (seconds % 60 == 0) {
    minutes += 1;
    seconds = 0;
  }
  timerTimeOut = setTimeout(timedCount, 1000);
  gameTime = TIME_TEXT + formatTimer(minutes, seconds); //<-- moge sie tego pozbyc i te zmienna zamienic funkcja z argumentami
  timer.text(gameTime); // wprowadz zmienna do .timer
}

function formatTimer(min, sec) {
  let result = '';
  if (min >= 10) {
    result += min; // <--10
  } else {
    result = '0' + min; //<--05
  }

  result += ':'; //05:

  if (sec >= 10) {
    result += sec; //<--10:10
  } else {
    result = result + '0' + sec; //<--05:02
  }
  return result;
}

function comparison() { //<-- w handleClick mamy ten konkretny klikniety element $(this)
  if (listOfOpenCards.length > 1) {
    let className1 = listOfOpenCards[0].children().attr('class').split(' ')[1]; //<-- split dzieli obiekt string na TABLICE stringow uzywajac separatora spacji (' ') aby okreslic gdzie dokonac podzialu.[1] to drugi element tablicy w tym przypadku 2 klasa elementu.
    let className2 = listOfOpenCards[1].children().attr('class').split(' ')[1];

    if (className1 === className2) {
      listOfOpenCards[0].removeClass('open show').addClass('match');
      listOfOpenCards[1].removeClass('open show').addClass('match');
      listOfOpenCards = [];
      countMatchPairCards = countMatchPairCards + 1;

      if (countMatchPairCards === 8) {
        afterWinning();
      }

    } else {
      deck.off('click', 'li', handleClick); //<-- zeby nie odkrywac kolejnych kart gdy dwie niezmaczowane wyświetlaja sie przez te 1 sekunde
      setTimeout(wrongMatch, 1000);
    }
  }
}

// jezeli  warunek jest spelniony to zakrywa symbole kart
function wrongMatch() {
  if (listOfOpenCards.length > 1) { // restart czysci tablice, a funkcja ta z poprzedniej gry dziala z opoznienien, wiec upewnijmy sie ze sa elementy w tablicy zanim sie do nich odwolamy//
    listOfOpenCards[0].removeClass('open show');
    listOfOpenCards[1].removeClass('open show');
  }
  listOfOpenCards = [];
  deck.on('click', 'li', handleClick);
}

function afterWinning() {
  mainGameView.remove();
  afterWinningInfo.appendTo('body');
  $('p').text('With ' + countMove + MOVES_TEXT + ' and ' + rating + ' ' + gameTime);
  $('button').on('click', continueGame);
}
// afterWinning();

function continueGame() {
  mainGameView.appendTo('body');
  afterWinningInfo.remove();
  restartGame();
  deck.on('click', 'li', handleClick); //<-- usuwam elementy z DOM co powoduje odpiecie eventow
  restart.on('click', restartGame); //<--  jak wyżej
}




/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, handleClick a message with the final score (put this functionality in another function that you call from this one)
 */
