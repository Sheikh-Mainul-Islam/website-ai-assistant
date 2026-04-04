/* ===========================
SESSION MANAGEMENT
=========================== */

function getSessionId() {

  let id = localStorage.getItem("chat_session");

  if (!id) {
    id = "user_" + Math.random().toString(36).substring(2, 10);
    localStorage.setItem("chat_session", id);
  }

  return id;
}

const SESSION_ID = getSessionId();

/* ===========================
CONFIG
=========================== */

const webhookUrl = "http://localhost:5678/webhook/website_chat";

const messages = document.getElementById("messages");
const input = document.getElementById("input");
const sendBtn = document.getElementById("sendBtn");

/* ===========================
THEME TOGGLE
=========================== */

function toggleTheme() {

  const body = document.body;

  if (body.classList.contains("dark")) {
    body.classList.remove("dark");
    body.classList.add("light");
  } else {
    body.classList.remove("light");
    body.classList.add("dark");
  }

}

/* ===========================
ADD MESSAGE
=========================== */

function addMessage(text, type) {

  const div = document.createElement("div");

  div.className = "msg " + type;

  div.innerText = text;

  messages.appendChild(div);

  messages.scrollTop = messages.scrollHeight;

}

/* ===========================
TYPING INDICATOR
=========================== */

function showTyping() {

  const div = document.createElement("div");

  div.className = "msg bot typing";

  div.id = "typing";

  div.innerText = "Assistant is typing...";

  messages.appendChild(div);

  messages.scrollTop = messages.scrollHeight;

}

function removeTyping() {

  const typing = document.getElementById("typing");

  if (typing) typing.remove();

}

/* ===========================
SEND MESSAGE
=========================== */

async function sendMessage() {

  const message = input.value.trim();

  if (!message) return;

  /* Show user message */
  addMessage(message, "user");

  /* Clear input */
  input.value = "";

  /* Show typing */
  showTyping();

  try {

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        session_id: SESSION_ID,
        user_message: message
      })
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();

    removeTyping();

    const reply = data.reply || "Sorry, I couldn't understand that.";

    addMessage(reply, "bot");

  } catch (error) {

    removeTyping();

    addMessage("⚠️ Server connection failed. Please try again.", "bot");

    console.error("Chatbot Error:", error);

  }

}

/* ===========================
EVENT LISTENERS
=========================== */

if (sendBtn) {
  sendBtn.addEventListener("click", sendMessage);
}

if (input) {
  input.addEventListener("keydown", function(e) {

    if (e.key === "Enter") {
      sendMessage();
    }

  });
}