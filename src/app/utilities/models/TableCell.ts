export class TableCellModel {

  constructor(
    public key: string,
    public label?: string,
    public value?: string | Date | number,
    public type?: string,
    public rows?: number | string,
    public cols?: number,
    public custom?: boolean,

    public rowsSpan?: number,
    public colSpan?: number
  ) {
    this.type = this.type || 'text';
  }

  static create(options: TableCellModel) {
    return new TableCellModel(
      options.key,
      options.label,
      options.value,
      options.type,
      options.rows,
      options.cols,
    );
  }
}
export class TableRowModel {

  constructor(
    public key: string,
    public columns: TableCellModel[],
    public label?: string,
    public rows?: number | string,
    public divider?: boolean
  ) {
    this.divider = this.divider || false;
  }

  static create(options: TableRowModel) {
    return new TableRowModel(
      options.key,
      options.columns,
      options.label,
      options.rows,
      options.divider,
      );
  }
}
