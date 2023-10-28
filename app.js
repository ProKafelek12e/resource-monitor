const socket = new WebSocket('ws://localhost:8080'); // Replace with the actual WebSocket server URL

socket.onopen = function (event) {
  console.log('WebSocket connection established.');
};

socket.onmessage = function (event) {
  const data = JSON.parse(event.data);
  document.getElementById('cpu-value').textContent = parseFloat(data.cpuUsage).toFixed(2) + '%';
  document.getElementById('ram-value').textContent = parseFloat(data.ramUsage).toFixed(2) + "%";
};

socket.onclose = function (event) {
  if (event.wasClean) {
    console.log(`WebSocket connection closed cleanly, code=${event.code}, reason=${event.reason}`);
  } else {
    console.error('WebSocket connection abruptly closed');
  }
};