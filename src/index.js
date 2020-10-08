import Phaser from "phaser"
import logoImg from "./assets/rocket.png"
import startButtonImg from "./assets/start-button.png"
import leaderboardButtonImg from "./assets/leaderboard-button.png"
import gameboardImg from "./assets/background.jpg"
import characterCardImg from "./assets/character-card.png"

const screenWidth = 1920  
const screenHeight = 1080

function addCard(scene, x, y, key, text) {
  const container = scene.add.container()
  const cardText = scene.add.text(x,y,text,{fontSize:40, color: "white"})
  const sprite = scene.add.sprite(x,y, key).setOrigin(0,0)
  container.add([sprite, cardText])
  return container
}

console.log(characterCardImg)
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
    const gameboard = this.add.image(960,540, "gameboard")
    const card = addCard(this, 0, 717, "characterCard","Ethan")
    const card2 = addCard(this, 240, 717, "characterCard","Matthew")
  }
}





const config = {
  width: 1920,
  height: 1080,
  scene: [UIScene, mainScene]
}

const game = new Phaser.Game(config)