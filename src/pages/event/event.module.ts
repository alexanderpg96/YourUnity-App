import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';

import { EventPage } from './event';

@NgModule({
  declarations: [
    EventPage,
  ],
  imports: [
    IonicPageModule.forChild(EventPage),
    TranslateModule.forChild()
  ],
  exports: [
    EventPage
  ]
})
export class EventDetailPageModule { }
