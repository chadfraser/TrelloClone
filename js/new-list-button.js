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
    let url = decodeURI(window.location.href);
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
        return newList;
    }
}

function createNewTask(title, mainDiv, initializingTasks, taskObject) {
    let newTask = document.createElement("div");
    let taskText = document.createElement("p");;
    let checkmark = document.createElement("img");

    newTask.classList.add("task");
    newTask.draggable = "true";
    newTask.appendChild(taskText);
    newTask.appendChild(checkmark);
    newTask.addEventListener("dragstart", function() {
        dragTask(this, event, mainDiv);
    });
    
    taskText.textContent = title
    
    checkmark.src = "img/iconmonstr-check-mark.png";
    checkmark.addEventListener("click", function() {
        toggleCheckedTask(newTask);
    });

    mainDiv.appendChild(newTask);

    if (!initializingTasks) {
        let mainDivTitle = getNameOfListDiv(mainDiv);
        saveTasks(title, mainDivTitle);
    } else if (taskObject.active === false) {
        newTask.classList.add("checked");
    }
}

function toggleCheckedTask(task) {
    let listDiv = task.parentElement;
    let listDivTitle = getNameOfListDiv(listDiv);
    
    let savedBoards = getSavedBoardData();
    let activeBoard = getActiveBoardObject(savedBoards);
    let activeBoardIndex = savedBoards.boards.indexOf(activeBoard);
    let currentList = getCurrentListObject(activeBoard, activeBoardIndex, listDivTitle);
    let currentListIndex = activeBoard.lists.indexOf(currentList);
    let currentTask = getCurrentTaskFromList(currentList, task.textContent);
    let currentTaskIndex = currentList.tasks.indexOf(currentTask);

    if (task.classList.contains("checked")) {
        task.classList.remove("checked");
        currentTask.active = true;
    } else {
        task.classList.add("checked");
        currentTask.active = false;
    }

    console.log(currentTask, currentTaskIndex);
    updateStoredCurrentTask(activeBoardIndex, currentListIndex, currentTask, currentTaskIndex);
}

function dragTask(element, event, mainDiv) {
    let index = draggableElements.indexOf(element);
    if (index === -1) {
        draggableElements.push([element, mainDiv]);
        index = draggableElements.length - 1;
    }
    event.dataTransfer.setData("text", index);
}

function dropTask(target, event) {
    event.preventDefault();
    let elementAndPreviousDiv = draggableElements[event.dataTransfer.getData("text")];
    let element = elementAndPreviousDiv[0];
    let previousDiv = elementAndPreviousDiv[1];
    target.appendChild(element);

    let previousDivTitle = getNameOfListDiv(previousDiv);
    let targetTitle = getNameOfListDiv(target);
    moveTask(element.textContent, previousDivTitle, targetTitle);
}

function moveTask(taskName, previousListName, targetListName) {
    let savedBoards = getSavedBoardData();
    let activeBoard = getActiveBoardObject(savedBoards);
    let activeBoardIndex = savedBoards.boards.indexOf(activeBoard);
    let previousList = getCurrentListObject(activeBoard, activeBoardIndex, previousListName);
    let previousListIndex = activeBoard.lists.indexOf(previousList);
    let targetList = getCurrentListObject(activeBoard, activeBoardIndex, targetListName);
    let targetListIndex = activeBoard.lists.indexOf(targetList);
    let task = getCurrentTaskFromList(previousList, taskName);
    let previousTaskIndex = previousList.tasks.indexOf(task);
    
    targetList.tasks.push(task);
    previousList.tasks.splice(previousTaskIndex, 1);

    updateStoredCurrentList(activeBoardIndex, previousList, previousListIndex);
    updateStoredCurrentList(activeBoardIndex, targetList, targetListIndex);
}

function saveLists(name) {
    let savedBoards = getSavedBoardData();
    let activeBoard = getActiveBoardObject(savedBoards);
    let activeBoardIndex = savedBoards.boards.indexOf(activeBoard);
    activeBoard.lists.push({ "title": name });
    updateStoredActiveBoard(activeBoard, activeBoardIndex);
}

function saveTasks(taskName, listName) {
    let savedBoards = getSavedBoardData();
    let activeBoard = getActiveBoardObject(savedBoards);
    let activeBoardIndex = savedBoards.boards.indexOf(activeBoard);
    let currentList = getCurrentListObject(activeBoard, activeBoardIndex, listName);
    let currentListIndex = activeBoard.lists.indexOf(currentList);
    currentList.tasks.push({
        "title": taskName,
        "active": true
    });
    updateStoredCurrentList(activeBoardIndex, currentList, currentListIndex);
}

function createListsAndTasks() {
    let savedBoards = getSavedBoardData();
    let activeBoard = getActiveBoardObject(savedBoards);
    if (activeBoard.lists === undefined) {
        activeBoard.lists = [];
    }

    activeBoard.lists.forEach(function(e) {
        let currentList = createNewList(e.title, true);
        if (e.tasks !== undefined) {
            e.tasks.forEach( function(e2) {
                createNewTask(e2.title, currentList, true, e2);
            });
        }
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
    if (activeBoard.lists === undefined) {
        activeBoard.lists = [];
        let activeBoardIndex = savedBoards.boards.indexOf(activeBoard);
        savedBoards.boards[activeBoardIndex] = activeBoard;
        localStorage.setItem("savedBoards", JSON.stringify(savedBoards));
    }
    return activeBoard;
}

function getCurrentListObject(activeBoard, activeBoardIndex, currentListTitle) {
    let savedBoards = getSavedBoardData();
    let activeListList = activeBoard.lists.filter(l => l.title === currentListTitle);
    let currentList;
    if (activeListList.length === 0) {
        currentList = {
            "title": currentListTitle,
            "tasks": []
        }
        activeBoard.lists.push(currentList);
        updateStoredActiveBoard(activeBoard, activeBoardIndex);
    } else {
        currentList = activeListList[0];
    }
    if (currentList.tasks === undefined) {
        currentList.tasks = [];
        let currentListIndex = savedBoards.boards.indexOf(currentList);
        savedBoards.boards[activeBoardIndex].lists[currentListIndex] = currentList;
        localStorage.setItem("savedBoards", JSON.stringify(savedBoards));
    }
    return currentList;
}

function getCurrentTaskFromList(currentList, taskName) {
    let activeTaskList = currentList.tasks.filter(t => t.title === taskName);
    return activeTaskList[0];
}

function getNameOfListDiv(listDiv) {
    let subDiv = listDiv.getElementsByClassName("list-sub-div")[0];
    let titleDiv = subDiv.getElementsByClassName("list-title-div")[0];
    return titleDiv.textContent;
}

function updateStoredActiveBoard(activeBoard, activeBoardIndex) {
    let savedBoards = getSavedBoardData();
    savedBoards.boards[activeBoardIndex] = activeBoard;
    localStorage.setItem("savedBoards", JSON.stringify(savedBoards));
}

function updateStoredCurrentList(activeBoardIndex, currentList, currentListIndex) {
    let savedBoards = getSavedBoardData();
    savedBoards.boards[activeBoardIndex].lists[currentListIndex] = currentList;
    localStorage.setItem("savedBoards", JSON.stringify(savedBoards));
}

function updateStoredCurrentTask(activeBoardIndex, currentListIndex, currentTask, currentTaskIndex) {
    let savedBoards = getSavedBoardData();
    savedBoards.boards[activeBoardIndex].lists[currentListIndex].tasks[currentTaskIndex] = currentTask;
    localStorage.setItem("savedBoards", JSON.stringify(savedBoards));
}