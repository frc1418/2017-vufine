// Define UI elements
var ui = {
	gyro: {
		container: document.getElementById('gyro'),
		val: 0,
		offset: 0,
		visualVal: 0,
		arm: document.getElementById('gyro-arm'),
		number: document.getElementById('gyro-number')
	},
	picker: {
		state: document.getElementById('picker-state'),
		arm: document.getElementById('picker-arm')
	},
    mask: document.getElementById('mask'),
    timer: document.getElementById('timer'),
    camera: {
		viewer: document.getElementById('camera'),
		id: 0,
		srcs: [ // Will default to first camera
            'http://10.14.18.2:1181/?action=stream',
            'http://10.14.18.2:1182/?action=stream'
        ]
    }
};

// Sets function to be called when any NetworkTables key/value changes
NetworkTables.addGlobalListener(onValueChanged, true);

function onValueChanged(key, value, isNew) {
	console.log(key + ' is ' + value);
	// Sometimes, NetworkTables will pass booleans as strings. This corrects for that.
	if (value == 'true') {
		value = true;
	} else if (value == 'false') {
		value = false;
	}

	// This switch statement chooses which UI element to update when a NetworkTables variable changes.
	switch (key) {
		case '/SmartDashboard/Drive/NavX | Yaw': // Gyro rotation
			ui.gyro.val = value;
			ui.gyro.visualVal = Math.floor(ui.gyro.val - ui.gyro.offset);
			if (ui.gyro.visualVal < 0) { // Corrects for negative values
				ui.gyro.visualVal += 360;
			}
			ui.gyro.arm.style.transform = ('rotate(' + ui.gyro.visualVal + 'deg)');
			ui.gyro.number.innerHTML = ui.gyro.visualVal + 'º';
			break;
        case '/robot/mode':
            switch (value) {
                case 'auto':
                    ui.mask.style.backgroundColor = 'yellow';
                    break;
                case 'teleop':
                    ui.mask.style.backgroundColor = 'green';
                    break;
                case 'disabled':
                    ui.mask.style.backgroundColor = 'red';
                    break;
                default:
                    ui.mask.style.backgroundColor = 'transparent';
            }
            break;
        case '/SmartDashboard/startTheTimer':
			// When this NetworkTables variable is true, the timer will start.
			// You shouldn't need to touch this code, but it's documented anyway in case you do.
			var s = 135;
			if (value) {
				// Make sure timer is reset to black when it starts
				ui.timer.style.color = 'white';
				// Function below adjusts time left every second
				var countdown = setInterval(function() {
					s--; // Subtract one second
					// Minutes (m) is equal to the total seconds divided by sixty with the decimal removed.
					var m = Math.floor(s / 60);
					// Create seconds number that will actually be displayed after minutes are subtracted
					var visualS = (s % 60);

					// Add leading zero if seconds is one digit long, for proper time formatting.
					visualS = visualS < 10 ? '0' + visualS : visualS;

					if (s < 0) {
						// Stop countdown when timer reaches zero
						clearTimeout(countdown);
						return;
					} else if (s <= 15) {
						// Flash timer if less than 15 seconds left
						ui.timer.style.color = (s % 2 === 0) ? '#FF3030' : 'transparent';
					} else if (s <= 30) {
						// Solid red timer when less than 30 seconds left.
						ui.timer.style.color = '#FF3030';
					}
					ui.timer.innerHTML = m + ':' + visualS;
				}, 1000);
			} else {
				s = 135;
			}
			NetworkTables.setValue(key, false);
			break;
		case '/SmartDashboard/picker_state':
			ui.picker.arm.style.transform = 'rotate(' + (value ? 0 : -80) + 'deg)';
			break;
		case '/SmartDashboard/camera_id':
			ui.camera.id = value;
			ui.camera.viewer.style.backgroundImage = 'url(' + ui.camera.srcs[ui.camera.id] + ')';
			console.log('Camera stream source switched to ' + ui.camera.viewer.style.backgroundImage);
			break;
	}
}
