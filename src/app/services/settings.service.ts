import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Settings {
  theme: 'light' | 'dark' | 'system';
  emailNotifications: boolean;
  pushNotifications: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private settings = new BehaviorSubject<Settings>({
    theme: 'system',
    emailNotifications: true,
    pushNotifications: true
  });

  private isSettingsOpen = new BehaviorSubject<boolean>(false);

  settings$ = this.settings.asObservable();
  isSettingsOpen$ = this.isSettingsOpen.asObservable();

  constructor() {
    // Load settings from localStorage if available
    const savedSettings = localStorage.getItem('userSettings');
    if (savedSettings) {
      this.settings.next(JSON.parse(savedSettings));
    }
  }

  updateSettings(newSettings: Partial<Settings>) {
    const currentSettings = this.settings.value;
    const updatedSettings = { ...currentSettings, ...newSettings };
    this.settings.next(updatedSettings);
    localStorage.setItem('userSettings', JSON.stringify(updatedSettings));
  }

  openSettings() {
    this.isSettingsOpen.next(true);
  }

  closeSettings() {
    this.isSettingsOpen.next(false);
  }

  getCurrentSettings(): Settings {
    return this.settings.value;
  }
} 