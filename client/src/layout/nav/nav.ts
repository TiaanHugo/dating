import { Component, ElementRef, inject, OnInit, signal, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../../core/services/account-service';
import { Router, RouterLink, RouterLinkActive } from "@angular/router";
import { ToastService } from '../../core/services/toast-service';
import { themes } from '../theme';
import { BusyService } from '../../core/services/busy-service';
import { AdminService } from '../../core/services/admin-service';

@Component({
  selector: 'app-nav',
  imports: [FormsModule, RouterLink, RouterLinkActive],
  templateUrl: './nav.html',
  styleUrl: './nav.css'
})
export class Nav implements OnInit {
  protected accountService = inject(AccountService);
  protected busyService = inject(BusyService);
  protected toast = inject(ToastService);
  private adminService = inject(AdminService);
  private router = inject(Router);
  protected creds: any = {};
  protected selectedTheme = signal<string>(localStorage.getItem('theme') || 'light');
  protected themes = themes;
  protected adminPassword = '';
  protected adminError = '';
  @ViewChild('adminModal') adminModal?: ElementRef<HTMLDialogElement>;

  ngOnInit(): void {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      document.documentElement.setAttribute('data-theme', savedTheme);
    }
  }

  handleSelectTheme(theme: string) {
    this.selectedTheme.set(theme);
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    const elem = document.activeElement as HTMLDivElement;
    if (elem) {
      elem.blur();
    }
  }

  login() {
    this.accountService.login(this.creds).subscribe({
      next: () => {
        this.router.navigateByUrl('/members');
        this.toast.success('Logged in successfully');
        this.creds = {};
      },
      error: (error) => {
        this.toast.error(error.error);
      }
    });
  }


  logout() {
    this.accountService.logout();
    this.router.navigateByUrl('/');
  }

  openAdminModal(): void {
    this.adminPassword = '';
    this.adminError = '';
    this.adminModal?.nativeElement.showModal();
  }

  closeAdminModal(): void {
    this.adminModal?.nativeElement.close();
  }

  submitAdminPassword(): void {
    this.adminError = '';
    this.adminService.authenticate(this.adminPassword).subscribe({
      next: () => {
        this.closeAdminModal();
        this.router.navigateByUrl('/admin/users');
      },
      error: error => {
        this.adminError = error.status === 401
          ? 'Incorrect admin password.'
          : 'Unable to open the Admin Portal. Please try again.';
      }
    });
  }
}
