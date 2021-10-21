export interface StepModel {
  label? : string,
  path? : string,
  svgUrl? : string,
  isActive ?  : boolean,
  hasBadge? : boolean,
  badgeValue? : number,
}

export interface StepModelNavigation {
  label? : string,
  path? : string,
  svgUrl? : string,
  isActive ?  : boolean,
  hasBadge? : boolean,
  badgeValue? : number,
  value: number
}
