import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { auth, googleProvider } from "./firebase"
import { signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth"

export default function Auth() {
  const [isRegister, setIsRegister] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const navigate = useNavigate()

  const handleGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider)
      navigate('/')
    } catch (e) {
      console.error(e)
      alert('Error con Google Sign-in')
    }
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    try {
      if (isRegister) {
        await createUserWithEmailAndPassword(auth, email, password)
      } else {
        await signInWithEmailAndPassword(auth, email, password)
      }
      navigate('/')
    } catch (err) {
      console.error(err)
      alert('Error autenticando: ' + err)
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">{isRegister ? 'Registro' : 'Iniciar sesión'}</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        {isRegister && (
          <input value={name} onChange={e=>setName(e.target.value)} placeholder="Nombre" className="w-full p-2 border rounded" />
        )}
        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" className="w-full p-2 border rounded" />
        <input value={password} onChange={e=>setPassword(e.target.value)} type="password" placeholder="Contraseña" className="w-full p-2 border rounded" />
        <div className="flex gap-2">
          <button className="bg-blue-600 text-white px-4 py-2 rounded">{isRegister ? 'Crear cuenta' : 'Entrar'}</button>
          <button type="button" onClick={handleGoogle} className="bg-red-500 text-white px-4 py-2 rounded">Google</button>
        </div>
      </form>
      <p className="text-sm mt-3">
        <button onClick={()=>setIsRegister(!isRegister)} className="text-blue-600">{isRegister ? 'Ya tienes cuenta? Inicia sesión' : 'Crear cuenta'}</button>
      </p>
    </div>
  )
}
