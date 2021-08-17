import { Validators } from '@angular/forms';

export interface SelectOption {
  key: string
  value: string
}

export class QuestionBase<T> {
  value: any | undefined | number;
  type: string;
  key: string;
  label: string;
  icon: string;
  disabled: boolean;
  order: number;
  controlType: string;
  columns: string;
  rows: string;
  custom: boolean;
  validations: Validators[];
  options: SelectOption[];

  constructor(
    options: {
      value?: any;
      key?: string;
      icon?: string;
      disabled?: string;
      label?: string;
      order?: number;
      controlType?: string;
      type?: string;
      columns?: string;
      rows?: string;
      custom?: boolean;
      validations?: Validators[];
      options?: { key: string; value: string }[];
    } = {}
  ) {
    this.value = options.value;
    this.key = options.key || '';
    this.icon = options.icon || '';
    this.disabled = true;
    this.label = options.label || '';
    this.columns = options.columns || '1';
    this.rows = options.rows || '4';
    this.validations = options.validations || [],
      this.controlType = options.controlType || 'textbox';
    this.type = options.type || '';
    this.custom = options.custom || false;
    this.options = options.options || [];
  }
}
