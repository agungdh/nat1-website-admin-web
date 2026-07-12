import { ChangeDetectionStrategy, Component, inject, signal, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService, UserDto } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  imports: [MatToolbarModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Dashboard implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly user = signal<UserDto | null>(null);
  protected readonly loading = signal(true);
  protected readonly error = signal('');

  ngOnInit() {
    this.authService.getCurrentUser().subscribe({
      next: (user) => {
        this.user.set(user);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load user');
        this.loading.set(false);
      },
    });
  }

  protected logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
