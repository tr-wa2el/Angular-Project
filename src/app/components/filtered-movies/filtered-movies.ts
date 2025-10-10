import { Component } from '@angular/core';
import { GenreFilteringServ } from '../../shared/genre-filtering-serv';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Moviedetails } from '../moviedetails/moviedetails';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-filtered-movies',
  standalone: true,
  imports: [CommonModule, MatDialogModule, FormsModule],
  templateUrl: './filtered-movies.html',
  styleUrl: './filtered-movies.css',
})
export class FilteredMovies {
  genres: any[] = [];
  movies: any[] = [];
  selectedGenre: number | null = null;
  selectedSort: string = 'popularity.desc'; // الترتيب الافتراضي
  currentPage: number = 1;       // 🔹 الصفحة الحالية
  totalPages: number = 1; 

  constructor(private movieService: GenreFilteringServ, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.loadGenres();
    this.loadAllMovies(); // 👈 أول ما الصفحة تفتح يعرض كل الأفلام
  }

  // 🔹 تحميل قائمة الأنواع
  loadGenres() {
    this.movieService.getGenres().subscribe((res) => {
      this.genres = res.genres;
    });
  }

  // 🔹 تحميل جميع الأفلام بدون فلترة نوع
  loadAllMovies() {
    this.movieService
      .getAllMovies(this.selectedSort)
      .subscribe((res) => {
        this.movies = res.results;
      });
  }

  // 🔹 تحميل الأفلام حسب النوع والترتيب
  loadMovies() {
    if (this.selectedGenre) {
      this.movieService
        .getMoviesByGenreAndSort(this.selectedGenre, this.selectedSort)
        .subscribe((res) => {
          this.movies = res.results;
        });
    } else {
      // 👈 لو المستخدم ما اختارش نوع، نعرض كل الأفلام
      this.loadAllMovies();
    }
  }

  onGenreSelect(genreId: number) {
    this.selectedGenre = genreId;
    this.currentPage = 1; // 🔹 رجوع لأول صفحة
    this.loadMovies();
  }
  // ✅ الدالة اللي كانت ناقصة
  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadMovies();
    }
  }

  onSortChange() {
    this.loadMovies();
  }

   // 🔁 Reset Filters
  resetFilters() {
    this.selectedGenre = null;
    this.selectedSort = 'popularity.desc';
    this.loadAllMovies();
  }

  openDetails(movieId: number) {
    console.log('Opening details for movieId:', movieId);
    this.dialog.open(Moviedetails, {
      width: '700px',
      data: { movieId },
    });
  }
}
