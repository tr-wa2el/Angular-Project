import { Routes } from '@angular/router';
import { LoginComp } from './components/login-comp/login-comp';
import { RegisterComp } from './components/register-comp/register-comp';
import { AccountDetaiComp } from './components/account-detai-comp/account-detai-comp';
import { authServiceGuard } from './auth/auth-service-guard';
import { SearchResults } from './components/search-results/search-results';
import { MoviesComponent } from './components/movies-component/movies-component';
import { FilteredMovies } from './components/filtered-movies/filtered-movies';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home').then((m) => m.HomeComponent),
    title: 'Home - Movie App',
  },
  {
    path: 'movie/:id',
    loadComponent: () =>
      import('./pages/movie-details/movie-details').then((m) => m.MovieDetailsComponent),
    title: 'Movie Details',
  },
  {
    path: 'wishlist',
    loadComponent: () => import('./pages/wishlist/wishlist').then((m) => m.WishlistComponent),
    title: 'My Wishlist - Movie App',
  },
  {
    path: 'popular',
    loadComponent: () => import('./pages/popular/popular').then(m => m.PopularComponent),
    title: 'Popular Movies - Movie App',
  },
  {
    path: 'top-rated',
    loadComponent: () => import('./pages/top-rated/top-rated').then(m => m.TopRatedComponent),
    title: 'Top Rated Movies - Movie App',
  },
  {
    path: 'genremovie',
    loadComponent: () => import('./components/genremovies/genremovies').then(m => m.Genremovies),
    title: 'My Genre Movie - Movie App',
  },
  {
    path: 'upcoming',
    loadComponent: () => import('./pages/upcoming/upcoming').then(m => m.UpcomingComponent),
    title: 'Upcoming Movies - Movie App',
  },
  {
    path: 'search',
    loadComponent: () =>
      import('./components/search-results/search-results').then((m) => m.SearchResults),
    title: 'Search Results - Movie App',
  },
  {
    path: 'login',
    component: LoginComp,
    title: 'Login',
  },
  {
    path: 'register',
    component: RegisterComp,
    title: 'Register',
  },
  {
    path: 'accdetails',
    component: AccountDetaiComp,
    title: 'AccountDetails',
    canActivate: [authServiceGuard],
  },
  {
    path:'movies',
    component : MoviesComponent,
    title:"Movies",
  },
  {
    path:'filteredmovi',
    component : FilteredMovies,
    title:"Filter Movies",
  },

  {
    path: '**',
    redirectTo: 'home',
  },
];
