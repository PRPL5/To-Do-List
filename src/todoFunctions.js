// todoFunctions.js
export function deleteToDoItem(index, selectedFolder, getToDos, saveToDos, loadToDos) {
    const todosList = getToDos(selectedFolder);
    todosList.splice(index, 1);
    saveToDos(selectedFolder, todosList);
    loadToDos();
}

export function createToDoItem(todo, index, deleteToDoItem) {
    const todoDiv = document.createElement('div');
    todoDiv.classList.add("todo");
    
    let priorityClass = '';
    switch (todo.priority) {
        case 'high':
            priorityClass = 'priority-high';
            break;
        case 'medium':
            priorityClass = 'priority-medium';
            break;
        case 'low':
            priorityClass = 'priority-low';
            break;
        default:
            priorityClass = '';
    }

    todoDiv.innerHTML = `
        <h2 class="card-title">${todo.title}</h2>
        <p class="card-desc">${todo.desc}</p>
        <p class="card-date">${todo.date}</p>
        <span class="priority-dot ${priorityClass}"></span>
        <button class="card-button" data-index="${index}">Delete</button>
    `;
    return todoDiv;
}
