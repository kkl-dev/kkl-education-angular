export class TableCellModel {
  // readonly col = 8.3333;

  constructor(
    public key: string,
    public label?: string,
    public value?: string | Date | number,
    public type?: string,
    public offset?: number,
    public cols?: number,
    public divider?: boolean,

    public offsetSpan?: number,
    public colSpan?: number
  ) {
    this.type = this.type || 'text';
    this.divider = this.divider || false;
  }

  static create(options: TableCellModel) {
    return new TableCellModel(
      options.key,
      options.label,
      options.value,
      options.type,
      options.offset,
      options.colSpan,
      options.divider
    );
  }
}
