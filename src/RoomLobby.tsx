import { useState } from "react"
import { collection, addDoc, query, where, getDocs } from "firebase/firestore"
import { db } from "./firebase"
import { useNavigate } from "react-router-dom"
import { auth } from "./firebase"

function makeCode(len = 6) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let out = ''
  for (let i = 0; i < len; i++) out += chars.charAt(Math.floor(Math.random() * chars.length))
  return out
}

export default function RoomLobby() {
  const [code, setCode] = useState("")
  const [name, setName] = useState("")
  const navigate = useNavigate()

  const createRoom = async () => {
    const roomCode = makeCode()
    const docRef = await addDoc(collection(db, 'rooms'), {
      code: roomCode,
      name: name || 'Evento sin nombre',
      hostUid: auth.currentUser?.uid || null,
      createdAt: new Date(),
      isFinished: false,
    })
    navigate(`/room/${docRef.id}/register`)
  }

  const joinRoom = async () => {
    if (!code) return alert('Introduce el código')
    const q = query(collection(db, 'rooms'), where('code', '==', code))
    const snap = await getDocs(q)
    if (snap.empty) return alert('Sala no encontrada')
    const docRef = snap.docs[0]
    navigate(`/room/${docRef.id}/register`)
  }

  return (
    <div className="max-w-lg mx-auto mt-8 bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Crear o unirse a una sala</h2>
      <div className="space-y-3">
        <input value={name} onChange={e=>setName(e.target.value)} placeholder="Nombre del evento (opcional)" className="w-full p-2 border rounded" />
        <button onClick={createRoom} className="w-full bg-green-600 text-white py-2 rounded">Crear sala nueva</button>
      </div>

      <hr className="my-4" />

      <div className="space-y-3">
        <input value={code} onChange={e=>setCode(e.target.value.toUpperCase())} placeholder="Código de sala" className="w-full p-2 border rounded" />
        <button onClick={joinRoom} className="w-full bg-blue-600 text-white py-2 rounded">Unirse a sala</button>
      </div>
    </div>
  )
}
