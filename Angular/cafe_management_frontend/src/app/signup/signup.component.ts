import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Route, Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { SnackbarService } from '../services/snackbar.service';
import { MatDialogRef } from '@angular/material/dialog';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { GlobalConstant } from '../shared/global-constant';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent implements OnInit{
  password = true
  confirmPassword = true
  signupForm:any = FormGroup
  responseMessage:any;
  ngOnInit(): void {
    this.signupForm = this.formBuilder.group({
      name:[null,[Validators.required, Validators.pattern(GlobalConstant.nameRegex)]],
      email:[null,[Validators.required, Validators.pattern(GlobalConstant.emailRegex)]],
      contactNumber:[null,[Validators.required, Validators.pattern(GlobalConstant.contactNumberRegex)]],
      password:[null,[Validators.required]],
      confirmPassword:[null,[Validators.required]],
    })
  }
  constructor(
    private formBuilder: FormBuilder, 
    private router:Router, 
    private userService: UserService,
    private snackbarService: SnackbarService,
    private dialogRef:MatDialogRef<SignupComponent>,
    private ngxService: NgxUiLoaderService

  ){}

  validateSubmit(){
    if(this.signupForm.controls['password'].value != this.signupForm.controls['confirmPassword'].value){
      return true;
    }else{
      return false;
    }
  }

  handleSubmit(){
    this.ngxService.start();
    var formData = this.signupForm.value;
    var data = {
      name: formData.name,
      email: formData.email,
      contactNumber: formData.contactNumber,
      password: formData.password
    }
  
    this.userService.signup(data).subscribe(
      (response: any) => {
        this.ngxService.stop();
        this.dialogRef.close();
        this.responseMessage = response?.message;
        this.snackbarService.openSnackBer(this.responseMessage,"");
        this.router.navigate(['/']);
        
      },
      (error) => {
        this.ngxService.stop();
        if(error.error?.message){
          this.responseMessage = error.error?.message;
        }else{
          this.responseMessage = GlobalConstant.genericError
        }
        this.snackbarService.openSnackBer(this.responseMessage,GlobalConstant.error);
      }
    );
  }

}
