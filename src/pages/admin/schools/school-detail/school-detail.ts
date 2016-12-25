import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';
import { DataService } from './../../../../shared/providers/providers'
import { SchoolListPage } from './../../../pages'
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Schools, IUser, ErrorMesseges } from './../../../../shared/interfaces'

@Component({
  selector: 'page-school-detail',
  templateUrl: 'school-detail.html'
})
export class SchoolDetailPage implements OnInit {
  updateOrSave: Boolean = true;
  school: Schools = {$key:""}
  //allusers: Array<IUser>
  schoolForm: FormGroup
  $key: AbstractControl

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private toastController: ToastController,
    public dataService: DataService,
    private formBuilder: FormBuilder) { }


  ngOnInit() {
    this.navParams.data.$key ? this.school = this.navParams.data : this.updateOrSave = false
    this.schoolForm = this.formBuilder.group({
      '$key': ['', Validators.compose([Validators.required, Validators.minLength(5)])]
    });
    for (let field in this.schoolForm.value) {
      this.schoolForm.patchValue({[field]: this.school[field]})
      this[field] = this.schoolForm.controls[field]
    }
    //this.dataService.getAllpossibleUsers().subscribe((res)=>this.allusers=res)

  }

  saveUpdateSchool(filledSchoolForm) {
    debugger
    for (let field in filledSchoolForm) {
      this.school[field] = filledSchoolForm[field]
    }
    
    //validate that there is no $key like it
    this.updateOrSave ?
      this.dataService.updateSchool(this.school)
        .then((res) => this.onSuccess(res))
        .catch((err) => this.onFail(err))
      : this.dataService.saveNewSchool(this.school)
        .then((res) => this.onSuccess(res))
        .catch((err) => this.onFail(err))
  }

  private onSuccess(res) {
    let toastSuccess = this.toastController.create({
      message: this.updateOrSave ? "updated school" : "saved new school",
      duration: 3000,
      position: 'bottom'
    })
    console.log(res)
    toastSuccess.present()
    this.navCtrl.setRoot(SchoolListPage)
  }

  private onFail(err) {
    
    let errmesag: string;
    if (err==ErrorMesseges.premissonDenied) {errmesag="school name might already exsist in the system"}
    else {errmesag= this.updateOrSave? "fail to update school" : "fail to save new school"}
    let toastfail = this.toastController.create({
      message: errmesag,
      duration: 3000,
      position: 'bottom'
    })
    console.log("the error is  " + err)
    toastfail.present()
  }

}
