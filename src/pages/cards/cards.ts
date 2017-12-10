import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-cards',
  templateUrl: 'cards.html'
})
export class CardsPage {
  cardItems: any[];

  constructor(public navCtrl: NavController) {
    this.cardItems = [
      {
        name: 'Gardening Event',
        organization: 'Community Garden',
        time: '5:00 PM - 7:00 PM',
        cat_image: 'assets/img/eco.jpg',
        content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris vitae dui sit amet nisl consectetur sodales. Sed lacinia arcu porta eros fermentum, quis dictum lorem varius. Nulla eros orci, tempor vitae ex ut, eleifend vestibulum purus. Praesent fermentum libero sed pellentesque ullamcorper. Aenean ornare massa convallis dui congue posuere. Cras sodales massa tortor, quis iaculis ligula molestie ornare. Sed et purus nec magna cursus semper. Proin dictum nunc metus, et iaculis turpis luctus ac. Morbi enim justo, eleifend ut leo eget, imperdiet sagittis enim. In eleifend libero ante, in rutrum ante accumsan eu. Vestibulum vitae lectus blandit, iaculis purus et, eleifend eros. Duis gravida nisi id risus porttitor laoreet. Pellentesque lectus sem, cursus at accumsan non, venenatis ut est. Pellentesque eget velit diam. Aliquam vel rutrum lorem. Integer pulvinar metus eget tortor mollis sodales. Sed consectetur metus eu velit scelerisque ornare. Aliquam rhoncus eros sed nisl maximus condimentum. Etiam facilisis ex sit amet diam rutrum ultricies in non urna. Suspendisse nec sapien mattis, malesuada est in, ornare odio. Ut porta, magna eget porttitor euismod, enim lorem sodales nisl, a rhoncus purus turpis vitae lorem. Donec sed arcu ut tellus blandit molestie. Nam ac tempor ex. Etiam vitae faucibus lectus, ut pellentesque augue. Vivamus placerat tincidunt velit, in convallis lorem faucibus eu. In nunc est, posuere at mi id, commodo ultricies felis. Suspendisse tincidunt non mi a scelerisque. Integer tincidunt nec ipsum quis tempus. Praesent dignissim nibh elit, at commodo nunc fermentum eu. Maecenas sodales nisl at diam feugiat, condimentum vehicula sem laoreet. Pellentesque consectetur vestibulum diam, quis semper felis malesuada commodo. Morbi sit amet euismod orci, nec accumsan enim. Cras tristique et metus non aliquam. Pellentesque vel eleifend massa. Nulla eget massa lacinia, pellentesque lectus vel, ullamcorper quam.',
      },
      {
        name: 'Feed the Homeless',
        organization: 'Dau Bum',
        time: '3:00 PM - 8:00 PM',
        cat_image: 'assets/img/splashbg.jpg',
        content: 'Come by the temple and make some sandwiches to hand out to the homeless community in San Diego',
      },
      {
        name: 'Mission Beach Clean Up',
        organization: 'San Diego Parks and Recreation',
        time: '8:00 AM - 12:00 PM',
        cat_image: 'assets/img/splashbg.jpg',
        content: 'San Diego beaches are beautiful and clean. Let us keep them that way',
      },
      {
        name: 'Gardening Event 2',
        organization: 'Community Garden',
        time: '12:00 PM - 3:00 PM',
        cat_image: 'assets/img/eco.jpg',
        content: 'Come and join us to lay mulch and plant flowers!',
      }
    ];

  }

  openEvent(event: any) {
    this.navCtrl.push('EventDetailPage', {
      event: event
    });
  }
}
