import { useState } from "react"
import { useParams } from "react-router-dom"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"
import { db, auth } from "./firebase"

export default function RegistroPlatos() {
  const { roomId } = useParams()
  const [name, setName] = useState("")
  const [desc, setDesc] = useState("")

  const submit = async (e: any) => {
    e.preventDefault()
    if (!roomId) return alert('No room')
    if (!name) return alert('Nombre del plato obligatorio')
    await addDoc(collection(db, 'rooms', roomId, 'dishes'), {
      name,
      description: desc,
      createdBy: auth.currentUser?.uid || null,
      createdAt: serverTimestamp(),
    })
    setName('')
    setDesc('')
    alert('Plato registrado')
  }

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Registrar tu tapa</h2>
      <form onSubmit={submit} className="space-y-3">
        <input value={name} onChange={e=>setName(e.target.value)} placeholder="Nombre de la tapa" className="w-full p-2 border rounded" />
        <textarea value={desc} onChange={e=>setDesc(e.target.value)} placeholder="Descripción (ingredientes, etc)" className="w-full p-2 border rounded" />
        <div className="flex gap-2">
          <button className="bg-green-600 text-white px-4 py-2 rounded">Enviar</button>
        </div>
      </form>
    </div>
  )
}
