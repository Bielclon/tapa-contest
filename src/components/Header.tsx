import { Link, useNavigate } from "react-router-dom"
import { auth } from "../firebase"
import { signOut } from "firebase/auth"

export default function Header({ user }: { user: any }) {
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut(auth)
    navigate('/auth')
  }

  return (
    <header className="bg-white shadow-sm p-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Link to="/" className="text-xl font-bold">Tapa Contest</Link>
        <nav className="space-x-2 text-sm text-gray-600">
          <Link to="/">Home</Link>
          <Link to="/room" className="ml-2">Salas</Link>
        </nav>
      </div>

      <div className="flex items-center gap-4">
        {user ? (
          <>
            <span className="text-sm text-gray-700">{user.displayName || user.email}</span>
            <button onClick={handleSignOut} className="bg-red-500 text-white px-3 py-1 rounded">Salir</button>
          </>
        ) : (
          <Link to="/auth" className="bg-blue-500 text-white px-3 py-1 rounded">Entrar</Link>
        )}
      </div>
    </header>
  )
}
