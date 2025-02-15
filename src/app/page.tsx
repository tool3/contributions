'use client'

import { useState } from 'react'

import User from '~/components/user/user'

import ContributionChart from '../components/chart/chart'

interface Contribution {
  date: string
  count: number
}

export default function Page() {
  const [contributions, setContributions] = useState<Contribution[]>([])
  const [username, setUsername] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/contributions?username=${username}`)
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        )
      }
      const data: Contribution[] = await response.json()
      setContributions(data)
    } catch (err: any) {
      setError(err.message)
      console.error('Error fetching contributions:', err)
    } finally {
      setLoading(false)
    }
  }

  const props = {
    handleSubmit,
    loading,
    username,
    setUsername
  }

  return (
    <div>
      <User {...props} />
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      <ContributionChart username={username} contributions={contributions} />
    </div>
  )
}
