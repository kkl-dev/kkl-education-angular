import { QuestionBase } from "./question-base";

export class QuestionRadio extends QuestionBase<string>{
  controlType = 'radio'
  rows= "2"
}
