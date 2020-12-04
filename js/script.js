'use strict';

const todoControl = document.querySelector('.todo-control'),
    headerInput = document.querySelector('.header-input'),
    todoList = document.querySelector('.todo-list'),
    todoCompleted = document.querySelector('.todo-completed');
let todoData = [];

const render = function() {
    todoList.textContent = '';
    todoCompleted.textContent = '';
    
    todoData.forEach(function(item, i) {
        const li = document.createElement('li');
        li.classList.add('todo-item');
        li.innerHTML = `<span class="text-todo">${item.value}</span>
                        <div class="todo-buttons">
                            <button class="todo-remove"></button>
                            <button class="todo-complete"></button>
                        </div>`;
        if (item.completed) {
            todoCompleted.append(li);
        } else {
            todoList.append(li);
        }

        const btnTodoComplete = li.querySelector('.todo-complete');
        btnTodoComplete.addEventListener('click', function() {
            item.completed = !item.completed;
            render();
        });

        const btnTodoRemove = li.querySelector('.todo-remove'); //5
        btnTodoRemove.addEventListener('click', function() {
            todoData.splice(i, 1);
            render();
        });
    });

    localStorage.todoData = JSON.stringify(todoData); //6
};

const init = function() { //6
    if (localStorage.todoData){
        todoData = JSON.parse(localStorage.todoData);
    } else {
        localStorage.todoData = JSON.stringify([]);
    }
    render();
};

todoControl.addEventListener('submit', function(event) {
    event.preventDefault();

    if (headerInput.value.trim()) { //3
        const newTodo = {
            value: headerInput.value,
            completed: false
        };
        console.log(todoData);
        todoData.push(newTodo);
        
    
        headerInput.value = ''; //4
        render();
    }    
});

init();