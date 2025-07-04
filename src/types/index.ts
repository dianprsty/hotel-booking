export interface IHotelData{
    id:string,
    imageUrl: string,
    distance: string,
    location: string,
    pricePerNight: number,
    rating: number,
    reviews: number,
    availableDates:{
        end: string,
        start: string
    }
}