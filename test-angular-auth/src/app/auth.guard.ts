import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { UserStateService } from './user-state.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private oidcSecurityService: OidcSecurityService, private router: Router, private userStateService: UserStateService) {}

  canActivate(route: any): Observable<boolean | UrlTree> {
    return this.oidcSecurityService.isAuthenticated$.pipe(
      map(({ isAuthenticated }) => {
        console.log('[AuthGuard] isAuthenticated:', isAuthenticated);
        if (!isAuthenticated) {
          console.log('[AuthGuard] User is NOT authenticated, triggering authorize()');
          this.oidcSecurityService.authorize();
          return false;
        }
        // Check for privilege if specified in route data
        const requiredPrivilege = route.data?.privilege;
        if (requiredPrivilege) {
          const privileges = this.userStateService.getPrivileges();
          console.log('[AuthGuard] Required privilege:', requiredPrivilege, 'User privileges:', privileges);
          if (!privileges.includes(requiredPrivilege)) {
            console.log('[AuthGuard] User does not have required privilege:', requiredPrivilege);
            // Optionally redirect or show error
            return this.router.parseUrl('/main-menu');
          }
        }
        console.log('[AuthGuard] User is authenticated and has required privilege (if any), allowing route.');
        return true;
      })
    );
  }
}
