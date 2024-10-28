import { Component, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { DashboardService } from '../services/dashboard.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SnackbarService } from '../services/snackbar.service';
import { GlobalConstants } from '../shared/global-constants';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements AfterViewInit {
  responseMessage: any; // Variable to hold response messages
  data: any; // Variable to hold dashboard data

  constructor(
    private dashboardService: DashboardService,
    private ngxService: NgxUiLoaderService,
    private snackbarService: SnackbarService,
    private changeDetector: ChangeDetectorRef // Inject ChangeDetectorRef
  ) {
    this.ngxService.start(); // Start the loading spinner
    this.dashboardData(); // Fetch dashboard data
  }

  ngAfterViewInit() {
    // You can do something here if necessary
  }

  dashboardData() {
    this.dashboardService.getDetails().subscribe(
      (response: any) => {
        this.ngxService.stop(); // Stop the loading spinner
        console.log('Dashboard data fetched:', response); // Log the successful response
        this.data = response; // Assign the response data to the component's variable
        
        // Notify Angular about the change
        this.changeDetector.detectChanges(); // This ensures that Angular knows about the change
      },
      (error: any) => {
        this.ngxService.stop(); // Stop the loading spinner in case of error
        console.error('Error fetching dashboard data:', error); // Log the error
        // Check for error message in response
        this.responseMessage =
          error.error?.message || GlobalConstants.genericError; // Use a generic error message
        // Show the error message using snackbar
        this.snackbarService.openSnackBar(
          this.responseMessage,
          GlobalConstants.error
        );
      }
    );
  }
}
