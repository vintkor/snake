class Snake {
    constructor(canvas) {
        this.ctx = canvas.getContext('2d')
        this.step = 11
        this.head = [22, 0]
        this.body = [[22, 0], [11, 0], [0, 0]]
        this.direction = 'ArrowRight'
    }

    draw() {
        this.body.forEach(el => {
            this.ctx.fillStyle = "rgb(50,50,50)"
            this.ctx.fillRect(el[0], el[1], 10, 10)
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
            this.body.unshift(meel.meel.slice())
            meel.generateNewMeel()
            game.addScore()
            game.drawScore()
            game.chageSpeed()
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
    }

    draw() {
        this.ctx.fillStyle = "rgb(250,0,0)"
        this.ctx.fillRect(this.meel[0], this.meel[1], 10, 10)
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
        this.keyCodes = ["ArrowUp", "ArrowDown", "ArrowRight", "ArrowLeft"]
        this.speed = 5
        this.score = 0
        this.scorePlace = document.getElementById('score')
        this.canvas = document.getElementById('game')
        this.snake = new Snake(this.canvas)
        this.field = new Field(this.canvas)
        this.meel = new Meel(this.canvas)
        this.eventListener()
        this.loop = null
    }

    addScore() {
        this.score += 1
    }

    chageSpeed() {
        this.speed += 1
        clearInterval(this.loop)
        this.run()
    }

    drawScore() {
        this.scorePlace.innerHTML = this.score
    }

    changeDirection(eventCode) {
        this.snake.changeDirection(eventCode)
    }

    run() {
        this.loop = setInterval(() => {
            this.field.clear()
            this.meel.draw()
            this.snake.draw()
            this.snake.move()
            this.snake.animate()
            this.snake.eat(this.meel, this)
        }, 1000 / this.speed);
    }

    keyboardHandle(self, event) {
        if (self.keyCodes.includes(event.code))
            self.snake.changeDirection(event.code)
    }

    eventListener() {
        let self = this
        document.addEventListener('keydown', event => this.keyboardHandle(self, event), false)
    }
}

const game = new Game()
game.run()


