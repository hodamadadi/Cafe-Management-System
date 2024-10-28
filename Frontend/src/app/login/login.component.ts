// import { Component, OnInit } from '@angular/core';
// import {
//   UntypedFormGroup,
//   UntypedFormBuilder,
//   Validators,
// } from '@angular/forms';
// import { Router } from '@angular/router';
// import { UserService } from '../services/user.service';
// import { MatDialogRef } from '@angular/material/dialog';
// import { NgxUiLoaderService } from 'ngx-ui-loader';
// import { SnackbarService } from '../services/snackbar.service';
// import { GlobalConstants } from '../shared/global-constants';
// import { error } from 'console';

// @Component({
//   selector: 'app-login',
//   templateUrl: './login.component.html',
//   styleUrls: ['./login.component.scss'],
// })
// export class LoginComponent implements OnInit {
//   loginForm: any = UntypedFormGroup;
//   responseMessage: any;
//   constructor(
//     private formBuilder: UntypedFormBuilder,
//     private router: Router,
//     private userService: UserService,
//     private dialogRef: MatDialogRef<LoginComponent>,
//     private ngxService: NgxUiLoaderService,
//     private snackbarService: SnackbarService
//   ) {}

//   ngOnInit(): void {
//     this.loginForm = this.formBuilder.group({
//       email: [
//         null,
//         [Validators.required, Validators.pattern(GlobalConstants.emailRegex)],
//       ],
//       password: [null, Validators.required],
//     });
//   }
//   handleSubmit() {
//     this.ngxService.start();
//     var formData = this.loginForm.value;
//     var data = {
//       email: formData.email,
//       password: formData.password,
//     };
//     this.userService.login(data).subscribe(
//       (response: any) => {
//         this.ngxService.stop();
//         this.dialogRef.close();
//         localStorage.setItem('token', response.token);
//         this.router.navigate(['/cafe/dashboard']);
//       },
//       (error) => {
//         this.ngxService.stop();
//         if (error.error?.message) {
//           this.responseMessage = error.error?.message;
//         } else {
//           this.responseMessage = GlobalConstants.genericError;
//         }
//         this.snackbarService.openSnackBar(
//           this.responseMessage,
//           GlobalConstants.error
//         );
//       }
//     );
//   }
// }
import { Component, OnInit } from '@angular/core';
import {
  UntypedFormGroup,
  UntypedFormBuilder,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { MatDialogRef } from '@angular/material/dialog';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SnackbarService } from '../services/snackbar.service';
import { GlobalConstants } from '../shared/global-constants';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm: UntypedFormGroup; // Declare the loginForm
  responseMessage: string | null = null; // Initialize as null

  constructor(
    private formBuilder: UntypedFormBuilder,
    private router: Router,
    private userService: UserService,
    private dialogRef: MatDialogRef<LoginComponent>,
    private ngxService: NgxUiLoaderService,
    private snackbarService: SnackbarService
  ) {
    // Initialize the loginForm in the constructor
    this.loginForm = this.formBuilder.group({
      email: [
        null,
        [Validators.required, Validators.pattern(GlobalConstants.emailRegex)],
      ],
      password: [null, Validators.required],
    });
  }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: [
        null,
        [Validators.required, Validators.pattern(GlobalConstants.emailRegex)],
      ],
      password: [null, Validators.required],
    });
  }

  handleSubmit(): void {
    this.ngxService.start();
    const formData = this.loginForm.value;
    const data = {
      email: formData.email,
      password: formData.password,
    };

    this.userService.login(data).subscribe(
      (response: any) => {
        this.ngxService.stop();
        this.dialogRef.close();
        localStorage.setItem('token', response.token);
        this.router.navigate(['/cafe/dashboard']);
      },
      (error) => {
        this.ngxService.stop();
        this.responseMessage =
          error.error?.message || GlobalConstants.genericError;
        this.snackbarService.openSnackBar(
          this.responseMessage || '',
          GlobalConstants.error
        ); // Default to empty string
      }
    );
  }
}
