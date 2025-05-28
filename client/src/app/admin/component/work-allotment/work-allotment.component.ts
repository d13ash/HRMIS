import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { DataService } from '../../../services/data.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import Swal from 'sweetalert2';
import { DatePipe } from '@angular/common';
import { DataService } from '../../../services/data.service';

// DataService
@Component({
  selector: 'app-work-allotment',
  templateUrl: './work-allotment.component.html',
  styleUrls: ['./work-allotment.component.scss']
})
export class WorkAllotmentComponent implements OnInit {

  displayedColumns = ['Project_work_allotment_id', 'emp_name', 'Financial_name', 'Project_name', 'module_name', 'Allotment_date', 'Start_date', 'End_date', 'Description', 'View', 'Action'];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) MatSort!: MatSort;





  ResType: any;
  CategoryData: any;
  UnitData: any;
  projectWorkDetail: any;
  datePipe: any;
  data: any;
  iseditmode: boolean = false;
  WorkAllotDataByid: any;
  data_id: any;
  ModuleData: any;
  projectwork: any;
  projectWorkDetaildata: any;
  allemp: any;
  project: any;
  FYear: any;

  approvalStatus: string = 'Pending';

  projectWorkAllotForm!: FormGroup;
  nestedform!: FormGroup
  selectedWorkValue = [];
  // allworks:string[]=[]; 
  allWorks: any;
  work_assign: number[] = [];
  response2: any;
  previewData: any;
  useEmpName: any;
  WorkApprovalForm: any;



  constructor(private fb: FormBuilder, private ds: DataService, private datepipe: DatePipe) { }
  ngOnInit(): void {
    this.getTable();
    this.getProject()
    this.getYear()
    this.arrafunc()

    this.projectWorkAllotForm = this.fb.group({
      Financial_id: [null, Validators.required],
      Project_ID: [null, Validators.required],
      project_module_id: [null, Validators.required],
      Emp_Id: [null, Validators.required],
      Description: ['', Validators.required],
      Allotment_date: [null, Validators.required],
      Start_date: [null, Validators.required],
      End_date: [null, Validators.required],

    });

    this.nestedform = this.fb.group({
      Project_work_allotment_id: [null], // refrence key 
      Project_work_main_id: [null] //value selected
    })

    this.WorkApprovalForm = this.fb.group({
      approval: [null],
    })
  }

  onApprovalChange(status: string,id:any): void {
    Swal.fire({
      title: 'Are you sure?',
      text: `You are about to set the status to "${status}".`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, proceed!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.WorkApprovalForm.patchValue({ approval: status }); // Update the form control with the new status
        this.setUpdate(id); // Call saveUpdate directly
        Swal.fire(
          'Updated!',
          `The status has been set to "${status}".`,
          'success'
        );
      } else {
        // If the user cancels, revert the radio button selection visually if needed
        // This is a bit tricky with radio buttons, but you can manage it by
        // ensuring the [checked] binding keeps the current this.approvalStatus
        // which hasn't changed if the user canceled.
      }
    });
  }

  arrafunc() {
    const numbers: number[] = [1, 2, 3, 4, 5];
    const commaSeparated: string = numbers.join(',');
    console.log(commaSeparated);
    for (let i = 0; i < numbers.length; i++) {
      console.log(numbers[i]);
    }
  }




  // here using same API for project ,module  and work  dropdown which are defined in project work detail components
  // get Project in dropdown

  getProject() {
    this.ds.getData('projectWorkDetail/allProjectmap').subscribe((result) => {
      console.log(result);
      this.project = result;
    })
  }

  // get module in dropdown
  onChangeModule(Project_id: any) {
    this.ds.getData('projectWorkDetail/allmodulemap/' + Project_id).subscribe((result) => {
      console.log(result);
      this.ModuleData = result;
    })
  }

  // get work in dropdown
  onChangeWork(project_module_id: any) {
    this.ds.getData('projectWorkDetail/allWork/' + project_module_id).subscribe((result) => {
      console.log(result);
      this.projectwork = result;
    })
  }

  // this api calling also use in financial-post component  so both component use same api only for year calling by those api
  getYear() {
    this.ds.getData('Financialyear_post/getFinancialYear').subscribe((result) => {
      console.log(result);
      this.FYear = result;
    })
  }

  // get employee in dropdown
  onChangeEmp(Financial_id: any) {
    this.ds.getData('projectWorkAllotment/allemp/' + Financial_id).subscribe(res => {
      this.allemp = res;
    });
  }

  // Show data in Mat Table
  getTable() {
    this.ds.getData('projectWorkAllotment/allProjectWorkdata').subscribe((result: any) => {
      this.projectWorkDetaildata = result;
      this.dataSource = new MatTableDataSource(result);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.MatSort;
      console.log(result);
    })
  }

  // preview in table
  getPreview(Emp_Id: any) {
    this.ds.getData('projectWorkAllotment/view/' + Emp_Id).subscribe((result: any) => {
      console.log(result)
      this.previewData = result;
      this.useEmpName = this.previewData[0]['Emp_First_Name_E']
      document.getElementById("addnews")?.scrollIntoView();
    })
  }

  // mat Table filter
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  newfunc() {
    let val = this.nestedform.value
    console.log('val of nested', val.Project_work_main_id);
    let val2 = val.Project_work_main_id

    val2.forEach((element: number) => {
      console.log(element);

    });

  }


  async onSubmit() {
    try {
      this.projectWorkAllotForm.patchValue //this will help to set the date format (for storing in database)
        ({
          Allotment_date: this.datepipe.transform(this.projectWorkAllotForm.get("Allotment_date")?.value, "yyyy-MM-dd"),
        });
      this.projectWorkAllotForm.patchValue //this will help to set the date format (for storing in database)
        ({
          Start_date: this.datepipe.transform(this.projectWorkAllotForm.get("Start_date")?.value, "yyyy-MM-dd"),
        });
      this.projectWorkAllotForm.patchValue //this will help to set the date format (for storing in database)
        ({
          End_date: this.datepipe.transform(this.projectWorkAllotForm.get("End_date")?.value, "yyyy-MM-dd"),
        });


      console.log(this.projectWorkAllotForm.value);
      let formdata1 = this.projectWorkAllotForm.value
      console.log(this.nestedform.value);
      let formdata2 = this.nestedform.value
      console.log(formdata2);

      this.newfunc()

      let response1: any = await this.ds.postData('projectWorkAllotment/PostProjectWorkAllotment', formdata1).toPromise();
      console.log(response1.id);
      console.log(formdata2.Project_work_main_id.length);
      for (let i = 0; i < formdata2.Project_work_main_id.length; i++) {
        // console.log(formdata2.Project_work_main_id[i]);

        this.ds.postData('projectWorkAllotment/postWorkAllotment', { "Project_work_main_id": formdata2.Project_work_main_id[i], "Project_work_allotment_id": response1.id }).subscribe((res: any) => {
          console.log(res);
          if (res) { Swal.fire("data updated successfully") };
        })
      }
    } catch (error) {
      console.error('Error', error);
    }
    this.getTable();
    this.onClear();
  }


  onClear() {
    this.projectWorkAllotForm.reset();
  }



  setUpdate(alloted_project_work_id: any) {
    console.log(this.WorkApprovalForm.value)
    console.log(alloted_project_work_id)
    console.log(this.WorkApprovalForm.controls['approval'].value);

    this.ds.putData("projectWorkAllotment/updateAllotedWork/" + alloted_project_work_id, { "approval": this.WorkApprovalForm.controls['approval'].value }).subscribe((res: any) => {
      console.log(res)
    });
  }



  //  Get single Data into form for update
  onedit(Project_work_allotment_id: any) {
    this.WorkAllotDataByid = this.projectWorkDetaildata.find((f: any) => f.Project_work_allotment_id === parseInt(Project_work_allotment_id));
    console.log(this.WorkAllotDataByid)
    this.iseditmode = true;
    this.data_id = Project_work_allotment_id;
    this.projectWorkAllotForm.patchValue
      ({
        Financial_id: this.WorkAllotDataByid.Financial_id,
        Project_ID: this.WorkAllotDataByid.Project_ID,
        project_module_id: this.WorkAllotDataByid.project_module_id,
        // Project_work_main_id:this.WorkAllotDataByid.Project_work_main_id,
        Emp_Id: this.WorkAllotDataByid.Emp_Id,
        Allotment_date: this.WorkAllotDataByid.Allotment_date,
        Start_date: this.WorkAllotDataByid.Start_date,
        End_date: this.WorkAllotDataByid.End_date,
        Description: this.WorkAllotDataByid.Description
      })
  }

  onupdate() {
    this.projectWorkAllotForm.patchValue //this will help to set the date format (for storing in database)
      ({
        Allotment_date: this.datepipe.transform(this.projectWorkAllotForm.get("Allotment_date")?.value, "yyyy-MM-dd"),
      });
    this.projectWorkAllotForm.patchValue //this will help to set the date format (for storing in database)
      ({
        Start_date: this.datepipe.transform(this.projectWorkAllotForm.get("Start_date")?.value, "yyyy-MM-dd"),
      });
    this.projectWorkAllotForm.patchValue //this will help to set the date format (for storing in database)
      ({
        End_date: this.datepipe.transform(this.projectWorkAllotForm.get("End_date")?.value, "yyyy-MM-dd"),
      });
    this.ds.putData('projectWorkAllotment/updateProjectWorkAllotment/' + this.data_id, this.projectWorkAllotForm.value).subscribe((result) => {
      console.log(result);
      this.data = result
      if (this.data) { Swal.fire("data updated successfully") };
      this.getTable()
      this.onClear();
    })
    this.iseditmode = false;
  }


  // Delete Resource detail
  ondelete(Project_work_allotment_id: any) {
    this.WorkAllotDataByid = this.projectWorkDetaildata.find((f: any) => f.Project_work_allotment_id === parseInt(Project_work_allotment_id)); //here we matching and extracting the selected id
    console.log(this.WorkAllotDataByid)
    this.data_id = Project_work_allotment_id;
    this.ds.Delete_Data('projectWorkAllotment/deletedataByid/' + this.data_id,).subscribe((result) => {
      console.log(result);
      this.data = result
      if (this.data) { Swal.fire('Data Deleted...') };
      this.getTable();
    })
  }


}

