import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { UserDataService } from 'src/app/services/user-data.service';

@Component({
  selector: 'app-otp-form',
  templateUrl: './otp-form.component.html',
  styleUrls: ['./otp-form.component.scss'],
})
export class OtpFormComponent implements OnInit {
  signupForm: FormGroup = new FormGroup({});
  public phoneNumber: number = 6957;
  public otpArray: any[] = new Array(6);
  public prefix: string = 'otp';
  public nextUrl: string = '';

  constructor(private userDataService: UserDataService) {
    this.nextUrl = this.userDataService.user.urlPrefix;
  }

  ngOnInit(): void {
    this.signupForm = new FormGroup({
      otp0: new FormControl(''),
      otp1: new FormControl(''),
      otp2: new FormControl(''),
      otp3: new FormControl(''),
      otp4: new FormControl(''),
      otp5: new FormControl(''),
    });
  }

  onSubmit() {}

  keytab(event: any) {
    let element = event.srcElement.nextElementSibling;

    if (element == null) return;
    else element.focus();
  }
}
