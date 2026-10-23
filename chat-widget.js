
(() => {
  const chat = document.getElementById("nextplay-chat");
  const toggle = document.getElementById("nextplay-chat-button");
  const close = document.getElementById("np-chat-close");
  const form = document.getElementById("np-chat-form");
  const input = document.getElementById("np-chat-input");
  const messagesBox = document.getElementById("np-chat-messages");
  const send = document.getElementById("np-chat-send");
  const status = document.getElementById("np-chat-status");

  if (!chat || !toggle || !form) return;

  const history = [];
  let busy = false;

  function addMessage(role, content) {
    const bubble = document.createElement("div");
    bubble.className = `np-message ${role}`;
    // textContent prevents AI output from being treated as HTML.
    bubble.textContent = content;
    messagesBox.appendChild(bubble);
    messagesBox.scrollTop = messagesBox.scrollHeight;
    return bubble;
  }

  function openChat() {
    chat.classList.add("open");
    toggle.setAttribute("aria-expanded", "true");
    input.focus();
  }

  function closeChat() {
    chat.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.focus();
  }

  toggle.addEventListener("click", () => {
    chat.classList.contains("open") ? closeChat() : openChat();
  });

  close.addEventListener("click", closeChat);

  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && chat.classList.contains("open")) {
      closeChat();
    }
  });

  addMessage(
    "assistant",
    "Hi! I'm Nextplay AI. Ask me anything — coding, study, writing or ideas."
  );

  form.addEventListener("submit", async event => {
    event.preventDefault();

    const text = input.value.trim();
    if (!text || busy) return;

    if (text.length > 4000) {
      status.textContent = "Please keep your message under 4000 characters.";
      return;
    }

    busy = true;
    send.disabled = true;
    input.disabled = true;
    status.textContent = "Nextplay AI is thinking...";

    addMessage("user", text);
    input.value = "";

    history.push({ role: "user", content: text });

    const pending = addMessage("assistant", "Thinking...");

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          messages: history.slice(-10)
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong.");
      }

      if (typeof data.reply !== "string") {
        throw new Error("Invalid response from AI.");
      }

      pending.textContent = data.reply;
      history.push({ role: "assistant", content: data.reply });
      status.textContent = "Ready";
    } catch (error) {
      pending.remove();
      history.pop();
      addMessage(
        "assistant",
        error.message || "Connection failed. Please try again."
      );
      status.textContent = "Please try again.";
    } finally {
      busy = false;
      send.disabled = false;
      input.disabled = false;
      input.focus();
    }
  });
})();
