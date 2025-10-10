import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';

@Component({
  selector: 'app-search-results',
  standalone: true,
  imports: [CommonModule, HttpClientModule, RouterModule],
  templateUrl: './search-results.html',
  styleUrls: ['./search-results.css']
})
export class SearchResults implements OnInit {
  searchQuery: string = '';
  results: any[] = [];
  apiKey: string = '47247b21145f5cac46ea5811f52f35aa';

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.searchQuery = params['query'] || '';
      if (this.searchQuery) {
        this.search();
      }
    });
  }

  search() {
    const apiUrl = `https://api.themoviedb.org/3/search/movie?api_key=${this.apiKey}&query=${encodeURIComponent(this.searchQuery)}`;

    this.http.get<any>(apiUrl).subscribe({
      next: data => {
        this.results = data.results || [];
      },
      error: err => {
        console.error('حدث خطأ أثناء البحث:', err);
      }
    });
  }
}
