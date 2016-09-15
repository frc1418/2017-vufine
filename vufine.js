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
    mask: document.getElementById('mask')
};

// Sets function to be called when any NetworkTables key/value changes
NetworkTables.addGlobalListener(onValueChanged, true);

function onValueChanged(key, value, isNew) {
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
	}
}