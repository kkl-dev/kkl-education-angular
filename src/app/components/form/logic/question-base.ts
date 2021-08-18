import { ValidatorFn } from '@angular/forms';

export interface SelectOption {
  key: string
  value: string
}

export class QuestionBase<T> {
  value: T | undefined;
  type: string;
  key: string;
  label: string;
  sublabel: string;
  icon: string;
  disabled: boolean;
  controlType: string;
  cols: string;
  rows: string;
  custom: boolean;
  validations: ValidatorFn[];
  options: SelectOption[];
  isGroup: boolean;
  group: any;

  constructor(
    options: {
      value?: T;
      key?: string;
      icon?: string;
      disabled?: string;
      label?: string;
      sublabel?: string;
      order?: number;
      controlType?: string;
      type?: string;
      cols?: string;
      rows?: string;
      custom?: boolean;
      validations?: ValidatorFn[];
      options?: SelectOption[];
      isGroup?: boolean;
      group?: any
    } = {}

  ) {
    this.value = options.value;
    this.key = options.key || '';
    this.icon = options.icon || '';
    this.disabled = true;
    this.label = options.label || '';
    this.cols = options.cols || '1';
    this.rows = options.rows || '3';
    this.validations = options.validations || [],
      this.controlType = options.controlType || 'textbox';
    this.type = options.type || '';
    this.custom = options.custom || false;
    this.options = options.options || [];
    this.isGroup = options.isGroup || false;
    this.group = options.group || {}
  }
}
