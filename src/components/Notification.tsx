import { useEffect } from "react"

export default function Notification({ message, onClose }: { message: string; onClose?: () => void }) {
  useEffect(() => {
    const t = setTimeout(() => onClose && onClose(), 4000)
    return () => clearTimeout(t)
  }, [onClose])

  if (!message) return null

  return (
    <div className="fixed bottom-6 right-6 bg-white border shadow px-4 py-3 rounded">
      <div className="font-medium">{message}</div>
    </div>
  )
}
