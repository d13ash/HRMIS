import { Component, ElementRef, OnInit, ViewChild,Renderer2 } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { DataService } from 'src/app/services/data.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import Swal from 'sweetalert2';
import { DatePipe } from '@angular/common';
import { DataService } from '../../../services/data.service';


// DataService
@Component({
  selector: 'app-financial-post',
  templateUrl: './financial-post.component.html',
  styleUrls: ['./financial-post.component.scss']
})
export class FinancialPostComponent  implements OnInit{
  displayedColumns=['finance_post_main_id','Project_name','Financial_name','PI_ref_no','Work_order_ref_no','Action'];
  dataSource!: MatTableDataSource<any>;

   @ViewChild(MatPaginator) paginator!: MatPaginator ;
   @ViewChild(MatSort) MatSort!: MatSort ;
   

FYear: any;
  posdata: any;
  pos_name: any;
  val1: any=''
  val2: any=''
  val4: any=''
  val6: any=''
  post_name: any=''
  Post_id: any;
  Post_name: any;
  id1: any;
  allDetail: any;
  allPreviwDetail: any;
  useFinancialYear: any;
  useProject: any;
    
     newform!: FormGroup
  name1: any;

     postDetailgroup(){
      this.newform = this.fb.group({
        Project_ID: [null, Validators.required],
        PI_ref_no: [null, Validators.required],
        Work_order_ref_no: [null, Validators.required],
        PI_refferal_doc: [null, Validators.required],
        Work_order_doc: [null, Validators.required],
        Financial_id: [null, Validators.required],
      });
     }


   postDetailarray:any[]=[];
    iseditmode: boolean =false
  project: any;
  allFyearPostDetail: any;
  data: any;
  resourceAssDataByid: any;
  data_id: any;
  status: any;
  FYearePostDataByid: any;
  projectType: any;
  post: any;
  year: any;
  pro_id:any;
  year_id:any;
  images: any;
  uploadedimage: any;
  imageurl: any;
  yearly_post_detail_id:any
 
  
    constructor(private fb:FormBuilder, private ds : DataService, private datepipe: DatePipe,private elementRef: ElementRef){}
  
    ngOnInit(): void {
  this.getProjectMap()
 this. getYear()
 this.postDetailgroup()
 this.getonTable()
// this.getfianancalpost()
    }

    getYear(){
      this.ds.getData('Financialyear_post/getFinancialYear').subscribe((result)=>{
        console.log(result);
        this.FYear=result;
      })
    }

    onChangeFYear(Financial_id: any) {
      this.ds.getData('Financialyear_post/getPost/' + Financial_id).subscribe(res => {
        this.post = res;
      });
    }

    logSelectedValue(selectedValue: any) {
      this.Post_id=selectedValue;
      this.getpost_name() 

    }

    getpost_name() {
      this.id1=this.newform.get('Financial_id')?.value;
      this.ds.getData(`Financialyear_post/test/`+this.Post_id+`/`+this.id1).subscribe(res => {
        this.Post_name = res;
        console.log(this.Post_name)
        this.name1=this.Post_name[0].name
        console.log(this.name1)
      });
    }

    onclick1(name:any,sdate:any,edate:any,sal:any,desc:any,name1:any){
      this.postDetailarray.push({name,sdate,edate,sal,desc,name1})
      this.val1="";
      this.val2="";
      this.val4="";
      this.val6="";
    }


    submitdata(){
      this.newform.patchValue //this will help to set the date format (for storing in database)
             ({
              Work_order_doc:this.imageurl ,
              PI_refferal_doc:this.imageurl
             })
        this.ds.postData('Financialyear_post/postFinancialPost', this.newform.value).subscribe(res => {
          this.data = res;
          if (this.data)
          {
            const body = {
              paramArray: this.postDetailarray
            };
            this.ds.postData(`Financialyear_post/postArray/`+this.data.id,body).subscribe(res => {
              this.data = res;
              if (this.data)
                alert("Data saved succesfully..")
            })
          }
        });
       this.getonTable()
    }

    onClear(){
      this.newform.reset();
      }


// Show data in Mat Table
getonTable(){
  this.ds.getData('Financialyear_post/PostPreviewDetail' ).subscribe((result:any)=>{
      this.allDetail=result;
          this.dataSource = new MatTableDataSource(result);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.MatSort;  
    })
    }


getPreview(finance_post_main_id:any){
  this.ds.getData('Financialyear_post/bbbbbb/'+finance_post_main_id ).subscribe((result:any)=>{
       console.log(result)
    this.allPreviwDetail=result;
    // console.log(this.allPreviwDetail[0]['Project_name']);
    this.useProject=this.allPreviwDetail[0]['Project_name']
    this.useFinancialYear=this.allPreviwDetail[0]['Financial_name']
    document.getElementById("addnews")?.scrollIntoView();
        })
     }

     // mat Table filter
applyFilter(event: Event) {
  const filterValue = (event.target as HTMLInputElement).value;
  this.dataSource.filter = filterValue.trim().toLowerCase();
  }

    // this is scroll function
    scrollToBottom(): void {
      const element = this.elementRef.nativeElement.querySelector('#endOfPage');
      element.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }

// get resource in dropdown
getProjectMap(){
  this.ds.getData('Financialyear_post/getProject').subscribe((result)=>{
    console.log(result);  
    this.projectType=result;
  })
  }


// Work Order Refferal doc file or image upload
selectimage(event : any){                          //here on selecting the image(event) this will check any images are present or not 
  if(event.target.files.length > 0){
    const file = event.target.files[0];            //it is used to get the input file dom property
    this.images = file
    var reader =new FileReader();           //this object is used to read the file
    reader.readAsDataURL(file);             //to read the dom property of file
    reader.onload=(event:any)=>{            //this will load the selected image
      this.uploadedimage=event.target.result;
    }
  }
  }


  submitfile(){                            //multer will accept form data so we here creating a form data
  if(!this.images){
    return this.nopath();
  }
  
  const formData = new FormData();
  formData.append('Work_order_doc',this.images);               //the name of key is to be same as provide in backend(node js)
  console.log(this.images)
  
  this.ds.postData('Financialyear_post/uploadWOfile',formData).subscribe((result:any)=>{
     console.log(result["profile_url"]);
    this.imageurl=result["profile_url"];
    Swal.fire("file uploaded successfully")
    this.iseditmode=false;
  });
  
  }
  nopath(){
    Swal.fire("please select a file")
    }

  //  PI Refferal file
    selectPI(event : any){                          //here on selecting the image(event) this will check any images are present or not 
      if(event.target.files.length > 0){
        const file = event.target.files[0];            //it is used to get the input file dom property
        this.images = file
        var reader =new FileReader();           //this object is used to read the file
        reader.readAsDataURL(file);             //to read the dom property of file
        reader.onload=(event:any)=>{            //this will load the selected image
          this.uploadedimage=event.target.result;
        }
      }
      }


      submitPIfile(){                            //multer will accept form data so we here creating a form data
      if(!this.images){
        return this.nopath();
      }
      
      const formData = new FormData();
      formData.append('PI_refferal_doc',this.images);               //the name of key is to be same as provide in backend(node js)
      console.log(this.images)
      
      this.ds.postData('Financialyear_post/uploadPIfile',formData).subscribe((result:any)=>{
         console.log(result["profile_url"]);
        this.imageurl=result["profile_url"];
        Swal.fire("file uploaded successfully")
        this.iseditmode=false;
      });
      this.nopath()
      }
    
}



