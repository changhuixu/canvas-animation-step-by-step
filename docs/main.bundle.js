/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/animations/interactive-flowers.ts":
/*!***********************************************!*\
  !*** ./src/animations/interactive-flowers.ts ***!
  \***********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.InteractiveFlowers = void 0;
var point_1 = __webpack_require__(/*! ../models/point */ "./src/models/point.ts");
var flower_randomization_service_1 = __webpack_require__(/*! ../services/flower-randomization.service */ "./src/services/flower-randomization.service.ts");
var InteractiveFlowers = (function () {
    function InteractiveFlowers(canvas) {
        this.canvas = canvas;
        this.flowers = [];
        this.randomizationService = new flower_randomization_service_1.FlowerRandomizationService();
        this.ctrlIsPressed = false;
        this.mousePosition = new point_1.Point(-100, -100);
        this.context = this.canvas.getContext('2d');
        this.canvasWidth = this.canvas.width;
        this.canvasHeight = this.canvas.height;
        this.addShadowEffect();
        this.addInteractions();
    }
    InteractiveFlowers.prototype.clearCanvas = function () {
        this.flowers = [];
        this.context.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    };
    InteractiveFlowers.prototype.animateFlowers = function () {
        var _this = this;
        if (this.flowers.every(function (f) { return f.stopChanging; })) {
            return;
        }
        this.context.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
        this.flowers.forEach(function (flower) {
            flower.increasePetalRadiusWithLimit();
            flower.draw(_this.context);
        });
        window.requestAnimationFrame(function () { return _this.animateFlowers(); });
    };
    InteractiveFlowers.prototype.addInteractions = function () {
        var _this = this;
        this.canvas.addEventListener('click', function (e) {
            if (_this.ctrlIsPressed) {
                _this.clearCanvas();
                return;
            }
            _this.calculateMouseRelativePositionInCanvas(e);
            var flower = _this.randomizationService.getFlowerAt(_this.mousePosition);
            _this.flowers.push(flower);
            _this.animateFlowers();
        });
        window.addEventListener('keydown', function (e) {
            if (e.which === 17 || e.keyCode === 17) {
                _this.ctrlIsPressed = true;
            }
        });
        window.addEventListener('keyup', function () {
            _this.ctrlIsPressed = false;
        });
    };
    InteractiveFlowers.prototype.calculateMouseRelativePositionInCanvas = function (e) {
        this.mousePosition = new point_1.Point(e.clientX +
            (document.documentElement.scrollLeft || document.body.scrollLeft) -
            this.canvas.offsetLeft, e.clientY +
            (document.documentElement.scrollTop || document.body.scrollTop) -
            this.canvas.offsetTop);
    };
    InteractiveFlowers.prototype.addShadowEffect = function () {
        this.context.shadowBlur = 5;
        this.context.shadowOffsetX = 2;
        this.context.shadowOffsetY = 2;
        this.context.shadowColor = '#333';
        this.context.globalAlpha = 0.8;
    };
    return InteractiveFlowers;
}());
exports.InteractiveFlowers = InteractiveFlowers;


/***/ }),

/***/ "./src/models/flower-center.ts":
/*!*************************************!*\
  !*** ./src/models/flower-center.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FlowerCenter = void 0;
var FlowerCenter = (function () {
    function FlowerCenter(centerPoint, centerRadius, centerColor) {
        this.centerPoint = centerPoint;
        this.centerRadius = centerRadius;
        this.centerColor = centerColor;
    }
    FlowerCenter.prototype.draw = function (context) {
        context.save();
        context.beginPath();
        context.arc(this.centerPoint.x, this.centerPoint.y, this.centerRadius, 0, 2 * Math.PI);
        context.fillStyle = this.centerColor;
        context.fill();
        context.restore();
    };
    return FlowerCenter;
}());
exports.FlowerCenter = FlowerCenter;


/***/ }),

/***/ "./src/models/flower.ts":
/*!******************************!*\
  !*** ./src/models/flower.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Flower = void 0;
var petal_1 = __webpack_require__(/*! ./petal */ "./src/models/petal.ts");
var Flower = (function () {
    function Flower(flowerCenter, numberOfPetals, petal) {
        this.flowerCenter = flowerCenter;
        this.numberOfPetals = numberOfPetals;
        this.petal = petal;
        this.stopChanging = false;
        this.originalPetalRadius = this.petal.radius;
    }
    Flower.prototype.draw = function (context) {
        this.drawPetals(context);
        this.flowerCenter.draw(context);
    };
    Flower.prototype.increasePetalRadius = function () {
        this.petal = new petal_1.Petal(this.petal.centerPoint, this.petal.radius + 0.2, this.petal.tipSkewRatio, this.petal.angleSpan, this.petal.color);
    };
    Flower.prototype.increasePetalRadiusWithLimit = function () {
        if (this.petal.radius < this.originalPetalRadius + 20) {
            this.stopChanging = false;
            this.increasePetalRadius();
        }
        else {
            this.stopChanging = true;
        }
    };
    Flower.prototype.drawPetals = function (context) {
        context.save();
        var rotateAngle = (2 * Math.PI) / this.numberOfPetals;
        for (var i = 0; i < this.numberOfPetals; i++) {
            context.translate(this.petal.centerPoint.x, this.petal.centerPoint.y);
            context.rotate(rotateAngle);
            context.translate(-this.petal.centerPoint.x, -this.petal.centerPoint.y);
            this.petal.draw(context);
        }
        context.restore();
    };
    return Flower;
}());
exports.Flower = Flower;


/***/ }),

/***/ "./src/models/petal.ts":
/*!*****************************!*\
  !*** ./src/models/petal.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Petal = void 0;
var point_1 = __webpack_require__(/*! ./point */ "./src/models/point.ts");
var rad = Math.PI / 180;
var tangent = 0.2;
var Petal = (function () {
    function Petal(centerPoint, radius, tipSkewRatio, angleSpan, color) {
        this.centerPoint = centerPoint;
        this.radius = radius;
        this.tipSkewRatio = tipSkewRatio;
        this.angleSpan = angleSpan;
        this.color = color;
        this.vertices = this.getVertices();
        this.controlPoints = this.getControlPoints(this.vertices);
    }
    Petal.prototype.draw = function (context) {
        context.save();
        context.beginPath();
        context.moveTo(this.centerPoint.x, this.centerPoint.y);
        context.quadraticCurveTo(this.controlPoints[1][1].x, this.controlPoints[1][1].y, this.vertices[1].x, this.vertices[1].y);
        context.bezierCurveTo(this.controlPoints[1][0].x, this.controlPoints[1][0].y, this.controlPoints[2][1].x, this.controlPoints[2][1].y, this.vertices[2].x, this.vertices[2].y);
        context.bezierCurveTo(this.controlPoints[2][0].x, this.controlPoints[2][0].y, this.controlPoints[3][1].x, this.controlPoints[3][1].y, this.vertices[3].x, this.vertices[3].y);
        context.quadraticCurveTo(this.controlPoints[3][0].x, this.controlPoints[3][0].y, this.centerPoint.x, this.centerPoint.y);
        context.fillStyle = this.color;
        context.fill();
        context.restore();
    };
    Petal.prototype.getVertices = function () {
        var halfAngleSpan = 0.5 * this.angleSpan * rad;
        var dx = this.radius * Math.sin(halfAngleSpan);
        var dy = this.radius * Math.cos(halfAngleSpan);
        var tipRadius = this.radius * this.tipSkewRatio;
        return [
            this.centerPoint,
            new point_1.Point(this.centerPoint.x - dx, this.centerPoint.y - dy),
            new point_1.Point(this.centerPoint.x, this.centerPoint.y - tipRadius),
            new point_1.Point(this.centerPoint.x + dx, this.centerPoint.y - dy),
            this.centerPoint
        ];
    };
    Petal.prototype.getControlPoints = function (vertices) {
        var controlPoints = [];
        for (var i = 1; i < vertices.length - 1; i++) {
            var dx = (vertices[i - 1].x - vertices[i + 1].x) * tangent;
            var dy = (vertices[i - 1].y - vertices[i + 1].y) * tangent;
            controlPoints[i] = [];
            controlPoints[i].push(new point_1.Point(vertices[i].x - dx, vertices[i].y - dy));
            controlPoints[i].push(new point_1.Point(vertices[i].x + dx, vertices[i].y + dy));
        }
        return controlPoints;
    };
    return Petal;
}());
exports.Petal = Petal;


/***/ }),

/***/ "./src/models/point.ts":
/*!*****************************!*\
  !*** ./src/models/point.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Point = void 0;
var Point = (function () {
    function Point(x, y) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        this.x = x;
        this.y = y;
        this.x = Math.floor(this.x);
        this.y = Math.floor(this.y);
    }
    return Point;
}());
exports.Point = Point;


/***/ }),

/***/ "./src/services/flower-randomization.service.ts":
/*!******************************************************!*\
  !*** ./src/services/flower-randomization.service.ts ***!
  \******************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FlowerRandomizationService = void 0;
var flower_1 = __webpack_require__(/*! ../models/flower */ "./src/models/flower.ts");
var point_1 = __webpack_require__(/*! ../models/point */ "./src/models/point.ts");
var flower_center_1 = __webpack_require__(/*! ../models/flower-center */ "./src/models/flower-center.ts");
var petal_1 = __webpack_require__(/*! ../models/petal */ "./src/models/petal.ts");
var FlowerRandomizationService = (function () {
    function FlowerRandomizationService() {
        this.colors = [
            '#f10e57',
            '#ea767a',
            '#ff6d3d',
            '#ecac43',
            '#fb9983',
            '#f9bc9f',
            '#f8ed38',
            '#a8e3f9',
            '#d1f2fd',
            '#ecd5f5',
            '#fee4fd',
            '#8520b4',
            '#fa2e59',
            '#ff703f',
            '#ff703f',
            '#f7bc05',
            '#ecf6bb',
            '#76bcad'
        ];
    }
    FlowerRandomizationService.prototype.getFlowerAt = function (point) {
        var flowerCenter = new flower_center_1.FlowerCenter(point, this.randomIntFromInterval(5, 16), this.randomColor());
        var numberOfPetals = this.randomIntFromInterval(4, 8);
        var petalAngleSpacing = this.randomIntFromInterval(5, 25);
        var petalAngleSpan = 360 / numberOfPetals - petalAngleSpacing;
        var petal = new petal_1.Petal(point, this.randomIntFromInterval(20, 50), this.randomIntFromInterval(9, 14) / 10, petalAngleSpan, this.randomColor());
        return new flower_1.Flower(flowerCenter, numberOfPetals, petal);
    };
    FlowerRandomizationService.prototype.getFlowerOnCanvas = function (canvasWidth, canvasHeight) {
        return this.getFlowerAt(new point_1.Point(this.randomIntLessThan(canvasWidth), this.randomIntLessThan(canvasHeight)));
    };
    FlowerRandomizationService.prototype.randomIntFromInterval = function (min, max) {
        return Math.floor(Math.random() * (max - min) + min);
    };
    FlowerRandomizationService.prototype.randomIntLessThan = function (n) {
        return this.randomIntFromInterval(0, n);
    };
    FlowerRandomizationService.prototype.randomColor = function () {
        return this.colors[this.randomIntLessThan(this.colors.length)];
    };
    return FlowerRandomizationService;
}());
exports.FlowerRandomizationService = FlowerRandomizationService;


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/

Object.defineProperty(exports, "__esModule", ({ value: true }));
var interactive_flowers_1 = __webpack_require__(/*! ./animations/interactive-flowers */ "./src/animations/interactive-flowers.ts");
function main() {
    if (navigator.serviceWorker.controller) {
        console.log('Active service worker found, no need to register');
    }
    else {
        navigator.serviceWorker
            .register('sw.js', {
            scope: './'
        })
            .then(function (reg) {
            console.log("SW has been registered for scope (" + reg.scope + ")");
        });
    }
    var canvas = document.getElementById('flowers');
    canvas.width = document.body.clientWidth;
    canvas.height = document.body.clientHeight;
    var flowers = new interactive_flowers_1.InteractiveFlowers(canvas);
    var btn = document.getElementById('clearBtn');
    btn.addEventListener('click', function () {
        flowers.clearCanvas();
    });
}
main();

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9jYW52YXMtYW5pbWF0aW9uLXN0ZXAtYnktc3RlcC8uL3NyYy9hbmltYXRpb25zL2ludGVyYWN0aXZlLWZsb3dlcnMudHMiLCJ3ZWJwYWNrOi8vY2FudmFzLWFuaW1hdGlvbi1zdGVwLWJ5LXN0ZXAvLi9zcmMvbW9kZWxzL2Zsb3dlci1jZW50ZXIudHMiLCJ3ZWJwYWNrOi8vY2FudmFzLWFuaW1hdGlvbi1zdGVwLWJ5LXN0ZXAvLi9zcmMvbW9kZWxzL2Zsb3dlci50cyIsIndlYnBhY2s6Ly9jYW52YXMtYW5pbWF0aW9uLXN0ZXAtYnktc3RlcC8uL3NyYy9tb2RlbHMvcGV0YWwudHMiLCJ3ZWJwYWNrOi8vY2FudmFzLWFuaW1hdGlvbi1zdGVwLWJ5LXN0ZXAvLi9zcmMvbW9kZWxzL3BvaW50LnRzIiwid2VicGFjazovL2NhbnZhcy1hbmltYXRpb24tc3RlcC1ieS1zdGVwLy4vc3JjL3NlcnZpY2VzL2Zsb3dlci1yYW5kb21pemF0aW9uLnNlcnZpY2UudHMiLCJ3ZWJwYWNrOi8vY2FudmFzLWFuaW1hdGlvbi1zdGVwLWJ5LXN0ZXAvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vY2FudmFzLWFuaW1hdGlvbi1zdGVwLWJ5LXN0ZXAvLi9zcmMvbWFpbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBQ0Esa0ZBQXdDO0FBQ3hDLDJKQUFzRjtBQUV0RjtJQVNFLDRCQUE2QixNQUF5QjtRQUF6QixXQUFNLEdBQU4sTUFBTSxDQUFtQjtRQUw5QyxZQUFPLEdBQWEsRUFBRSxDQUFDO1FBQ2QseUJBQW9CLEdBQUcsSUFBSSx5REFBMEIsRUFBRSxDQUFDO1FBQ2pFLGtCQUFhLEdBQUcsS0FBSyxDQUFDO1FBQ3RCLGtCQUFhLEdBQUcsSUFBSSxhQUFLLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUc1QyxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsVUFBVSxD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QUFNLENBQUMsTUFBTSxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDO0lBQzNDLElBQU0sT0FBTyxHQUFHLElBQUksd0NBQWtCLENBQUMsTUFBTSxDQUFDLENBQUM7SUFFL0MsSUFBTSxHQUFHLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUNoRCxHQUFHLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFO1FBQzVCLE9BQU8sQ0FBQyxXQUFXLEVBQUUsQ0FBQztJQUN4QixDQUFDLENBQUMsQ0FBQztBQUNMLENBQUM7QUFFRCxJQUFJLEVBQUUsQ0FBQyIsImZpbGUiOiJtYWluLmJ1bmRsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEZsb3dlciB9IGZyb20gJy4uL21vZGVscy9mbG93ZXInO1xyXG5pbXBvcnQgeyBQb2ludCB9IGZyb20gJy4uL21vZGVscy9wb2ludCc7XHJcbmltcG9ydCB7IEZsb3dlclJhbmRvbWl6YXRpb25TZXJ2aWNlIH0gZnJvbSAnLi4vc2VydmljZXMvZmxvd2VyLXJhbmRvbWl6YXRpb24uc2VydmljZSc7XHJcblxyXG5leHBvcnQgY2xhc3MgSW50ZXJhY3RpdmVGbG93ZXJzIHtcclxuICBwcml2YXRlIHJlYWRvbmx5IGNvbnRleHQ6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRDtcclxuICBwcml2YXRlIHJlYWRvbmx5IGNhbnZhc1dpZHRoOiBudW1iZXI7XHJcbiAgcHJpdmF0ZSByZWFkb25seSBjYW52YXNIZWlnaHQ6IG51bWJlcjtcclxuICBwcml2YXRlIGZsb3dlcnM6IEZsb3dlcltdID0gW107XHJcbiAgcHJpdmF0ZSByZWFkb25seSByYW5kb21pemF0aW9uU2VydmljZSA9IG5ldyBGbG93ZXJSYW5kb21pemF0aW9uU2VydmljZSgpO1xyXG4gIHByaXZhdGUgY3RybElzUHJlc3NlZCA9IGZhbHNlO1xyXG4gIHByaXZhdGUgbW91c2VQb3NpdGlvbiA9IG5ldyBQb2ludCgtMTAwLCAtMTAwKTtcclxuXHJcbiAgY29uc3RydWN0b3IocHJpdmF0ZSByZWFkb25seSBjYW52YXM6IEhUTUxDYW52YXNFbGVtZW50KSB7XHJcbiAgICB0aGlzLmNvbnRleHQgPSB0aGlzLmNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xyXG4gICAgdGhpcy5jYW52YXNXaWR0aCA9IHRoaXMuY2FudmFzLndpZHRoO1xyXG4gICAgdGhpcy5jYW52YXNIZWlnaHQgPSB0aGlzLmNhbnZhcy5oZWlnaHQ7XHJcblxyXG4gICAgdGhpcy5hZGRTaGFkb3dFZmZlY3QoKTtcclxuICAgIHRoaXMuYWRkSW50ZXJhY3Rpb25zKCk7XHJcbiAgfVxyXG5cclxuICBjbGVhckNhbnZhcygpIHtcclxuICAgIHRoaXMuZmxvd2VycyA9IFtdO1xyXG4gICAgdGhpcy5jb250ZXh0LmNsZWFyUmVjdCgwLCAwLCB0aGlzLmNhbnZhc1dpZHRoLCB0aGlzLmNhbnZhc0hlaWdodCk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGFuaW1hdGVGbG93ZXJzKCkge1xyXG4gICAgaWYgKHRoaXMuZmxvd2Vycy5ldmVyeShmID0+IGYuc3RvcENoYW5naW5nKSkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICB0aGlzLmNvbnRleHQuY2xlYXJSZWN0KDAsIDAsIHRoaXMuY2FudmFzV2lkdGgsIHRoaXMuY2FudmFzSGVpZ2h0KTtcclxuICAgIHRoaXMuZmxvd2Vycy5mb3JFYWNoKGZsb3dlciA9PiB7XHJcbiAgICAgIGZsb3dlci5pbmNyZWFzZVBldGFsUmFkaXVzV2l0aExpbWl0KCk7XHJcbiAgICAgIGZsb3dlci5kcmF3KHRoaXMuY29udGV4dCk7XHJcbiAgICB9KTtcclxuICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4gdGhpcy5hbmltYXRlRmxvd2VycygpKTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgYWRkSW50ZXJhY3Rpb25zKCkge1xyXG4gICAgdGhpcy5jYW52YXMuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBlID0+IHtcclxuICAgICAgaWYgKHRoaXMuY3RybElzUHJlc3NlZCkge1xyXG4gICAgICAgIHRoaXMuY2xlYXJDYW52YXMoKTtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuICAgICAgdGhpcy5jYWxjdWxhdGVNb3VzZVJlbGF0aXZlUG9zaXRpb25JbkNhbnZhcyhlKTtcclxuICAgICAgY29uc3QgZmxvd2VyID0gdGhpcy5yYW5kb21pemF0aW9uU2VydmljZS5nZXRGbG93ZXJBdCh0aGlzLm1vdXNlUG9zaXRpb24pO1xyXG4gICAgICB0aGlzLmZsb3dlcnMucHVzaChmbG93ZXIpO1xyXG4gICAgICB0aGlzLmFuaW1hdGVGbG93ZXJzKCk7XHJcbiAgICB9KTtcclxuXHJcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIChlOiBLZXlib2FyZEV2ZW50KSA9PiB7XHJcbiAgICAgIGlmIChlLndoaWNoID09PSAxNyB8fCBlLmtleUNvZGUgPT09IDE3KSB7XHJcbiAgICAgICAgdGhpcy5jdHJsSXNQcmVzc2VkID0gdHJ1ZTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigna2V5dXAnLCAoKSA9PiB7XHJcbiAgICAgIHRoaXMuY3RybElzUHJlc3NlZCA9IGZhbHNlO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGNhbGN1bGF0ZU1vdXNlUmVsYXRpdmVQb3NpdGlvbkluQ2FudmFzKGU6IE1vdXNlRXZlbnQpIHtcclxuICAgIHRoaXMubW91c2VQb3NpdGlvbiA9IG5ldyBQb2ludChcclxuICAgICAgZS5jbGllbnRYICtcclxuICAgICAgICAoZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnNjcm9sbExlZnQgfHwgZG9jdW1lbnQuYm9keS5zY3JvbGxMZWZ0KSAtXHJcbiAgICAgICAgdGhpcy5jYW52YXMub2Zmc2V0TGVmdCxcclxuICAgICAgZS5jbGllbnRZICtcclxuICAgICAgICAoZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnNjcm9sbFRvcCB8fCBkb2N1bWVudC5ib2R5LnNjcm9sbFRvcCkgLVxyXG4gICAgICAgIHRoaXMuY2FudmFzLm9mZnNldFRvcFxyXG4gICAgKTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgYWRkU2hhZG93RWZmZWN0KCkge1xyXG4gICAgdGhpcy5jb250ZXh0LnNoYWRvd0JsdXIgPSA1O1xyXG4gICAgdGhpcy5jb250ZXh0LnNoYWRvd09mZnNldFggPSAyO1xyXG4gICAgdGhpcy5jb250ZXh0LnNoYWRvd09mZnNldFkgPSAyO1xyXG4gICAgdGhpcy5jb250ZXh0LnNoYWRvd0NvbG9yID0gJyMzMzMnO1xyXG4gICAgdGhpcy5jb250ZXh0Lmdsb2JhbEFscGhhID0gMC44O1xyXG4gIH1cclxufVxyXG4iLCJpbXBvcnQgeyBQb2ludCB9IGZyb20gJy4vcG9pbnQnO1xyXG5cclxuZXhwb3J0IGNsYXNzIEZsb3dlckNlbnRlciB7XHJcbiAgY29uc3RydWN0b3IoXHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IGNlbnRlclBvaW50OiBQb2ludCxcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgY2VudGVyUmFkaXVzOiBudW1iZXIsXHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IGNlbnRlckNvbG9yOiBzdHJpbmdcclxuICApIHt9XHJcblxyXG4gIGRyYXcoY29udGV4dDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEKSB7XHJcbiAgICBjb250ZXh0LnNhdmUoKTtcclxuICAgIGNvbnRleHQuYmVnaW5QYXRoKCk7XHJcbiAgICBjb250ZXh0LmFyYyhcclxuICAgICAgdGhpcy5jZW50ZXJQb2ludC54LFxyXG4gICAgICB0aGlzLmNlbnRlclBvaW50LnksXHJcbiAgICAgIHRoaXMuY2VudGVyUmFkaXVzLFxyXG4gICAgICAwLFxyXG4gICAgICAyICogTWF0aC5QSVxyXG4gICAgKTtcclxuICAgIGNvbnRleHQuZmlsbFN0eWxlID0gdGhpcy5jZW50ZXJDb2xvcjtcclxuICAgIGNvbnRleHQuZmlsbCgpO1xyXG4gICAgY29udGV4dC5yZXN0b3JlKCk7XHJcbiAgfVxyXG59XHJcbiIsImltcG9ydCB7IFBldGFsIH0gZnJvbSAnLi9wZXRhbCc7XHJcbmltcG9ydCB7IEZsb3dlckNlbnRlciB9IGZyb20gJy4vZmxvd2VyLWNlbnRlcic7XHJcblxyXG5leHBvcnQgY2xhc3MgRmxvd2VyIHtcclxuICBwcml2YXRlIHJlYWRvbmx5IG9yaWdpbmFsUGV0YWxSYWRpdXM6IG51bWJlcjtcclxuICBwdWJsaWMgc3RvcENoYW5naW5nID0gZmFsc2U7XHJcblxyXG4gIGNvbnN0cnVjdG9yKFxyXG4gICAgcHJpdmF0ZSByZWFkb25seSBmbG93ZXJDZW50ZXI6IEZsb3dlckNlbnRlcixcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgbnVtYmVyT2ZQZXRhbHM6IG51bWJlcixcclxuICAgIHByaXZhdGUgcGV0YWw6IFBldGFsXHJcbiAgKSB7XHJcbiAgICB0aGlzLm9yaWdpbmFsUGV0YWxSYWRpdXMgPSB0aGlzLnBldGFsLnJhZGl1cztcclxuICB9XHJcblxyXG4gIGRyYXcoY29udGV4dDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEKSB7XHJcbiAgICB0aGlzLmRyYXdQZXRhbHMoY29udGV4dCk7XHJcbiAgICB0aGlzLmZsb3dlckNlbnRlci5kcmF3KGNvbnRleHQpO1xyXG4gIH1cclxuXHJcbiAgaW5jcmVhc2VQZXRhbFJhZGl1cygpIHtcclxuICAgIHRoaXMucGV0YWwgPSBuZXcgUGV0YWwoXHJcbiAgICAgIHRoaXMucGV0YWwuY2VudGVyUG9pbnQsXHJcbiAgICAgIHRoaXMucGV0YWwucmFkaXVzICsgMC4yLFxyXG4gICAgICB0aGlzLnBldGFsLnRpcFNrZXdSYXRpbyxcclxuICAgICAgdGhpcy5wZXRhbC5hbmdsZVNwYW4sXHJcbiAgICAgIHRoaXMucGV0YWwuY29sb3JcclxuICAgICk7XHJcbiAgfVxyXG5cclxuICBpbmNyZWFzZVBldGFsUmFkaXVzV2l0aExpbWl0KCkge1xyXG4gICAgaWYgKHRoaXMucGV0YWwucmFkaXVzIDwgdGhpcy5vcmlnaW5hbFBldGFsUmFkaXVzICsgMjApIHtcclxuICAgICAgdGhpcy5zdG9wQ2hhbmdpbmcgPSBmYWxzZTtcclxuICAgICAgdGhpcy5pbmNyZWFzZVBldGFsUmFkaXVzKCk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLnN0b3BDaGFuZ2luZyA9IHRydWU7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGRyYXdQZXRhbHMoY29udGV4dDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEKSB7XHJcbiAgICBjb250ZXh0LnNhdmUoKTtcclxuICAgIGNvbnN0IHJvdGF0ZUFuZ2xlID0gKDIgKiBNYXRoLlBJKSAvIHRoaXMubnVtYmVyT2ZQZXRhbHM7XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMubnVtYmVyT2ZQZXRhbHM7IGkrKykge1xyXG4gICAgICBjb250ZXh0LnRyYW5zbGF0ZSh0aGlzLnBldGFsLmNlbnRlclBvaW50LngsIHRoaXMucGV0YWwuY2VudGVyUG9pbnQueSk7XHJcbiAgICAgIGNvbnRleHQucm90YXRlKHJvdGF0ZUFuZ2xlKTtcclxuICAgICAgY29udGV4dC50cmFuc2xhdGUoLXRoaXMucGV0YWwuY2VudGVyUG9pbnQueCwgLXRoaXMucGV0YWwuY2VudGVyUG9pbnQueSk7XHJcbiAgICAgIHRoaXMucGV0YWwuZHJhdyhjb250ZXh0KTtcclxuICAgIH1cclxuICAgIGNvbnRleHQucmVzdG9yZSgpO1xyXG4gIH1cclxufVxyXG4iLCJpbXBvcnQgeyBQb2ludCB9IGZyb20gJy4vcG9pbnQnO1xyXG5cclxuY29uc3QgcmFkID0gTWF0aC5QSSAvIDE4MDtcclxuY29uc3QgdGFuZ2VudCA9IDAuMjtcclxuXHJcbmV4cG9ydCBjbGFzcyBQZXRhbCB7XHJcbiAgcHJpdmF0ZSByZWFkb25seSB2ZXJ0aWNlczogUG9pbnRbXTtcclxuICBwcml2YXRlIHJlYWRvbmx5IGNvbnRyb2xQb2ludHM6IFBvaW50W11bXTtcclxuXHJcbiAgY29uc3RydWN0b3IoXHJcbiAgICBwdWJsaWMgcmVhZG9ubHkgY2VudGVyUG9pbnQ6IFBvaW50LFxyXG4gICAgcHVibGljIHJlYWRvbmx5IHJhZGl1czogbnVtYmVyLFxyXG4gICAgcHVibGljIHJlYWRvbmx5IHRpcFNrZXdSYXRpbzogbnVtYmVyLFxyXG4gICAgcHVibGljIHJlYWRvbmx5IGFuZ2xlU3BhbjogbnVtYmVyLFxyXG4gICAgcHVibGljIHJlYWRvbmx5IGNvbG9yOiBzdHJpbmdcclxuICApIHtcclxuICAgIHRoaXMudmVydGljZXMgPSB0aGlzLmdldFZlcnRpY2VzKCk7XHJcbiAgICB0aGlzLmNvbnRyb2xQb2ludHMgPSB0aGlzLmdldENvbnRyb2xQb2ludHModGhpcy52ZXJ0aWNlcyk7XHJcbiAgfVxyXG5cclxuICBkcmF3KGNvbnRleHQ6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCkge1xyXG4gICAgY29udGV4dC5zYXZlKCk7XHJcbiAgICBjb250ZXh0LmJlZ2luUGF0aCgpO1xyXG4gICAgY29udGV4dC5tb3ZlVG8odGhpcy5jZW50ZXJQb2ludC54LCB0aGlzLmNlbnRlclBvaW50LnkpO1xyXG4gICAgY29udGV4dC5xdWFkcmF0aWNDdXJ2ZVRvKFxyXG4gICAgICB0aGlzLmNvbnRyb2xQb2ludHNbMV1bMV0ueCxcclxuICAgICAgdGhpcy5jb250cm9sUG9pbnRzWzFdWzFdLnksXHJcbiAgICAgIHRoaXMudmVydGljZXNbMV0ueCxcclxuICAgICAgdGhpcy52ZXJ0aWNlc1sxXS55XHJcbiAgICApO1xyXG4gICAgY29udGV4dC5iZXppZXJDdXJ2ZVRvKFxyXG4gICAgICB0aGlzLmNvbnRyb2xQb2ludHNbMV1bMF0ueCxcclxuICAgICAgdGhpcy5jb250cm9sUG9pbnRzWzFdWzBdLnksXHJcbiAgICAgIHRoaXMuY29udHJvbFBvaW50c1syXVsxXS54LFxyXG4gICAgICB0aGlzLmNvbnRyb2xQb2ludHNbMl1bMV0ueSxcclxuICAgICAgdGhpcy52ZXJ0aWNlc1syXS54LFxyXG4gICAgICB0aGlzLnZlcnRpY2VzWzJdLnlcclxuICAgICk7XHJcbiAgICBjb250ZXh0LmJlemllckN1cnZlVG8oXHJcbiAgICAgIHRoaXMuY29udHJvbFBvaW50c1syXVswXS54LFxyXG4gICAgICB0aGlzLmNvbnRyb2xQb2ludHNbMl1bMF0ueSxcclxuICAgICAgdGhpcy5jb250cm9sUG9pbnRzWzNdWzFdLngsXHJcbiAgICAgIHRoaXMuY29udHJvbFBvaW50c1szXVsxXS55LFxyXG4gICAgICB0aGlzLnZlcnRpY2VzWzNdLngsXHJcbiAgICAgIHRoaXMudmVydGljZXNbM10ueVxyXG4gICAgKTtcclxuICAgIGNvbnRleHQucXVhZHJhdGljQ3VydmVUbyhcclxuICAgICAgdGhpcy5jb250cm9sUG9pbnRzWzNdWzBdLngsXHJcbiAgICAgIHRoaXMuY29udHJvbFBvaW50c1szXVswXS55LFxyXG4gICAgICB0aGlzLmNlbnRlclBvaW50LngsXHJcbiAgICAgIHRoaXMuY2VudGVyUG9pbnQueVxyXG4gICAgKTtcclxuICAgIGNvbnRleHQuZmlsbFN0eWxlID0gdGhpcy5jb2xvcjtcclxuICAgIGNvbnRleHQuZmlsbCgpO1xyXG4gICAgY29udGV4dC5yZXN0b3JlKCk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGdldFZlcnRpY2VzKCk6IFBvaW50W10ge1xyXG4gICAgY29uc3QgaGFsZkFuZ2xlU3BhbiA9IDAuNSAqIHRoaXMuYW5nbGVTcGFuICogcmFkO1xyXG4gICAgY29uc3QgZHggPSB0aGlzLnJhZGl1cyAqIE1hdGguc2luKGhhbGZBbmdsZVNwYW4pO1xyXG4gICAgY29uc3QgZHkgPSB0aGlzLnJhZGl1cyAqIE1hdGguY29zKGhhbGZBbmdsZVNwYW4pO1xyXG4gICAgY29uc3QgdGlwUmFkaXVzID0gdGhpcy5yYWRpdXMgKiB0aGlzLnRpcFNrZXdSYXRpbztcclxuICAgIHJldHVybiBbXHJcbiAgICAgIHRoaXMuY2VudGVyUG9pbnQsXHJcbiAgICAgIG5ldyBQb2ludCh0aGlzLmNlbnRlclBvaW50LnggLSBkeCwgdGhpcy5jZW50ZXJQb2ludC55IC0gZHkpLFxyXG4gICAgICBuZXcgUG9pbnQodGhpcy5jZW50ZXJQb2ludC54LCB0aGlzLmNlbnRlclBvaW50LnkgLSB0aXBSYWRpdXMpLFxyXG4gICAgICBuZXcgUG9pbnQodGhpcy5jZW50ZXJQb2ludC54ICsgZHgsIHRoaXMuY2VudGVyUG9pbnQueSAtIGR5KSxcclxuICAgICAgdGhpcy5jZW50ZXJQb2ludFxyXG4gICAgXTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgZ2V0Q29udHJvbFBvaW50cyh2ZXJ0aWNlczogUG9pbnRbXSk6IFBvaW50W11bXSB7XHJcbiAgICBjb25zdCBjb250cm9sUG9pbnRzOiBQb2ludFtdW10gPSBbXTtcclxuICAgIGZvciAobGV0IGkgPSAxOyBpIDwgdmVydGljZXMubGVuZ3RoIC0gMTsgaSsrKSB7XHJcbiAgICAgIGNvbnN0IGR4ID0gKHZlcnRpY2VzW2kgLSAxXS54IC0gdmVydGljZXNbaSArIDFdLngpICogdGFuZ2VudDtcclxuICAgICAgY29uc3QgZHkgPSAodmVydGljZXNbaSAtIDFdLnkgLSB2ZXJ0aWNlc1tpICsgMV0ueSkgKiB0YW5nZW50O1xyXG4gICAgICBjb250cm9sUG9pbnRzW2ldID0gW107XHJcbiAgICAgIGNvbnRyb2xQb2ludHNbaV0ucHVzaChuZXcgUG9pbnQodmVydGljZXNbaV0ueCAtIGR4LCB2ZXJ0aWNlc1tpXS55IC0gZHkpKTtcclxuICAgICAgY29udHJvbFBvaW50c1tpXS5wdXNoKG5ldyBQb2ludCh2ZXJ0aWNlc1tpXS54ICsgZHgsIHZlcnRpY2VzW2ldLnkgKyBkeSkpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGNvbnRyb2xQb2ludHM7XHJcbiAgfVxyXG59XHJcbiIsImV4cG9ydCBjbGFzcyBQb2ludCB7XHJcbiAgY29uc3RydWN0b3IocHVibGljIHJlYWRvbmx5IHggPSAwLCBwdWJsaWMgcmVhZG9ubHkgeSA9IDApIHtcclxuICAgIHRoaXMueCA9IE1hdGguZmxvb3IodGhpcy54KTtcclxuICAgIHRoaXMueSA9IE1hdGguZmxvb3IodGhpcy55KTtcclxuICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgRmxvd2VyIH0gZnJvbSAnLi4vbW9kZWxzL2Zsb3dlcic7XHJcbmltcG9ydCB7IFBvaW50IH0gZnJvbSAnLi4vbW9kZWxzL3BvaW50JztcclxuaW1wb3J0IHsgRmxvd2VyQ2VudGVyIH0gZnJvbSAnLi4vbW9kZWxzL2Zsb3dlci1jZW50ZXInO1xyXG5pbXBvcnQgeyBQZXRhbCB9IGZyb20gJy4uL21vZGVscy9wZXRhbCc7XHJcblxyXG5leHBvcnQgY2xhc3MgRmxvd2VyUmFuZG9taXphdGlvblNlcnZpY2Uge1xyXG4gIHByaXZhdGUgcmVhZG9ubHkgY29sb3JzID0gW1xyXG4gICAgJyNmMTBlNTcnLFxyXG4gICAgJyNlYTc2N2EnLFxyXG4gICAgJyNmZjZkM2QnLFxyXG4gICAgJyNlY2FjNDMnLFxyXG4gICAgJyNmYjk5ODMnLFxyXG4gICAgJyNmOWJjOWYnLFxyXG4gICAgJyNmOGVkMzgnLFxyXG4gICAgJyNhOGUzZjknLFxyXG4gICAgJyNkMWYyZmQnLFxyXG4gICAgJyNlY2Q1ZjUnLFxyXG4gICAgJyNmZWU0ZmQnLFxyXG4gICAgJyM4NTIwYjQnLFxyXG4gICAgJyNmYTJlNTknLFxyXG4gICAgJyNmZjcwM2YnLFxyXG4gICAgJyNmZjcwM2YnLFxyXG4gICAgJyNmN2JjMDUnLFxyXG4gICAgJyNlY2Y2YmInLFxyXG4gICAgJyM3NmJjYWQnXHJcbiAgXTtcclxuXHJcbiAgY29uc3RydWN0b3IoKSB7fVxyXG5cclxuICBnZXRGbG93ZXJBdChwb2ludDogUG9pbnQpOiBGbG93ZXIge1xyXG4gICAgY29uc3QgZmxvd2VyQ2VudGVyID0gbmV3IEZsb3dlckNlbnRlcihcclxuICAgICAgcG9pbnQsXHJcbiAgICAgIHRoaXMucmFuZG9tSW50RnJvbUludGVydmFsKDUsIDE2KSxcclxuICAgICAgdGhpcy5yYW5kb21Db2xvcigpXHJcbiAgICApO1xyXG4gICAgY29uc3QgbnVtYmVyT2ZQZXRhbHMgPSB0aGlzLnJhbmRvbUludEZyb21JbnRlcnZhbCg0LCA4KTtcclxuICAgIGNvbnN0IHBldGFsQW5nbGVTcGFjaW5nID0gdGhpcy5yYW5kb21JbnRGcm9tSW50ZXJ2YWwoNSwgMjUpO1xyXG4gICAgY29uc3QgcGV0YWxBbmdsZVNwYW4gPSAzNjAgLyBudW1iZXJPZlBldGFscyAtIHBldGFsQW5nbGVTcGFjaW5nO1xyXG4gICAgY29uc3QgcGV0YWwgPSBuZXcgUGV0YWwoXHJcbiAgICAgIHBvaW50LFxyXG4gICAgICB0aGlzLnJhbmRvbUludEZyb21JbnRlcnZhbCgyMCwgNTApLFxyXG4gICAgICB0aGlzLnJhbmRvbUludEZyb21JbnRlcnZhbCg5LCAxNCkgLyAxMCxcclxuICAgICAgcGV0YWxBbmdsZVNwYW4sXHJcbiAgICAgIHRoaXMucmFuZG9tQ29sb3IoKVxyXG4gICAgKTtcclxuICAgIHJldHVybiBuZXcgRmxvd2VyKGZsb3dlckNlbnRlciwgbnVtYmVyT2ZQZXRhbHMsIHBldGFsKTtcclxuICB9XHJcblxyXG4gIGdldEZsb3dlck9uQ2FudmFzKGNhbnZhc1dpZHRoOiBudW1iZXIsIGNhbnZhc0hlaWdodDogbnVtYmVyKTogRmxvd2VyIHtcclxuICAgIHJldHVybiB0aGlzLmdldEZsb3dlckF0KFxyXG4gICAgICBuZXcgUG9pbnQoXHJcbiAgICAgICAgdGhpcy5yYW5kb21JbnRMZXNzVGhhbihjYW52YXNXaWR0aCksXHJcbiAgICAgICAgdGhpcy5yYW5kb21JbnRMZXNzVGhhbihjYW52YXNIZWlnaHQpXHJcbiAgICAgIClcclxuICAgICk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHJhbmRvbUludEZyb21JbnRlcnZhbChtaW46IG51bWJlciwgbWF4OiBudW1iZXIpOiBudW1iZXIge1xyXG4gICAgLy8gbWluOiBpbmNsdXNpdmU7IG1heDogZXhjbHVzaXZlXHJcbiAgICByZXR1cm4gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKG1heCAtIG1pbikgKyBtaW4pO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSByYW5kb21JbnRMZXNzVGhhbihuOiBudW1iZXIpOiBudW1iZXIge1xyXG4gICAgcmV0dXJuIHRoaXMucmFuZG9tSW50RnJvbUludGVydmFsKDAsIG4pO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSByYW5kb21Db2xvcigpOiBzdHJpbmcge1xyXG4gICAgcmV0dXJuIHRoaXMuY29sb3JzW3RoaXMucmFuZG9tSW50TGVzc1RoYW4odGhpcy5jb2xvcnMubGVuZ3RoKV07XHJcbiAgfVxyXG59XHJcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdGlmKF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0pIHtcblx0XHRyZXR1cm4gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiaW1wb3J0IHsgSW50ZXJhY3RpdmVGbG93ZXJzIH0gZnJvbSAnLi9hbmltYXRpb25zL2ludGVyYWN0aXZlLWZsb3dlcnMnO1xyXG5cclxuZnVuY3Rpb24gbWFpbigpIHtcclxuICBpZiAobmF2aWdhdG9yLnNlcnZpY2VXb3JrZXIuY29udHJvbGxlcikge1xyXG4gICAgY29uc29sZS5sb2coJ0FjdGl2ZSBzZXJ2aWNlIHdvcmtlciBmb3VuZCwgbm8gbmVlZCB0byByZWdpc3RlcicpO1xyXG4gIH0gZWxzZSB7XHJcbiAgICBuYXZpZ2F0b3Iuc2VydmljZVdvcmtlclxyXG4gICAgICAucmVnaXN0ZXIoJ3N3LmpzJywge1xyXG4gICAgICAgIHNjb3BlOiAnLi8nXHJcbiAgICAgIH0pXHJcbiAgICAgIC50aGVuKGZ1bmN0aW9uKHJlZykge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGBTVyBoYXMgYmVlbiByZWdpc3RlcmVkIGZvciBzY29wZSAoJHtyZWcuc2NvcGV9KWApO1xyXG4gICAgICB9KTtcclxuICB9XHJcblxyXG4gIGNvbnN0IGNhbnZhcyA9IDxIVE1MQ2FudmFzRWxlbWVudD5kb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZmxvd2VycycpO1xyXG4gIGNhbnZhcy53aWR0aCA9IGRvY3VtZW50LmJvZHkuY2xpZW50V2lkdGg7XHJcbiAgY2FudmFzLmhlaWdodCA9IGRvY3VtZW50LmJvZHkuY2xpZW50SGVpZ2h0O1xyXG4gIGNvbnN0IGZsb3dlcnMgPSBuZXcgSW50ZXJhY3RpdmVGbG93ZXJzKGNhbnZhcyk7XHJcblxyXG4gIGNvbnN0IGJ0biA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjbGVhckJ0bicpO1xyXG4gIGJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcclxuICAgIGZsb3dlcnMuY2xlYXJDYW52YXMoKTtcclxuICB9KTtcclxufVxyXG5cclxubWFpbigpO1xyXG4iXSwic291cmNlUm9vdCI6IiJ9