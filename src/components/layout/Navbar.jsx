import { Link } from 'react-router-dom'

export default function Navbar() {
  return (
    <nav className="bg-white border-b border-purple-100 sticky top-0 z-30 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img src="/logo.svg" alt="Best in Class Education Center" className="h-10 w-auto" />
          <span className="font-extrabold text-purple-800 text-lg hidden sm:block">BIC Champions</span>
        </Link>
        <div className="flex gap-3">
          <Link to="/login" className="text-sm font-semibold text-purple-700 hover:text-purple-900 px-4 py-2 rounded-xl hover:bg-purple-50 transition-colors">
            Log In
          </Link>
          <Link to="/register" className="text-sm font-semibold bg-gradient-to-r from-purple-700 to-purple-500 text-white px-4 py-2 rounded-xl hover:from-purple-800 hover:to-purple-600 transition-all shadow-md shadow-purple-200">
            Join Now 🌟
          </Link>
        </div>
      </div>
    </nav>
  )
}
