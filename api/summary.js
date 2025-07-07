import axios from 'axios'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const { query } = req.body

  try {
    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: 'gpt-4',
      messages: [
        { role: 'system', content: 'You are a helpful search summarizer.' },
        { role: 'user', content: `Summarize the key information about: ${query}` }
      ]
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      }
    })

    const summary = response.data.choices[0].message.content
    res.status(200).json({ summary })
  } catch (error) {
    console.error('GPT API Error:', error)
    res.status(500).json({ summary: 'Failed to fetch AI summary.' })
  }
}
