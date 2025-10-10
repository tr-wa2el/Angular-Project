import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { GenreFilteringServ } from '../../shared/genre-filtering-serv';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-moviedetails',
  imports: [CommonModule],
  templateUrl: './moviedetails.html',
  styleUrl: './moviedetails.css'
})
export class Moviedetails implements OnInit{
  movie: any;
   isLoading = true; // 👈 نضيف مؤشر تحميل

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { movieId: number },
    private dialogRef: MatDialogRef<Moviedetails>,
    private movieService: GenreFilteringServ,
    private cdr: ChangeDetectorRef // ✅ أضف هذا
  ) {}

  ngOnInit(): void {
    console.log('Dialog opened with data:', this.data); // ✅ اختبار
    this.loadMovieDetails();
  }

  loadMovieDetails() {
    if (!this.data?.movieId) {
      console.error('❌ No movieId received in dialog data');
      return;
    }

    this.movieService.getMovieDetails(this.data.movieId).subscribe({
      next: (res) => {
        console.log('✅ Movie details loaded:', res); // ✅ تأكيد
        this.movie = res;
        this.isLoading = false;
        this.cdr.detectChanges(); // ✅ تحديث يدوي لحالة التغيير
      },
      error: (err) => {
        console.error('❌ Error loading movie details:', err);
        this.isLoading = false;
        this.cdr.detectChanges(); // ✅ نفس الشيء في الخطأ
      }
    });
  }

  close() {
    this.dialogRef.close();
  }

}
