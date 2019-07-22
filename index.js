class Snake {
    constructor(canvas) {
        this.ctx = canvas.getContext('2d')
        this.step = 11
        this.head = [22, 0]
        this.body = [[22, 0], [11, 0], [0, 0]]
        this.hearts = [1, 1, 1]
        this.direction = 'ArrowRight'
        this.snakeHeadImg = document.getElementById('img_snake_head')
        this.snakeBodyImg = document.getElementById('img_snake_body')
        this.snakeHeartImg = document.getElementsByClassName('img_heart')
        this.drawHearts()
        this.goodMeelAudio = new Audio('sounds/good_meel.mp3')
        this.badMeelAudio = new Audio('sounds/bad_meel.mp3')
    }

    drawHearts() {
        [].forEach.call(this.snakeHeartImg, (el, index) => {
            if (this.hearts[index]) el.classList.add('visible')
            else el.classList.remove('visible')
        });
    }

    draw() {
        this.body.forEach((el, index) => {
            if (index == 0) {
                this.ctx.drawImage(this.snakeHeadImg, el[0] - 1, el[1] - 1, 12, 12)
            } else {
                this.ctx.drawImage(this.snakeBodyImg, el[0], el[1], 10, 10)
            }
        })
    }

    changeDirection(direction) {
        if (this.direction == 'ArrowUp' && direction == 'ArrowDown') return
        else if (this.direction == 'ArrowDown' && direction == 'ArrowUp') return
        else if (this.direction == 'ArrowRight' && direction == 'ArrowLeft') return
        else if (this.direction == 'ArrowLeft' && direction == 'ArrowRight') return
        else this.direction = direction
    }

    move() {
        if (this.direction == 'ArrowUp') {
            this.head[1] -= this.step
            if (this.head[1] <= -this.step) this.head[1] = 440 - this.step
        }
        else if (this.direction == 'ArrowDown') {
            this.head[1] += this.step
            if (this.head[1] >= 440) this.head[1] = 0
        }
        else if (this.direction == 'ArrowRight') {
            this.head[0] += this.step
            if (this.head[0] >= 440) this.head[0] = 0
        }
        else if (this.direction == 'ArrowLeft') {
            this.head[0] -= this.step
            if (this.head[0] <= -this.step) this.head[0] = 440 - this.step
        }
    }

    animate() {
        this.body.unshift(this.head.slice())
        this.body.pop()
    }

    eat(meel, game) {
        if (meel.meel[0] == this.head[0] && meel.meel[1] == this.head[1]) {
            if (meel instanceof Meel) {
                this.body.unshift(meel.meel.slice())
                meel.generateNewMeel()
                game.addScore()
                game.drawScore()
                game.chageSpeed()
                this.goodMeelAudio.volume = .99
                this.goodMeelAudio.play()
            } else if (meel instanceof Mushroom) {
                for (let i = 0; i < this.hearts.length; i++) {
                    if (this.hearts[i]) {
                        this.hearts[i] = 0
                        break
                    }
                }
                this.drawHearts()
                meel.generateNewMeel()
                this.badMeelAudio.play()
            }
        }
    }
}

class Field {
    constructor(canvas) {
        this.ctx = canvas.getContext('2d')
    }

    clear() {
        this.ctx.clearRect(0, 0, 440, 440)
    }
}


class Meel {
    constructor(canvas) {
        this.meel = []
        this.ctx = canvas.getContext('2d')
        this.generateNewMeel()
        this.appleImg = document.getElementById('img_apple')
    }

    draw() {
        this.ctx.drawImage(this.appleImg, this.meel[0] - 2, this.meel[1] - 2 , 14, 14)
    }

    generateNewMeel() {
        let allowCoordinates = []
        for (let i = 0; i < 440; i++) {
            if (i % 11 == 0) allowCoordinates.push(i)
        }
        this.meel[0] = allowCoordinates[Math.floor(Math.random() * allowCoordinates.length)]
        this.meel[1] = allowCoordinates[Math.floor(Math.random() * allowCoordinates.length)]
    }
}

class Mushroom {
    constructor(canvas) {
        this.meel = []
        this.ctx = canvas.getContext('2d')
        this.generateNewMeel()
        this.mushroomImg = document.getElementById('img_mushroom')
    }

    draw() {
        this.ctx.drawImage(this.mushroomImg, this.meel[0] - 2, this.meel[1] - 2, 14, 14)
    }

    generateNewMeel() {
        let allowCoordinates = []
        for (let i = 0; i < 440; i++) {
            if (i % 11 == 0) allowCoordinates.push(i)
        }
        this.meel[0] = allowCoordinates[Math.floor(Math.random() * allowCoordinates.length)]
        this.meel[1] = allowCoordinates[Math.floor(Math.random() * allowCoordinates.length)]
    }
}

class Game {
    constructor() {
        this.keyCodes = ["ArrowUp", "ArrowDown", "ArrowRight", "ArrowLeft", "Space"]
        this.speed = 5
        this.score = 0
        this.scorePlace = document.getElementById('score')
        this.canvas = document.getElementById('game')
        this.snake = new Snake(this.canvas)
        this.field = new Field(this.canvas)
        this.meel = new Meel(this.canvas)
        this.mushroom = new Mushroom(this.canvas)
        this.eventListener()
        this.loop = null
        this.pause = false
        this.isGameOver = false
    }

    addScore() {
        this.score += 1
    }

    chageSpeed() {
        this.speed += .5
        clearInterval(this.loop)
        this.run()
    }

    drawScore() {
        this.scorePlace.innerHTML = this.score
    }

    changeDirection(eventCode) {
        this.snake.changeDirection(eventCode)
    }

    gameOver() {
        this.isGameOver = true
        clearInterval(this.loop)
        const gameOver = document.getElementById('img_game_over')
        const ctx = this.canvas.getContext('2d')
        ctx.drawImage(gameOver, 100, 70, 240, 270)
    }

    chekeSnakeHeart() {
        if (this.snake.hearts.every(elem => !elem)) this.gameOver()
    }

    run() {
        if (!this.isGameOver) {
            this.loop = setInterval(() => {
                this.field.clear()
                this.meel.draw()
                this.mushroom.draw()
                this.snake.draw()
                this.snake.move()
                this.snake.animate()
                this.snake.eat(this.meel, this)
                this.snake.eat(this.mushroom, this)
                this.chekeSnakeHeart()
            }, 1000 / this.speed);
        }
    }

    pauseSwitcher() {
        this.pause = !this.pause
        if (this.pause) clearInterval(this.loop)
        else this.run()
    }

    keyboardHandle(self, event) {
        const eventCode = event.code
        if (self.keyCodes.includes(eventCode)) {
            if (eventCode == 'Space') {
                self.pauseSwitcher()
            }
            else {
                self.snake.changeDirection(event.code)
            }
        }

    }

    eventListener() {
        let self = this
        document.addEventListener('keydown', event => this.keyboardHandle(self, event), false)
    }
}

const game = new Game()
game.run()


