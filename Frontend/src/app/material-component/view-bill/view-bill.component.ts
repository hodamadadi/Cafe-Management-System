import { ViewBillProductsComponent } from './../dialog/view-bill-products/view-bill-products.component';
import { filter } from 'rxjs/operators';
import { BillService } from 'src/app/services/bill.service';
import { Component, OnInit } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { GlobalConstants } from 'src/app/shared/global-constants';
import { ConfirmationComponent } from '../dialog/confirmation/confirmation.component';
import { saveAs } from 'file-saver';

// Define an interface for Bill data structure
interface Bill {
  id: number;
  name: string;
  email: string;
  contactNumber: string;
  paymentMethod: string;
  total: number;
  uuid?: string; // Optional property if needed for the report
}

@Component({
  selector: 'app-view-bill',
  templateUrl: './view-bill.component.html',
  styleUrls: ['./view-bill.component.scss'],
})
export class ViewBillComponent implements OnInit {
  displayedColumns: string[] = [
    'name',
    'email',
    'contactNumber',
    'paymentMethod',
    'total',
    'view',
  ];

  // Initialize dataSource with an empty MatTableDataSource
  dataSource: MatTableDataSource<Bill> = new MatTableDataSource();

  responseMessage: string = ''; // Initialized with an empty string

  constructor(
    private billService: BillService,
    private ngxService: NgxUiLoaderService,
    private dialog: MatDialog,
    private snackbarService: SnackbarService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.ngxService.start();
    this.tableData();
  }

  tableData() {
    this.billService.getBills().subscribe(
      (response: Bill[]) => {
        this.ngxService.stop();
        this.dataSource = new MatTableDataSource(response);
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

  handleViewAction(values: Bill) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = { data: values };
    dialogConfig.width = '100%';

    const dialogRef = this.dialog.open(ViewBillProductsComponent, dialogConfig);
    this.router.events.subscribe(() => {
      dialogRef.close();
    });
  }

  downloadReportAction(values: Bill) {
    this.ngxService.start();
    const data = {
      name: values.name,
      email: values.email,
      uuid: values.uuid,
      contactNumber: values.contactNumber,
      paymentMethod: values.paymentMethod,
      totalAmount: values.total,
    };

    this.billService.getPDF(data).subscribe(
      (response) => {
        saveAs(response, `${values.uuid}.pdf`);
        this.ngxService.stop();
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

  handleDeleteAction(values: Bill) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      message: `Are you sure you want to delete the bill for ${values.name}?`,
    };

    const dialogRef = this.dialog.open(ConfirmationComponent, dialogConfig);
    const sub = dialogRef.componentInstance.onEmitStatusChange.subscribe(
      (response) => {
        this.ngxService.start();
        this.deleteProduct(values.id);
        dialogRef.close();
      }
    );

    // Unsubscribe from the observable to avoid memory leaks
    dialogRef.afterClosed().subscribe(() => {
      sub.unsubscribe();
    });
  }

  deleteProduct(id: number) {
    this.billService.delete(id).subscribe(
      (response: any) => {
        this.ngxService.stop();
        this.tableData();
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
}
