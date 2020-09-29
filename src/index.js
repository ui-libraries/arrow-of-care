import Phaser from "phaser"
import logoImg from "./assets/rocket.png"
import startButtonImg from "./assets/start-button.png"
import leaderboardButtonImg from "./assets/leaderboard-button.png"

const screenWidth = window.innerWidth
const screenHeight = window.innerHeight

const config = {
  type: Phaser.AUTO,
  parent: "phaser-example",
  width: screenWidth,
  height: screenHeight,
  scene: {
    preload: preload,
    create: create
  }
}

const game = new Phaser.Game(config)

function preload() {
  this.load.image("logo", logoImg)
  this.load.image("start-button", startButtonImg)
  this.load.image("leaderboard-button", leaderboardButtonImg)
}

function create() {
  
  const logo = this.add.image(screenWidth/2, screenHeight/2 - 50, "logo").setScale(0.2)
  console.log(screenHeight/2, logo)
  const startButton = this.add.image(logo.x - 30, logo.y + (logo.displayHeight/2 + 40), "start-button").setScale(0.2)
  const leaderboardButton = this.add.image(logo.x - 30, startButton.y + (startButton.displayHeight/2 + 10), "leaderboard-button").setScale(0.2)

}
