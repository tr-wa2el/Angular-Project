import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, firstValueFrom } from 'rxjs';

export type SupportedLanguage = 'en' | 'ar' | 'fr' | 'zh';

export interface LanguageConfig {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  dir: 'ltr' | 'rtl';
  apiCode: string; // Code for TMDB API
}

@Injectable({
  providedIn: 'root'
})
export class I18nService {
  private http = inject(HttpClient);
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);

  private readonly STORAGE_KEY = 'app_language';
  private readonly DEFAULT_LANGUAGE: SupportedLanguage = 'en';
  private readonly TRANSLATIONS_PATH = 'assets/i18n/';

  // Supported languages configuration
  readonly languages: LanguageConfig[] = [
    { code: 'en', name: 'English', nativeName: 'English', dir: 'ltr', apiCode: 'en-US' },
    { code: 'ar', name: 'Arabic', nativeName: 'العربية', dir: 'rtl', apiCode: 'ar-SA' },
    { code: 'fr', name: 'French', nativeName: 'Français', dir: 'ltr', apiCode: 'fr-FR' },
    { code: 'zh', name: 'Chinese', nativeName: '中文', dir: 'ltr', apiCode: 'zh-CN' }
  ];

  // Current language state
  private currentLanguageSubject: BehaviorSubject<SupportedLanguage>;
  public currentLanguage$: Observable<SupportedLanguage>;

  // Current direction state
  private directionSubject: BehaviorSubject<'ltr' | 'rtl'>;
  public direction$: Observable<'ltr' | 'rtl'>;

  // Translation data
  private translations: { [key: string]: any } = {};
  private translationsLoaded = false;

  // Observable for translations updates
  private translationsSubject = new BehaviorSubject<{ [key: string]: any }>({});
  public translations$ = this.translationsSubject.asObservable();

  constructor() {
    const savedLanguage = this.loadLanguageFromStorage();
    this.currentLanguageSubject = new BehaviorSubject<SupportedLanguage>(savedLanguage);
    this.currentLanguage$ = this.currentLanguageSubject.asObservable();

    const initialDirection = this.getLanguageConfig(savedLanguage).dir;
    this.directionSubject = new BehaviorSubject<'ltr' | 'rtl'>(initialDirection);
    this.direction$ = this.directionSubject.asObservable();

    // Load translations for current language
    this.loadTranslations(savedLanguage);

    // Apply initial direction to HTML
    this.applyDirection(initialDirection);
  }

  /**
   * Get current language
   */
  getCurrentLanguage(): SupportedLanguage {
    return this.currentLanguageSubject.value;
  }

  /**
   * Get current direction
   */
  getCurrentDirection(): 'ltr' | 'rtl' {
    return this.directionSubject.value;
  }

  /**
   * Get language configuration
   */
  getLanguageConfig(code: SupportedLanguage): LanguageConfig {
    return this.languages.find(lang => lang.code === code) || this.languages[0];
  }

  /**
   * Get current language config
   */
  getCurrentLanguageConfig(): LanguageConfig {
    return this.getLanguageConfig(this.getCurrentLanguage());
  }

  /**
   * Get API language code for TMDB
   */
  getApiLanguageCode(): string {
    return this.getCurrentLanguageConfig().apiCode;
  }

  /**
   * Set language
   */
  setLanguage(code: SupportedLanguage): void {
    if (!this.isValidLanguage(code)) {
      console.error(`Invalid language code: ${code}`);
      return;
    }

    const config = this.getLanguageConfig(code);

    // Update language
    this.currentLanguageSubject.next(code);
    this.saveLanguageToStorage(code);

    // Update direction
    this.directionSubject.next(config.dir);
    this.applyDirection(config.dir);

    // Load translations
    this.loadTranslations(code);

    console.log(`🌍 Language changed to: ${config.name} (${code})`);
    console.log(`📐 Direction: ${config.dir}`);
    console.log(`🎬 API Code: ${config.apiCode}`);
  }

  /**
   * Check if language code is valid
   */
  private isValidLanguage(code: string): code is SupportedLanguage {
    return this.languages.some(lang => lang.code === code);
  }

  /**
   * Load translations for a language from JSON files
   */
  private loadTranslations(code: SupportedLanguage): void {
    const translationFile = `${this.TRANSLATIONS_PATH}${code}.json`;

    this.http.get(translationFile).subscribe({
      next: (translations: any) => {
        this.translations = translations;
        this.translationsLoaded = true;
        this.translationsSubject.next(translations); // Notify subscribers
        console.log(`✅ Loaded translations for: ${code}`);
      },
      error: (error) => {
        console.error(`❌ Failed to load translations for ${code}:`, error);
        console.log(`🔄 Falling back to embedded translations...`);
        // Fallback to embedded translations
        this.translations = this.getEmbeddedTranslations(code);
        this.translationsLoaded = true;
        this.translationsSubject.next(this.translations); // Notify subscribers
      }
    });
  }

  /**
   * Get translation for a key
   */
  translate(key: string, params?: { [key: string]: any }): string {
    const keys = key.split('.');
    let value: any = this.translations;

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return key; // Return key if translation not found
      }
    }

    // Replace parameters if provided
    if (typeof value === 'string' && params) {
      return this.interpolate(value, params);
    }

    return typeof value === 'string' ? value : key;
  }

  /**
   * Interpolate parameters in translation string
   */
  private interpolate(text: string, params: { [key: string]: any }): string {
    return text.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      return params[key] !== undefined ? params[key] : match;
    });
  }

  /**
   * Apply direction to HTML element
   */
  private applyDirection(dir: 'ltr' | 'rtl'): void {
    if (!this.isBrowser) return;

    const html = document.documentElement;
    html.setAttribute('dir', dir);
    html.setAttribute('lang', this.getCurrentLanguage());

    // Add/remove RTL class for styling
    if (dir === 'rtl') {
      html.classList.add('rtl');
      html.classList.remove('ltr');
    } else {
      html.classList.add('ltr');
      html.classList.remove('rtl');
    }
  }

  /**
   * Load language from storage
   */
  private loadLanguageFromStorage(): SupportedLanguage {
    if (!this.isBrowser) return this.DEFAULT_LANGUAGE;

    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored && this.isValidLanguage(stored)) {
        return stored as SupportedLanguage;
      }
    } catch (error) {
      console.error('Error loading language from storage:', error);
    }

    return this.DEFAULT_LANGUAGE;
  }

  /**
   * Save language to storage
   */
  private saveLanguageToStorage(code: SupportedLanguage): void {
    if (!this.isBrowser) return;

    try {
      localStorage.setItem(this.STORAGE_KEY, code);
    } catch (error) {
      console.error('Error saving language to storage:', error);
    }
  }

  /**
   * Preload translations for a language (can be used for optimization)
   */
  async preloadTranslations(code: SupportedLanguage): Promise<void> {
    const translationFile = `${this.TRANSLATIONS_PATH}${code}.json`;
    try {
      const translations = await firstValueFrom(this.http.get(translationFile));
      console.log(`✅ Preloaded translations for: ${code}`);
    } catch (error) {
      console.error(`❌ Failed to preload translations for ${code}:`, error);
    }
  }

  /**
   * Embedded translations as fallback (loaded from the original data)
   */
  private getEmbeddedTranslations(code: SupportedLanguage): any {
    // This is a fallback in case JSON files fail to load
    // You can keep minimal translations here or fetch from a CDN
    return {};
  }
}
