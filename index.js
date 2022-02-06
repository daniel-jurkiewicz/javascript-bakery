const progressBar = document.querySelector("#my-progress");
const doughmakerButton = document.querySelector("#dough-button");
const progress = 0.025;
const doughCounter = document.querySelector("#dough-counter");
const flourCounter = document.querySelector("#flour-counter");
const lowFlour = document.querySelector("#low-flour");
const cookieCounter = document.querySelector("#cookie-counter");
const cookieButton = document.querySelector("#cookie-button");
const ovenCounter = document.querySelector("#oven-counter");
const oven = document.querySelector("#oven");
const tray = document.querySelector("#tray");
const readyCookieCounter = document.querySelector("#ready-cookie");
const plnCounter = document.querySelector("#pln");
const buyFlourButton = document.querySelector("#flour-button");

// Preparing application state
let isForming = false;
let formingProgress = 0;
let lastUpdateTime = Date.now();
let numberOfDough = 0;
let numberOfFlour = 100;
let flourInHand = false;
let numberOfCookies = 0;
let cookiesInOven = 0;
let readyCookies = 0;
let plnAmount = 0;

// Update interface
function render() {
	flourCounter.textContent = numberOfFlour;
	readyCookieCounter.textContent = readyCookies;
	ovenCounter.textContent = cookiesInOven;
	plnCounter.textContent = plnAmount;
}

// Update screen
function update() {
	const now = Date.now();
	const elapsedTime = now - lastUpdateTime;
	lastUpdateTime = now;

	if (!flourInHand && numberOfFlour >= 10 && isForming) {
		numberOfFlour -= 10;
		flourInHand = true;
	}

	if (isForming === true && flourInHand) {
		formingProgress += progress * elapsedTime;
		progressBar.style.width = formingProgress + "%";
		doughmakerButton.textContent = "Zatrzymaj lepienie";
	} else {
		doughmakerButton.textContent = "Ulep ciasto";
	}

	if (formingProgress >= 100) {
		numberOfDough++;
		const doughBall = document.createElement("div");
		tray.append(doughBall);
		let doughWidth = 50;
		let doughHeight = 50;
		doughBall.classList.add("dough-ball");
		doughCounter.textContent = numberOfDough;
		formingProgress = 0;
		flourInHand = false;
		doughBall.addEventListener("click", () => {
			function makeCookie() {
				numberOfCookies++;
				let x = (doughWidth -= 5);
				let y = (doughHeight -= 5);
				doughBall.style.width = x + "px";
				doughBall.style.height = y + "px";
				cookieCounter.textContent = numberOfCookies;
				if (x === 0 && y === 0) {
					numberOfDough--;
					tray.removeChild(doughBall);
					doughCounter.textContent = numberOfDough;
				}
			}

			makeCookie();
		});
	}

	if (numberOfFlour <= 9 && flourInHand === false) {
		formingProgress = 0;
		lowFlour.textContent = "Za mało mąki!";
	}

	// Starting interface update
	render();

	// Automatically schedule next update call when the browser
	// is ready to update the screen (every ~16ms = 60FPS (Frames Per Second))
	requestAnimationFrame(update);
}

cookieButton.addEventListener("click", () => {
	if (numberOfCookies > 0 && cookiesInOven < 9 && cookiesInOven >= 0) {
		numberOfCookies--;
		cookieCounter.textContent = numberOfCookies;
		cookiesInOven++;

		const cookie = document.createElement("div");
		oven.append(cookie);
		cookie.classList.add("cookie-icon");

		function changeCookieColor(color) {
			cookie.style.backgroundColor = color;
		}

		function removeCookie() {
			cookie.remove();
			cookiesInOven--;
		}

		const timeouts = [
			setTimeout(changeCookieColor, 3000, "orange"),
			setTimeout(changeCookieColor, 6000, "brown"),
			setTimeout(changeCookieColor, 9000, "black"),
			setTimeout(removeCookie, 12000),
		];

		cookie.addEventListener("click", () => {
			if (cookie.style.backgroundColor === "brown") {
				readyCookies++;
				removeCookie();
			} else if (cookie.style.backgroundColor !== "brown") {
				removeCookie();
			}
			timeouts.forEach((id) => clearTimeout(id));
		});
	} else if (cookiesInOven === 9) {
		window.alert("Piec jest pełen.");
	} else if (numberOfCookies === 0 && cookiesInOven != 9) {
		window.alert("Robiliśmy co w naszej mocy, ale mamy za mało ciastek.");
	}
});

// Starting screen updates
update();

// Adding event listeners
doughmakerButton.addEventListener("click", () => {
	isForming = !isForming;
});

buyFlourButton.addEventListener("click", () => {
	if (plnAmount >= 50) {
		plnAmount -= 50;
		numberOfFlour += 100;
	} else {
		window.alert(`Brakuje Ci ${50 - plnAmount} złotych.`);
	}
});

const fireRandomTimeout = () => {
	let delay = Math.floor(Math.random() * 3000 + 3000);

	setTimeout(() => {
		let random = Math.floor(Math.random() * (10 - 1)) + 1;
		let soldCookies = Math.min(readyCookies, random);
		if (soldCookies >= 5) {
			readyCookies -= soldCookies;
			plnAmount += soldCookies * 4;
		} else {
			readyCookies -= soldCookies;
			plnAmount += soldCookies * 5;
		}
		fireRandomTimeout();
	}, delay);
};

fireRandomTimeout();
