// JavaScript source code
console.log("controlHead start...");
const deviceSide = {"port":22,"min":0.14,"max":0.25,"neutral":0.20};
const deviceNod = {"port":23,"min":0.07,"max":0.13,"neutral":0.10};
const deviceTwist = {"port":24,"min":0.06,"max":0.19,"neutral":0.12};
const deviceJaw = {"port":25,"min":0.085,"max":0.130,"neutral":0.085};
//
// servo controller interfaces with github.com/sarfata/pi-blaster
//
var servo = require("pi-blaster.js");
//
// read movefile
//
console.log("read datafile...");
var fs = require("fs");
var moves = JSON.parse( fs.readFileSync("steps.json"));
console.log( "moves="+moves );
//
// reset servos to neutral
//
console.log("reset to neutral...");
makeMove( [0,0,50] );
makeMove( [0,1,50] );
makeMove( [0,2,50] );
makeMove( [0,3,0] );
//servo.setPwm( deviceSide.port, deviceSide.neutral );
//servo.setPwm( deviceNod.port, deviceNod.neutral );
//servo.setPwm( deviceTwist.port, deviceTwist.neutral );
//servo.setPwm( deviceJaw.port, deviceJaw.neutral );
//
// step through the data file in 100ms steps
//
var startTime = new Date().getTime();
var time = 0;
var movePtr = 0;
var moveCnt = moves.length;
//
// calculate the time of the next move
//	and render all moves before that time
//	then setTimer for 100 msec
//	movePtr is a count of 100 msec steps taken (starts 0)
//
function moveLoop() {
	var nextMoveTimeMs = (new Date().getTime() - startTime)/100;
	//console.log( "moveLoop - nextMoveTimeMs="+nextMoveTimeMs+",movePtr="+movePtr+",moveCnt="+moveCnt );
	var moreMoves = true;
	if(movePtr < moveCnt) {
		do {
			var move = moves[ movePtr ];
			var moveTimeMs = move[ 0 ];
			//console.log( "moveTimeMs="+moveTimeMs+",nextMoveTimeMs="+nextMoveTimeMs );
			if ( moveTimeMs >= nextMoveTimeMs ) {
				moreMoves = false;
			} else {
				makeMove( move );
				movePtr+=1;
				moreMoves = (movePtr < moveCnt);
			}
		} while ( moreMoves )
		setTimeout(moveLoop, 100);
	}
}
//
function makeMove( move ) {
	console.log( "makeMove - move[0]="+move[0]+",move[1]="+move[1]+",move[2]="+move[2]);
	var position;
	switch( move[1] ) {
		case 0:
			position = getPosition( deviceSide, move[2] );
			servo.setPwm( deviceSide.port, position );
			break;
		case 1:
			position = getPosition( deviceNod, move[2] );
			servo.setPwm( deviceNod.port, position );
			break;
		case 2:
			position = getPosition( deviceTwist, move[2] );
			servo.setPwm( deviceTwist.port, position );
			break;
		case 3:
			position = getPosition( deviceJaw, move[2] );
			servo.setPwm( deviceJaw.port, position );
			break;
		
	}
}
//
function getPosition( device, absPosition ) {
	return device.min + ((( device.max - device.min ) * absPosition )/100 )
}
//
setTimeout(moveLoop, 100);


