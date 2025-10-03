import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly STORAGE_KEY = 'darkMode';

  private darkModeSignal = signal<boolean>(this.loadDarkMode());
  isDarkMode = this.darkModeSignal.asReadonly();

  constructor() {
    this.applyTheme();
  }

  private loadDarkMode(): boolean {
    if (typeof localStorage !== 'undefined') {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored === 'true';
    }
    return false;
  }

  toggleDarkMode(): void {
    const newValue = !this.darkModeSignal();
    this.darkModeSignal.set(newValue);

    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(this.STORAGE_KEY, newValue.toString());
    }

    this.applyTheme();
  }

  setDarkMode(enabled: boolean): void {
    this.darkModeSignal.set(enabled);

    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(this.STORAGE_KEY, enabled.toString());
    }

    this.applyTheme();
  }

  private applyTheme(): void {
    if (typeof document !== 'undefined') {
      if (this.darkModeSignal()) {
        document.body.classList.add('dark-mode');
      } else {
        document.body.classList.remove('dark-mode');
      }
    }
  }
}
