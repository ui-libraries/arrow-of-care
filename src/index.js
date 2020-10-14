import Phaser from "phaser"
import logoImg from "./assets/rocket.png"
import startButtonImg from "./assets/start-button.png"
import rollButtonImg from "./assets/roll-button.png"
import leaderboardButtonImg from "./assets/leaderboard-button.png"
import gameboardImg from "./assets/background.jpg"
import characterCardImg from "./assets/character-card.png"
import assignButtonImg from "./assets/assign-button.png"
import ignoreButtonImg from "./assets/ignore-button.png"
import confirmButtonImg from "./assets/confirm-button.png"
import {cards} from "./cards.js"


const screenWidth = 1920  
const screenHeight = 1080
const gameStates = ["start","care","care","care","bonus","catastrophe","care","care","crevasse","care","care","care","care","bonus","care","catastrophe"]


function addCard(scene, x, y, key, content) {
  const container = scene.add.container()
  container.name = content.name
  const cardName = scene.add.text(x+20,y+15,content.name,{fontSize:40, color: "white"})
  const bio = scene.add.text(x+58,y+75, "", {fontSize:15, color: "white", wordWrap: {width: 175}})
  const sprite = scene.add.sprite(x,y, key).setOrigin(0,0).setInteractive()
  container.setDataEnabled()
  container.setData(content)
  sprite.on('pointerdown', () => {
    console.log(container.data.values.health)
    if (container.data.values.is_selected == false) {
      container.data.set("is_selected", true)
      sprite.setAlpha(0.5)
    } else {
      container.data.set("is_selected", false)
      sprite.setAlpha(1)
    }
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
  let rocket = currentGame.data.values.rocket
  if (newIndex > 15) {
    rocket = rocket + 1
    newIndex = newIndex - 16
  }
  const val = {"rocket": rocket,"gameState":newIndex}
  return val
}

function getCard(index) {
  const state = gameStates[index]
  const list = cards[state]
  if (list !== undefined) {
    const rand = Math.floor(Math.random() * Math.floor(list.length))
    const card = cards[state][rand]
    return card
  }
}

function createOptions(scene) {
  const card = scene.children.list[0].data.list.card
  console.log(card.type)
  const assignButton = scene.add.sprite(screenWidth/2,screenHeight/2 + 100, "assign-button").setScale(0.1).setInteractive()
  const ignoreButton = scene.add.sprite(screenWidth/2,screenHeight/2 + 200, "ignore-button").setScale(0.1).setInteractive()
  ignoreButton.button = "decision"
  assignButton.button = "decision"
  assignButton.on('pointerdown', () => {
    assignCare(scene)
  }, this)
  ignoreButton.on('pointerdown', () => {
    ignoreCareCard(scene)
  }, this)

  if (card.type == "care") {
    console.log(card.skill)
  }
}

function ignoreCareCard(scene) {
  const card = scene.currentGame.data.values.card
  const targets = card.targets
  for (let i=0; i<targets.length; i++) {
    let character = getCharacterByName(scene, targets[i])
    const characterHealth = character.data.values.health
    const newHealth = characterHealth + card.value
    character.data.set("health", newHealth)
  }
}

function assignCare(scene) {
  const group = scene.characterList.children.entries
  const card = scene.currentGame.data.values.card
  const confirmButton = scene.add.sprite(screenWidth/2 + 200,screenHeight/2, "confirm-button").setScale(0.1).setInteractive()
  confirmButton.button = "decision"

  group.forEach(element => {
    element.data.set("is_selected", false)
  })
  
  confirmButton.on("pointerdown", () => {
    group.forEach(element => {
      if (element.data.values.is_selected == true && element.data.values.is_locked == false) {
        if (checkSkills(element, card.skill) == true) {
          const characterHealth = element.data.values.health
          let newHealth = characterHealth + (card.value/card.numTargets)
          element.data.set("health", newHealth)
          element.data.set("is_locked", true)
          console.log(element.name + " health is now set to " + newHealth)
          turnComplete(scene)
        } else {
          console.log(element.name + " does not have the required skill")
        }
      }
    })
  }, this)
}

function turnComplete(scene) {
  const group = scene.characterList.children.entries
  const card = scene.currentGame.data.values.card
  const children = scene.children.list
  let count = 0
  group.forEach(element => {
    if (element.data.values.is_locked == true) {
      count++
    }
  })
  if (count == card.numTargets) {
    children.forEach(element => {
      if(element.button == "decision") {
        element.setActive(false).setVisible(false)
        group.forEach(val => {
          let sprite = val.list[0]
          val.data.values.is_selected = false
          val.data.values.is_locked = false
          sprite.setAlpha(1)
        })
      }
    })
  }
}

function getCharacterByName(scene, characterName) {
  const list = scene.children.list
  let character = {}
  list.forEach(element => {
    if (element.name == characterName) {
      character = element
    }
  })
  return character
}

function checkSkills(character, skill) {
  const characterSkill = character.data.values.skills
  if (characterSkill.includes(skill)) {
    return true
  } else {
    return false
  }
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
    this.load.image("roll-button", rollButtonImg)
    this.load.image("assign-button", assignButtonImg)
    this.load.image("ignore-button", ignoreButtonImg)
    this.load.image("confirm-button", confirmButtonImg)
  }

  create () {
    this.currentGame = this.add.container()
    this.currentGame.setDataEnabled()
    this.currentGame.setData({"rocket":0,"gameState":0,"card": {"text": "Start"}})

    const gameboard = this.add.image(960,540, "gameboard")

    const rocketText = this.add.text(58,75, "rocket pieces: " + this.currentGame.data.values.rocket, {fontSize:40, color: "red", backgroundColor: "white", wordWrap: {width: 650}})
    const currentCard = getCard(this.currentGame.data.values.gameState)
    const cardText = this.add.text(58, 275, "card: " + currentCard.text, {fontSize:40, color: "red", backgroundColor: "white", wordWrap: {width: 650}})
    const progressText = this.add.text(58, 575, "stage completion: " + ((this.currentGame.data.values.gameState/16*100) + "%"),{fontSize:40, color: "red", backgroundColor: "white", wordWrap: {width: 650}})
    
    const rollButton = this.add.sprite(screenWidth/2,screenHeight/2, "roll-button").setScale(0.2).setInteractive()
    
    const blaise = addCard(this, 0, 717, "characterCard",{"name":"blaise","health":10,"skills": "ELH","age":38,"role":"Engineer","is_selected": false, "is_locked": false})
    const robert = addCard(this, 240, 717, "characterCard",{"name":"robert","health":10,"skills": "ELH","age":26,"role":"Cook","is_selected": false, "is_locked": false})
    const rosario = addCard(this, 480, 717, "characterCard",{"name":"rosario","health":10,"skills": "ELH","age":44,"role":"Captain","is_selected": false, "is_locked": false})
    const baby = addCard(this, 720, 717, "characterCard",{"name":"baby","health":7,"skills": "","age":1,"role":"Physician","is_selected": false, "is_locked": false})
    const keara = addCard(this, 960, 717, "characterCard",{"name":"keara","health":8,"skills": "E","age":88,"role":"Former Chief Engineer","is_selected": false, "is_locked": false})
    const maya = addCard(this, 1200, 717, "characterCard",{"name":"maya","health":9,"skills": "EL","age":47,"role":"Passenger","is_selected": false, "is_locked": false})
    const tammy = addCard(this, 1440, 717, "characterCard",{"name":"tammy","health":9,"skills": "EL","age":35,"role":"Veteran","is_selected": false, "is_locked": false})
    const yusef = addCard(this, 1680, 717, "characterCard",{"name":"yusef","health":9,"skills": "EL","age":5,"role":"Scientist","is_selected": false, "is_locked": false})
    this.characterList = this.add.group()
    this.characterList.addMultiple([blaise, robert, rosario, baby, keara, maya, tammy, yusef])
    console.log(this)
    
    rollButton.on('pointerdown', () => {
      const val = takeTurn(this.currentGame)
      this.currentGame.setData(val)
      rocketText.setText("rocket pieces: " + this.currentGame.data.values.rocket)
      const currentCard = getCard(this.currentGame.data.values.gameState)
      this.currentGame.data.set("card", currentCard)
      cardText.setText("card: " + currentCard.text)
      progressText.setText("stage completion: " + ((this.currentGame.data.values.gameState/16*100) + "%"))
      createOptions(this)
    }, this)
  }
}

const config = {
  width: screenWidth,
  height: screenHeight,
  scene: [mainScene]
}

const game = new Phaser.Game(config)