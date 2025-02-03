'use client'
import { useProgress } from '@react-three/drei'
import clsx from 'clsx'
import gsap from 'gsap'
import { useLayoutEffect } from 'react'

import s from './loader.module.scss'

function fillNumbers(array: string[]) {
  if (array.length === 1) {
    return ['0', '0', ...array]
  } else if (array.length === 2) {
    return ['0', ...array]
  } else {
    return array
  }
}

export default function Loader() {
  const { progress } = useProgress()

  useLayoutEffect(() => {
    if (progress === 100) {
      gsap.to(`.${s.letter}`, {
        color: 'rgb(81, 33, 12)',
        textShadow: 'none',
        ease: 'back',
        duration: 1,
        delay: 1
      })
      gsap.to(`.${s.loader}`, {
        opacity: 0,
        delay: 1.5
      })
      gsap.to(`.${s.loader}`, {
        display: 'none',
        delay: 2
      })
    }
  }, [progress])

  const letters = ['P', '0', 'L', 'y', 'C', 'L', 'O', 'C', 'K']
  const numbers = fillNumbers(progress.toFixed(0).split(''))

  const loadComponent = numbers.map((letter, i) => {
    return (
      <div key={i} className={s.letter}>
        {letter}
      </div>
    )
  })
  const lettersComponent = letters.map((letter, i) => {
    const fourteen = new Set(['O', 'C'])

    return (
      <div
        key={i}
        className={clsx(s.letter, fourteen.has(letter) ? s.fourteen : '')}
      >
        {letter}
      </div>
    )
  })

  return (
    <div className={s.loader}>
      <div className={s.title}>
        <span className={s.on}>{lettersComponent}</span>
        <span className={s.off}>{lettersComponent.map(() => '8')}</span>
      </div>
      <div className={s.numbers}>
        <span className={s.on}>{loadComponent}</span>
        <span className={s.off}>{loadComponent.map(() => '8')}</span>
      </div>
    </div>
  )
}
