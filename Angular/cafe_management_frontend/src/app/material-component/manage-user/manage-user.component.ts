import { Component, OnInit } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { UserService } from '../../services/user.service';
import { SnackbarService } from '../../services/snackbar.service';
import { MatTableDataSource } from '@angular/material/table';
import { GlobalConstant } from '../../shared/global-constant';

@Component({
  selector: 'app-manage-user',
  templateUrl: './manage-user.component.html',
  styleUrl: './manage-user.component.scss'
})
export class ManageUserComponent implements OnInit{

  displayedColumns: string[] = ['name', 'email', 'contactNumber', 'status'];
  dataSource:any;
  responseMessage:any;

  constructor(
    private ngxService: NgxUiLoaderService,
    private userService: UserService,
    private snackbarService: SnackbarService
  ){}

  ngOnInit(): void {
   this.ngxService.start();
   this.tableData();
  }

  tableData(){
    this.userService.getUser().subscribe((response:any)=>{
      this.ngxService.stop();
      this.dataSource = new MatTableDataSource(response);
    }, (error) => {
      this.ngxService.stop();
      console.log(error);
      if (error.error?.message) {
        this.responseMessage = error.error?.message;
      } else {
        this.responseMessage = GlobalConstant.genericError;
      }
      this.snackbarService.openSnackBer(this.responseMessage, GlobalConstant.error);
    })
  }

  applyFilter(event:Event){
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  onChange(status:any, id:any){
    this.ngxService.start();
    var data = {
      status: status.toString(),
      id:id
    }
    this.userService.updateUser(data).subscribe((response:any)=>{
      this.ngxService.stop();
      this.responseMessage = response?.message;
      this.snackbarService.openSnackBer(this.responseMessage, "success");
    },(error)=>{
      this.ngxService.stop();
        console.log(error);
        if(error.error?.message){
          this.responseMessage = error.error?.message;
        }else{
          this.responseMessage = GlobalConstant.genericError;
        }
        this.snackbarService.openSnackBer(this.responseMessage,GlobalConstant.error);
    })
  }

}
