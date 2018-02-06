import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, NavController, ToastController } from 'ionic-angular';

import { User } from '../../providers/providers';
import { MainPage } from '../pages';

import firebase from 'firebase';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  // The account fields for the login form.
  // If you're using the username field with or without email, make
  // sure to add it to the type
  account: { email: string, password: string } = {
    email: '',
    password: ''
  };

  // Our translated text strings
  private loginErrorString: string;

  constructor(public navCtrl: NavController,
    public user: User,
    public toastCtrl: ToastController,
    public translateService: TranslateService) {

    this.translateService.get('LOGIN_ERROR').subscribe((value) => {
      this.loginErrorString = value;
    })
  }

  // Attempt to login in through our User service
  doLogin() {
    if (firebase.auth().currentUser) {
      firebase.auth().signOut();
    } 
    else {
      var email = this.account.email;
      var password = this.account.password;
      if (email.length < 6) {
        alert('Please enter an email address.');
        return;
      }
      if (password.length < 1) {
        alert('Please enter a password.');
        return;
      }
      firebase.auth().signInWithEmailAndPassword(email, password)
      .catch(function(error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        if (errorCode === 'auth/wrong-password') {
          alert('Could not verify username or password, please try again.');
          return;
        } 
        else if (errorCode === 'auth/user-not-found') {
          alert('Could not verify username or password, please try again.');
          return;
        }  
        else {
          alert(errorMessage);
          return;
        }
        //console.log(error);
      });
    }


    firebase.auth().onAuthStateChanged(user => {
      if(user) {
        this.navCtrl.setRoot(MainPage);
      }
    });
  }
}
