import { Component, NgZone, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { UserService } from '../../shared/user-service';
import { AuthService } from '../../shared/authservice';

@Component({
  selector: 'app-account-detai-comp',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './account-detai-comp.html',
  styleUrls: ['./account-detai-comp.css']
})
export class AccountDetaiComp implements OnInit {
  profileForm!: FormGroup;
  userPhotoURL: string = 'assets/default-avatar.png';
  selectedFileBase64: string | null = null;
  loading = false;
  success = false;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private authService: AuthService,
    private zone: NgZone
  ) {}

  ngOnInit(): void {
    const user = this.authService.user;

    this.profileForm = this.fb.group({
      name: [user?.displayName || '', Validators.required],
      email: [{ value: user?.email || '', disabled: true }],
      phone: [''],
      address: ['']
    });

    // جلب صورة من localStorage أولاً
    const savedPhoto = localStorage.getItem('userPhoto');
    if (savedPhoto) this.userPhotoURL = savedPhoto;
    else if (user?.photoURL) this.userPhotoURL = user.photoURL;
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      this.selectedFileBase64 = reader.result as string;
      this.userPhotoURL = this.selectedFileBase64;
      localStorage.setItem('userPhoto', this.selectedFileBase64);
    };
    reader.readAsDataURL(file);
  }

  async saveChanges() {
    if (this.profileForm.invalid) return;

    this.loading = true;
    this.success = false;

    const { name, phone, address } = this.profileForm.value;

    try {
      await this.userService.updateProfileData(
        name,
        phone,
        address,
        this.selectedFileBase64 || undefined
      );

      this.zone.run(() => {
        this.success = true;
        this.selectedFileBase64 = null;

        const user = this.authService.user;
        if (user) this.profileForm.patchValue({ name: user.displayName });
      });
    } catch (err) {
      console.error('Error saving profile:', err);
      alert('Failed to save profile.');
    } finally {
      this.zone.run(() => (this.loading = false));
    }
  }
}
