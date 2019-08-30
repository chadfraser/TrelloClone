window.onload = createButtons;

function createButtons() {
    let buttonsBlock = document.getElementById("boards");
    let createNewBoardButton = document.createElement("button");
    createNewBoardButton.id = "btn-create-new-board";
    createNewBoardButton.textContent = "Create a new board..."
    buttonsBlock.appendChild(createNewBoardButton);

    let savedBoards = Cookies.getJSON("savedBoards");
    console.log(savedBoards);
}