import { Fuel } from 'lucide-react'

export default function Header() {
  return (
    <header className="py-8 text-center">
      <div className="inline-flex items-center gap-3 mb-3">
        <Fuel className="w-10 h-10 text-blue-400 drop-shadow" />
        <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">Fuel Credit Station</h1>
      </div>
      <p className="text-blue-200/80 text-sm sm:text-base">Create customers, add credit, and dispense fuel with live pricing</p>
    </header>
  )
}
