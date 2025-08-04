import {
  onValue,
  startAfter,
  limitToFirst,
  ref,
  query,
  orderByKey,
} from "firebase/database";
import {
  memo,
  useCallback,
  useEffect,
  useState,
  type CSSProperties,
} from "react";
import { db } from "./utils";
import HotelCard from "./componnts/HotelCard";
import type { IHotelData } from "./types";
import InfiniteLoader from "react-window-infinite-loader";
import { FixedSizeList } from "react-window";

const limit = 5;

const HotelRow = memo(
  ({
    data,
    index,
    style,
  }: {
    data: IHotelData[];
    index: number;
    style: CSSProperties;
  }) => {
    return (
      <div style={style}>
        <HotelCard data={data[index]} />
      </div>
    );
  },
);

function App() {
  const [hotels, setHotels] = useState<IHotelData[]>([]);
  const [lastItemKey, setLastItemKey] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

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
          const hotelKeys = Object.keys(snapshot.val());
          const lastKey = hotelKeys[hotelKeys.length - 1];
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

  return (
    <>
      <main className="p-4">
        <h1 className="text-2xl font-bold mb-4">Explore</h1>
        <section className="flex flex-col gap-6">
          <InfiniteLoader
            isItemLoaded={(index) => !loading && !!hotels[index]}
            itemCount={1000}
            loadMoreItems={() => loadHotels(lastItemKey || undefined)}
          >
            {({ onItemsRendered, ref }) => (
              <FixedSizeList
                itemSize={450}
                itemCount={hotels.length}
                itemData={hotels}
                onItemsRendered={onItemsRendered}
                ref={ref}
                width="100%"
                height={window.innerHeight - 80}
              >
                {HotelRow}
              </FixedSizeList>
            )}
          </InfiniteLoader>
        </section>
      </main>
    </>
  );
}

export default App;
