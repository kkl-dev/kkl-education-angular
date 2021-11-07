import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormTemplate } from 'src/app/components/form/logic/form.service';
import { TableCellModel } from 'src/app/utilities/models/TableCell';
import { AdditionsService } from '../../services/additions.service';
import { TransportService } from '../../services/transport.service';
import { Order, OrderItemCommonDetails, OrderService, OrderType, Supplier, TransportOrder, UserService } from 'src/app/open-api';
import { SquadAssembleService } from '../../../squad-assemble/services/squad-assemble.service';

@Component({
  selector: 'app-order-form',
  templateUrl: './order-form.component.html',
  styleUrls: ['./order-form.component.scss']
})
export class OrderFormComponent implements OnInit {

  constructor(private transportService: TransportService, private squadAssembleService: SquadAssembleService, private additionsService: AdditionsService, private orderService: OrderService) { }
  @Input() public order: any;
  @Input() public editMode: boolean;

  public form: FormGroup;
  public columns: TableCellModel[];

  public formTemplate: FormTemplate = {
    hasGroups: true,
    questionsGroups: [],
  };

  ngOnInit(): void {
    this.orderService.getSupplierList(1, 52275, 0).subscribe(
      response => {
        console.log(response)
        response.forEach(element => {
          this.transportService.supplierList.push({ label: element.name, value: element.id.toString() });
        });
        this.getSupplierByOrderType();
      },
      error => console.log(error),       // error
      () => console.log('completed')     // complete
    )
    if (this.editMode) {
      this.transportService.setFormValues(this.order);
    }
    //this.setDatesValues();
    this.formTemplate.questionsGroups = this.transportService.questionGroups;
  }

  getSupplierByOrderType() {
    this.orderService.getSupplierByOrderType(1, 1).subscribe(
      response => {
        console.log(response);
        let index = this.transportService.details.findIndex(el => el.key === "supplier");
        this.transportService.details[index].value = response.id.toString();
      },
      error => console.log(error),       // error
      () => console.log('completed')     // complete
    )
  }


  public onSave(): void {
    if (this.form) {
      this.editMode = true;
      this.form.disable();
      var t = {} as TransportOrder;
      t.globalParameters = {} as OrderItemCommonDetails;
      t.order = {} as Order;
      t.order.supplier = {} as Supplier;
      t.order.orderType = {} as OrderType;
      Object.keys(this.form.value.details).map((key, index) => {
        if (key !== 'pickUpAddress' && key !== 'pickUpLocation' && key !== 'supplier') {
          t.globalParameters[key] = this.form.value.details[key]
        }
        else if (key !== "supplier") {
          t[key] = this.form.value.details[key]
        }
      });
      t.globalParameters['endHour'] = '2021-11-21T14:00:00';
      t.globalParameters['startHour'] = '2021-11-21T15:00:00';
      t.globalParameters['comments'] = this.form.value.comments.comments;
      //change hard coded
      t.order.supplier.id = +this.form.value.details.supplier;
      t.order.tripId = this.squadAssembleService.tripInfofromService.trip.id;
      // t.order.tripId = 99;
      t.order.orderType.name = 'היסעים';
      t.order.orderType.id = 1;
      this.additionsService.addOrderItems(t);
    }
  }

  setDatesValues() {
    let tripDetails = this.squadAssembleService.tripInfofromService.trip;
    let startDate = tripDetails.tripStart;
    let endDate = tripDetails.tripEnding;
    let str = startDate.split("T");
    let str2 = endDate.split("T");
    let from = str[0]
    let till = str2[0];
    let date1 = new Date(from);
    let date2 = new Date(till);

    const utc1 = Date.UTC(
      date1.getFullYear(),
      date1.getMonth(),
      date1.getDate()
    );
    const utc2 = Date.UTC(
      date2.getFullYear(),
      date2.getMonth(),
      date2.getDate()
    );
    const _MS_PER_DAY = 1000 * 60 * 60 * 24;
    const totalDays = Math.floor((utc2 - utc1) / _MS_PER_DAY);
    console.log(totalDays);
    let newDate = new Date(date1.setDate(date1.getDate()));
    let datesArr = [];
    for (let i = 0; i < totalDays; i++) {
      //  const newDateString = `${newDate.getDate()}/${
      //    (newDate.getMonth()+1).toString()
      //  }/${newDate.getFullYear()}`;
      const newDateString = `${newDate.getFullYear()}-${(newDate.getMonth() + 1).toString()
        }-${newDate.getDate()}`;

      datesArr.push({
        label: newDateString,
        value: newDateString
      });
      newDate = new Date(date1.setDate(date1.getDate() + 1));
    }
    console.log('datesArr is : ', datesArr);
    let startDateindex = this.transportService.details.findIndex(i => i.key == 'startDate');
    let endDateIndex = this.transportService.details.findIndex(i => i.key == 'endDate');
    this.transportService.details[startDateindex].inputProps.options = datesArr;
    this.transportService.details[endDateIndex].inputProps.options = datesArr;
  }



  public onEdit() {
    this.editMode = false;
    this.form.enable();
  }

  public onValueChange(event) {
    this.form = event;
    // console.log(this.form)
  }
}
