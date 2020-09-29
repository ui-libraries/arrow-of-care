import Phaser from "phaser"
import logoImg from "./assets/rocket.png"
import startButtonImg from "./assets/start-button.png"
import leaderboardButtonImg from "./assets/leaderboard-button.png"
import gameboardImg from "./assets/background.jpg"
import characterCardImg from "./assets/character-card.png"

const screenWidth = window.innerWidth
const screenHeight = window.innerHeight

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
    const logo = this.add.image(screenWidth/2, screenHeight/2 - 50, "logo").setScale(0.2)
    const startButton = this.add.sprite(logo.x - 30, logo.y + (logo.displayHeight/2 + 40), "start-button").setScale(0.2).setInteractive()
    const leaderboardButton = this.add.sprite(logo.x - 30, startButton.y + (startButton.displayHeight/2 + 10), "leaderboard-button").setScale(0.2).setInteractive()
    startButton.on('pointerdown', () => {
      this.scene.start('mainScene')
    }, this)
  }
}

class Character {
  constructor (name, health) {
    this.name = name
    this.health = health   
  }
}

class mainScene extends Phaser.Scene {
  constructor () {
    super({ key: 'mainScene' })
  }

  preload () {
    this.load.image("gameboard", gameboardImg)
    this.load.image("characterCard", characterCardImg )
  }

  create () {
    const gameboard = this.add.image(screenWidth/2, screenHeight/2, "gameboard").setScale(1.1)
    const card1Data = new Character("matthew", 20)
    const card1Container = this.add.container(200, screenHeight - 200).setScale(0.25)
    
    console.log(card1Container.width)
    const card1Image = this.add.image(0,0, "characterCard")
    const card1ContainerWidth = card1Image.width * 0.25
    console.log(card1Image.width)
    const card1Text = this.add.text((0 - card1Image.width/2) + 40, (0 - card1Image.height/2 + 60), card1Data.name, {fontSize:120, color: "white"})
    card1Container.add(card1Image)
    card1Container.add(card1Text)
    
  }
}

const config = {
  type: Phaser.AUTO,
  width: screenWidth,
  height: screenHeight,
  scene: [UIScene, mainScene]
}

const game = new Phaser.Game(config)