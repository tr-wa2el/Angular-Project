import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, FormsModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class NavbarComponent {
  themeService = inject(ThemeService);
  private router = inject(Router);

  searchQuery = '';
  showMobileMenu = false;

  onSearch(event: Event): void {
    event.preventDefault();
    if (this.searchQuery.trim()) {
      alert('Search functionality will be implemented by Search Lead (Person 4)');
      this.searchQuery = '';
    }
  }

  toggleDarkMode(): void {
    this.themeService.toggleDarkMode();
  }

  toggleMobileMenu(): void {
    this.showMobileMenu = !this.showMobileMenu;
  }
}
