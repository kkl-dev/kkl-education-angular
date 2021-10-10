import { CalendarOptions, FreeSpace } from "comrax-alex-airbnb-calendar";

const freeSpacesArray = freeSpacesArrayGenarator(
    new Date(),
    new Date(2022, 11, 17)
  );

export const dateOptions:CalendarOptions = {
  firstCalendarDay: 0,
  format: 'dd/LL/yyyy',
  closeOnSelected: true,
// fromToDate: { from:new Date(2021, 9, 17), to:new Date(2021, 9, 22)},
  freeSpacesArray: freeSpacesArray,
};

// console.log(dateOptions);

function freeSpacesArrayGenarator(start: Date, end: Date) {
  let i = 0;
  let freeSpacesArrayTemp: FreeSpace[] = [];
  while (start < end) {
    start = new Date(start.setDate(start.getDate() + 1));
    freeSpacesArrayTemp.push({
      date: start,
      freeSpace: [
        {
          accomodationName: 'cabin',
          availableBeds: +Math.floor(Math.random() * 8).toString(),
        },
        {
          accomodationName: 'tent',
          availableBeds: +Math.floor(Math.random() * 8).toString(),
        },
        {
          accomodationName: 'room',
          availableBeds: +Math.floor(Math.random() * 8).toString(),
        },
      ],
    });
    i++;
  }
  return freeSpacesArrayTemp;
}