import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SettingsService } from '../../services/settings.service';
import { SettingsOverlayComponent } from '../settings-overlay/settings-overlay.component';

interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  address: string;
  bio: string;
  avatar?: string;
  lastLogin: string;
  createdAt: string;
  socialLinks: {
    twitter: string;
    linkedin: string;
    github: string;
  };
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule, SettingsOverlayComponent]
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  isEditing = false;
  isLoading = false;
  showSuccessMessage = false;
  successMessage = '';
  errorMessage = '';
  activeTab = 'personal';
  isSettingsOpen = false;
  userProfile: UserProfile | null = null;
  isUploadingAvatar = false;

  constructor(
    private fb: FormBuilder,
    private settingsService: SettingsService
  ) {
    this.profileForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.pattern('^[0-9-+()]*$')]],
      address: [''],
      bio: ['', [Validators.maxLength(500)]],
      socialLinks: this.fb.group({
        twitter: [''],
        linkedin: [''],
        github: ['']
      })
    });
  }

  ngOnInit() {
    // Load user profile data
    this.loadUserProfile();
    
    // Subscribe to settings changes
    this.settingsService.isSettingsOpen$.subscribe(isOpen => {
      this.isSettingsOpen = isOpen;
    });
  }

  get formControls() {
    return this.profileForm.controls;
  }

  get fullName(): string {
    return `${this.userProfile?.firstName || ''} ${this.userProfile?.lastName || ''}`.trim();
  }

  get initials(): string {
    const first = this.userProfile?.firstName?.[0] || '';
    const last = this.userProfile?.lastName?.[0] || '';
    return (first + last).toUpperCase();
  }

  get formattedLastLogin(): string {
    return this.userProfile?.lastLogin ? new Date(this.userProfile.lastLogin).toLocaleString() : 'Never';
  }

  get formattedCreatedAt(): string {
    return this.userProfile?.createdAt ? new Date(this.userProfile.createdAt).toLocaleString() : 'Unknown';
  }

  loadUserProfile() {
    this.isLoading = true;
    // Simulate API call
    setTimeout(() => {
      this.userProfile = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phoneNumber: '+1 (555) 123-4567',
        address: '123 Main St, City, Country',
        bio: 'Software developer passionate about creating amazing user experiences.',
        lastLogin: new Date().toISOString(),
        createdAt: new Date('2023-01-01').toISOString(),
        socialLinks: {
          twitter: 'johndoe',
          linkedin: 'johndoe',
          github: 'johndoe'
        }
      };
      this.profileForm.patchValue(this.userProfile);
      this.isLoading = false;
    }, 1000);
  }

  toggleEdit() {
    this.isEditing = !this.isEditing;
    if (!this.isEditing && this.userProfile) {
      this.profileForm.patchValue(this.userProfile);
    }
  }

  onSubmit() {
    if (this.profileForm.valid) {
      this.isLoading = true;
      // Simulate API call
      setTimeout(() => {
        if (this.userProfile) {
          this.userProfile = { ...this.userProfile, ...this.profileForm.value };
          this.isEditing = false;
          this.isLoading = false;
          this.showSuccessMessage = true;
          this.successMessage = 'Profile updated successfully!';
          setTimeout(() => {
            this.showSuccessMessage = false;
          }, 3000);
        }
      }, 1000);
    }
  }

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.isUploadingAvatar = true;
      // Simulate file upload
      setTimeout(() => {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          if (this.userProfile) {
            this.userProfile.avatar = e.target.result;
          }
          this.isUploadingAvatar = false;
        };
        reader.readAsDataURL(file);
      }, 1000);
    }
  }

  setActiveTab(tab: string) {
    this.activeTab = tab;
  }

  openSettings() {
    this.settingsService.openSettings();
  }

  closeSettings() {
    this.settingsService.closeSettings();
  }
}
