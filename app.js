const socket = new WebSocket('ws://localhost:8080'); // Replace with the actual WebSocket server URL
var cpuUs 
var ramUs
socket.onopen = function (event) {
  console.log('WebSocket connection established.');
};

socket.onmessage = function (event) {
  const data = JSON.parse(event.data);
  cpuUs = parseFloat(data.cpuUsage).toFixed(2)
  ramUs = parseFloat(data.ramUsage).toFixed(2)
  document.getElementById('cpu-value').textContent = parseFloat(data.cpuUsage).toFixed(2) + '%';
  document.getElementById('ram-value').textContent = parseFloat(data.ramUsage).toFixed(2) + "%";

  document.querySelector('.round').setAttribute('data-percent',ramUs)
};

socket.onclose = function (event) {
  if (event.wasClean) {
    console.log(`WebSocket connection closed cleanly, code=${event.code}, reason=${event.reason}`);
  } else {
    console.error('WebSocket connection abruptly closed');
  }
};


document.addEventListener("DOMContentLoaded", function() {
  var round = document.querySelector('.round');
  var roundCircle = round.querySelector('circle');
  var roundRadius = roundCircle.getAttribute('r');
  var roundCircum = 2 * roundRadius * Math.PI;

  function updateStrokeDasharray() {
    var roundPercent = round.getAttribute('data-percent');
    var roundDraw = (roundPercent * roundCircum) / 100;
    round.style.strokeDasharray = roundDraw + ' ' + roundCircum;
  }

  updateStrokeDasharray(); // Initial update

  // Create a MutationObserver to watch for changes in the data-percent attribute
  var observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.attributeName === 'data-percent') {
        updateStrokeDasharray();
      }
    });
  });

  // Configure the observer to watch for attribute changes
  observer.observe(round, { attributes: true, attributeFilter: ['data-percent'] });
});

