export enum ListItemKeys {
  PATH = 'path',
  LABEL = 'label',
  svgUrl = 'svgUrl',
}

export interface ListItem {
  type?: string,
  key?: string,
  label?: string,
  size?: number,
  value?: any,
  path?: string,
  svgUrl?: string,
  scale?: number,

} 

export abstract class ListItemModel implements ListItem {

  constructor(
    public key?: string,
    public type?: string,
    public label?: string,
    public path?: string,
    public svgUrl?: string,
    public scale?: number,
    public size?: number,
  ) {
  }
}
