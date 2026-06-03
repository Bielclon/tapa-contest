import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { db } from './firebase'
import { doc, getDoc, collection, getDocs, onSnapshot } from 'firebase/firestore'

export default function ResultadosPantalla() {
  const { roomId } = useParams()
  const [ranking, setRanking] = useState<{ id: string; puntos: number }[]>([])
  const [dishesMap, setDishesMap] = useState<Record<string,string>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!roomId) return
    const fetch = async () => {
      setLoading(true)
      const roomDoc = await getDoc(doc(db, 'rooms', roomId))
      if (!roomDoc.exists()) return setLoading(false)
      const data = roomDoc.data() as any
      const finalRanking = (data.finalRanking || []) as { id: string; puntos: number }[]

      // load dishes to map ids to names
      const dishesSnap = await getDocs(collection(db, 'rooms', roomId, 'dishes'))
      const map: Record<string,string> = {}
      dishesSnap.docs.forEach(d => {
        const dd = d.data() as any
        map[d.id] = dd.name || 'Plato sin nombre'
      })

      setDishesMap(map)
      setRanking(finalRanking)
      setLoading(false)
    }
    fetch()

    // listen for room updates to show if finalized in realtime
    const unsub = onSnapshot(doc(db, 'rooms', roomId), (snap) => {
      const r = snap.data() as any
      if (r?.isFinished) {
        // could show a toast or re-fetch ranking
        setRanking(r.finalRanking || [])
      }
    })
    return () => unsub()
  }, [roomId])

  if (!roomId) return <div className="p-6">Sala inválida</div>
  if (loading) return <div className="p-6">Cargando resultados...</div>
  if (!ranking || ranking.length === 0) return <div className="p-6">Aún no hay resultados para esta sala.</div>

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Resultados</h2>
      <ol className="list-decimal pl-6 space-y-3">
        {ranking.map((r, idx) => (
          <li key={r.id} className="flex justify-between items-center">
            <div>
              <div className="font-bold">{idx+1}. {dishesMap[r.id] || r.id}</div>
              <div className="text-sm text-gray-600">ID: {r.id}</div>
            </div>
            <div className="text-xl font-bold">{r.puntos} pts</div>
          </li>
        ))}
      </ol>
    </div>
  )
}
