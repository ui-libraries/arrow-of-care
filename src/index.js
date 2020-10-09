import Phaser from "phaser"
import logoImg from "./assets/rocket.png"
import startButtonImg from "./assets/start-button.png"
import leaderboardButtonImg from "./assets/leaderboard-button.png"
import gameboardImg from "./assets/background.jpg"
import characterCardImg from "./assets/character-card.png"
import {cards} from "./cards.js"


const screenWidth = 1920  
const screenHeight = 1080
const gameStates = ["start","care","care","care","bonus","catastrophe","care","care","crevasse","care","care","care","care","bonus","care","catastrophe"]


function addCard(scene, x, y, key, content) {
  const container = scene.add.container()
  const cardName = scene.add.text(x+20,y+15,content.name,{fontSize:40, color: "white"})
  const bio = scene.add.text(x+58,y+75, "", {fontSize:15, color: "white", wordWrap: {width: 175}})
  const sprite = scene.add.sprite(x,y, key).setOrigin(0,0).setInteractive()
  container.setDataEnabled()
  container.data.set('health', content.health)
  sprite.on('pointerdown', () => {
    console.log(container.data.values.health)
  }, this)
  container.add([sprite, cardName])
  return container
}

function diceRoll() {
  return Math.floor(Math.random() * Math.floor(6)) + 1
}

function takeTurn(currentGame) {
  const roll = diceRoll()
  const gameState = currentGame.data.values.gameState
  let newIndex = roll + gameState
  if (newIndex > 15) {
    let rocket = currentGame.data.values.rocket
    rocket = rocket + 1
    currentGame.data.set("rocket", rocket)
    newIndex = newIndex - 16
    currentGame.data.set("gameState", newIndex)
  }
  return newIndex
}

class UIScene extends Phaser.Scene {
  constructor () {
    super({ key: 'UIScene' });
  }

  preload () {
    this.load.image("logo", logoImg)
    this.load.image("start-button", startButtonImg)
    this.load.image("leaderboard-button", leaderboardButtonImg)
  }

  create () {
    const logo = this.add.image(screenWidth/2, screenHeight/2 - 50, "logo").setScale(.20)
    const startButton = this.add.sprite(logo.x - 30, logo.y + (logo.displayHeight/2 + 40), "start-button").setScale(0.2).setInteractive()
    const leaderboardButton = this.add.sprite(logo.x - 30, startButton.y + (startButton.displayHeight/2 + 10), "leaderboard-button").setScale(0.2).setInteractive()
    startButton.on('pointerdown', () => {
      this.scene.start('mainScene')
    }, this)
  }
}

class mainScene extends Phaser.Scene {
  constructor () {
    super({ key: 'mainScene' })
  }

  preload () {
    this.load.image("gameboard", gameboardImg)
    this.load.image("characterCard", characterCardImg)
  }

  create () {    
    let currentGame = this.add.container()
    currentGame.setDataEnabled()
    currentGame.setData({"rocket":0,"gameState":14})
    const gameboard = this.add.image(960,540, "gameboard")
    const blaise = addCard(this, 0, 717, "characterCard",{"name":"Blaise","health":10,"skills": "ELH","age":38,"role":"Engineer"})
    const robert = addCard(this, 240, 717, "characterCard",{"name":"Robert","health":10,"skills": "ELH","age":26,"role":"Cook"})
    const rosario = addCard(this, 480, 717, "characterCard",{"name":"Rosario","health":10,"skills": "ELH","age":44,"role":"Captain"})
    const baby = addCard(this, 720, 717, "characterCard",{"name":"Dr. Baby","health":7,"skills": "","age":1,"role":"Physician"})
    const keara = addCard(this, 960, 717, "characterCard",{"name":"Keara","health":8,"skills": "E","age":88,"role":"Former Chief Engineer"})
    const maya = addCard(this, 1200, 717, "characterCard",{"name":"Maya","health":9,"skills": "EL","age":47,"role":"Passenger"})
    const tammy = addCard(this, 1440, 717, "characterCard",{"name":"Tammy","health":9,"skills": "EL","age":35,"role":"Veteran"})
    const Yusef = addCard(this, 1680, 717, "characterCard",{"name":"Yusef","health":9,"skills": "EL","age":5,"role":"Scientist"})
  }
}

const config = {
  width: 1920,
  height: 1080,
  scene: [mainScene]
}

const game = new Phaser.Game(config)