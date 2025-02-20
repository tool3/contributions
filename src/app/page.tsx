'use client'

import { useRef, useState } from 'react'

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
  const [year, setYear] = useState('default')
  const [lastQuery, setLastQuery] = useState('')
  const [error, setError] = useState<string | null>(null)
  const canvasRef = useRef() as React.MutableRefObject<HTMLCanvasElement>

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const isYear = year.toLowerCase() !== 'default'
      const yearQuery = isYear ? `&year=${year}` : ''
      const url = `/api/contributions?username=${username}${yearQuery}`
      if (url !== lastQuery) {
        const response = await fetch(url)

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(
            errorData.message || `HTTP error! status: ${response.status}`
          )
        }
        const data: Contribution[] = await response.json()
        setContributions(data)
        setLastQuery(url)
      }
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
    year,
    setYear,
    setUsername,
    contributions,
    canvasRef
  }

  return (
    <div>
      <User {...props} />
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      <ContributionChart
        canvasRef={canvasRef}
        year={year}
        username={username}
        contributions={contributions}
      />
    </div>
  )
}
