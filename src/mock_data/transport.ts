import { TourTransportlModel } from 'src/app/utilities/models/TourTransportlModel';

export const tourTransport: TourTransportlModel =
{
  id: 1,
  title: '',
  date: new Date(),
  locations: [{ pickUpDate: new Date(), pickupLocation: 'בית ספר תמיר', dropdownLocation: 'נס הרים' }],
}

