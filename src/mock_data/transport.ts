import { LocationModel } from 'src/app/screens/order-tour/additions/models/location.model';
import { SchedualeModel } from 'src/app/screens/order-tour/additions/models/schedule.model';
import { TourTransportlModel } from 'src/app/screens/order-tour/additions/models/tour-transport.model';

export const tourTransport: TourTransportlModel =
{
  id: 3849383,
  title: 'טיול שנתי שכבת ו בי"ס תמיר',
  date: new Date(),
  schedule: [
    new SchedualeModel(new Date, [new LocationModel(new Date(), 'נס-הרים', 'בי"ס תמיר')])
  ],
}

