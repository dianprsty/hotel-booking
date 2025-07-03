import { onValue, ref } from "firebase/database"
import { useEffect, useState } from "react"
import { db } from "./utils"

function App() {
  const [hotels, setHotels] = useState([])

  useEffect(() => {
    const query = ref(db, 'hotels')
    onValue(query, (snapshot) => {
      if(snapshot.exists()) {
        setHotels(Object.values(snapshot.val()))
      }
    
    })
      
  }, [])

  return (
    <>
     <main className="m-20 text-justify">{
      JSON.stringify(hotels)}</main>
    </>
  )
}

export default App
