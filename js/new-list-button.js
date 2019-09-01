const listContainer = document.getElementById("lists");
const createNewListCard = document.getElementById("card-create-list");
const newListInputDiv = document.createElement("div");
newListInputDiv.id = "new-list-input-div";
const newListInputBox = document.createElement("input");
newListInputBox.placeholder = "add a list";
const newListCloseIcon = document.createElement("img");
newListCloseIcon.src = "img/iconmonstr-x-mark-aquamarine-opaque.png"
newListCloseIcon.id = "new-list-close-icon";
const nameInsistenceText = document.createElement("h7");

newListInputDiv.appendChild(newListCloseIcon);
newListInputDiv.appendChild(newListInputBox);
newListInputDiv.appendChild(nameInsistenceText);

createNewListCard.addEventListener("click", replaceNewListCard);
newListInputBox.addEventListener("focusout", showNameInsistence);
newListInputBox.addEventListener("focusin", hideNameInsistence);

newListCloseIcon.addEventListener("click", replaceNewListInputDiv);
newListInputBox.addEventListener("keydown", function() {
    if (event.key === "Enter") {
        createNewList(this.value.toUpperCase(), false);
    }
});

function replaceNewListCard() {
    listContainer.removeChild(createNewListCard);
    listContainer.appendChild(newListInputDiv);
}

function replaceNewListInputDiv() {
    listContainer.removeChild(newListInputDiv);
    newListInputBox.value = "";
    listContainer.appendChild(createNewListCard);
}

function showNameInsistence() {
    if (newListInputBox.value === "") {
        nameInsistenceText.textContent = "give me a name!"
    }
}

function hideNameInsistence() {
    nameInsistenceText.textContent = "";
}

function createNewList(title, initializingLists) {
    let subcontainer = document.createElement("div");
    subcontainer.classList.add("subcontainer");

    let newList = document.createElement("div");
    newList.classList.add("list");

    let newListTitle = document.createElement("div");
    newListTitle.textContent = title;
    newListTitle.classList.add("list-title-div");

    let newListSubDiv = document.createElement("div");
    let subDivInputBox = document.createElement("input");
    newListSubDiv.appendChild(newListTitle);
    newListSubDiv.appendChild(document.createElement("hr"));
    newListSubDiv.appendChild(subDivInputBox);
    newListSubDiv.classList.add("list-sub-div");

    subDivInputBox.addEventListener("keydown", function() {
        if (event.key === "Enter" && subDivInputBox.value !== "") {
            createNewTask(this.value, newList);
            subDivInputBox.value = "";
        }
    });

    // listContainer.appendChild(newList);
    listContainer.appendChild(subcontainer);
    subcontainer.appendChild(newList);
    newList.appendChild(newListSubDiv);

    replaceNewListInputDiv();

    // if (!initializingLists) {
    //     let savedBoardsString = Cookies.get("savedBoards");
    //     savedBoardsString = (savedBoardsString === undefined) ? title :
    //         savedBoardsString + "," + title;
    //     Cookies.set("savedBoards", savedBoardsString);
    // }
}

function createNewTask(title, mainDiv) {
    let newTask = document.createElement("div");
    newTask.textContent = title;
    newTask.classList.add("task");

    let checkmark = document.createElement("img");
    checkmark.src = "img/iconmonstr-check-mark.png"
    newTask.appendChild(checkmark);
    mainDiv.appendChild(newTask);
}