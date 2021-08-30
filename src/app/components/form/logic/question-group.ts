import { FormHeader } from 'src/app/screens/order-tour/squad-assemble/components/squad-group/squad-group.component';
import { QuestionBase } from './question-base';

export class QuestionGroup {
  constructor(
    public key?: string,
    public label?: string,
    public header?: FormHeader,
    public cols?: string | number,
    public rows?: string | number,
    public isGroup?: boolean,
    public questions?: any[],
    public hasButton?: boolean
  ) {}

  static create(group: QuestionGroup) {
    return new QuestionGroup(
      group.key,
      group.label,
      group.header,
      group.cols,
      group.rows,
      group.isGroup,
      group.questions,
      group.hasButton
    );
  }
}
