export default function Card({ children, className = '', hover = false, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-xl border border-gray-200 shadow-sm ${hover ? 'transition-shadow duration-200 hover:shadow-md cursor-pointer' : ''} ${className}`}
    >
      {children}
    </div>
  )
}
