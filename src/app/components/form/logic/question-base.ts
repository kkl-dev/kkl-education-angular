import { ValidatorFn } from '@angular/forms';
import { CalendarOptions } from 'comrax-alex-airbnb-calendar';
import { FormHeader } from 'src/app/screens/order-tour/squad-assemble/components/squad-group/squad-group.component';
import { QuestionGroup } from './question-group';

export interface SelectOption {
  label: string;
  value: string;
}

// export interface SelectOption {
//   name: string;
//   id: string;
// }

export class QuestionBase<T> {
  setValue(arg0: string) {
    throw new Error('Method not implemented.');
  }
  value: T | undefined;
  type?: string;
  key: string;
  label: string;
  header: FormHeader;
  icon: string;
  disabled: boolean;
  controlType: string;
  cols: string | number;
  rows: string | number;
  offset: number | string;
  custom: boolean;
  fullWidth: boolean;
  validations: ValidatorFn[];
  isGroup: boolean;
  group?: QuestionGroup;
  dateOptions?: CalendarOptions;
  inputProps: {
    options?: SelectOption[];
    labelLength?: string;
  };

  constructor(
    options: {
      value?: T;
      key?: string;
      label?: string;
      header?: FormHeader;
      type?: string;
      icon?: string;
      disabled?: boolean;
      order?: number;
      controlType?: string;
      cols?: string | number;
      rows?: string | number;
      offset?: number | string;
      custom?: boolean;
      fullWidth?: boolean;
      validations?: ValidatorFn[];
      isGroup?: boolean;
      group?: QuestionGroup;
      dateOptions?: CalendarOptions;

      inputProps?: {
        options?: SelectOption[];
        labelSize?: string;
      };
    } = {}
  ) {
    this.value = options.value;
    this.dateOptions = options.dateOptions;
    this.key = options.key || '';
    this.label = options.label || '';
    this.header = options.header || null;
    this.type = options.type || '';
    this.controlType = options.controlType || 'textbox';
    this.icon = options.icon || '';
    this.disabled = options.disabled || false;
    this.cols = options.cols?.toString() || '1';
    this.rows = options.rows?.toString() || '4';
    this.offset = options.offset?.toString() || '';
    this.validations = options.validations || [];
    this.custom = options.custom || false;
    this.fullWidth = options.fullWidth || false;
    this.isGroup = options.isGroup;
    this.group = options.group;
    this.inputProps = options.inputProps;
  }
}
