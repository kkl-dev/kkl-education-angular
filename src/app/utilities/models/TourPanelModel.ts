export interface TourPanel {
   date : Date,
   title: string,
   details: any[],
}

export class TourPanelModel {

  constructor(
    public date : Date,
    public title: string,
    public details: any[],
  ) {

    this.date = this.date || new Date,
    this.title = this.title || 'הוסף כותרת'
  }

  static create(options: TourPanelModel) {
    return new TourPanelModel(
      options.date,
      options.title,
      options.details,
    );
  }

  public setTitle(title : string) {
    this.title = title
  }
}
