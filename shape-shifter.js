/**
 * @author Prakhar
 */

var DURATION_TIME = 1;// in seconds
var MAX_FRAMES = 60 * DURATION_TIME;// in frames

// Define a few shapes
var triangle = [[50,50], [150,150], [100,250]];
var triangle2 = [[50,25], [150,250], [10,250]];
var square = [[100,100], [100,200], [200,200], [200,100]];

var pentagon = [[200,100], [300,150], [250,250], [150,250], [100,150]];
var hexagon = [[200,200], [50,248], [50,460], [200,508], [350,460], [350,248]];
var hexagon60 = [[350,248], [200,200], [50,248], [50,460], [200,508], [350,460]];


var equilateral = regularPolygon(3, 150, {x: 200, y: 350});
var square2 = regularPolygon(4, 150, {x: 200, y: 350});
var regularPentagon = regularPolygon(5, 150, {x: 200, y: 350});
const regularHexagon = regularPolygon(6, 150, {x: 200, y: 350});

var svgRoot = document.getElementById("svg-root");
var centerPoint = {};

// adapt <svg> size
handleResize();
window.onresize = handleResize;
function handleResize() {
	svgRoot.viewBox.baseVal.width = window.innerWidth;
	svgRoot.viewBox.baseVal.height = window.innerHeight;
	centerPoint.x = window.innerWidth / 2;
	centerPoint.y = window.innerHeight / 2;
}

function Stream(generator) {
	this[0] = generator();
	this[1] = generator();
	this.length = Infinity;

	this.shift = function () {
		var temp = this[0];
		this[0] = this[1];
		this[1] = generator();
		return temp;
	};

	this.slice = function () {
		return this;
	}
}

// sample integer from [a, b)
function randomInt(a, b) {
	return Math.floor(Math.random() * (b - a) + a);
}

function regularPolygon(n, radius, center) {
	const vertices = [];
	for (let i = 0; i < n; i ++) {
		const x = center.x + radius * Math.cos(2 * i / n * Math.PI);
		const y = center.y + radius * Math.sin(2 * i / n * Math.PI);
		vertices.push([x, y]);
	}

	return vertices;
}

function randomPolygon(n, r, center) {
	var vertices = [];
	for (var i = 0; i < n; i ++) {
		var radius = Math.random() * r;
		var x = center.x + radius * Math.cos(2 * i / n * Math.PI);
		var y = center.y + radius * Math.sin(2 * i / n * Math.PI);
		vertices.push([x, y]);
	}

	return vertices;
}

var svgPolygon = document.getElementById("polygon");
var transitioner = new Transitioner(svgRoot, svgPolygon);

// Change a pentagon into a hexagon.
// transitioner.warp(regularPentagon, regularHexagon);

// Transform pentagon -> triangle -> pentagon -> square.
// transitioner.warpSequence([pentagon, triangle, pentagon, square]);

// Transform triangle -> square -> ...increasingly better approximation of a circle.
let n = 3;
const growingPolygonStream = new Stream(function () {
	n ++;
	return regularPolygon(n, 150, {x: 200, y: 350});
});
transitioner.warpSequence(growingPolygonStream);

// Rotate a hexagon 30 degrees then -30 degrees, infinitely.
// var tri = true;
// var trihex = new Stream(function () {
// 	tri = !tri;
// 	return tri ? hexagon60 : hexagon;
// });
// transitioner.warpSequence(trihex);

// Warp between randomly-generated stars with varying radii and between 100 to 200 edges.
// var randomPolygonStream = new Stream(function () {
// 	return randomPolygon(randomInt(100, 200), 300, centerPoint);
// });
// transitioner.warpSequence(randomPolygonStream);

// To have a second shape transform, use a separate SVG element and transitioner.
// var svgPolygon2 = document.getElementById("polygon2");
// var transitioner2 = new Transitioner(svgRoot, svgPolygon2);
// var randomPolygonStream2 = new Stream(function () {
// 	return randomPolygon(randomInt(100, 100), 50, {x: 100, y: 100});
// });
// transitioner2.warpSequence(randomPolygonStream2);
