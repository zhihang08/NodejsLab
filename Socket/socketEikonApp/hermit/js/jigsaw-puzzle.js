/* globals Deferred, js */
const pieceScore = 10;
var totalNum =4;
var loaders = [];
var imgpath = 'img/';
var imageloadprogress = 0;
var imageloadtotal = 0;
var description = '拼图游戏，先拼完的一方获胜。'

var score = 0;
var vs_score = 0;
var userCount = 0; //count how many user commited result

var isInit = false;
// var user = {}
var allimages = [
	{
		'name': 'pictures',
		'images': ['Puzzle-4.jpg'],
		'dir': ''
	},
];
	localStorage.setItem('round',1) 
    // socket init
	const socket = io('http://10.117.62.137:3000');
	// const socket = io('http://10.35.14.200:3000');
	var user = JSON.parse(localStorage.getItem('user'));
	var user2 = JSON.parse(localStorage.getItem('user2'));
	var room = localStorage.getItem('room')
	
	socket.emit('add user',{user: user.name, room: room, uuid:user.uuid});
	user.uuid = ''
	user2.uuid =''
	socket.on('add user',(data)=>{
		if(data.uuid == -1){
			console.log('room is full')
		}	
	});
	
	socket.on('current room',(data)=>{
        let local_user = JSON.parse(localStorage.getItem('user'))
        let local_user2 = JSON.parse(localStorage.getItem('user2'))
        if (data.length == 2) {
            for (let i = 0; i < data.length; i++) {
                let userItem = data[i];
                if (userItem.userName == user.name) {
                	if(local_user.uuid!=userItem.uuid){
                		user.uuid = userItem.uuid
                	}                    
                } else if(userItem.userName == user2.name) {
					if(local_user2.uuid!=userItem.uuid){
                		user2.uuid = userItem.uuid
                	}
				}
			}
			if(user.uuid && user2.uuid) {
				socket.emit('game init', { uuid: user.uuid, stage: 1})
				localStorage.setItem('user',JSON.stringify(user))
                localStorage.setItem('user2',JSON.stringify(user2))
			}
			
		}
	});	

    socket.on('game init', (data) => {
		console.log(data);				

        if (data.status == 'error') {
            alert('Error:' + data.mes)
            return
		}
		// isInit = true;
        if (data.playerList && data.playerList.length == 2) { 
			gameInstanceId = data.id;
			   beginAnimate();    
			   
        }
        
    })
    socket.on('game process', (data) => {
		console.log(data);
		
		userCount++;
		var piecesNum = 0;
		for (let i = 0; i < data.data.length; i++) {
            if (data.data[i].userName === data.action.userName) {
                piecesNum = data.data[i].data.pieces
                break;
            }
        }
		if(data.action.userName == user.name) {
			score = piecesNum * pieceScore
		} else {
			vs_score = piecesNum * pieceScore
			if(userCount<2){
			socket.emit('game process', {
			data: {
				pieces: totalNum - js.pieces.length
			},
			uuid: user.uuid,
			gameID: gameInstanceId
			// uuid:commonUtil.getMyName(),
			// gameID:commonUtil.getGameInstanceId()
		})
			}
		}
		if(userCount == 2) {
			updateScore(score,vs_score);		

			// let finishWord = score===totalNum * pieceScore?'win':''
			if(user.symbol === 'symbol1'){
				socket.emit('game init', { uuid: user.uuid, stage: -1})
			}
		console.log(score);
		console.log(vs_score);
			finishGameAnimate(score>vs_score?'win':'fail')
		}
    })
	function updateScore(score,vs_score){
		user.score = user.score || 0;
		user2.score = user2.score || 0;
		user.score = parseInt(user.score) + score;
		localStorage.setItem("user", JSON.stringify(user))
			
		user2.score = parseInt(user2.score) + vs_score;
		localStorage.setItem("user2", JSON.stringify(user2))
	}
//preload images
function loadFile(src,array,num){
	var deferred = new Deferred();
	var sprite = new Image();
	sprite.onload = function() {
		array[num] = sprite;
		deferred.resolve();
		imageloadprogress++;
		//document.getElementById('loading').style.width = (imageloadprogress / imageloadtotal) * 100 + '%';
	};
	sprite.src = src;
    return deferred.promise();
}

//loop through and call all the preload images
function callAllPreloads(array,dir){
    for(var z = 0; z < array.length; z++){
        loaders.push(loadFile(dir + array[z], array, z));
    }
}

for(var im = 0; im < allimages.length; im++){
	imageloadtotal += allimages[im].images.length;
	callAllPreloads(allimages[im].images, imgpath + allimages[im].dir + '/');
}

function NewPiece(x,y,w,h,solvedx,solvedy,spritex,spritey,rowx,rowy){
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
	this.solvedx = solvedx;
	this.solvedy = solvedy;
	this.spritex = spritex;
	this.spritey = spritey;
	this.visible = 1;
	this.solved = 0;
	this.offsetx = -1;
	this.offsety = -1;
	this.rowx = rowx;
	this.rowy = rowy;
}


(function( window, undefined ) {
var js = {
	canvas: 0,
	ctx: 0,
	canvasw: 0,
	canvash: 0,
	savedcanvasw: 0,
	savedcanvash: 0,
	idealw: 1, //gets set later based on image size
	idealh: 1,
	canvasmode: 1,
	piececountx: 2, //number of pieces across
	piececounty: 2, //number of pieces down
	puzzle: 0,
	pieces: [],
	solvedpieces: [],
	clickedpiece: -1,
	debug: 0,

    general: {
        init: function(){
			js.canvas = document.getElementById('canvas');
            if(!js.canvas.getContext){
                document.getElementById('canvas').innerHTML = 'Your browser does not support canvas. Sorry.';
            }
            else {
                js.ctx = js.canvas.getContext('2d');
                js.general.initPuzzle();
	            this.setupEvents();
	            setInterval(js.general.drawPieces,10);
            }
        },
        initPuzzle: function(){
            js.puzzle = allimages[0].images[0];
			js.idealw = js.puzzle.width;
			js.idealh = js.puzzle.height;
            js.general.initCanvasSize();
            js.savedcanvasw = js.canvasw;
            js.savedcanvash = js.canvash;
            js.piececountx = 2;
            js.piececounty = 2;
			document.getElementById('piecesx').value = js.piececountx;
			document.getElementById('piecesy').value = js.piececounty;
	        js.general.createPieces();
        },

        //initialise the size of the canvas based on the ideal aspect ratio and the size of the parent element
		initCanvasSize: function(){
			var parentel = document.getElementById('canvasparent');
			var targetw = parentel.offsetWidth;
			var targeth = parentel.offsetHeight;

			if(js.canvasmode === 1){ //resize the canvas to maintain aspect ratio depending on screen size (may result in gaps either side) - we're using this one
				var sizes = js.general.calculateAspectRatio(js.idealw,js.idealh,targetw,targeth);
				js.canvas.width = js.canvasw = sizes[0];
				js.canvas.height = js.canvash = sizes[1];
			}
			else { //make canvas always full width, with appropriately scaled height (may go off bottom of page)
				js.canvas.width = targetw;
				var scaleh = js.general.calculatePercentage(targetw,js.idealw);
				js.canvas.height = (js.idealh / 100) * scaleh;
			}
        },
        //given a width and height representing an aspect ratio, and the size of the containing thing, return the largest w and h matching that aspect ratio
		calculateAspectRatio: function(idealw,idealh,parentw,parenth){
			var aspect = Math.floor((parenth / idealh) * idealw);
			var cwidth = Math.min(idealw, parentw);
			var cheight = Math.min(idealh, parenth);
			var w = Math.min(parentw,aspect);
			var h = (w / idealw) * idealh;
			return([w,h]);
		},
        //returns the percentage amount that object is of wrapper
        calculatePercentage: function(object,wrapper){
			return((100 / wrapper) * object);
		},
        clearCanvas: function(){
            js.canvas.width = js.canvas.width; //this is apparently a hack but seems to work
        },
        resizeCanvas: function(){
            js.general.initCanvasSize();
            var diffx = (js.canvasw / js.savedcanvasw) * 100;
            var diffy = (js.canvash / js.savedcanvash) * 100;
            for(var p = 0; p < js.pieces.length; p++){
                js.pieces[p].x = (js.pieces[p].x / 100) * diffx;
                js.pieces[p].y = (js.pieces[p].y / 100) * diffy;
                js.pieces[p].w = (js.pieces[p].w / 100) * diffx;
                js.pieces[p].h = (js.pieces[p].h / 100) * diffy;
                js.pieces[p].solvedx = (js.pieces[p].solvedx / 100) * diffx;
                js.pieces[p].solvedy = (js.pieces[p].solvedy / 100) * diffy;
            }
            for(p = 0; p < js.solvedpieces.length; p++){
                js.solvedpieces[p].x = (js.solvedpieces[p].x / 100) * diffx;
                js.solvedpieces[p].y = (js.solvedpieces[p].y / 100) * diffy;
                js.solvedpieces[p].w = (js.solvedpieces[p].w / 100) * diffx;
                js.solvedpieces[p].h = (js.solvedpieces[p].h / 100) * diffy;
                js.solvedpieces[p].solvedx = (js.solvedpieces[p].solvedx / 100) * diffx;
                js.solvedpieces[p].solvedy = (js.solvedpieces[p].solvedy / 100) * diffy;
            }
            js.savedcanvasw = js.canvasw;
            js.savedcanvash = js.canvash;
        },
        resetPuzzle: function(){
            document.getElementById('options').className = 'optionswrapper';
			document.getElementById('body').className = '';
            js.general.initPuzzle();
        },
        randomNumber: function(min,max){
			return((Math.random() * (max - min) + min));
		},

		//click events
        setupEvents: function(){
			var ondown = ((document.ontouchstart!==null)?'mousedown':'touchstart');
			js.canvas.addEventListener(ondown,function(e){
				//console.log('click down');
				var clicked = js.general.clickDown(e);
				js.general.clickPiece(clicked[0],clicked[1]);
			},false);

			var onup = ((document.ontouchstart!==null)?'mouseup':'touchend');
			js.canvas.addEventListener(onup,function(e){
				//console.log('click up');
				js.general.releasePiece();
			},false);

			var onmove = ((document.ontouchstart!==null)?'mousemove':'touchmove');
			js.canvas.addEventListener(onmove,function(e){
				if(js.clickedpiece !== -1){
					js.general.movePiece(e);
				}
			},false);

			var onupdate = ((document.ontouchstart!==null)?'mousedown':'touchstart');
			document.getElementById('updatePuzzle').addEventListener(onupdate,function(e){
				js.general.updateSettings();
			},false);

			var showoptions = ((document.ontouchstart!==null)?'mousedown':'touchstart');
			document.getElementById('showoptions').addEventListener(showoptions,function(e){
                document.getElementById('options').className = 'optionswrapper shown';
			},false);
			var hideoptions = ((document.ontouchstart!==null)?'mousedown':'touchstart');
			document.getElementById('hideoptions').addEventListener(hideoptions,function(e){
                document.getElementById('options').className = 'optionswrapper';
			},false);
			var reset = ((document.ontouchstart!==null)?'mousedown':'touchstart');
			document.getElementById('resetPuzzle').addEventListener(reset,function(e){
                js.general.resetPuzzle();
			},false);

		},

		//find where on the canvas the mouse/touch is
		clickDown: function(e){
			var rect = js.canvas.getBoundingClientRect();
			var x = e.clientX - rect.left;
			var y = e.clientY - rect.top;
			if(typeof e.changedTouches !== 'undefined'){
				x = e.changedTouches[0].pageX - rect.left;
				y = e.changedTouches[0].pageY - rect.top;
			}
			//console.log(x,y);
			return([x,y]);
		},

		//identify which piece has been clicked on
		clickPiece: function(x,y){
			for(var i = js.pieces.length - 1; i >= 0; i--){
				if(js.general.checkCollision(js.pieces[i],x,y)){
					js.clickedpiece = i;
					js.general.hideAllPieces();
					js.pieces[i].visible = 1;
					js.pieces[i].offsetx = x - js.pieces[i].x;
					js.pieces[i].offsety = y - js.pieces[i].y;
					break;
				}
			}
		},

		//let go of the current piece
		releasePiece: function(){
			if(js.clickedpiece !== -1){
				//move selected piece to the end of the array - makes last touched piece always be on top
				var tmp = js.pieces[js.clickedpiece];
				js.pieces.splice(js.clickedpiece,1);
				js.pieces.push(tmp);


				for(var p = 0; p < js.pieces.length; p++){
					js.pieces[p].visible = 1;
				}
				js.pieces[js.clickedpiece].offsetx = 0;
				js.pieces[js.clickedpiece].offsety = 0;
				js.general.checkSolved();
				js.clickedpiece = -1;
				
				if(js.pieces.length === 0){
					document.getElementById('body').className = 'solved';
					socket.emit('game process', {
						data: {
							pieces: totalNum
						},
						uuid: user.uuid,
						gameID: gameInstanceId
						// uuid:commonUtil.getMyName(),
						// gameID:commonUtil.getGameInstanceId()
					})
				}
			}
		},

		//once selected, move a piece with the mouse
		movePiece: function(e){
			var movement = js.general.clickDown(e);
			js.pieces[js.clickedpiece].x = movement[0] - js.pieces[js.clickedpiece].offsetx;
			js.pieces[js.clickedpiece].y = movement[1] - js.pieces[js.clickedpiece].offsety;
		},

		//once finished moving a piece, check to see if it is in place
		checkSolved: function(){
			//console.log(js.pieces[js.clickedpiece].x,js.pieces[js.clickedpiece].solvedx);

			var newx = js.pieces[js.clickedpiece].x;
			var newy = js.pieces[js.clickedpiece].y;
			var sx = js.pieces[js.clickedpiece].solvedx;
			var sy = js.pieces[js.clickedpiece].solvedy;

			var tolerance = 150;
			//console.log(newx,sx);

			//if the piece is solved
			if(Math.abs(newx - sx) < tolerance && Math.abs(newy - sy) < tolerance){
				js.pieces[js.clickedpiece].x = sx;
				js.pieces[js.clickedpiece].y = sy;
				js.pieces[js.clickedpiece].solved = 1;
				
				var tmp = js.pieces[js.clickedpiece];
				//remove the piece from the array of pieces and add to the solved array
				//means we can always draw the solved pieces first, beneath the unsolved
				js.pieces.splice(js.clickedpiece,1);
				js.solvedpieces.push(tmp);
			}

			// hermit： game completed
			if (js.pieces.length == 0) {
				// socket.emit('game process', {
				// 	data: {
				// 		pieces: totalNum
				// 	},
				// 	uuid: uuid,
				// 	gameID: gameInstanceId
				// 	// uuid:commonUtil.getMyName(),
				// 	// gameID:commonUtil.getGameInstanceId()
				// })
				// send message to service 
				// $(".result-mark").css({"display": "block"}).addClass("animated rollIn");
				// setTimeout(function(){
				// 	window.location.href = "round-end.html";
				// }, 3000);
			}
		},

		checkCollision: function(obj,x,y){
			if(!obj.solved){
				//rule out any possible collisions, remembering that all y numbers are inverted on canvas
			    //y is below obj bottom edge
			    if(y > obj.y + obj.h){
			        return(0);
				}
			    //y is above top edge
			    if(y < obj.y){
			        return(0);
				}
			    //x is beyond right edge
			    if(x > obj.x + obj.w){
			        return(0);
				}
			    //x is less than left edge
			    if(x < obj.x){
			        return(0);
				}
				return(1); //collision
			}
			else {
				return(0);
			}
		},

		//update the puzzle based on entered values when 'update' is clicked
		updateSettings: function(){
			var elAcross = document.getElementById('piecesx');
			var elDown = document.getElementById('piecesy');

			var across = Math.min(20,elAcross.value);
			var down = Math.min(20,elDown.value);

			var file = document.getElementById('fileupload').files[0];
			//console.log(file);
			if(typeof file !== 'undefined'){
				var reader = new FileReader();
				reader.onload = function(){
					//console.log(reader.result);
					var img = new Image();
					img.src = reader.result;
					img.onload = function(){
						js.puzzle = img;
						js.piececountx = across;
						js.piececounty = down;
						//fixme this is a repetition of some of the lines in init - could be more efficient
						js.idealw = js.puzzle.width;
						js.idealh = js.puzzle.height;
		                js.general.initCanvasSize();
		                js.savedcanvasw = js.canvasw;
		                js.savedcanvash = js.canvash;
						js.general.createPieces();
					};
				};
				reader.readAsDataURL(file);
			}
			else {
				js.piececountx = across;
				js.piececounty = down;
				js.general.createPieces();
			}
			elAcross.value = across;
			elDown.value = down;
			document.getElementById('body').className = '';
            document.getElementById('options').className = 'optionswrapper';
		},

		hideAllPieces: function(){
			//console.log('hideAllPieces');
			for(var p = 0; p < js.pieces.length; p++){
				js.pieces[p].visible = 0;
			}
		},
		
		//create all the pieces of the puzzle
		createPieces: function(){
			js.pieces = [];
			js.solvedpieces = [];
			var w = js.canvasw / js.piececountx;
			var h = js.canvash / js.piececounty;

			//try to distribute the pieces within the middle of the puzzle, so we can work on the edges first
			var rangeminx = (js.canvasw / 100) * 10;
			var rangemaxx = ((js.canvasw - w) / 100) * 90;
			var rangeminy = (js.canvash / 100) * 10;
			var rangemaxy = ((js.canvash - h) / 100) * 90;

			for(var y = 0; y < js.piececounty; y++){
				for(var x = 0; x < js.piececountx; x++){

					var piecex = js.general.randomNumber(rangeminx,rangemaxx);
					var piecey = js.general.randomNumber(rangeminy,rangemaxy);
					if(js.debug){ //if in debug mode, start the puzzle completed
						piecex = w * x;
						piecey = h * y;
					}
					var solvedx = w * x;
					var solvedy = h * y;
					var spritex = 0;
					var spritey = 0;

					var newpiece = new NewPiece(piecex,piecey,w,h,solvedx,solvedy,spritex,spritey,x,y);
					js.pieces.push(newpiece);
				}
			}
		},
		
		//this seems to be returning false if the number is odd
        isEven: function(n) {
            return n % 2 == 0;
        },

		drawPieces: function(){
			js.general.clearCanvas();
			var piececount = js.solvedpieces.length;
			for(var p = 0; p < piececount; p++){
				js.general.drawPiece(js.solvedpieces[p]);
			}
			piececount = js.pieces.length;
			for(var q = 0; q < piececount; q++){
				js.general.drawPiece(js.pieces[q]);
			}
		},

		//edge is either 0,1,2,3 - corresponding to top, right, bottom, left, arccounterClockwise decides if tab or blank, ie. in or out
		drawTabOrBlank: function(obj,edge,arccounterClockwise){
			var arcradius = Math.min(obj.h / 4, obj.w / 4);
			var arcx = 0;
			var arcy = 0;
			var arcstartAngle = 0;
			var arcendAngle = 0;
			switch(edge){
				case 0:
					arcx = obj.x + (obj.w / 2);
					arcy = obj.y;
					arcstartAngle = 1 * Math.PI;
					arcendAngle = 0 * Math.PI;
					break;
				case 1:
	                arcx = obj.x + obj.w;
	                arcy = obj.y + (obj.h / 2);
	                arcstartAngle = 1.5 * Math.PI;
	                arcendAngle = 0.5 * Math.PI;
					break;
				case 2:
	                arcx = obj.x + (obj.w / 2);
	                arcy = obj.y + obj.h;
	                arcstartAngle = 0 * Math.PI;
	                arcendAngle = 1 * Math.PI;
					break;
				case 3:
	                arcx = obj.x;
	                arcy = obj.y + (obj.h / 2);
	                arcstartAngle = 0.5 * Math.PI;
	                arcendAngle = 1.5 * Math.PI;
					break;
			}
			js.ctx.arc(arcx, arcy, arcradius, arcstartAngle, arcendAngle, arccounterClockwise);
		},
		
        drawPiece: function(obj){
            var arcx = 0;
            var arcy = 0;
            var arcradius = 0;
            var arcstartAngle = 0;
            var arcendAngle = 0;
            var arccounterClockwise = true;

            var puzzleWEven = js.general.isEven(js.piececountx);
            var puzzleHEven = js.general.isEven(js.piececounty);

            var pieceXEven = js.general.isEven(obj.rowx);
            var pieceYEven = js.general.isEven(obj.rowy);

            js.ctx.save();
            if(obj.solved){
	            js.ctx.lineWidth = 0;
	            js.ctx.strokeStyle = 'rgba(0,0,0,0)';
			}
			else {
	            js.ctx.lineWidth = 2;
	            js.ctx.strokeStyle = 'rgba(0,0,0,0.5)';
			}

            if(!obj.visible){
                js.ctx.globalAlpha = 0.3;
            }

            js.ctx.beginPath();
            js.ctx.moveTo(obj.x, obj.y); //top left corner
            
            //deal with top edge
            if(obj.rowy > 0){
				if(pieceYEven){
					if(pieceXEven){
						js.general.drawTabOrBlank(obj,0,1); //draw a sticky bit out, top edge
					}
					else {
						js.general.drawTabOrBlank(obj,0,0); //draw a sticky bit in, top edge
					}
				}
				else {
					if(pieceXEven){
						js.general.drawTabOrBlank(obj,0,0); //draw a sticky bit in, top edge
					}
					else {
						js.general.drawTabOrBlank(obj,0,1); //draw a sticky bit out, top edge
					}
				}
			}

            js.ctx.lineTo(obj.x + obj.w,obj.y); //top right corner

            //deal with right edge
            if(obj.rowx < js.piececountx - 1){
				if(pieceYEven){
					if(pieceXEven){
						js.general.drawTabOrBlank(obj,1,0); //draw a sticky bit in, right edge
					}
					else {
						js.general.drawTabOrBlank(obj,1,1); //draw a sticky bit out, right edge
					}
				}
				else {
					if(pieceXEven){
						js.general.drawTabOrBlank(obj,1,1); //draw a sticky bit out, right edge
					}
					else {
						js.general.drawTabOrBlank(obj,1,0); //draw a sticky bit in, right edge
					}
				}
			}

            js.ctx.lineTo(obj.x + obj.w, obj.y + obj.h); //bottom right corner

            //deal with bottom edge
            if(obj.rowy < js.piececounty - 1){
				if(pieceYEven){
					if(pieceXEven){
						js.general.drawTabOrBlank(obj,2,1); //draw a sticky bit out, bottom edge
					}
					else {
						js.general.drawTabOrBlank(obj,2,0); //draw a sticky bit in, bottom edge
					}
				}
				else {
					if(pieceXEven){
						js.general.drawTabOrBlank(obj,2,0); //draw a sticky bit in, bottom edge
					}
					else {
						js.general.drawTabOrBlank(obj,2,1); //draw a sticky bit out, bottom edge
					}
				}
			}

            js.ctx.lineTo(obj.x, obj.y + obj.h); //bottom left corner

            //deal with left edge
            if(obj.rowx > 0){
				if(pieceYEven){
					if(pieceXEven){
						js.general.drawTabOrBlank(obj,3,0); //draw a sticky bit in, left edge
					}
					else {
						js.general.drawTabOrBlank(obj,3,1); //draw a sticky bit out, left edge
					}
				}
				else {
					if(pieceXEven){
						js.general.drawTabOrBlank(obj,3,1); //draw a sticky bit out, left edge
					}
					else {
						js.general.drawTabOrBlank(obj,3,0); //draw a sticky bit in, left edge
					}
				}
			}

            js.ctx.lineTo(obj.x, obj.y); //top left corner - back to origin
            js.ctx.closePath();
            
            js.ctx.clip();
            js.ctx.drawImage(js.puzzle, 0 - obj.solvedx + obj.x, 0 - obj.solvedy + obj.y, js.canvasw, js.canvash);
            js.ctx.stroke();
            js.ctx.restore();
    	}
	}

};
window.js = js;
})(window);

window.onload = function(){
    Deferred.when(loaders).then(
    	function(){
		    js.general.init();
		    //js.general.addClass(document.getElementById('loading'),'fadeout');
		}
    );

	var resize;
	window.addEventListener('resize', function(event){
		clearTimeout(resize);
		resize = setTimeout(js.general.resizeCanvas,200);
	});
};