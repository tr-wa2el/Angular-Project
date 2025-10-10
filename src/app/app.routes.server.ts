import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  // Static pages - Prerender
  {
    path: '',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'home',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'login',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'register',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'accdetails',
    renderMode: RenderMode.Prerender
  },

  // Dynamic pages with pagination - Server-side render
  {
    path: 'popular',
    renderMode: RenderMode.Server
  },
  {
    path: 'top-rated',
    renderMode: RenderMode.Server
  },
  {
    path: 'upcoming',
    renderMode: RenderMode.Server
  },
  {
    path: 'search-results',
    renderMode: RenderMode.Server
  },
  {
    path: 'genremovies/:id',
    renderMode: RenderMode.Server
  },

  // Dynamic movie details - Server-side render
  {
    path: 'movie/:id',
    renderMode: RenderMode.Server
  },

  // User-specific pages - Server-side render
  {
    path: 'wishlist',
    renderMode: RenderMode.Server
  },

  // Fallback - Client-side render
  {
    path: '**',
    renderMode: RenderMode.Client
  }
];
