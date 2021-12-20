import { Injectable } from '@angular/core';
import { SocialUser } from 'angularx-social-login';

const SOCIAL_DATA_KEY = 'social_data';

/**
 * Service that uses browser localStorage as a storage.
 */
@Injectable({
  providedIn: 'root',
})
export class SocialStorageService {
  /**
   * Returns social user from localStorage
   * @returns SocialUser
   */
  static get(): SocialUser {
    return JSON.parse(localStorage.getItem(SOCIAL_DATA_KEY)) as SocialUser;
  }

  /**
   * Sets social user to localStorage
   * @param SocialUser user
   */
  static set(user: SocialUser): void {
    const str = JSON.stringify(user);

    if (!str) {
      return;
    }

    localStorage.setItem(SOCIAL_DATA_KEY, str);
  }

  /**
   * Clears social user from localStorage
   */
  static clear(): void {
    localStorage.removeItem(SOCIAL_DATA_KEY);
  }
}
