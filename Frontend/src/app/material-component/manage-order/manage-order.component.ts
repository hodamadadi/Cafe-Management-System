import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { CategoryService } from 'src/app/services/category.service';
import { ProductService } from 'src/app/services/product.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { GlobalConstants } from 'src/app/shared/global-constants';
import * as FileSaver from 'file-saver';
import { BillService } from 'src/app/services/bill.service';

@Component({
  selector: 'app-manage-order',
  templateUrl: './manage-order.component.html',
  styleUrls: ['./manage-order.component.scss'],
})
export class ManageOrderComponent implements OnInit {
  displayedColumns: string[] = [
    'name',
    'category',
    'price',
    'quantity',
    'total',
    'delete',
    'edit',
  ];

  dataSource: any = [];
  manageOrderForm!: FormGroup;
  categories: any = []; // Ensure this is plural
  products: any = [];
  price: any;
  totalAmount: number = 0;
  responseMessage: any;

  constructor(
    private formBuilder: FormBuilder,
    private categoryService: CategoryService,
    private productService: ProductService,
    private snackbarService: SnackbarService,
    private ngxService: NgxUiLoaderService,
    private billService: BillService
  ) {}

  ngOnInit(): void {
    this.ngxService.start();
    this.initializeForm();
    this.getCategories(); // Ensure this method is called
  }

  private initializeForm(): void {
    this.manageOrderForm = this.formBuilder.group({
      name: [
        null,
        [Validators.required, Validators.pattern(GlobalConstants.nameRegex)],
      ],
      email: [
        null,
        [Validators.required, Validators.pattern(GlobalConstants.emailRegex)],
      ],
      contactNumber: [
        null,
        [
          Validators.required,
          Validators.pattern(GlobalConstants.contactNumberRegex),
        ],
      ],
      paymentMethod: [null, [Validators.required]],
      product: [null, [Validators.required]],
      category: [null, [Validators.required]],
      quantity: [1, [Validators.required, Validators.min(1)]],
      price: [null, [Validators.required]],
      total: [0, [Validators.required]],
    });
  }

  private getCategories(): void {
    this.categoryService.getCategory().subscribe(
      (response: any) => {
        this.ngxService.stop();
        this.categories = response; // Ensure this is plural
      },
      (error: any) => {
        this.handleError(error);
      }
    );
  }

  getProductsByCategory(value: any): void {
    this.productService.getProductsByCategory(value.id).subscribe(
      (response: any) => {
        this.products = response;
        this.resetProductFields();
      },
      (error: any) => {
        this.handleError(error);
      }
    );
  }

  private resetProductFields(): void {
    this.manageOrderForm.controls['price'].setValue('');
    this.manageOrderForm.controls['quantity'].setValue(1);
    this.manageOrderForm.controls['total'].setValue(0);
  }

  getProductDetails(value: any): void {
    this.productService.getById(value.id).subscribe(
      (response: any) => {
        this.price = response.price;
        this.manageOrderForm.controls['price'].setValue(response.price);
        this.manageOrderForm.controls['quantity'].setValue(1);
        this.manageOrderForm.controls['total'].setValue(this.price);
      },
      (error: any) => {
        this.handleError(error);
      }
    );
  }

  setQuantity(event: Event): void {
    // Updated to accept an event parameter
    const quantity = this.manageOrderForm.controls['quantity'].value;
    const price = this.manageOrderForm.controls['price'].value;

    // Ensure quantity is a valid number
    if (quantity > 0) {
      this.manageOrderForm.controls['total'].setValue(quantity * price);
    } else {
      this.manageOrderForm.controls['quantity'].setValue(1); // Reset to 1 if invalid
      this.manageOrderForm.controls['total'].setValue(price);
    }
  }

  validateProductAdd(): boolean {
    return (
      this.manageOrderForm.controls['total'].value === 0 ||
      this.manageOrderForm.controls['quantity'].value <= 0
    );
  }

  validateSubmit(): boolean {
    if (this.totalAmount === 0 || !this.manageOrderForm.valid) {
      this.snackbarService.openSnackBar(
        'Please fill all required fields.',
        'error'
      );
      return false;
    }
    return true;
  }

  add(): void {
    const formData = this.manageOrderForm.value;
    const productExists = this.dataSource.find(
      (e: { id: number }) => e.id === formData.product.id
    );

    if (!productExists) {
      this.totalAmount += formData.total;
      this.dataSource.push({
        id: formData.product.id,
        name: formData.product.name,
        category: formData.category.name,
        quantity: formData.quantity,
        price: formData.price,
        total: formData.total,
      });
      this.dataSource = [...this.dataSource]; // Trigger change detection
      this.snackbarService.openSnackBar(
        GlobalConstants.productAdded,
        'success'
      );
    } else {
      this.snackbarService.openSnackBar(
        GlobalConstants.productExistError,
        GlobalConstants.error
      );
    }
  }

  handleDeleteAction(index: number, element: any): void {
    // Updated to accept both parameters
    this.totalAmount -= element.total; // Subtract the total of the deleted item
    this.dataSource.splice(index, 1); // Remove the item from dataSource
    this.dataSource = [...this.dataSource]; // Trigger change detection
  }

  submitAction(): void {
    if (this.validateSubmit()) {
      this.ngxService.start();
      const formData = this.manageOrderForm.value;
      const data = {
        name: formData.name,
        email: formData.email,
        contactNumber: formData.contactNumber,
        paymentMethod: formData.paymentMethod,
        totalAmount: this.totalAmount,
        productDetails: JSON.stringify(this.dataSource),
      };
      this.billService.generateReport(data).subscribe(
        (response: any) => {
          this.downloadFile(response.uuid);
          this.resetForm();
          this.ngxService.stop();
        },
        (error: any) => {
          this.handleError(error);
        }
      );
    }
  }

  private resetForm(): void {
    this.manageOrderForm.reset(); // Reset the form
    this.dataSource = []; // Clear data source
    this.totalAmount = 0; // Reset total amount
  }

  private downloadFile(fileName: any): void {
    const data = { uuid: fileName };
    this.billService.getPDF(data).subscribe((response: any) => {
      FileSaver.saveAs(response, `${fileName}.pdf`);
      this.ngxService.stop();
    });
  }

  onEdit(element: any): void {
    console.log('Edit action for element:', element);
    // Implement logic for handling edit actions, like opening a form with pre-filled data
  }

  private handleError(error: any): void {
    this.ngxService.stop();
    this.responseMessage = error.error?.message || GlobalConstants.genericError;
    this.snackbarService.openSnackBar(
      this.responseMessage,
      GlobalConstants.error
    );
  }
}
