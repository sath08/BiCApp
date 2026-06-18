import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const features = [
  { emoji: '📖', title: 'Daily Reading Log', desc: 'Track sessions, build streaks, earn points for every minute you read' },
  { emoji: '✍️', title: 'Essay Submission', desc: 'Submit book reviews and analyses for rubric-based teacher feedback' },
  { emoji: '🏆', title: 'Live Leaderboard', desc: 'Anonymous rankings — see how you stack up without anyone knowing your name' },
  { emoji: '🏅', title: 'Achievement Badges', desc: 'Unlock badges for streaks, milestones, and exceptional writing' },
  { emoji: '🎓', title: 'Expert Feedback', desc: 'Get detailed strengths and growth notes from dedicated teachers' },
  { emoji: '🔥', title: 'Reading Streaks', desc: 'Keep your streak alive daily — the longer the streak, the bigger the badge' },
]

const levels = [
  { emoji: '🌱', name: 'Story Explorer', pts: '25 pts', color: 'bg-emerald-100 text-emerald-700' },
  { emoji: '⚔️', name: 'Chapter Adventurer', pts: '75 pts', color: 'bg-blue-100 text-blue-700' },
  { emoji: '🚀', name: 'Book Voyager', pts: '150 pts', color: 'bg-indigo-100 text-indigo-700' },
  { emoji: '🧭', name: 'Novel Navigator', pts: '250 pts', color: 'bg-amber-100 text-amber-700' },
  { emoji: '🏆', name: 'Future Novelist', pts: '400 pts', color: 'bg-orange-100 text-orange-700' },
]

export default function Landing() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Nav */}
      <header className="bg-white border-b border-gray-200 h-14 flex items-center px-6">
        <div className="max-w-5xl mx-auto w-full flex items-center justify-between">
          <span className="font-semibold text-gray-900">BIC Champions</span>
          <div className="flex items-center gap-3">
            <Link to="/login" className="text-sm text-gray-600 hover:text-gray-900 font-medium transition-colors">Log in</Link>
            <Link to="/register" className="text-sm bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors">Register</Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-20 text-center">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-600 text-xs font-semibold rounded-full mb-6">
              Bellevue Summer 2026
            </span>
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 leading-tight mb-4">
              Reading &amp; Writing<br />
              <span className="text-indigo-600">Champions Program</span>
            </h1>
            <p className="text-lg text-gray-500 max-w-xl mx-auto mb-8">
              Build your reading streak, earn recognition levels, and get expert feedback on your writing — all in one place.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/register" className="bg-indigo-600 text-white font-semibold px-6 py-3 rounded-xl hover:bg-indigo-700 transition-colors text-sm">
                Join the program
              </Link>
              <Link to="/login" className="bg-white border border-gray-200 text-gray-700 font-semibold px-6 py-3 rounded-xl hover:bg-gray-50 transition-colors text-sm">
                Already a member? Log in
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-10 px-6 border-b border-gray-200">
        <div className="max-w-3xl mx-auto grid grid-cols-3 gap-6 text-center">
          {[['200+', 'Students enrolled'], ['5,000+', 'Books read'], ['1,200+', 'Essays written']].map(([v, l], i) => (
            <motion.div key={l} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.1 + 0.3 }}>
              <p className="text-2xl font-bold text-gray-900">{v}</p>
              <p className="text-sm text-gray-500 mt-0.5">{l}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Everything you need to grow as a reader</h2>
            <p className="text-gray-500 text-sm">Built for students in grades 1–8</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((f, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }} viewport={{ once: true }}
                className="bg-white rounded-xl border border-gray-200 p-5"
              >
                <span className="text-2xl mb-3 block">{f.emoji}</span>
                <h3 className="font-semibold text-gray-900 mb-1 text-sm">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Recognition Levels */}
      <section className="py-16 px-6 bg-white border-t border-gray-200">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Recognition levels</h2>
            <p className="text-gray-500 text-sm">Earn points through reading and writing to unlock each title</p>
          </div>
          <div className="space-y-2">
            {levels.map((l, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -12 }} whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }} viewport={{ once: true }}
                className="flex items-center gap-4 p-3.5 rounded-xl border border-gray-200 bg-gray-100"
              >
                <span className="text-xl w-8 text-center">{l.emoji}</span>
                <span className="flex-1 font-medium text-gray-900 text-sm">{l.name}</span>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${l.color}`}>{l.pts}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6 text-center">
        <div className="max-w-md mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Ready to become a champion?</h2>
          <p className="text-gray-500 text-sm mb-6">Join hundreds of students building real reading and writing skills this summer.</p>
          <Link to="/register" className="inline-flex items-center gap-2 bg-indigo-600 text-white font-semibold px-6 py-3 rounded-xl hover:bg-indigo-700 transition-colors text-sm">
            Get started — it's free
          </Link>
        </div>
      </section>

      <footer className="border-t border-gray-200 py-6 text-center text-xs text-gray-400">
        © 2026 Bellevue Reading &amp; Writing Champions Program
      </footer>
    </div>
  )
}
