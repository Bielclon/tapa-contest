const enviarVotos = async () => {
  if (misElegidos.length < 5) return alert("¡Elige 5 platos!");
  
  // Guardamos el array ordenado.
  // misElegidos[0] es el top 1 (5 puntos), misElegidos[1] es el top 2 (4 puntos)...
  await addDoc(collection(db, "votes"), {
    userId: auth.currentUser.uid,
    ranking: misElegidos.map(plato => plato.id), // Guardamos solo IDs
    timestamp: serverTimestamp()
  });
  
  setHaVotado(true); // Bloquear pantalla localmente
};