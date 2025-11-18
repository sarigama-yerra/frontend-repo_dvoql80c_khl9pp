import { useState } from 'react'

export default function CustomerForm({ onCreated }) {
  const [name, setName] = useState('')
  const [code, setCode] = useState('')
  const [initial, setInitial] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch(`${baseUrl}/customers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          code,
          initial_credit: parseFloat(initial || '0')
        })
      })
      if (!res.ok) throw new Error((await res.json()).detail || 'Failed to create')
      const data = await res.json()
      onCreated?.(data)
      setName('')
      setCode('')
      setInitial('')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-slate-800/50 border border-blue-500/20 rounded-xl p-4 space-y-3">
      <h3 className="text-white font-semibold">Add Customer</h3>
      {error && <div className="text-red-300 text-sm">{error}</div>}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <input className="px-3 py-2 rounded bg-slate-900/60 text-white border border-slate-700" placeholder="Name" value={name} onChange={e=>setName(e.target.value)} required />
        <input className="px-3 py-2 rounded bg-slate-900/60 text-white border border-slate-700" placeholder="Code/ID" value={code} onChange={e=>setCode(e.target.value)} required />
        <input className="px-3 py-2 rounded bg-slate-900/60 text-white border border-slate-700" type="number" min="0" step="0.01" placeholder="Initial credit" value={initial} onChange={e=>setInitial(e.target.value)} />
      </div>
      <button disabled={loading} className="w-full sm:w-auto px-4 py-2 rounded bg-blue-600 hover:bg-blue-500 text-white disabled:opacity-60">{loading ? 'Creating...' : 'Create'}</button>
    </form>
  )
}
