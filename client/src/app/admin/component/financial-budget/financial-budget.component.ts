import { Component,OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { DataService } from 'src/app/services/data.service';
import Swal from 'sweetalert2';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DataService } from '../../../services/data.service';
import { ChangeDetectorRef } from '@angular/core';

// DataService
@Component({
  selector: 'app-financial-budget',
  templateUrl: './financial-budget.component.html',
  styleUrls: ['./financial-budget.component.scss']
})
export class FinancialBudgetComponent implements OnInit {
    displayedColumns=['budget_head_id','budget_head_name','description','Financial_name','Action'];
    dataSource!: MatTableDataSource<any>;

     @ViewChild(MatPaginator) paginator!: MatPaginator ;
     @ViewChild(MatSort) MatSort!: MatSort ;

  BudgetForm!: FormGroup;
  year:any;
  data: any;
  allprojectBudgetDetail:any;
  budget_1:any;
  project:any;
  editproject: any;
  isEditMode: boolean = false;
  update1:any;
  data2:any;
  showForm: boolean = false;

  ngOnInit(): void {
    this.BudgetForm = this.fb.group({
      budget_head_name:[null,Validators.required],
      description:[null],
      Financial_id:['',Validators.required],

    });
    this.getyear(),
    this.getTable()

  }

  constructor(private fb:FormBuilder, private ds : DataService,private cdRef: ChangeDetectorRef){}
 //submit of BudgetForm..
 onSubmit() {
  if (this.BudgetForm.invalid) {
    this.BudgetForm.markAllAsTouched();

    Swal.fire({
      icon: 'warning',
      title: 'Validation Error',
      text: 'Please fill all required fields correctly before submitting.',
    });
    return;
  }

  console.log(this.BudgetForm.value);
  this.ds.postData('financial_budget/Postfinance_budget_master', this.BudgetForm.value).subscribe(res => {
    this.data = res;
    if (this.data) {
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Data Saved successfully!',
      });
    }
    this.getTable();
    this.onClear();
  });
}

    onClear() {

  this.BudgetForm.reset();

  this.BudgetForm.patchValue({
    budget_head_name: '',
    description: '',
    Financial_id: '',
  });

  Object.keys(this.BudgetForm.controls).forEach((key) => {
    const control = this.BudgetForm.get(key);
    control?.setErrors(null);
    control?.markAsPristine();
    control?.markAsUntouched();
  });

  this.cdRef.detectChanges();
}

getyear(){
  this.ds.getData('financial_budget/getfinancialyear').subscribe((result)=>{
    console.log(result);
    this.year = result;
  })
}

getTable(){
  this.ds.getData('financial_budget/mattable' ).subscribe((result:any)=>{
      this.allprojectBudgetDetail = result;

      if (result) {
        this.dataSource = new MatTableDataSource(result);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.MatSort;
      }
    },
    (error: any) => {
      console.error('Error fetching data:', error);
    }
  );
 }
// mat Table filter
  applyFilter(event: Event) {
  const filterValue = (event.target as HTMLInputElement).value;
  this.dataSource.filter = filterValue.trim().toLowerCase();
  }


//edit of BudgetForm
  onedit(updatedit: any){
    this.budget_1 = this.allprojectBudgetDetail.find((f : any) => f.budget_head_id === parseInt(updatedit)); //here we matching and extracting the selected id
   console.log(updatedit)
   document.getElementById("addnews")?.scrollIntoView();

     console.log(this.budget_1.Financial_id)
    this.editproject = updatedit
    this.isEditMode = true;
    this.showForm = true;
    this.BudgetForm.patchValue
    ({
     budget_head_name:this.budget_1.budget_head_name,
     description:this.budget_1.description,
     Financial_id :this.budget_1.Financial_id,
     });


    // this.iseditmode=true;
    console.log(this.budget_1.allprojectBudgetDetail);
  }
// updation of BudgetForm
 onUpdate(){
    console.log(this.editproject)
    console.log(this.BudgetForm.value);
    this.ds.putData('financial_budget/update/'+this.editproject, this.BudgetForm.value).subscribe(res =>
      {
        this.update1 = res;
        if(this.update1)
        this.getTable();
        this.onClear();
            Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Data updated successfully!',
        });
          });

  }
//Delete of BudgetForm
  ondelete(updateid: any){
    console.log(updateid)
       this.ds.Delete_Data('financial_budget/delete/'+ updateid,).subscribe((result) => {
         if (result)
         this.getTable();
           Swal.fire('Data Deleted...');
     });
   }

  // Show the add budget form
  showAddForm() {
    this.showForm = true;
    this.isEditMode = false;
    this.onClear(); // Clear any existing data
  }

  // Hide the form
  hideForm() {
    this.showForm = false;
    this.isEditMode = false;
    this.onClear(); // Clear form data when hiding
  }
}
