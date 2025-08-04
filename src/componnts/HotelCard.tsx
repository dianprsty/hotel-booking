import { Heart, Star } from "lucide-react";
import type { IHotelData } from "../types";
import { memo, useState } from "react";

interface IHotelCardProps {
  data: IHotelData;
}

const formatDate = (s: string, e: string) => {
  const start = new Date(s);
  const end = new Date(e);

  const startMonth = start.toLocaleString("en-US", { month: "short" });
  const startDate = start.getDate();
  const startYear = start.getFullYear();

  const endMonth = end.toLocaleString("en-US", { month: "short" });
  const endDate = end.getDate();
  const endYear = end.getFullYear();

  if (startMonth === endMonth && startYear === endYear) {
    return `${startMonth} ${startDate} - ${endDate}`;
  }

  if (startYear === endYear) {
    return `${startMonth} ${startDate} - ${endMonth} ${endDate}`;
  }

  return `${startMonth} ${startDate}, ${startYear} - ${endMonth} ${endDate}, ${endYear}`;
};

function HotelCard({ data: { imageUrl, location, ...data } }: IHotelCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  return (
    <div>
      <div className="relative mb-4">
        <img
          className="h-[310px] w-full rounded-xl object-cover"
          src={imageUrl}
          alt=""
        />
        <button
          onClick={() => setIsLiked(!isLiked)}
          className="absolute top-3 right-3"
        >
          <Heart
            className={`${
              isLiked ? "text-red-500 fill-red-500" : "text-white"
            }`}
          />
        </button>
      </div>
      <div className="flex flex-col gap-1">
        <div className="flex justify-between items-center">
          <div className="font-medium">{location}</div>
          <div className="flex items-center gap-1">
            <Star className="w-3.5" />
            <span>
              {data.rating} ({data.reviews})
            </span>
          </div>
        </div>
        <div className="text-gray-400 text-sm">{data.distance} kilometers</div>
        <div className="text-gray-400 text-sm mb-2">
          {formatDate(data.availableDates.start, data.availableDates.end)}
        </div>
        <div>
          <span className="font-semibold">${data.pricePerNight}</span> night
        </div>
      </div>
    </div>
  );
}

export default memo(HotelCard);
