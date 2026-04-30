import { Component, effect, inject, signal } from '@angular/core'
import { NgOptimizedImage } from '@angular/common'
import { Button } from 'primeng/button'
import { Router, RouterLink } from '@angular/router'
import { AuthService } from '../auth/auth-service'

@Component({
  selector: 'app-navbar',
  imports: [NgOptimizedImage, Button, RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {
  // Injection du service d'authentification pour pouvoir afficher le nom de l'utilisateur connecté et gérer la déconnexion
  authService = inject(AuthService)

  readonly DARK_MODE_KEY = 'dark-mode'

  isDark = signal(localStorage.getItem(this.DARK_MODE_KEY) === 'true')

  //creon un fonction qui permet d'exuter du code quand un signal change de valeur
  constructor() {
    effect(() => {
      document.documentElement.classList.toggle('app-dark', this.isDark())
      localStorage.setItem(this.DARK_MODE_KEY, String(this.isDark()))
    })
  }

  //injection de la route pour naviguer la deconnexion
  router = inject(Router)

  logout = () => {
    this.authService.logout().subscribe(() => {
      // La déconnexion a réussi, vous pouvez effectuer des actions supplémentaires ici si nécessaire
      this.router.navigate(['/'])
    })
  }
}
