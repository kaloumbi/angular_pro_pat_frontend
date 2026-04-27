import { Component, inject, signal } from '@angular/core'
import { NgOptimizedImage } from "@angular/common";
import { Button } from "primeng/button";
import { Router, RouterLink } from "@angular/router";
import { AuthService } from '../auth/auth-service';

@Component({
  selector: 'app-navbar',
  imports: [NgOptimizedImage, Button, RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {

  // Injection du service d'authentification pour pouvoir afficher le nom de l'utilisateur connecté et gérer la déconnexion
  authService = inject(AuthService)

  isDark = signal(false);

  //injection de la route pour naviguer la deconnexion
  router = inject(Router)

  toggleDarkMode() {
    this.isDark.update(value => !value);
    document.documentElement.classList.toggle('app-dark', this.isDark());
  }


  logout = ()=> {
    this.authService.logout().subscribe(() => {
      // La déconnexion a réussi, vous pouvez effectuer des actions supplémentaires ici si nécessaire
      this.router.navigate(['/'])
    })
  }
}
