import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SettingsService } from '../../services/settings.service';
import { AuthService } from '../../services/auth.service';

interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string;
}

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html'
})
export class NavbarComponent implements OnInit {
  cartItemCount: number = 0;
  isScrolled = false;
  lastScrollTop = 0;
  userProfile: UserProfile | null = null;

  constructor(
    private settingsService: SettingsService,
    private authService: AuthService
  ) {
    // Initialize cart count (you can replace this with actual cart service later)
    this.cartItemCount = 0;
  }
  ngOnInit(): void {    
    this.loadUserProfile();
  }
  

  @HostListener('window:scroll', ['$event'])
  onScroll() {
    const currentScroll = window.scrollY || document.documentElement.scrollTop;
    
    if (currentScroll <= 0) {
      this.isScrolled = false;
    } else if (currentScroll < this.lastScrollTop) {
      // Scrolling up
      this.isScrolled = false;
    } else {
      // Scrolling down
      this.isScrolled = true;
    }
    
    this.lastScrollTop = currentScroll;
  }

  openSettings() {
    this.settingsService.openSettings();
  }

  loadUserProfile() {
    // Simulate loading user profile
    this.userProfile = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      avatar: undefined
    };
  }

  get initials(): string {
    if (!this.userProfile) return '';
    const first = this.userProfile.firstName?.[0] || '';
    const last = this.userProfile.lastName?.[0] || '';
    return (first + last).toUpperCase();
  }

  logout() {
    // Implement logout functionality
    this.authService.logout();
  }
}
