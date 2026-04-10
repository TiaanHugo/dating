import { Component, inject, signal } from '@angular/core';
import { RouterLink } from "@angular/router";
import { Register } from "../account/register/register";
import { AccountService } from '../../core/services/account-service';

@Component({
  selector: 'app-home',
  imports: [Register, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {
  protected accountService = inject(AccountService);
  protected registerMode = signal(false);

  showRegister(value: boolean) {
    this.registerMode.set(value);
  }
}
