const addTodoForm = document.getElementById('addTodoForm') as HTMLFormElement;
const addTodoInput = document.getElementById('addTodoInput') as HTMLInputElement;
const addTodoButton = document.getElementById('addTodoButton') as HTMLButtonElement;
const todoListElement = document.getElementById('todoList') as HTMLUListElement;

enum Status {
  ACTIVE,
  FINISHED,
}

interface Todo {
  id: number;
  text: string;
  status: Status;
}

const todolistLS = JSON.parse(localStorage.getItem('todolistLS'));

let todos: Todo[] = [];

if (todolistLS) {
  todos = todolistLS;
}

const saveTodosToLocalStorage = (todoArray: Todo[]) => {
  return localStorage.setItem('todolistLS', JSON.stringify(todoArray));
};

const setTodoInProgress = (target) => {
  target.classList.toggle('progress');
  target.appendChild(document.createTextNode('In progress'));
  const newTodoStatusImage = document.createElement('img');
  newTodoStatusImage.src = '/icons/icon-clock.svg';
  newTodoStatusImage.alt = 'Image of a clock.';
  target.appendChild(newTodoStatusImage);
};

const setTodoFinished = (target) => {
  target.classList.toggle('finished');
  target.appendChild(document.createTextNode('Finished'));
  const newTodoStatusImage = document.createElement('img');
  newTodoStatusImage.src = '/icons/icon-checkmark.svg';
  newTodoStatusImage.alt = 'Image of a checkmark.';
  target.appendChild(newTodoStatusImage);
};

const createTodoItem = (id: number, todoText: string, status: number) => {
  const newTodoLi = document.createElement('li');
  newTodoLi.classList.toggle('todo-list__item');
  newTodoLi.dataset.id = id.toString();

  const newTodoStatus = document.createElement('span');
  newTodoStatus.classList.toggle('todo-list__item-status');

  if (status === 0) {
    setTodoInProgress(newTodoStatus);
  } else if (status === 1) {
    setTodoFinished(newTodoStatus);
  }

  const newTodoContent = document.createElement('div');
  newTodoContent.classList.toggle('todo-list__item-content');

  const newTodoSpan = document.createElement('span');
  newTodoSpan.appendChild(document.createTextNode(todoText));
  newTodoContent.appendChild(newTodoSpan);

  const newTodoActions = document.createElement('div');
  newTodoActions.classList.toggle('todo-list__item-actions');

  const newTodoButton1 = document.createElement('button');

  if (status === 0) {
    newTodoButton1.setAttribute('aria-label', 'Press to mark to do as finished.');
    newTodoButton1.dataset.buttonRole = 'finish';
    const newTodoButton1Image = document.createElement('img');
    newTodoButton1Image.src = '/icons/icon-checkmark.svg';
    newTodoButton1Image.alt = 'Image of a checkmark.';
    newTodoButton1.appendChild(newTodoButton1Image);
  } else if (status === 1) {
    newTodoButton1.setAttribute('aria-label', 'Press to mark to do in progress.');
    newTodoButton1.dataset.buttonRole = 'progress';
    const newTodoButton1Image = document.createElement('img');
    newTodoButton1Image.src = '/icons/icon-clock.svg';
    newTodoButton1Image.alt = 'Image of a clock.';
    newTodoButton1.appendChild(newTodoButton1Image);
  }

  const newTodoButtonDelete = document.createElement('button');
  newTodoButtonDelete.setAttribute('aria-label', 'Press to delete to do.');
  newTodoButtonDelete.dataset.buttonRole = 'delete';
  const newTodoImageDelete = document.createElement('img');
  newTodoImageDelete.src = '/icons/icon-delete.svg';
  newTodoImageDelete.alt = 'Image of a trash bin.';
  newTodoButtonDelete.appendChild(newTodoImageDelete);

  newTodoActions.appendChild(newTodoButton1);
  newTodoActions.appendChild(newTodoButtonDelete);

  newTodoContent.appendChild(newTodoActions);

  newTodoLi.appendChild(newTodoStatus);
  newTodoLi.appendChild(newTodoContent);

  return newTodoLi;
};

const loadTodos = () => {
  if (todolistLS) {
    todos.map((todo) => todoListElement.appendChild(createTodoItem(todo.id, todo.text, todo.status)));
  }
};

const addTodo = (event) => {
  event.preventDefault();

  const todoText = addTodoInput.value;

  const newTodo = {
    id: Date.now(),
    text: todoText,
    status: Status.ACTIVE,
  };

  todos.push(newTodo);

  const newTodoLi = createTodoItem(newTodo.id, newTodo.text, newTodo.status);

  todoListElement.appendChild(newTodoLi);

  saveTodosToLocalStorage(todos);

  addTodoInput.value = '';
};

const setTodo = (event) => {
  const target = event.target;

  if (target.tagName === 'BUTTON') {
    const todoElement = target.closest('li');
    const todoId = +todoElement.dataset.id;
    let newTodos: Todo[];

    if (target.dataset.buttonRole === 'delete') {
      newTodos = todos.filter((todo) => todo.id !== todoId);
      todos = newTodos;
      todoListElement.removeChild(todoElement);
    } else if (target.dataset.buttonRole === 'finish') {
      const todoItem = todos.find((todo) => todo.id === todoId);
      todoItem.status = Status.FINISHED;
      const todoElementStatus = todoElement.firstElementChild;
      if (todoElementStatus.classList.value.includes('progress')) {
        todoElementStatus.classList.toggle('progress');
      }
      if (!todoElementStatus.classList.value.includes('finished')) {
        todoElementStatus.classList.toggle('finished');
        todoElementStatus.innerText = 'Finished';
        const todoElementStatusImage = document.createElement('img');
        todoElementStatusImage.src = '/icons/icon-checkmark.svg';
        todoElementStatusImage.alt = 'Image of a checkmark';
        todoElementStatus.appendChild(todoElementStatusImage);
        target.firstElementChild.src = '/icons/icon-clock.svg';
        target.firstElementChild.alt = 'Image of a clock.';
        target.dataset.buttonRole = 'progress';
        target.setAttribute('aria-label', 'Press to mark a to do in progress.');
      }
    } else if (target.dataset.buttonRole === 'progress') {
      const todoItem = todos.find((todo) => todo.id === todoId);
      todoItem.status = Status.FINISHED;
      const todoElementStatus = todoElement.firstElementChild;
      if (todoElementStatus.classList.value.includes('finished')) {
        todoElementStatus.classList.toggle('finished');
      }
      if (!todoElementStatus.classList.value.includes('progress')) {
        todoElementStatus.classList.toggle('progress');
        todoElementStatus.innerText = 'In progress';
        const todoElementStatusImage = document.createElement('img');
        todoElementStatusImage.src = '/icons/icon-clock.svg';
        todoElementStatusImage.alt = 'Image of a clock';
        todoElementStatus.appendChild(todoElementStatusImage);
        target.firstElementChild.src = '/icons/icon-checkmark.svg';
        target.firstElementChild.alt = 'Image of a checkmark.';
        target.dataset.buttonRole = 'finish';
        target.setAttribute('aria-label', 'Press to mark a to do as finished.');
      }
    }

    saveTodosToLocalStorage(todos);
  }
};

loadTodos();

addTodoForm.addEventListener('submit', addTodo);
todoListElement.addEventListener('click', setTodo);
