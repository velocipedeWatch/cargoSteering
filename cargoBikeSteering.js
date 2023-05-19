//arm length 47.778
//pivots 68 apart translates to 17" or 4 = 1"
//axle 15.74 long
//axle 40 forward of pivots

var c2 = document.getElementById("myCanvas");
ctx = c2.getContext("2d");
ctx.lineCap = "round";
//ctx.lineWidth = .25;
var midL = c2.width / 8;
var radC = 180/Math.PI; //convert rad to deg
var degC = Math.PI/180; //convert deg to rad
var axleW = 16 //  15.74;
var lPv = midL - 34;
var rPv = midL + 34;
var axleF = 45;
var armLen = Math.sqrt(axleF**2 + (68/2-axleW/2)**2 - 2*axleF*(68/2-axleW/2) * Math.cos(90*degC)) // B:90*degC a:40 c:68/2-axleW/2;

function load(){
ctx.scale(4,4);
//ctx.lineWidth = .25;
this.reload();
}

function drawL(startX, startY, angle, lineL, lineW){ //angle is in radians
	endX = startX + lineL * Math.cos(angle);
	endY = startY - lineL * Math.sin(angle);
	ctx.beginPath();
	if (lineW = undefined){ctx.lineWidth = .25;} else {ctx.lineWidth = lineW;}
	ctx.moveTo(startX, startY);
	ctx.lineTo(endX, endY);
	ctx.stroke();
	ctx.closePath()
	}

function getEndX(startX, angle, lineL){
	endX = startX + lineL * Math.cos(angle);
	return endX;
	}

function getEndY(startY, angle, lineL){
	endY = startY - lineL * Math.sin(angle);
	return endY;
	}

function getA(x1, y1, x2, y2){	// returns value in radians
	return Math.atan2(y2 - y1, x2 - x1);
	}

function reload(){
	ctx.clearRect(0, 0, c2.width, c2.height);
	this.basePivots();
	this.steeringArm(document.getElementById("susT").value);
	}

function basePivots(){
	ctx.beginPath();
	ctx.lineWidth = .25;
	ctx.arc(lPv, 140, 3, 0, 2 * Math.PI);
	ctx.stroke();
	ctx.closePath();

	ctx.beginPath();
	ctx.lineWidth = .25;
	ctx.arc(rPv, 140, 3, 0, 2 * Math.PI);
	ctx.stroke();
	ctx.closePath();
	}

function steeringArm(sRange){ 
	var B = 90*degC;
	var b = armLen // 47.77841;

	// Math for left and right movement is different due to one arm moving both directions when steered to that side.
	document.getElementById("cValue").value = sRange;

	this.drawL(20,20,this.getA(1,1,2,2),15);

	if ( sRange > 0 ) {
		//document.getElementById("cValue2").value = "Over";
		var c = 68 / 2 - axleW / 2 + eval(sRange);
		var C = Math.asin(c*(Math.sin(B)) / b);
		var A = eval(90 - C*radC)*degC;
		var a = ((b * Math.sin(A)) / (Math.sin(B)));
		var x1 = lPv;
		var y1 = 140;
		var x2 = lPv+c;
		var y2 = 140-a;

		ctx.beginPath();
		ctx.lineWidth = .25;
		ctx.moveTo(x1, y1);
		ctx.lineTo(x2, y2);
		ctx.linewidth = 10;
		ctx.stroke(); // left arm
		ctx.closePath();

		this.drawAxleL(x2, y2);
		} else {
		//document.getElementById("cValue2").value = "Under";
		var c = 68 / 2 - axleW / 2 - eval(sRange);
		var C = Math.asin(c*(Math.sin(B)) / b);
		var A = eval(90 - C*radC)*degC;
		var a = ((b * Math.sin(A)) / (Math.sin(B)));
		var x1 = rPv;
		var y1 = 140;
		var x2 = rPv-c;
		var y2 = 140-a;

		ctx.beginPath();
		ctx.lineWidth = .25;
		ctx.moveTo(x1, y1);
		ctx.lineTo(x2, y2);
		ctx.stroke();
		ctx.closePath();

		this.drawAxleR(x2, y2);
		}
	}

function drawAxleL(armLendX, armLendY){
	var A = 90*degC;
	var b = 140 - armLendY;
	var c = rPv - armLendX;
	var a = Math.sqrt((rPv - armLendX)**2 + (140 - armLendY)**2);
	var c1 = Math.acos((a**2+b**2-c**2)/(2*a*b))*radC // angle oftop corner;
	var bb = a;
	var a = axleW;
	var c = armLen;
	var c2 = Math.acos((a**2+bb**2-c**2)/(2*a*bb))*radC // angle of outside corner;
	var oCorner = c1+c2;
	var c3 = c1+c2;
	document.getElementById("cValue4").value = c1;

	var axleEx = armLendX + axleW;
	var axleEy = armLendY;

	if (c3 > 90) {
		A = (c3-90)*degC;
		b = axleW;
		B = 90*degC;
		C = (180 - (c3-90) - 90)*degC;
		a = b*Math.sin(A)/Math.sin(B);
		c = b*Math.sin(C)/Math.sin(B);
		//document.getElementById("cValue4").value = C;
		var axleEx = armLendX + c;
		var axleEy = armLendY - a;
		} else if (c3 < 90) {
		A = (90-c3)*degC;
		b = axleW;
		B = 90*degC;
		C = (180 - (c3-90) - 90)*degC;
		a = b*Math.sin(A)/Math.sin(B);
		c = b*Math.sin(C)/Math.sin(B);
		//document.getElementById("cValue4").value = C;
		var axleEx = armLendX + c;
		var axleEy = armLendY + a;
		}

	ctx.beginPath();
	ctx.lineWidth = .25;
	ctx.moveTo(axleEx, axleEy);
	ctx.lineTo(armLendX, armLendY);
	ctx.stroke();
	ctx.closePath();

	ctx.beginPath();
	ctx.lineWidth = .25;
	ctx.moveTo(axleEx, axleEy);
	ctx.lineTo(rPv, 140);
	ctx.stroke();
	ctx.closePath();

	dx = axleEx - armLendX;
	dy = axleEy - armLendY;
	var axleMid = armLendX + (axleEx - armLendX) / 2;
	var axleMidY = armLendY + (axleEy - armLendY) / 2;
	this.drawL(axleMid, axleMidY, Math.atan2(dy, dx) * -1 + 90 * degC, 40, 4);
	this.drawL(axleMid, axleMidY, Math.atan2(dy, dx) * -1 + 270 * degC, 40, 4);
	document.getElementById("cValue3").value = Math.atan2(dy, dx) * radC * -1;
	this.drawL(armLendX, armLendY, Math.atan2(dy, dx) * -1 + 2.5, 6)
	}

function drawAxleR(armLendX, armLendY){
	var A = 90*degC;
	var b = 140 - armLendY;
	var c = lPv - armLendX;
	var a = Math.sqrt((lPv - armLendX)**2 + (140 - armLendY)**2);
	var c1 = Math.acos((a**2+b**2-c**2)/(2*a*b))*radC // angle oftop corner;
	var bb = a;
	var a = axleW;
	var c = armLen;
	var c2 = Math.acos((a**2+bb**2-c**2)/(2*a*bb))*radC // angle of outside corner;
	var oCorner = c1+c2;
	var c3 = c1+c2;
	document.getElementById("cValue4").value = c1;

	var axleEx = armLendX - axleW;
	var axleEy = armLendY;

	if (c3 > 90) {
		A = (c3-90)*degC;
		b = axleW;
		B = 90*degC;
		C = (180 - (c3-90) - 90)*degC;
		a = b*Math.sin(A)/Math.sin(B);
		c = b*Math.sin(C)/Math.sin(B);
		//document.getElementById("cValue4").value = C;
		var axleEx = armLendX - c;
		var axleEy = armLendY - a;
		} else if (c3 < 90) {
		A = (90-c3)*degC;
		b = axleW;
		B = 90*degC;
		C = (180 - (c3-90) - 90)*degC;
		a = b*Math.sin(A)/Math.sin(B);
		c = b*Math.sin(C)/Math.sin(B);
		//document.getElementById("cValue4").value = C;
		var axleEx = armLendX - c;
		var axleEy = armLendY + a;
		}

	ctx.beginPath();
	ctx.lineWidth = .25;
	ctx.moveTo(axleEx, axleEy);
	ctx.lineTo(armLendX, armLendY);
	ctx.stroke();
	ctx.closePath();

	ctx.beginPath();
	ctx.lineWidth = .25;
	ctx.moveTo(axleEx, axleEy);
	ctx.lineTo(lPv, 140);
	ctx.stroke();
	ctx.closePath();

	dx = axleEx - armLendX;
	dy = axleEy - armLendY;
	var axleMid = armLendX + (axleEx - armLendX) / 2;
	var axleMidY = armLendY + (axleEy - armLendY) / 2;
	this.drawL(axleMid, axleMidY, Math.atan2(dy, dx) * -1 + 90 * degC, 40, 2);
	this.drawL(axleMid, axleMidY, Math.atan2(dy, dx) * -1 + 270 * degC, 40, 2);
	document.getElementById("cValue3").value = Math.atan2(dy, dx) * radC * -1;
	this.drawL(axleEx, axleEy, Math.atan2(dy, dx) * -1 + 2.5 + (180 * degC), 6)
	}

function resetSteer(){
	document.getElementById("susT").value = 0;
	this.reload();
	}