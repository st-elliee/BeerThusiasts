import { getSwingBlockVelocity } from './utils'
import * as constant from './constant'

export const hookAction = (instance, engine, time) => {
  const ropeHeight = engine.getVariable(constant.ropeHeight)
  if (!instance.ready) {
    instance.x = engine.width / 2
    instance.y = ropeHeight * -1.5
    instance.ready = true
  }
  engine.getTimeMovement(
    constant.hookUpMovement,
    [[instance.y, instance.y - ropeHeight]],
    (value) => {
      instance.y = value
    },
    {
      after: () => {
        instance.y = ropeHeight * -1.5
      }
    }
  )
  engine.getTimeMovement(
    constant.hookDownMovement,
    [[instance.y, instance.y + ropeHeight]],
    (value) => {
      instance.y = value
    },
    {
      name: 'hook'
    }
  )
  const initialAngle = engine.getVariable(constant.initialAngle)
  instance.angle = initialAngle *
    getSwingBlockVelocity(engine, time)
  instance.weightX = instance.x +
    (Math.sin(instance.angle) * ropeHeight)
  instance.weightY = instance.y +
    (Math.cos(instance.angle) * ropeHeight)
}

export const hookPainter = (instance, engine) => {
  const { ctx } = engine
  const ropeHeight = engine.getVariable(constant.ropeHeight)
  const ropeWidth = ropeHeight * 0.1
  ctx.save()
  ctx.translate(instance.x, instance.y)
  ctx.rotate((Math.PI * 2) - instance.angle)
  ctx.translate(-instance.x, -instance.y)
  // Draw rope as line
  ctx.strokeStyle = '#654321'
  ctx.lineWidth = ropeWidth
  ctx.beginPath()
  ctx.moveTo(instance.x, instance.y)
  ctx.lineTo(instance.x, instance.y + ropeHeight)
  ctx.stroke()
  // Draw hook as arc
  ctx.beginPath()
  ctx.arc(instance.x, instance.y + ropeHeight, ropeWidth, 0, Math.PI)
  ctx.stroke()
  ctx.restore()
}