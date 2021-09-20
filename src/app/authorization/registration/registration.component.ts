import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HttpmethodsService } from 'src/app/services/httpmethods.service';
import { RegistrationClass } from '../authorizationModel';
import { getManager, postRegister } from '../authorizationURL';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {

  registrationForm: FormGroup;
  registrationModel = new RegistrationClass();

  fieldTextType: boolean = false;
  errormsg!: string;

  getAllManagerList: any[];
  submitted = false;
  confirmPassword: String;
  mailFlag: boolean = false;
  encryptPsw: string;
  user: string = '1';

  constructor(private formBuilder: FormBuilder, private router: Router, private httpService: HttpmethodsService, public toastr: ToastrService) { }

  ngOnInit(): void {
    this.registrationForm = this.formBuilder.group({
      registrationMail: new FormControl('', [Validators.required, Validators.email]),
      registrationFName: new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z ]*')]),
      registrationLName: new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z ]*')]),
      registrationPassword: new FormControl('', [Validators.required, Validators.minLength(8)]),
      registrationAddress: new FormControl('', [Validators.required]),
      registrationDOB: new FormControl('', [Validators.required]),
    });
    this.getAllManager();
  }

  getToday(): string {
    return new Date().toISOString().split('T')[0]
  }

  get f() { return this.registrationForm.controls; }

  // == Register ==
  onSubmit() {
    this.submitted = true;
    if (this.registrationForm.invalid) {
      return;
    }
    // ==== Post Register ====
    for (let i = 0; i < this.getAllManagerList.length; i++) {
      if (this.registrationModel.registrationMail == this.getAllManagerList[i].registrationMail) {  // Mail Already Exist
        this.toastr.error('Mail Already Exist!', 'Error');
        this.mailFlag = true;
        break;
      }
      else {
        this.mailFlag = false;
      }
    }
    if (this.mailFlag == false) {
      this.saveManager();
    }

  }

  // == Save Manager ==
  saveManager() {
    this.encryptPsw = btoa(this.registrationModel.registrationPassword);//Ecrypt Password 
    this.registrationModel.registrationPassword = this.encryptPsw;
    this.httpService.postRequest(postRegister, this.registrationModel).subscribe((data: any) => {
      this.toastr.success('Register Succesfully!', 'Success');
      sessionStorage.setItem("user", this.user);
      this.router.navigateByUrl("/layout");
    },
      error => {
        this.toastr.error('Register Failed!', 'Error');
      });
  }

  // == Get All Manager List ==
  getAllManager() {
    this.httpService.getRequest(getManager).subscribe((data: any) => {
      this.getAllManagerList = data;
    });
  }

  // == Toggle Password ==
  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }

}
