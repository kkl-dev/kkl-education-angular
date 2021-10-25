import { OccupiedHours } from "./facility.model";

export interface ActivityModel {
    date: string | Date;
    facilitiesList: ActivitiesList[];
}

export interface ActivitiesList {
    id: string | number;
    name: string;
    maxOccupancy: number | string;
    iconPath: string;
    occupiedHours: OccupiedHours[];
}
