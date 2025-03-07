import React, { useState } from 'react'
import MessageHistory from './components/MessageHistory'
import { Loader2 } from 'lucide-react'

interface Message {
  id?: string
  origin: 'human' | 'ai'
  content: string
  timestamp: string
}

const App = () => {
  const [chave, setChave] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const fetchMessages = async () => {
    if (!chave.trim()) {
      setError('Por favor, insira uma chave de acesso.')
      return
    }
    setError('')
    setLoading(true)
    try {
      const url = 'https://n8n-queue-2-n8n-webhook.mrt7ga.easypanel.host/webhook/get'
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ chave })
      })

      if (!response.ok) {
        throw new Error(`Erro na requisição: ${response.statusText}`)
      }

      const data = await response.json()
			console.log(data)
			
      if (!Array.isArray(data.returno)) {
        throw new Error('Dados inválidos retornados pela API.')
      }

      // Transformando cada mensagem do novo retorno da API
      const transformedMessages = data.returno.map((msg: any) => ({
        type: msg.type,
        content: msg.content,
        timestamp: new Date().toISOString()
      }))

      setMessages(transformedMessages)
    } catch (err: any) {
      setError(err.message || 'Erro desconhecido.')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-4">
      <header className="w-full max-w-3xl mb-6">
        <div className="flex items-center justify-between bg-white p-4 rounded-md shadow">
          <div className="flex items-center gap-2">
            <img
              className="w-10 h-10 rounded-full"
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"
              alt="Logo"
            />
            <h1 className="text-xl font-bold">Histórico de Mensagens</h1>
          </div>
        </div>
      </header>
      <main className="w-full max-w-3xl bg-white p-6 rounded-md shadow">
        <div className="mb-4">
          <label htmlFor="chave" className="block text-sm font-medium text-gray-700">
            Chave de acesso
          </label>
          <input
            id="chave"
            type="text"
            value={chave}
            onChange={(e) => setChave(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Insira sua chave"
          />
        </div>
        <button
          onClick={fetchMessages}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md flex items-center justify-center"
        >
          {loading && <Loader2 className="animate-spin mr-2" />} Buscar Histórico
        </button>
        {error && <p className="mt-4 text-red-500">{error}</p>}
        <section className="mt-6">
          <MessageHistory messages={messages} />
        </section>
      </main>
      <footer className="mt-8 text-sm text-gray-500">
        © {new Date().getFullYear()} Minha Aplicação
      </footer>
    </div>
  )
}

export default App
