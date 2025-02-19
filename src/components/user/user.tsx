/* eslint-disable react-hooks/exhaustive-deps */
import gsap from 'gsap'
import { useLayoutEffect, useState } from 'react'

import Capture from '../capture/capture'
import YearSelector from '../year-select/year-select'
import s from './user.module.scss'
import Footer from '../footer/footer'

export default function User({
  handleSubmit,
  loading,
  username,
  setUsername,
  year,
  setYear,
  contributions,
  canvasRef
}) {
  const [isShrunk, setIsShrunk] = useState(false)

  const toggleForm = () => {
    setIsShrunk(!isShrunk)
  }

  const animationProps = {
    duration: 0.5,
    transformOrigin: 'top right',
    ease: 'back.inOut(3)'
  }

  useLayoutEffect(() => {
    if (contributions.length) {
      gsap.to(`.${s.user}`, {
        scale: 0,
        ...animationProps
      })
      setIsShrunk(!isShrunk)
    }
  }, [contributions])

  useLayoutEffect(() => {
    if (isShrunk) {
      gsap.to(`.${s.user}`, {
        opacity: 0,
        scale: 0,
        ...animationProps
      })
    } else {
      gsap.to(`.${s.user}`, {
        opacity: 1,
        scale: 1,
        ...animationProps
      })
    }
  }, [isShrunk])

  return (
    <>
      <button className={s.toggleButton} onClick={toggleForm}>
        {isShrunk ? '☰' : '✕'}
      </button>
      <div className={s.user}>
        <h1>Github Contribution Visualization</h1>
        <div className={s.wrapper}>
          <div className={s.content}>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                value={username}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setUsername(e.target.value)
                }}
                placeholder="Enter GitHub username"
                required
              />
              <button type="submit" disabled={loading}>
                {loading ? 'Loading...' : 'Visualize'}
              </button>
            </form>
            <div className={s.selector}>
              <YearSelector year={year} setYear={setYear} />
              <Capture canvasRef={canvasRef} />
            </div>
          </div>
          <Footer />
        </div>
      </div>
    </>
  )
}
