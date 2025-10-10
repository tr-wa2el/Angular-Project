import { Pipe, PipeTransform, inject, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { I18nService } from '../services/i18n.service';
import { Subscription } from 'rxjs';

@Pipe({
  name: 'translate',
  standalone: true,
  pure: false // Make it impure to react to language changes
})
export class TranslatePipe implements PipeTransform, OnDestroy {
  private i18nService = inject(I18nService);
  private cdr = inject(ChangeDetectorRef);
  private langSubscription?: Subscription;
  private translationsSubscription?: Subscription;

  constructor() {
    // Subscribe to language changes
    this.langSubscription = this.i18nService.currentLanguage$.subscribe(() => {
      this.cdr.markForCheck();
    });

    // Subscribe to translations loading
    this.translationsSubscription = this.i18nService.translations$.subscribe(() => {
      this.cdr.markForCheck();
    });
  }

  transform(key: string, params?: { [key: string]: any }): string {
    return this.i18nService.translate(key, params);
  }

  ngOnDestroy(): void {
    this.langSubscription?.unsubscribe();
    this.translationsSubscription?.unsubscribe();
  }
}
