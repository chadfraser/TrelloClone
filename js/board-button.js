window.onload = createBoards;

const deleteImage = document.getElementById("main-image-icon");
deleteImage.addEventListener("click", function() {
    let answer = confirm("Erase all created boards and tasks?");
    if (answer) {
        localStorage.clear();
        while (cardContainer.childNodes.length > 2) {
            cardContainer.removeChild(cardContainer.lastChild);
            console.log(cardContainer.childNodes);
        }
    }
});

const cardContainer = document.getElementById("boards");
const createNewBoardCard = document.getElementById("card-create-new-board");
const mainCardHeader = document.createElement("div"); 
mainCardHeader.classList.add("card-header");

const boardCreationDiv = document.createElement("div");
const optionButtons = document.createElement("div");
const cancelButton = document.createElement("button");
const createButton = document.createElement("button");
const namingText = document.createElement("h5");
const inputBox = document.createElement("input");
inputBox.addEventListener("keydown", function() {
    if (event.key === "Enter" && inputBox.value.trim() !== "") {
        createNewBoard(inputBox.value, false);
        inputBox.value = "";
        reduceCard(createNewBoardCard);
        event.stopPropagation();
    }
})

initializeOptionButtons();
namingText.textContent = "What shall we call the board?"
createNewBoardCard.addEventListener("click", toggleCard);

boardCreationDiv.appendChild(namingText);
boardCreationDiv.appendChild(inputBox);
boardCreationDiv.appendChild(optionButtons);

const closeIcon = document.createElement("img");
closeIcon.classList.add("close-icon");
closeIcon.src = "img/iconmonstr-x-mark.png";
mainCardHeader.textContent = "Creating a board";
mainCardHeader.appendChild(closeIcon);

closeIcon.addEventListener("click", function(){
    reduceCard(createNewBoardCard);
    inputBox.value = "";
    event.stopPropagation();
});
cancelButton.addEventListener("click", function(){
    reduceCard(createNewBoardCard);
    inputBox.value = "";
    event.stopPropagation();
});
createButton.addEventListener("click", function() {
    if (inputBox.value.trim() !== "") {
        createNewBoard(inputBox.value, false);
        inputBox.value = "";
        reduceCard(createNewBoardCard);
        event.stopPropagation();
    }
})

function initializeOptionButtons() {
    cancelButton.textContent = "CANCEL";
    cancelButton.id = "btn-cancel";
    createButton.textContent = "CREATE";
    createButton.id = "btn-create";
    optionButtons.appendChild(cancelButton);
    optionButtons.appendChild(createButton);
    optionButtons.id = "option-buttons";
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

function reduceCard(card) {
    card.classList.remove("active");
    while (card.firstChild) {
        card.removeChild(card.firstChild);
    }
    card.textContent = "Create a new board...";
}

function createNewBoard(title, initializingBoards) {
    let newCard = document.createElement("div");
    newCard.classList.add("card");
    newCard.classList.add("grow-on-hover");
    newCard.textContent = title;
    newCard.addEventListener("click", function() {
        window.location = "./sample-list.html?title=" + title;
    });

    cardContainer.appendChild(newCard);

    if (!initializingBoards) {
        let savedBoardData = JSON.parse(localStorage.getItem("savedBoards"));
        if (savedBoardData === null) {
            return;
        }
        let boards = savedBoardData.tasks === undefined ? [title] :
            savedBoardData.tasks.push(title);
        // let savedBoardsString = Cookies.get("savedBoards");
        // savedBoardsString = (savedBoardsString === undefined) ? title :
        //     savedBoardsString + "," + title;
        // Cookies.set("savedBoards", savedBoardsString);
        // inputBox.value = "";
        // reduceCard(createNewBoardCard);
    }
}

function createBoards() {
    let savedBoards = JSON.parse(localStorage.getItem("savedBoards"));
    if (savedBoards === null) {
        return;
    }
    // let savedBoards = savedBoardsString.split(",");
    savedBoards.forEach(function(e) {
        createNewBoard(e, true);
    });
}