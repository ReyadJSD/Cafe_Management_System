import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree } from '@angular/router';
import { AuthService } from './auth.service'; // Assuming AuthService for token handling
import { SnackbarService } from './snackbar.service';
import { jwtDecode } from "jwt-decode";
import { GlobalConstant } from '../shared/global-constant';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RouteGuardService implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router,
    private snackbarService: SnackbarService,
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    const expectedRoles = route.data['expectedRole'] as string[]; // Type assertion for expected roles

    // Check if token is present and decode if valid
    const token = localStorage.getItem('token');
    let tokenPayload: any;
    if (token) {
      try {
        tokenPayload = jwtDecode(token);
      } catch (err) {
        localStorage.clear();
        this.router.navigate(['/']);
        return false;
      }
    } else {
      // Handle case where no token is found (e.g., redirect to login)
      this.authService.isAuthenticated(); // Assuming a method in AuthService
      return false;
    }

    // Check if user role matches expected roles and is authenticated
    if (expectedRoles.includes(tokenPayload.role) && this.authService.isAuthenticated()) {
      return true;
    } else {
      this.snackbarService.openSnackBer(GlobalConstant.unauthorized, GlobalConstant.error);
      this.router.navigate(['/cafe/dashboard']); // Adjust destination as needed
      return false;
    }
  }
}