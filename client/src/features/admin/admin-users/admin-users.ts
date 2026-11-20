import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AdminService } from '../../../core/services/admin-service';
import { AdminUser } from '../../../types/member';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './admin-users.html',
  styleUrl: './admin-users.css'
})
export class AdminUsers implements OnInit {
  private adminService = inject(AdminService);
  protected users = signal<AdminUser[]>([]);

  ngOnInit(): void {
    this.adminService.getUsers().subscribe(users => this.users.set(users));
  }
}
