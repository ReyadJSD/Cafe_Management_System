import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CategoryService } from '../../services/category.service';
import { ProductService } from '../../services/product.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SnackbarService } from '../../services/snackbar.service';
import { BillService } from '../../services/bill.service';
import { GlobalConstant } from '../../shared/global-constant';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-manage-order',
  templateUrl: './manage-order.component.html',
  styleUrl: './manage-order.component.scss'
})
export class ManageOrderComponent implements OnInit {
  displayedColumns: string[] = ['name', 'category', 'price', 'quantity', 'total', 'edit'];
  dataSource: any = [];
  manageOrderForm: any = FormGroup;
  categorys: any = [];
  products: any = [];
  price: any;
  totalAmount: number = 0;
  responseMessage: any;
  constructor(
    private formBuilder: FormBuilder,
    private categoryService: CategoryService,
    private productService: ProductService,
    private billService: BillService,
    private ngxService: NgxUiLoaderService,
    private snackBar: SnackbarService
  ) { }
  ngOnInit(): void {
    this.ngxService.start();
    this.getCategorys();
    this.manageOrderForm = this.formBuilder.group({
      name: [null, [Validators.required, Validators.pattern(GlobalConstant.nameRegex)]],
      email: [null, [Validators.required, Validators.pattern(GlobalConstant.emailRegex)]],
      contactNumber: [null, [Validators.required, Validators.pattern(GlobalConstant.contactNumberRegex)]],
      paymentMethod: [null, [Validators.required]],
      product: [null, [Validators.required]],
      category: [null, [Validators.required]],
      quantity: [null, [Validators.required]],
      price: [null, [Validators.required]],
      total: [0, [Validators.required]]
    })
  }

  getCategorys() {
    this.categoryService.getFilteredCategory().subscribe((response: any) => {
      this.ngxService.stop();
      this.categorys = response;
    }, (error) => {
      this.ngxService.stop();
      console.log(error);
      if (error.error?.message) {
        this.responseMessage = error.error?.message;
      } else {
        this.responseMessage = GlobalConstant.genericError;
      }
      this.snackBar.openSnackBer(this.responseMessage, GlobalConstant.error);
    })
  }

  getProductByCategory(value: any) {
    this.productService.getProductByCategory(value.id).subscribe((response: any) => {
      this.products = response;
      this.manageOrderForm.controls['price'].setValue('');
      this.manageOrderForm.controls['quantity'].setValue('');
      this.manageOrderForm.controls['total'].setValue(0);
    }, (error) => {
      this.ngxService.stop();
      console.log(error);
      if (error.error?.message) {
        this.responseMessage = error.error?.message;
      } else {
        this.responseMessage = GlobalConstant.genericError;
      }
      this.snackBar.openSnackBer(this.responseMessage, GlobalConstant.error);
    })
  }

  getProductDetaisls(value: any) {
    this.productService.getProductById(value.id).subscribe((response: any) => {
      if (response && response.length > 0) {
        const product = response[0];
        this.price = product.price;
        this.manageOrderForm.controls['price'].setValue(this.price);
        this.manageOrderForm.controls['quantity'].setValue('1');  // Default quantity to 1
        this.manageOrderForm.controls['total'].setValue(this.price * 1);  // Update total
      }
    }, (error) => {
      this.ngxService.stop();
      console.log(error);
      if (error.error?.message) {
        this.responseMessage = error.error?.message;
      } else {
        this.responseMessage = GlobalConstant.genericError;
      }
      this.snackBar.openSnackBer(this.responseMessage, GlobalConstant.error);
    });
  }

  setQuantity(value: any) {
    var temp = this.manageOrderForm.controls['quantity'].value;
    if (temp > 0) {
      this.manageOrderForm.controls['total'].setValue(this.manageOrderForm.controls['quantity'].value * this.manageOrderForm.controls['price'].value);
    } else if (temp != '') {
      this.manageOrderForm.controls['quantity'].setValue('1');
      this.manageOrderForm.controls['total'].setValue(this.manageOrderForm.controls['quantity'].value * this.manageOrderForm.controls['price'].value);
    }
  }

  validateProductAdd() {
    if (this.manageOrderForm.controls['total'].value === 0 || this.manageOrderForm.controls['total'].value === null
      || this.manageOrderForm.controls['quantity'].value < 0
    ) {
      return true
    } else {
      return false;
    }
  }

  validateSubmit() {
    if (this.totalAmount === 0 || this.manageOrderForm.controls['name'].value === null ||
      this.manageOrderForm.controls['email'].value === null ||
      this.manageOrderForm.controls['contactNumber'].value === null ||
      this.manageOrderForm.controls['paymentMethod'].value === null) {
      return true;
    } else {
      return false;
    }
  }

  add() {
    var formData = this.manageOrderForm.value;
    var productName = this.dataSource.find((e: { id: number }) => e.id === formData.product.id);
    if(productName === undefined){
      this.totalAmount = this.totalAmount + formData.total;
      this.dataSource.push({id: formData.product.id, name: formData.product.name, category: formData.category.name, quantity: formData.quantity, price: formData.price, total: formData.total});
      this.dataSource = [...this.dataSource];
      this.snackBar.openSnackBer(GlobalConstant.productAdded,'success')
    }else{
      this.snackBar.openSnackBer(GlobalConstant.productExistingError, GlobalConstant.error);
    }
  }

  handleDeleteAction(value:any, element:any){
    this.totalAmount = this.totalAmount - element.total;
    this.dataSource.splice(value,1);
    this.dataSource = [...this.dataSource];
  }

  submitAction(){
    var formData = this.manageOrderForm.value;
    var data = {
      name: formData.name,
      contactNumber: formData.contactNumber,
      email: formData.email,
      paymentMethod: formData.paymentMethod,
      totalAmount: this.totalAmount.toString(),
      productDetails: JSON.stringify(this.dataSource)
    };
    this.ngxService.start();
    this.billService.generateReport(data).subscribe((response:any)=>{
      this.downloadFile(response?.uuid);
      this.manageOrderForm.reset();
      this.dataSource = []
      this.totalAmount = 0;
    }, (error) => {
      this.ngxService.stop();
      console.log(error);
      if (error.error?.message) {
        this.responseMessage = error.error?.message;
      } else {
        this.responseMessage = GlobalConstant.genericError;
      }
      this.snackBar.openSnackBer(this.responseMessage, GlobalConstant.error);
    })
  }

  downloadFile(fileName: string){
    var data = {
      uuid: fileName
    }
    this.billService.getPdf(data).subscribe((respons:any)=>{
      saveAs(respons, fileName+'.pdf');
      this.ngxService.stop();
    })
  }
}
