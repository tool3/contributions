import { useDeviceDetect } from '~/ts/hooks/use-device-detect'

import s from './footer.module.scss'

export default function Footer() {
  const { isMobile, isMacOs } = useDeviceDetect()
  const altKey = isMacOs ? '⌥' : 'alt'

  const instructions = isMobile ? (
    '3 finger tap for controls'
  ) : (
    <>
      {altKey} + <kbd>d</kbd> for controls
    </>
  )

  const profileUrl = 'https://github.com/tool3'
  const repoUrl = 'https://github.com/tool3/contributions'
  return (
    <div className={s.footer}>
      <div className={s.instructions}>{instructions}</div>
      <div className={s.credits}>
        Made with{' '}
        <a href={repoUrl} target={'_blank'} rel="noopener">
          💚
        </a>{' '}
        by{' '}
        <a href={profileUrl} target="_blank" rel="noopener">
          tool3
        </a>
      </div>
    </div>
  )
}
