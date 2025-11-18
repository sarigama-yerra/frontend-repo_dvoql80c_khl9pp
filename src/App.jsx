import Header from './components/Header'
import CustomerForm from './components/CustomerForm'
import CustomerList from './components/CustomerList'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.06),transparent_50%)]" />
      <div className="relative max-w-4xl mx-auto px-4 pb-16">
        <Header />

        <div className="grid gap-6">
          <CustomerForm onCreated={() => { /* no-op: list auto reloads on refresh */ }} />

          <div className="bg-slate-800/50 backdrop-blur-sm border border-blue-500/20 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white font-semibold text-lg">Customers</h2>
              <a href="/test" className="text-blue-300 hover:text-white text-sm">Check Backend</a>
            </div>
            <CustomerList />
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
