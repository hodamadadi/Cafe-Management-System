import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { GlobalConstants } from 'src/app/shared/global-constants';
import { UserService } from 'src/app/user.service';

export interface User {
  name: string;
  email: string;
  contactNumber: string;
  status: string; // Adjust as necessary
}

@Component({
  selector: 'app-manage-user',
  templateUrl: './manage-user.component.html',
  styleUrls: ['./manage-user.component.scss'],
})
export class ManageUserComponent implements OnInit {
  displayedColumns: string[] = ['name', 'email', 'contactNumber', 'status'];
  dataSource: MatTableDataSource<User> = new MatTableDataSource<User>([]);
  responseMessage: any;

  constructor(
    private ngxService: NgxUiLoaderService,
    private userService: UserService,
    private snackbarService: SnackbarService
  ) {}

  ngOnInit(): void {
    this.ngxService.start();
    this.tableData();
  }

  tableData() {
    this.userService.getUsers().subscribe(
      (response: User[]) => {
        this.ngxService.stop();
        this.dataSource = new MatTableDataSource<User>(response);
      },
      (error: any) => {
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

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  handleChangeAction(status: any, id: any) {
    this.ngxService.start();
    const data = {
      status: status.toString(),
      id: id,
    };
    this.userService.update(data).subscribe(
      (response: any) => {
        this.ngxService.stop();
        this.responseMessage = response?.message;
        this.snackbarService.openSnackBar(this.responseMessage, 'success');
      },
      (error: any) => {
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

  setQuantity(event: KeyboardEvent) {
    // Handle quantity logic
  }

  handleDeleteAction(index: number, element: any) {
    // Handle delete logic
  }
}
