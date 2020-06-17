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

