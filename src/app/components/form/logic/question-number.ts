import { QuestionBase } from "./question-base";

export class QuestionNumber extends QuestionBase<number>{
  controlType = 'number'
  type = "number"
}
