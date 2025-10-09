import { Injectable } from '@angular/core';
import { Firestore, doc, docData, setDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Auth } from '@angular/fire/auth';
import { updateProfile } from 'firebase/auth';


export interface UserData {
  name: string;
  phone?: string;
  address?: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private firestore: Firestore, private auth: Auth) {}

  // جلب بيانات المستخدم من Firestore
  getUserData(uid: string): Observable<UserData | null> {
    const userRef = doc(this.firestore, 'users', uid);
    return docData(userRef, { idField: 'uid' }) as Observable<UserData | null>;
  }

  // تحديث بيانات المستخدم (name, phone, address)
  async updateProfileData(
    name: string,
    phone?: string,
    address?: string,
    photoBase64?: string
  ): Promise<void> {
    const user = this.auth.currentUser;
    if (!user) throw new Error('User not logged in');

    // حفظ البيانات في Firestore
    const userRef = doc(this.firestore, 'users', user.uid);
    await setDoc(userRef, {
      name,
      phone: phone || '',
      address: address || ''
    }, { merge: true });

    // تحديث displayName في Firebase Auth
    await updateProfile(user, {
  displayName: name,
});


    // حفظ الصورة محلياً فقط
    if (photoBase64) localStorage.setItem('userPhoto', photoBase64);
  }
}
