import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type Theme = 'light' | 'dark' | 'system';


@Component({
  selector: 'app-settings-overlay',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './settings-overlay.component.html'
})
export class SettingsOverlayComponent implements OnInit {
  @Input() isOpen = false;
  selectedTheme: Theme = 'light';
  settings = {
    emailNotifications: true,
    pushNotifications: false
  };

  constructor() {}

  ngOnInit() {
    // this.themeService.theme$.subscribe(theme => {
    //   this.selectedTheme = theme;
    // });
  }

  updateTheme(theme: Theme) {
    this.selectedTheme = theme;
    // this.themeService.setTheme(theme);
  }

  updateEmailNotifications(enabled: boolean) {
    this.settings.emailNotifications = enabled;
  }

  updatePushNotifications(enabled: boolean) {
    this.settings.pushNotifications = enabled;
  }

  onClose() {
    this.isOpen = false;
  }
} 