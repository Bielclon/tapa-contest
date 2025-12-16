import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "./firebase";

// Importa tus componentes
import AdminPanel from "./AdminPanel"; 
import VotacionPantalla from "./VotacionPantalla";
// Asegúrate de tener o crear estos dos también (aunque sea vacíos por ahora):
// import RegistroPlatos from "./RegistroPlatos";
// import ResultadosPantalla from "./ResultadosPantalla";

// Componente para la vista de la familia (lo que tenías antes)
function VistaFamilia() {
  const [gameState, setGameState] = useState("LOADING");

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, "config", "gameState"), (doc) => {
        // Si no existe el documento, asumimos REGISTER
       setGameState(doc.data()?.status || 'REGISTER');
    });
    return () => unsubscribe();
  }, []);

  if (gameState === 'LOADING') return <div className="p-10">Cargando...</div>;
  
  // Aquí pones tus componentes según el estado
  // Nota: Si aún no tienes RegistroPlatos, usa un <div> provisional
  if (gameState === 'REGISTER') return <div>Aquí irá el registro de platos...</div>; // <RegistroPlatos />
  if (gameState === 'VOTING') return <VotacionPantalla />;
  if (gameState === 'FINISHED') return <div>Aquí irá el ganador...</div>; // <ResultadosPantalla />
  
  return <div>Estado desconocido</div>;
}

// El componente principal con las rutas
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta normal para la familia: midominio.com */}
        <Route path="/" element={<VistaFamilia />} />
        
        {/* Ruta secreta para ti: midominio.com/admin */}
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    </BrowserRouter>
  );
}