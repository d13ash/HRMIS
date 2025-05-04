
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
// import { DataService } from 'src/app/services/data.service';
import Swal from 'sweetalert2';
import { DataService } from '../../../services/data.service';
// DataService
@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.scss']
})
export class PostDetailComponent implements OnInit {

  displayedColumns=['Post Id','Post Name','Post Name Hindi','Post Short Name','Post_type_name','Post_leval','Action'];

   @ViewChild(MatPaginator) paginator!: MatPaginator ;
   @ViewChild(MatSort) MatSort!: MatSort ;

   
  allPostDetail: any;
  postDataByid: any;
  iseditmode: boolean = false;
  data_id: any;
  data: any;
  posttype: any;
  hodtype: any;
  dataSource: any;


  PostdetailsForm!: FormGroup
  constructor(private fb: FormBuilder, private ds: DataService, private router: Router) { }

  ngOnInit() {
    this.PostdetailsForm  = this.fb.group({
      Post_name: ['', Validators.required],
      Post_name_hindi: ['', Validators.required],
      Post_short_name: ['', Validators.required],
      Post_Type_ID: ['', Validators.required],
      Post_leval: ['', Validators.required],
      Display_order: ['', Validators.required],
      Is_hod: ['', Validators.required],
    });
    this.getposttype();
    // this.gethodtype();
    this.getTable();
  }

  getTable(){
    this.ds.getData('post/allpostdetails').subscribe((result:any)=>{
        this.allPostDetail=result;
            this.dataSource = new MatTableDataSource(result);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.MatSort;
        console.log(result);  
      })
      }

 
      
      

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
}

  getposttype() {
    this.ds.getData('post/postType').subscribe(res => {
      this.posttype = res;
    });
  }

 
  
  // gethodtype() {
  //   this.ds.getData('post/Hod').subscribe(res => {
  //     this.hodtype = res;
  //   });
  // }

  onSubmit() {
      console.log(this.PostdetailsForm.value);
      this.ds.postData('post/submitPost',this.PostdetailsForm.value).subscribe(res =>{
        this.data=res;
        if (this.data)
        alert("Data saved succesfully..")
      });
      this.getTable();
      }
      onReset(){
        this.PostdetailsForm.reset();
      }
  
 // Get single Data into form for update
 onedit(Post_id: any) {
  this.postDataByid = this.allPostDetail.find((f: any) => f.Post_id === parseInt(Post_id));
  console.log(this.postDataByid)
  this.iseditmode = true;
  this.data_id = Post_id;

  this.PostdetailsForm.patchValue
    ({
      Post_name: this.postDataByid.Post_name,
      Post_name_hindi: this.postDataByid.Post_name_hindi,
      Post_short_name: this.postDataByid.Post_short_name,
      Post_Type_ID: this.postDataByid.Post_Type_ID,
      Display_order: this.postDataByid.Display_order,
      Post_leval: this.postDataByid.Post_leval,
      Is_hod: this.postDataByid.Is_hod,
    })
  this.iseditmode = true;
}

onupdate() {
  this.ds.putData('post/updatepostdata/' + this.data_id, this.PostdetailsForm.value).subscribe((result) => {  
    console.log(result);
    this.data = result
    if (this.data) { Swal.fire("data updated successfully") };
    this.onReset();
    this.getTable();
  })
  this.iseditmode = false;
}

ondelete(Post_id: any){
  this.postDataByid = this.allPostDetail.find((f : any) => f.Post_id === parseInt(Post_id)); //here we matching and extracting the selected id
  console.log(this.postDataByid.Post_id);
  this.ds.Delete_Data('post/deletePostByid/'+ this.postDataByid.Post_id,).subscribe((result:any)=>{
    console.log(result);
    this.data= result
    if(this.data)
    {Swal.fire('Data Deleted...')};
    this.getTable();
  })
}
  
}
