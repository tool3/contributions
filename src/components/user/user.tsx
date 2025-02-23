/* eslint-disable react-hooks/exhaustive-deps */
import gsap from 'gsap'
import { useSearchParams } from 'next/navigation'
import { useLayoutEffect, useState } from 'react'

import CaptureSelect from '../capture/capture-select'
import Footer from '../footer/footer'
import YearSelector from '../year-select/year-select'
import s from './user.module.scss'

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
  const params = useSearchParams()
  const urlShowMenu = params.get('menu')
  const showMenu = urlShowMenu === undefined ? true : urlShowMenu === 'true'

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

  return showMenu ? (
    <>
      <button className={s.toggleButton} onClick={toggleForm}>
        {isShrunk ? '☰' : '✕'}
      </button>
      <div className={s.user}>
        <h1>Github 3D Contributions</h1>
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
              <button className={s.visualize} type="submit" disabled={loading}>
                {loading ? <div className={s.spinner} /> : 'Visualize'}
              </button>
            </form>
            <div className={s.selector}>
              <YearSelector year={year} setYear={setYear} />
              <CaptureSelect
                year={year}
                username={username}
                canvasRef={canvasRef}
              />
            </div>
          </div>
          <Footer />
        </div>
      </div>
    </>
  ) : null
}
