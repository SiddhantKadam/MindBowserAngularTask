import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HttpmethodsService } from 'src/app/services/httpmethods.service';
import { LoginClass } from '../authorizationModel';
import { getManager } from '../authorizationURL';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  loginModel = new LoginClass();

  fieldTextType: boolean = false;
  submitted = false;

  getAllManagerList : any[];
  user: string = '1';
  signInFlag: boolean = false;
  encryptPsw: string;


  constructor(private formBuilder: FormBuilder, private httpService: HttpmethodsService, private router: Router, public toastr: ToastrService) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      registrationMail: new FormControl('', [Validators.required]),
      registrationPassword: new FormControl('', [Validators.required]),
    });
    this.getAllManager();
  }

  get f() { return this.loginForm.controls; }

  // == Save ==
  onSubmit() {
    this.submitted = true;
    if (this.loginForm.invalid) {
      return;
    }

    // ==== Post Login ====
    this.encryptPsw=btoa(this.loginModel.registrationPassword); //Ecrypt Password
    this.loginModel.registrationPassword=this.encryptPsw;
    for(let i=0; i<this.getAllManagerList.length; i++)
    {
       if(this.loginModel.registrationMail == this.getAllManagerList[i].registrationMail && this.loginModel.registrationPassword == this.getAllManagerList[i].registrationPassword) 
       {
        this.toastr.success('Login Succesfully!', 'Success');
        this.signInFlag = true;
        sessionStorage.setItem("user",this.user);
        this.router.navigateByUrl("/layout");
         break;
       }
       else
       {
         this.signInFlag = false;
       }
    }
    if (this.signInFlag == false) {
      this.toastr.error('Login Failed!', 'Failed');
    }
  }

  // == Get All Manager List ==
  getAllManager()
  {
    this.httpService.getRequest(getManager).subscribe((data: any) => {
      this.getAllManagerList = data;
    });
  }

  // == Toggle Password ==
  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }

}
