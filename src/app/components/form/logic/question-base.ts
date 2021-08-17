import { Validators } from '@angular/forms';
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
  component: string;
  validations: Validators[];
  options: { key: string; value: string }[];

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
      component?: string;
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
    this.validations = options.validations || [],
      this.order = options.order === undefined ? 1 : options.order;
    this.controlType = options.controlType || '';
    this.type = options.type || '';
    this.component = options.component || '';
    this.options = options.options || [];
  }
}