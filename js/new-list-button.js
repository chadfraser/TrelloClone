window.onload = createListsAndTasks;

let mainBoardTitle;
const draggableElements = [];

const listTitleDiv = document.getElementById("list-title");
const listContainer = document.getElementById("lists");
const createNewListCard = document.getElementById("card-create-list");
const newListInputDiv = document.createElement("div");
const newListInputBox = document.createElement("input");
const newListCloseIcon = document.createElement("img");
const nameInsistenceText = document.createElement("h7");

createNewListCard.classList.add("grow-on-hover");
newListCloseIcon.src = "img/iconmonstr-x-mark-aquamarine-opaque.png"
newListCloseIcon.id = "new-list-close-icon";
newListInputBox.placeholder = "add a list";
newListInputDiv.id = "new-list-input-div";

newListInputDiv.appendChild(newListCloseIcon);
newListInputDiv.appendChild(newListInputBox);
newListInputDiv.appendChild(nameInsistenceText);

initializeEventListeners();
setBoardTitle();

function initializeEventListeners() {
    document.addEventListener("dragover", function(event) {
        event.preventDefault();
    });
    document.addEventListener("drop", function(event) {
        event.preventDefault();
    });

    createNewListCard.addEventListener("click", replaceNewListCard);
    newListInputBox.addEventListener("focusout", showNameInsistence);
    newListInputBox.addEventListener("focusin", hideNameInsistence);
    
    newListCloseIcon.addEventListener("click", replaceNewListInputDiv);
    newListInputBox.addEventListener("keydown", function() {
        if (event.key === "Enter" && this.value.trim() !== "") {
            createNewList(this.value.toUpperCase(), false);
        }
    });
}

function setBoardTitle() {
    let url = window.location.href;
    let parameterIndex = url.indexOf("title");

    if (parameterIndex === -1) {
        listTitleDiv.textContent = "Test";
    } else {
        let boardTitle = url.substring(parameterIndex + 6);
        listTitleDiv.textContent = boardTitle;
        mainBoardTitle = boardTitle;
    }
}

function replaceNewListCard() {
    listContainer.removeChild(createNewListCard);
    listContainer.appendChild(newListInputDiv);
}

function moveNewListCardToEnd() {
    listContainer.removeChild(createNewListCard);
    listContainer.appendChild(createNewListCard);
}

function replaceNewListInputDiv() {
    listContainer.removeChild(newListInputDiv);
    newListInputBox.value = "";
    listContainer.appendChild(createNewListCard);
}

function showNameInsistence() {
    if (newListInputBox.value.trim() === "") {
        nameInsistenceText.textContent = "give me a name!"
    }
}

function hideNameInsistence() {
    nameInsistenceText.textContent = "";
}

function createNewList(name, initializingLists) {
    let subcontainer = document.createElement("div");
    let newList = document.createElement("div");
    let newListTitle = document.createElement("div");
    let newListSubDiv = document.createElement("div");
    let subDivInputBox = document.createElement("input");

    subcontainer.classList.add("subcontainer");
    subcontainer.appendChild(newList);
    
    newList.classList.add("list");
    newList.appendChild(newListSubDiv);

    newListTitle.textContent = name;
    newListTitle.classList.add("list-title-div");
    newList.addEventListener("drop", function() {
        dropTask(this, event);
    });

    newListSubDiv.appendChild(newListTitle);
    newListSubDiv.appendChild(document.createElement("hr"));
    newListSubDiv.appendChild(subDivInputBox);
    newListSubDiv.classList.add("list-sub-div");

    subDivInputBox.addEventListener("keydown", function() {
        if (event.key === "Enter" && subDivInputBox.value.trim() !== "") {
            createNewTask(this.value, newList);
            subDivInputBox.value = "";
        }
    });
    subDivInputBox.addEventListener("drop", function() {
        event.preventDefault();
    });

    listContainer.appendChild(subcontainer);

    if (!initializingLists) {
        replaceNewListInputDiv();
        saveLists(name);
    } else {
        moveNewListCardToEnd();
    }
}

function createNewTask(title, mainDiv, initializingTasks) {
    let newTask = document.createElement("div");
    let taskText = document.createElement("p");;
    let checkmark = document.createElement("img");

    newTask.classList.add("task");
    newTask.draggable = "true";
    newTask.appendChild(taskText);
    newTask.appendChild(checkmark);
    newTask.addEventListener("dragstart", function() {
        dragTask(this, event);
    });
    
    taskText.textContent = title
    
    checkmark.src = "img/iconmonstr-check-mark.png";
    checkmark.addEventListener("click", function() {
        toggleCheckedTask(newTask);
    });

    mainDiv.appendChild(newTask);

    if (!initializingTasks) {
        console.log(mainDiv.childNodes);
        let subDiv = mainDiv.getElementsByClassName("list-sub-div")[0];
        let titleDiv = subDiv.getElementsByClassName("list-title-div")[0];
        saveTasks(title, titleDiv.textContent);
    }
}

function toggleCheckedTask(task) {
    if (task.classList.contains("checked")) {
        task.classList.remove("checked");
    } else {
        task.classList.add("checked");
    }
}

function dragTask(element, event) {
    let index = draggableElements.indexOf(element);
    if (index === -1) {
        draggableElements.push(element);
        index = draggableElements.length - 1;
    }
    event.dataTransfer.setData("text", index);
}

function dropTask(target, event) {
    event.preventDefault();
    let element = draggableElements[event.dataTransfer.getData("text")];
    target.appendChild(element);
}

function saveLists(name) {
    let savedBoards = getSavedBoardData();
    let activeBoard = getActiveBoardObject(savedBoards);
    if (activeBoard.lists === undefined) {
        activeBoard.lists = [];
    }
    activeBoard.lists.push({ "title": name });
    let activeBoardIndex = savedBoards.boards.indexOf(activeBoard);
    savedBoards.boards[activeBoardIndex] = activeBoard;
    
    localStorage.setItem("savedBoards", JSON.stringify(savedBoards));
}

function saveTasks(taskName, listName) {
    console.log(taskName, listName);
}

function createListsAndTasks() {
    let savedBoards = getSavedBoardData();
    let activeBoard = getActiveBoardObject(savedBoards);
    if (activeBoard.lists === undefined) {
        activeBoard.lists = [];
    }

    activeBoard.lists.forEach(function(e) {
        createNewList(e.title, true);
    });
}

function getSavedBoardData() {
    let savedBoards = JSON.parse(localStorage.getItem("savedBoards"));
    if (savedBoards === null || savedBoards.boards === undefined) {
        savedBoards = {
            "boards": [
                {
                    "title": mainBoardTitle,
                    "lists": []
                }
            ]
        };
        localStorage.setItem("savedBoards", JSON.stringify(savedBoards));
    }
    return savedBoards;
}

function getActiveBoardObject(savedBoards) {
    let activeBoardList = savedBoards.boards.filter(b => b.title === mainBoardTitle);
    let activeBoard;
    if (activeBoardList.length === 0) {
        activeBoard = {
            "title": mainBoardTitle,
            "lists": []
        }
        savedBoards.boards.push(activeBoard);
        localStorage.setItem("savedBoards", JSON.stringify(savedBoards));
    } else {
        activeBoard = activeBoardList[0];
    }
    return activeBoard;
}