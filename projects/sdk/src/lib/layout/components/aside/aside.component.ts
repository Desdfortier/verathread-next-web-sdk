import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { NavigationCancel, NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import {AsideMenuComponent} from "./aside-menu/aside-menu.component";
import {InlineSVGModule} from "ng-inline-svg-2";
import {DrawerComponent, MenuComponent, ScrollComponent, ToggleComponent} from "../../../kt/components";
import {LayoutService} from "../../core";

@Component({
  selector: 'app-aside',
  templateUrl: './aside.component.html',
  styleUrls: ['./aside.component.scss'],
  imports: [AsideMenuComponent, InlineSVGModule],
  standalone: true,
  host: { id: 'layout-aside' }
})
export class AsideComponent implements OnInit, OnDestroy {
  asideTheme: string = '';
  asideMinimize: boolean = false;
  asideMenuCSSClasses: string = '';
  appPreviewDocsUrl: string = '';

  @ViewChild('ktAsideScroll', { static: true }) ktAsideScroll: ElementRef | undefined;

  private unsubscribe: Subscription[] = [];

  constructor(private layout: LayoutService, private router: Router) {}

  ngOnInit(): void {
    this.asideTheme = this.layout.getProp('aside.theme') as string;
    this.asideMinimize = this.layout.getProp('aside.minimize') as boolean;
    this.asideMenuCSSClasses = this.layout.getStringCSSClasses('asideMenu');
    this.routingChanges();
  }

  routingChanges() {
    const routerSubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd || event instanceof NavigationCancel) {
        this.menuReinitialization();
      }
    });
    this.unsubscribe.push(routerSubscription);
  }

  menuReinitialization() {
    setTimeout(() => {
      MenuComponent.reinitialization();
      DrawerComponent.reinitialization();
      ToggleComponent.reinitialization();
      ScrollComponent.reinitialization();
      if (this.ktAsideScroll && this.ktAsideScroll.nativeElement) {
        this.ktAsideScroll.nativeElement.scrollTop = 0;
      }
    }, 50);
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
