import Phaser from "phaser"
const logoImg = "../dist/assets/rocket.png"
const startButtonImg = "../dist/assets/start-button.png"
const rollButtonImg = "../dist/assets/roll-button.png"
const leaderboardButtonImg = "../dist/assets/leaderboard-button.png"
const gameboardImg = "../dist/assets/background.jpg"
const characterImg = "../dist/assets/character-card.png"
const assignButtonImg = "../dist/assets/assign-button.png"
const ignoreButtonImg = "../dist/assets/ignore-button.png"
const confirmButtonImg = "../dist/assets/confirm-button.png"
import {
    getCard,
    addCharacter,
    renderCard,
    takeTurn,
    validateTargets,
    activateCard,
    updateCharacterHealth
} from "./functions.js"

const screenWidth = 1920
const screenHeight = 1080

const UIScene = new Phaser.Scene('UIScene')
UIScene.preload = function() {
    this.load.image("logo", logoImg)
    this.load.image("start-button", startButtonImg)
    this.load.image("leaderboard-button", leaderboardButtonImg)
}
UIScene.create = function() {
    const logo = this.add.image(screenWidth / 2, screenHeight / 2 - 50, "logo").setScale(.20)
    const startButton = this.add.sprite(logo.x - 30, logo.y + (logo.displayHeight / 2 + 40), "start-button").setScale(0.2).setInteractive()
    const leaderboardButton = this.add.sprite(logo.x - 30, startButton.y + (startButton.displayHeight / 2 + 10), "leaderboard-button").setScale(0.2).setInteractive()
    startButton.on('pointerdown', () => {
        this.scene.start('mainScene')
    }, this)
}

export const mainScene = new Phaser.Scene('mainScene')
mainScene.preload = function() {
    this.load.image("gameboard", gameboardImg)
    this.load.image("character", characterImg)
    //this.load.image("roll-button", rollButtonImg)
    this.load.image("assign-button", assignButtonImg)
    this.load.image("ignore-button", ignoreButtonImg)
    this.load.image("confirm-button", confirmButtonImg)
}
mainScene.create = function(data) {
    this.gameStats = this.add.container()
    this.gameStats.setDataEnabled()
    this.gameStats.setData({
        "rocket": 0,
        "gameState": 0,
        "card": {}
    })

    const gameboard = this.add.image(960, 540, "gameboard")

    const rocketText = this.add.text(58, 75, "rocket pieces: " + this.gameStats.data.values.rocket, {
        fontSize: 40,
        color: "red",
        backgroundColor: "white",
        wordWrap: {
            width: 650
        }
    })   

    const progressText = this.add.text(58, 575, "stage completion: " + ((this.gameStats.data.values.gameState / 16 * 100) + "%"), {
        fontSize: 40,
        color: "red",
        backgroundColor: "white",
        wordWrap: {
            width: 650
        }
    })
    
    const blaise = addCharacter(this, 0, 717, "character", {
        "name": "blaise",
        "health": 10,
        "skills": "ELH",
        "age": 38,
        "role": "Engineer",
        "is_selected": false
    })
    const robert = addCharacter(this, 240, 717, "character", {
        "name": "robert",
        "health": 10,
        "skills": "ELH",
        "age": 26,
        "role": "Cook",
        "is_selected": false
    })
    const rosario = addCharacter(this, 480, 717, "character", {
        "name": "rosario",
        "health": 10,
        "skills": "ELH",
        "age": 44,
        "role": "Captain",
        "is_selected": false
    })
    const baby = addCharacter(this, 720, 717, "character", {
        "name": "baby",
        "health": 7,
        "skills": "",
        "age": 1,
        "role": "Physician",
        "is_selected": false
    })
    const keara = addCharacter(this, 960, 717, "character", {
        "name": "keara",
        "health": 8,
        "skills": "E",
        "age": 88,
        "role": "Former Chief Engineer",
        "is_selected": false
    })
    const maya = addCharacter(this, 1200, 717, "character", {
        "name": "maya",
        "health": 9,
        "skills": "EL",
        "age": 47,
        "role": "Passenger",
        "is_selected": false
    })
    const tammy = addCharacter(this, 1440, 717, "character", {
        "name": "tammy",
        "health": 9,
        "skills": "EL",
        "age": 35,
        "role": "Veteran",
        "is_selected": false
    })
    const yusef = addCharacter(this, 1680, 717, "character", {
        "name": "yusef",
        "health": 9,
        "skills": "EL",
        "age": 5,
        "role": "Scientist",
        "is_selected": false
    })

    this.characterList = this.add.group()
    this.characterList.addMultiple([blaise, robert, rosario, baby, keara, maya, tammy, yusef])
    const confirmButton = this.add.sprite(screenWidth/2, screenHeight/2, "confirm-button").setScale(0.2).setInteractive()
    confirmButton.on('pointerdown', () => {
        if (validateTargets(mainScene)) {
            updateCharacterHealth(mainScene)
            rocketText.setText("rocket pieces: " + this.gameStats.data.values.rocket)
            if (this.gameStats.data.values.rocket == 7) {
                console.log("YOU WIN!!!!")
                this.scene.start('winScene')
            }
            takeTurn(mainScene)
        } else {
            console.log("nope, doesn't work. invalide targets")
        }
        
    })
    takeTurn(this)
}

const winScene = new Phaser.Scene('winScene')

const config = {
    width: screenWidth,
    height: screenHeight,
    scene: [UIScene, mainScene, winScene]
}


export const game = new Phaser.Game(config)