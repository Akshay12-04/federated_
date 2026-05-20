import { createStore } from "./store.js";
import { loadJson, saveJson } from "../utils/storage.js";

const KEY = "cardiofl_assistant_chat";

/** @type {{ role: 'user'|'ai', text: string, ts?: string }[]} */
const saved = loadJson(KEY);
const initial = Array.isArray(saved) && saved.length ? saved : [];

const inner = createStore({ messages: initial, isTyping: false });

inner.subscribe((state) => saveJson(KEY, state.messages));

export const assistantStore = {
  getState: () => inner.getState(),
  subscribe: (fn) => inner.subscribe(fn),
  addMessage(role, text) {
    const s = inner.getState();
    inner.setState({
      messages: [...s.messages, { role, text, ts: new Date().toISOString() }],
    });
  },
  setTyping(v) {
    inner.setState({ isTyping: v });
  },
  setWelcome(text) {
    if (inner.getState().messages.length === 0) {
      inner.setState({ messages: [{ role: "ai", text, ts: new Date().toISOString() }] });
    }
  },
  clear() {
    inner.setState({ messages: [] });
  },
};
