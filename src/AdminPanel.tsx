import { useState } from "react"
import { db } from "./firebase"
import { collection, doc, getDocs, updateDoc } from "firebase/firestore"

type AdminPhase = "REGISTER" | "VOTING" | "FINISHED"

interface VoteDoc {
  ranking: string[]
}

interface RankingItem {
  id: string
  puntos: number
}

export default function AdminPanel() {
  const [loading, setLoading] = useState(false)

  const cambiarFase = async (nuevaFase: AdminPhase) => {
    await updateDoc(doc(db, "config", "gameState"), {
      status: nuevaFase,
    })

    alert(`Fase cambiada a: ${nuevaFase}`)
  }

  const calcularGanador = async () => {
    setLoading(true)
    try {
      const querySnapshot = await getDocs(collection(db, "votes"))
      const todosLosVotos = querySnapshot.docs.map((d) => d.data() as VoteDoc)

      const puntuaciones: Record<string, number> = {}

      todosLosVotos.forEach((voto) => {
        voto.ranking?.forEach((platoId, index) => {
          const puntos = 5 - index

          if (!puntuaciones[platoId]) puntuaciones[platoId] = 0
          puntuaciones[platoId] += puntos
        })
      })

      const rankingFinal: RankingItem[] = Object.entries(puntuaciones)
        .sort(([, a], [, b]) => b - a)
        .map(([id, puntos]) => ({ id, puntos }))

      console.log("Ganadores:", rankingFinal)

      await updateDoc(doc(db, "config", "gameState"), {
        status: "FINISHED",
        finalRanking: rankingFinal,
      })

      alert("¡Cálculo finalizado! La familia ya puede ver al ganador.")
    } catch (error) {
      console.error("Error calculando:", error)
      alert("Error (mira la consola)")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-10 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-8">Panel de Control (Admin)</h1>

      <div className="space-y-4">
        <div className="p-4 bg-white rounded shadow">
          <h2 className="font-bold mb-2">Fase 1: Preparación</h2>
          <button
            onClick={() => cambiarFase("REGISTER")}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Abrir Registro de Platos
          </button>
        </div>

        <div className="p-4 bg-white rounded shadow">
          <h2 className="font-bold mb-2">Fase 2: Concurso</h2>
          <button
            onClick={() => cambiarFase("VOTING")}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            ¡EMPEZAR VOTACIÓN!
          </button>
        </div>

        <div className="p-4 bg-white border-2 border-red-500 rounded shadow">
          <h2 className="font-bold mb-2 text-red-600">Fase 3: Gran Final</h2>
          <p className="text-sm text-gray-600 mb-4">Pulsa esto solo cuando todos hayan terminado de votar.</p>
          <button
            onClick={calcularGanador}
            disabled={loading}
            className="w-full bg-red-600 text-white px-4 py-4 rounded font-bold text-xl hover:bg-red-700"
          >
            {loading ? "Calculando..." : "CERRAR Y REVELAR GANADOR"}
          </button>
        </div>
      </div>
    </div>
  )
}
