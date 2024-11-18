export interface IHotelProps {
  id: string;
  name: string;
  country: string;
  address: string;
  category: number;
  images: string[];
  dateCreated: number | null;
}
