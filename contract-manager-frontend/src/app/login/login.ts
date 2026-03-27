import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html'
})
export class LoginComponent {

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  loading = false;
  error?: string;

  form = this.fb.nonNullable.group({
    email: ['', Validators.required],
    password: ['', Validators.required]
  });

  submit(): void {
    if (this.form.invalid || this.loading) return;

    this.loading = true;
    this.error = undefined;

    const { email, password } = this.form.getRawValue();

    this.authService.login(email, password).subscribe(success => {
      if (success) {
        this.router.navigate(['/partners']);
      } else {
        this.error = 'Hibás email vagy jelszó';
      }
      this.loading = false;
    });
  }
}
