/**
 * @author Prakhar 06/17/2017
 */

function Transitioner(svgRoot, svgPolygon) {

	this.warpSequence = function (polygons) {
		var transitioner = this;
		var copy = polygons.slice();

		function _iterate() {
			transitioner.warp(copy[0], copy[1], function () {
				copy.shift();
				if (copy.length > 1) {
					_iterate();
				}
			});
		}
		_iterate();
	};

	// assume both polygons have same number of points
	this.simpleWarp = function (polyA, polyB, callback) {
		drawPolygon(polyA);
		var frameCount = 0;

		function _draw() {
			// update SVG
			for (var i = 0; i < svgPolygon.points.length; i ++) {
				var point = svgPolygon.points[i];
				point.x = weightedAverage(polyA[i][0], polyB[i][0], frameCount / MAX_FRAMES);
				point.y = weightedAverage(polyA[i][1], polyB[i][1], frameCount / MAX_FRAMES);
			}

			frameCount ++;
			if (frameCount <= MAX_FRAMES) {
				requestAnimationFrame(_draw);
			} else if (callback) {
				callback();
			}
		}
		_draw();
	};

	this.warp = function (polyA, polyB, callback) {
		if (polyA.length == polyB.length) {
			this.simpleWarp(polyA, polyB, callback);
		} else if (polyB.length > polyA.length) {
			var newPolyA = interpolate(polyA, polyB);
			this.simpleWarp(newPolyA, polyB, callback);
		} else {
			var newPolyB = interpolate(polyB, polyA);
			this.simpleWarp(polyA, newPolyB, callback);
		}
	};

	function interpolate(polyA, polyB) {
		// interpolate points in polyA to match polyB's number of sides
		var scale = polyB.length / polyA.length;// pentagon -> triangle = 5/3
		var bounds = polyA.map(function (x, idx) { // [0,1,2] -> [0,2,4]
			return Math.round(idx * scale);
		});
		var newPolyA = new Array(polyB.length).fill(-1);

		// copy all points over exactly
		bounds.forEach(function (idxScaled, idx) {
			newPolyA[idxScaled] = polyA[idx];// [P0, -1, P1, P2, -1]
		});

		// interpolate the rest of the points
		var boundsIdx = 0;
		for (var i = 1; i < newPolyA.length; i ++) {
			if (newPolyA[i] != -1) {
				boundsIdx ++;
				continue;
			}
			var leftPoint = polyA[boundsIdx];
			var rightPoint = polyA[(boundsIdx + 1) % bounds.length];

			let numDivisionsOfEdge = (bounds[(boundsIdx + 1) % bounds.length] - bounds[boundsIdx]);
			if (numDivisionsOfEdge < 0) {
				numDivisionsOfEdge += newPolyA.length;
			}

			var weight = (i - bounds[boundsIdx]) / numDivisionsOfEdge;
			var interpolatedPoint = [
				weightedAverage(leftPoint[0], rightPoint[0], weight),
				weightedAverage(leftPoint[1], rightPoint[1], weight)
			];
			newPolyA[i] = interpolatedPoint;
		}
		return newPolyA;
	}

	function weightedAverage(A, B, weightB) {
		return A * (1 - weightB) + B * weightB;
	}

	function drawPolygon(polygon) {
		svgPolygon.points.clear();
		polygon.forEach(function (data) {
			var x = data[0];
			var y = data[1];
			svgPolygon.points.appendItem(newPoint(x, y));
		});
	}

	function newPoint(x, y) {
		var point = svgRoot.createSVGPoint();
		point.x = x;
		point.y = y;
		return point;
	}
}