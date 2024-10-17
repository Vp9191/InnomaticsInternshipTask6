document.addEventListener('DOMContentLoaded', loadTasksFromStorage);

const taskForm = document.getElementById('todo-form');
const taskInput = document.getElementById('task-input');
const dueDateInput = document.getElementById('due-date');
const priorityInput = document.getElementById('priority');
const categoryInput = document.getElementById('category');
const taskList = document.getElementById('task-list');
const filterButtons = document.querySelectorAll('.filters button');

taskForm.addEventListener('submit', addTask);
taskList.addEventListener('click', handleTaskActions);
filterButtons.forEach(btn => btn.addEventListener('click', filterTasks));

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

function addTask(e) {
  e.preventDefault();
  
  const taskText = taskInput.value;
  const dueDate = dueDateInput.value;
  const priority = priorityInput.value;
  const category = categoryInput.value;
  
  const newTask = {
    id: Date.now(),
    text: taskText,
    completed: false,
    dueDate: dueDate,
    priority: priority,
    category: category
  };
  
  tasks.push(newTask);
  updateTasks();
  taskForm.reset();
}

function handleTaskActions(e) {
  const target = e.target;
  const taskId = target.closest('li').dataset.id;
  
  if (target.classList.contains('delete-btn')) {
    tasks = tasks.filter(task => task.id != taskId);
  } else if (target.classList.contains('complete-btn')) {
    const task = tasks.find(task => task.id == taskId);
    task.completed = !task.completed;
  }
  
  updateTasks();
}

function filterTasks(e) {
  const filter = e.target.dataset.filter;
  
  Array.from(taskList.children).forEach(taskItem => {
    const task = tasks.find(task => task.id == taskItem.dataset.id);
    
    if (filter === 'all') {
      taskItem.style.display = '';
    } else if (filter === 'completed' && task.completed) {
      taskItem.style.display = '';
    } else if (filter === 'pending' && !task.completed) {
      taskItem.style.display = '';
    } else {
      taskItem.style.display = 'none';
    }
  });
}

function updateTasks() {
  taskList.innerHTML = '';
  
  tasks.forEach(task => {
    const taskItem = document.createElement('li');
    taskItem.dataset.id = task.id;
    taskItem.classList.add(task.completed ? 'completed' : '');
    taskItem.innerHTML = `
      ${task.text} (Due: ${task.dueDate || 'No due date'}, Priority: ${task.priority}, Category: ${task.category})
      <div>
        <button class="complete-btn">${task.completed ? 'Undo' : 'Complete'}</button>
        <button class="delete-btn">Delete</button>
      </div>
    `;
    
    taskList.appendChild(taskItem);
  });
  
  saveTasksToStorage();
}

function saveTasksToStorage() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasksFromStorage() {
  tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  updateTasks();
}