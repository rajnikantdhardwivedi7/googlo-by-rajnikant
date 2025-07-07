import Head from 'next/head'
import { useState, useEffect } from 'react'
import axios from 'axios'

export default function Home() {
  const [isClient, setIsClient] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [summary, setSummary] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const handleSearch = async () => {
    if (!query) return
    setLoading(true)

    try {
      const bingResponse = await axios.get('https://api.bing.microsoft.com/v7.0/search', {
        params: { q: query, count: 10 },
        headers: { 'Ocp-Apim-Subscription-Key': process.env.NEXT_PUBLIC_BING_API_KEY }
      })

      const searchResults = bingResponse.data.webPages?.value.map(item => ({
        title: item.name,
        link: item.url,
        snippet: item.snippet
      })) || []

      setResults(searchResults)

      const gptResponse = await axios.post('/api/summary', { query })
      setSummary(gptResponse.data.summary)

    } catch (error) {
      console.error('Search Error:', error)
      setSummary('An error occurred while fetching results.')
      setResults([])
    }

    setLoading(false)
  }

  if (!isClient) return null

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center px-4 py-8">
      <Head>
        <title>Googlo by Rajnikant</title>
        <meta name="author" content="Rajnikant Dhar Dwivedi" />
      </Head>

      <h1 className="text-4xl font-bold mb-4">Googlo 🔍</h1>
      <p className="text-sm text-gray-400 mb-6">by Rajnikant Dhar Dwivedi</p>

      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search something..."
        className="w-full max-w-lg px-4 py-2 text-black rounded-md"
      />
      <button
        onClick={handleSearch}
        disabled={loading}
        className={\`mt-4 px-6 py-2 rounded-lg \${loading ? 'bg-gray-600 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}\`}
      >
        {loading ? 'Searching...' : 'Search'}
      </button>

      {summary && (
        <div className="mt-8 w-full max-w-3xl bg-gray-800 p-4 rounded">
          <h2 className="text-xl font-semibold">AI Summary</h2>
          <p className="text-gray-300 mt-2">{summary}</p>
        </div>
      )}

      <div className="mt-6 w-full max-w-3xl">
        {results.map((res, idx) => (
          <div key={idx} className="mb-4 border-b border-gray-700 pb-2">
            <a href={res.link} target="_blank" rel="noopener noreferrer" className="text-blue-400 text-lg hover:underline">{res.title}</a>
            <p className="text-gray-400 text-sm">{res.snippet}</p>
          </div>
        ))}
      </div>

      <footer className="mt-12 text-xs text-gray-500">
        © 2025 Rajnikant Dhar Dwivedi | All rights reserved
      </footer>
    </div>
  )
}
