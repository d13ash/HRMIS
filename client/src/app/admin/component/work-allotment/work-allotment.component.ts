import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { DataService } from '../../../services/data.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import Swal from 'sweetalert2';
import { DatePipe } from '@angular/common';
import { DataService } from '../../../services/data.service';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// DataService
@Component({
  selector: 'app-work-allotment',
  templateUrl: './work-allotment.component.html',
  styleUrls: ['./work-allotment.component.scss'],
})
export class WorkAllotmentComponent implements OnInit {
  displayedColumns = [
    'Project_work_allotment_id',
    'emp_name',
    'Financial_name',
    'Project_name',
    'module_name',
    'Allotment_date',
    'Start_date',
    'End_date',
    'Description',
    'View',
    'Action',
  ];
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
  aprlEdit: boolean = true; // for approval status edit

  approvalStatus: string = 'Pending';

  projectWorkAllotForm!: FormGroup;
  nestedform!: FormGroup;
  selectedWorkValue = [];
  // allworks:string[]=[];
  allWorks: any;
  work_assign: number[] = [];
  response2: any;
  previewData: any;
  useEmpName: any;
  useEmpId: any;
  WorkApprovalForm: any;

  constructor(
    private fb: FormBuilder,
    private ds: DataService,
    private datepipe: DatePipe
  ) {}
  ngOnInit(): void {
    this.getTable();
    this.getProject();
    this.getYear();
    this.arrafunc();

    this.projectWorkAllotForm = this.fb.group({
      Financial_id: ['', Validators.required],
      Project_ID: ['', Validators.required],
      project_module_id: ['', Validators.required],

      Emp_Id: ['', Validators.required],
      Allotment_date: ['', Validators.required],
      Start_date: ['', Validators.required],
      End_date: ['', Validators.required],
      Description: [''],
    });

    this.nestedform = this.fb.group({
      Project_work_allotment_id:['', Validators.required], // refrence key
      Project_work_main_id:['', Validators.required], //value selected
    });

    this.WorkApprovalForm = this.fb.group({
      approval: [null],
    });
  }

  isEditable(status: string) {
    const s = status.toLowerCase();
    if (s.includes('finished')) return false;
    else return true;
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
              this.ds.putData("projectWorkAllotment/updateAllotedWork/" + id, { "approval": status }).subscribe((res: any) => {
                        Swal.fire(
                        'Updated!',
                        `The status has been set to "${status}".`,
                        'success'
                      );
                      this.getPreview(this.useEmpId);
                      });
            }
    });
  }

   statusColor(status: string): string {
    const s = status.toLowerCase();
    if (s.includes('finished')) {
      this.aprlEdit = false;
      return 'finished';
    }
    if (s.includes('running')) {
      this.aprlEdit = true;
      return 'running';
    }
    this.aprlEdit = true;
    return 'incomplete';
  }

  approvalColor(status: string): string {
    const s = status.toLowerCase();
    if (s.includes('approved')) return 'approved';
    if (s.includes('rejected')) return 'rejected';
    return 'pending';
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
    });
  }

  // get module in dropdown
  onChangeModule(Project_id: any) {
    this.ds
      .getData('projectWorkDetail/allmodulemap/' + Project_id)
      .subscribe((result) => {
        console.log(result);
        this.ModuleData = result;
      });
  }

  // get work in dropdown
  onChangeWork(project_module_id: any) {
    this.ds
      .getData('projectWorkDetail/allWork/' + project_module_id)
      .subscribe((result) => {
        console.log(result);
        this.projectwork = result;
      });
  }

  // this api calling also use in financial-post component  so both component use same api only for year calling by those api
  getYear() {
    this.ds
      .getData('Financialyear_post/getFinancialYear')
      .subscribe((result) => {
        console.log(result);
        this.FYear = result;
      });
  }

  // get employee in dropdown
  onChangeEmp(Financial_id: any) {
    this.ds
      .getData('projectWorkAllotment/allemp/' + Financial_id)
      .subscribe((res) => {
        this.allemp = res;
      });
  }

  // Show data in Mat Table
  getTable() {
    this.ds
      .getData('projectWorkAllotment/allProjectWorkdata')
      .subscribe((result: any) => {
        this.projectWorkDetaildata = result;
        this.dataSource = new MatTableDataSource(result);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.MatSort;
        console.log(result);
      });
  }

  // preview in table
  getPreview(Emp_Id: any) {
    this.ds
      .getData('projectWorkAllotment/view/' + Emp_Id)
      .subscribe((result: any) => {
        console.log(result)
        this.useEmpId = Emp_Id;
        this.previewData = result;
        this.useEmpName = this.previewData[0]['Emp_First_Name_E'];
        document.getElementById('addnews')?.scrollIntoView();
      });
  }

  // mat Table filter
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  newfunc() {
    let val = this.nestedform.value;
    console.log('val of nested', val.Project_work_main_id);
    let val2 = val.Project_work_main_id;

    val2.forEach((element: number) => {
      console.log(element);
    });
  }

  async onSubmit() {
    if (this.projectWorkAllotForm.invalid ) {
    Swal.fire({
      icon: 'warning',
      title: 'Validation Error',
      text: 'Please fill all required fields correctly.',
    });
    this.projectWorkAllotForm.markAllAsTouched();
    this.nestedform.markAllAsTouched();
    return;
  }
    try {
      this.projectWorkAllotForm.patchValue(
        //this will help to set the date format (for storing in database)
        {
          Allotment_date: this.datepipe.transform(
            this.projectWorkAllotForm.get('Allotment_date')?.value,
            'yyyy-MM-dd'
          ),
        }
      );
      this.projectWorkAllotForm.patchValue(
        //this will help to set the date format (for storing in database)
        {
          Start_date: this.datepipe.transform(
            this.projectWorkAllotForm.get('Start_date')?.value,
            'yyyy-MM-dd'
          ),
        }
      );
      this.projectWorkAllotForm.patchValue(
        //this will help to set the date format (for storing in database)
        {
          End_date: this.datepipe.transform(
            this.projectWorkAllotForm.get('End_date')?.value,
            'yyyy-MM-dd'
          ),
        }
      );

      console.log(this.projectWorkAllotForm.value);
      let formdata1 = this.projectWorkAllotForm.value;
      console.log(this.nestedform.value);
      let formdata2 = this.nestedform.value;
      // console.log(formdata2);

      this.newfunc();

      let response1: any = await this.ds
        .postData('projectWorkAllotment/PostProjectWorkAllotment', formdata1)
        .toPromise();
      console.log(response1.id);
      console.log(formdata2.Project_work_main_id.length);
      for (let i = 0; i < formdata2.Project_work_main_id.length; i++) {
        // console.log(formdata2.Project_work_main_id[i]);

        this.ds
          .postData('projectWorkAllotment/postWorkAllotment', {
            Project_work_main_id: formdata2.Project_work_main_id[i],
            Project_work_allotment_id: response1.id,
          })
          .subscribe((res: any) => {
            console.log(res);
            if (res) {
               Swal.fire('Success!', 'Data saved successfully.', 'success');
            }
          });
      }
    } catch (error) {
      console.error('Error', error);
    }
    this.getTable();
    this.onClear();
  }

  onClear() {
    this.projectWorkAllotForm.reset();
    this.projectWorkAllotForm.markAsPristine();
    this.projectWorkAllotForm.markAsUntouched();

    this.nestedform.reset();
    this.nestedform.markAsPristine();
    this.nestedform.markAsUntouched();

    this.WorkApprovalForm.reset();
    this.WorkApprovalForm.markAsPristine();
    this.WorkApprovalForm.markAsUntouched();

    this.iseditmode = false;
  }

  //  Get single Data into form for update
 onedit(Project_work_allotment_id: any) {
    this.WorkAllotDataByid = this.projectWorkDetaildata.find((f: any) => f.Project_work_allotment_id === parseInt(Project_work_allotment_id));
    console.log(this.WorkAllotDataByid)
    this.iseditmode = true;
    this.data_id = Project_work_allotment_id;
    this.ds.getData('projectWorkAllotment/getAllotedWork/' + this.data_id).subscribe((result: any) => {
      const works = result.map((item: any) => item.Project_work_main_id);
      this.nestedform.patchValue({
        Project_work_main_id: works
      });
    })
    this.onChangeWork(this.WorkAllotDataByid.project_module_id);
    this.onChangeEmp(this.WorkAllotDataByid.Financial_id);
    this.onChangeModule(this.WorkAllotDataByid.Project_ID);
    this.getPreview(this.WorkAllotDataByid.Emp_Id); //
    this.projectWorkAllotForm.patchValue

      ({
        Financial_id: this.WorkAllotDataByid.Financial_id,
        Project_ID: this.WorkAllotDataByid.Project_ID,
        project_module_id: this.WorkAllotDataByid.project_module_id,
        // Project_work_main_id:this.WorkAllotDataByid.Project_work_main_id,
        Project_work_main_id: this.WorkAllotDataByid.Project_work_main_id,
        Emp_Id: this.WorkAllotDataByid.Emp_Id,
        Allotment_date: this.WorkAllotDataByid.Allotment_date,
        Start_date: this.WorkAllotDataByid.Start_date,
        End_date: this.WorkAllotDataByid.End_date,
        Description: this.WorkAllotDataByid.Description
      })
  }

  onupdate() {
    this.projectWorkAllotForm.patchValue(
      //this will help to set the date format (for storing in database)
      {
        Allotment_date: this.datepipe.transform(
          this.projectWorkAllotForm.get('Allotment_date')?.value,
          'yyyy-MM-dd'
        ),
      }
    );
    this.projectWorkAllotForm.patchValue(
      //this will help to set the date format (for storing in database)
      {
        Start_date: this.datepipe.transform(
          this.projectWorkAllotForm.get('Start_date')?.value,
          'yyyy-MM-dd'
        ),
      }
    );
    this.projectWorkAllotForm.patchValue(
      //this will help to set the date format (for storing in database)
      {
        End_date: this.datepipe.transform(
          this.projectWorkAllotForm.get('End_date')?.value,
          'yyyy-MM-dd'
        ),
      }
    );
    this.ds
      .putData(
        'projectWorkAllotment/updateProjectWorkAllotment/' + this.data_id,
        this.projectWorkAllotForm.value
      )
      .subscribe((result) => {
        console.log(result);
        this.data = result;
        if (this.data) {
          Swal.fire('Success!', 'Data saved successfully.', 'success');
        }
        this.getTable();
        this.onClear();
      });
    this.iseditmode = false;
  }

  // Delete Resource detail
  ondelete(Project_work_allotment_id: any) {
    this.WorkAllotDataByid = this.projectWorkDetaildata.find(
      (f: any) =>
        f.Project_work_allotment_id === parseInt(Project_work_allotment_id)
    ); //here we matching and extracting the selected id
    console.log(this.WorkAllotDataByid);
    this.data_id = Project_work_allotment_id;
    this.ds
      .Delete_Data('projectWorkAllotment/deletedataByid/' + this.data_id)
      .subscribe((result) => {
        console.log(result);
        this.data = result;
        if (this.data) {
          Swal.fire('Data Deleted...');
        }
        this.getTable();
      });
  }

  // Download Excel
  downloadExcel() {
    if (!this.previewData || this.previewData.length === 0) {
      return;
    }
    const projectName = this.previewData[0].Project_name || '';
    const empName = this.useEmpName || '';
    const designation = this.previewData[0].Designation || '';
    const session = this.previewData[0].Session || '';
    const address = 'Indra Gandhi Krishi Vishwavidyalaya';

    // Prepare data for Excel
    const wsData = [
      [projectName],
      [address],
      [empName],
      [designation],
      [session],
      [],
      ['Module', 'Work', 'Start Date', 'End Date', 'Status']
    ];
    this.previewData.forEach((row: any) => {
      wsData.push([
        row.module_name,
        row.Work_name,
        row.Start_date ? new Date(row.Start_date).toLocaleDateString() : '',
        row.End_date ? new Date(row.End_date).toLocaleDateString() : '',
        row.is_Work_complete || ''
      ]);
    });
    wsData.push([]);
    wsData.push(['', '', '', '', 'Signature:']);

    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(wsData);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Work Allotment');
    XLSX.writeFile(wb, `${projectName}_WorkAllotment.xlsx`);
  }

  // Download PDF
  downloadPDF() {
    if (!this.previewData || this.previewData.length === 0) {
      return;
    }
    const projectName = this.previewData[0].Project_name || '';
    const empName = this.useEmpName || '';
    const designation = this.previewData[0].Designation || '';
    const session = this.previewData[0].Session || '';
    const address = 'Indra Gandhi Krishi Vishwavidyalaya';

    const doc = new jsPDF();
    let y = 10;
    doc.setFontSize(16);
    doc.text(projectName, 10, y);
    y += 8;
    doc.setFontSize(12);
    doc.text(address, 10, y);
    y += 8;
    doc.text(`Name: ${empName}`, 10, y);
    y += 8;
    doc.text(`Designation: ${designation}`, 10, y);
    y += 8;
    doc.text(`Session: ${session}`, 10, y);
    y += 8;

    // Table
    const tableData = this.previewData.map((row: any) => [
      row.module_name,
      row.Work_name,
      row.Start_date ? new Date(row.Start_date).toLocaleDateString() : '',
      row.End_date ? new Date(row.End_date).toLocaleDateString() : '',
      row.is_Work_complete || ''
    ]);
    autoTable(doc, {
      head: [['Module', 'Work', 'Start Date', 'End Date', 'Status']],
      body: tableData,
      startY: y + 2
    });
    // Signature space
    const finalY = (doc as any).lastAutoTable.finalY || y + 30;
    doc.text('Signature:', 150, finalY + 20);
    doc.save(`${projectName}_WorkAllotment.pdf`);
  }
}
