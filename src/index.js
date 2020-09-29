import Phaser from "phaser"
import logoImg from "./assets/rocket.png"
import startButtonImg from "./assets/start-button.png"
import leaderboardButtonImg from "./assets/leaderboard-button.png"
import gameboardImg from "./assets/background.jpg"

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
    const startButton = this.add.image(logo.x - 30, logo.y + (logo.displayHeight/2 + 40), "start-button").setScale(0.2)
    const leaderboardButton = this.add.image(logo.x - 30, startButton.y + (startButton.displayHeight/2 + 10), "leaderboard-button").setScale(0.2)
    this.input.once('pointerdown', function () {
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
  }

  create () {
    const gameboard = this.add.image(screenWidth/2, screenHeight/2, "gameboard").setScale(1.1)
  }
}

const config = {
  type: Phaser.AUTO,
  width: screenWidth,
  height: screenHeight,
  scene: [UIScene, mainScene]
}

const game = new Phaser.Game(config)