const STORAGE_KEY = "noteapp:data";
const THEME_KEY = "noteapp:theme";

const app = document.querySelector(".app");
const list = document.getElementById("note-list");
const editor = document.getElementById("note-editor");
const status = document.getElementById("status");
const newButton = document.getElementById("new-note");
const themeToggle = document.getElementById("theme-toggle");
const noteCount = document.getElementById("note-count");
const centerAction = document.getElementById("center-action");
const centerPlus = document.getElementById("center-plus");

let data = loadData();
let activeId = data.activeId || data.notes[0]?.id || null;

const saveStatus = (text) => {
  status.textContent = text;
  status.classList.remove("pulse");
  void status.offsetWidth;
  status.classList.add("pulse");
};

const updateTheme = (theme) => {
  app.dataset.theme = theme;
  themeToggle.textContent = "[o]";
  document
    .querySelector("meta[name='theme-color']")
    .setAttribute("content", theme === "dark" ? "#0b0b0b" : "#f9f9f9");
  localStorage.setItem(THEME_KEY, theme);
};

const renderList = () => {
  list.innerHTML = "";
  noteCount.textContent = `${data.notes.length} note${data.notes.length === 1 ? "" : "s"}`;
  list.classList.toggle("hidden", data.notes.length === 0);
  data.notes.forEach((note, index) => {
    const item = document.createElement("button");
    item.type = "button";
    item.className = `note-item${note.id === activeId ? " active" : ""}`;
    const title = document.createElement("span");
    title.className = "note-title";
    title.textContent = note.title || `note ${index + 1}`;

    const preview = document.createElement("span");
    preview.className = "note-preview";
    preview.textContent = note.body
      ? note.body.replace(/\n/g, " ").slice(0, 60)
      : "empty note";

    item.appendChild(title);
    item.appendChild(preview);
    item.addEventListener("click", () => setActive(note.id));
    list.appendChild(item);
  });
};

const renderEditor = () => {
  const note = data.notes.find((item) => item.id === activeId);
  if (!note) {
    editor.value = "";
    editor.placeholder = "start typing...";
    centerAction.classList.remove("hidden");
    return;
  }
  editor.value = note.body;
  editor.placeholder = note.body ? "" : "start typing...";
  centerAction.classList.add("hidden");
};

const setActive = (id) => {
  activeId = id;
  data.activeId = id;
  renderList();
  renderEditor();
  saveData();
};

const addNote = () => {
  const newNote = {
    id: crypto.randomUUID(),
    title: "",
    body: "",
    updatedAt: Date.now(),
  };
  data.notes.unshift(newNote);
  setActive(newNote.id);
  editor.focus();
};

const deleteNote = () => {
  if (!activeId) return;
  data.notes = data.notes.filter((note) => note.id !== activeId);
  activeId = data.notes[0]?.id || null;
  data.activeId = activeId;
  renderList();
  renderEditor();
  saveData();
};

const saveData = () => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  saveStatus("saved");
};

const loadData = () => {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return { notes: [{ id: crypto.randomUUID(), title: "", body: "", updatedAt: Date.now() }], activeId: null };
  }
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed.notes)) return parsed;
  } catch (error) {
    return { notes: [], activeId: null };
  }
  return { notes: [], activeId: null };
};

const updateTitle = (note) => {
  const trimmed = note.body.trim();
  note.title = trimmed ? trimmed.split("\n")[0].slice(0, 24) : "";
};

editor.addEventListener("input", () => {
  const note = data.notes.find((item) => item.id === activeId);
  if (!note) return;
  note.body = editor.value;
  note.updatedAt = Date.now();
  updateTitle(note);
  renderList();
  saveStatus("saving...");
  window.clearTimeout(editor._saveTimer);
  editor._saveTimer = window.setTimeout(saveData, 280);
});

editor.addEventListener("focus", () => {
  list.classList.add("hidden");
});

editor.addEventListener("blur", () => {
  list.classList.remove("hidden");
});

newButton.addEventListener("click", addNote);

themeToggle.addEventListener("click", () => {
  const next = app.dataset.theme === "light" ? "dark" : "light";
  updateTheme(next);
});

centerPlus.addEventListener("click", addNote);

const initialTheme = localStorage.getItem(THEME_KEY) || "dark";
updateTheme(initialTheme);
renderList();
renderEditor();

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js");
  });
}
