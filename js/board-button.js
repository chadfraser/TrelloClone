window.onload = createBoards;

const deleteIcon = document.getElementById("main-image-icon");
const cardContainer = document.getElementById("boards");
const createNewBoardCard = document.getElementById("card-create-new-board");
const mainCardHeader = document.createElement("div"); 
const boardCreationDiv = document.createElement("div");
const optionButtons = document.createElement("div");
const cancelButton = document.createElement("button");
const createButton = document.createElement("button");
const namingText = document.createElement("h5");
const inputBox = document.createElement("input");
const closeIcon = document.createElement("img");

namingText.textContent = "What shall we call the board?"

boardCreationDiv.appendChild(namingText);
boardCreationDiv.appendChild(inputBox);
boardCreationDiv.appendChild(optionButtons);

closeIcon.classList.add("close-icon");
closeIcon.src = "img/iconmonstr-x-mark.png";

mainCardHeader.classList.add("card-header");
mainCardHeader.textContent = "Creating a board";
mainCardHeader.appendChild(closeIcon);

initializeOptionButtons();
initializeEventListeners();

function initializeOptionButtons() {
    cancelButton.textContent = "CANCEL";
    cancelButton.id = "btn-cancel";
    createButton.textContent = "CREATE";
    createButton.id = "btn-create";
    optionButtons.appendChild(cancelButton);
    optionButtons.appendChild(createButton);
    optionButtons.id = "option-buttons";
}

function initializeEventListeners() {
    deleteIcon.addEventListener("click", function() {
        let answer = confirm("Erase all created boards and tasks?");
        if (answer) {
            localStorage.clear();
            while (cardContainer.childNodes.length > 2) {
                cardContainer.removeChild(cardContainer.lastChild);
            }
        }
    });

    inputBox.addEventListener("keydown", function() {
        if (event.key === "Enter" && inputBox.value.trim() !== "") {
            createNewBoard(inputBox.value, false);
            reduceCard(createNewBoardCard, event);
        }
    });

    closeIcon.addEventListener("click", function(){
        reduceCard(createNewBoardCard, event);
    });
    cancelButton.addEventListener("click", function(){
        reduceCard(createNewBoardCard, event);
    });
    createButton.addEventListener("click", function() {
        if (inputBox.value.trim() !== "") {
            createNewBoard(inputBox.value, false);
            reduceCard(createNewBoardCard, event);
        }
    });

    createNewBoardCard.addEventListener("click", toggleCard);
}

function toggleCard() {
    if (!this.classList.contains("active")) {
        expandCard(this);
    }
}

function expandCard(card) {
    card.classList.add("active");
    card.textContent = "";
    card.appendChild(mainCardHeader);
    card.appendChild(document.createElement("hr"));
    card.appendChild(boardCreationDiv);
}

function reduceCard(card, e) {
    card.classList.remove("active");
    while (card.firstChild) {
        card.removeChild(card.firstChild);
    }
    card.textContent = "Create a new board...";
    inputBox.value = "";
    e.stopPropagation();
}

function createNewBoard(title, initializingBoards) {
    let newCard = document.createElement("div");
    newCard.classList.add("card", "grow-on-hover");
    newCard.textContent = title;
    newCard.addEventListener("click", function() {
        window.location = "./sample-list.html?title=" + title;
    });

    cardContainer.appendChild(newCard);

    if (!initializingBoards) {
        let savedBoardData = JSON.parse(localStorage.getItem("savedBoards"));
        if (savedBoardData === null) {
            savedBoardData = {
                "boards": []
            };
        }
        savedBoardData.boards.push({ "title": title });
        localStorage.setItem("savedBoards", JSON.stringify(savedBoardData));
    }
}

function createBoards() {
    let savedBoards = JSON.parse(localStorage.getItem("savedBoards"));
    if (savedBoards === null) {
        return;
    }
    savedBoards.boards.forEach(function(e) {
        createNewBoard(e.title, true);
    });
}