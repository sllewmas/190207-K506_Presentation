inlets = 1;
outlets = 5;


//function init() {
//INITIALIZE
//	trans(0);
//	trav(6.6);
//	durrange(522);
//	rate([400, 10, 1000, 5000]);
//	outjitter(35);
//	injitter(3.1);
	//pointsource(0);
//}


function msg_int(x) {
/*
CATEGORY 1
stutter in -> smooth drone -> stutter out
duration: 15000ms-22000ms
gain: 0.7 - 0.9

*/
	//PRESET 1
	if (x == 1) {
        trans([0]);
		trav(6.6);
		durrange([30, 2000, 300, 8000, 30, 10000], [40, 2000, 400, 8000, 40, 10000]);
		rate([10, 3000, 95, 10000, 25, 8000]);
		outjitter(35);
		injitter(3.1);
        env([0.2, 500, 0.6, 12000, 0., 7500])
		}
		
	//PRESET 2
	if (x == 2) {
        trans([0]);
		trav(4);
		durrange([30, 500, 300, 500, 100, 15000], [40, 500, 300, 500, 100, 15000]);
		rate([10, 500, 60, 2500, 30, 8000]);
		outjitter(20);
		injitter(20);
        env([0.2, 3000, 0.7, 4000, 0., 11000])
		}
	//PRESET 3
	if (x == 3) {
        trans([0]);
		trav(2.);
		durrange([10, 500, 300, 500, 100, 15000], [40, 500, 300, 500, 100, 15000]);
		rate([95, 500, 45, 21500]);
		outjitter(5);
		injitter(6);
        env([0.2, 500, 0.7, 1000,0.5, 11000, 0., 7500])
		}
	//PRESET 4 
	if (x == 4) {
        trans([0]);
		trav(6.6);
		durrange([10, 2000, 100, 8000, 20, 10000], [20, 2000, 150, 8000, 40, 10000]);
		rate([10, 3000, 95, 10000, 25, 8000]);
		outjitter(5);
		injitter(3.1);
        env([0.2, 4000, 0.5, 12000, 0., 8000])
		}
	//PRESET 
	if (x == 5) {
        trans([0]);
		trav(-2.);
		durrange([10, 2000, 80, 8000, 20, 10000], [20, 2000, 120, 8000, 40, 10000]);
		rate([10, 3000, 95, 10000, 25, 8000]);
		outjitter(35);
		injitter(3.1);
        env([0.4, 500, 0.5, 12000, 0., 7500])
		}		
		
		
		
		
		
//PRESET 6 not done yet

	if (x == 6) {
		trans([-31, -24, -19, -12]);
		trav(6.6);
		durrange([10, 2000, 100, 8000, 20, 10000], [20, 2000, 120, 8000, 40, 10000]);
		rate([10, 3000, 95, 10000, 25, 8000]);
		outjitter(35);
		injitter(3.1);
        env([0.4, 500, 0.5, 12000, 0., 9500])
		}
		


//PRESET 99

	if (x == 99) {
		trans([0]);
		trav(6.6);
		durrange([30, 2000, 300, 8000, 30, 10000], [40, 2000, 400, 8000, 40, 10000]);
		rate([10, 3000, 95, 10000, 25, 8000]);
		outjitter(35);
		injitter(3.1);
        env([0.2, 500, 0.5, 8000, 0., 7500])
		}		
		
}

function trans(shift) {
	if (shift.length > 1) {
		outlet(0, "transcoll", shift);
	} else {
		outlet(0, "trans", shift);
	}
}

function trav(x) {
	outlet(0, "trav", x);
}

function rate(r) {

	outlet(1, r);
}


function durrange(mini, maxi) {
	maxi = typeof maxi !== 'undefined' ? maxi : mini;
	outlet(2, mini);
	outlet(3, maxi);
}

function outjitter(x) {
	outlet(0, "outjitter", x);	
}

function injitter(x) {
	outlet(0, "injitter", x);	
}

function panrange(l, r) {
	outlet(0, "panrange", l, r);	
}

function pointsource(x) {
		outlet(0, "pointsource", x);
	
}

function env(x) {
		outlet(4, x);
	}
	

function randInt(min, max) {
	return Math.floor((Math.random() * (max - min)) + min);
}