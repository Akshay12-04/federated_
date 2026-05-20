import { assistantStore } from "../state/assistantStore.js";
import { sendAssistantMessage } from "../services/assistantService.js";
import { escapeHtml } from "../utils/dom.js";

/**
 * @param {HTMLElement} root
 * @param {object} data
 */
export function mountAssistantPage(root, data) {
  assistantStore.setWelcome(data.welcome ?? "Hello!");

  const chat = document.createElement("section");
  chat.className = "p-assistant__chat-area c-chat-panel";
  chat.id = "assistant-chat";
  root.appendChild(chat);

  const prompts = document.createElement("section");
  prompts.className = "p-assistant__prompts mt-6";
  const grid = document.createElement("div");
  grid.className = "c-prompt-grid";
  for (const text of data.suggestedPrompts ?? []) {
    const chip = document.createElement("button");
    chip.type = "button";
    chip.className = "c-prompt-chip";
    chip.textContent = text;
    chip.addEventListener("click", () => send(text));
    grid.appendChild(chip);
  }
  prompts.appendChild(grid);
  root.appendChild(prompts);

  const inputBar = document.createElement("div");
  inputBar.className = "c-chat-input-bar mt-6";
  const input = document.createElement("input");
  input.type = "text";
  input.className = "c-chat-input-bar__field";
  input.placeholder = "Type your health question…";
  input.setAttribute("aria-label", "Chat message");
  const sendBtn = document.createElement("button");
  sendBtn.type = "button";
  sendBtn.className = "c-btn c-btn--primary";
  sendBtn.textContent = "Send";
  inputBar.append(input, sendBtn);
  root.appendChild(inputBar);

  const disclaimer = document.createElement("p");
  disclaimer.className = "text-muted text-sm mt-6";
  disclaimer.textContent = data.disclaimer ?? "";
  root.appendChild(disclaimer);

  async function send(text) {
    const trimmed = text.trim();
    if (!trimmed || assistantStore.getState().isTyping) return;
    assistantStore.addMessage("user", trimmed);
    input.value = "";
    assistantStore.setTyping(true);
    paintChat();
    const replyRes = await sendAssistantMessage(trimmed, { mockReplies: data.mockReplies });
    assistantStore.setTyping(false);
    if (!replyRes.ok) {
      assistantStore.addMessage("ai", `Could not get a reply: ${replyRes.error}`);
    } else {
      assistantStore.addMessage("ai", replyRes.data);
    }
    paintChat();
  }

  sendBtn.addEventListener("click", () => send(input.value));
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") send(input.value);
  });

  function paintChat() {
    const { messages, isTyping } = assistantStore.getState();
    chat.innerHTML = "";
    for (const m of messages) {
      chat.appendChild(bubble(m.role, m.text));
    }
    if (isTyping) {
      chat.appendChild(bubble("ai", "…"));
    }
    chat.scrollTop = chat.scrollHeight;
  }

  assistantStore.subscribe(paintChat);
  paintChat();
}

function bubble(role, text) {
  const el = document.createElement("div");
  el.className = `c-chat-bubble c-chat-bubble--${role}`;
  el.textContent = text;
  return el;
}
