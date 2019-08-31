const lists = document.getElementById("lists");
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

function replaceNewListCard() {
    lists.removeChild(createNewListCard);
    lists.appendChild(newListInputDiv);
}

function showNameInsistence() {
    nameInsistenceText.textContent = "give me a name!"
}

function hideNameInsistence() {
    nameInsistenceText.textContent = "";
}