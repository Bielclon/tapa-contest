import { ReactNode, useEffect, useState } from 'react'
import { auth } from './firebase'
import { onAuthStateChanged } from 'firebase/auth'
import { Navigate, useLocation } from 'react-router-dom'

export default function RequireAuth({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any>(auth.currentUser)
  const [loading, setLoading] = useState(true)
  const location = useLocation()

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u)
      setLoading(false)
    })
    return () => unsub()
  }, [])

  if (loading) return null
  if (!user) return <Navigate to="/auth" state={{ from: location }} replace />
  return children as unknown as import('react').ReactElement
}
