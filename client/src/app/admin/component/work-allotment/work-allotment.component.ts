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
import { AuthService } from '../../../services/auth.service';

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
  designation: string = '';

  constructor(
    private fb: FormBuilder,
    private ds: DataService,
    private datepipe: DatePipe,
    private AS: AuthService
  ) {}
  ngOnInit(): void {
    this.getTable();
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

  // get project based on financial year
  onChangeFYear(Financial_id: any) {
    if (!Financial_id) {
      Swal.fire('Invalid', 'Financial year not selected.', 'warning');
      return;
    }
    this.projectWorkAllotForm.patchValue({ Financial_id });
    this.ds.getData('map_post_emp/getProject/' + Financial_id).subscribe((result) => {
      this.project = result;
      // Reset dependent dropdowns
      this.ModuleData = null;
      this.projectwork = null;
      this.allemp = null;
      this.projectWorkAllotForm.patchValue({ 
        Project_ID: null, 
        project_module_id: null,
        Emp_Id: null
      });
    });
  }

  // Load employees when both financial year and project are selected
  loadEmployees() {
    const Financial_id = this.projectWorkAllotForm.get('Financial_id')?.value;
    const Project_ID = this.projectWorkAllotForm.get('Project_ID')?.value;
    
    if (Financial_id && Project_ID) {
      this.onChangeEmp(Financial_id, Project_ID);
    }
  }

  // get module in dropdown
  onChangeModule(Project_id: any) {
    if (!Project_id) {
      Swal.fire('Invalid', 'Project not selected.', 'warning');
      return;
    }
    this.projectWorkAllotForm.patchValue({ Project_ID: Project_id });
    this.ds
      .getData('projectWorkDetail/allmodulemap/' + Project_id)
      .subscribe((result) => {
        console.log(result);
        this.ModuleData = result;
        // Reset dependent dropdowns
        this.projectwork = null;
        this.projectWorkAllotForm.patchValue({ 
          project_module_id: null
        });
      });
    
    // Load employees when project changes
    this.loadEmployees();
  }

  // get work in dropdown
  onChangeWork(project_module_id: any) {
    if (!project_module_id) {
      Swal.fire('Invalid', 'Module not selected.', 'warning');
      return;
    }
    this.projectWorkAllotForm.patchValue({ project_module_id });
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

  // get employee in dropdown based on financial year and project
  onChangeEmp(Financial_id: any, Project_id: any) {
    if (!Financial_id || !Project_id) {
      Swal.fire('Invalid', 'Financial year and project must be selected first.', 'warning');
      return;
    }
    this.ds
      .getData('projectWorkAllotment/allemp/' + Financial_id + '/' + Project_id)
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
    this.ds.getData('projectWorkAllotment/view/' + Emp_Id).subscribe((result: any) => {
      console.log(result)
      this.previewData = result;
      this.useEmpName = this.previewData[0]['Emp_First_Name_E']
      document.getElementById("addnews")?.scrollIntoView();
    });
    // Fetch designation for the selected employee
    this.ds.getData('projectWorkAllotment/designation/' + Emp_Id).subscribe((res: any) => {
      console.log(res);
      this.designation = res.Post_name || '';
    }, err => {
      this.designation = '';
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
    
    // Load cascading dropdowns in the correct order
    this.onChangeFYear(this.WorkAllotDataByid.Financial_id);
    
    // Use setTimeout to ensure the previous API calls complete before loading dependent data
    setTimeout(() => {
      this.onChangeModule(this.WorkAllotDataByid.Project_ID);
      setTimeout(() => {
        this.onChangeWork(this.WorkAllotDataByid.project_module_id);
      }, 100);
    }, 100);
    
    this.getPreview(this.WorkAllotDataByid.Emp_Id);
    this.projectWorkAllotForm.patchValue({
      Financial_id: this.WorkAllotDataByid.Financial_id,
      Project_ID: this.WorkAllotDataByid.Project_ID,
      project_module_id: this.WorkAllotDataByid.project_module_id,
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

    // Helper to get current month/year and work period
  getHeaderInfo() {
    const now = new Date();
    const monthYear = now.toLocaleString('default', { month: 'long', year: 'numeric' });
    const startPeriod = new Date(now);
    startPeriod.setDate(now.getDate() - 15);
    const endPeriod = new Date(now);
    endPeriod.setDate(now.getDate() + 15);
    return {
      monthYear,
      startPeriod,
      endPeriod,
      workPeriod: `Work period: Date ${startPeriod.toLocaleDateString('en-GB')} to ${endPeriod.toLocaleDateString('en-GB')}`
    };
  }

  // Download Excel
  downloadExcel() {
    if (!this.previewData || this.previewData.length === 0) {
      return;
    }
    const projectName = this.previewData[0].Project_name || '';
    const empName = this.useEmpName || '';
    const designation = this.designation || this.AS.currentUser?.Designation || '';
    const { monthYear, startPeriod, endPeriod, workPeriod } = this.getHeaderInfo();
    const address = 'Indira Gandhi Krishi Vishwavidyalaya, Raipur';
    // Filter data by work period
    const filtered = this.previewData.filter((row: any) => {
      const sd = new Date(row.Start_date);
      return sd >= startPeriod && sd <= endPeriod;
    });
    // Prepare data for Excel
    const wsData = [
      [address],
      [projectName],
      ['MONTHLY PROGRESS REPORT'],
      [`Name of Employee: ${empName}`],
      [`Designation: ${designation}`],
      [`Month & year: ${monthYear}`],
      [workPeriod],
      [],
      ['S No', 'Module Name', 'Work to be done', 'Start Date', 'End Date', 'Status', 'Remark']
    ];
    filtered.forEach((row: any, idx: number) => {
      wsData.push([
        idx + 1,
        row.module_name,
        row.Work_name,
        row.Start_date ? new Date(row.Start_date).toLocaleDateString() : '',
        row.End_date ? new Date(row.End_date).toLocaleDateString() : '',
        row.is_Work_complete || '',
        row.remark || ''
      ]);
    });
    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(wsData);
    // Add grid/borders
    const range = XLSX.utils.decode_range(ws['!ref']!);
    for (let R = range.s.r; R <= range.e.r; ++R) {
      for (let C = range.s.c; C <= range.e.c; ++C) {
        const cell = ws[XLSX.utils.encode_cell({ r: R, c: C })];
        if (cell) cell.s = { border: { top: { style: 'thin' }, bottom: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } } };
      }
    }
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
    const designation = this.designation || this.AS.currentUser?.Designation || '';
    const { monthYear, startPeriod, endPeriod, workPeriod } = this.getHeaderInfo();
    const address = 'Indira Gandhi Krishi Vishwavidyalaya, Raipur';
    // Filter data by work period
    const filtered = this.previewData.filter((row: any) => {
      const sd = new Date(row.Start_date);
      return sd >= startPeriod && sd <= endPeriod;
    });
    const doc = new jsPDF();
    let y = 15;
    const pageWidth = doc.internal.pageSize.getWidth();
    // Centered header
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text(address, pageWidth / 2, y, { align: 'center' });
    y += 9;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.text(projectName, pageWidth / 2, y, { align: 'center' });
    y += 8;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.text('MONTHLY PROGRESS REPORT', pageWidth / 2, y, { align: 'center' });
    y += 10;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.text(`Name of Employee: ${empName}`, pageWidth / 2, y, { align: 'center' });
    y += 7;
    doc.text(`Designation: ${designation}`, pageWidth / 2, y, { align: 'center' });
    y += 7;
    doc.text(`Month & year: ${monthYear}`, pageWidth / 2, y, { align: 'center' });
    y += 7;
    // Work period (left aligned, above table)
    doc.setFont('helvetica', 'bold');
    doc.text(workPeriod, 10, y);
    y += 5;
    // Table
    const tableData = filtered.map((row: any, idx: number) => [
      idx + 1,
      row.module_name,
      row.Work_name,
      row.Start_date ? new Date(row.Start_date).toLocaleDateString('en-GB') : '',
      row.End_date ? new Date(row.End_date).toLocaleDateString('en-GB') : '',
      row.is_Work_complete || '',
      row.remark || ''
    ]);
    autoTable(doc, {
      head: [[
        'S No',
        'Module Name',
        'Work to be done',
        'Start Date',
        'End Date',
        'Status',
        'Remark'
      ]],
      body: tableData,
      startY: y + 2,
      headStyles: { fontStyle: 'bold', fontSize: 11, halign: 'center' },
      bodyStyles: { fontSize: 9, halign: 'center' },
      theme: 'grid',
      styles: { cellPadding: 2 },
      didDrawPage: (data) => {
        // No-op, but can be used for custom drawing
      }
    });
    // Signature lines at the end
    const finalY = (doc as any).lastAutoTable.finalY || y + 30;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    // Left: Project Incharge
    doc.text(['Signature', '(Project Incharge)'], 10, finalY + 20);
    // Left-middle: MIS Nodal Officer
    doc.text(['Signature', '(MIS Nodal Officer)'], pageWidth / 2.7, finalY + 20);
    // Right: Employee
    doc.text(['Signature', '(Employee)'], pageWidth - 40, finalY + 20);
    doc.save(`${projectName}_WorkAllotment.pdf`);
  }

}