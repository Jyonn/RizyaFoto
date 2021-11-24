import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import {ApiService} from "../service/api.service";
import {RequestService} from "../service/utils/request.service";
import {OneWorkerService} from "../service/utils/one-worker.service";
import {HttpClientModule} from "@angular/common/http";
import {AppRoutingModule} from "./app-routing.module";
import {HomePageComponent} from "../component/homepage/homepage.component";
import {AlbumComponent} from "../component/album/album.component";
import {MenuService} from "../service/menu.service";
import {FotoDepotService} from "../service/foto-depot.service";
import {DisplayComponent} from "../component/display/display.component";
import {FotoService} from "../service/foto.service";
import {FotoSizePipe} from "../pipe/foto-size.pipe";
import {FotoTimePipe} from "../pipe/foto-time.pipe";

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    AlbumComponent,
    DisplayComponent,
    FotoSizePipe,
    FotoTimePipe,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
  ],
  providers: [
    ApiService,
    RequestService,
    OneWorkerService,
    MenuService,
    FotoDepotService,
    FotoService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
