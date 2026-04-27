import { inject } from '@angular/core'
import { CanActivateFn, Router } from '@angular/router'
import { AuthService } from './auth-service'

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService)
  const router = inject(Router)
  // Vérifie si l'utilisateur est connecté
  // Si l'utilisateur est connecté, autorise l'accès à la route
  // Sinon, redirige vers la page de connexion
  if(authService.currentUser())
    return true
  return router.createUrlTree(['/auth'])
}
