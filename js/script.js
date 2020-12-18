'use strict';

class ToDo {
    constructor(container, form, input, todoList, todoComplited) {
        this.container = document.querySelector(container);
        this.form = document.querySelector(form);
        this.input = document.querySelector(input);
        this.todoList = document.querySelector(todoList);
        this.todoComplited = document.querySelector(todoComplited);
        this.todoData = new Map(JSON.parse(localStorage.getItem('todoList')));
        this.animItem = '';
    }

    addToStorage() {
        localStorage.setItem('todoList', JSON.stringify([...this.todoData]));
    }

    render() {
        
        this.todoList.textContent = '';
        this.todoComplited.textContent = '';
        this.todoData.forEach(this.createItem.bind(this));
        if (this.animItem) {
            this.animateAdd();
            this.animItem = '';
        }
        this.addToStorage();
    }

    animateAdd() { 
        const item = document.querySelector('[style="opacity: 0;"]');
        let count = 0,
            animInterval;

        const animation = () => {
            animInterval = requestAnimationFrame(animation);
            count = count + 0.05;
            if (count <= 1) {
                item.style.opacity = count;
            } else {
                cancelAnimationFrame(animInterval);
            }
        };
        animInterval = requestAnimationFrame(animation);
    }
    animate(item, action) { // 1.
        item.style.opacity = '1';
        let count = 1,
            animInterval;

        const animation = () => {
            animInterval = requestAnimationFrame(animation);
            count = count - 0.05;
            if (count >= -0.05) {
                item.style.opacity = count;
            } else {
                cancelAnimationFrame(animInterval);
                if (action === 'delete') {
                    this.deleteItem(item.key);
                } else {
                    this.animItem = item.key;
                    this.completedItem(item.key);
                }
            }
        };
        animInterval = requestAnimationFrame(animation);
    }
    createItem(todo) {
        const li = document.createElement('li');
        li.key = todo.key;
        li.classList.add('todo-item');
        if (this.animItem === todo.key) {
            li.style.opacity = '0';
        }
        li.insertAdjacentHTML('beforeend', `
            <span class="text-todo">${todo.value}</span>
            <div class="todo-buttons">
                <button class="todo-edit"></button>
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
            this.animItem = newTodo.key;
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

    editItem(item) { // 2.
        item.querySelector('.todo-edit').style.display = 'none';
        const removable = item.querySelector('span'),
            text = removable.textContent;

        removable.innerHTML = '<input> Сохранить: enter';
        const input = removable.querySelector('input');
        input.value = text;
        input.addEventListener('keyup', (e) => {
            if (e.key === 'Enter') {
                removable.textContent = input.value;
                this.todoData.get(item.key).value = input.value;
                item.querySelector('.todo-edit').style.display = 'block';
            }
        });
    }
    handler(e) {
            if (e.target.classList.contains('todo-remove')) {
                this.animate(e.target.closest('li'), 'delete');
            } else if (e.target.classList.contains('todo-complete')) {
                this.animate(e.target.closest('li'), 'remove');
            } else if (e.target.classList.contains('todo-edit')) {
                this.editItem(e.target.closest('li'));
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