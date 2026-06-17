export default function Card({ children, className = '', hover = false, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-xl border border-gray-100 shadow-card ${hover ? 'transition-shadow duration-200 hover:shadow-card-hover cursor-pointer' : ''} ${className}`}
    >
      {children}
    </div>
  )
}
