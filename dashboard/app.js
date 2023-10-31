const socket = new WebSocket('ws://localhost:8080'); // Replace with the actual WebSocket server URL
var cpuUs 
var ramUs
socket.onopen = function (event) {
  console.log('WebSocket connection established.');
};

socket.onmessage = function (event) {
  const data = JSON.parse(event.data);
  console.log(data.cpu)
  cpuUs = parseFloat(data.cpu)
  ramUs = parseFloat(data.ram.usedp)
  document.getElementById('cpu-value').textContent = data.cpu+"%"
  document.getElementById('ram-value').textContent = data.ram.usedp+"%"

  document.querySelector('#chartR').setAttribute('data-percent',(ramUs*0.75).toString())
  document.querySelector('#chartC').setAttribute('data-percent',(cpuUs*0.75).toString())
};

socket.onclose = function (event) {
  if (event.wasClean) {
    console.log(`WebSocket connection closed cleanly, code=${event.code}, reason=${event.reason}`);
  } else {
    console.error('WebSocket connection abruptly closed');
  }
};


document.addEventListener("DOMContentLoaded", function() {
  function updateStrokeDasharray(round) {
    var roundCircle = round.querySelector('circle');
    var roundRadius = roundCircle.getAttribute('r');
    var roundCircum = 2 * roundRadius * Math.PI;
    var roundPercent = round.getAttribute('data-percent');
    var roundDraw = (roundPercent * roundCircum) / 100;
    round.style.strokeDasharray = roundDraw + ' ' + roundCircum;
  }

  // Initial update for all elements
  var roundElements = document.querySelectorAll('.round');
  roundElements.forEach(function(round) {
    updateStrokeDasharray(round);
  });

  // Create a MutationObserver to watch for changes in the data-percent attribute
  var observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.attributeName === 'data-percent') {
        updateStrokeDasharray(mutation.target);
      }
    });
  });

  // Configure the observer to watch for attribute changes on all round elements
  roundElements.forEach(function(round) {
    observer.observe(round, { attributes: true, attributeFilter: ['data-percent'] });
  });
});

