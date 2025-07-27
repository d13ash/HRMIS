
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataService } from '../../../services/data.service';
import { AuthService } from '../../../services/auth.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-my-work',
  templateUrl: './my-work.component.html',
  styleUrls: ['./my-work.component.scss']
})
export class MyWorkComponent implements OnInit {

  myWorkForm!: FormGroup;

  // Material Table properties
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  
  dataSource = new MatTableDataSource<any>([]);
  displayedColumns: string[] = [
    'sr',
    'Project_name',
    'module_name', 
    'Work_name',
    'Start_date',
    'End_date',
    'Description',
    'status_actions',
    'approval'
  ];

  arr: any = [];
  arr1: any = [];
  previewData: any;
  useEmpName: any;
  countData: any;
  totalCount: number = 10;
  countLength: any;
  countApproval: any;

  constructor(private fb: FormBuilder, private ds: DataService, private AS: AuthService) {}
  
  ngOnInit(): void {
    this.myWorkForm = this.fb.group({
      is_Work_complete: [null, Validators.required],
    });
    this.getPreview();
  }

  // preview in table
  getPreview() {
    this.ds.getData('projectWorkAllotment/view/' + this.AS.currentUser.Emp_Id).subscribe((result: any) => {
      console.log(result);
      this.previewData = result;
      this.dataSource = new MatTableDataSource(result);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      
      if (this.previewData && this.previewData.length > 0) {
        this.useEmpName = this.previewData[0]['Emp_First_Name_E'];
      }
      document.getElementById("addnews")?.scrollIntoView();
    });
  }

  // Search filter function
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  // Update work status with confirmation
  updateWorkStatus(alloted_project_work_id: any, status: string, statusDisplayName: string): void {
    Swal.fire({
      title: 'Confirm Status Update',
      text: `Are you sure you want to set this work status to "${statusDisplayName}"?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Update Status',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this.ds.putData("projectWorkAllotment/updateAllotedWork/" + alloted_project_work_id, {
          "is_Work_complete": status
        }).subscribe(
          (res: any) => {
            Swal.fire({
              title: 'Success!',
              text: `Work status has been updated to "${statusDisplayName}".`,
              icon: 'success',
              confirmButtonText: 'OK'
            });
            this.getPreview(); // Refresh the data
          },
          (error: any) => {
            Swal.fire({
              title: 'Error!',
              text: 'Failed to update work status. Please try again.',
              icon: 'error',
              confirmButtonText: 'OK'
            });
            console.error('Error updating work status:', error);
          }
        );
      }
    });
  }

  // Check if status can be changed (prevent changes on finished work)
  isStatusEditable(currentStatus: string): boolean {
    return currentStatus?.toLowerCase() !== 'finished';
  }

  //update in table - keeping old method for backward compatibility
  submitForm(alloted_project_work_id: any) {
    console.log(this.myWorkForm.value);
    console.log(alloted_project_work_id);
    console.log(this.myWorkForm.controls['is_Work_complete'].value);
    this.ds.putData("projectWorkAllotment/updateAllotedWork/" + alloted_project_work_id, {
      "is_Work_complete": this.myWorkForm.controls['is_Work_complete'].value
    }).subscribe((res: any) => {
      console.log(res);
    });
  }

  // old code for progress used in progressbar

  // // count work
  // getWorkCount(){
  //   this.ds.getData('projectWorkAllotment/getWorkCount').subscribe((res:any)=>{
  //     this.countData = res
  //     console.log(res)
  //     this.countLength = this.countData.length
  //     console.log(this.countData.length)
  //   })
  // }

  //   // count work
  //   getApprovalCount(){
  //     this.ds.getData('projectWorkAllotment/getApprove').subscribe((res:any)=>{
  //       this.countApproval = res
  //       console.log(res)
  //       this.countLength = this.countApproval.length
  //       console.log(this.countApproval.length)
  //     })
  //   }




  // newfunc(){
  //   this.countData.forEach((element:any) => {
  //     console.log(element);

  //     this.countApproval.forEach((item:any)=>{
  //       if (element.Project_name == item.Project_name ){
  //         let a={Project_name:element.Project_name,percent:Math.floor((item.TotalWor/element.totalWork)*100)}
  //         console.log(a)
  //         this.arr.push(a);
  //         this.arr1.push(element.Project_name);
  //       }

  //     })
  //     if(!this.arr1.includes(element.Project_name)){
  //       let a={Project_name:element.Project_name,percent:0}
  //     console.log(a)
  //     this.arr.push(a)
  //     }
  //   });
  //   console.log(this.arr);
  // }



}

