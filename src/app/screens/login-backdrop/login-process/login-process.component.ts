import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login-process',
  templateUrl: './login-process.component.html',
  styleUrls: ['./login-process.component.scss']
})
export class LoginProcessComponent implements OnInit {

  public userType= 'worker'
  public firstLoad :boolean =true
  public otp :boolean= false
  constructor() { }

  ngOnInit(): void {
  }

  public setUserType(userType:string){
    this.userType=userType
    this.firstLoad =false
  }

  public proceedToOtp(){
    this.otp=true
  }
}
