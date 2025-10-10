import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-movies-component',
  standalone: true,
  imports: [CommonModule, HttpClientModule, RouterModule],
  templateUrl: './movies-component.html',
  styleUrls: ['./movies-component.css']
})
export class MoviesComponent implements OnInit {
  movies: any[] = [];
  apiKey: string = '47247b21145f5cac46ea5811f52f35aa';

  constructor(private http: HttpClient, private router: Router) {}
  
  ngOnInit(): void {
    this.fetchMovies();

    // لإعادة تحميل الأفلام عند الرجوع إلى الصفحة
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.fetchMovies();
    });
  }

  fetchMovies() {
    const apiUrl = `https://api.themoviedb.org/3/movie/popular?api_key=${this.apiKey}&language=en-US&page=1`;

    this.http.get<any>(apiUrl).subscribe({
      next: data => this.movies = data.results || [],
      error: err => console.error('حدث خطأ أثناء جلب الأفلام:', err)
    });
  }
}
