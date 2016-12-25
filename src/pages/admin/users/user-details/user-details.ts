import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, ToastController, LoadingController} from 'ionic-angular';
import { DataService } from './../../../../shared/providers/providers'
import { UsersListPage } from './../../../pages'
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { IUser, ICard, ErrorMesseges } from './../../../../shared/interfaces'

@Component({
  selector: 'page-user-details',
  templateUrl: 'user-details.html'
})
export class userDetailPage implements OnInit {
  user: IUser;
  allCards : Array<ICard>
  filterCardList: Array<ICard>
  
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private toastController: ToastController,
    public dataService: DataService,
    private formBuilder: FormBuilder,
    private loadingController: LoadingController) { }


  ngOnInit() {
    this.user = this.navParams.data
        let loader = this.loadingController.create({
      content: "loading cards list"
    })
    loader.present(
      this.dataService.getAllCards()
        .subscribe((res) => {
          console.log(res)
          debugger
          this.allCards = res
          this.filterCardList = this.allCards
        },
        (err) => {
          console.log(err)
        }))
    loader.dismiss()
  }

  
  
  saveUser(filleduserForm) {
    for (let field in filleduserForm) {
      this.user[field] = filleduserForm[field]
    }
      this.dataService.updateUser(this.user)
        .then(() => this.onSuccess())
        .catch((err) => this.onFail(err))
  }

  private onSuccess() {
    let toastSuccess = this.toastController.create({
      message: "updated user",
      duration: 3000,
      position: 'bottom'
    })
    console.log()
    toastSuccess.present()
    this.navCtrl.setRoot(UsersListPage)
  }

  private onFail(err) {
    let errmesag: string;
    if (err==ErrorMesseges.premissonDenied) {errmesag="user name might already exsist in the system"}
    else {errmesag= "fail to save new user"}
    let toastfail = this.toastController.create({
      message: errmesag,
      duration: 3000,
      position: 'bottom'
    })
    console.log("the error is  " + err)
    toastfail.present()
  }

}
