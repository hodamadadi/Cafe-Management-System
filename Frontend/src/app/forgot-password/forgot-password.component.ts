import { SnackbarService } from './../services/snackbar.service';
import { UserService } from './../services/user.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { GlobalConstants } from '../shared/global-constants';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent implements OnInit {
  forgotPasswordForm: FormGroup;
  responseMessage: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private dialogRef: MatDialogRef<ForgotPasswordComponent>,
    private ngxService: NgxUiLoaderService,
    private snackbarService: SnackbarService
  ) {
    // Initialize the form in the constructor
    this.forgotPasswordForm = this.formBuilder.group({
      email: [
        null,
        [Validators.required, Validators.pattern(GlobalConstants.emailRegex)],
      ],
    });
  }

  ngOnInit(): void {
    // Form initialization can be omitted if already done in the constructor
    this.forgotPasswordForm = this.formBuilder.group({
      email: [
        null,
        [Validators.required, Validators.pattern(GlobalConstants.emailRegex)],
      ],
    });
  }

  handleSubmit() {
    this.ngxService.start();
    const formData = this.forgotPasswordForm.value;
    const data = {
      email: formData.email,
    };

    this.userService.forgotPassword(data).subscribe(
      (response: any) => {
        this.ngxService.stop();
        this.responseMessage = response.message; // No need for optional chaining here
        this.dialogRef.close();
        this.snackbarService.openSnackBar(this.responseMessage, '');
      },
      (error) => {
        this.ngxService.stop();
        this.responseMessage =
          error.error?.message || GlobalConstants.genericError; // Simplified error handling
        this.snackbarService.openSnackBar(
          this.responseMessage,
          GlobalConstants.error
        );
      }
    );
  }
}
