import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { db, auth } from './firebase'
import { doc, getDoc, collection, getDocs, updateDoc, serverTimestamp, onSnapshot, QuerySnapshot } from 'firebase/firestore'

interface RankingItem {
  id: string
  puntos: number
}

export default function RoomAdmin() {
  const { roomId } = useParams()
  const [room, setRoom] = useState<any>(null)
  const [votes, setVotes] = useState<any[]>([])
  const [dishesCount, setDishesCount] = useState(0)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!roomId) return

    const roomRef = doc(db, 'rooms', roomId)
    const unsubRoom = onSnapshot(roomRef, (snap) => {
      setRoom(snap.exists() ? snap.data() : null)
    })

    const votesRef = collection(db, 'rooms', roomId, 'votes')
    const unsubVotes = onSnapshot(votesRef, (snap: QuerySnapshot) => {
      setVotes(snap.docs.map(d => ({ id: d.id, ...(d.data() as any) })))
    })

    const dishesRef = collection(db, 'rooms', roomId, 'dishes')
    const unsubDishes = onSnapshot(dishesRef, (snap) => {
      setDishesCount(snap.size)
    })

    return () => {
      unsubRoom()
      unsubVotes()
      unsubDishes()
    }
  }, [roomId])

  const canManage = room && auth.currentUser && room.hostUid === auth.currentUser.uid

  const calcularResultados = async () => {
    if (!roomId) return
    setLoading(true)
    try {
      const votesSnap = await getDocs(collection(db, 'rooms', roomId, 'votes'))
      const votos = votesSnap.docs.map(d => d.data() as any)

      const puntuaciones: Record<string, number> = {}

      votos.forEach((voto) => {
        (voto.ranking || []).forEach((platoId: string, index: number) => {
          const puntos = Math.max(1, dishesCount - index)
          if (!puntuaciones[platoId]) puntuaciones[platoId] = 0
          puntuaciones[platoId] += puntos
        })
      })

      const rankingFinal: RankingItem[] = Object.entries(puntuaciones)
        .sort(([,a],[,b]) => b - a)
        .map(([id, puntos]) => ({ id, puntos }))

      await updateDoc(doc(db, 'rooms', roomId), {
        isFinished: true,
        finalRanking: rankingFinal,
        finishedAt: serverTimestamp(),
      })

      alert('Resultados calculados y votación cerrada')
      // refresh
      const roomDoc = await getDoc(doc(db, 'rooms', roomId))
      setRoom(roomDoc.exists() ? roomDoc.data() : null)
    } catch (e) {
      console.error(e)
      alert('Error calculando resultados')
    }
    setLoading(false)
  }

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Administración de Sala</h2>
      {!room && <p>Cargando sala...</p>}
      {room && (
        <>
          <div className="mb-4">
            <div><strong>Nombre:</strong> {room.name}</div>
            <div><strong>Creador (uid):</strong> {room.hostUid || 'Desconocido'}</div>
            <div><strong>Estado:</strong> {room.isFinished ? 'Finalizada' : 'Abierta'}</div>
            <div><strong>Platos registrados:</strong> {dishesCount}</div>
            <div><strong>Votantes registrados:</strong> {votes.length}</div>
          </div>

          <div className="mb-4">
            <h3 className="font-bold mb-2">Votos</h3>
            <ul className="space-y-2">
              {votes.map(v => (
                <li key={v.id} className="p-2 border rounded">
                  <div><strong>Voter uid:</strong> {v.voter || v.id}</div>
                  <div><strong>Ranking:</strong> {(v.ranking || []).join(', ')}</div>
                </li>
              ))}
            </ul>
          </div>

          {canManage ? (
            <div className="flex gap-2">
              <button onClick={calcularResultados} disabled={loading || room.isFinished} className="bg-red-600 text-white px-4 py-2 rounded">{loading ? 'Calculando...' : 'Cerrar votación y calcular resultados'}</button>
            </div>
          ) : (
            <p className="text-sm text-gray-600">Solo el creador de la sala puede cerrar la votación.</p>
          )}
        </>
      )}
    </div>
  )
}
