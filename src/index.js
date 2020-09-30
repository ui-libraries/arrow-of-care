import Phaser from "phaser"
import logoImg from "./assets/rocket.png"
import startButtonImg from "./assets/start-button.png"
import leaderboardButtonImg from "./assets/leaderboard-button.png"
import gameboardImg from "./assets/background.jpg"
import characterCardImg from "./assets/character-card.png"

const screenWidth = window.innerWidth 
const screenHeight = window.innerHeight
const column = screenWidth/12
const row = screenHeight/12

console.log(window.devicePixelRatio/3)
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

class Character extends Phaser.GameObjects.Container {
  constructor(scene, x, y, key1, text) {
      super(scene)

      this.scene = scene
      this.x = x
      this.y = y

      const card = this.scene.add.image(x,y, key1)
      console.log(card)
      const cardText = this.scene.add.text((0 - card.width/4) + 40, (0 - card.height/4 + 60), text, {fontSize:120, color: "white"})

      this.add(card)
      this.add(cardText)

      this.scene.add.existing(this)
      this.setScale(0.25)
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
    const gameboard = this.add.image(screenWidth/2, screenHeight/2, "gameboard").setScale(.75)//need to stretch scale to screen width
    const card = new Character(this, screenWidth * .1, screenHeight * .6, "characterCard", "matthew")
  }
}

const config = {
  type: Phaser.AUTO,
  width: screenWidth,
  height: screenHeight,
  scene: [UIScene, mainScene]
}

const game = new Phaser.Game(config)