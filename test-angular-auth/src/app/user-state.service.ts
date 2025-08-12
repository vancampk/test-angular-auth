import { Injectable, signal, inject } from '@angular/core';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { jwtDecode } from 'jwt-decode';

export interface UserState {
  accessToken: string;
  idToken: string;
  expiresAt: number;
  profile: any;
}

@Injectable({ providedIn: 'root' })
export class UserStateService {
  private _user = signal<UserState | null>(null);
  private oidcSecurityService = inject(OidcSecurityService);

  get user() {
    return this._user();
  }

  setUser(user: UserState) {
    this._user.set(user);
    localStorage.setItem('userState', JSON.stringify(user));
  }

  loadUserFromStorage() {
    const data = localStorage.getItem('userState');
    if (data) {
      this._user.set(JSON.parse(data));
    }
  }

  /**
   * Load user info directly from OIDC client
   */
  loadUserFromOidc() {
    this.oidcSecurityService.checkAuth().subscribe(({ isAuthenticated, accessToken, idToken, userData }) => {
      if (isAuthenticated) {
        // Use jwt-decode to get expiration
        let expiresAt = 0;
        if (accessToken) {
          try {
            const decoded: any = jwtDecode(accessToken);
            if (decoded && decoded.exp) {
              expiresAt = decoded.exp * 1000;
            }
          } catch (error) {
            console.error('Error decoding JWT:', error);
          }
        }
        const userState = {
          accessToken,
          idToken,
          expiresAt,
          profile: userData
        };
        this.setUser(userState);
      }
    });
  }

  /**
   * Get current access token from OIDC client
   */
  getAccessTokenFromOidc() {
    return this.oidcSecurityService.getAccessToken();
  }

  /**
   * Get user data from OIDC client
   */
  getUserDataFromOidc() {
    return this.oidcSecurityService.getUserData();
  }

  clearUser() {
    this._user.set(null);
    localStorage.removeItem('userState');
  }

  /**
   * Returns an array of privileges/roles from the user profile or token.
   * Adjust the logic based on your IdP claims structure.
   */
  getPrivileges(): string[] {
    const user = this._user();
    if (!user) return [];
    
    // Try to get privileges from access token claims first
    if (user.accessToken) {
      try {
        const decoded: any = jwtDecode(user.accessToken);
        if (decoded.role) {
          return Array.isArray(decoded.role) ? decoded.role : [decoded.role];
        }
        if (decoded.roles) {
          return Array.isArray(decoded.roles) ? decoded.roles : [decoded.roles];
        }
        if (decoded.privileges) {
          return Array.isArray(decoded.privileges) ? decoded.privileges : [decoded.privileges];
        }
        if (decoded.permissions) {
          return Array.isArray(decoded.permissions) ? decoded.permissions : [decoded.permissions];
        }
      } catch (error) {
        console.error('Error decoding access token for privileges:', error);
      }
    }
    
    // Fallback to profile data
    const profile = user.profile || {};
    if (profile.role) {
      return Array.isArray(profile.role) ? profile.role : [profile.role];
    }
    if (profile.roles) {
      return Array.isArray(profile.roles) ? profile.roles : [profile.roles];
    }
    if (profile.privileges) {
      return Array.isArray(profile.privileges) ? profile.privileges : [profile.privileges];
    }
    if (profile.permissions) {
      return Array.isArray(profile.permissions) ? profile.permissions : [profile.permissions];
    }
    return [];
  }
}
