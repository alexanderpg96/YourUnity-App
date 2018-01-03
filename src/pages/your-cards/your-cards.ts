import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@IonicPage()
@Component({
  selector: 'page-your-cards',
  templateUrl: 'your-cards.html'
})
export class YourCardsPage {
  cardItems: any[];
  cardState = true;
  buttonState = true;
  isInEnabled = true;
  isOutEnabled = false;

  constructor(public navCtrl: NavController, public http: Http) {
    this.http.get('https://yourunity-dev.dev/api/events').map(res => res.json()).subscribe(data => {
      this.cardItems = data;
      
      for(var i = 0; i < this.cardItems.length; i++) {
        var obj = this.cardItems[i];
        obj['cardState'] = true;
      }

      console.log(this.cardItems);
    })

    // $('.card').click(function() {
    //   $('.card').toggleClass('open');
    //   console.log('clicked');
    // });
  }

  card_tapped() {
    console.log("Hello! Clicked" + this);
    var element = document.getElementsByClassName('card');
    element[0].classList.toggle('open');
  }

}
