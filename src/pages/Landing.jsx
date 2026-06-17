import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Navbar from '../components/layout/Navbar'

const features = [
  { emoji: '📖', title: 'Track Reading', desc: 'Log daily reading sessions and build amazing streaks' },
  { emoji: '✍️', title: 'Submit Essays', desc: 'Write book reviews, character analyses, and creative pieces' },
  { emoji: '🏆', title: 'Earn Points', desc: 'Collect XP and climb the leaderboard rankings' },
  { emoji: '🏅', title: 'Unlock Badges', desc: 'Earn achievement badges as you hit milestones' },
  { emoji: '🎓', title: 'Expert Feedback', desc: 'Get rubric-based feedback from dedicated teachers' },
  { emoji: '🔥', title: 'Reading Streaks', desc: 'Build daily habits with streak tracking like Duolingo' },
]

const levels = [
  { emoji: '🌱', name: 'Story Explorer', pts: '25 pts', color: 'from-green-400 to-emerald-500' },
  { emoji: '⚔️', name: 'Chapter Adventurer', pts: '75 pts', color: 'from-blue-400 to-blue-600' },
  { emoji: '🚀', name: 'Book Voyager', pts: '150 pts', color: 'from-purple-400 to-purple-600' },
  { emoji: '🧭', name: 'Novel Navigator', pts: '250 pts', color: 'from-yellow-400 to-orange-500' },
  { emoji: '🏆', name: 'Future Novelist', pts: '400 pts', color: 'from-red-400 to-pink-600' },
]

export default function Landing() {
  return (
    <div className="min-h-screen bg-bg-lavender">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-purple-900 via-purple-700 to-purple-500 text-white py-20 px-4">
        <div className="absolute inset-0 opacity-10">
          {['📚', '⭐', '🔥', '🏆', '✍️', '📖'].map((e, i) => (
            <span key={i} className="absolute text-6xl select-none" style={{ left: `${15 + i * 15}%`, top: `${20 + (i % 2) * 40}%`, opacity: 0.3 }}>
              {e}
            </span>
          ))}
        </div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
            className="text-7xl mb-4"
          >
            📚
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-4 leading-tight"
          >
            Bellevue Reading &<br />
            <span className="text-orange-300">Writing Champions</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-lg text-purple-200 mb-10 max-w-xl mx-auto"
          >
            Build your reading streak, earn badges, and become a champion reader and writer this summer! 🌟
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              to="/register"
              className="bg-gradient-to-r from-orange-500 to-orange-400 text-white font-bold px-8 py-4 rounded-2xl text-lg shadow-xl hover:from-orange-600 hover:to-orange-500 transition-all hover:scale-105"
            >
              🚀 Join the Program!
            </Link>
            <Link
              to="/login"
              className="bg-white/20 backdrop-blur text-white font-bold px-8 py-4 rounded-2xl text-lg border border-white/30 hover:bg-white/30 transition-all"
            >
              📖 Already a Member? Log In
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Stats Banner */}
      <section className="bg-white border-b border-purple-100">
        <div className="max-w-4xl mx-auto px-4 py-6 grid grid-cols-3 gap-4 text-center">
          {[
            { emoji: '👨‍🎓', value: '200+', label: 'Students' },
            { emoji: '📚', value: '5,000+', label: 'Books Read' },
            { emoji: '✍️', value: '1,200+', label: 'Essays Written' },
          ].map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 + 0.8 }}>
              <div className="text-3xl mb-1">{s.emoji}</div>
              <div className="text-2xl font-extrabold text-purple-800">{s.value}</div>
              <div className="text-sm text-gray-500">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-extrabold text-purple-900 text-center mb-2">Why Students Love BIC 💜</h2>
          <p className="text-gray-500 text-center mb-10">A fun, gamified learning experience</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-6 shadow-sm border border-purple-50 hover:shadow-md transition-all hover:-translate-y-1"
              >
                <div className="text-4xl mb-3">{f.emoji}</div>
                <h3 className="font-bold text-purple-900 mb-1">{f.title}</h3>
                <p className="text-sm text-gray-500">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Recognition Levels */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-extrabold text-purple-900 text-center mb-2">Recognition Levels 🎖️</h2>
          <p className="text-gray-500 text-center mb-10">Earn points and unlock prestigious titles</p>
          <div className="space-y-3">
            {levels.map((l, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${l.color} flex items-center justify-center text-2xl`}>
                  {l.emoji}
                </div>
                <div className="flex-1">
                  <div className="font-bold text-gray-900">{l.name}</div>
                </div>
                <div className="font-bold text-purple-700 bg-purple-100 px-3 py-1 rounded-full text-sm">{l.pts}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-gradient-to-r from-purple-800 to-purple-600 text-white text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="text-5xl mb-4">🌟</div>
          <h2 className="text-3xl font-extrabold mb-4">Ready to Become a Champion?</h2>
          <p className="text-purple-200 mb-8 text-lg">Join hundreds of students building their reading and writing skills!</p>
          <Link
            to="/register"
            className="inline-block bg-gradient-to-r from-orange-500 to-orange-400 text-white font-bold px-10 py-4 rounded-2xl text-lg shadow-xl hover:from-orange-600 hover:to-orange-500 transition-all hover:scale-105"
          >
            🚀 Start Your Journey Today!
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="bg-purple-950 text-purple-300 py-8 text-center text-sm">
        <p>© 2026 Bellevue Reading & Writing Champions Program. All rights reserved. 📚</p>
      </footer>
    </div>
  )
}
