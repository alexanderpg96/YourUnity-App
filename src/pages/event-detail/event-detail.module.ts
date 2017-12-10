import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';

import { EventDetailPage } from './event-detail';

@NgModule({
  declarations: [
    EventDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(EventDetailPage),
    TranslateModule.forChild()
  ],
  exports: [
    EventDetailPage
  ]
})
export class EventDetailPageModule { }
