import { Link, useNavigate } from "react-router-dom"
import { auth } from "../firebase"
import { signOut } from "firebase/auth"
import { useState } from "react"
import { addDoc, collection } from "firebase/firestore"
import { db } from "../firebase"

export default function Header({ user }: { user: any }) {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [roomName, setRoomName] = useState('')

  const createQuickRoom = async () => {
    try {
      const docRef = await addDoc(collection(db, 'rooms'), {
        name: roomName || 'Evento rápido',
        hostUid: auth.currentUser?.uid || null,
        code: null,
        createdAt: new Date(),
        isFinished: false,
      })
      setOpen(false)
      setRoomName('')
      navigate(`/room/${docRef.id}/register`)
    } catch (e) {
      console.error(e)
      alert('Error creando sala')
    }
  }

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
        <button onClick={()=>setOpen(true)} className="bg-indigo-500 text-white px-3 py-1 rounded">Crear Sala</button>
        {user ? (
          <>
            <span className="text-sm text-gray-700">{user.displayName || user.email}</span>
            <button onClick={handleSignOut} className="bg-red-500 text-white px-3 py-1 rounded">Salir</button>
          </>
        ) : (
          <Link to="/auth" className="bg-blue-500 text-white px-3 py-1 rounded">Entrar</Link>
        )}
      </div>

      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow max-w-md w-full">
            <h3 className="text-lg font-bold mb-3">Crear sala rápida</h3>
            <input value={roomName} onChange={e=>setRoomName(e.target.value)} placeholder="Nombre de la sala" className="w-full p-2 border rounded mb-3" />
            <div className="flex justify-end gap-2">
              <button onClick={()=>setOpen(false)} className="px-3 py-1 border rounded">Cancelar</button>
              <button onClick={createQuickRoom} className="px-3 py-1 bg-green-600 text-white rounded">Crear</button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
