import { LocationModel } from 'src/app/screens/order-tour/additions/models/location.model';
import { ScheduleModel } from 'src/app/screens/order-tour/additions/models/schedule.model';
import { TourTransportModel } from 'src/app/screens/order-tour/additions/models/tour-transport.model';

export const tourTransport: TourTransportModel =
{
  id: 3849383,
  title: 'טיול שנתי שכבת ו בי"ס תמיר',
  date: new Date(),
  schedule: [
    new ScheduleModel(1, new Date, [new LocationModel(new Date(), 'נס-הרים', 'בי"ס תמיר')])
  ],
}

