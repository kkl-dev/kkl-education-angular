import { LocationModel } from 'src/app/utilities/models/LocationModel';
import { SchedualeModel } from 'src/app/utilities/models/ScheduleModel';
import { TourTransportlModel } from 'src/app/utilities/models/TourTransportlModel';

export const tourTransport: TourTransportlModel =
{
  id: 3849383,
  title: 'טיול שנתי שכבת ו בי"ס תמיר',
  date: new Date(),
  schedule: [
    new SchedualeModel(new Date, [new LocationModel(new Date(), 'נס-הרים', 'בי"ס תמיר')])
  ],
}

