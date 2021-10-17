import { LocationModel } from 'src/app/screens/order-tour/additions/models/location.model';
import { ScheduleModel } from 'src/app/screens/order-tour/additions/models/schedule.model';
import { TourModel } from 'src/app/screens/order-tour/additions/models/tour.model';
import { TransportDetailsModel, TransportLocationsModel, TransportModel } from 'src/app/screens/order-tour/additions/models/transport.model';

export const tourTransport: TourModel = {
  id: 3849383,
  title: 'טיול שנתי שכבת ו בי"ס תמיר',
  date: new Date(),
  schedule: [
    new ScheduleModel(
      1,
      new Date(),
      [new LocationModel(new Date(), new Date(), 'נס-הרים', 'בי"ס תמיר')],
      new TransportModel(new TransportDetailsModel("שמעון", "ddd", 1), new TransportLocationsModel(), "הערה")
    ),
  ],
};
