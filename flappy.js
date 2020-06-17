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

    this.getX = () => parseInt(this.element.style.split('px')[0])
    this.setX = () => this.element.style.left = `${x}px`
    this.getWidth = () => this.element.clientWidth

    this.sortOpening()
    this.setX(x)
}
