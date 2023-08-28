const listsContainer = document.querySelector('[data-lists]'); 
const newListsForm = document.querySelector('[data-new-list-form]'); 
const newListsInput = document.querySelector('[data-new-list-input]');
const deleteListButton = document.querySelector('[data-delete-list-button]');
const listDisplayContainer = document.querySelector('[data-list-display-container]');
const listTitle = document.querySelector('[data-list-title]');
const tasksContainer = document.querySelector('[data-tasks]');
const taskTemplate = document.getElementById('task-template');
const newTaskForm = document.querySelector('[data-new-task-form]'); 
const newTaskInput = document.querySelector('[data-new-task-input]'); 
const clearCompleteTasks = document.querySelector('[data-clear-complete-tasks-button]'); 
const deleteTaskButton = document.querySelector('[data-delete-task-button]'); 



const LOCAL_STORAGE_LIST_KEY = 'task.lists'
const LOCAL_STORAGE_SELECTED_LIST_ID_KEY = 'task.selectedListId'
let lists = JSON.parse(localStorage.getItem(LOCAL_STORAGE_LIST_KEY)) || []
let selectedListId = localStorage.getItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY)




listsContainer.addEventListener('click', e => {
  if(e.target.tagName.toLowerCase() === 'li') {
    selectedListId =  e.target.dataset.listId
    saveAndRender()
  }
})

tasksContainer.addEventListener('click', e => {
  if(e.target.tagName.toLowerCase() === 'input') {
    const selectedList = lists.find(list => list.id === selectedListId)
    const selectedTask = selectedList.tasks.find(task => task.id === e.target.id)
    selectedTask.complete = e.target.checked
    save()
  }
})

clearCompleteTasks.addEventListener('click', e => {
  if(window.confirm('Are you sure you want to delete completed tasks?')){
  const selectedList = lists.find(list => list.id === selectedListId)
  selectedList.tasks = selectedList.tasks.filter(task => !task.complete)
  saveAndRender()
}
})



newListsForm.addEventListener('submit', e => {
  e.preventDefault();
  let listName = newListsInput.value;
  if (listName === null || listName === '' ) return
  const list = createList(listName)
  newListsInput.value = null
  lists.push(list)
  saveAndRender()
})

newTaskForm.addEventListener('submit', e => {
  e.preventDefault();
  let taskName = newTaskInput.value;
  if (taskName === null || taskName === '' ) return
  const task = createTask(taskName)
  newTaskInput.value = null
  const selectedList = lists.find(list => list.id === selectedListId)
  selectedList.tasks.push(task)
  saveAndRender()
})


deleteListButton.addEventListener('click', e => {
  if (window.confirm('Are you sure you want to delete this list?')) {
    lists = lists.filter(list => list.id !== selectedListId);
    selectedListId = null;
    saveAndRender();
  }
});






const createList = name =>{
  return {
    id: Date.now().toString(), name: name, tasks: []
  }
}

const createTask = name =>{
  return {
    id: Date.now().toString(), name: name, complete: false
  }
}

const saveAndRender = () => {
  save()
  render()
}

const save = () => {
  localStorage.setItem(LOCAL_STORAGE_LIST_KEY, JSON.stringify(lists))
  localStorage.setItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY, selectedListId)
}

const render = () => {
  clearElement(listsContainer);
  renderLists()
  const selectedList = lists.find(list => list.id === selectedListId);
  if (selectedListId == null) {
    listDisplayContainer.style.display = 'none'
  } else {
    listDisplayContainer.style.display = ''
    listTitle.innerHTML = selectedList.name
    clearElement(tasksContainer)
    renderTasks(selectedList)
  }
};

const renderTasks = selectedList => {
  selectedList.tasks.forEach(task => {
    const taskElement = document.importNode(taskTemplate.content, true)
    const checkbox = taskElement.querySelector('input')
    checkbox.id = task.id
    checkbox.checked = task.complete
    const label = taskElement.querySelector('label')
    label.htmlFor = task.id
    label.append(task.name)
    tasksContainer.appendChild(taskElement)
  })
}



const renderLists = () => {
  lists.forEach(list => {
    const listElement = document.createElement('li');
    listElement.dataset.listId = list.id
    listElement.classList.add('hover:opacity-70', 'cursor-pointer'); 
    listElement.textContent = list.name; 
    if(list.id === selectedListId) listElement.classList.add('active-list')
    listsContainer.appendChild(listElement);
  });
}

const clearElement = (element) => {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
};

render();
