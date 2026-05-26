import { Component, inject, signal } from '@angular/core'
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { Card } from 'primeng/card'
import { Button } from 'primeng/button'
import { InputText } from 'primeng/inputtext'
import { Password } from 'primeng/password'
import { AuthService } from '../auth-service'
import { Router } from '@angular/router'
import { MessageService } from 'primeng/api'

@Component({
  selector: 'app-auth-form',
  imports: [ReactiveFormsModule, Card, Button, InputText, Password],
  templateUrl: './auth-form.html',
  styleUrl: './auth-form.scss',
})
export class AuthForm {
  //injection du service d'authentification pour pouvoir appeler les méthodes de login et register
  authService = inject(AuthService)

  //Injection du message service pour afficher des messages à l'utilisateur en cas d'erreur de login ou register
  messageService = inject(MessageService)

  //Router de navigation pour rediriger l'utilisateur après login ou register
  router = inject(Router)

  mode = signal<'login' | 'register'>('login')

  form = new FormGroup({
    username: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    password: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(4)],
    }),
  })

  toggleMode() {
    this.mode.update((value) => (value === 'login' ? 'register' : 'login'))
  }

  submit() {
    console.log('data', this.form.value)

    this.form.markAllAsTouched()
    if (this.form.invalid) return

    const { username, password } = this.form.getRawValue()

    if (this.mode() === 'login') {
      //console.log('Login with', this.form.getRawValue())
      this.login(username, password)
    } else {
      //console.log('Register with', this.form.getRawValue())
      this.register(username, password)
    }
  }

  login(username: string, password: string) {
    this.authService.login(username, password).subscribe({
      next: () => {
        void this.router.navigate(['/'])
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Connexion impossible, reessayez.',
        })
      },
    })
  }

  register(username: string, password: string) {
    this.authService.register(username, password).subscribe(() => {
      void this.router.navigate(['/'])
    })
  }
}
