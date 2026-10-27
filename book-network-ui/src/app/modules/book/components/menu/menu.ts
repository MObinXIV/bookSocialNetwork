import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { TokenService } from '../../../../services/token/token.service';

@Component({
  selector: 'app-menu',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './menu.html',
  styleUrl: './menu.scss',
  standalone: true
})
export class Menu {
  isMenuExpanded = false;

  constructor(
    private tokenService: TokenService,
    private router: Router
  ) {}

  closeMenu(): void {
    this.isMenuExpanded = false;
  }

  logout(): void {
    this.tokenService.clear();
    this.closeMenu();
    this.router.navigate(['/login']);
  }
}
