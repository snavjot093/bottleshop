export class Hero {

  constructor(
    public id: number,
    public invoiceDate: string,
    public invoiceNum: string,
    public power: string,
    public alterEgo?: string
  ) {  }

}

export class InventoryTable{
  constructor(
    
    public invoiceDate: string,
    public invoiceNum: string,
    public liqName: string,
    public liqType: string,
    public liqSize: string,
    public salesPerson: string,
    public price: string,
    public sellPrice: string,
    public quantity: string,
    public amount: string,
    public company: string,
    public dueDate: string,
    public paidWith: string,
    public paymentDate: string
  ) {  }
}
