import { HttpClient } from '@angular/common/http'
import { inject, Injectable, signal } from '@angular/core'
import { environment } from '../../environments/environment'
import { CurrentUser } from './current-user.model'
import { catchError, of, tap } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  httpClient = inject(HttpClient)

  baseUrl = environment.apiUrl + 'auth'

  // Pour stocker les valeurs issues de login et ça gere aussi le cas où l'utilisateur n'est pas connecté, d'où le type CurrentUser | undefined
  currentUser = signal<CurrentUser | undefined>(undefined)

  loadCurrentUser() {
    return this.httpClient.get<CurrentUser>(`${this.baseUrl}/me`).pipe(
      tap((currentUser) => this.currentUser.set(currentUser)),

      // En cas d'erreur (par exemple, si l'utilisateur n'est pas connecté), on s'assure que currentUser est à undefined
      catchError(() => {
        this.currentUser.set(undefined)
        return of(undefined) // On retourne un Observable de undefined pour que le flux continue normalement même en cas d'erreur
      }),
    )
  }

  login(username: string, password: string) {
    return this.httpClient
      .post<CurrentUser>(`${this.baseUrl}/login`, { username, password })
      .pipe(tap((currentUser) => this.currentUser.set(currentUser))) //Pour stocker les valeurs issues de login dans currentUser
  }

  register(username: string, password: string) {
    return this.httpClient
      .post<CurrentUser>(`${this.baseUrl}/register`, { username, password })
      .pipe(tap((currentUser) => this.currentUser.set(currentUser))) // On s'inscrit puis ça fait automatiquement la connexion
  }

  logout() {
    return this.httpClient
      .post(`${this.baseUrl}/logout`, {})
      .pipe(tap(() => this.currentUser.set(undefined))) //Pour stocker les valeurs issues de login dans currentUser
  }
}
