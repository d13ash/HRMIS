import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { DataService } from 'src/app/services/data.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DataService } from '../../../services/data.service';
import Swal from 'sweetalert2';

// DataService
@Component({
  selector: 'app-financial-budget-allotment',
  templateUrl: './financial-budget-allotment.component.html',
  styleUrls: ['./financial-budget-allotment.component.scss'],
})
export class FinancialBudgetAllotmentComponent implements OnInit {
  displayedColumns = [
    'budget_allotment_id',
    'budget_head_name',
    'amount',
    'Financial_name',
    'Action',
  ];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) MatSort!: MatSort;

  Budget_Allotment_Form!: FormGroup;
  year: any;
  head_name: any;
  data: any;
  allBudget_Allotment_Detail: any;
  budgetallotment_1: any;
  editproject: any;
  update1: any;
  isEditMode: boolean = false;
  showForm: boolean = false; // Property to control form visibility

  ngOnInit(): void {
    this.Budget_Allotment_Form = this.fb.group({
      budget_head_id: [null, Validators.required],
      amount: [null, [Validators.required, Validators.pattern('^[0-9]*$')]],
      Financial_id: ['', Validators.required],
    });

    this.getyear();
     this.gethead_name();
    this.getTable();
  }

  constructor(private fb: FormBuilder, private ds: DataService) {}
  //get financial_year
  getyear() {
    this.ds
      .getData('financial_budget_allotment/getfinancialyear')
      .subscribe((result) => {
        console.log(result);
        this.year = result;
      });
  }
  // get budget_head_name
  gethead_name() {
    this.ds
      .getData('financial_budget_allotment/getbudget_head_name')
      .subscribe((result) => {
        console.log(result);
        this.head_name = result;
      });
  }
  onSubmit() {
    if (this.Budget_Allotment_Form.invalid) {
      Swal.fire({
        icon: 'warning',
        title: 'Validation Error',
        text: 'Please fill all required fields correctly.',
      });
      return;
    }

    this.ds
      .postData(
        'financial_budget_allotment/Postfinance_budget_allotment',
        this.Budget_Allotment_Form.value
      )
      .subscribe(
        (res) => {
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Data saved successfully.',
          });
          this.getTable(); // Refresh table data
          this.onClear(); // Reset the form
        },
        (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: 'Failed to save data. Please try again later.',
          });
        }
      );
  }

  onClear() {
    // Reset the form
    this.Budget_Allotment_Form.reset();

    // Set specific default values, if needed
    this.Budget_Allotment_Form.patchValue({
      budget_head_id: null,
      amount: null,
      Financial_id: null,
    });

    // Clear validation states
    Object.keys(this.Budget_Allotment_Form.controls).forEach((key) => {
      const control = this.Budget_Allotment_Form.get(key);
      control?.setErrors(null);
      control?.markAsPristine();
      control?.markAsUntouched();
    });

    // Exit edit mode if applicable
    this.isEditMode = false;
    // this.editProjectId = null;
  }

  // mat Table filter
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  // Show data in Mat Table
  getTable() {
    this.ds.getData('financial_budget_allotment/mattable').subscribe(
      (result: any) => {
        this.allBudget_Allotment_Detail = result;

        if (result) {
          this.dataSource = new MatTableDataSource(result);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.MatSort;
        }
      },
      (error: any) => {
        // Handle the error case, such as displaying an error message or taking corrective actions.
        console.error('Error fetching data:', error);
      }
    );
  }

  onedit(updatedit: any) {
    this.budgetallotment_1 = this.allBudget_Allotment_Detail.find(
      (f: any) => f.budget_allotment_id === parseInt(updatedit)
    ); //here we matching and extracting the selected id
    console.log(updatedit);
    console.log(this.budgetallotment_1.Financial_id);
    this.editproject = updatedit;
    this.isEditMode = true;
    document.getElementById('addnews')?.scrollIntoView();
    this.Budget_Allotment_Form.patchValue({
      budget_head_id: this.budgetallotment_1.budget_head_id,
      amount: this.budgetallotment_1.amount,
      Financial_id: this.budgetallotment_1.Financial_id,
    });
    console.log(this.budgetallotment_1.allprojectBudgetDetail);
  }

  onUpdate() {
    console.log(this.editproject);
    console.log(this.Budget_Allotment_Form.value);

    this.ds
      .putData(
        'financial_budget_allotment/update/' + this.editproject,
        this.Budget_Allotment_Form.value
      )
      .subscribe((res) => {
        this.update1 = res;
        if (this.update1) this.getTable();
        this.onClear();
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Data Updated Successfully.',
        });
      });
  }

  ondelete(updateid: any) {
    console.log(updateid);
    this.ds
      .Delete_Data('financial_budget_allotment/delete/' + updateid)
      .subscribe((result) => {
        if (result) this.getTable();
        Swal.fire('Data Deleted...');
      });
  }

  // Show the add form
  showAddForm() {
    this.showForm = true;
    this.isEditMode = false;
    this.onClear();
  }

  // Hide the form
  hideForm() {
    this.showForm = false;
    this.isEditMode = false;
    this.onClear();
  }
}
