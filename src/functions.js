import { Cards } from './cards'
import { GameStates, rocketsNeededToWin } from './states'

/**
 * Get a random card object based on index of GameStates.
 * @memberof Functions
 * @param {number} index - number corresponding to GameState array
 * @return {object} - card object
 */
export function getCard(index) {
    const state = GameStates[index]
    const list = Cards[state]
    if (list !== undefined) {
        const rand = Math.floor(Math.random() * Math.floor(list.length))
        //const rand = 1
        const card = Cards[state][rand]
        console.log(card)
        return card
    }
}

/**
 * Renders the card object to the screen and data
 * @memberof Functions
 * @param {object} scene - The current Phaser scene
 * @return {object} - card Text object
 */
export function renderCard(scene) {
    const currentCard = getCard(scene.gameStats.data.values.gameState)
    scene.gameStats.data.set("card", currentCard)
    let targets = currentCard.targets.toString()
    if (currentCard.targets.length == 0) { targets = "They" }
    let cardText, cardInstructions
    if (currentCard.type == "care") {
        cardInstructions = ` Select another character with a skill of ${currentCard.skill} to help ${targets}.`
    } else {
        cardInstructions = ` ${targets} receive ${currentCard.value}.`
    }
    cardText = scene.add.text(58, 275, currentCard.text + cardInstructions, {
        fontSize: 40,
        color: "red",
        backgroundColor: "white",
        wordWrap: {
            width: 650
        }
    })
    cardText.name = "card text"
    return cardText
}

/**
 * Add and return a character container with stats
 * @memberof Functions
 * @param {object} scene - object
 * @param {number} x  - coordinate of container
 * @param {number} y  - coordinate of container
 * @param {string} key  - name of image key from preload
 * @param {object} content - data object about character
 * @return {object} A container object of the character
 */
export function addCharacter(scene, x, y, key, content) {
    const character = scene.add.container()
    character.name = content.name
    const characterName = scene.add.text(x + 20, y + 15, content.name, {
        fontSize: 40,
        color: "white"
    })
    let characterHealth = scene.add.text(x + 60, y + 85, "Health: " + content.health, {
        fontSize: 20,
        color: "white",
        wordWrap: {
            width: 175
        }
    })
    characterHealth.name = "characterHealthText"
    const characterSkills = scene.add.text(x + 60, y + 115, "Skills: " + content.skills, {
        fontSize: 20,
        color: "white",
        wordWrap: {
            width: 175
        }
    })
    const bio = scene.add.text(x + 58, y + 75, "", {
        fontSize: 15,
        color: "white",
        wordWrap: {
            width: 175
        }
    })
    const background = scene.add.sprite(x, y, key).setOrigin(0, 0).setInteractive()
    character.setDataEnabled()
    character.setData(content)
    background.on('pointerdown', () => {
        toggleCharacterSelection(character, scene)
    }, this)
    character.add([background, characterName, characterHealth, characterSkills])
    return character
}

/**
 * Toggles the visual selection and is_selected in container data
 * @memberof Functions
 * @param {object} character - a character's container object
 * @param {object} scene - optional scene object to return array of selected characters
 * @return {array} An array of currently selected character containers
 */
export function toggleCharacterSelection(character, scene) {
    let selected = [], characterList
    let sprite = getCharacterBackground(character)

    if (character.data.values.is_selected == false) {
        character.data.set("is_selected", true)
        sprite.setAlpha(0.5)
    } else {
        character.data.set("is_selected", false)
        sprite.setAlpha(1)
    }
    if (scene !== undefined) {
        characterList = scene.characterList.children.entries
        characterList.forEach(member => {
            if (member.data.values.is_selected == true) {
                selected.push(member)
            }
        })
        return selected
    }
}

/**
 * Updates Character health in container data as well as text
 * @memberof Functions
 * @param {object} scene - A Phaser scene with characterList
 * @return {none}
 */
export function updateCharacterHealth(scene) {
    const characterList = scene.characterList.children.entries
    const currentCard = scene.gameStats.data.values.card
    const cardValue = currentCard.value
    let selectedCharacters = characterList.filter(character => character.data.values.is_selected)
    let newHealth
    characterList.forEach(character => {
        if (character.data.values.is_selected == true) {
            const characterHealth = character.data.values.health
            if (currentCard.type == "care") {
                newHealth = characterHealth + (cardValue / selectedCharacters.length)
            } else {
                newHealth = characterHealth + cardValue
            }
            character.data.set("health", newHealth)
            const children = character.list
            children.forEach(child => {
                if (child.name == "characterHealthText") {
                    child.setText("Health: " + newHealth)
                }
            })
        }
    })
    checkEndGame(scene)
}

export function checkEndGame(scene) {
    const characterList = scene.characterList.children.entries
    const rockets = scene.gameStats.data.values.rocket
    const score = scoring(scene)
    
    characterList.forEach(character => {
        if (character.data.values.health <= 0) {
            scene.scene.start('endGameScene', {"rockets": rockets, "score": score, "character": character })
        }

        if (scene.gameStats.data.values.rocket == rocketsNeededToWin) {
            scene.scene.start('endGameScene', {"rockets": rockets, "score": score, "character": character})
        }
    })
}

/**
 * Returns a character container based on name
 * @memberof Functions
 * @param {object} scene - A Phaser scene with characterList
 * @param {string} characterName - the character's name
 * @return {object} A container object of the character
 */
function getCharacterByName(scene, characterName) {
    const characterList = scene.characterList.children.entries
    
    let character = {}
    characterList.forEach(member => {
        if (member.name == characterName) {
            character = member
        }
    })
    return character
}

/**
 * Checks if character has a skill
 * @memberof Functions
 * @param {object} character - A character container
 * @param {string} skill - A skill text from a card
 * @return {boolean} Whether the character has the skill or not
 */
function checkSkills(character, skill) {
    const characterSkill = character.data.values.skills
    
    if (characterSkill.includes(skill)) {
        return true
    } else {
        return false
    }
}

/**
 * Checks if selections are valid based on charactes and current card
 * @memberof Functions
 * @param {object} scene - A Phaser scene with characterList
 * @return {boolean} Whether the selections are valid based on card
 */
export function validateTargets(scene) {
    const characterList = scene.characterList.children.entries
    const currentCard = scene.gameStats.data.values.card
    const targets = currentCard.targets
    const skill = currentCard.skill
    let validCharacters = characterList.filter(character => checkSkills(character, skill))
    let selectedCharacters = characterList.filter(character => character.data.values.is_selected)
    targets.forEach(target => {
        validCharacters.push(getCharacterByName(scene, target))
    })
    let invalidCharacters = selectedCharacters.filter(el => validCharacters.indexOf(el) < 0)
    //checks if there are invalid characters or if the number selected is too high
    if (invalidCharacters.length > 0 || selectedCharacters.length > currentCard.numTargets) {
        return false
    } else {
        return true
    }
}

/**
 * Rolls a 6-sided die
 * @memberof Functions
 * @return {number} Number between 1 and 6
 */
function diceRoll() {
    return Math.floor(Math.random() * Math.floor(6)) + 1
}

/**
 * Completes the instructions on the drawn card
 * @memberof Functions
 * @param {object} scene - A Phaser scene with characterList
 * @return {none} Updates selection or health
 */
export function activateCard(scene) {
    const currentCard = scene.gameStats.data.values.card
    const targets = currentCard.targets
    if (currentCard.type == "care" && targets.length !== 0) {
        targets.forEach(characterName => {
            let character = getCharacterByName(scene, characterName)
            toggleCharacterSelection(character, scene)            
            let sprite = getCharacterBackground(character)
            sprite.disableInteractive()
        })
    } else if (currentCard.type !== "care" && targets.length !== 0) {
        targets.forEach(characterName => {
            let character = getCharacterByName(scene, characterName)
            toggleCharacterSelection(character, scene)            
            let sprite = getCharacterBackground(character)
            sprite.disableInteractive()
        })
    }
}

/**
 * Gets the character sprite
 * @memberof Functions
 * @param {object} character - A character container
 * @return {object} The character container's background sprite
 */
function getCharacterBackground(character) {
    const children = character.list
    let sprite
    children.forEach(child => {
        if (child.type == "Sprite") {
            sprite = child
        }
    })
    return sprite
}

/**
 * Resets character is_selected to false and restores interactivity
 * @memberof Functions
 * @param {object} scene - A Phaser scene with characterList
 * @return {none} modifies character 
 */
function resetCharacterSelection(scene) {
    const characterList = scene.characterList.children.entries
    characterList.forEach(character => {
        character.data.set("is_selected", false)
        let sprite = getCharacterBackground(character)
        sprite.setInteractive()
        sprite.setAlpha(1)
        
    })
}

/**
 * Takes a turn by rendering and activating a card
 * @memberof Functions
 * @param {object} scene - A Phaser scene with characterList
 * @return {object} The updated gameStats
 */
export function takeTurn(scene) {
    resetCharacterSelection(scene)
    const sceneChildren = scene.children.list
    sceneChildren.forEach(child => {
        if (child.name == "card text") {
            child.destroy()
        }
    })
    const roll = diceRoll()
    //const roll = 1
    const gameState = scene.gameStats.data.values.gameState
    let newIndex = roll + gameState
    let rocket = scene.gameStats.data.values.rocket
    if (newIndex > GameStates.length - 1) {
        rocket++
        newIndex = newIndex - (GameStates.length)
    }
    const val = {"rocket": rocket,"gameState":newIndex}
    scene.gameStats.data.set(val)
    renderCard(scene)
    activateCard(scene)

    return val
}

export function scoring(scene) {
    const characterList = scene.characterList.children.entries
    let score = 0
    characterList.forEach(character => {
        score = score + character.data.values.health     
    })
    return score
}