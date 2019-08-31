window.onload = createBoards;
const optionButtons = document.createElement("div");
const cancelButton = document.createElement("button");
const createButton = document.createElement("button");

cancelButton.textContent = "CANCEL";
cancelButton.id = "btn-cancel";
createButton.textContent = "CREATE";
createButton.id = "btn-create";
optionButtons.appendChild(cancelButton);
optionButtons.appendChild(createButton);
let closeIcon = document.createElement("span");
closeIcon.textContent = "X";
closeIcon.addEventListener("onclick", function(){
    
})

function createBoards() {
    let boardsBlock = document.getElementById("boards");
    let createNewBoardCard = document.createElement("div");
    createNewBoardCard.id = "card-create-new-board";
    createNewBoardCard.textContent = "Create a new board..."
    createNewBoardCard.addEventListener("click", function() {
        
        this.textContent = "Creating a board";
        this.classList.add("active");
        this.appendChild(closeIcon);

        this.appendChild(document.createElement("hr"));
        let namingText = document.createElement("h5");
        namingText.textContent = "What shall we call the board?"
        let inputBox = document.createElement("input");

        this.appendChild(namingText);
        this.appendChild(inputBox);

        // let optionButtons = document.createElement("div");
        this.appendChild(optionButtons);

        // let cancelButton = document.createElement("button");
        // cancelButton.textContent = "CANCEL";
        // cancelButton.id = "btn-cancel";
        // // let createButton = document.createElement("button");
        // createButton.textContent = "CREATE";
        // createButton.id = "btn-create";
        // optionButtons.appendChild(cancelButton);
        // optionButtons.appendChild(createButton);
    })

    boardsBlock.appendChild(createNewBoardCard);

    let savedBoards = Cookies.getJSON("savedBoards");
    console.log(savedBoards);
}