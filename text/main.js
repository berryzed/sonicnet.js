var SonicSocket = require('../lib/sonic-socket.js');
var SonicServer = require('../lib/sonic-server.js');
var SonicCoder = require('../lib/sonic-coder.js');

var sonicSocket;
var sonicServer;

var isAudibleEl = document.querySelector('#is-audible');
isAudibleEl.addEventListener('click', function (e) {
  if (e.target.checked) {
    var coder = new SonicCoder({
      freqMin: 440,
      // freqMax: 1760
      freqMax: 5760
    });
    createSonicNetwork(coder);
  } else {
    createSonicNetwork();
  }
});

createSonicNetwork();

function createSonicNetwork (coder) {
  // Stop the sonic server if it is listening.
  if (sonicServer) {
    sonicServer.stop();
  }
  if (coder) {
    sonicServer = new SonicServer({coder: coder, debug: true});
    sonicSocket = new SonicSocket({coder: coder, debug: true});
  } else {
    sonicServer = new SonicServer({debug: true});
    sonicSocket = new SonicSocket({debug: true});
  }

  sonicServer.start();
  sonicServer.on('character', onIncomingCharacter);
  sonicServer.on('message',   onIncomingText);
}

var sendbutton = document.querySelector('#send-button');
var sendtext = document.querySelector('#text-tobesend');
var recvtext = document.querySelector('#text-toberecv');
sendbutton.addEventListener('click', function (e) {
  console.log('sending ' + sendtext.value);
  sonicSocket.send(sendtext.value);
})

function onIncomingText (message) {
  console.log('[onIncomingText] recving message' + message);
  recvtext.value = message;
}
function onIncomingCharacter (character) {
  console.log('[onIncomingCharacter]recving ' + character);
  recvtext.value += character;
}
