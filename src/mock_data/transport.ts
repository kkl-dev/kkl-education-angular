import { LocationModel } from 'src/app/screens/order-tour/additions/models/LocationModel';
import { SchedualeModel } from 'src/app/screens/order-tour/additions/models/ScheduleModel';
import { TourTransportlModel } from 'src/app/screens/order-tour/additions/models/TourTransportlModel';

export const tourTransport: TourTransportlModel =
{
  id: 3849383,
  title: 'טיול שנתי שכבת ו בי"ס תמיר',
  date: new Date(),
  schedule: [
    new SchedualeModel(new Date, [new LocationModel(new Date(), 'נס-הרים', 'בי"ס תמיר')])
  ],
}

