const form = document.getElementById("task-form");
const titleInput = document.getElementById("task-title");
const dateInput = document.getElementById("task-date");
const listInput = document.getElementById("task-list");
const tasksContainer = document.getElementById("tasks-container");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const newTask = {
    id: Date.now(),
    title: titleInput.value,
    date: dateInput.value,
    list: listInput.value || "General",
    completed: false
  };

  tasks.push(newTask);
  saveTasks();
  renderTasks();
  form.reset();
});

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTasks() {
  tasksContainer.innerHTML = "";

  const grouped = groupBy(tasks, "list");

  for (const listName in grouped) {
    const listDiv = document.createElement("div");
    listDiv.className = "task-list";
    listDiv.innerHTML = `<h3>${listName}</h3>`;

    grouped[listName].forEach(task => {
      const taskDiv = document.createElement("div");
      taskDiv.className = "task" + (task.completed ? " completed" : "");
      taskDiv.innerHTML = `
        <div>
          <input type="checkbox" ${task.completed ? "checked" : ""} onchange="toggleComplete(${task.id})" />
        </div>
        <div class="details">
          <span class="title">${task.title}</span>
          <small>${task.date ? new Date(task.date).toLocaleString() : ""}</small>
        </div>
        <div class="actions">
          <button onclick="editTask(${task.id})">✏️</button>
          <button onclick="deleteTask(${task.id})">🗑️</button>
        </div>
      `;
      listDiv.appendChild(taskDiv);
    });

    tasksContainer.appendChild(listDiv);
  }
}

function groupBy(arr, key) {
  return arr.reduce((acc, curr) => {
    (acc[curr[key]] = acc[curr[key]] || []).push(curr);
    return acc;
  }, {});
}

function toggleComplete(id) {
  const task = tasks.find(t => t.id === id);
  if (task) {
    task.completed = !task.completed;
    saveTasks();
    renderTasks();
  }
}

function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  saveTasks();
  renderTasks();
}

function editTask(id) {
  const task = tasks.find(t => t.id === id);
  if (task) {
    const newTitle = prompt("Edit task title:", task.title);
    if (newTitle !== null) task.title = newTitle;

    const newDate = prompt("Edit date/time (YYYY-MM-DDTHH:MM):", task.date);
    if (newDate !== null) task.date = newDate;

    saveTasks();
    renderTasks();
  }
}



