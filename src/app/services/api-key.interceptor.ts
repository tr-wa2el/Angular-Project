import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../environments/environment';

export const apiKeyInterceptor: HttpInterceptorFn = (req, next) => {
  // Only add API key to TMDB API requests
  if (req.url.includes(environment.tmdbApiBaseUrl)) {
    // Check if API key is already in the URL params
    if (!req.params.has('api_key')) {
      const modifiedReq = req.clone({
        setParams: {
          api_key: environment.tmdbApiKey
        }
      });
      return next(modifiedReq);
    }
  }

  return next(req);
};
