import { Validators } from '@angular/forms';
export class QuestionBase<T> {
  value: T | undefined | number;
  key: string;
  label: string;
  required: boolean;
  order: number;
  controlType: string;
  columns: string;
  component: string;
  validations: Validators[];
  type: string;
  templateName: string;
  options: { key: string; value: string }[];

  constructor(
    options: {
      value?: T;
      key?: string;
      templateName?: string;
      label?: string;
      required?: boolean;
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
    this.templateName = options.templateName || '';
    this.label = options.label || '';
    this.required = !!options.required;
    this.columns = options.columns || '1';
    this.validations = [],
    this.order = options.order === undefined ? 1 : options.order;
    this.controlType = options.controlType || '';
    this.type = options.type || '';
    this.component = options.component || '';
    this.options = options.options || [];
  }
}
