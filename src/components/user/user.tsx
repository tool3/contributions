import { useState } from 'react'

import s from './user.module.scss'

export default function User({ handleSubmit, loading, username, setUsername }) {
  const [isShrunk, setIsShrunk] = useState(false)

  const toggleForm = () => {
    setIsShrunk((prevState) => !prevState)
  }

  return (
    <>
      <button className={s.toggleButton} onClick={toggleForm}>
        {isShrunk ? '✕' : '☰'}
      </button>
      <div className={`${s.user} ${isShrunk ? s.shrunk : ''}`}>
        <h1>Github Contribution Visualization</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={username}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setUsername(e.target.value)
            }
            placeholder="Enter GitHub username"
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Loading...' : 'Visualize'}
          </button>
        </form>
      </div>
    </>
  )
}
