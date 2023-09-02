// u have to add data attribute to an element in html which allows us to select and name it here in javaScript 

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




const LOCAL_STORAGE_LIST_KEY = 'task.lists' // adding tasks. it prevents u from overwriting information that's already in the localStorage. or preventing other websites from overwriting your localStorage. (for safety)
let lists = JSON.parse(localStorage.getItem(LOCAL_STORAGE_LIST_KEY)) || [] // get this info from localStorage using this key, if it exist parse it into an object because basically is a string. if it dosen't exist return an empty array


// this is for targeting the active Item / the style should be applied inside the render()
const LOCAL_STORAGE_SELECTED_LIST_ID_KEY = 'task.selectedListId'
let selectedListId = localStorage.getItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY)




listsContainer.addEventListener('click', e => {
  if(e.target.tagName.toLowerCase() === 'li') {
    selectedListId =  e.target.dataset.listId
    saveAndRender()
  }
})



tasksContainer.addEventListener('click', e => {
  if (e.target.classList.contains('editTask')) {
    // Find the parent task container
    const taskContainer = e.target.closest('.task');
    if (!taskContainer) return;

    // Hide the task text and show the edit input
    const taskText = taskContainer.querySelector('label');
    const editInput = taskContainer.querySelector('.edit-input');
    const deleteTask = taskContainer.querySelector('.deleteTask');
    taskText.style.display = 'none';
    deleteTask.style.display = 'none';

    editInput.style.display = 'block';

    // Populate the edit input with the task name
    editInput.value = taskText.textContent;

    // Focus on the edit input
    editInput.focus();

    // Add an event listener for when editing is done (e.g., pressing Enter)
    editInput.addEventListener('blur', () => {
      // Save the edited task name
      const selectedList = lists.find(list => list.id === selectedListId);
      const taskId = taskText.getAttribute('for');
      const editedTask = selectedList.tasks.find(task => task.id === taskId);
      editedTask.name = editInput.value;

      // Update the task text and hide the edit input
      taskText.textContent = editInput.value;
      editInput.style.display = 'none';
      taskText.style.display = 'block';

      // Save changes to local storage and re-render
      saveAndRender();
    });
  } else if (e.target.classList.contains('deleteTask')) {
    if (window.confirm('Are you sure you want to delete this list?')) {
    // Find the parent task container
    const taskContainer = e.target.closest('.task');
    if (!taskContainer) return;

    // Get the task ID from the label
    const taskId = taskContainer.querySelector('label').getAttribute('for');

    // Find the selected list and remove the task by ID
    const selectedList = lists.find(list => list.id === selectedListId);
    selectedList.tasks = selectedList.tasks.filter(task => task.id !== taskId);

    // Save changes to local storage and re-render
    saveAndRender();}
    
  }
});



// create a list name with conditions (input must be not empty / when smth is wrote and submit it calls createList()  / clear the input / push to lists array / save to localStorage buy save() and render ().
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
  // at first we have to filter our lists thats it returns a new list that match this conditions

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
  localStorage.setItem(LOCAL_STORAGE_LIST_KEY, JSON.stringify(lists)) // localStorage.setItem(key, value) we wanted to save the lists that has been add to the lists array
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
    const taskElement = document.importNode(taskTemplate.content, true) // the true is important its gonna render everything inside the template. (template its in the end of html. it render it only from javaScript)
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
    const listElement = document.createElement('li'); // it will add an element type of <li>
    listElement.dataset.listId = list.id // (the role here is when the element is created its add an id to it <li data-listId="1">gym</li>)
    listElement.classList.add('hover:opacity-70', 'cursor-pointer'); 
    listElement.textContent = list.name; // content what has been wrote
    if(list.id === selectedListId) listElement.classList.add('active-list') // add a style to a selected list
    listsContainer.appendChild(listElement); // it means add a child to the parent
  });
}





const clearElement = (element) => {
  while (element.firstChild) {
    element.removeChild(element.firstChild); // Its clear all the Elements if they are already exists in listsContainer html
  }
};

render();

