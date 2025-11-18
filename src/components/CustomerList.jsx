import { useEffect, useState } from 'react'
import { Plus, DollarSign, Fuel } from 'lucide-react'

const GRADES = [
  { key: 'g91', label: 'G91', price: 2.18 },
  { key: 'g95', label: 'G95', price: 2.33 },
  { key: 'diesel', label: 'Diesel', price: 1.66 },
]

export default function CustomerList() {
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [selected, setSelected] = useState(null)
  const [credit, setCredit] = useState('')
  const [liters, setLiters] = useState('')
  const [grade, setGrade] = useState('g91')

  const load = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${baseUrl}/customers`)
      const data = await res.json()
      setCustomers(data)
    } catch (e) {
      setError('Failed to load customers')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const addCredit = async (customerId) => {
    if (!credit) return
    const amount = parseFloat(credit)
    if (amount <= 0) return
    await fetch(`${baseUrl}/customers/credit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ customer_id: customerId, amount })
    })
    setCredit('')
    load()
  }

  const dispense = async (customerId) => {
    const l = parseFloat(liters)
    if (!l || l <= 0) return
    await fetch(`${baseUrl}/dispense`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ customer_id: customerId, grade, liters: l })
    })
    setLiters('')
    load()
  }

  if (loading) return <div className="text-blue-200">Loading customers...</div>
  if (error) return <div className="text-red-300">{error}</div>

  return (
    <div className="space-y-4">
      {customers.length === 0 && (
        <div className="text-blue-200/80">No customers yet. Add one above.</div>
      )}
      <ul className="space-y-3">
        {customers.map(c => (
          <li key={c.id} className={`p-4 rounded-xl border ${selected===c.id ? 'border-blue-400/50 bg-slate-800/60' : 'border-blue-500/20 bg-slate-800/40'}`}>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-white font-semibold">{c.name} <span className="text-xs text-blue-300/70">#{c.code}</span></div>
                <div className="text-blue-200/80 text-sm">Balance: {c.balance?.toFixed ? c.balance.toFixed(2) : c.balance} </div>
              </div>
              <button onClick={() => setSelected(selected===c.id?null:c.id)} className="text-blue-300 hover:text-white">{selected===c.id ? 'Hide' : 'Manage'}</button>
            </div>

            {selected===c.id && (
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-900/40 p-3 rounded-lg border border-slate-700/60">
                  <div className="flex items-center gap-2 text-white mb-2"><DollarSign className="w-4 h-4"/> Add Credit</div>
                  <div className="flex gap-2">
                    <input type="number" step="0.01" min="0" className="flex-1 px-3 py-2 rounded bg-slate-900/60 text-white border border-slate-700" placeholder="Amount" value={credit} onChange={e=>setCredit(e.target.value)} />
                    <button onClick={() => addCredit(c.id)} className="px-3 py-2 rounded bg-emerald-600 hover:bg-emerald-500 text-white">Add</button>
                  </div>
                </div>

                <div className="bg-slate-900/40 p-3 rounded-lg border border-slate-700/60">
                  <div className="flex items-center gap-2 text-white mb-2"><Fuel className="w-4 h-4"/> Dispense</div>
                  <div className="grid grid-cols-3 gap-2 mb-2">
                    {GRADES.map(g => (
                      <button key={g.key} onClick={() => setGrade(g.key)} className={`px-3 py-2 rounded border ${grade===g.key?'border-blue-400 bg-slate-800 text-white':'border-slate-700 text-blue-200'}`}>
                        <div className="text-sm font-semibold">{g.label}</div>
                        <div className="text-xs">{g.price.toFixed(2)}</div>
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input type="number" step="0.01" min="0" className="flex-1 px-3 py-2 rounded bg-slate-900/60 text-white border border-slate-700" placeholder="Liters" value={liters} onChange={e=>setLiters(e.target.value)} />
                    <button onClick={() => dispense(c.id)} className="px-3 py-2 rounded bg-blue-600 hover:bg-blue-500 text-white">Go</button>
                  </div>
                  {liters && (
                    <div className="text-blue-300/80 text-sm mt-2">
                      Total: {(() => {
                        const g = GRADES.find(x=>x.key===grade)
                        const l = parseFloat(liters)
                        if (!g || !l) return '0.00'
                        return (g.price * l).toFixed(2)
                      })()} 
                    </div>
                  )}
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
