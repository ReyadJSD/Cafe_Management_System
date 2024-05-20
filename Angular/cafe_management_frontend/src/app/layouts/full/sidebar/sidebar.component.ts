import { ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { MenuItems } from '../../../shared/menu-items';
import { jwtDecode } from "jwt-decode";
import { Router } from '@angular/router';
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class AppSidebarComponent implements OnDestroy {
  mobileQuery: MediaQueryList;
  userRole: any;
  token: any = localStorage.getItem('token');
  tokenPayLoad: any;
  filteredMenuItems: any[] = []; 
  private _mobileQueryListener: () => void;

  constructor(
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    public menuItems: MenuItems,
    private router: Router

  ) {
    this.tokenPayLoad = jwtDecode(this.token);
    this.userRole = this.tokenPayLoad?.role;
    this.filterMenuItems();
    this.mobileQuery = media.matchMedia('(min-width: 768px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  isActive(state: string): boolean {
    return this.router.isActive(`/cafe/${state}`, false);
  }

  filterMenuItems() {
    this.filteredMenuItems = this.menuItems.getMenuItems().filter(
      menuItem => menuItem.role === '' || menuItem.role === this.userRole
    );
  }
}
