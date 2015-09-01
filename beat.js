window.onload = function() {
	console.log("hello");

	// Intervals & BPMs
	var numBpms = 5; // num of bpms to track
	var maxIntervalSize = 3000;
	var t1;
	var t2;

	var bpms = [];
	var currentBpm = 0;
	var bpmThreshold = 10; // BPM threshold for performance error

	var maxConsecutiveBangs = 0;
	var curConsecutiveBangs = 0;

	// Document elements
	var bpmDisplay = document.getElementById("bpmDisplay");
	var bangsDisplay = document.getElementById("bangsDisplay");
	var tapIndicator = document.getElementById("tapIndicator");

	document.addEventListener("keydown", function(e) {
		// console.log(e.keyCode);
		if (e.keyCode == 32) {
			if (typeof(t1) === "undefined") {
				// Initialize interval timing
				t1 = Date.now();
				t2 = t1;
				console.log("init")
			}
			else {
				// Calculate interval, add BPM depending on thresholds
				t1 = t2;
				t2 = Date.now();
				var interval = t2 - t1;
				if (interval < maxIntervalSize) {
					var bpm = msToBpm(interval);
					if (Math.abs(currentBpm - bpm) > bpmThreshold) {
						
						// if it's a multiple (8th note etc.)

						// Add new BPM to list; only keep track of numBpms most recent
						bpms.push(bpm);
						if (bpms.length > numBpms) {
							bpms.shift();
						}
						curConsecutiveBangs = 0;
					}
					else {
						curConsecutiveBangs++;
					}
				}
				else {
					console.log(interval + " exceeds max interval size");
				}
				currentBpm = calculateAvgBpm(bpms);
			}
			console.log(bpms);

			if (curConsecutiveBangs > maxConsecutiveBangs) {
				maxConsecutiveBangs = curConsecutiveBangs;
			}

			// Display
			bpmDisplay.innerText = currentBpm.toFixed() + " BPM";
			bangsDisplay.innerText = "Current: " + curConsecutiveBangs + " || Max: " + maxConsecutiveBangs;
			tapIndicator.style.visibility = "visible";

		}
	});

	document.addEventListener("keyup", function(e) {
		if (e.keyCode == 32) {
			tapIndicator.style.visibility = "hidden";
		}
	});


	/*
	 *	Add new interval to list of bpms.
	 *	Keeps track of numIntervals most recent bpms in FIFO order
	 */
	function addInterval(bpms, newInterval, numIntervals) {
		bpms.push(newInterval);
		if (bpms.length > numIntervals) {
			bpms.shift();
		}
		return bpms;
	}

	/*
	 * Calculate average BPM based on interval list
	 */
	function calculateAvgBpm(bpms) {
		var bpmSum = 0;
		for (var i=0; i<bpms.length; i++) {
			bpmSum += bpms[i];
		}
		return bpmSum / bpms.length;
	}

	function msToBpm(ms) {
		return (1000/ms) * 60;
	}

	function bpmToMs(bpm) {
		return 1000 / (bpm/60);
	}
};