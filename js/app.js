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
var setEmptyListContent = function () {
    if (todos.length === 0) {
        var todoElementContent = document.createElement('li');
        todoElementContent.classList.toggle('todo-list__item');
        todoElementContent.appendChild(document.createTextNode('There are no tasks to do. Consider adding some!'));
        todoElementContent.dataset.role = 'emptyList';
        todoListElement.appendChild(todoElementContent);
    }
};
var saveTodosToLocalStorage = function (todoArray) {
    return localStorage.setItem('todolistLS', JSON.stringify(todoArray));
};
var setTodoStatus = function (target, status) {
    if (status === 0) {
        var newTodoStatus = document.createElement('span');
        newTodoStatus.classList.toggle('todo-list__item-status');
        newTodoStatus.classList.toggle('progress');
        newTodoStatus.appendChild(document.createTextNode('In progress'));
        var newTodoStatusImage = document.createElement('img');
        newTodoStatusImage.src = './icons/icon-clock.svg';
        newTodoStatusImage.alt = 'Image of a clock.';
        newTodoStatus.appendChild(newTodoStatusImage);
        target.prepend(newTodoStatus);
    }
    if (status === 1) {
        var newTodoStatus = document.createElement('span');
        newTodoStatus.classList.toggle('todo-list__item-status');
        newTodoStatus.classList.toggle('finished');
        newTodoStatus.appendChild(document.createTextNode('Finished'));
        var newTodoStatusImage = document.createElement('img');
        newTodoStatusImage.src = './icons/icon-checkmark.svg';
        newTodoStatusImage.alt = 'Image of a checkmark.';
        newTodoStatus.appendChild(newTodoStatusImage);
        target.prepend(newTodoStatus);
    }
};
var createTodoItem = function (id, todoText, status) {
    var newTodoLi = document.createElement('li');
    newTodoLi.classList.toggle('todo-list__item');
    newTodoLi.dataset.id = id.toString();
    setTodoStatus(newTodoLi, status);
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
        newTodoButton1Image.src = './icons/icon-checkmark.svg';
        newTodoButton1Image.alt = 'Image of a checkmark.';
        newTodoButton1.appendChild(newTodoButton1Image);
    }
    else if (status === 1) {
        newTodoButton1.setAttribute('aria-label', 'Press to mark to do in progress.');
        newTodoButton1.dataset.buttonRole = 'progress';
        var newTodoButton1Image = document.createElement('img');
        newTodoButton1Image.src = './icons/icon-clock.svg';
        newTodoButton1Image.alt = 'Image of a clock.';
        newTodoButton1.appendChild(newTodoButton1Image);
    }
    var newTodoButtonDelete = document.createElement('button');
    newTodoButtonDelete.setAttribute('aria-label', 'Press to delete to do.');
    newTodoButtonDelete.dataset.buttonRole = 'delete';
    var newTodoImageDelete = document.createElement('img');
    newTodoImageDelete.src = './icons/icon-delete.svg';
    newTodoImageDelete.alt = 'Image of a trash bin.';
    newTodoButtonDelete.appendChild(newTodoImageDelete);
    newTodoActions.appendChild(newTodoButton1);
    newTodoActions.appendChild(newTodoButtonDelete);
    newTodoContent.appendChild(newTodoActions);
    newTodoLi.appendChild(newTodoContent);
    return newTodoLi;
};
var loadTodos = function () {
    if (todolistLS) {
        todos.map(function (todo) { return todoListElement.appendChild(createTodoItem(todo.id, todo.text, todo.status)); });
    }
    setEmptyListContent();
};
var addTodo = function (event) {
    event.preventDefault();
    var todoText = addTodoInput.value;
    var newTodo = {
        id: Date.now(),
        text: todoText,
        status: Status.ACTIVE
    };
    if (todos.length === 0) {
        todoListElement.removeChild(todoListElement.firstElementChild);
    }
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
            setEmptyListContent();
        }
        else if (target.dataset.buttonRole === 'finish') {
            var todoItem = todos.find(function (todo) { return todo.id === todoId_1; });
            todoItem.status = Status.FINISHED;
            var todoElementStatus = todoElement.firstElementChild;
            todoElement.removeChild(todoElementStatus);
            setTodoStatus(todoElement, Status.FINISHED);
            target.firstElementChild.src = './icons/icon-clock.svg';
            target.firstElementChild.alt = 'Image of a clock.';
            target.dataset.buttonRole = 'progress';
            target.setAttribute('aria-label', 'Press to mark a to do in progress.');
        }
        else if (target.dataset.buttonRole === 'progress') {
            var todoItem = todos.find(function (todo) { return todo.id === todoId_1; });
            todoItem.status = Status.ACTIVE;
            var todoElementStatus = todoElement.firstElementChild;
            todoElement.removeChild(todoElementStatus);
            setTodoStatus(todoElement, Status.ACTIVE);
            target.firstElementChild.src = './icons/icon-checkmark.svg';
            target.firstElementChild.alt = 'Image of a checkmark.';
            target.dataset.buttonRole = 'finish';
            target.setAttribute('aria-label', 'Press to mark a to do as finished.');
        }
        saveTodosToLocalStorage(todos);
    }
};
loadTodos();
addTodoForm.addEventListener('submit', addTodo);
todoListElement.addEventListener('click', setTodo);
