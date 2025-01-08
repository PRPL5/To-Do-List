import "./styles.css";
import { createToDoItem, deleteToDoItem } from './todoFunctions';

const form = document.querySelector("form");
const todoTitle = document.getElementById("title");
const todoDesc = document.getElementById("desc");
const todoDate = document.getElementById("date");
const todoPriority = document.getElementById("options");
const addBtn = document.getElementById("addBtn");
const addFolderBtn = document.getElementById("addFolderBtn");
const deleteFolderBtn = document.getElementById("deleteFolderBtn");
const todos = document.getElementById("todos");
const folderSelect = document.getElementById("folderSelect");

let folders = getFolders();
let selectedFolder = getFolderFromUrl() || "default";
updateFolderSelect();
loadToDos();

addBtn.addEventListener("click", (e) => {
    e.preventDefault();
    addToDo();
});

addFolderBtn.addEventListener("click", (e) => {
    e.preventDefault();
    addFolder();
});

deleteFolderBtn.addEventListener("click", (e) => {
    e.preventDefault();
    deleteFolder();
});

folderSelect.addEventListener("change", () => {
    selectedFolder = folderSelect.value;
    window.location.href = `?folder=${selectedFolder}`;
});

todos.addEventListener("click", (e) => {
    if (e.target.classList.contains("card-button")) {
        const index = e.target.getAttribute("data-index");
        deleteToDoItem(index, selectedFolder, getToDos, saveToDos, loadToDos);
    }
});

function addToDo() {
    let title = todoTitle.value;
    let desc = todoDesc.value;
    let date = todoDate.value;
    let priority = todoPriority.value;

    if (title.length > 0) {
        if (date.length > 0) {
            let todos = getToDos(selectedFolder);
            todos.push({ title, desc, date, priority });
            saveToDos(selectedFolder, todos);
            console.log(todos);
            loadToDos();
        }
    }
}

function addFolder() {
    const newFolderName = prompt("Enter folder name:");
    if (newFolderName && !folders.includes(newFolderName)) {
        folders.push(newFolderName);
        saveFolders();
        updateFolderSelect();
    }
}

function deleteFolder() {
    if (selectedFolder !== "default") {
        const confirmed = confirm(`Are you sure you want to delete the folder '${selectedFolder}' and all its todos?`);
        if (confirmed) {
            folders = folders.filter(folder => folder !== selectedFolder);
            localStorage.removeItem(`todos_${selectedFolder}`);
            saveFolders();
            updateFolderSelect();
            selectedFolder = "default";
            window.location.href = `?folder=${selectedFolder}`;
        }
    } else {
        alert("The default folder cannot be deleted.");
    }
}

function clearInput() {
    todoTitle.value = '';
    todoDesc.value = '';
    todoDate.value = '';
}

function loadToDos() {
    clearInput();
    todos.innerHTML = ''; // Clear existing todos
    const todosList = getToDos(selectedFolder);
    console.log(`Loading todos for folder: ${selectedFolder}`);
    console.log(todosList);
    todosList.forEach((todo, index) => {
        const todoItem = createToDoItem(todo, index, deleteToDoItem);
        todos.append(todoItem);
    });
}

function saveToDos(folder, todos) {
    localStorage.setItem(`todos_${folder}`, JSON.stringify(todos));
}

function getToDos(folder) {
    const todos = localStorage.getItem(`todos_${folder}`) || "[]";
    return JSON.parse(todos);
}

function getFolders() {
    const folders = localStorage.getItem("folders") || "[]";
    return JSON.parse(folders);
}

function saveFolders() {
    localStorage.setItem("folders", JSON.stringify(folders));
}

function updateFolderSelect() {
    folderSelect.innerHTML = `<option value="default">Default</option>`;
    folders.forEach(folder => {
        const option = document.createElement("option");
        option.value = folder;
        option.textContent = folder;
        folderSelect.append(option);
    });
    folderSelect.value = selectedFolder;
}

function getFolderFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get("folder");
}
