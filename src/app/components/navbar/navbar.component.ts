import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html'
})
export class NavbarComponent {
  cartItemCount: number = 0;
  isScrolled = false;
  lastScrollTop = 0;

  constructor() {
    // Initialize cart count (you can replace this with actual cart service later)
    this.cartItemCount = 0;
  }

  @HostListener('window:scroll', ['$event'])
  onScroll() {
    const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
    
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
}
