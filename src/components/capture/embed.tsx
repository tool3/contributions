import React, { useState } from 'react'

import styles from './embed.module.scss'

export default function EmbedPopup({ onClose, opened, username }) {
  const [copyText, setCopyText] = useState('Copy')
  const [params, setParams] = useState({
    menu: true,
    username: username || ''
  })

  const baseUrl = 'https://g3c.vercel.app'
  const queryParams = new URLSearchParams()
  Object.keys(params).forEach((param) => {
    queryParams.set(param, params[param])
  })

  const embedUrl = queryParams.toString()
    ? `${baseUrl}?${queryParams}`
    : baseUrl
  const embedCode = `<iframe src="${embedUrl}" width="600" height="400" frameborder="0"></iframe>`

  const handleCopy = () => {
    navigator.clipboard.writeText(embedCode)
    setCopyText('✔')
    setTimeout(() => setCopyText('Copy'), 1000)
  }

  const handleCheckboxChange = (e) => {
    setParams((prev) => ({ ...prev, [e.target.name]: e.target.checked }))
  }

  const handleInputChange = (e) => {
    setParams({ username: e.target.value } as any)
  }

  return opened ? (
    <div className={styles.overlay}>
      <div className={styles.popup}>
        {/* Query Parameter Options */}
        <div className={styles.options}>
          <label>
            Show Menu
            <input
              type="checkbox"
              name="menu"
              checked={params.menu}
              onChange={handleCheckboxChange}
            />
          </label>
          <label>
            Username
            <input
              type="text"
              name="autoplay"
              value={params.username}
              onChange={handleInputChange}
            />
          </label>
        </div>

        <textarea readOnly value={embedCode} className={styles.textarea} />
        <div className={styles.buttons}>
          <button onClick={handleCopy} className={styles.copyButton}>
            {copyText}
          </button>
          <button onClick={onClose} className={styles.closeButton}>
            Close
          </button>
        </div>
        <div className={styles.footer}>
          <a
            href="https://github.com/tool3/contributions#customization"
            target="_blank"
            rel="noopener"
          >
            see all customizations options
          </a>
        </div>
      </div>
    </div>
  ) : null
}
