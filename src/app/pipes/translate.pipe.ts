import { Pipe, PipeTransform, inject } from '@angular/core';
import { I18nService } from '../services/i18n.service';

@Pipe({
  name: 'translate',
  standalone: true,
  pure: false // Make it impure to react to language changes
})
export class TranslatePipe implements PipeTransform {
  private i18nService = inject(I18nService);

  transform(key: string, params?: { [key: string]: any }): string {
    return this.i18nService.translate(key, params);
  }
}
