import { gsap } from 'gsap'

import type { DataAttribute } from '../debugger/visualizer/shared-types'
import { FromToOptions, TweenTarget } from '../types'

export function getTweenTarget({
  targetContainer,
  ref
}: {
  targetContainer: { target?: TweenTarget }
  ref: React.RefObject<HTMLElement>
}) {
  if (targetContainer.target) {
    if (
      targetContainer.target &&
      typeof targetContainer.target === 'object' &&
      'current' in targetContainer.target
    ) {
      return targetContainer.target.current
    } else {
      return targetContainer.target
    }
  } else if (ref) {
    return ref.current
  } else {
    return null
  }
}

export function buildDeclarativeTween({
  op,
  id,
  target,
  duration,
  paused,
  ...timelineAndPosition
}: {
  op: FromToOptions
  id: string
  target: TweenTarget
  duration: number
  paused?: boolean
} & (
  | { timeline?: never; position?: never }
  | { timeline: gsap.core.Timeline; position: number }
)) {
  const data: DataAttribute = {
    id,
    type: 'animation',
    rootId: timelineAndPosition.timeline?.data.id,
    isScrollytellingTween: true
  }

  if ('to' in op) {
    if (timelineAndPosition.timeline) {
      timelineAndPosition.timeline.to(
        target,
        {
          ...op.to,
          id,
          duration,
          paused,
          data
        },
        timelineAndPosition.position
      )
    } else {
      gsap.to(target, { ...op.to, id, duration, paused })
    }
  } else if ('from' in op) {
    if (timelineAndPosition.timeline) {
      timelineAndPosition.timeline.from(
        target,
        { ...op.from, id, duration, paused, data },
        timelineAndPosition.position
      )
    } else {
      gsap.from(target, { ...op.from, id, duration, paused })
    }
  } else if ('fromTo' in op) {
    if (timelineAndPosition.timeline) {
      timelineAndPosition.timeline.fromTo(
        target,
        { ...op.fromTo[0] },
        { ...op.fromTo[1], id, duration, paused, data },
        timelineAndPosition.position
      )
    } else {
      gsap.fromTo(
        target,
        { ...op.fromTo[0] },
        { ...op.fromTo[1], id, duration, paused }
      )
    }
  } else throw new Error('Invalid TweenOp')

  return () => {
    gsap.getById(id)?.revert()
  }
}

export const clsx = (...classes: any[]) => {
  return classes.filter(Boolean).join(' ')
}

export function getValidAt(at: number) {
  if (at < 0) {
    throw new Error('at must be a positive number')
  }

  if (at > 100) {
    throw new Error('at must be less than 100')
  }

  if (at === 0) {
    // gsap won't call "reverse" if the time is 0, so we change it slightly.
    return 0.000001
  }
  if (at === 100) {
    // same sitiuation with 100.
    return 99.999999
  }
  return at
}

export const isDev = process.env.NODE_ENV === 'development'

export function getControlsFromUniforms(uniforms, ref) {
  return Object.keys(uniforms).reduce((acc, key) => {
    const uniform = uniforms[key]
    const isColor = uniform.value?.isColor
    if (key !== 'uTime') {
      acc[key] = {
        value: isColor ? `#${uniform.value.getHexString()}` : uniform.value,
        min: uniform.min || 0,
        max: uniform.max || 10,
        onChange: (val: any) => {
          if (isColor) {
            ref.current.uniforms[key].value.set(val)
          } else {
            ref.current.uniforms[key].value = val
          }
        }
      }
    }

    return acc
  }, [])
}
