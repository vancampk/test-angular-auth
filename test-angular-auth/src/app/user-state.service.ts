import { Injectable, signal } from '@angular/core';

export interface UserState {
  accessToken: string;
  idToken: string;
  expiresAt: number;
  profile: any;
}

@Injectable({ providedIn: 'root' })
export class UserStateService {
  private _user = signal<UserState | null>(null);

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
    // Common claim names: 'role', 'roles', 'privileges', 'permissions'
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
