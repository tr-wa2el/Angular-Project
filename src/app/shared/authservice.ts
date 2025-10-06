import { Injectable } from '@angular/core';
import { Auth, User } from '@angular/fire/auth';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile
} from 'firebase/auth';
import { from, Observable, catchError, map, throwError, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private auth: Auth) {}

  // ✅ Register
  register(email: string, password: string, displayName: string): Observable<User> {
  return from(createUserWithEmailAndPassword(this.auth, email, password)).pipe(
    switchMap((userCredential) => {
      const user = userCredential.user;
      return from(updateProfile(user, { displayName })).pipe(
        map(() => user) // بعد ما يحدث displayName، نرجع الـ user
      );
    }),
    catchError((err) => throwError(() => this.formatError(err)))
  );
}

  // ✅ Login
  login(email: string, password: string): Observable<User> {
    return from(signInWithEmailAndPassword(this.auth, email, password)).pipe(
      map((userCredential) => userCredential.user),
      catchError((error) => {
        console.error('🔥 Firebase raw error:', error);
        return throwError(() => this.formatError(error));
      })
    );
  }

  // ✅ Logout
  logout(): Observable<void> {
    return from(signOut(this.auth));
  }

  // ✅ Current User
  get user(): User | null {
    return this.auth.currentUser;
  }

  // ✅ Error Formatter
  private formatError(error: any): string {
    const code = error?.code || error?.message;
    switch (code) {
      case 'auth/email-already-in-use':
        return '📧 البريد الإلكتروني مستخدم بالفعل';
      case 'auth/invalid-email':
        return '📧 البريد الإلكتروني غير صالح';
      case 'auth/weak-password':
        return '🔑 كلمة المرور ضعيفة (6 أحرف على الأقل)';
      case 'auth/user-not-found':
        return '👤 المستخدم غير موجود';
      case 'auth/wrong-password':
        return '❌ كلمة المرور غير صحيحة';
      case 'auth/network-request-failed':
        return '🌐 مشكلة في الاتصال بالإنترنت';
      default:
        return '⚠️ حدث خطأ غير متوقع';
    }
  }

}
