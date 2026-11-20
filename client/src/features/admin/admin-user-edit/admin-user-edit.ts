import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AdminService } from '../../../core/services/admin-service';
import { ToastService } from '../../../core/services/toast-service';
import { AdminUpdateUser } from '../../../types/member';

@Component({
  selector: 'app-admin-user-edit',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './admin-user-edit.html',
  styleUrl: './admin-user-edit.css'
})
export class AdminUserEdit implements OnInit {
  private route = inject(ActivatedRoute);
  private adminService = inject(AdminService);
  private toast = inject(ToastService);
  protected update: AdminUpdateUser = {};
  protected updateLoaded = signal(false);
  protected userId = '';

  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('id') ?? '';
    this.adminService.getUser(this.userId).subscribe(user => {
      this.update = {
        email: user.email,
        displayName: user.displayName,
        description: user.description ?? '',
        gender: user.gender,
        city: user.city,
        country: user.country,
        password: ''
      };
      this.updateLoaded.set(true);
    });
  }

  updateUser(): void {
    const payload: AdminUpdateUser = { ...this.update };
    if (!payload.password) delete payload.password;
    this.adminService.updateUser(this.userId, payload).subscribe({
      next: () => this.toast.success('User updated successfully'),
      error: error => this.toast.error(error.error)
    });
  }
}
