let webSocket = null;
let sessionId = null;

function connectToWebSocket() {
  webSocket = new WebSocket('ws://localhost:3008');

  webSocket.onopen = () => {
    console.log('WebSocket connected');
    changeIcon("../icons/server_up.png");
  };

  webSocket.onerror = (err) => {
    console.error('WebSocket error:', err);
    changeIcon("../icons/server_down.png");
  };
}

function sendMessage(message) {
  if (!sessionId) {
    console.log('Session ID not available, data ignored');
    return;
  }

  if (webSocket && webSocket.readyState === WebSocket.OPEN) {
    message.sessionId = sessionId;
    webSocket.send(JSON.stringify(message));
  } else {
    console.log('WebSocket not ready, data ignored');
  }
}

function handleSessionIdChange(newSessionId) {
  sessionId = newSessionId;
}

function changeIcon(imageIcon) {
  chrome.action.setIcon({ path: imageIcon });
}

// Listen for messages from content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  sendMessage(message);
});

// Initial connection attempt
connectToWebSocket();

// Reconnect every 5 seconds if not connected
setInterval(() => {
  if (webSocket === null || webSocket.readyState !== WebSocket.OPEN) {
    connectToWebSocket();
  }
}, 5000);
