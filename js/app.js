var addTodoForm = document.getElementById('addTodoForm');
var addTodoInput = document.getElementById('addTodoInput');
var addTodoButton = document.getElementById('addTodoButton');
var todoListElement = document.getElementById('todoList');
var Status;
(function (Status) {
    Status[Status["ACTIVE"] = 0] = "ACTIVE";
    Status[Status["FINISHED"] = 1] = "FINISHED";
})(Status || (Status = {}));
var todolistLS = JSON.parse(localStorage.getItem('todolistLS'));
var todos = [];
if (todolistLS) {
    todos = todolistLS;
}
var saveTodosToLocalStorage = function (todoArray) {
    return localStorage.setItem('todolistLS', JSON.stringify(todoArray));
};
var setTodoInProgress = function (target) {
    target.classList.toggle('progress');
    target.appendChild(document.createTextNode('In progress'));
    var newTodoStatusImage = document.createElement('img');
    newTodoStatusImage.src = '/icons/icon-clock.svg';
    newTodoStatusImage.alt = 'Image of a clock.';
    target.appendChild(newTodoStatusImage);
};
var setTodoFinished = function (target) {
    target.classList.toggle('finished');
    target.appendChild(document.createTextNode('Finished'));
    var newTodoStatusImage = document.createElement('img');
    newTodoStatusImage.src = '/icons/icon-checkmark.svg';
    newTodoStatusImage.alt = 'Image of a checkmark.';
    target.appendChild(newTodoStatusImage);
};
var createTodoItem = function (id, todoText, status) {
    var newTodoLi = document.createElement('li');
    newTodoLi.classList.toggle('todo-list__item');
    newTodoLi.dataset.id = id.toString();
    var newTodoStatus = document.createElement('span');
    newTodoStatus.classList.toggle('todo-list__item-status');
    if (status === 0) {
        setTodoInProgress(newTodoStatus);
    }
    else if (status === 1) {
        setTodoFinished(newTodoStatus);
    }
    var newTodoContent = document.createElement('div');
    newTodoContent.classList.toggle('todo-list__item-content');
    var newTodoSpan = document.createElement('span');
    newTodoSpan.appendChild(document.createTextNode(todoText));
    newTodoContent.appendChild(newTodoSpan);
    var newTodoActions = document.createElement('div');
    newTodoActions.classList.toggle('todo-list__item-actions');
    var newTodoButton1 = document.createElement('button');
    if (status === 0) {
        newTodoButton1.setAttribute('aria-label', 'Press to mark to do as finished.');
        newTodoButton1.dataset.buttonRole = 'finish';
        var newTodoButton1Image = document.createElement('img');
        newTodoButton1Image.src = '/icons/icon-checkmark.svg';
        newTodoButton1Image.alt = 'Image of a checkmark.';
        newTodoButton1.appendChild(newTodoButton1Image);
    }
    else if (status === 1) {
        newTodoButton1.setAttribute('aria-label', 'Press to mark to do in progress.');
        newTodoButton1.dataset.buttonRole = 'progress';
        var newTodoButton1Image = document.createElement('img');
        newTodoButton1Image.src = '/icons/icon-clock.svg';
        newTodoButton1Image.alt = 'Image of a clock.';
        newTodoButton1.appendChild(newTodoButton1Image);
    }
    var newTodoButtonDelete = document.createElement('button');
    newTodoButtonDelete.setAttribute('aria-label', 'Press to delete to do.');
    newTodoButtonDelete.dataset.buttonRole = 'delete';
    var newTodoImageDelete = document.createElement('img');
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
var loadTodos = function () {
    if (todolistLS) {
        todos.map(function (todo) { return todoListElement.appendChild(createTodoItem(todo.id, todo.text, todo.status)); });
    }
};
var addTodo = function (event) {
    event.preventDefault();
    var todoText = addTodoInput.value;
    var newTodo = {
        id: Date.now(),
        text: todoText,
        status: Status.ACTIVE
    };
    todos.push(newTodo);
    var newTodoLi = createTodoItem(newTodo.id, newTodo.text, newTodo.status);
    todoListElement.appendChild(newTodoLi);
    saveTodosToLocalStorage(todos);
    addTodoInput.value = '';
};
var setTodo = function (event) {
    var target = event.target;
    if (target.tagName === 'BUTTON') {
        var todoElement = target.closest('li');
        var todoId_1 = +todoElement.dataset.id;
        var newTodos = void 0;
        if (target.dataset.buttonRole === 'delete') {
            newTodos = todos.filter(function (todo) { return todo.id !== todoId_1; });
            todos = newTodos;
            todoListElement.removeChild(todoElement);
        }
        else if (target.dataset.buttonRole === 'finish') {
            var todoItem = todos.find(function (todo) { return todo.id === todoId_1; });
            todoItem.status = Status.FINISHED;
            var todoElementStatus = todoElement.firstElementChild;
            if (todoElementStatus.classList.value.includes('progress')) {
                todoElementStatus.classList.toggle('progress');
            }
            if (!todoElementStatus.classList.value.includes('finished')) {
                todoElementStatus.classList.toggle('finished');
                todoElementStatus.innerText = 'Finished';
                var todoElementStatusImage = document.createElement('img');
                todoElementStatusImage.src = '/icons/icon-checkmark.svg';
                todoElementStatusImage.alt = 'Image of a checkmark';
                todoElementStatus.appendChild(todoElementStatusImage);
                target.firstElementChild.src = '/icons/icon-clock.svg';
                target.firstElementChild.alt = 'Image of a clock.';
                target.dataset.buttonRole = 'progress';
                target.setAttribute('aria-label', 'Press to mark a to do in progress.');
            }
        }
        else if (target.dataset.buttonRole === 'progress') {
            var todoItem = todos.find(function (todo) { return todo.id === todoId_1; });
            todoItem.status = Status.FINISHED;
            var todoElementStatus = todoElement.firstElementChild;
            if (todoElementStatus.classList.value.includes('finished')) {
                todoElementStatus.classList.toggle('finished');
            }
            if (!todoElementStatus.classList.value.includes('progress')) {
                todoElementStatus.classList.toggle('progress');
                todoElementStatus.innerText = 'In progress';
                var todoElementStatusImage = document.createElement('img');
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
