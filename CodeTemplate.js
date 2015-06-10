$(document).ready(function(){

document.body.onmousedown = function() { return false; } //so page is unselectable

//TO ACTIVATE CHEATS:
//
//Go to options
//Select sixth option (the very bottom)
//press space a ton of times
//ta da

//to do list:
//
//make individual objects editable (done)
//
//make more levels
//
//make shop (done)
//make bombs (challenge) (done)
//

//techniques used that were not learned in this course:
//
//	OOP
//
//	switch
//
//	for(i in arrayName)
//		...is equivalent to:		for(i=0; i<array.length; i++)
//
//setTimeout
//setInterval
//clearTimeout
//clearInterval
//


	//Canvas stuff
	var canvas = $("#canvas")[0];
	var ctx = canvas.getContext("2d");
	var w = $("#canvas").width();
	var h = $("#canvas").height();
	var mx, my;
	
	//side bar and playing field layout
	var rightMargin = w*12/16
	
	//player values
	var playerWidth = 50;
	var playerHeight = 5;
	var posX = rightMargin/2-playerWidth/2;
	var posY = 402;
	var moveleft = 0;
	var moveright = 0;
	var boost = 0;
	var playerVelocity = 7;
	var playerBoostVelocity = 11;
	var ammo = 0;
	var hold = false;
	var levelTime = 0;
	
	//game things
	var loser = false;
	var timeCash = 0;
	var difficulty = 10;
	var framePage = 0;
	var intervals = new Array();
	var menuFadeIn = 1;
	var screenDim = 0;
	var startFadingIn = false;
	var waveOffset = 1000;
	var waveComplete = false;
	var sfxFading = 0;
	var sfxFadingCycle = 0;
	var backgroundDim = 0;
	var loadingCircleArc = 0;
	var loadingCircleWidth = 6;
	var loadingCircleAlpha = 1;
	var attempts = 0;
	var creditsScroll = 0;
	var cheater = false;
	//coordinate helpers
	var identifyX = "";
	var identifyY = "";
	var lockControls = true;
	var bombs = 3;
	var cash = 0;
	var timeFreeze = false;
	var completedIntervals = 0;
	var winTime;
	var leaving = false;
	var leaveTimer = 0;
	var paused = false;
	var exitCircleRadius = 100;
	var exitCircleAlpha = 1;
	var exitDim = 0.4;
	//LEVEL EDITOR
	var timeStamp = 0;
	
	var enemyPlacementASelect = new Array();
	var enemyPlacementAX = new Array();
	var enemyPlacementTimeA = new Array();
	
	var enemyPlacementA2Select = new Array();
	var enemyPlacementA2X = new Array();
	var enemyPlacementTimeA2 = new Array();
	
	var enemyPlacementBSelect = new Array();
	var enemyPlacementBX = new Array();
	var enemyPlacementTimeB = new Array();
	
	var enemyPlacementCSelect = new Array();
	var enemyPlacementCX = new Array();
	var enemyPlacementTimeC = new Array();
	
	var spikePlacementSelect = new Array();
	var spikePlacementX = new Array();
	var spikePlacementTime = new Array();
	
	var rewind = false;
	var forward = false;
	var editMode = 1;
	var timingLeniency = 4;
	var selectedObject = 1;
	var testRunning = false;
	var deleting = false;
	var objectHistory = new Array();
	
	var debugVariable = "";
	var targetDebugVariable = "";
	
	
	//screen fade effect
	function screenTransition(duration){	
		screenDim = 0;
		lockControls = true
		var interval = 1/((duration/2)/16)
		
		var fadeOut = setInterval(function(){
			if(screenDim <= 1-interval){
				screenDim += interval
			}else {screenDim = 1}
		},16)
		var fadeIn;
		
		setTimeout(function(){
			clearInterval(fadeOut);
			fadeIn = setInterval(function(){
				if(screenDim >= interval){
					screenDim -= interval;
				}else {screenDim = 0}
			},16)
		},duration/2);
		
		setTimeout(function(){
			clearInterval(fadeIn);
			lockControls = false;
		}, duration);
	}

	var bandColour = 'rgb(204, 204, 255)';
    //playfield colour band
	var playfieldGradient = ctx.createLinearGradient(240.000, 480.000, 240.000, 0.000);
	playfieldGradient.addColorStop(0.000, 'rgba(0, 0, 0, 1.000)');
    playfieldGradient.addColorStop(0.118, 'rgba(0, 0, 0, 1.000)');
    playfieldGradient.addColorStop(0.129, bandColour);	//colour band
    playfieldGradient.addColorStop(0.140, 'rgba(0, 0, 0, 0)');
	
	var playfieldGradient_i = ctx.createLinearGradient(240.000, 480.000, 240.000, 0.000);
	playfieldGradient_i.addColorStop(0.000, 'rgba(255, 255, 255, 1.000)');
    playfieldGradient_i.addColorStop(0.118, 'rgba(255, 255, 255, 1.000)');
    playfieldGradient_i.addColorStop(0.129, 'rgb(41,41,0)');	//colour band
    playfieldGradient_i.addColorStop(0.140, 'rgba(255, 255, 255, 0)');
    // playfieldGradient.addColorStop(0.166, 'rgba(0, 0, 0, 0.725)'); 
    // playfieldGradient.addColorStop(0.750, 'rgba(255, 255, 255, 0.000)');
	
	
	//editor time line
	var editorTimeGradient = ctx.createLinearGradient(240.000, 480.000, 240.000, 0.000);
	editorTimeGradient.addColorStop(0.000, 'rgba(0, 0, 0, 0)');
    editorTimeGradient.addColorStop(0.118, 'rgba(0, 0, 0, 0)');
    editorTimeGradient.addColorStop(0.129, 'lightgreen');	//colour band
    editorTimeGradient.addColorStop(0.140, 'rgba(0, 0, 0, 0)');
    // playfieldGradient.addColorStop(0.166, 'rgba(0, 0, 0, 0.725)'); 
    // playfieldGradient.addColorStop(0.750, 'rgba(255, 255, 255, 0.000)');

	//title gradient
	var titleGradient = ctx.createLinearGradient(363.000, 0.000, 363.000, 255.000);

	titleGradient.addColorStop(0.000, 'rgba(41, 137, 204, 1.000)');
	titleGradient.addColorStop(0.481, 'rgba(170, 255, 255, 1.000)');
	titleGradient.addColorStop(0.517, 'rgba(0, 255, 191, 1.000)');
	titleGradient.addColorStop(0.640, 'rgba(124, 255, 137, 1.000)');
	titleGradient.addColorStop(0.987, 'rgba(209, 255, 206, 1.000)');

	//Menu things
	var menuSelect = 1;
	var menuSelectB = 0;
	var rightKeyDown = false;
	var leftKeyDown = false;
	
	//Options things
	var unlockCheats = 0;
	var godmode = false;
	var unlock1 = true;
	var easyPing = false;
	var BFG = false;
	var BFGing = false;
	var selectionY = 77;
	var selectionW = 226;
	var selection2Y = 77;
	var selection2W = 226;
	var option = new Array();
	option[1] = "Background Dim"
	option[2] = "Audio Levels"
	option[3] = "Rebind Keys"
	option[4] = "???"
	option[5] = "???"
	option[6] = "???"
	var optionB = new Array();
	optionB[1] = "God mode"
	optionB[2] = "Unlock extra stages"
	optionB[3] = "Auto pinging"
	optionB[4] = "BFG"
	var selectedOption = 0;
	var slider = new Array();
	slider[1] = 330+270*backgroundDim;
	slider[2] = 330+270*globalVolume;
	slider[3] = 330+270*SFXVolume;
	slider[4] = 330+270*backgroundDim;
	
	var clickHold = new Array();
	clickHold[1] = false;
	clickHold[2] = false;
	clickHold[3] = false;

	
	var globalVolume = 0;
	var SFXVolume = 1;
	var musicVolume = 0;
	
	//Shop things
	var bombPrice = 30000;
	
	
	//images
	var sidebar = new Image();
	var playerSprite1 = new Image();
	var playerSprite1_i = new Image();
	var playerSprite2 = new Image();
	var playerSprite2_i = new Image();
	var flash1 = new Image();
	var flash2 = new Image();
	var verticalFlash = new Image();
	var bulletRed = new Image();
	var bulletYellow = new Image();
	var bulletCyan = new Image();
	var bulletBlue = new Image();
	var menuTutorial = new Image();
	var menuPlay = new Image();
	var menuShop = new Image();
	var menuPractice = new Image();
	var menuOptions = new Image();
	var menuCredits = new Image();
	var menuExtra = new Image();
	var menuEditor = new Image();
	var menuBg = new Image();
	var menuGradient = new Image();
	var menuGradient_i = new Image();
	var titleGlow = new Image();
	var background = new Array();
	var background_i = new Array();
	for(i=0;i<2;i++){
		background[i] = new Image();
	}
	for(i=0;i<2;i++){
		background_i[i] = new Image();
	}


	//////////
	//AUDIO
	var tick = new Array();
	var fire = new Array();
	var playerHurt = new Array();
	var bossHurt = new Array();
	var bossKill = new Array();
	var chargeUp = new Array();
	var ping = new Array();
	var enemyKill = new Array();
	var playerDeath = new Array();
	var menuCycle = new Array();
	var menuHit = new Audio();
	var menuBGM = new Audio();
	var chargeMax = new Audio();
	var retry = new Audio();
	var henrietta = new Audio();
	var oriens = new Audio();
	var cheetah = new Audio();
	var freeze = new Audio();
	var shatter = new Audio();

	menuHit.src = 'audio/sound effects/menuhit.wav';
	menuHit.volume = 1*SFXVolume*globalVolume
	menuBGM.src = 'audio/music/Mei.mp3';
	chargeMax.src = 'audio/sound effects/chargemax.wav';
	retry.src = 'audio/sound effects/retry.wav';
	henrietta.src = 'audio/music/henrietta.mp3';
	henrietta.volume = 0.4*globalVolume*musicVolume;
	henrietta.loop = true;
	oriens.src = 'audio/music/Ginkiha - Oriens [Extended Mix].mp3';
	oriens.volume = 0.6*globalVolume*musicVolume;
	oriens.loop = true;
	cheetah.src = 'audio/sound effects/cheater!.wav';
	freeze.src = 'audio/sound effects/sword.wav';
	shatter.src = 'audio/sound effects/shatter.wav';

 	function tickPlay(){
		tick.push(new Audio())
		tick[tick.length-1].src = "audio/sound effects/tick.wav"
		tick[tick.length-1].volume = 1*SFXVolume*globalVolume;
		tick[tick.length-1].play();
	}
	function firePlay(){
		fire.push(new Audio())
		fire[fire.length-1].src = "audio/sound effects/fire.wav"
		fire[fire.length-1].volume = 1*SFXVolume*globalVolume;
		fire[fire.length-1].play();
	}
	function playerHurtPlay(){
		playerHurt.push(new Audio())
		playerHurt[playerHurt.length-1].src = "audio/sound effects/se_plst00.wav"
		playerHurt[playerHurt.length-1].volume = 0.15*SFXVolume*globalVolume;
		playerHurt[playerHurt.length-1].play();
	}
	function bossHurtPlay(){
		bossHurt.push(new Audio())
		bossHurt[bossHurt.length-1].src = "audio/sound effects/bosshurt.wav"
		bossHurt[bossHurt.length-1].volume = 0.7*SFXVolume*globalVolume;	
		bossHurt[bossHurt.length-1].play();
	}
	function bossKillPlay(){
		bossKill.push(new Audio())
		bossKill[bossKill.length-1].src = "audio/sound effects/bosskill.mp3"
		bossKill[bossKill.length-1].volume = 1*SFXVolume*globalVolume;
		bossKill[bossKill.length-1].play();
	}
	function chargeUpPlay(){
		chargeUp.push(new Audio())
		chargeUp[chargeUp.length-1].src = "audio/sound effects/charge.wav"
		chargeUp[chargeUp.length-1].volume = 1*SFXVolume*globalVolume;
		chargeUp[chargeUp.length-1].play();
	}
	function pingPlay(){
		ping.push(new Audio())
		ping[ping.length-1].src = "audio/sound effects/ping.wav"
		ping[ping.length-1].volume = 1*SFXVolume*globalVolume;
		ping[ping.length-1].play();
	}
	function enemyKillPlay(){
		enemyKill.push(new Audio())
		enemyKill[enemyKill.length-1].src = "audio/sound effects/enemy_kill.wav"
		enemyKill[enemyKill.length-1].volume = 0.5*SFXVolume*globalVolume;
		enemyKill[enemyKill.length-1].play();
	}
	function playerDeathPlay(){
		playerDeath.push(new Audio())
		playerDeath[playerDeath.length-1].src = "audio/sound effects/se_pldead00.wav"
		playerDeath[playerDeath.length-1].volume = 0.2*SFXVolume*globalVolume;
		playerDeath[playerDeath.length-1].play();
	}
	function menuCyclePlay(){
		menuCycle.push(new Audio())
		menuCycle[menuCycle.length-1].src = "audio/sound effects/menuclick.wav"
		menuCycle[menuCycle.length-1].volume = 1;
		menuCycle[menuCycle.length-1].play();
	}

	///////////////////////////////////
	//////FUNCTIONS AND OBJECTS///////

	//Intro screen
	setTimeout(function(){
		startFadingIn = true;
		lockControls = false;
	}, 2200)
	
	function restartGame(wave){
		levelTime = 0;
		completedIntervals = 0;
		freezeTime = false;
		loser = false;
		posX = rightMargin/2-playerWidth/2
		ammo = 0;
		flash.length = 0;
		bullet.length = 0;
		spike.length = 0;
		ghostTrail.length = 0;
		enemyA.length = 0;
		enemyB.length = 0;
		enemyC.length = 0;
		enemyFlash.length = 0;
		textMessage.length = 0;
		waveComplete = false;
		for(i=0;i<intervals.length; i++){
			intervals[i].stop();
		}
		intervals.length = 0;
		if(typeof wave !== 'undefined'){
			attempts++
			if(wave == 0){
				wave0();
			}else if(wave == 1){
				wave1();
			}
		}
	}
	
	function loadTutorial(){
		lockControls = false;
		framePage = 1;
		restartGame(0);
		setTimeout(function(){
			henrietta.currentTime = 0;
			henrietta.volume = 0.4*globalVolume*musicVolume;
			henrietta.play();
		}, 1300)
	}

	function loadStage1(){
		lockControls = false;
		framePage = 2;
		restartGame(1);
		setTimeout(function(){
			oriens.currentTime = 0;
			oriens.volume = 0.6*globalVolume*musicVolume;
			oriens.play();
		}, 1300)
	}
	
	function determineLevelLength(){	
		var levelLength;
		var large1 = Math.max.apply(Math, enemyPlacementTimeA);  			//finds largest value in each array
		var large2 = Math.max.apply(Math, enemyPlacementTimeA2);  
		var large3 = Math.max.apply(Math, enemyPlacementTimeB);  
		var large4 = Math.max.apply(Math, enemyPlacementTimeC);  
		var large5 = Math.max.apply(Math, spikePlacementTime);  
		levelLength = Math.max(large1, large2, large3, large4, large5)			//finds largest value in all arrays
		//determine the highest value in the 5 time stamp arrays
		return levelLength;
	}
	
	function testMouseRect(x,y,w,h){
		if(mx > x && my > y && mx < x+w && my < y+h){
			return true;
		}else return false;
	}
	
	function testCollision(ax, ay, aw, ah, bx, by, bw, bh){
		if (ax < bx + bw && ax + aw > bx && ay < by + bh && ah + ay > by){
				return true;
			}
	}
	
	function createButton(x,y,w,h,colour1,colour2){
		if(testMouseRect(x,y,w,h) == true){
			ctx.fillStyle = colour1;
		}else {ctx.fillStyle = colour2}
		ctx.fillRect(x,y,w,h);
	}
	//
	//Reference Guide:
	//	(old, needs to be updated)
	//Object, Parameters:						Array name:						Methods:		( * = unique)											Method Description:
	/////////////////////					////////////					//////////////////////										///////////////////
	//newEnemyA(x, unarmed)				enemyA							this.move = moveAccelerate;									accelerates object
	//																						this.draw = drawObject;										draws object on canvas
	//																						*this.checkVelocity = velocityCheck;						changes movement phase
	//																						this.inBounds = inCanvas;										checks whether object is within the playfield
	//																						*this.getHit = checkHit;
	//
	//newEnemyB(x)								enemyB							this.move = moveAccelerate;									accelerates object
	//																						this.draw = drawObject;										draws object on canvas
	//																						*this.checkVelocity = velocityCheck;						changes movement phase
	//																						this.inBounds = inCanvas;										checks whether object is within the playfield
	//																						*this.getHit = checkHit;
	//
	//newEnemyC(x, y, fireX)					enemyC							this.move = moveLinearX;										moves object linearly
	//																						this.draw = drawObject;										draws object on canvas
	//																						*this.fire = shootAtX;
	//
	//newBullet(x, y, v, s, type)				bullet								this.move = moveLinear;
	//																						this.draw = drawObject;										draws object on canvas
	//																						*this.checkCollision = collisionCheck;
	//																						this.inBounds = inCanvas;										checks whether object is within the playfield
	//
	//newSpike(x)								spike								this.move = moveLinear;
	//																						this.draw = drawObject;										draws object on canvas
	//																						*this.collision = collisionDetect;
	//
	//newFlash(image, x, y, s)				flash								this.animate = animation;
	//																						this.frameCounter = counter;
	//
	//newTrail(x,y){								ghostTrail						this.animate = animation2;
	//																						this.frameCounter = counter;
	//


	//////CONSTRUCTOR FUNCTIONS
	function newEnemyA(x, unarmed, time){										//Defines enemy A (red)
		this.spawnTime = time;
		this.x = x;
		this.y = 0;
		this.w = 50;
		this.h = 30;
		this.velocity = 6;
		this.acceleration = -0.2;
		this.alpha = 1;
		if(unarmed == true){
			this.colour = 'darkgrey';
		}else this.colour = 'darkred';
		this.move = moveAccelerate;
		this.draw = drawObject;
		this.checkVelocity = velocityCheck;
		this.inBounds = inCanvas;
		this.getHit = checkHit;
	}

		function velocityCheck(){														//belongs to enemyA+B, creates new bullet instance and changes acceleration
		if(this.velocity <= 0){
			this.acceleration = 0.15;
			if(this.colour == 'darkred'){				//enemyA
				this.colour = 'pink';
				bullet.push(new newBullet(this.x+this.w/2-10, this.y, 10, 20, 1));
			}
			if(this.colour == '#FF9966'){				//enemyB
				this.alpha = 0.4;
				this.colour = '#FFCCB2';
				bullet.push(new newBullet(this.x+this.w/2-10, this.y, 10, 20, 3, 15,40));
			}
		}
	}

	function newEnemyB(x, time){														//Defines enemy B (orange)
		this.spawnTime = time;
		this.x = x;
		this.y = 0;
		this.w = 50;
		this.h = 30;
		this.velocity = 6;
		this.acceleration = -0.2;
		this.alpha = 1;
		this.colour = '#FF9966';
		this.move = moveAccelerate;
		this.draw = drawObject;
		this.checkVelocity = velocityCheck;
		this.inBounds = inCanvas;
		this.getHit = checkHit;
	}

	function newEnemyC(side, y, fireX, time){										//Defines enemy C (green)
		this.spawnTime = time;
		this.side = side;
		if(this.side == "left"){this.x = -20}
		if(this.side == "right"){this.x = w}
		this.y = y;
		this.w = 20;
		this.h = 20;
		this.fireX = fireX;
		if(side == "left"){
			this.velocity = 6;
		}else {this.velocity = -6}
		this.alpha = 1;
		this.colour = 'green';
		this.ammo = 1;
		this.move = moveLinearX;
		this.draw = drawObject;
		this.fire = shootAtX;
		this.inBounds = inCanvas;
	}
		function shootAtX(){																//enemyC method: shoots bullet when at specified x coordinate
			if(this.side == "left"){
				if(this.x >= this.fireX && this.ammo > 0){
					bullet.push(new newBullet(this.x, this.y, 7, 20, 2));
					this.ammo--;
				}
			}
			if(this.side == "right"){
				if(this.x <= this.fireX && this.ammo > 0){
					bullet.push(new newBullet(this.x, this.y, 7, 20, 2));
					this.ammo--;
				}
			}
		}

	function newBullet(x, y, vel, s, type, w2, h2, damage){		//Every bullet in the game
		this.type = type;			//0: normal, 1: reflect, 2: charge, 3: ping

		if(typeof damage !== "undefined"){this.damage = damage}
		this.x = x;
		this.y = y;

		if(typeof w2 == "undefined"){
			this.w = s;
		}else {this.w = w2}

		if(typeof h2 == "undefined"){
			this.h = s;
		}else {this.h = h2}

		this.velocity = vel;
		this.alpha = 1;

		if(this.velocity > 0){
			if(this.type == 1){
				this.colour = 'yellow'
			}else if(this.type == 2){
				this.colour = 'purple'
			}else if(this.type == 3){
				this.colour = '#FF9999'
			}
		} else this.colour = 'white';

		this.move = moveLinear;
		this.draw = drawObject;
		this.checkCollision = collisionCheck;
		this.inBounds = inCanvas;
		this.drawSprite = spriteDraw;
	}
		function spriteDraw(){
			if(this.velocity < 0){
				if(this.damage < 3){
					ctx.drawImage(bulletRed,this.x,this.y, this.w, this.w*2);
				}
				if(this.damage > 2 && this.damage < 5){
					ctx.drawImage(bulletYellow,this.x,this.y, this.w, this.w*2);
				}
				if(this.damage == 5){
					ctx.drawImage(bulletCyan,this.x,this.y, this.w, this.w*2);
				}
				if(this.damage == "bobobob"){
					ctx.drawImage(bulletBlue,this.x,this.y, this.w, this.w*2);
				}
			}
		}
		function collisionCheck(){														//method: checks collision with player
			if(this.velocity > 0){			//if bullet is incoming
				if((this.x + this.w) > posX && this.x < (posX + playerWidth)    &&    this.y < (posY + playerHeight) && (this.y + this.h) > posY){		//bullet vs player
					if(this.type == 1 && this.alpha == 1){
						this.velocity = -11;
						this.damage = "bobobob";
						this.colour = 'blue';
						tickPlay();
					}
					if(this.type == 2 && hold == 1 && ammo < 5 && this.alpha == 1){
						ammo++
						chargeUpPlay();
						if(ammo == 5){
							chargeMax.play()
						}
						this.alpha = 0;
					}
					if(this.type == 3){
						return true;
					}
				}
				if(this.y > h && this.alpha == 1){
					//flash.push(new newFlash(1, posX, 360, 100));
					this.alpha = 0;
				}
			}
		}

	function newSpike(x, spawntime){															//Falling objects that instakill player on contact
		this.time = spawntime;
		this.x = x;
		this.y = -10;
		this.w = 10;
		this.h = 10;
		this.velocity = 6
		this.colour = 'white'
		this.alpha = 1
		this.move = moveLinear;
		this.draw = drawObject;
		this.collision = collisionDetect;
	}
		function collisionDetect(){													//method: Checks collision with player
			if((this.x + this.w) > posX && this.x < (posX + playerWidth)    &&    this.y < (posY + playerHeight) && (this.y + this.h) > posY){
				//this.alpha = 0;
				this.colour = 'red';
				if(loser == false){
					flash.push(new newFlash(1, posX, 360, 100));
					playerHurtPlay();
					if(framePage !== 1 && godmode == false){
						loser = true;															//game over
					}
				}
			}
		}

	function newFlash(image, x, y, s){										//SFX: Flash effect animation (used by several objects)
		this.sprite = image;
		this.x = x;
		this.y = y;
		this.frame = 0
		this.square = s;
		this.animate = animation;
		this.frameCounter = counter;
	}
		function counter(){																//method: Counts up frame number for sprite sheet animation
			this.frame++
		}

	function newTrail(x,y){															//SFX: Blur effect produced when boosting
		this.x = x
		this.y = y
		this.frame = 0
		this.animate = animation2;
		this.frameCounter = counter;
	}
		function animation2(){															//trail method: fade effect for boost trail
			ctx.globalAlpha = 0.3 - this.frame*0.3/10;
			ctx.drawImage(playerSprite1,this.x,this.y,55,15);
		}

	function newFlyInText(message, duration, colour, spawntime){				//HUD: messages which appear in-game
		this.x = 25
		this.y = 710
		this.phase = 1;
		this.message = message;
		this.duration = duration;
		this.time = spawntime;
		if(typeof colour == "undefined"){
			this.colour = 'lightgrey'
		}else this.colour = colour;
		this.acceleration = 0.2
		this.velocity = -10
		this.drawText = textDraw;
		this.pauseText = textPause;
		this.moving = true;
		this.move = moveAccelerate;
	}
		function textDraw(){																//Text method 1
			ctx.globalAlpha = 1;
			ctx.fillStyle = this.colour;
			ctx.font = '14pt Helvetica';
			ctx.fillText(this.message, this.x, this.y);
		}
		function textPause(){															//Text method 2
			if(this.velocity >= 0 && this.phase == 1){
				this.moving = false;
				this.phase = 2;
				setTimeout(function(){checkem()}, this.duration)
			}
		}
		function checkem(){																//Text method 3
		for(i in textMessage){
			if(textMessage[i].phase == 2){
				textMessage[i].moving = true;
				textMessage[i].phase = 3
			}
		}
	}

	function newEnemyPass(colour, x){										//SFX: Red column of light
		this.x = x;
		this.y = h;
		this.alpha = 1
		this.fade = fading;
		this.animate = animation;
	}
		function fading(){																	//method: fade out
			if(this.alpha > 0.015){
				this.alpha -= 0.015
			}else {this.alpha = 0}
		}

	function newBossT(x, spawntime){														//tutorial boss
		this.time = spawntime;
		this.maxHP = 20;
		this.hp = this.maxHP;
		this.phase = 1;
		this.w = 80;
		this.h = 60;
		this.x = x;
		this.y = -60
		this.alpha = 1;
		this.colour = 'darkred';
		this.phase1 = bossTPhase1;
		this.phase3 = bossTPhase3;
		this.draw = drawObject;
		this.getHit = checkHit;
	}
		function bossTPhase1(){
			if(this.phase == 1){
				this.y += 2
				if(this.y >= 20){
					this.phase = 2;
					setTimeout(function(){
						boss[0].phase = 3;
					}, 700)
				}
			}
		}
		function bossTPhase3(){
			if(this.phase == 3){
				this.y += -10
				if(this.y <= -500){
					this.x = Math.random()*(rightMargin - 100 - this.w) + 50;
					this.y = -60;
					this.phase = 1;
				}
			}
		}

	function positiveOrNegative(){						//RNG used for debris effect (determines horizontal direction)
		var number = Math.random()
		if(number < 0.5){
			return (-1);
		}else if(number > 0.5){
			return 1;
		}
	}
	function newDebris(x, y){								//debris
		this.x = x
		this.y = y
		this.w = 10;
		this.h = 10;
		this.colour = 'red'
		this.alpha = 1;
		this.velocityX = (Math.random()*5.5)*positiveOrNegative();   //plus-minus 0 to 5.5
		this.velocityY = ((Math.random()*12)+8)*(-1)   //15-22
		this.accelerationY = 1.7
		this.draw = drawObject;
		this.move = debrisMove;
	}
		function debrisMove(){
			this.x += this.velocityX;
			this.y += this.velocityY;
			this.velocityY += this.accelerationY;

		}



		/////////////////
	//SHARED OBJECT METHODS
	function moveLinear(){											//Move object linearly along y axis
		this.y += this.velocity;
	}
	function moveLinearX(){										//Move object linearly along x axis
		this.x += this.velocity
	}
	function moveAccelerate(){									//Accelerate object
		this.y += this.velocity;
		this.velocity+=this.acceleration;
	}
	function drawObject(){											//draw object (fillRect) at current location
		ctx.fillStyle = this.colour;
		ctx.globalAlpha = this.alpha;
		ctx.fillRect(this.x,this.y,this.w,this.h)
	}
	function inCanvas(){												//checks whether object is within canvas
		if(typeof this.side !== "undefined"){		//checks whether object is enemyC
			if(this.side == "left" && this.x > w+200){
				return false;
			}else if(this.side == "right" && this.x < -20){
				return false;
			}else return true;
		}else if(this.y < h && this.x > 0 && this.x < w && this.y > -100){
			return true;
		} else {return false};
	}
	function checkHit(bx, by, bw, bh){							//universal collision detector, works for any two objects
		if (this.x < bx + bw &&
			this.x + this.w > bx &&
			this.y < by + bh &&
			this.h + this.y > by){
				return true;
			}
	}
	
	
	

	function animation(){				//animate some objects
		if(this.sprite == 1){
			ctx.drawImage(flash1,0+this.frame*30,0,30,30,this.x-24,this.y, this.square, this.square);		//red
		}
		else if(this.sprite == 2){
			ctx.drawImage(flash2,0+this.frame*30,0,30,30,this.x-24,this.y, this.square, this.square);		//blue
		}else {
			ctx.globalAlpha = this.alpha;
			ctx.drawImage(verticalFlash, this.x, 230);
		}
	}


	//OBJECT ARRAYS
	var flash = new Array();
	var bullet = new Array();
	var spike = new Array();
	var ghostTrail = new Array();
	var enemyA = new Array();
	var enemyB = new Array();
	var enemyC = new Array();
	var textMessage = new Array();
	var enemyFlash = new Array();
	var boss = new Array();
	var debris = new Array();
	
	
	//level functions
	function spawnEnemyA(x,time){
		enemyA.push(new newEnemyA(x, false, time));
	}
	function spawnEnemyA2(x,time){
		enemyA.push(new newEnemyA(x, true, time));
	}
	function spawnEnemyB(x,time){
		enemyB.push(new newEnemyB(x, time));
	}
	function spawnEnemyC(side, y, fireX, time){
		enemyC.push(new newEnemyC(side, y, fireX, time));
	}
	function spawnSpike(x, time){
		spike.push(new newSpike(x, time));
	}
	function generateText(message, duration, time, colour){
		textMessage.push(new newFlyInText(message, duration, colour, time))
	}
	function spawnBossT(x, time){
		boss.push(new newBossT(x, time));
	}
	//level editor functions
	function placeEnemyAHere(){
		enemyPlacementASelect.push(false);
		enemyPlacementAX.push(posX+playerWidth/2-7.5);
		enemyPlacementTimeA.push(timeStamp);
	}
	function placeEnemyA2Here(){
		enemyPlacementA2Select.push(false);
		enemyPlacementA2X.push(posX+playerWidth/2-7.5);
		enemyPlacementTimeA2.push(timeStamp);
	}
	function placeEnemyBHere(){
		enemyPlacementBSelect.push(false);
		enemyPlacementBX.push(posX+playerWidth/2-7.5);
		enemyPlacementTimeB.push(timeStamp);
	}
	function placeEnemyCHere(){
		enemyPlacementCSelect.push(false);
		enemyPlacementCX.push(posX+playerWidth/2-7.5);
		enemyPlacementTimeC.push(timeStamp);
	}
	function placeSpikeHere(){
		spikePlacementSelect.push(false);
		spikePlacementX.push(posX+playerWidth/2-7.5);
		spikePlacementTime.push(timeStamp);
	}
	
	
	///////////////////////////////////////////////////
	///////////////LEVELS//////////////////////////////
	///////////////////////////////////////////////////
    	function wave0(){		//Tutorial

		//Tutorial level
  		generateText("Welcome to Catch the Bullet.", 1100, 100, 'yellow')
		generateText("Move with the left and right arrow keys.", 1500, 2500)
		generateText("Press escape to return to the main menu at any time.", 1100, 4800)

		for(i=0;i<11;i++){
			spawnSpike(150+i*17,7200);
		}

 		for(i=0;i<11;i++){
			spawnSpike(-100+i*17,8500);
		}
		for(i=0;i<18;i++){
			spawnSpike(180+i*17,8500);
		}

 		for(i=0;i<19;i++){
			spawnSpike(0+i*17,9500);
		}
		for(i=0;i<11;i++){
			spawnSpike(410+i*17,9500);
		}

 		for(i=0;i<17;i++){
			spawnSpike(460-i*17,10500+60*i);
		}
		for(i=0;i<17;i++){
			spawnSpike(270-i*17,10500+60*i);
		}
		for(i=0;i<17;i++){
			spawnSpike(270-i*17,10500);
		}
		for(i=0;i<19;i++){
			spawnSpike(180+i*20,10500+60*17);
		}


 		for(i=0;i<17;i++){
			spawnSpike(310+i*17,13000);
		}
		for(i=0;i<17;i++){
			spawnSpike(160-i*17,13000);
		}
		for(i=0;i<4;i++){
			spawnSpike(310,13000+i*70);
		}
		for(i=0;i<4;i++){
			spawnSpike(160,13000+i*70);
		}
		for(i=0;i<10;i++){
			spawnSpike(160-i*12,13000+4*70+i*70);
		}
		for(i=0;i<11;i++){
			spawnSpike(310-i*12,13000+4*70+i*70);
		}
		for(i=0;i<6;i++){
			spawnSpike(45,13000-60+15*70+i*70);
		}
		for(i=0;i<4;i++){
			spawnSpike(190,13000+5+16*70+(i-1)*70);
		}
		for(i=0;i<9;i++){
			spawnSpike(210+i*31,13000-100+16*70 + 4*70 +i*70);
		}
		for(i=0;i<8;i++){
			spawnSpike(60+i*31,13000+16*70 + 4*70 +i*70);
		}
		for(i=0;i<11;i++){
			spawnSpike(295-i*30,13000+16*70 + 4*70 +8*70);
		}

		generateText("Reflect bullets from red enemies to destroy them.", 1700, 16500, '#FF6666')

		spawnEnemyA(rightMargin/2-25,19500);
		for(i=0;i<5;i++){
			spawnEnemyA(60+i*80,21000+i*500);
		}

		generateText("Some enemies may be spaced far apart.", 1000, 24000, '##FF6666')
		generateText("Press and hold shift to gain a speed boost.", 1200, 25800, '##FF6666')

		spawnEnemyA(rightMargin*1/3-25,28000);
		spawnEnemyA(rightMargin*2/3-25,28000+300);
		for(i=1;i<5;i++){
			spawnEnemyA(rightMargin*(5-i)/5-25,28000+1400+i*150);
		}

		generateText("Boosting is only useful in some situations.", 1200, 31500, '#FF6666')
		generateText("Use it only when you need to.", 1000, 31500 + 2100, '#FF6666')


		//pinging
	 	generateText("Bullets from orange enemies must be pinged.", 1200, 35500, 'orange')
		generateText("Press X to ping a bullet when it reaches your paddle.", 1300, 35500+2000, 'orange')

		spawnEnemyB(rightMargin/2-25,35500+ 4500);

		generateText("Pinging must be timed well.", 900, 35500+5500, 'orange')
		//Pinging must be timed well.

		spawnEnemyB(rightMargin*2/3-12, 35500+7000+1*400);
		spawnEnemyB(rightMargin*2/3+12, 35500+7000+2*400);
		spawnEnemyB(rightMargin*2/3-12, 35500+7000+3*400);
		spawnEnemyB(rightMargin*2/3+12, 35500+7000+4*400);


		spawnEnemyB(rightMargin*1/3-12,35500+9000+1*400);
		spawnEnemyB(rightMargin*1/3+12,35500+9000+2*400);
		spawnEnemyB(rightMargin*1/3-12,35500+9000+3*400);
		spawnEnemyB(rightMargin*1/3+12,35500+9000+4*400);

 		//charges
 		generateText("Green enemies drop special bullets.", 1300, 46700, '#66FF33')
		generateText("Hold X to hold these bullets as charges.", 1300, 46700+2200, '#66FF33')
		generateText("Release X to fire a charged shot.", 1300, 46700+4400, '#66FF33')

		spawnEnemyC("left",120, 240, 46700+7000);

		generateText("The more charges you hold,", 1000, 46700+7600, '#66FF33')
		generateText("the more powerful your shot will be.", 1300, 46700+9300, '#66FF33')
		generateText("Use charged shots to defeat powerful enemies.", 1500, 46700+11300, '#66FF33')

		spawnBossT(240, 46700+14000)

		spawnEnemyC("left",120, 240, 46700+13300);
		spawnEnemyC("right",80, 380, 46700+13300+200);
		spawnEnemyC("left",100, 100, 46700+13300+1250);
		spawnEnemyC("right",100, 250, 46700+13300+900);
		spawnEnemyC("left",100, 100, 46700+13300+2000);

		for(j=0;j<12;j++){
			for(i=0;i<4;i++){
				spawnEnemyC("left",80, 100+i*80, 46700+13300+2000+200+2500+j*6000);
			}
			for(i=0;i<5;i++){
				spawnEnemyC("right",120, 400-i*80, 46700+13300+3500+1400+2500+j*6000);
			}
		}

		winTime = 9999999999999999;

	}

		function wave1(){		//something
			//difficulty test i guess? seems too hard for first level

			generateText("Attempt: " + attempts, 750, 500,'white');

			for(i=0;i<2;i++){
				spawnEnemyA(rightMargin*1/5,1500+i*200);
			}
			spawnEnemyA(rightMargin*1.5/5,1500+2*200);
			for(i=0;i<2;i++){
				spawnEnemyA(rightMargin*3.5/5,3000+i*200);
			}
			spawnEnemyA(rightMargin*3/5,3000+2*200);
			for(i=0;i<3;i++){
				spawnEnemyA(rightMargin*1/5+i*40,4500+i*200);
			}
			spawnEnemyA(rightMargin*1/5+3.5*75,4500+3.5*200);
			spawnEnemyA(rightMargin*1/5,6000);
			spawnEnemyA(rightMargin*3.5/5,6700);
			spawnEnemyA(rightMargin*1/5,7400);
			spawnEnemyA(rightMargin*3/5,7400+500);
			spawnEnemyA(rightMargin*2/5,7400+500+350);
			spawnEnemyA(rightMargin*3/5,7400+500+2*350);
			spawnEnemyA(rightMargin*2/5,7400+500+3*350);
			for(i=0;i<8;i++){
			spawnEnemyA(rightMargin*2.5/5,7400+1900+i*75);
			}
			for(i=0;i<4;i++){
			spawnEnemyA(rightMargin*2.5/5 + i*30,9975 + i*200);
			}
			for(i=0;i<6;i++){
			spawnEnemyA(350 - i*50,8975 + 9*200 + i*200);
			}
			spawnEnemyC("right",20, rightMargin*2.5/5 + 9*15 - 12*25, 10500);
			spawnEnemyA2(360, 12400)
			spawnEnemyC("left", 20, 240, 12400);
			spawnEnemyA2(100,13100)

			spawnEnemyA(rightMargin/2, 13900)
			spawnEnemyA(rightMargin/2-40, 13900)

			spawnEnemyA(rightMargin/2+60, 14500)
			spawnEnemyA(rightMargin/2-40+60, 14500)

			spawnEnemyA(rightMargin/2-30, 15100)
			spawnEnemyA(rightMargin/2-40-30, 15100)

			for(i=0;i<8;i++){
				spawnEnemyA(Math.pow(3*(i-2),2) + 100, 15700+i*100)
			}
			for(i=0;i<8;i++){
				spawnEnemyA(Math.pow(3*(i-2),2)*(-1) + 300, 16700+i*100)
			}
			spawnEnemyA(300, 17800)
			spawnEnemyB(350, 18100)

			spawnEnemyA(150, 18500)
			spawnEnemyB(100, 18800)

			spawnEnemyB(280, 18800+650)
			spawnEnemyB(280, 19100+650)

			spawnEnemyB(130, 19800+650)
			spawnEnemyB(130, 20100+650)

			spawnEnemyB(170, 19800+1650)
			spawnEnemyB(190, 19800+1650)
			spawnEnemyB(280, 20100+1650)
			spawnEnemyB(300, 20100+1650)
			spawnEnemyB(170, 20400+1650)
			spawnEnemyB(190, 20400+1650)
			spawnEnemyB(280, 20700+1650)
			spawnEnemyB(300, 20700+1650)
			spawnEnemyB(170, 21000+1650)
			spawnEnemyB(190, 21000+1650)

			spawnEnemyA(240,23500)
			spawnEnemyA(240+90,23500+140)
			spawnEnemyA(240,23500+2*140)
			spawnEnemyA(240-90,23500+3*140)
			spawnEnemyA(240,23500+4*140)

			spawnEnemyC("right", 30, 365,23600)
			spawnEnemyA2(100,24400)

			winTime = 26300;
		}
		
		function wave2(){
			spawnEnemyA(75,300+1*500)
			spawnEnemyA(125,300+2*500)
			spawnEnemyA(175,300+3*500)
			spawnEnemyA(320,300+4*500)
			spawnEnemyA(280,300+5*500)
			spawnEnemyA(240,300+6*500)
			spawnEnemyA(150,300+7*500)
			spawnEnemyA(150,300+8*500)
			spawnEnemyA(300,300+9*500)
			spawnEnemyA(300,300+10*500)
			spawnEnemyA(130,300+11*500)
			
			spawnEnemyA(280, 300+12*500)
			spawnEnemyA(130+80, 300+13*500)
			spawnEnemyA(280+60, 300+14*500)
			for(i=0;i<5;i++){
				spawnEnemyA(80 + i*70, 500+15*500+i*250)
			}
			for(i=0;i<10;i++){
				spawnEnemyA(80 + i*35, 500+15*500+6*250+i*125)
			}
			for(i=0;i<18;i++){
				spawnEnemyA(80 + 4*70 - i*35/2, 500+15*500+11*250+i*125/2)
			}
			
			spawnEnemyA(rightMargin/2-50, 500+15*500+11*250+22*125/2 + 500*2/3)
			spawnEnemyA(rightMargin/2-50,  500+15*500+11*250+22*125/2 + 500*2/3 + 500*2/3)
			spawnEnemyA(rightMargin/2+100-50, 500+15*500+11*250+22*125/2 + 500*2/3 + 500*2/3 + 500*2/3)
			spawnEnemyA(rightMargin/2-70-50, 500+15*500+11*250+22*125/2 + 500*2/3 + 500*2/3 + 500*2/3 + 500*2/3)
			spawnEnemyA(rightMargin/2-20-50, 500+15*500+11*250+22*125/2 + 500*2/3 + 500*2/3 + 500*2/3 + 500*2/3 + 500*2/3)
			spawnEnemyA(rightMargin/2-20, 500+15*500+11*250+22*125/2 + 500*2/3 + 500*2/3 + 500*2/3 + 500*2/3 + 500*2/3 + 500*2/3)
			spawnEnemyA(rightMargin*4/5, 500+15*500+11*250+22*125/2 + 500*2/3 + 500*2/3 + 500*2/3 + 500*2/3 + 500*2/3 + 500*2/3 + 500*2/3)
			
			for(i=0;i<8;i++){
				spawnEnemyA(rightMargin/2-20-Math.sin(i)*100, 14458+500*2/3 + i*500/3)
			}
			for(i=0;i<5;i++){
				spawnEnemyA(rightMargin/2-20-Math.sin(7)*100-Math.cos(i)*100, 14458+500*2/3 + 8*500/3+i*500/3)
			}
			for(i=0;i<6;i++){
				spawnEnemyA(rightMargin/2-Math.cos(i)*100, 14458+500*2/3 + 8*500/3+5*500/3+i*500/3)
			}
			
			spawnEnemyA(rightMargin*1/4-35, 17800 + 400)
			spawnEnemyA(rightMargin*1/4-35, 17800 + 400 + 100)
			
			spawnEnemyA(rightMargin*2/4-35, 18300 + 400)
			spawnEnemyA(rightMargin*2/4-35, 18300 + 400 + 100)
			
			spawnEnemyA(rightMargin*3/4-35, 18800 + 400)
			spawnEnemyA(rightMargin*3/4-35, 18800 + 400 + 100)
			
			
		}
		
		function wave3(){
			
		}
		
		function wave4(){
			spawnEnemyA(85.5,336); spawnEnemyA(162.5,512); spawnEnemyA(267.5,752); spawnEnemyA(323.5,880); spawnEnemyA(386.5,1024); spawnEnemyA(218.5,1440); spawnEnemyA(169.5,1552); spawnEnemyA(113.5,1744); spawnEnemyA(204.5,1952); spawnEnemyA(267.5,2096); spawnEnemyA(309.5,2224); spawnEnemyA(246.5,2368); spawnEnemyA(190.5,2496); spawnEnemyA(134.5,2624); spawnEnemyA(176.5,2752); spawnEnemyA(232.5,2880); spawnEnemyA(281.5,2992); spawnEnemyA(218.5,3136); spawnEnemyA(155.5,3280); spawnEnemyA(162.5,3424); spawnEnemyA(218.5,3552); spawnEnemyA(274.5,3680); spawnEnemyA(330.5,3808); spawnEnemyA(267.5,3952); spawnEnemyA(204.5,4096); spawnEnemyA(148.5,4224); spawnEnemyA(155.5,4336); spawnEnemyA(225.5,4496); spawnEnemyA(288.5,4640); spawnEnemyA(316.5,4768); spawnEnemyA(239.5,4944); spawnEnemyA(183.5,5072); spawnEnemyA(120.5,5216); spawnEnemyA(176.5,5344); spawnEnemyA(246.5,5504); spawnEnemyA(309.5,5648); spawnEnemyA(309.5,5808); spawnEnemyA(246.5,5952); spawnEnemyA(176.5,6112); spawnEnemyA(134.5,6240); spawnEnemyA(204.5,6400); spawnEnemyA(274.5,6560); spawnEnemyA(337.5,6704); spawnEnemyA(295.5,6832); spawnEnemyA(225.5,6992); spawnEnemyA(162.5,7136); spawnEnemyA(71.5,7344); spawnEnemyA(295.5,7856); spawnEnemyA(162.5,8160); spawnEnemyA(316.5,8512); spawnEnemyA(127.5,8944); spawnEnemyA(358.5,9280); spawnEnemyA(105.5,9648); spawnEnemyA(347.5,10000); spawnEnemyA(113.5,10416); spawnEnemyA(344.5,10752); spawnEnemyA(91.5,11120); spawnEnemyA(388.5,11552); spawnEnemyA(102.5,11968); spawnEnemyA(377.5,12368); spawnEnemyA(124.5,12736); spawnEnemyA(333.5,13040); spawnEnemyA(179.5,13264); spawnEnemyA(307.5,13440); spawnEnemyA(197.5,13600); spawnEnemyA(263.5,13696); spawnEnemyA(219.5,13760); spawnEnemyA(252.5,13808); spawnEnemyA(238.5,13840); spawnEnemyA(238.5,13888); spawnEnemyA(238.5,13936);
		}
		
		//wave4();
		
	function playMenuBGM(){
		menuBGM.currentTime = 0;
		menuBGM.volume = 0.8*globalVolume*musicVolume;
		menuBGM.loop = true;
		menuBGM.play();
	}
	playMenuBGM();
	
	function init()
	{
	//////////
	//SOURCES

	
	sidebar.src = 'backgrounds/ranking-panel.png';
	playerSprite1.src = 'game sprites/fruit-plate.png';
	playerSprite1_i.src = 'game sprites/fruit-plate-i.png';
	playerSprite2.src = 'game sprites/fruit-plate-2.png';
	playerSprite2_i.src = 'game sprites/fruit-plate-2-i.png';
	flash1.src = 'game sprites/flash-1.png';
	flash2.src = 'game sprites/flash-2.png';
	verticalFlash.src = 'game sprites/mania-stage-light.png';
	bulletRed.src = 'game sprites/bullet-red.png';
	bulletYellow.src = 'game sprites/bullet-yellow.png';
	bulletCyan.src = 'game sprites/bullet-cyan.png';
	bulletBlue.src = 'game sprites/bullet-blue.png';
	menuTutorial.src = 'menu/tutorial.png';
	menuPlay.src = 'menu/play.png';
	menuShop.src = 'menu/shop.png';
	menuPractice.src = 'menu/practice.png';
	menuOptions.src = 'menu/options.png';
	menuCredits.src = 'menu/credits.png';
	menuExtra.src = 'menu/extrastages.png';
	menuEditor.src = 'menu/editor.png';
	menuBg.src = 'backgrounds/menubg.png';
	menuGradient.src = 'backgrounds/grad.png';
	menuGradient_i.src = 'backgrounds/grad-i.png';
	background[0].src = 'backgrounds/gboy.png';
	background_i[0].src = 'backgrounds/gboy.png';
	background[1].src = 'backgrounds/bluefloral.jpg';
	background_i[1].src = 'backgrounds/bluefloral-i.png';
	titleGlow.src = 'menu/title-glow.png';

	//laser.src = 'laser.png';

	if(typeof game_loop != "undefined") clearInterval(game_loop);
		game_loop = setInterval(paint, 16);
	}
	init();

	
	
	
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//PAINT     PAINT     PAINT     PAINT     PAINT     PAINT     PAINT     PAINT     PAINT     PAINT     PAINT     PAINT     PAINT     PAINT     PAINT     PAINT     PAINT     PAINT     PAINT     PAINT     PAINT     \\
	//PAINT     PAINT     PAINT     PAINT     PAINT     PAINT     PAINT     PAINT     PAINT     PAINT     PAINT     PAINT     PAINT     PAINT     PAINT     PAINT     PAINT     PAINT     PAINT     PAINT     PAINT     \\
	//PAINT     PAINT     PAINT     PAINT     PAINT     PAINT     PAINT     PAINT     PAINT     PAINT     PAINT     PAINT     PAINT     PAINT     PAINT     PAINT     PAINT     PAINT     PAINT     PAINT     PAINT     \\
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	function paint()
	{
		ctx.fillStyle = 'black'
		ctx.globalAlpha = 1;
		ctx.fillRect(0,0,w,h);
		
		if(framePage == 0){			//MENU SCREEN
			
			levelTime = 0;
			attempts = 0;

			//music
			if(oriens.volume > 0.004){							//stops playing music (gradually)
					oriens.volume -= 0.004
			}else {
				oriens.volume = 0;		//stops volume from going below 1; crashes otherwise - also makes sure volume is at 0, rather than 0.00399999999...
				oriens.pause();
			}
			if(henrietta.volume > 0.004){							//stops playing music (gradually)
					henrietta.volume -= 0.004
			}else {
				henrietta.volume = 0;
				henrietta.pause();
			}
			if(menuBGM.paused == true || menuBGM.volume !== 0.8*globalVolume*musicVolume){
				menuBGM.currentTime = 0;
				menuBGM.play();
				menuBGM.volume = 0.8*globalVolume*musicVolume;
			}

			//background
			ctx.globalAlpha = 1;
			ctx.drawImage(menuBg,0,0,w,h);
			ctx.drawImage(menuGradient,0,0,w,h+70);
			//background dim
			ctx.globalAlpha = 0.3;
			ctx.fillStyle = 'black';
			ctx.fillRect(0,0,w,h);
			ctx.globalAlpha = 1;

			//title
			ctx.drawImage(titleGlow,0,100,w,50)
			ctx.font = 'bold 40pt Tahoma'
			ctx.fillStyle = titleGradient;
			ctx.textAlign = "left";
			ctx.fillText("Catch the Bullet",60,150)

			//double triangles
			ctx.fillStyle = 'lightgrey';
			ctx.moveTo(60,h-100);
			ctx.lineTo(45,h-85);
			ctx.lineTo(60,h-70);
			ctx.closePath();
			ctx.fill();

			ctx.moveTo(60+163,h-100);
			ctx.lineTo(75+163,h-85);
			ctx.lineTo(60+163,h-70);
			ctx.closePath();
			ctx.fill();

			ctx.fillStyle = 'white';
			ctx.globalAlpha = 0.2;
			ctx.fillRect(65,h-105,153,40)

			//menu selection
			ctx.globalAlpha = 1;
			ctx.font = '30pt Arial'
			ctx.textAlign = "center";
			switch(menuSelect) {
				case 1:
					ctx.fillStyle = 'lightgreen';
					ctx.fillText("Tutorial",141,h-70)
					ctx.drawImage(menuTutorial,365,200, 200,200)
					break;

				case 2:
					ctx.fillStyle = 'cyan';
					ctx.fillText("Play",141,h-70)
					ctx.drawImage(menuPlay,350,200, 200,200)
					break;

				case 3:
					ctx.fillStyle = 'gold';
					ctx.fillText("Shop",141,h-70)
					ctx.drawImage(menuShop,385,200, 200,200)
					break;

				case 4:
					ctx.fillStyle = 'red';
					ctx.fillText("Practice",141,h-70)
					ctx.drawImage(menuPractice,350,200, 200,200)
					break;

				case 5:
					if(unlock1 == false){
						ctx.fillStyle = 'white';
						ctx.fillText("???",141,h-70);
					}else if(unlock1 == true){
						ctx.font = '20pt Arial';
						ctx.fillStyle = 'Magenta';
						ctx.fillText("Extra Stages",142,h-75)
						ctx.globalAlpha = 1;
						ctx.drawImage(menuExtra,350,200, 200,200)
						ctx.globalAlpha = 1;
					}
					break;

				case 6:
					ctx.fillStyle = 'white';
					ctx.fillText("Options",141,h-70)
					ctx.drawImage(menuOptions,350,200, 200,200)
					break;

				case 7:
					ctx.fillStyle = 'white';
					ctx.fillText("Credits",141,h-70)
					ctx.drawImage(menuCredits,350,200, 200,200)
					break;
					
				case 8:
					ctx.fillStyle = 'lightblue';
					ctx.font = '21pt Arial';
					ctx.fillText("Level Editor",141,h-74)
					ctx.drawImage(menuEditor,350,200, 200,200)
					break;
			}
			
			//menu dots
			for(i=0; i<8; i++){
				ctx.fillStyle = 'grey'
				ctx.fillRect(48+i*25.5,430,8,8)
				if(menuSelect == i+1){
					switch(menuSelect){
						case 1:
							ctx.fillStyle = 'lightgreen';
							break;
						case 2:
							ctx.fillStyle = 'cyan';
							break;
						case 3:
							ctx.fillStyle = 'gold';
							break;
						case 4:
							ctx.fillStyle = 'red';
							break;
						case 5:
							if(unlock1 == false){
								ctx.fillStyle = 'white';
							}else if(unlock1 == true){ctx.fillStyle = 'Magenta'}
							break;
						case 6:
							ctx.fillStyle = 'white';
							break;
						case 7:
							ctx.fillStyle = 'white';
							break;
						case 8:
							ctx.fillStyle = 'lightblue';
							break;
					}
					ctx.fillRect(45+i*25.5,427,14,14)
				}
			}
			
			//Screen Fade Effect
			if(menuFadeIn > 0.01 && startFadingIn == true){
				menuFadeIn-= 0.01;
			}
			//Fade in effect
			ctx.globalAlpha = menuFadeIn;
			ctx.fillStyle = 'black';
			ctx.fillRect(0,0,w,h);
			ctx.fillStyle = 'white';
			ctx.font = '22pt Microsoft YaHei'
			ctx.textAlign = "center";
			ctx.globalAlpha = loadingCircleAlpha;
			ctx.fillText("Loading...",w/2,h/2);
			ctx.globalAlpha = 1;
			
			//LOADING CIRCLE ANIMATION
			if(loadingCircleArc < 2){
				loadingCircleArc+= 0.025;
			}else if(loadingCircleWidth < 14.9){
				loadingCircleWidth += (15-loadingCircleWidth)/10;
			}else if(loadingCircleAlpha > 0.03){
				loadingCircleAlpha -= 0.03;
			}else {loadingCircleAlpha = 0;}
	
			//Loading Circle
			ctx.beginPath();
			ctx.globalAlpha = loadingCircleAlpha;
			ctx.strokeStyle = 'white';
			ctx.lineWidth = loadingCircleWidth;
			ctx.arc(rightMargin/2+75,h/2-10,100,0,Math.PI*loadingCircleArc);
			ctx.stroke();
	
			//need this bit of code here because without it a grey circle appears in the middle of the screen for some reason
			ctx.globalAlpha = 0;
			ctx.beginPath();
			ctx.globalAlpha = 1;
		}
		
		if(framePage == -1){		//OPTIONS SCREEN
			//background
			ctx.globalAlpha = 1;
			ctx.drawImage(menuBg,0,0,w,h);
			ctx.drawImage(menuGradient,0,0,w,h+70);
			//background dim
			ctx.globalAlpha = 0.3;
			ctx.fillStyle = 'black';
			ctx.fillRect(0,0,w,h);
			ctx.globalAlpha = 1;

			//Selection effect (left side)
			selectionY += ((73+(menuSelect-1)*50) - selectionY)/2.5
			if(menuSelect == 1){
				selectionW -= (selectionW - 226)/2.5
	
			}else if(menuSelect == 2){
				selectionW -= (selectionW - 173)/2.5
	
			}else if(menuSelect == 3){
				selectionW -= (selectionW - 169)/2.5
	
			}else if(menuSelect == 6 && option[6] == "Cheats"){
				selectionW -= (selectionW - 100)/2.5
	
			}else {
				selectionW -= (selectionW - 51)/2.5
			}
			
			if(menuSelect == 1 || menuSelect == 2){
				ctx.fillStyle = 'darkblue'
			}else if(selectedOption == 0){
				ctx.fillStyle = 'darkred'
			}else {ctx.fillStyle = 'darkblue'}

			ctx.fillRect(74, selectionY, selectionW, 39)
			
			//list options
			for(i=1;i<=6;i++){
				ctx.textAlign = 'left'
				if(i == menuSelect){
					ctx.fillStyle = 'white'
				}else {ctx.fillStyle = '#666666'}
				ctx.font = '20pt Microsoft YaHei';
				ctx.fillText(option[i], 80, 100+(i-1)*50)
			}

			ctx.fillStyle = 'white'
			ctx.font = '18pt Microsoft YaHei';
			ctx.fillText("Esc: Back",50,410)
			
			//BACKGROUND DIM
			if(menuSelect == 1){
				ctx.font = '18pt Microsoft YaHei';
				ctx.fillText(Math.floor(backgroundDim*100+0.5) + "%",440, 145)
				backgroundDim = (slider[1]-330)/270
				ctx.fillStyle = 'darkgrey'
				ctx.fillRect(330,84,270,15)
				ctx.fillStyle = 'green'
				ctx.fillRect(330,84,slider[1]-330,15)
				ctx.fillStyle = 'white';
				ctx.fillRect(slider[1]-5,84-15/2,10,30)
				if(clickHold[1] == true && (mx > 330 && mx < 330+270 && my > 65 && my < 117 )){
					slider[1] = mx;
				}else if(clickHold[1] == true && mx < 330 && my > 65 && my < 117 ){
					slider[1] = 330
				}else if(clickHold[1] == true && mx > 330+270 && my > 65 && my < 117 ){
					slider[1] = 330+270
				}
				ctx.font = '14pt Microsoft YaHei';
				ctx.textAlign = 'center'
				ctx.fillText("Adjust to increase object and item visibility",w/2, 450)
				ctx.textAlign = 'left'
				//preview
				ctx.fillStyle = 'lightgrey';
				ctx.fillRect(w/2+25,h/3+5,240,240)
				ctx.drawImage(background[1],w/2+30,h/3+10,230,230);
				ctx.fillStyle = 'black';
				ctx.globalAlpha = backgroundDim;
				ctx.fillRect(w/2+30,h/3+10,230,230);
				ctx.globalAlpha = 1;
				ctx.drawImage(menuGradient,w/2+30,h/3+10,230,230);
			}

			//AUDIO LEVELS
			if(menuSelect == 2){					
				globalVolume = (slider[1]-330)/270
				SFXVolume = (slider[2]-330)/270
				MusicVolume = (slider[3]-330)/270
				
				//Slider 1
				ctx.textAlign = 'center'
				ctx.font = '16pt Microsoft YaHei';
				ctx.fillText("Master Volume",440+24, 50+20)
				
				ctx.fillStyle = 'darkgrey'
				ctx.fillRect(330,84,270,15)
				ctx.fillStyle = 'green'
				ctx.fillRect(330,84,slider[1]-330,15)
				ctx.fillStyle = 'white';
				ctx.fillRect(slider[1]-5,84-15/2,10,30)
				if(clickHold[1] == true && (mx > 330 && mx < 330+270 && my > 65 && my < 117 )){
					slider[1] = mx;
				}else if(clickHold[1] == true && mx < 330 && my > 65 && my < 117 ){
					slider[1] = 330
				}else if(clickHold[1] == true && mx > 330+270 && my > 65 && my < 117 ){
					slider[1] = 330+270
				}
				
				//Slider 2
				ctx.textAlign = 'center'
				ctx.font = '16pt Microsoft YaHei';
				ctx.fillText("Sound Effects Volume",440+24, 125+20)
				
				ctx.fillStyle = 'darkgrey'
				ctx.fillRect(330,84+75,270,15)
				ctx.fillStyle = 'green'
				ctx.fillRect(330,84+75,slider[2]-330,15)
				ctx.fillStyle = 'white';
				ctx.fillRect(slider[2]-5,84+75-15/2,10,30)
				if(clickHold[2] == true && (mx > 330 && mx < 330+270 && my > 65+75 && my < 117+75 )){
					slider[2] = mx;
				}else if(clickHold[2] == true && mx < 330 && my > 65+75 && my < 117+75 ){
					slider[2] = 330
				}else if(clickHold[2] == true && mx > 330+270 && my > 65+75 && my < 117+75 ){
					slider[2] = 330+270
				}
				
				//Slider 3
				ctx.textAlign = 'center'
				ctx.font = '16pt Microsoft YaHei';
				ctx.fillText("Music Volume",440+24, 200+20)
				
				ctx.fillStyle = 'darkgrey'
				ctx.fillRect(330,84+150,270,15)
				ctx.fillStyle = 'green'
				ctx.fillRect(330,84+150,slider[3]-330,15)
				ctx.fillStyle = 'white';
				ctx.fillRect(slider[3]-5,84+150-15/2,10,30)
				if(clickHold[3] == true && (mx > 330 && mx < 330+270 && my > 65+150 && my < 117+150)){
					slider[3] = mx;
				}else if(clickHold[3] == true && mx < 330 && my > 65+150 && my < 117+150){
					slider[3] = 330
				}else if(clickHold[3] == true && mx > 330+270 && my > 65+150 && my < 117+150){
					slider[3] = 330+270
				}
				
				ctx.font = '14pt Microsoft YaHei';
				ctx.textAlign = 'center'
				ctx.fillText("Adjust game audio levels",w/2, 450)
				ctx.textAlign = 'left'
				
			}
			
			//CHEATS			
			if(menuSelect == 6 && option[6] == "Cheats"){
				if(godmode == true){
					ctx.fillStyle = 'darkgreen'
					ctx.fillRect(355, 78,124,30)
				}
				if(unlock1 == true){
					ctx.fillStyle = 'darkgreen'
					ctx.fillRect(355, 78+50,213,30)
				}
				if(easyPing == true){
					ctx.fillStyle = 'darkgreen'
					ctx.fillRect(355, 178,149,30)
				}
				if(BFG == true){
					ctx.fillStyle = 'darkgreen'
					ctx.fillRect(355, 178+50, 56, 30)
				}
				for(i in optionB){
					ctx.textAlign = 'left'
					if(i == menuSelectB || (godmode == true && i == 1) || (unlock1 == true && i == 2) || (easyPing == true && i == 3) || (BFG == true && i == 4)){
						ctx.fillStyle = 'white'
					}else {ctx.fillStyle = '#666666'}
					ctx.font = '16pt Microsoft YaHei';
					ctx.fillText(optionB[i], 362, 100+(i-1)*50)
				}
				ctx.fillStyle = 'white'
				ctx.font = '14pt Microsoft YaHei';
				ctx.textAlign = 'center'
				if(menuSelectB == 1){
					ctx.fillText("Makes it impossible to lose",w/2, 450)
				}else if(menuSelectB == 2){
					ctx.fillText("Unlocks all extra stages early",w/2, 450)
				}else if(menuSelectB == 3){
					ctx.fillText("Removes the challenge from pinging",w/2, 450)
				}else if(menuSelectB == 4){
					ctx.font = 'italic 14pt Microsoft YaHei';
					ctx.fillText('"Big, Uh, Freakin Gun"',w/2, 450)
				}
				if(menuSelect == 6 && menuSelectB < 1){
					ctx.fillStyle = 'Red';
					ctx.font = 'bold 14pt Microsoft YaHei';
					ctx.fillText("Cheater!",w/2, 450)
				}
			}
			if(selectedOption == 6){
				selection2Y += ((78+(menuSelectB-1)*50) - selection2Y)/2.5
				if((menuSelectB == 1 && godmode == true) ||
					(menuSelectB == 2 && unlock1 == true) ||
					(menuSelectB == 3 && easyPing == true) ||
					(menuSelectB == 4 && BFG == true)){
						ctx.fillStyle = 'lightgreen';
				}else {ctx.fillStyle = 'darkred'}
				ctx.fillRect(355,selection2Y,selection2W,30)
				for(i in optionB){
					ctx.textAlign = 'left'
					if(i == menuSelectB || (godmode == true && i == 1) || (unlock1 == true && i == 2) || (easyPing == true && i == 3) || (BFG == true && i == 4)){
						ctx.fillStyle = 'white'
					}else {ctx.fillStyle = '#666666'}
					ctx.font = '16pt Microsoft YaHei';
					ctx.fillText(optionB[i], 362, 100+(i-1)*50)
				}
				if(menuSelectB == 1){
					selection2W -= (selection2W - 124)/2.5
				}else if(menuSelectB == 2){
					selection2W -= (selection2W - 213)/2.5
				}else if(menuSelectB == 3){
					selection2W -= (selection2W - 149)/2.5
				}else if(menuSelectB == 4){
					selection2W -= (selection2W - 56)/2.5
				}
			}
			
			
			
			//ctx.fillStyle = 'white'
			//ctx.fillText("selectedOption: " + selectedOption,200, 420)
			//ctx.fillText("menuSelect: " + menuSelect,200, 435)
			//ctx.fillText("slider[1]: " + slider[1],200, 450)

		}
		
		if(framePage == -2){		//SHOP
			ctx.fillStyle = 'cyan'
			ctx.fillRect(0,0,w,h)
			if(mx > 110 && my > 213 && mx < 110 + 125 && my < 213 + 40){
				ctx.fillStyle = 'white';
			}else {ctx.fillStyle = 'yellow'}
			ctx.fillRect(110,213,125,40)
			
			
			
			ctx.textAlign = 'left'
			ctx.font = '15pt Arial'
			ctx.fillStyle = 'black'
			ctx.fillText("You have " + bombs + " bombs.",60, 140)
			ctx.fillText("buy a bomb",120, 240)
			ctx.fillText("1 bomb costs " + bombPrice + "ms",60, 360)
			ctx.fillText("press C to use a bomb in-game",60, 400)
			if(bombs >= 3){
				ctx.fillStyle = 'red'
				ctx.fillText("you can't carry more than 3",60, 180)
			}
			ctx.fillStyle = 'black'
			ctx.globalAlpha = 1;
			
			ctx.fillText("Time elapsed: " + timeCash + "ms", 300, 245)
			
		}
		
		if(framePage == -3){
			ctx.fillStyle = 'black'
			ctx.fillRect(0,0,w,h);
			ctx.fillStyle = 'magenta'
			ctx.font = '44pt Tahoma'
			ctx.textAlign = 'center'
			ctx.fillText("Extra Stages", w/2, 70)
			
			createButton(0,100,w/2,(h-100)/2, 'grey', 'white')
			createButton(w/2,100,w/2,(h-100)/2, 'grey', 'white')
			createButton(0,100+(h-100)/2,w/2,(h-100)/2, 'grey', 'white')
			createButton(w/2,100+(h-100)/2,w/2,(h-100)/2, 'grey', 'white')
		}
		
		if(framePage > 0){			//GAMEPLAY
			if(BFGing == true){			//cheat gun
				ammo+= 0.5
				if(ammo >= 5){
					bullet.push(new newBullet(
					/* X */ posX + playerWidth/2 - (10+10*ammo)/2,
					/* Y */ posY-60,
					/* VELOCITY */ -20,
					/* SQUARE */10+10*ammo,
					/* TYPE */ undefined,
					/* WIDTH */ undefined,
					/* HEIGHT */ undefined,
					/* DAMAGE */ ammo
					));
				firePlay();
				ammo = 0;
				}
			}
			
			if(loser == false && waveComplete == false){		//cash
				cash += 16
				if(timeFreeze == false && framePage !== 100 && levelTime < winTime && paused == false){
					levelTime += 16
				}
			}
			
			if(levelTime >= winTime){
				waveComplete = true;
			}
			
			
			//Pulsing effect for "Press space to..." dialogues
			//uses sine function to vary transparency
			sfxFadingCycle += 0.1;
			sfxFading = (Math.sin(sfxFadingCycle)+1)/2;

			//stops playing menu music
			if(menuBGM.volume > 0.008){
				menuBGM.volume -= 0.008
			}else {menuBGM.volume = 0}	//makes sure menu music is completely muted

			ctx.textAlign = "left";

			//background
			ctx.globalAlpha = 1;
			switch(framePage){
				case 1:
					ctx.drawImage(background[0],0,0);
					break;
				case 2:
					if(timeFreeze == true){
						ctx.drawImage(background_i[1],0,0);
					}else {ctx.drawImage(background[1],0,0);}
					break;
			}
			//background dim
			ctx.fillStyle = 'black';
			ctx.globalAlpha = backgroundDim;
			ctx.fillRect(0,0,w,h);
			ctx.globalAlpha = 1;
			//playfield gradient
			ctx.fillStyle = 'black';
			if(timeFreeze == true){
				ctx.drawImage(menuGradient_i,0,0,w,h);
				ctx.fillStyle = playfieldGradient_i;
			}else {
				ctx.drawImage(menuGradient,0,0,w,h);
				ctx.fillStyle = playfieldGradient;
			}
			ctx.fillRect(0,0,w,h);

			//player movement
			if(loser == false && paused == false){
				if(moveleft == 1 && posX >= 40){
					playerCenterX = posX - playerWidth/2;
					identifyX = playerCenterX;
					if(boost == 0){
						posX -= playerVelocity									//normal speed
					}
					else if(boost == 1){
						posX -= playerBoostVelocity							//boost
						ghostTrail.push(new newTrail(posX-2,posY))
					}
				}
				if(moveright == 1 && posX <= (rightMargin)-40-playerWidth){
					playerCenterX = posX - playerWidth/2;
					identifyX = playerCenterX;
					if(boost == 0){
						posX += playerVelocity									//normal speed
					}
					else if(boost == 1){
						posX += playerBoostVelocity						//boost
						ghostTrail.push(new newTrail(posX-2,posY))
					}
				}
			}

			/////////////////////
			//LOOP OBJECT METHODS
			if(bullet.length > 0){
				for(i in bullet){		//runs once for every element in array (shorthand form)
					if(typeof bullet[i].damage == "undefined"){
						bullet[i].draw();
					}else {bullet[i].drawSprite();}
					
					if(timeFreeze == false && paused == false){
						bullet[i].move();
					}else if(bullet[i].colour !== 'purple' && timeFreeze == true){
						if(bullet[i].velocity > 0){bullet[i].velocity = 0}
						bullet[i].velocity+= -0.5;
						bullet[i].y+= bullet[i].velocity;
					}
					bullet[i].checkCollision();
				}
			}
			if(spike.length > 0){
				for(i in spike){
					if(spike[i].time <= levelTime){
						spike[i].move();
						spike[i].draw();
						spike[i].collision();
					}
				}
			}
			if(ghostTrail.length > 0){
				for(i in ghostTrail){
					ghostTrail[i].animate();
					ghostTrail[i].frameCounter();
				}
			}
			if(enemyA.length > 0){
				for(i in enemyA){
					if(enemyA[i].spawnTime <= levelTime){
						enemyA[i].draw();
						if(timeFreeze == false && paused == false){
							enemyA[i].move();
						}
						enemyA[i].checkVelocity();
						while(enemyA[i].colour == '#74FFFF' && timeFreeze == false && paused == false){
							enemyA.splice(i, 1);
						}
					}
				}
			}
			if(enemyB.length > 0){
				for(i in enemyB){
					if(enemyB[i].spawnTime <= levelTime){
						enemyB[i].draw();
						if(timeFreeze == false && paused == false){
							enemyB[i].move();
						}
						enemyB[i].checkVelocity();
						while(enemyB[i].colour == '#74FFFF' && timeFreeze == false && paused == false){
							enemyB.splice(i, 1);
						}
					}
				}
			}
			if(enemyC.length > 0){
				for(i in enemyC){
					if(enemyC[i].spawnTime <= levelTime){
						enemyC[i].draw();
						if(timeFreeze == false && paused == false){
							enemyC[i].move();
						}
						enemyC[i].fire();
					}
				}
			}
			if(textMessage.length > 0){
				for(i in textMessage){
					if(textMessage[i].time <= levelTime){
						textMessage[i].drawText();
						textMessage[i].pauseText();
						if(textMessage[i].moving == true && timeFreeze == false && paused == false){
							textMessage[i].move();
						}
					}
				}
			}
			//more methods
			for(i in enemyA){
				test1 = enemyA[i].inBounds();			//idk why test1 is there
				if(test1 == false){							//checks whether enemy has(n't) made it to the bottom
					enemyFlash.push(new newEnemyPass("white", enemyA[i].x))
					enemyA.splice(i,1);
					playerDeathPlay();
					if(framePage !== 1 && godmode == false){
						loser = true;
					}
				}
				for(j=0;j<bullet.length;j++){		//checks collision between every bullet and every enemy
					if(enemyA[i].getHit(bullet[j].x, bullet[j].y, bullet[j].w, bullet[j].h) == true && bullet[j].velocity < 0 && enemyA[i].spawnTime <= levelTime){
						flash.push(new newFlash(2, enemyA[i].x-50, enemyA[i].y-100, 200));
						enemyKillPlay();
						enemyA.splice(i,1);
						bullet.splice(j,1);
					}
				}
			}
			for(i in enemyB){			//almost identical to section immediately above
				test1 = enemyB[i].inBounds();
				if(test1 == false){
					enemyFlash.push(new newEnemyPass("white", enemyB[i].x))
					enemyB.splice(i,1);
					playerDeathPlay();
					if(framePage !== 1 && godmode == false){
						loser = true;
					}
				}
				for(j=0;j<bullet.length;j++){
					if(enemyB[i].getHit(bullet[j].x, bullet[j].y, bullet[j].w, bullet[j].h) == true && bullet[j].velocity < 0 && enemyB[i].spawnTime <= levelTime){
						flash.push(new newFlash(1, enemyB[i].x-50, enemyB[i].y-100, 200));
						enemyKillPlay();
						enemyB.splice(i,1);
						bullet.splice(j,1);
					}
				}
			}
			//Delete off-screen objects
			for(i in enemyC){
				test1 = enemyC[i].inBounds();
				if(test1 == false){
					enemyC.splice(i,1);
				}
			}
			for(i in bullet){
				test = bullet[i].inBounds();
				if(test == false){
					bullet.splice(i,1);
				}
			}
			for(i in flash){
				if(flash[i].frame > 14){
					flash.splice(i,1);
				}
			}
			for(i in ghostTrail){
				if(ghostTrail[i].frame > 9){
					ghostTrail.splice(i,1);
				}
			}
			if(enemyFlash.length > 0){
				for(i in enemyFlash){
					enemyFlash[i].animate();
					if(enemyFlash[i].alpha == 0){
						enemyFlash.splice(i,1);
					}else {enemyFlash[i].fade()}
					if(enemyFlash[i].alpha <= 0){
						enemyFlash.splice(i,1);
					}
				}
			}
			if(boss.length > 0){
				for(i in boss){
					if(boss[i].time <= levelTime){
						if(boss[i].hp >= 0){
							boss[i].phase1();
							boss[i].phase3();
							boss[i].draw();
							boss[i].getHit();
							for(j=0;j<bullet.length;j++){
								if(boss[i].getHit(bullet[j].x, bullet[j].y, bullet[j].w, bullet[j].h) == true && bullet[j].velocity < 0){			//checks collision between boss and player bullet
									flash.push(new newFlash(2, boss[i].x-85, boss[i].y-125, 300));
									bossHurtPlay();
									for(k=0; k<bullet[i].damage*2; k++){
										debris.push(new newDebris(boss[i].x + (boss[i].w)/2, boss[i].y + (boss[i].h)))				//creates debris
									}
									boss[i].hp -= bullet[j].damage;
									bullet.splice(j,1);
									if(boss[i].hp <= 0){
										boss.splice(i,1);
										bossKillPlay();
										setTimeout(function(){waveComplete = true;}, 1000);
									}
								}
							}
						}
					}
				}
			}
			if(debris.length >0){
				for(i in debris){
					debris[i].draw();
					debris[i].move();
				}
			}

			
			//easy ping thing
			if(easyPing == true){
				for(i=0;i<bullet.length;i++){
					if(bullet[i].checkCollision() == true){
						bullet[i].velocity = -18;
						bullet[i].colour = 'red';
						pingPlay();
					}
				}
			}
			
			//FAILURE STATE
			if(loser == true){
				for(i in intervals){
					clearTimeout(intervals[i]);						//stops any future objects from spawning
				}

				if(framePage == 2){oriens.volume = 0.07*globalVolume*musicVolume}

				//Freeze objects
				if(enemyA.length>0){
					for(i in enemyA){
						enemyA[i].velocity = 0;
					}
				}
				if(enemyB.length>0){
					for(i in enemyB){
						enemyB[i].velocity = 0;
					}
				}
				if(enemyC.length>0){
					for(i in enemyC){
						enemyC[i].velocity = 0;
					}
				}
				if(bullet.length>0){
					for(i in bullet){
						bullet[i].velocity = 0;
					}
				}
				if(spike.length>0){
					for(i in spike){
						spike[i].velocity = 0;
					}
				}

				//Display game over screen
				ctx.globalAlpha = 0.75;
				ctx.fillStyle = 'black';
				ctx.fillRect(0,0,w,h)
				ctx.globalAlpha = 1;
				if(enemyFlash.length > 0){		//displays red flash effect on top of dimmed playfield
					for(i in enemyFlash){
						if(enemyFlash[i].alpha <= 0){
							enemyFlash.splice(i,1);
						}
						enemyFlash[i].animate();
						enemyFlash[i].fade();
					}
				}
				ctx.globalAlpha = 1;
				ctx.fillStyle = 'red';
				ctx.textAlign = 'center';
				ctx.font = '35pt Trebuchet MS';
				ctx.fillText("Wave failed",rightMargin/2,h/2);
				ctx.globalAlpha = sfxFading;
				ctx.fillStyle = 'pink';
				ctx.font = '20pt Trebuchet MS';
				ctx.fillText("Press space to retry",rightMargin/2,h/2+30);
				ctx.globalAlpha = 1;
				ctx.fillStyle = 'grey';
				ctx.font = '15pt Trebuchet MS';
				ctx.fillText("or press escape to quit",rightMargin/2,h/2+120);
				ctx.textAlign = 'left';
			}

			//WIN STATE
			if(waveComplete == true){
				for(i in intervals){
					clearTimeout(intervals[i]);						//stops any future objects from spawning
				}
				if(oriens.volume > 0.004){							//stops playing music
					oriens.volume -= 0.004
				}else {oriens.pause()}

				ctx.textAlign = "center";
				ctx.globalAlpha = 1;
				ctx.fillStyle = 'lightblue';
				ctx.font = '30pt Trebuchet MS';
				ctx.fillText("Wave Complete!",rightMargin/2,h/2);
				if(attempts == 1 && framePage != 1){
					ctx.font = 'bold 20pt Trebuchet MS';
					ctx.fillStyle = 'magenta';
					ctx.fillText("First attempt!",rightMargin/2,h/2+40);
				}
				ctx.globalAlpha = sfxFading;
				ctx.font = '20pt Trebuchet MS';
				ctx.fillStyle = 'lightgreen';
				ctx.fillText("Press space to proceed",rightMargin/2,h/2+80);
				ctx.textAlign = "left";
			}



			//DRAW PLAYER
			ctx.globalAlpha = 1
			//ctx.fillRect(posX,posY, playerWidth, playerHeight);					//draw player hitbox
			if(timeFreeze == false){
				if(boost == 1){
					ctx.drawImage(playerSprite2,posX-2,posY,55,15);										//draw player sprite
				}else {ctx.drawImage(playerSprite1,posX-2,posY,55,15);}
			}else if(timeFreeze == true){
				if(boost == 1){
					ctx.drawImage(playerSprite2_i,posX-2,posY,55,15);										//draw player sprite
				}else {ctx.drawImage(playerSprite1_i,posX-2,posY,55,15);}
			}
			

			//loop flash methods (down here because flash must draw above most objects)
			if(flash.length>0){
				for(i in flash){
					flash[i].animate();
					flash[i].frameCounter();
				}
			}

			//COUNTERS
			if(loser == false){
				timeCash += 16;
			}
			ctx.fillStyle = 'white';
			ctx.globalAlpha = 1;
			ctx.fillText("Level Time: " + levelTime, rightMargin-150, 20);
			
			
			//HUD
			ctx.globalAlpha = 1
			ctx.drawImage(sidebar,rightMargin,0);													//side bar
			ctx.fillStyle = 'lightblue';
			if(framePage == 1){
				ctx.font = '24pt Trebuchet MS'
				ctx.fillText("Tutorial",508,85);		//difficulty
			}
			if(framePage == 2){
				ctx.font = '24pt Trebuchet MS'
				ctx.fillText("Stage 1",508,85);
				ctx.font = '20pt Trebuchet MS'
				ctx.fillText("Wave 1",508,135);
			}
			if(ammo < 5){
				for(i=0;i<ammo*8;i++){
					ctx.fillStyle = 'cyan';
					ctx.fillRect(547 + i*2, 380, 1, 30);
				}
			} else if(ammo >= 5){
				for(i=0;i<5*8;i++){
					ctx.fillStyle = 'cyan';
					ctx.fillRect(547 + i*2, 380, 1, 30);
				}
				ctx.fillStyle = 'white';
				ctx.font = '34pt Arial';
				ctx.fillText("+", 595, 411)	;
			}
			ctx.fillStyle = 'cyan';
			ctx.font = '13pt Trebuchet MS'
			ctx.fillText("Bombs:",495,320);
			ctx.fillStyle = 'rgba(35,35,35,1)'
			ctx.fillRect(573,315-16, 40, 32);
			for(i=0; i<3; i++){
				ctx.lineWidth = 0
				ctx.strokeStyle = 'rgba(50,50,50,1)'
				ctx.fillStyle = 'rgba(50,50,50,1)'
				ctx.beginPath();
				ctx.arc(573+i*20,315,8,0,2*Math.PI);
				ctx.stroke();
				ctx.closePath();
				ctx.fill();
			}
			for(i=0; i<bombs; i++){
				ctx.lineWidth = 15
				ctx.strokeStyle = 'white'
				ctx.beginPath();
				ctx.arc(573+i*20,315,3,0,2*Math.PI);
				ctx.stroke();
				ctx.beginPath();
			}

			
			ctx.fillStyle = 'yellow';
			ctx.font = '10pt Trebuchet MS'
			ctx.fillText("Charge:",495,400);
			ctx.font = '20pt Trebuchet MS'
			/* ctx.fillText(score,553,300);													//display score
			ctx.fillText("HI: " + hiscore,510,340);	 */												//display high score

			//Enemy HP bar
			if(typeof boss[0] !== 'undefined'){
				if(boss[0].time <= levelTime){
					ctx.fillStyle = '#FFFF99';
					ctx.fillRect(22,430,7,2)
					ctx.fillRect(22,430,2,30)
					ctx.fillRect(22,458,7,2)
	
					ctx.fillRect(rightMargin - 29,430,7,2)
					ctx.fillRect(rightMargin - 24,430,2,30)
					ctx.fillRect(rightMargin - 29,458,7,2)
					ctx.fillStyle = 'Red';
					ctx.fillRect(30,440,(rightMargin - 60)*((boss[0].hp)/boss[0].maxHP),10);
				}
			}
			
			if(exitCircleRadius > 400){
				ctx.globalAlpha = 1;
				ctx.fillStyle = 'black'
				ctx.fillRect(0,0,w,h);
			}
			ctx.globalAlpha = 1;
			
		}
		
		//Leaving animation
		if(leaving == true){
			if(leaveTimer < 50){
				leaveTimer++;
			}
			if(leaveTimer >= 50){
				exitCircleRadius += (420-exitCircleRadius)/5
			}
			if(exitCircleRadius > 419 && exitCircleAlpha > 0){
				framePage = 0;
				exitCircleAlpha = 0;
				exitDim = 0;
			}
			if(exitCircleAlpha == 0){
				setTimeout(function(){exitCircleAlpha = 1;},16);
				menuFadeIn = 1;
				exitCircleRadius = 100;
				leaving = false;
				leaveTimer = 0;
				paused = false;
				exitDim = 0.4;
			}
			
			ctx.globalAlpha = exitDim;
			ctx.fillStyle = 'black';
			ctx.fillRect(0,0,w,h);
			//ctx.globalAlpha = 1;
			//ctx.fillStyle = 'white';
			//ctx.fillText(leaveTimer,100,200);
			ctx.globalAlpha = exitCircleAlpha;
			//pie circle
			ctx.beginPath();
			ctx.moveTo(w/2,h/2);
			ctx.lineTo(w/2,h/2-100);
			ctx.lineWidth = 2;
			ctx.arc(w/2,h/2,exitCircleRadius,Math.PI*1.5,Math.PI*(2*(leaveTimer/50)+1.5));
			ctx.lineTo(w/2,h/2);
			ctx.lineWidth = 6;
			ctx.strokeStyle = 'white';
			ctx.stroke();
			ctx.fillStyle = 'black';
			ctx.fill();
		}
		
		if(framePage == -10){		//CREDITS
			creditsScroll--
			
			ctx.fillStyle = 'black';
			ctx.fillRect(0,0,w,h);
			
			ctx.fillStyle = 'white';
			ctx.textAlign = 'center';
			ctx.font = 'bold 29pt Microsoft YaHei'
			ctx.fillText("Catch the Bullet", w/2, 50+h+creditsScroll)
			ctx.font = '20pt Microsoft YaHei'
			ctx.fillText("Made by Jun Villa", w/2, 100+h+creditsScroll)
			ctx.fillText("Music:", w/2, 200+h+creditsScroll)
			/* ctx.fillText("Sound effects:", w/2, 250+150)
			ctx.fillText("Sprites:", w/2, 300+150) */
			
			ctx.font = '16pt Microsoft YaHei'
			ctx.fillStyle = 'grey'
			ctx.fillText("Title Screen:", w/2, 250+h+creditsScroll)
			ctx.fillStyle = 'white'
			ctx.fillText("Amuro vs Killer - Mei", w/2, 275+h+creditsScroll)
			
			
			ctx.fillStyle = 'grey'
			ctx.fillText("Tutorial:", w/2, 325+h+creditsScroll)
			ctx.fillStyle = 'white'
			ctx.fillText("Goreshit - Henrietta ('dreambreak' mix)", w/2, 350+h+creditsScroll)
			
			ctx.fillStyle = 'grey'
			ctx.fillText("Stage 1:", w/2, 400+h+creditsScroll)
			ctx.fillStyle = 'white'
			ctx.fillText("ginkiha - Oriens", w/2, 425+h+creditsScroll)
			
			ctx.fillStyle = 'grey'
			ctx.fillText("Stage 2:", w/2, 475+h+creditsScroll)
			ctx.fillStyle = 'white'
			ctx.fillText("dunno yet", w/2, 500+h+creditsScroll)
			
			ctx.fillStyle = 'grey'
			ctx.fillText("Stage 3:", w/2, 550+h+creditsScroll)
			ctx.fillStyle = 'white'
			ctx.fillText("idk", w/2, 575+h+creditsScroll)
			
		}
		
		if(framePage == 100){		//LEVEL EDITOR
			godmode = true;
			
			//editor timeline bar
			ctx.fillStyle = editorTimeGradient;
			if(timeStamp/determineLevelLength() < 1){
				ctx.fillRect(0,0,rightMargin*(timeStamp/determineLevelLength() )   ,h);
			}else {ctx.fillRect(0,0,rightMargin,h)}
			ctx.fillStyle = 'white';
			
			//check when to move time forward
			if(testRunning == false){
				if(    (moveleft == 1 || moveright == 1) && (moveleft+moveright !== 2)    ){
					if(forward == false && editMode == 1){
						timeStamp += 1;
						
					}
				}
				if(forward == true){
					timeStamp += 1
				}
				if(rewind == true){
					if(enemyA.length == 0){
						timeStamp -= 1
					}
				}
			}
			
			if(testRunning == true){
					timeStamp += 1
					if(timeStamp >= determineLevelLength()){
						testRunning = false;
					}
			}
			
			ctx.globalAlpha = 1;
			ctx.fillStyle = 'white';
			//object silhouettes
			for(i in enemyPlacementAX){
				if(enemyPlacementASelect[i] == true){
					ctx.globalAlpha = 0.9;
				}else {ctx.globalAlpha = 0.2;}
				ctx.fillStyle = 'yellow';
				var coordy;
				coordy = (timeStamp - enemyPlacementTimeA[i])*10;
				ctx.fillRect(enemyPlacementAX[i],coordy,15,15)
			}
			for(i in enemyPlacementA2X){
				if(enemyPlacementA2Select[i] == true){
					ctx.globalAlpha = 0.9;
				}else {ctx.globalAlpha = 0.2;}
				ctx.fillStyle = 'lightgrey';
				var coordy;
				coordy = (timeStamp - enemyPlacementTimeA2[i])*10;
				ctx.fillRect(enemyPlacementA2X[i],coordy,15,15)
			}
			for(i in enemyPlacementBX){
				if(enemyPlacementBSelect[i] == true){
					ctx.globalAlpha = 0.9;
				}else {ctx.globalAlpha = 0.2;}
				ctx.fillStyle = 'orange';
				var coordy;
				coordy = (timeStamp - enemyPlacementTimeB[i])*10;
				ctx.fillRect(enemyPlacementBX[i],coordy,15,15)
			}
			for(i in enemyPlacementCX){
				if(enemyPlacementCSelect[i] == true){
					ctx.globalAlpha = 0.9;
				}else {ctx.globalAlpha = 0.4;}
				ctx.fillStyle = 'green';
				var coordy;
				coordy = (timeStamp - enemyPlacementTimeC[i])*10;
				ctx.fillRect(enemyPlacementCX[i],coordy,15,15)
			}
			for(i in spikePlacementX){
				if(spikePlacementSelect[i] == true){
					ctx.globalAlpha = 0.9;
				}else {ctx.globalAlpha = 0.2;}
				ctx.fillStyle = 'white';
				var coordy;
				coordy = (timeStamp - spikePlacementTime[i])*10;
				ctx.fillRect(spikePlacementX[i],coordy,15,15)
			}
			ctx.globalAlpha = 1;
			ctx.fillStyle = 'white';
			//GUI
			ctx.globalAlpha = 0.35;
			ctx.font =  '25pt Trebuchet MS';
			ctx.fillText("Current time: " + timeStamp + "ms",20,350);
			ctx.font =  '17pt Trebuchet MS';
			ctx.fillText("Timing Interval: " + timingLeniency + "ms",20,375);
			ctx.textAlign = 'right';
			if(determineLevelLength() > 0){
				ctx.fillText(Math.floor(determineLevelLength()) + "ms", rightMargin-3, 440);
			}else ctx.fillText(0 + "ms", rightMargin-3, 440);				//prevents -infinity being displayed
			ctx.textAlign = 'left';
			ctx.globalAlpha = 1;
			
			//selected object indicator
			if(testRunning == false){
				switch(selectedObject){
					case 1:		//enemyA
						ctx.fillStyle = 'red';
						ctx.globalAlpha = 0.7;
						ctx.fillRect(posX + playerWidth/2 -25,0,50,25);
						break;
					case 2:		//enemyA2
						ctx.fillStyle = 'orange';
						ctx.globalAlpha = 0.7;
						ctx.fillRect(posX + playerWidth/2 -25,0,50,25);
						break;
					case 3:		//enemyB
						ctx.fillStyle = 'green';
						ctx.globalAlpha = 0.7;
						ctx.fillRect(posX + playerWidth/2 - 7.5,0,15,15);
						break;
					case 4:		//enemyC
						ctx.fillStyle = 'lightgrey';
						ctx.globalAlpha = 0.7;
						ctx.fillRect(posX + playerWidth/2 -25,0,50,25);
						break;
					case 5:		//spike
						ctx.fillStyle = 'white';
						ctx.globalAlpha = 0.7;
						ctx.fillRect(posX + playerWidth/2 - 7.5,0,15,15);
						break;
				}
			}
			ctx.globalAlpha = 1;
			ctx.fillStyle = 'lightgreen';
			ctx.font = '18pt Comic Sans MS';
			ctx.fillText("Level Editor",495,90);
			ctx.font = '10pt Comic Sans MS';
			ctx.fillText("Z: forward time",490,130+0*40);
			ctx.fillText("X: rewind time",490,130+1*40);
			ctx.fillText("Q: jump to start",490,130+2*40);
			ctx.fillText("1-5: cycle thru objects",490,130+3*40);
			ctx.fillText("Space: place object",490,130+4*40);
			ctx.fillText("R: test level",490,130+5*40);
			ctx.fillText("i: more controls",490,130+6*40);
			ctx.fillStyle = 'cyan';
			ctx.fillText("Object Count: " + (enemyPlacementTimeA.length + enemyPlacementTimeA2.length + enemyPlacementTimeB.length + enemyPlacementTimeC.length + spikePlacementTime.length), 490, 440)
			if(editMode == 1){
				ctx.fillText("Time Helper: On", 488, 460);
			}else ctx.fillText("Time Helper: Off", 488, 460);
			ctx.fillStyle = 'lightgreen';
			ctx.fillText("When finished, press P to export level code",20,460);
			
			
			//deletering
			if(deleting == true){
				for(i in enemyPlacementAX){
					if(mx > enemyPlacementAX[i] && mx < enemyPlacementAX[i] + 15 && my > (timeStamp - enemyPlacementTimeA[i])*10 && my < (timeStamp - enemyPlacementTimeA[i])*10+15){
						enemyPlacementASelect.splice(i,1);
						enemyPlacementAX.splice(i,1);
						enemyPlacementTimeA.splice(i,1);
					}
				}
				for(i in enemyPlacementA2X){
					if(mx > enemyPlacementA2X[i] && mx < enemyPlacementA2X[i] + 15 && my > (timeStamp - enemyPlacementTimeA2[i])*10 && my < (timeStamp - enemyPlacementTimeA2[i])*10+15){
						enemyPlacementA2Select.splice(i,1);
						enemyPlacementA2X.splice(i,1);
						enemyPlacementTimeA2.splice(i,1);
					}
				}
				for(i in enemyPlacementBX){
					if(mx > enemyPlacementBX[i] && mx < enemyPlacementBX[i] + 15 && my > (timeStamp - enemyPlacementTimeB[i])*10 && my < (timeStamp - enemyPlacementTimeB[i])*10+15){
						enemyPlacementBSelect.splice(i,1);
						enemyPlacementBX.splice(i,1);
						enemyPlacementTimeB.splice(i,1);
					}
				}
				for(i in enemyPlacementCX){
					if(mx > enemyPlacementCX[i] && mx < enemyPlacementCX[i] + 15 && my > (timeStamp - enemyPlacementTimeC[i])*10 && my < (timeStamp - enemyPlacementTimeC[i])*10+15){
						enemyPlacementCSelect.splice(i,1);
						enemyPlacementCX.splice(i,1);
						enemyPlacementTimeC.splice(i,1);
					}
				}
				for(i in spikePlacementX){
					if(mx > spikePlacementX[i] && mx < spikePlacementX[i] + 15 && my > (timeStamp - spikePlacementTime[i])*10 && my < (timeStamp - spikePlacementTime[i])*10+15){
						spikePlacementSelect.splice(i,1);
						spikePlacementX.splice(i,1);
						spikePlacementTime.splice(i,1);
					}
				}
			}
			//moving
			for(i in enemyPlacementASelect){
				if(enemyPlacementASelect[i] == true){
					ctx.fillText("Selected: A-" + i, 10, 30)
					enemyPlacementAX[i] = mx - 7.5
					enemyPlacementTimeA[i] = timeStamp - my/10 + 7.5/10
				}
			}
			for(i in enemyPlacementA2Select){
				if(enemyPlacementA2Select[i] == true){
					ctx.fillText("Selected: A2-" + i, 10, 30)
					enemyPlacementA2X[i] = mx - 7.5
					enemyPlacementTimeA2[i] = timeStamp - my/10 + 7.5/10
				}
			}
			for(i in enemyPlacementBSelect){
				if(enemyPlacementBSelect[i] == true){
					ctx.fillText("Selected: B-" + i, 10, 30)
					enemyPlacementBX[i] = mx - 7.5
					enemyPlacementTimeB[i] = timeStamp - my/10 + 7.5/10
				}
			}
			for(i in enemyPlacementCSelect){
				if(enemyPlacementCSelect[i] == true){
					ctx.fillText("Selected: C-" + i, 10, 30)
					enemyPlacementCX[i] = mx - 7.5
					enemyPlacementTimeC[i] = timeStamp - my/10+ 7.5/10
				}
			}
			for(i in spikePlacementSelect){
				if(spikePlacementSelect[i] == true){
					ctx.fillText("Selected: Spike-" + i, 10, 30)
					spikePlacementX[i] = mx - 7.5
					spikePlacementTime[i] = timeStamp - my/10 + 7.5/10
				}
			}
		}	//end level editor page
		
		
		//DEBUG TOOL
		//press M, enter a variable you want to monitor
		//the target variable is displayed in the top left corner
		ctx.globalAlpha = 1;
		ctx.textAlign = 'left'
		ctx.font = '13pt Arial'
		debugVariable = eval(targetDebugVariable);
		if(typeof debugVariable !== 'undefined'){
			ctx.fillText(debugVariable,10,20)
		}
		
		//screen dim thing
		ctx.globalAlpha = screenDim;
		ctx.fillStyle = 'black';
		ctx.fillRect(0,0,w,h);
		ctx.globalAlpha = 1;
		
/* 		//coordinate helpers
		ctx.textAlign = 'left';
		ctx.font = '7 pt Arial'
		ctx.fillStyle = 'white'
		ctx.fillText("X: ",10,30)
		ctx.fillText("Y: ",120,30)
		ctx.fillStyle = 'red'
		ctx.fillText(identifyX,40,30)
		ctx.fillStyle = 'yellow'
		ctx.fillText(identifyY,150,30)
		// ctx.textAlign = 'left'
		// ctx.fillText(framePage + " " + menuSelect, 20,h-40)
		
		ctx.fillText(screenDim,50,50)
		ctx.fillText(menuFadeIn,50,80) */
	
		
	
	
	}////////////////////////////////////////////////////////////////////////////////END PAINT/ GAME ENGINE

	/////////////////
	// Mouse Click
	///////////////
	
	
	canvas.addEventListener ('mousedown', function(evt){
		if(framePage == -1){
			if(mx > 330 && mx < 330+270 && my > 65 && my < 117 && clickHold[1] == false){
				clickHold[1] = true;
			}else if(mx > 330 && mx < 330+270 && my > 65+75 && my < 117+75 && clickHold[2] == false){
				clickHold[2] = true;
			}else if(mx > 330 && mx < 330+270 && my > 65+150 && my < 117+150 && clickHold[3] == false){
				clickHold[3] = true;
			}
		}
		if(framePage == 100){
			ctx.fillStyle = 'white'
			ctx.globalAlpha = 1;
			for(i in enemyPlacementASelect){
				if(mx > enemyPlacementAX[i] && mx < enemyPlacementAX[i] + 15 && my > (timeStamp - enemyPlacementTimeA[i])*10 && my < (timeStamp - enemyPlacementTimeA[i])*10+15){
					enemyPlacementASelect[i] = true;
				}
			}
			for(i in enemyPlacementA2Select){
				if(mx > enemyPlacementA2X[i] && mx < enemyPlacementA2X[i] + 15 && my > (timeStamp - enemyPlacementTimeA2[i])*10 && my < (timeStamp - enemyPlacementTimeA2[i])*10+15){
					enemyPlacementA2Select[i] = true;
				}
			}
			for(i in enemyPlacementBSelect){
				if(mx > enemyPlacementBX[i] && mx < enemyPlacementBX[i] + 15 && my > (timeStamp - enemyPlacementTimeB[i])*10 && my < (timeStamp - enemyPlacementTimeB[i])*10+15){
					enemyPlacementBSelect[i] = true;
				}
			}
			for(i in enemyPlacementCSelect){
				if(mx > enemyPlacementCX[i] && mx < enemyPlacementCX[i] + 15 && my > (timeStamp - enemyPlacementTimeC[i])*10 && my < (timeStamp - enemyPlacementTimeC[i])*10+15){
					enemyPlacementCSelect[i] = true;
				}
			}
			for(i in spikePlacementSelect){
				if(mx > spikePlacementX[i] && mx < spikePlacementX[i] + 15 && my > (timeStamp - spikePlacementTime[i])*10 && my < (timeStamp - spikePlacementTime[i])*10+15){
					spikePlacementSelect[i] = true;
				}
			}
			
		}
		if(framePage == -2){		//shop
			if(testMouseRect(110,213,125,40) == true){
				if(bombs < 3 && timeCash >= bombPrice){
					bombs++;
					timeCash -= bombPrice;
				}
			}
		}
		}, false);
	canvas.addEventListener ('mouseup', function(evt){
		if(framePage == -1){
			if(clickHold[1] == true){
				clickHold[1] = false;
			}
			if(clickHold[2] == true){
				clickHold[2] = false;
			}
			if(clickHold[3] == true){
				clickHold[3] = false;
			}
		}
		if(framePage == 100){
			for(i in enemyPlacementASelect){
				enemyPlacementASelect[i] = false;
			}
			for(i in enemyPlacementA2Select){
				enemyPlacementA2Select[i] = false;
			}
			for(i in enemyPlacementBSelect){
				enemyPlacementBSelect[i] = false;
			}
			for(i in enemyPlacementCSelect){
				enemyPlacementCSelect[i] = false;
			}
			for(i in spikePlacementSelect){
				spikePlacementSelect[i] = false;
			}
		}

	}, false);
	
	canvas.addEventListener('click', function (evt){
		identifyX = mx;
		identifyY = my;
	}, false);
	canvas.addEventListener ('mouseout', function(){pause = true;}, false);
	canvas.addEventListener ('mouseover', function(){pause = false;}, false);
    canvas.addEventListener('mousemove', function(evt) {
        var mousePos = getMousePos(canvas, evt);

		mx = mousePos.x;
		my = mousePos.y;

      	}, false);

	canvas.addEventListener ('mousewheel', function(evt){
		var delta = Math.max(-1, Math.min(1, (evt.wheelDelta || -e.detail)));
		if(framePage == 100){
			if(delta == 1){
				timeStamp += 5;
			}else {timeStamp -= 5;}
		}
	}, false);
	function getMousePos(canvas, evt)
	{
	        var rect = canvas.getBoundingClientRect();
        	return {
          		x: evt.clientX - rect.left,
          		y: evt.clientY - rect.top
        		};
   	}


	///////////////////////////////////
	//////////////////////////////////
	////////	KEY BOARD INPUT
	////////////////////////////////
	var arrowDown = 40
	var arrowUp = 38
	
	//bomb function
	function kaboom(){
		bombs--;
		freeze.play();
		timeFreeze = true;
		setTimeout(function(){
			timeFreeze = false;
		}, 1000);
		for(i in bullet){
			bullet[i].colour = 'red'
		}
		for(i in enemyA){
			if(enemyA[i].spawnTime <= levelTime){
				enemyA[i].colour = '#74FFFF';
			}
		}
		for(i in enemyB){
			if(enemyB[i].spawnTime <= levelTime){
				enemyB[i].colour = '#74FFFF';
			}
		}
		setTimeout(function(){
			
		},999)
		setTimeout(function(){
			for(i in enemyA){
				if(enemyA[i].colour == '#74FFFF'){
					flash.push(new newFlash(1, enemyA[i].x-50, enemyA[i].y-100, 200));
					enemyA.splice(i, 1);
				}
			}
			for(i in enemyB){
				if(enemyB[i].colour == '#74FFFF'){
					flash.push(new newFlash(1, enemyB[i].x-50, enemyB[i].y-100, 200));
					enemyB.splice(i, 1);
				}
			}
			shatter.play();
		},1000)
	}
	
	
	window.addEventListener('keydown', function(evt){ 
		var key = evt.keyCode;
		//alert(key)		
		if(lockControls == false){
			if(key == 77){		//M mute
				if(menuBGM.muted == false){
					menuBGM.muted = true;
				}else menuBGM.muted = false;
			}
			
			if(framePage == 0){												//MENU NAVIGATION
				if(key == 39 && rightKeyDown == false){		//right
					rightKeyDown = true;
					menuCyclePlay();
					if(menuSelect == 8){
						menuSelect = 1
					}else menuSelect++
				}
				if(key == 37 && leftKeyDown == false){			//left
					leftKeyDown = true;
					menuCyclePlay();
					if(menuSelect == 1){
						menuSelect = 8
					}else menuSelect--
				}
				if(key == 32 || key == 13){							//space/enter
					switch(menuSelect){
						case 1:		//TUTORIAL
							lockControls = true;
							menuHit.play();
							screenTransition(1250);
							setTimeout(function(){loadTutorial()},1250/2);
							break;
		
						case 2:		//PLAY
							lockControls = true;
							menuHit.play();
							screenTransition(1250);
							setTimeout(function(){loadStage1()},1250/2);
							break;
		
						case 3:		//SHOP
							framePage = -2;
							break;
		
						case 4:		//PRACTICE
							break;
		
						case 5:		//EXTRA STAGES
							screenTransition(1250);
							setTimeout(function(){framePage = -3},1250/2);
							break;
		
						case 6:		//OPTIONS
							framePage = -1;
							menuSelect = 0;
							setTimeout(function(){menuSelect = 1}, 0.5);
							break;
		
						case 7:		//CREDITS
							creditsScroll = 0;
							framePage = -10;
							break;
						
						case 8:		//LEVEL EDITOR
							screenTransition(1250);
							setTimeout(function(){framePage = 100;},1250/2);
							menuHit.play();
							break;
					}
				}
			}
		
			if(framePage == -1){											//OPTIONS NAVIGATION
				if(key == arrowDown){							//down
					menuCyclePlay();
					if(selectedOption == 0){
						if(menuSelect == 6){
							menuSelect = 1
						}else menuSelect++					
					}else {
						if(menuSelectB == 4){
							menuSelectB = 1;
						}else menuSelectB++;
					}
					
					if(menuSelect == 1){
						slider[1] = 330+270*globalVolume;
						slider[2] = 330+270*SFXVolume;
						slider[3] = 330+270*MusicVolume;
					}else if(menuSelect == 6){
						slider[1] = 330+270*backgroundDim;
					}
					
				}
				if(key == arrowUp){							//up
					menuCyclePlay();
					if(selectedOption == 0){
						if(menuSelect == 1){
							menuSelect = 6
						}else menuSelect--					
					}else {
						if(menuSelectB == 1){
							menuSelectB = 4;
						}else menuSelectB--;
					}
					
					if(menuSelect == 3){
						slider[1] = 330+270*globalVolume;
					}else if(menuSelect == 2){
						slider[1] = 330+270*backgroundDim;
					}
					
				}
				if(key == 32 || key == 13){							//SPACE/ENTER		SELECT
					switch(menuSelect){						//left side
						case 1:
							break;
		
						case 2:
							break;
		
						case 3:
							break;
		
						case 4:
							break;
		
						case 5:
							break;
		
						case 6:
							unlockCheats++;
							if(unlockCheats == 20){
								setTimeout(function(){option[6] = "Cheats";},1);			//activates cheat mode 1ms later, without this the next selection would simultaneously be pressed
								cheetah.play();
								menuBGM.pause();
							}
							if(option[6] == "Cheats"){
								if(selectedOption == 0){
									selection2Y = 78;
									selectedOption = 6;
									setTimeout(function(){menuSelectB = 1;},1)
								}
							}
							break;
					}
					switch(menuSelectB){				//cheats
						case 1:
							if(godmode == false){
								godmode = true;
							}else godmode = false;
							break;
		
						case 2:
							if(unlock1 == false){
								unlock1 = true;
							}else unlock1 = false;
							break;
		
						case 3:
							if(easyPing == false){
								easyPing = true;
							}else easyPing = false;
							break;
							
						case 4:
							if(BFG == false){
								BFG = true;
							}else BFG = false;
							break;
					}
				}
				if(key == 27){												//esc: back
					if(selectedOption !== 0){
						selectedOption = 0;
						menuSelectB = 0;
					}else {
						framePage = 0;
						menuSelect = 6;
						menuFadeIn = 0;
					}
				}
			}
			
			if(framePage > 0){												//GAME CONTROLS
				if(key == 37 && paused == false){			//move left
					moveleft = 1;
				}
				if(key == 39 && paused == false){			//move right
					moveright = 1;
				}
				if(key == 16 && paused == false){				//SHIFT: boost
					boost = 1;
				}
				if(key == 88 || key == 90 && loser == false){			//Z/X: action
					bullet.push(new newBullet(posX + playerWidth/2 - 5, 400, -20));		//creates new entity of bullet. parameter specifies player's x position at time of pressing key
					hold = true;
					if(BFG == true && BFGing == false){
						BFGing = true;
					}
					for(i=0;i<bullet.length;i++){
						if(bullet[i].checkCollision() == true){
							bullet[i].velocity = -18;
							bullet[i].colour = 'red';
							pingPlay();
						}
					}
				}
				if(key == 67){			//Bomb
					if(bombs > 0 && timeFreeze == false && loser == false){
						kaboom();
					}
				}
				if(key == 32){								//space, reset game
					if(loser == true){
						retry.play();
						waveOffset = -500;
						oriens.volume = 0.6*globalVolume*musicVolume;
						restartGame(1);
					}
					if(waveComplete == true){
						waveComplete = false;
						screenTransition(1500)
						setTimeout(function(){playMenuBGM();framePage = 0},750)
					}
				}
				if(key == 27 && (loser == true || framePage == 1)){			//escape
					menuFadeIn = 1;
					framePage = 0;
					restartGame();
				}
				if(key == 27 && loser == false && waveComplete == false && framePage > 1){
					leaving = true;
					paused = true;
				}
			}
			
			if(key == 27 && (framePage == -10 || framePage == -3)){				//esc, leave from credits page
				menuSelect = 7;
				menuFadeIn = 1;
				framePage = 0;
			}
			
			if(key == 27 && framePage == -2){
				menuSelect = 3;
				framePage = 0;
			}
			
			if(framePage == 100){											//LEVEL EDITOR
				if(key == 32){			//space: place object
					switch(selectedObject){
						case 1:
							placeEnemyAHere();
							objectHistory.push(1);
							break;
						case 2:
							placeEnemyBHere();
							objectHistory.push(2);
							break;
						case 3:
							placeEnemyCHere();
							objectHistory.push(3);
							break;
						case 4:
							placeEnemyA2Here();
							objectHistory.push(4);
							break;
						case 5:
							placeSpikeHere();
							objectHistory.push(5);
							break;
					}
					timeStamp += timingLeniency;
				}
				if(key == 88){			//x: forward time
					rewind = true;
				}
				if(key == 90){			//z: rewind time
					forward = true;
				}
				if(key == 80){			//P: Export code
					for(i in enemyPlacementAX){
						document.write("spawnEnemyA(" + Math.floor(enemyPlacementAX[i]) + ", " + enemyPlacementTimeA[i]*16 + ");<br>");
					}
					for(i in enemyPlacementA2X){
						document.write("spawnEnemyA2(" + Math.floor(enemyPlacementA2X[i]) + ", " + enemyPlacementTimeA2[i]*16 + ");<br>");
					}
					for(i in enemyPlacementBX){
						document.write("spawnEnemyB(" + Math.floor(enemyPlacementBX[i]) + ", " + enemyPlacementTimeB[i]*16 + ");<br>");
					}
					for(i in enemyPlacementCX){
						document.write("spawnEnemyC(\"left\", 60, " +  Math.floor(enemyPlacementCX[i]) + ", " + enemyPlacementTimeC[i]*16 + ");<br>");
					}
					for(i in spikePlacementX){
						document.write("spawnSpike(" + Math.floor(spikePlacementX[i]) + ", " + spikePlacementTime[i]*16 + ");<br>");
					}
				}
				if(key == 27){			//esc: main menu		
					framePage = 0;
					if(cheater == false){
						godmode = false;
					}
				}
				if(key == 82){			//R: test level			
					timeStamp = 0;
					testRunning = true;
					//clear screen
					bullet.length = 0
					enemyA.length = 0
					enemyB.length = 0
					enemyC.length = 0
					spike.length = 0
					for(i in intervals){
						clearTimeout(intervals[i]);
					}
					//spawn objects
					for(i in enemyPlacementAX){
						spawnEnemyA(enemyPlacementAX[i]-16, enemyPlacementTimeA[i]*16-1000);
					}
					for(i in enemyPlacementA2X){
						spawnEnemyA2(enemyPlacementA2X[i]-16, enemyPlacementTimeA2[i]*16-1000);
					}
					for(i in enemyPlacementBX){
						spawnEnemyB(enemyPlacementBX[i]-16, enemyPlacementTimeB[i]*16-1000);
					}
					for(i in enemyPlacementCX){
						spawnEnemyC("left", 60, enemyPlacementCX[i]-16, enemyPlacementTimeC[i]*16-1000);
					}
					for(i in spikePlacementX){
						spawnSpike(spikePlacementX[i]-16, spikePlacementTime[i]*16-1000);
					}
					
				}
				if(key == 81){			//Q: jump to start
					timeStamp = 0;
				}
				if(key == 69){			//E: jump to end
					timeStamp = determineLevelLength();
				}
				if(key == 65){			//A: move left
					moveleft = true;
				}
				if(key == 68){			//D: move right
					moveright = true;
				}
				if(key == 70){			//F: auto forward time thing
					if(editMode == 1){
						editMode = 0
					}else editMode = 1;
				}
				if(key == 38){			//up: increment timing interval
					timingLeniency += 1;
				}
				if(key == 40){			//down:	decrement timing interval
					timingLeniency -= 1;
				}
				if(key == 73){			//i: more controls
					alert("Click and drag any object to move it\n");
					alert("Mouse over an object and press S to delete it\nHold S to delete multiple objects\n");
					alert("Use the scroll wheel to quickly move forward/backward in time\n");
					alert("E: jump to end\n\nF: Toggle time helper\n\nUp/down: Increase/decrease timing interval by 1ms\n\nM: Delete all objects\n\nQ: Delete last placed object\n");
				}
				if(key == 83){			//S: delete object
					deleting = true;
				}
				if(key == 77){			//M: delete all objects
					timeStamp = 0;
					enemyPlacementASelect.length = 0;
					enemyPlacementAX.length = 0;
					enemyPlacementTimeA.length = 0;
					
					enemyPlacementA2Select.length = 0;
					enemyPlacementA2X.length = 0;
					enemyPlacementTimeA2.length = 0;
					
					enemyPlacementBSelect.length = 0;
					enemyPlacementBX.length = 0;
					enemyPlacementTimeB.length = 0;
					
					enemyPlacementCSelect.length = 0;
					enemyPlacementCX.length = 0;
					enemyPlacementTimeC.length = 0;
					
					spikePlacementSelect.length = 0;
					spikePlacementX.length = 0;
					spikePlacementTime.length = 0;
				}
				if(key == 67){			//C: undo
					switch(objectHistory[objectHistory.length-1]){
						case 1:
							enemyPlacementASelect.pop();
							enemyPlacementAX.pop();
							enemyPlacementTimeA.pop();
							objectHistory.pop();
							break;
						case 2:
							enemyPlacementBSelect.pop();
							enemyPlacementBX.pop();
							enemyPlacementTimeB.pop();
							objectHistory.pop();
							break;
						case 3:
							enemyPlacementCSelect.pop();
							enemyPlacementCX.pop();
							enemyPlacementTimeC.pop();
							objectHistory.pop();
							break;
						case 4:
							enemyPlacementA2Select.pop();
							enemyPlacementA2X.pop();
							enemyPlacementTimeA2.pop();
							objectHistory.pop();
							break;
						case 5:
							spikePlacementSelect.pop();
							spikePlacementX.pop();
							spikePlacementTime.pop();
							objectHistory.pop();
							break;
						
					}
				}
				//1-5
				if(key == 49){
					selectedObject = 1;
				}
				if(key == 50){
					selectedObject = 2;
				}
				if(key == 51){
					selectedObject = 3;
				}
				if(key == 52){
					selectedObject = 4;
				}
				if(key == 53){
					selectedObject = 5;
				}
				
				
				}
	}
		
		if(key == 77){
			targetDebugVariable = prompt()
		}
		//left 37
	//right 39
	//shift 16
	//z 90
	//x 88

	}, false);


	window.addEventListener('keyup', function(evt){
		var key = evt.keyCode;
		if(key == 37){
			leftKeyDown = false;
			moveleft = 0;
		}
		if(key == 39){
			rightKeyDown = false;
			moveright = 0;
		}
		if(key == 16){
			boost = 0;
		}
		if(key == 88 || key == 90){
			if(BFGing == true){
				BFGing = false;
			}
			hold = false;
			if(ammo > 0 && BFG == false){
				//bullet parameters: (x, y, vel, s, type, w2, h2, damage)
				bullet.push(new newBullet(
					/* X */ posX + playerWidth/2 - (10+10*ammo)/2,
					/* Y */ posY,
					/* VELOCITY */ -20,
					/* SQUARE */10+10*ammo,
					/* TYPE */ undefined,
					/* WIDTH */ undefined,
					/* HEIGHT */ undefined,
					/* DAMAGE */ ammo
					));
				firePlay();
				ammo = 0;
			}
		}
		
		if(key == 88){
				rewind = false
		}
			
		if(key == 90){
				forward = false
		}
		
		if(key == 83){
			deleting = false;
		}
		
		if(framePage == 100){
			if(key == 65){			//A: move left
				moveleft = false;
				}
			if(key == 68){			//D: move right
				moveright = false;
				}
		}
		
		if(key == 27){
			if(leaveTimer !== 50){
				leaveTimer = 0;
				paused = false;
				leaving = false;
			}
		}

	}, false);

//asdsad


})
