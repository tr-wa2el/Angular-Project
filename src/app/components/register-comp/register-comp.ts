import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../shared/authservice';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register-comp',
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './register-comp.html',
  styleUrls: ['./register-comp.css']
})
export class RegisterComp implements OnInit {
  registerForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      name: ['', [Validators.required]],
      username: ['', [Validators.required, this.noSpacesValidator()]],
      password: ['', [Validators.required, this.passwordValidator()]],
      confirmPassword: ['', [Validators.required]],
    }, { validators: this.matchPasswordsValidator() });
  }

  // Validator: no spaces in username
  noSpacesValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      return /\s/.test(control.value) ? { hasSpace: true } : null;
    };
  }

  // Validator: strong password
  passwordValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value: string = control.value || '';
      const pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@*%$#]).{8,}$/;
      return !pattern.test(value) ? { weakPassword: true } : null;
    };
  }

  // Validator: confirm password matches
  matchPasswordsValidator(): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      const pwd = group.get('password')?.value;
      const confirmPwd = group.get('confirmPassword')?.value;
      return pwd === confirmPwd ? null : { passwordsMismatch: true };
    };
  }

  onSubmit() {
    if (!this.registerForm.valid) return;

    const { email, password, name } = this.registerForm.value;

    // الآن نرسل displayName أيضاً
    this.auth.register(email, password, name).subscribe({
      next: (user) => {
        console.log('✅ User registered:', user);
        this.router.navigate(['/login']);
      },
      error: (err: any) => {
        console.error('🔥 Firebase Error:', err);
        alert(err?.message || 'Registration failed, please try again.');
      }
    });
  }
}
