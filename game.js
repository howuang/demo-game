// [x] As a player, I can press down on the up, down, left, and right keys to move my hero across the canvas.
// [x] As a player, if I move the hero off the canvas to the right, the hero appears on the left.
// [x] As a player, if I move the hero off the canvas to the left, the hero appears on the right.
// [x] As a player, if I move the hero off the canvas to the top, the hero appears on the bottom.
// [x] As a player, if I move the hero off the canvas to the bottom, the hero appears on the top.
// [x] As a player, if I catch a monster then the monster is randomly placed on the screen.
// [x] As a player, I see my score update when I catch a monster.
// [ ] As a player, I can see an input.
// [ ] As a player, I can put my name into the input and then submit it to see my name on the screen.
// [x] As a player, I have 15 seconds to catch as many monsters as I can.
// [ ] As a player, if the timer runs out I cannot move my hero anymore.
// [ ] As a player, if the timer runs out I can see a reset button.
// [ ] As a player, if the timer runs out I can press the reset button and start the game over.
// [ ] As a player, if my score is higher than the previous high score then my score replaces it.
// [ ] As a player, I can see the history of last scores.
/*
  Code modified from:
  http://www.lostdecadegames.com/how-to-make-a-simple-html5-canvas-game/
  using graphics purchased from vectorstock.com
*/

/* Initialization.
Here, we create and add our "canvas" to the page.
We also load all of our images.
*/

const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
canvas.width = 512;
canvas.height = 480;
const CANVAS_WIDTH = canvas.width;
const CANVAS_HEIGHT = canvas.height;
document.getElementById('canvas').appendChild(canvas);
const highScore = document.getElementById('highScore')
const timer = document.getElementById('timer');
const currentScore = document.getElementById('currentScore')
const startBtn = document.getElementById('startBtn')
let playerName = document.getElementById('playerName')
const currentPlayer = document.getElementById('currentPlayer')
const modalEl = document.getElementById('modalEl')
const modalEl2 = document.getElementById('modalEl2')
const resetBtn = document.getElementById('playAgain')
let bg = {};
modalEl2.style.display = 'none';

/**
 * Setting up our characters.
 *
 * Note that hero.x represents the X position of our hero.
 * hero.y represents the Y position.
 * We'll need these values to know where to "draw" the hero.
 * The same goes for the monsters
 *
 */

let hero = { 
	x: canvas.width / 2, 
	y: canvas.height / 2,
	w: 32,
	h: 32,
	speed: 5,
}
let monsters = [
	{ x: 100, 
	y: 100,
	w: 32,
	h: 32},
	{ x: 200, y: 200, 
		w: 32,
		h: 32},
	{ x: 300, y: 300, w: 32,
		h: 32},
];

let startTime = Date.now();
const SECONDS_PER_ROUND = 15;
let elapsedTime = 0;
let score = 0;

function loadImages() {
	bg.image = new Image();

	bg.image.onload = function () {
		// show the background image
		bg.ready = true;
	};
	bg.image.src = 'images/background.png';
	hero.image = new Image();
	hero.image.onload = function () {
		// show the hero image
		hero.ready = true;
	};
	hero.image.src = 'images/hero.png';

	monsters.forEach((monster, i) => {
		monster.image = new Image();
		monster.image.onload = function () {
			// show the monster image
			monster.ready = true;
		};
		monster.image.src = `images/monster_${i + 1}.png`;
	});
}
/**
 * Keyboard Listeners
 * You can safely ignore this part, for now.
 *
 * This is just to let JavaScript know when the user has pressed a key.
 */
let keysPressed = {};
function setupKeyboardListeners() {
	// Check for keys pressed where key represents the keycode captured
	// For now, do not worry too much about what's happening here.
	document.addEventListener(
		'keydown',
		function (e) {
			keysPressed[e.key] = true;
		},
		false
	);

	document.addEventListener(
		'keyup',
		function (e) {
			keysPressed[e.key] = false;
		},
		false
	);
}
/**
 *  Update game objects - change player position based on key pressed
 *  and check to see if the monster has been caught!
 *
 *  If you change the value of 5, the player will move at a different rate.
 */
let update = function () {
	// Update the time.
	elapsedTime = Math.floor((Date.now() - startTime) / 1000);
	if (keysPressed['ArrowUp']) {
		hero.y -= hero.speed;
	}
	if (keysPressed['ArrowDown']) {
		hero.y += hero.speed;
	}
	if (keysPressed['ArrowLeft']) {
		hero.x -= hero.speed;
	}
	if (keysPressed['ArrowRight']) {
		hero.x += hero.speed;
	}
	hero.x + hero.speed && hero.y + hero.speed;
	if (hero.x >= CANVAS_WIDTH){
		hero.x = 0
	}
	if (hero.x + hero.w <= 0){
		hero.x = CANVAS_WIDTH;
	}
	if (hero.y >= CANVAS_HEIGHT){
		hero.y = 0;
	}
	if (hero.y + hero.h <= 0){
		hero.y = CANVAS_HEIGHT;
	}
	
	// Check if player and monster collided. Our images
	// are 32 pixels big.
	monsters.forEach((monster) => {
		if (hero.x <= monster.x + 32 && monster.x <= hero.x + 32 && hero.y <= monster.y + 32 && monster.y <= hero.y + 32) {
			// Pick a new location for the monster.
			// Note: Change this to place the monster at a new, random location.
			monster.x = Math.floor(Math.random() * (CANVAS_WIDTH - monster.w ));
			monster.y = Math.floor(Math.random() * (CANVAS_HEIGHT - monster.h ));
			score +=10;
			currentScore.innerHTML = score;
		}

	});
};

/**
 * This function, render, runs as often as possible.
 */

 
function draw() {
	if (bg.ready) {
		ctx.drawImage(bg.image, 0, 0);
	}
	if (hero.ready) {
		ctx.drawImage(hero.image, hero.x, hero.y);
	}
	monsters.forEach((monster) => {
		if (monster.ready) {
			ctx.drawImage(monster.image, monster.x, monster.y);
		}
	});
	let remainningTime = SECONDS_PER_ROUND - elapsedTime
	timer.innerHTML = remainningTime;
	playerName.value = "";
	currentPlayer.innerHTML = playerName.value;
	console.log(currentPlayer.innerHTML)
}

function gameOver(){
	gameEnd = requestAnimationFrame(main);
	if (SECONDS_PER_ROUND - elapsedTime == 0){
		cancelAnimationFrame(gameEnd);
	}
	finalScore.innerHTML = score;
	resetBtn.addEventListener("click", function(){})
}

/**
 * The main game loop. Most every game will have two distinct parts:
 * update (updates the state of the game, in this case our hero and monster)
 * render (based on the state of our game, draw the right things)
 */
function main() {
	update();
	draw();
	gameOver();
	// Request to do this again ASAP. This is a special method
	// for web browsers.
}

	

// Cross-browser support for requestAnimationFrame.
// Safely ignore this line. It's mostly here for people with old web browsers.
var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

// Let's play this game!
loadImages();
setupKeyboardListeners();
// main();

startBtn.addEventListener("click", function(){
	main();
	playerName.value = "";
	modalEl.style.display = 'none';
})

resetBtn.addEventListener("click", function(){})