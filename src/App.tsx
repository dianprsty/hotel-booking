import {
  onValue,
  startAfter,
  limitToFirst,
  ref,
  query,
  orderByKey,
} from "firebase/database";
import { useCallback, useEffect, useRef, useState } from "react";
import { db } from "./utils";
import HotelCard from "./componnts/HotelCard";
import type { IHotelData } from "./types";

const limit = 5;
function App() {
  const [hotels, setHotels] = useState<IHotelData[]>([]);
  const [lastItemKey, setLastItemKey] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const loadingRef = useRef<HTMLDivElement | null>(null);

  const loadHotels = useCallback(
    (after?: string) => {
      if (loading) return;

      setLoading(true);
      const queryConstraint = [limitToFirst(limit), orderByKey()];

      if (after) {
        queryConstraint.push(startAfter(after));
      }

      const hotelsQuery = query(ref(db, "hotels"), ...queryConstraint);
      onValue(hotelsQuery, (snapshot) => {
        if (snapshot.exists()) {
          const lastKey = Object.keys(snapshot.val())[limit - 1];
          const hotelsData = Object.values(snapshot.val()) as IHotelData[];
          setLastItemKey(lastKey);
          setHotels((prev) =>
            after ? [...prev, ...hotelsData] : [...hotelsData],
          );
        }
      });

      setLoading(false);
    },
    [loading],
  );

  useEffect(() => {
    loadHotels();
  }, [loadHotels]);

  useEffect(() => {
    const callback = (entries: IntersectionObserverEntry[]) => {
      if (entries[0].isIntersecting && lastItemKey && !loading) {
        loadHotels(lastItemKey);
      }
    };

    const option: IntersectionObserverInit = { threshold: 0.1 };
    const observer = new IntersectionObserver(callback, option);

    const loadingCurrent = loadingRef.current;
    if (loadingCurrent) {
      observer.observe(loadingCurrent);
    }
    return () => {
      if (loadingCurrent) {
        observer.unobserve(loadingCurrent);
      }
    };
  }, [lastItemKey, loadHotels, loading]);

  return (
    <>
      <main className="p-4">
        <h1 className="text-2xl font-bold mb-4">Explore</h1>
        <section className="flex flex-col gap-6">
          {hotels.map((hotel: IHotelData) => (
            <HotelCard key={hotel.id} data={hotel} />
          ))}
        </section>
        <div
          ref={loadingRef}
          className="w-full flex justify-center items-center"
        >
          {loading && (
            <div className="w-6 h-6 mx-auto my-8 animate-spin rounded-full  border-2 border-gray-300 border-y-gray-900"></div>
          )}
        </div>
      </main>
    </>
  );
}

export default App;
