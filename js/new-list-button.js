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
        console.log("AAA");
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
    let newList = document.createElement("div");
    newList.textContent = title;
    newList.classList.add("list");

    let newListSubDiv = document.createElement("div");
    newListSubDiv.appendChild(document.createElement("hr"));
    newListSubDiv.appendChild(document.createElement("input"));
    newListSubDiv.classList.add("list-sub-div");

    listContainer.appendChild(newList);
    newList.appendChild(newListSubDiv);
    replaceNewListInputDiv();

    // if (!initializingLists) {
    //     let savedBoardsString = Cookies.get("savedBoards");
    //     savedBoardsString = (savedBoardsString === undefined) ? title :
    //         savedBoardsString + "," + title;
    //     Cookies.set("savedBoards", savedBoardsString);
    // }

}