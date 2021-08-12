import { Component, OnInit,Output,EventEmitter } from '@angular/core';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent implements OnInit {

  @Output() nextStep = new EventEmitter()

  public userType= 'worker'
  public firstLoad =true
  constructor() { }

  ngOnInit(): void {
  }

  public setUserType(userType:string){
    this.userType=userType
    this.firstLoad =false
  }

  public proceed(){
    this.nextStep.emit()
  }

}
