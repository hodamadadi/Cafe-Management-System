import { Component, OnInit } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { UserService } from 'src/app/services/user.service';
import { GlobalConstants } from 'src/app/shared/global-constants';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
})
export class ChangePasswordComponent implements OnInit {
  changePasswordForm!: UntypedFormGroup;
  responseMessage: string = '';

  constructor(
    private formBuilder: UntypedFormBuilder,
    private userService: UserService,
    public dialogRef: MatDialogRef<ChangePasswordComponent>,
    private ngxService: NgxUiLoaderService,
    private snackbarService: SnackbarService
  ) {}

  ngOnInit(): void {
    this.changePasswordForm = this.formBuilder.group({
      oldPassword: [null, [Validators.required]],
      newPassword: [null, [Validators.required]],
      confirmPassword: [null, Validators.required],
    });
  }

  validateSubmit(): boolean {
    const { newPassword, confirmPassword } = this.changePasswordForm.controls;
    return (
      newPassword.value !== confirmPassword.value ||
      this.changePasswordForm.invalid
    );
  }

  handleChangePasswordSubmit(): void {
    if (this.validateSubmit()) {
      return; // Prevent submission if validation fails
    }

    this.ngxService.start();
    const formData = this.changePasswordForm.value;
    const data = {
      oldPassword: formData.oldPassword,
      newPassword: formData.newPassword,
      confirmPassword: formData.confirmPassword,
    };

    this.userService.changePassword(data).subscribe(
      (response: any) => {
        this.ngxService.stop();
        this.responseMessage =
          response?.message || 'Password changed successfully';
        this.dialogRef.close();
        this.snackbarService.openSnackBar(this.responseMessage, 'Success!');
      },
      (error) => {
        this.ngxService.stop();
        this.responseMessage =
          error.error?.message || GlobalConstants.genericError;
        this.snackbarService.openSnackBar(
          this.responseMessage,
          GlobalConstants.error
        );
      }
    );
  }
}
