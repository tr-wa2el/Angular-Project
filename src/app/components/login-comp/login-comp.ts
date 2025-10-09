import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../shared/authservice';

@Component({
  selector: 'app-login-comp',
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './login-comp.html',
  styleUrls: ['./login-comp.css'],
})
export class LoginComp implements OnInit {
  loginForm!: FormGroup;

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;

      this.auth.login(email!, password!).subscribe({
        next: () => {
          console.log('✅ Login successful');
          this.router.navigate(['/']);
        },
        error: (err: any) => { // ✅ حددت النوع لتجنب TS7006
          console.log('🔥 Full Firebase Error:', err);

          const code =
            err?.code ||
            err?.error?.error?.message ||
            err?.message ||
            (typeof err === 'string' ? err : null);

          console.log('📛 Extracted code:', code);

          let message = '⚠️ حدث خطأ غير متوقع';
          if (code) {
            switch (code) {
              case 'auth/invalid-email':
                message = '📧 البريد الإلكتروني غير صالح';
                break;
              case 'auth/wrong-password':
              case 'auth/user-not-found':
              case 'auth/invalid-credential':
                message = '❌ البريد الإلكتروني أو كلمة المرور غير صحيحة';
                break;
              default:
                message = '⚠️ حدث خطأ غير متوقع';
            }
          }

          alert(message);
        },
      });
    }
  }

  // ✨ Helpers for template
  get email() {
    return this.loginForm.get('email');
  }
  get password() {
    return this.loginForm.get('password');
  }
}
