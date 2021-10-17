import { Validators } from "@angular/forms";
import { QuestionSelect } from "src/app/components/form/logic/question-select";
import { QuestionTextbox } from "src/app/components/form/logic/question-textbox";

export const DAYS = [{
    day: '18.10.2021',
    options: {
        svgUrl: '',
        sleepingAreas: 0,
        avialableSpaces: 0,
        type: '',
        singleUnit: '',
    }
}, {
    day: '19.10.2021',
    options: {
        svgUrl: '',
        sleepingAreas: 0,
        avialableSpaces: 0,
        type: '',
        singleUnit: '',
    }
}, {
    day: '20.10.2021',
    options: {
        svgUrl: '',
        sleepingAreas: 0,
        avialableSpaces: 0,
        type: '',
        singleUnit: '',
    }
}, {
    day: '21.10.2021',
    options: {
        svgUrl: '',
        sleepingAreas: 0,
        avialableSpaces: 0,
        type: '',
        singleUnit: '',
    }
}];

export const FACILITY_OCCUPANCY = [{
    startingHour: 8,
    endingHour: 10,
    totalTime: 2,
    user: 'גנים',
},
{
    startingHour: 14,
    endingHour: 15.25,
    totalTime: 1.25,
    user: 'דני',
},
{
    startingHour: 19.75,
    endingHour: 24,
    totalTime: 4.25,
    user: 'יוסי',
}];

export const FACILITIES_ARRAY = [
    {
        svgUrl: 'assets/images/museum.svg',
        title: 'תאטרון',
        maxParticipants: 'עד 320 משתתפים',
        availability: FACILITY_OCCUPANCY,
    },
    {
        svgUrl: 'assets/images/classroom.svg',
        title: 'תאטרון',
        maxParticipants: 'עד 20 משתתפים',
        availability: FACILITY_OCCUPANCY,
    },
    {
        svgUrl: 'assets/images/football.svg',
        title: 'מגרש ספורט',
        maxParticipants: '',
        availability: FACILITY_OCCUPANCY,
    },
    {
        svgUrl: 'assets/images/leafs.svg',
        title: 'סיור במשתלה',
        availability: FACILITY_OCCUPANCY,
    },
    // --- length 5 ---
    {
        svgUrl: 'assets/images/stage.svg',
        title: 'תאטרון',
        maxParticipants: 'עד 320 משתתפים',
        availability: FACILITY_OCCUPANCY,
    },
    {
        svgUrl: 'assets/images/stage.svg',
        title: 'תאטרון',
        maxParticipants: 'עד 320 משתתפים',
        availability: FACILITY_OCCUPANCY,
    },
    {
        svgUrl: 'assets/images/stage.svg',
        title: 'תאטרון',
        maxParticipants: 'עד 320 משתתפים',
        availability: FACILITY_OCCUPANCY,
    },
    {
        svgUrl: 'assets/images/stage.svg',
        title: 'תאטרון',
        maxParticipants: 'עד 320 משתתפים',
        availability: FACILITY_OCCUPANCY,
    },
    {
        svgUrl: 'assets/images/stage.svg',
        title: 'תאטרון',
        maxParticipants: 'עד 320 משתתפים',
        availability: FACILITY_OCCUPANCY,
    },
    {
        svgUrl: 'assets/images/stage.svg',
        title: 'תאטרון',
        maxParticipants: 'עד 320 משתתפים',
        availability: FACILITY_OCCUPANCY,
    },
    {
        svgUrl: 'assets/images/stage.svg',
        title: 'תאטרון',
        maxParticipants: 'עד 320 משתתפים',
        availability: FACILITY_OCCUPANCY,
    },
    {
        svgUrl: 'assets/images/stage.svg',
        title: 'תאטרון',
        maxParticipants: 'עד 320 משתתפים',
        availability: FACILITY_OCCUPANCY,
    },
];

export const ACTIVITIES_ARRAY = [
    {
      svgUrl: 'assets/images/fruits.svg',
      title: 'ארוחת ערב',
    },
    {
      svgUrl: 'assets/images/roast-chicken.svg',
      title: 'ארוחת צהריים',
    },
    {
      svgUrl: 'assets/images/restaurant.svg',
      title: 'ארוחת בוקר',
    },
    {
      svgUrl: 'assets/images/alarm.svg',
      title: 'השכמה',
    },
    {
      svgUrl: 'assets/images/bus-with-flag.svg',
      title: 'התייצבות',
    },
    {
      svgUrl: 'assets/images/fruits.svg',
      title: 'ארוחת ערב',
    },
    {
      svgUrl: 'assets/images/alarm.svg',
      title: 'השכמה',
    },
  ];

  export const UP_COMING_ACTIVITIES_ARRAY =  [
    { img: "assets/images/img-1.png", title: "ניווט יערני במחנה", content: "על הפעילות הסבר על הפעילות הסבר על הפעילות הסבר על הפעילות", hours: 1.5 },
    { img: "assets/images/img-2.png", title: "סולמות וחבלים בין העצים", content: "על הפעילות הסבר על הפעילות הסבר על הפעילות הסבר על הפעילות", hours: 3 },
    { img: "assets/images/img-3.png", title: "יום עיון והשתלמות", content: "על הפעילות הסבר על הפעילות הסבר על הפעילות הסבר על הפעילות", hours: 5 },
    { img: "assets/images/img-1.png", title: "ניווט יערני במחנה", content: "על הפעילות הסבר על הפעילות הסבר על הפעילות הסבר על הפעילות", hours: 1.5 },
    { img: "assets/images/img-2.png", title: "סולמות וחבלים בין העצים", content: "על הפעילות הסבר על הפעילות הסבר על הפעילות הסבר על הפעילות", hours: 3 },
    { img: "assets/images/img-3.png", title: "יום עיון והשתלמות", content: "על הפעילות הסבר על הפעילות הסבר על הפעילות הסבר על הפעילות", hours: 5 },
  ];

  export const FORM_ARRAY = [
    new QuestionSelect({
      key: 'durationOfActivity',
      label: 'משך פעילות',
      validations: [Validators.required],
      inputProps: { options: [{ label: '', value: '' }] }
    }),
    new QuestionSelect({
      key: 'area',
      label: 'אזור',
      validations: [Validators.required],
      inputProps: { options: [{ label: '', value: '' }] }
    }),
    new QuestionSelect({
      key: 'typeOfActivity',
      label: 'סוג פעילות',
      validations: [Validators.required],
      inputProps: { options: [{ label: '', value: '' }] }
    }),
    new QuestionTextbox({
      key: 'search',
      label: 'חפש פעילות',
      value: '',
      validations: [Validators.required]
    }),
  ];