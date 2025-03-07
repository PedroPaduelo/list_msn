import React, { useEffect, useState } from 'react'

interface ChaveObject {
  chave: string
}

interface SidebarProps {
  onSelectKey: (key: string) => void
}

const Sidebar = ({ onSelectKey }: SidebarProps) => {
  const [keys, setKeys] = useState<ChaveObject[]>([])
  const [error, setError] = useState('')
  const [currentPage, setCurrentPage] = useState(0)
  const itemsPerPage = 10
  const [selectedKey, setSelectedKey] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const fetchKeys = async () => {
      try {
        const response = await fetch(
          'https://n8n-queue-2-n8n-webhook.mrt7ga.easypanel.host/webhook/f7eab7f8-a69a-4610-858b-840004cd274f',
        )
        if (!response.ok) {
          throw new Error(`Erro na requisição: ${response.statusText}`)
        }
        const data = await response.json()

        if (!Array.isArray(data.list) || data.list.length === 0) {
          throw new Error('Dados inválidos retornados pela API.')
        }
        setKeys(data.list)
      } catch (err: any) {
        setError(err.message || 'Erro desconhecido.')
      }
    }
    fetchKeys()
  }, [])

  const filteredKeys = keys.filter((key) =>
    key.chave.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const totalPages = Math.ceil(filteredKeys.length / itemsPerPage)
  const displayedKeys = filteredKeys.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage,
  )

  const handleSelect = (chave: string) => {
    onSelectKey(chave)
    setSelectedKey(chave)
  }

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value)
    setCurrentPage(0)
  }

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold mb-4">Lista de Chaves</h2>
      <input
        type="text"
        placeholder="Buscar chave"
        className="w-full p-2 mb-4 border rounded"
        value={searchTerm}
        onChange={handleSearch}
      />
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <ul className="space-y-2">
        {displayedKeys.map((item, index) => (
          <li
            key={index}
            className={`p-2 rounded cursor-pointer hover:bg-gray-200 ${
              selectedKey === item.chave ? 'bg-blue-200' : 'bg-gray-100'
            }`}
            onClick={() => handleSelect(item.chave)}
          >
            {item.chave}
          </li>
        ))}
      </ul>
      <div className="flex justify-between mt-4">
        <button
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 0}
          className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded disabled:opacity-50"
        >
          Anterior
        </button>
        <button
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage >= totalPages - 1}
          className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded disabled:opacity-50"
        >
          Próxima
        </button>
      </div>
    </div>
  )
}

export default Sidebar