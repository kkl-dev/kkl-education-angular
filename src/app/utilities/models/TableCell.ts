
export class TableCell {

  readonly col = 8.3333;


  constructor(
    public label : string,
    public value? : string,
    public key? : string,
    public span? : number,
    public offset? : number,

    public offsetSpan? : number,
    public colSpan? : number,
  ){

    this.span = this.span || 1
    this.offsetSpan = this.offset || this.col
    this.colSpan = this.span || this.col
  }

}
