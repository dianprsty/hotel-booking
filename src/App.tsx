import { onValue, ref } from "firebase/database";
import { useEffect, useState } from "react";
import { db } from "./utils";
import HotelCard from "./componnts/HotelCard";
import type { IHotelData } from "./types";

function App() {
  const [hotels, setHotels] = useState<IHotelData[]>([]);

  useEffect(() => {
    const query = ref(db, "hotels");
    onValue(query, (snapshot) => {
      if (snapshot.exists()) {
        setHotels(Object.values(snapshot.val()));
      }
    });
  }, []);

  return (
    <>
      <main className="p-4">
        <h1 className="text-2xl font-bold mb-4">Explore</h1>
        <section className="flex flex-col gap-6">
          {hotels.map((hotel: IHotelData) => (
            <HotelCard key={hotel.id} data={hotel} />
          ))}
        </section>
      </main>
    </>
  );
}

export default App;
