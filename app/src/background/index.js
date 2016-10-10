'use strict';
const { ipcRenderer } = require('electron');

window.onload = function () {
	ipcRenderer.on('background-start', (startTime) => {
		ipcRenderer.send('background-response', {
			result: task(),
			startTime: startTime
		});
	});
};


function task() {
	let result = 0;

	for (let i = 0; i < 100000000; i++) {
		result += i;
	}

	return result;
}