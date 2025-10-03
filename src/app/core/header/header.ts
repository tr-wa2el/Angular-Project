import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../components/navbar/navbar';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class HeaderComponent {}
