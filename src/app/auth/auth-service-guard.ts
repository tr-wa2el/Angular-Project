import { inject } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { CanActivateFn,Router } from '@angular/router';


export const authServiceGuard: CanActivateFn = (route, state) => {
  const auth = inject(Auth);
  const router = inject(Router);

  if (auth.currentUser) {
    return true;
  } else {
    router.navigate(['/login']);
    return false;
  }
};
