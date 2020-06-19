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

function progress()
{
    this.element = newElement('span','progress')
    this.refreshScore = scores =>
    {
        this.element.innerHTML = scores
    }
    this.refreshScore(0)
}

function overflow(ele1,ele2)
{
    const a = ele1.getBoundingClientRect()
    const b = ele2.getBoundingClientRect()

    const horizon = a.left + a.width >= b.left
    && b.left + b.width >= a.left
    const vertical = a.top + a.height >= b.top
    && b.top + b.height >= a.top
    return horizon && vertical
}

function crash(bird,barriers)
{
    let crash = false
    barriers.pairs.forEach(pairBarriers =>
    {
        if(!crash)
        {
            const superior = pairBarriers.superior.element
            const inferior = pairBarriers.inferior.element
            crash = overflow(bird.element,superior)
            || overflow(bird.element,inferior)
        }
    })
    return crash
}
function flappyGame()
{
    let scores = 0;

    const areaGame = document.querySelector('[flappy]')
    const height = areaGame.clientHeight
    const width = areaGame.clientWidth

    const owner = document.createElement('div')
    owner.innerHTML = 'Created By Victor Marques'
    owner.classList.add('owner')

    const Progress = new progress()
    const barriers = new Barriers(height,width,200,400,
        () => Progress.refreshScore(++scores))
    const bird = new Bird(height)

    areaGame.appendChild(Progress.element)
    areaGame.appendChild(bird.element)
    areaGame.appendChild(owner)
    barriers.pairs.forEach(pair => areaGame.appendChild(pair.element))

    this.start = () =>
    {
        //Game Loop
        const temporizer = setInterval(() =>
        {
            barriers.animation()
            bird.animation()

            if(crash(bird,barriers))
            {
                clearInterval(temporizer)
                const areaGame = document.querySelector('[flappy]')
                const end = document.createElement('div')
                end.classList.add('end')
                end.innerHTML = 'END GAME'
                areaGame.appendChild(end)
            }
        },20)
    }
}

new flappyGame().start()