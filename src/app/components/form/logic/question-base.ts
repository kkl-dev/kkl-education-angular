import { ValidatorFn } from '@angular/forms';

export interface SelectOption {
  key: string;
  value: string;
}

export class QuestionBase<T> {
  value: T | undefined;
  type: string;
  key: string;
  label: string;
  icon: string;
  disabled: boolean;
  controlType: string;
  cols: string | number;
  rows: string | number;
  custom: boolean;
  validations: ValidatorFn[];
  isGroup: boolean;
  group?: any;
  inputProps: {
    options?: SelectOption[];
    labelLength?: string;
  };

  constructor(
    options: {
      value?: T;
      key?: string;
      type?: string;
      icon?: string;
      disabled?: string;
      label?: string;
      order?: number;
      controlType?: string;
      cols?: string | number;
      rows?: string | number;
      custom?: boolean;
      validations?: ValidatorFn[];
      isGroup?: boolean;
      group?: QuestionBase<string | Date | number>[];
      inputProps?: {
        options?: SelectOption[];
        labelLength?: string;
      };
    } = {}
  ) {
    this.value = options.value;
    this.key = options.key || '';
    this.icon = options.icon || '';
    this.disabled = true;
    this.label = options.label || '';
    this.cols = options.cols?.toString() || '1';
    this.rows = options.rows?.toString() || '3';
    this.validations = options.validations || [];
    this.controlType = options.controlType || 'textbox';
    this.type = options.type || '';
    this.custom = options.custom || false;
    this.custom = options.custom || false;
    this.isGroup = options.isGroup;
    this.group = options.group;
    this.inputProps = options.inputProps;
  }
}
