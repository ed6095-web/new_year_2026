(function() {
	var COLORS, Confetti, NUM_CONFETTI, PI_2, canvas, confetti, context, drawCircle, i, range, resizeWindow, xpos;

	NUM_CONFETTI = 350;

	COLORS = [[85, 71, 106], [174, 61, 99], [219, 56, 83], [244, 92, 68], [248, 182, 70]];

	PI_2 = 2 * Math.PI;

	canvas = document.getElementById("confetti");
	context = canvas.getContext("2d");

	window.w = 0;
	window.h = 0;

	resizeWindow = function() {
		window.w = canvas.width = window.innerWidth;
		window.h = canvas.height = window.innerHeight;
	};

	window.addEventListener('resize', resizeWindow, false);
	window.onload = function() {
		setTimeout(resizeWindow, 0);
	};

	range = function(a, b) {
		return (b - a) * Math.random() + a;
	};

	drawCircle = function(x, y, r, style) {
		context.beginPath();
		context.arc(x, y, r, 0, PI_2, false);
		context.fillStyle = style;
		context.fill();
	};

	xpos = 0.4;

	document.onmousemove = function(e) {
		xpos = e.pageX / w;
	};

	window.requestAnimationFrame = (function() {
		return window.requestAnimationFrame ||
			   window.webkitRequestAnimationFrame ||
			   window.mozRequestAnimationFrame ||
			   function(cb) { return setTimeout(cb, 1000 / 60); };
	})();

	function Confetti() {
		this.style = COLORS[~~range(0, 5)];
		this.rgb = "rgba(" + this.style[0] + "," + this.style[1] + "," + this.style[2];
		this.r = ~~range(2, 6);
		this.replace();
	}

	Confetti.prototype.replace = function() {
		this.opacity = 0;
		this.dop = 0.03 * range(1, 4);
		this.x = range(0, w);
		this.y = range(0, h);
		this.vx = range(-2, 2);
		this.vy = range(2, 5);
	};

	Confetti.prototype.draw = function() {
		this.x += this.vx;
		this.y += this.vy;
		this.opacity += this.dop;

		if (this.opacity > 1) this.dop *= -1;
		if (this.opacity < 0 || this.y > h) this.replace();

		drawCircle(this.x, this.y, this.r, this.rgb + "," + this.opacity + ")");
	};

	confetti = [];
	for (i = 0; i < NUM_CONFETTI; i++) confetti.push(new Confetti());

	function step() {
		requestAnimationFrame(step);
		context.clearRect(0, 0, w, h);
		for (i = 0; i < confetti.length; i++) confetti[i].draw();
	}
	step();

})();

var clock;
var $clock = $('.clock');
var $message = $('.message');
var $confetti = $('#confetti');
var animations = ['bounce', 'pulse', 'rubberBand', 'swing', 'tada'];
var current_animation = 0;
var timeout = null;
var interval = 10000;

$(document).ready(function() {
	var currentDate = new Date();
	var futureDate  = new Date(currentDate.getFullYear() + 1, 0, 1);
	var diff = futureDate.getTime() / 1000 - currentDate.getTime() / 1000;

	clock = $clock.FlipClock(diff, {
		clockFace: 'DailyCounter',
		countdown: true,
		callbacks: {
			interval: function() {
				var time = this.factory.getTime().time;
				if(time <= 10 && time > 0) pulse();
				else if(time <= 0) celebrate();
			}
		}
	});
});

function celebrate() {

	// hide clock
	$clock.removeClass('animated flipInX');
	$clock.addClass('animated flipOutX');

	clearTimeout(timeout);

	setTimeout(function () {

		$message.fadeIn().addClass('animated fadeIn');

		// STEP 1: show 2025 blinking
		$('#year')
			.text('2025')
			.removeClass()
			.addClass('animated flash infinite');

		// STEP 2: after 4s → collapse 2025
		setTimeout(function () {

			$('#year')
				.removeClass()
				.addClass('year-collapse');

			// STEP 3: small dramatic pause
			setTimeout(function () {

				// STEP 4: drop 2026
				$('#year')
					.removeClass()
					.text('2026')
					.addClass('year-drop');

				// 🚀 STEP 5: celebration EXACTLY on impact
				$confetti.fadeIn();
				timeout = setTimeout(bounce, interval);

			}, 200);

		}, 4000);

	}, 350);
}


function pulse() {
	$clock.removeClass('animated flipInX flipOutX pulse');
	clearTimeout(timeout);
	timeout = setTimeout(function(){
		$clock.addClass('animated pulse');
	}, 50);
}

function bounce() {
	clearTimeout(timeout);
	$message.removeClass('animated bounce flipInX pulse rubberBand swing tada');

	setTimeout(function(){ 
		$message.addClass('animated ' + animations[current_animation]);
		current_animation = (current_animation + 1) % animations.length;
	}, 100);

	timeout = setTimeout(bounce, interval);
}
