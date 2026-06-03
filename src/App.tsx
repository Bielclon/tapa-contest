import { useEffect, useState } from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { doc, onSnapshot } from "firebase/firestore"
import { db } from "./firebase"
import { onAuthStateChanged } from "firebase/auth"
import { auth } from "./firebase"

type GameState = "LOADING" | "REGISTER" | "VOTING" | "FINISHED"

interface GameStateDoc {
  status?: GameState
}

import AdminPanel from "./AdminPanel"
import VotacionPantalla from "./VotacionPantalla"
import RegistroPlatos from "./RegistroPlatos"
import ResultadosPantalla from "./ResultadosPantalla"
import RequireAuth from "./RequireAuth"
import Auth from "./Auth"
import Header from "./components/Header"
import RoomLobby from "./RoomLobby"

function VistaFamilia() {
  const [gameState, setGameState] = useState<GameState>("LOADING")

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, "config", "gameState"), (snapshot) => {
      setGameState((snapshot.data() as GameStateDoc)?.status || "REGISTER")
    })

    return () => unsubscribe()
  }, [])

  if (gameState === "LOADING") return <div className="p-10">Cargando...</div>
  if (gameState === "REGISTER") return <div>Aquí irá el registro de platos...</div>
  if (gameState === "VOTING") return <VotacionPantalla />
  if (gameState === "FINISHED") return <div>Aquí irá el ganador...</div>

  return <div>Estado desconocido</div>
}

export default function App() {
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u))
    return () => unsub()
  }, [])

  return (
    <BrowserRouter>
      <Header user={user} />
      <div className="p-6">
        <Routes>
          <Route path="/" element={<VistaFamilia />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/room/:roomId/register" element={<RequireAuth><RegistroPlatos /></RequireAuth>} />
          <Route path="/room/:roomId/vote" element={<RequireAuth><VotacionPantalla /></RequireAuth>} />
          <Route path="/room/:roomId/results" element={<ResultadosPantalla />} />
          <Route path="/room" element={<RoomLobby />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}
