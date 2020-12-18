'use strict';

class ToDo {
    constructor(container, form, input, todoList, todoComplited) {
        this.container = document.querySelector(container);
        this.form = document.querySelector(form);
        this.input = document.querySelector(input);
        this.todoList = document.querySelector(todoList);
        this.todoComplited = document.querySelector(todoComplited);
        this.todoData = new Map(JSON.parse(localStorage.getItem('todoList')));
    }

    addToStorage() {
        localStorage.setItem('todoList', JSON.stringify([...this.todoData]));
    }

    render() {
        this.todoList.textContent = '';
        this.todoComplited.textContent = '';
        this.todoData.forEach(this.createItem, this);
        this.addToStorage();
    }

    createItem(todo) {
        const li = document.createElement('li');
        li.key = todo.key;
        li.classList.add('todo-item');
        li.insertAdjacentHTML('beforeend', `
                <span class="text-todo">${todo.value}</span>
				<div class="todo-buttons">
					<button class="todo-remove"></button>
					<button class="todo-complete"></button>
				</div>
        `);

        if (todo.completed) {
            this.todoComplited.append(li);
        } else {
            this.todoList.append(li);
        }
    }
    addTodo(e) {
        e.preventDefault();
        if (this.input.value.trim()) {
            const newTodo = {
                value: this.input.value,
                completed: false,
                key: this.generateKey(),
            };
            this.todoData.set(newTodo.key, newTodo);
            this.render();
            this.input.value = '';
        } else {
            alert('Поле не может быть пустым!');
        }
    }


    generateKey() {
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }

    deleteItem(key) {
        this.todoData.delete(key);
        this.render();
    }
    
    completedItem(key) {
        this.todoData.get(key).completed = !this.todoData.get(key).completed;
        this.render();
    }

    handler(e) {
            if (e.target.classList.contains('todo-remove')) {
                this.deleteItem(e.target.closest('li').key);
            } else if (e.target.classList.contains('todo-complete')) {
                this.completedItem(e.target.closest('li').key);
            }             
    }

    init() {
        this.form.addEventListener('submit',  this.addTodo.bind(this));
        this.container.addEventListener('click', this.handler.bind(this));
        this.render();
    }
}

const todo = new ToDo('.todo-container', '.todo-control', '.header-input', '.todo-list', '.todo-completed');
todo.init();