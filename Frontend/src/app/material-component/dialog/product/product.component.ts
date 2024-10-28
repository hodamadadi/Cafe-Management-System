import { Component, OnInit, EventEmitter, Inject } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CategoryService } from 'src/app/services/category.service';
import { ProductService } from 'src/app/services/product.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { GlobalConstants } from 'src/app/shared/global-constants';
import { Category } from 'src/app/services/models/category.model';
import { Product } from 'src/app/services/models/product.model'; // Import your Product model

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
})
export class ProductComponent implements OnInit {
  onAddProduct = new EventEmitter();
  onEditProduct = new EventEmitter();
  productForm: UntypedFormGroup;
  dialogAction: string = 'Add';
  action: string = 'Add';
  responseMessage: any;
  categories: Category[] = [];
  products: Product[] = []; // Add this property to hold the products

  constructor(
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    private formBuilder: UntypedFormBuilder,
    private productService: ProductService,
    public dialogRef: MatDialogRef<ProductComponent>,
    private categoryService: CategoryService,
    private snackbarService: SnackbarService
  ) {
    this.productForm = this.formBuilder.group({
      name: [
        null,
        [Validators.required, Validators.pattern(GlobalConstants.nameRegex)],
      ],
      categoryId: [null, Validators.required],
      price: [null, [Validators.required, Validators.min(0)]],
      description: [null, Validators.required],
    });
  }

  ngOnInit(): void {
    this.getCategories(); // Fetch categories when the component initializes
    this.getProducts(); // Fetch products when the component initializes
    if (this.dialogData.action === 'Edit') {
      this.dialogAction = 'Edit';
      this.action = 'Update';
      this.productForm.patchValue(this.dialogData.data);
    }
  }

  getCategories() {
    this.categoryService.getCategory().subscribe(
      (response: Category[]) => {
        this.categories = response;
      },
      (error: any) => {
        this.handleError(error);
      }
    );
  }

  getProducts() {
    // Method to fetch products
    this.productService.getProducts().subscribe(
      (response: Product[]) => {
        this.products = response; // Store the products in the component
      },
      (error: any) => {
        this.handleError(error);
      }
    );
  }

  handleSubmit() {
    if (this.dialogAction === 'Edit') {
      this.edit();
    } else {
      this.add();
    }
  }

  add() {
    if (this.productForm.invalid) {
      this.snackbarService.openSnackBar(
        GlobalConstants.formInvalid,
        GlobalConstants.error
      );
      return;
    }

    const formData = this.productForm.value;
    console.log('Form data:', formData); // Log the form data

    const data = {
      name: formData.name,
      categoryId: formData.categoryId,
      price: formData.price,
      description: formData.description,
    };
    console.log('Sending data:', data); // Log the data being sent

    this.productService.add(data).subscribe(
      (response: any) => {
        this.dialogRef.close();
        this.onAddProduct.emit();
        this.responseMessage = response.message;
        this.snackbarService.openSnackBar(this.responseMessage, 'success');
        this.getProducts(); // Refresh the product list after adding
      },
      (error: any) => {
        this.handleError(error);
      }
    );
  }

  edit() {
    const formData = this.productForm.value;
    const data = {
      id: this.dialogData.data.id,
      name: formData.name,
      categoryId: formData.categoryId,
      price: formData.price,
      description: formData.description,
    };
    this.productService.update(data).subscribe(
      (response: any) => {
        this.dialogRef.close();
        this.onEditProduct.emit();
        this.responseMessage = response.message;
        this.snackbarService.openSnackBar(this.responseMessage, 'success');
        this.productForm.reset(); // Reset the form after successful edit
        this.getProducts(); // Refresh the product list after editing
      },
      (error: any) => {
        this.handleError(error);
      }
    );
  }

  private handleError(error: any) {
    if (error.error?.message) {
      this.responseMessage = error.error.message;
    } else {
      this.responseMessage = GlobalConstants.genericError;
    }
    this.snackbarService.openSnackBar(
      this.responseMessage,
      GlobalConstants.error
    );
  }
}
