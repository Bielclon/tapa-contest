import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { collection, getDocs, doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore'
import { db, auth } from './firebase'

export default function VotacionPantalla() {
  const { roomId } = useParams()
  const [dishes, setDishes] = useState<any[]>([])
  const [ranking, setRanking] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    if (!roomId) return
    const fetch = async () => {
      const snap = await getDocs(collection(db, 'rooms', roomId, 'dishes'))
      const items = snap.docs.map(d => ({ id: d.id, ...(d.data() as any) }))
      setDishes(items)
      // load existing vote
      const uid = auth.currentUser?.uid
      if (uid) {
        const voteDoc = await getDoc(doc(db, 'rooms', roomId, 'votes', uid))
        if (voteDoc.exists()) {
          setRanking((voteDoc.data() as any).ranking || [])
        } else {
          setRanking(items.map(i=>i.id))
        }
      } else {
        setRanking(items.map(i=>i.id))
      }
    }
    fetch()
  }, [roomId])

  const move = (index: number, dir: number) => {
    const arr = [...ranking]
    const [item] = arr.splice(index,1)
    arr.splice(index+dir,0,item)
    setRanking(arr)
  }

  const submit = async () => {
    if (!roomId) return
    const uid = auth.currentUser?.uid
    if (!uid) return alert('Debes iniciar sesión')
    setLoading(true)
    await setDoc(doc(db, 'rooms', roomId, 'votes', uid), {
      ranking,
      updatedAt: serverTimestamp(),
      voter: uid,
    })
    setLoading(false)
    alert('Voto registrado')
    navigate('/')
  }

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Pantalla de Votación</h1>
      <p className="mb-4 text-sm text-gray-600">Arrastra (usa los botones) para ordenar tus preferencias. Luego pulsa enviar.</p>

      <ul className="space-y-2">
        {ranking.map((id, idx) => {
          const item = dishes.find(d=>d.id===id)
          if (!item) return null
          return (
            <li key={id} className="p-3 border rounded flex items-center justify-between">
              <div>
                <div className="font-bold">{item.name}</div>
                <div className="text-sm text-gray-600">{item.description}</div>
              </div>
              <div className="flex flex-col gap-2">
                <button disabled={idx===0} onClick={()=>move(idx,-1)} className="px-2 py-1 bg-gray-200 rounded">↑</button>
                <button disabled={idx===ranking.length-1} onClick={()=>move(idx,1)} className="px-2 py-1 bg-gray-200 rounded">↓</button>
              </div>
            </li>
          )
        })}
      </ul>

      <div className="flex gap-2 mt-4">
        <button onClick={submit} disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded">{loading ? 'Enviando...' : 'Enviar voto'}</button>
        <button onClick={()=>navigate(-1)} className="bg-gray-200 px-4 py-2 rounded">Volver</button>
      </div>
    </div>
  )
}
