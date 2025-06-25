import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
// import { DataService } from 'src/app/services/data.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import Swal from 'sweetalert2';
import { DataService } from '../../../services/data.service';
import { ChangeDetectorRef } from '@angular/core';
// DataService
@Component({
  selector: 'app-map-project-module',
  templateUrl: './map-project-module.component.html',
  styleUrls: ['./map-project-module.component.scss']
})
export class MapProjectModuleComponent implements OnInit{

deptType:any
projectType: any;
data:any;


  displayedColumns=['ID','Project_Name','module_name','Description','Action'];
  dataSource!: MatTableDataSource<any>;

   @ViewChild(MatPaginator) paginator!: MatPaginator ;
   @ViewChild(MatSort) MatSort!: MatSort ;
   @ViewChild('topOfForm') topOfForm!: ElementRef;

 projectMapmodForm!: FormGroup;
  projectMapDetail: any;
  MapDetaiDataByid: any;
  data_id: any;
  iseditmode: boolean =false
  modules: any;

  constructor(private fb:FormBuilder,private cdRef: ChangeDetectorRef, private ds : DataService){}

  ngOnInit(): void {
    this.projectMapmodForm = this.fb.group({

      Project_ID: [null, Validators.required],
      project_module_id:[null, Validators.required],
      Description:[null],

      });
    this.getModule()
   this.getProjectMap()
   this.getTable()

  }



// mat Table filter
applyFilter(event: Event) {
  const filterValue = (event.target as HTMLInputElement).value;
  this.dataSource.filter = filterValue.trim().toLowerCase();
}

  getModule(){
    this.ds.getData('map_project_module/getallModule').subscribe((result)=>{
      console.log(result);
      this.modules=result;
    })
    }

    getProjectMap(){
      this.ds.getData('map_project_module/getallProject').subscribe((result)=>{
        console.log(result);
        this.projectType=result;
      })
      }

// post Department Detail
onSubmit(){

    if (this.projectMapmodForm.invalid) {
    this.projectMapmodForm.markAllAsTouched(); // This highlights all invalid fields
    return;
  }
  console.log(this.projectMapmodForm.value);
  this.ds.postData('map_project_module/postMapData',this.projectMapmodForm.value).subscribe(res =>{
    this.data=res;
    if (this.data)
     Swal.fire("Data Added Successfully");
  });
  this.getTable();
  this.onClear();
  }
 onClear() {
  this.projectMapmodForm.reset();

  // Optional: Reset form state completely
  Object.keys(this.projectMapmodForm.controls).forEach(key => {
    this.projectMapmodForm.get(key)?.setErrors(null);
    this.projectMapmodForm.get(key)?.markAsPristine();
    this.projectMapmodForm.get(key)?.markAsUntouched();
  });

  // Detect changes to clear UI error states
  this.cdRef.detectChanges();
}




  getTable(){
    this.ds.getData('map_project_module/getmapData').subscribe((result:any)=>{
      this.projectMapDetail=result;
          this.dataSource = new MatTableDataSource(result);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.MatSort;
      console.log(result);
    })
  }


// Delete Department detail
ondelete(Map_module_id: any){
  this.MapDetaiDataByid = this.projectMapDetail.find((f : any) => f.Map_module_id === parseInt(Map_module_id)); //here we matching and extracting the selected id
  console.log(this.MapDetaiDataByid)
  this.data_id = Map_module_id;
  this.ds.DeleteassignData('map_project_module/deleteMapdataByid/'+this.data_id,).subscribe((result)=>{
  console.log(result);
  this.data= result

  if(this.data)
  {Swal.fire('Data Deleted...')};
  this.getTable();
 })
}


// Get single Data into form for update
onedit(Map_module_id: any){
  this.MapDetaiDataByid = this.projectMapDetail.find((f : any) => f.Map_module_id === parseInt(Map_module_id));
  console.log(this.MapDetaiDataByid);
  this.iseditmode = true;
  this.data_id = Map_module_id;

  this.projectMapmodForm.patchValue({
    Project_ID: this.MapDetaiDataByid.Project_ID,
    project_module_id: this.MapDetaiDataByid.project_module_id,
    Description: this.MapDetaiDataByid.Description
  });

  // Scroll to the form
  setTimeout(() => {
    this.topOfForm.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 0);
}


onupdate(){
   this.ds.putData('map_project_module/updateMapProDetail/' + this.data_id,this.projectMapmodForm.value).subscribe((result)=>{
    console.log(result);
    this.data= result

  if(this.data)
  {Swal.fire("Data Updated Successfully")};
  this.getTable();
  this.onClear();
   })
  this.iseditmode = false;
 }



}

