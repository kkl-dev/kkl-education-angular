import { Validators } from '@angular/forms';
export class QuestionBase<T> {
  value: T | undefined | number;
  key: string;
  label: string;
  icon: string;
  disabled: boolean;
  controlType: string;
  columns: string;
  component: string;
  validations: Validators[];
  type: string;
  options: { key: string; value: string }[];

  constructor(
    options: {
      value?: T;
      key?: string;
      icon?: string;
      disabled?: string;
      label?: string;
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
    this.controlType = options.controlType || 'text';
    this.type = options.type || '';
    this.component = options.component || '';
    this.options = options.options || [];
  }
}
