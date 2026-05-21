import Input, { Keys, MouseButtons} from './lib/input.js'

let canvas = document.getElementById("canvas")
/**
* @type {CanvasRenderingContext2D}
*/
let CTX = canvas.getContext("2d")
let input = new Input(canvas)

let restart = document.getElementById("restartGame")
let verticalChangingSpeed;

let player_idle = new Image()
player_idle.src = "./images/player/player_idle.png"
let background_one = new Image()
let background_two = new Image()
background_one.src = "images/background/background_one.png"
background_two.src = "images/background/background_two.png"
let text_one = new Image() 
text_one.src = "images/text/one.png"
let text_two = new Image() 
text_two.src = "images/text/two.png"
let restartButton = new Image()
restartButton.src = "images/restartButton.png"
let boxOpen = new Image()
let boxClose = new Image()
let interactPopup = new Image()
interactPopup.src = "images/interact.png"
let home = new Image()
home.src = "images/background/home.png"



let isChestOneOpen = 0
let isChestTwoOpen = 0
let isChestThreeOpen = 0
boxOpen.src = "images/boxOpen.png"
boxClose.src = "images/boxClose.png"


let background_array = [background_one, background_two]
let backgroundChoice = 0
let player = {
    playerAvatar: player_idle, // i had plans to make animation but i have decided not to.
    playerX: 200,
    playerY: 215,
}

function enterHome() {
    backgroundChoice = 2
    console.log("home entye")
}

let leftClick
let playerJump
let playerA
let playerS
let playerD
let playerE
function updateKeys() {
    try {
        leftClick = input.getMouseButtonDown(MouseButtons.Left)
        playerJump = input.getKey(Keys.Space)
        playerA = input.getKey(Keys.A)
        playerD = input.getKey(Keys.D)
        playerE = input.getKeyDown(Keys.E)
    } catch (error) {
        throw new Error(error)
    }
}



function movePlayer(deltaTime) {
    console.log(player.playerX)
    if(backgroundChoice == 2) return
    if(leftClick) console.log(input.mousePosition.x);
    if(playerA) player.playerX -= 400 * deltaTime
    if(playerD) player.playerX += 400 * deltaTime
    if(playerJump && player.playerY == 215) {
        verticalChangingSpeed = 400;
        player.playerY = 214.999
    }
    verticalChangingSpeed *= Math.pow(1 - 0.97, deltaTime)
    if(verticalChangingSpeed <= 70 && verticalChangingSpeed) verticalChangingSpeed = -200;

    if(player.playerY >= 215) {
        verticalChangingSpeed = 0
        player.playerY = 215
    }
    if(player.playerY < 215) {
        player.playerY -= verticalChangingSpeed * deltaTime

    }

    if(playerE) interact();
    
    if(backgroundChoice == 0 && player.playerX <= 30) {
        player.playerX = 30
    }
    if(backgroundChoice == 1 && player.playerX <= 50) {
        backgroundChoice = 0
        player.playerX = canvas.width - 111
    }
    if(player.playerX >= canvas.width-109) {
        player.playerX = canvas.width-110
    }
    if(backgroundChoice == 0 && player.playerX >= canvas.width-110) {
        backgroundChoice = 1
        player.playerX = 51
    }
}
let lastTime = performance.now();
gameLoop(performance.now());

function gameLoop(currentTime) {
    const deltaTime = (currentTime - lastTime) / 1000; // sekunder
    lastTime = currentTime;
    if(backgroundChoice == 2) return;
    update(deltaTime); // uppdatera objekt
    render(); // rita objekt på canvas
    requestAnimationFrame(gameLoop);
}

function update(deltaTime) {
    
    input.update()
    updateKeys()
    movePlayer(deltaTime)
}

function renderBackground() {
    CTX.drawImage(background_array[backgroundChoice], 0, 0, canvas.width, canvas.height)
}

function renderText() {
    switch(backgroundChoice) {
        case 0:
            CTX.drawImage(text_one, 50, 50)
            break
        case 1:
            CTX.drawImage(text_two, 50, 50)
            break;
    }
}

function renderInteract() {
    if(
        (player.playerX >= 100 && player.playerX <= 250 && backgroundChoice == 0) ||
        (player.playerX >= 500 && player.playerX <= 650 && backgroundChoice == 0) ||
        (player.playerX >= 350 && player.playerX <= 500 && backgroundChoice == 1) ||
        (player.playerX >= 875 && player.playerX <= 1000 && backgroundChoice == 1) 
    ) {
        CTX.drawImage(interactPopup, player.playerX-player.playerAvatar.width+15, player.playerY-100)
    }
}

function renderChests() {
    if(backgroundChoice == 0) {
        if(isChestOneOpen == 0) {
            CTX.drawImage(boxClose, 200, 215+player_idle.height-boxClose.height+50, 100, 100)
        }
        else {
            CTX.drawImage(boxOpen, 200, 215+player_idle.height-boxClose.height+50, 100, 100)
        }
        if(isChestTwoOpen == 0) {
            CTX.drawImage(boxClose, 600, 215+player_idle.height-boxClose.height+50, 100, 100)
        }
        else {
            CTX.drawImage(boxOpen, 600, 215+player_idle.height-boxClose.height+50, 100, 100)
        }
        return
    }
    if(isChestThreeOpen == 0) {
        CTX.drawImage(boxClose, 450, 215+player_idle.height-boxClose.height+50, 100 ,100)
        
        return
    }
    CTX.drawImage(boxOpen, 450, 215+player_idle.height-boxClose.height+50, 100 ,100)
}

function interact() {
    if(player.playerX >= 100 && player.playerX <= 300 && backgroundChoice == 0) {
        isChestOneOpen++
        isChestOneOpen = isChestOneOpen%2
    }
    if(player.playerX >= 500 && player.playerX <= 650 && backgroundChoice == 0) {
        isChestTwoOpen++
        isChestTwoOpen = isChestTwoOpen%2
    }
    if(player.playerX >= 350 && player.playerX <= 500 && backgroundChoice == 1) {
        isChestThreeOpen++
        isChestThreeOpen = isChestThreeOpen%2
    }
    if(player.playerX >= 875 && player.playerX <= 1000 && backgroundChoice == 1) {
        enterHome();
    }
}

function render() {
    CTX.clearRect(0, 0, canvas.width, canvas.height)
    if(backgroundChoice == 2) {
        CTX.drawImage(home, 0, 0)
        return
    }
    
    renderBackground()
    renderText()
    renderInteract()
    CTX.drawImage(player.playerAvatar, player.playerX, player.playerY)
    renderChests()
}


restart.addEventListener("click", () => {
    
    backgroundChoice = 0
    player.playerX = 200
})