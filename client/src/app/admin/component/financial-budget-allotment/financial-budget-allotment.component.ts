import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { DataService } from 'src/app/services/data.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DataService } from '../../../services/data.service';


// DataService
@Component({
  selector: 'app-financial-budget-allotment',
  templateUrl: './financial-budget-allotment.component.html',
  styleUrls: ['./financial-budget-allotment.component.scss']
})

export class FinancialBudgetAllotmentComponent implements OnInit {


  displayedColumns = ['budget_allotment_id', 'budget_head_name', 'amount', 'Financial_name', 'Action'];
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
  ngOnInit(): void {
    this.Budget_Allotment_Form = this.fb.group({
      budget_head_id: [null, Validators.required],
      amount: [null, Validators.required],
      Financial_id: ['', Validators.required],

    });
    this.getyear(),
      this.gethead_name()
    this.getTable()
  }

  constructor(private fb: FormBuilder, private ds: DataService,) { }
  //get financial_year
  getyear() {
    this.ds.getData('financial_budget_allotment/getfinancialyear').subscribe((result) => {
      console.log(result);
      this.year = result;
    })
  }
  // get budget_head_name 
  gethead_name() {
    this.ds.getData('financial_budget_allotment/getbudget_head_name').subscribe((result) => {
      console.log(result);
      this.head_name = result;
    })
  }

  onSubmit() {
    console.log(this.Budget_Allotment_Form.value);
    this.ds.postData('financial_budget_allotment/Postfinance_budget_allotment', this.Budget_Allotment_Form.value).subscribe(res => {
      this.data = res;
      if (this.data)
        alert("Data saved succesfully..")
    });
    this.onClear()
  }
  onClear() {
    this.Budget_Allotment_Form.reset();
  }


  // mat Table filter
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


  // Show data in Mat Table
  getTable() {
    this.ds.getData('financial_budget_allotment/mattable').subscribe((result: any) => {
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
    this.budgetallotment_1 = this.allBudget_Allotment_Detail.find((f: any) => f.budget_allotment_id === parseInt(updatedit)); //here we matching and extracting the selected id
    console.log(updatedit)
    console.log(this.budgetallotment_1.Financial_id)
    this.editproject = updatedit
    this.isEditMode = true;
    document.getElementById("addnews")?.scrollIntoView();
    this.Budget_Allotment_Form.patchValue
      ({
        budget_head_id: this.budgetallotment_1.budget_head_id,
        amount: this.budgetallotment_1.amount,
        Financial_id: this.budgetallotment_1.Financial_id,
      });
    console.log(this.budgetallotment_1.allprojectBudgetDetail);
  }

  onUpdate() {
    console.log(this.editproject)
    console.log(this.Budget_Allotment_Form.value);

    this.ds.putData('financial_budget_allotment/update/' + this.editproject, this.Budget_Allotment_Form.value).subscribe(res => {
      this.update1 = res;
      if (this.update1)
        this.getTable();
      this.onClear()
      alert('Data updated successfully');
    });

  }


  ondelete(updateid: any) {
    console.log(updateid)
    this.ds.Delete_Data('financial_budget_allotment/delete/' + updateid,).subscribe((result) => {
      if (result)
        this.getTable();
      alert('Data Deleted...')
    });
  }

}


