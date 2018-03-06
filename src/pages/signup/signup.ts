import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, NavController, ToastController, Alert, Platform } from 'ionic-angular';
import { Http } from '@angular/http';
import {Headers, RequestOptions} from '@angular/http'
import 'rxjs/add/operator/map';
import { Keyboard } from '@ionic-native/keyboard';

import { User } from '../../providers/providers';
import { MainPage } from '../pages';

import firebase from "firebase";

declare var navigator: any;
declare var Connection: any;

@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html'
})
export class SignupPage {
  // The account fields for the login form.
  // If you're using the username field with or without email, make
  // sure to add it to the type
  account: { name_first: string, name_last: string, email: string, password: string } = {
    name_first: '',
    name_last: '',
    email: '',
    password: ''
  };

  baseUrl: string = 'https://yourunity.org';
  email: string;
  name_first: string;
  name_last: string;
  userCreated: boolean = false;
  keyboardShow: Boolean = true;

  // Our translated text strings
  private signupErrorString: string;

  constructor(public navCtrl: NavController,
    public user: User,
    public toastCtrl: ToastController,
    private keyboard: Keyboard,
    public translateService: TranslateService, public http: Http, private platform: Platform) {

    firebase.auth().signOut();

    keyboard.disableScroll(true);

      keyboard.onKeyboardShow()
      .subscribe(data => {
        this.keyboardShow = false;
       //your code goes here
    });

    keyboard.onKeyboardHide()
      .subscribe(data => {
        this.keyboardShow = true;
       //your code goes here
    });

    this.translateService.get('SIGNUP_ERROR').subscribe((value) => {
      this.signupErrorString = value;
    })
  }
  doSignup() {
    // Attempt to register through Firebase

    var errorBool = false;
    this.email = this.account.email;
    this.name_first = this.account.name_first;
    this.name_last = this.account.name_last;

      firebase.auth().createUserWithEmailAndPassword(this.account.email, this.account.password)
      .catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // [START_EXCLUDE]
        if (errorCode == 'auth/weak-password') {
          alert('The password is too weak.');
        } 
        else {
          alert(errorMessage);
        }
        console.log(error);
        // [END_EXCLUDE]
      });
    // [END createwithemail]

    firebase.auth().onAuthStateChanged(user => {
      if(user) {
        // Update the user's name as well
        user.updateProfile({
          displayName: this.account.name_first,
          photoURL: ""
        }).then(function() {
          console.log(user.uid);
        }).catch(function(error) {
          // An error happened.
        });

        this.pushAccount(user);
        this.pushToMain();
      }
    });
  }

  pushAccount(user) {
    // Push information to the database
    var user_id = user.uid;
    var url = this.baseUrl + '/api/add_attendee';
    var data =
      "firedb_id=" + user_id +
      "&name_first=" + this.name_first +
      "&name_last=" + this.name_last +
      "&email=" + this.email;

    console.log(data);

    let headers = new Headers ({ 'Content-Type': 'application/x-www-form-urlencoded' });
    let options = new RequestOptions({ headers: headers }); 

    // Check in user on server
    this.http.post(url, data, options)
    .map(res => res.json())
    .subscribe(data =>
      console.log(data)
    );

    var hello: any = "hello";
    return hello;
  }

  pushToMain() {
    this.navCtrl.setRoot(MainPage);
    var hello: any = "hello";
    return hello;
  }
  
}
