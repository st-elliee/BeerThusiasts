// eslint-disable-next-line no-unused-vars
import { checkMoveDown, getMoveDownValue } from './utils'
import * as constant from './constant'

export const backgroundImg = (engine) => {
  // const bg = engine.getImg('background')
  // const bgWidth = bg.width
  // const bgHeight = bg.height
  const bgWidth = 800 // dummy
  const bgHeight = 600 // dummy
  const zoomedHeight = (bgHeight * engine.width) / bgWidth
  let offsetHeight = engine.getVariable(constant.bgImgOffset, engine.height - zoomedHeight)
  if (offsetHeight > engine.height) {
    return
  }
  engine.getTimeMovement(
    constant.moveDownMovement,
    [[offsetHeight, offsetHeight + (getMoveDownValue(engine, { pixelsPerFrame: s => s / 2 }))]],
    (value) => {
      offsetHeight = value
    },
    {
      name: 'background'
    }
  )
  engine.getTimeMovement(
    constant.bgInitMovement,
    [[offsetHeight, offsetHeight + (zoomedHeight / 4)]],
    (value) => {
      offsetHeight = value
    }
  )
  engine.setVariable(constant.bgImgOffset, offsetHeight)
  engine.setVariable(constant.lineInitialOffset, engine.height - (zoomedHeight * 0.394))
  // engine.ctx.drawImage(
  //   bg,
  //   0, offsetHeight,
  //   engine.width, zoomedHeight
  // )
}

const getLinearGradientColorRgb = (colorArr, colorIndex, proportion) => {
  const currentIndex = colorIndex + 1 >= colorArr.length ? colorArr.length - 1 : colorIndex
  const colorCurrent = colorArr[currentIndex]
  const nextIndex = currentIndex + 1 >= colorArr.length - 1 ? currentIndex : currentIndex + 1
  const colorNext = colorArr[nextIndex]
  const calRgbValue = (index) => {
    const current = colorCurrent[index]
    const next = colorNext[index]
    return Math.round(current + ((next - current) * proportion))
  }
  return `rgb(${calRgbValue(0)}, ${calRgbValue(1)}, ${calRgbValue(2)})`
}

export const backgroundLinearGradient = (engine) => {
  const colorArr = [
    [135, 206, 235],
    [135, 206, 235],
    [70, 130, 180],
    [0, 191, 255],
    [30, 144, 255],
    [0, 0, 139]
  ]
  const successCount = engine.getVariable(constant.successCount)
  const colorIndex = Math.floor(successCount / 5)
  const proportion = (successCount % 5) / 5
  const colorBase = getLinearGradientColorRgb(colorArr, colorIndex, proportion)
  const colorTop = getLinearGradientColorRgb(colorArr, colorIndex + 1, proportion)
  const grad = engine.ctx.createLinearGradient(0, 0, 0, engine.height)
  grad.addColorStop(0, colorTop)
  grad.addColorStop(1, colorBase)
  engine.ctx.fillStyle = grad
  engine.ctx.beginPath()
  engine.ctx.rect(0, 0, engine.width, engine.height)
  engine.ctx.fill()

  // lightning
  const lightning = () => {
    engine.ctx.fillStyle = 'rgba(255, 255, 255, 0.7)'
    engine.ctx.fillRect(0, 0, engine.width, engine.height)
  }
  engine.getTimeMovement(
    constant.lightningMovement, [], () => {},
    {
      before: lightning,
      after: lightning
    }
  )
}

export const background = (engine) => {
  backgroundLinearGradient(engine)
  backgroundImg(engine)
}