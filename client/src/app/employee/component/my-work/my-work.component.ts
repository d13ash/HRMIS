
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataService } from '../../../services/data.service';
import { AuthService } from '../../../services/auth.service';
// import { DataService } from 'src/app/services/data.service';
// import { AuthService } from 'src/app/services/auth.service';

// DataService
// AuthService
@Component({
  selector: 'app-my-work',
  templateUrl: './my-work.component.html',
  styleUrls: ['./my-work.component.scss']
})
export class MyWorkComponent  implements OnInit{


   myWorkForm!:FormGroup


  arr:any=[];
  arr1:any=[];
  previewData: any;
  useEmpName: any;
  countData: any;
  totalCount: number = 10; // Set the total count of data here
  countLength: any;
  countApproval: any;

  

  constructor(private fb:FormBuilder, private ds:DataService, private AS:AuthService){}
  ngOnInit(): void {
    this.myWorkForm = this.fb.group({
      is_Work_complete: [null, Validators.required],
    });
this.getPreview()
// this.getWorkCount()
// this.getApprovalCount()
// this. newfunc()
  }

    // preview in table
    getPreview(){
      this.ds.getData('projectWorkAllotment/view/'+this.AS.currentUser.Emp_Id ).subscribe((result:any)=>{
           console.log(result)
        this.previewData=result;
        this.useEmpName=this.previewData[0]['Emp_First_Name_E']
        document.getElementById("addnews")?.scrollIntoView();      
            })
         }

  //update in table  
  submitForm(alloted_project_work_id:any){
      console.log(this.myWorkForm.value)
      console.log(alloted_project_work_id)
      console.log( this.myWorkForm.controls['is_Work_complete'].value);

      this.ds.putData("projectWorkAllotment/updateAllotedWork/" + alloted_project_work_id,{"is_Work_complete": this.myWorkForm.controls['is_Work_complete'].value}).subscribe((res:any)=>{
                console.log(res)
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

