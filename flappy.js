function newElement(tagName,className)
{
    const element = document.createElement(tagName)
    element.className = className
    return element
}

function createBarrier(reverse = false)
{
    this.element = newElement('div','barrier')

    const border = newElement('div','border')
    const body = newElement('div','body')

    this.element.appendChild(reverse ? body: border)
    this.element.appendChild(reverse ? border: body)

    this.setHeight = height => body.style.height = `${height}px`
}

function PairOfBarriers(height,opening,x)
{
    this.element = newElement('div','pair-of-barriers')

    this.superior = new createBarrier(true)
    this.inferior = new createBarrier(false)

    this.element.appendChild(this.superior.element)
    this.element.appendChild(this.inferior.element)

    this.sortOpening = () =>
    {
        const superiorHeight = Math.random() * (height - opening)
        const inferiorHeight = height - opening - superiorHeight
        this.superior.setHeight(superiorHeight)
        this.inferior.setHeight(inferiorHeight)
    }

    this.getX = () => parseInt(this.element.style.left.split('px')[0])
    this.setX = x => this.element.style.left = `${x}px`
    this.getWidth = () => this.element.clientWidth

    this.sortOpening()
    this.setX(x)
}

function Barriers(height,width,opening,espace,notificationDot)
{
    this.pairs =
        [
            new PairOfBarriers(height,opening,width),
            new PairOfBarriers(height,opening,width + espace),
            new PairOfBarriers(height,opening,width + espace * 2),
            new PairOfBarriers(height,opening,width + espace * 3),
        ]

    const displacement = 3

    this.animation = () =>
    {
        this.pairs.forEach(par =>
        {
            par.setX(par.getX() - displacement)
            //When element go out screen
            if(par.getX() < -par.getWidth())
            {
                par.setX(par.getX() + espace * this.pairs.length)
                par.sortOpening()
            }

            const middle = width / 2
            const passMiddle = par.getX() + displacement >= middle
            &&par.getX()<middle
            // if(passMiddle) notificationDot()
            passMiddle && notificationDot()
        })
    }
}

function Bird(GameHeight)
{
    let flying = false
    this.element = newElement('img','bird')
    this.element.src = 'imgs/bird.png'

    this.getY = () => parseInt(this.element.style.bottom.split('px')[0])
    this.setY = y => this.element.style.bottom = `${y}px`

    window.onkeydown = e => flying = true
    window.onkeyup = e => flying = false

    this.animation = () =>
    {
        const newY = this.getY() + (flying ? 8:-5)
        const MaximumHeight = GameHeight - this.element.clientHeight

        if(newY <= 0 )
        {
            this.setY(0)
        }
        else if(newY >= MaximumHeight)
        {
            this.setY(MaximumHeight)
        }
        else
        {
            this.setY(newY)
        }
    }
    this.setY(GameHeight / 2)
}

// const barriers = new Barriers(700,1200,200,400)
// const bird = new Bird(700)
// const gameArea = document.querySelector('[flappy]')
//
// gameArea.appendChild(bird.element)
// barriers.pairs.forEach(par => gameArea.appendChild(par.element))
// setInterval(() =>
// {
//     barriers.animation()
//     bird.animation()
// },20)

function progress()
{
    this.element = newElement('span','progress')
    this.refreshScore = scores =>
    {
        this.element.innerHTML = scores
    }
    this.refreshScore(0)
}

function flappyGame()
{
    let scores = 0;

    const areaGame = document.querySelector('[flappy]')
    const height = areaGame.clientHeight
    const width = areaGame.clientWidth

    const Progress = new progress()
    const barriers = new Barriers(height,width,200,400,
        () => Progress.refreshScore(++scores))
    const bird = new Bird(height)

    areaGame.appendChild(Progress.element)
    areaGame.appendChild(bird.element)
    barriers.pairs.forEach(pair => areaGame.appendChild(pair.element))

    this.start = () =>
    {
        //Game Loop
        const temporizer = setInterval(() =>
        {
            barriers.animation()
            bird.animation()
        },20)
    }
}

new flappyGame().start()