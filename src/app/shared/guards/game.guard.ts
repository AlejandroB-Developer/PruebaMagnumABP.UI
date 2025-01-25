import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class GameGuard implements CanActivate {
  private isAccessAllowed = false;

  constructor(private readonly router: Router) {}

  canActivate(): boolean {
    if (this.isAccessAllowed) {
      this.isAccessAllowed = false;
      return true;
    } else {
      this.router.navigate(['/']);
      return false;
    }
  }

  grantAccess(): void {
    this.isAccessAllowed = true;
  }
}
