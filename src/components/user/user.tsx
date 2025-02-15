import s from './user.module.scss'

export default function User({ handleSubmit, loading, username, setUsername }) {
  return (
    <div className={s.user}>
      <h1>GitHub Contribution Visualization</h1>
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
  )
}
