import {Component, OnInit} from '@angular/core';
import {ApiService} from "../service/api.service";
import {Router} from "@angular/router";
import {MenuService} from "../service/menu.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit {
  albums: Array<{ name: string }>

  constructor(
    private api: ApiService,
    private router: Router,
    public menu: MenuService,
  ) {
    this.albums = []
  }

  ngOnInit() {
    this.api.homepageGetter.observedBy(this.init.bind(this))
    this.api.getHomePage()
  }

  init(resp: any) {
    this.albums = resp.albums;
  }

  navigate(album: string) {
    const link = ['/album', album];
    this.router.navigate(link)
      .then(() => {
        this.menu.closeMenu()
      });
  }

  navigateHomePage() {
    this.router.navigate(['/']).then()
  }
}
