window.onload = createButtons;

function createButtons() {
    let buttonsBlock = document.getElementById("boards");
    let createNewBoardButton = document.createElement("button");
    createNewBoardButton.id = "btn-create-new-board";
    createNewBoardButton.textContent = "Create a new board..."
    createNewBoardButton.addEventListener("click", function() {
        this.textContent = "Creating a board";
        this.classList.add("active");
        let closeIcon = document.createElement("span");
        closeIcon.textContent = "X";
        this.appendChild(closeIcon);

        this.appendChild(document.createElement("hr"));
        let namingText = document.createElement("h5");
        namingText.textContent = "What shall we call the board?"
        let inputBox = document.createElement("input");

        this.appendChild(namingText);
        this.appendChild(inputBox);

        let confirmCancelButtons = document.createElement("div");
        let cancelButton = document.createElement("button");
        cancelButton.id = "btn-cancel";
        let confirmButton = document.createElement("button");
        confirmButton.id = "btn-confirm";
        confirmCancelButtons.appendChild(cancelButton);
        confirmCancelButtons.appendChild(confirmButton);
    })

    buttonsBlock.appendChild(createNewBoardButton);

    let savedBoards = Cookies.getJSON("savedBoards");
    console.log(savedBoards);
}