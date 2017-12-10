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
    this.cardItems = [
      {
        name: 'Mission Beach Clean Up',
        organization: 'San Diego Parks and Recreation',
        time: '8:00 AM - 12:00 PM',
        cat_image: 'assets/img/splashbg.jpg',
        content: 'San Diego beaches are beautiful and clean. Let us keep them that way',
      }
    ];

    this.http.get('https://yourunity-dev.dev/api/events').map(res => res.json()).subscribe(data => {
      this.cardItems = data;
      console.log(this.cardItems);
    })

  }

}
