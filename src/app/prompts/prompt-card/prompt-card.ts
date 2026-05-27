import { Component, computed, inject, input, linkedSignal, signal } from '@angular/core'
import { Prompt } from '../prompt.model'
import { Button, ButtonModule } from 'primeng/button'
import { TextareaModule, Textarea } from 'primeng/textarea'
import { TagModule, Tag } from 'primeng/tag'
import { CardModule, Card } from 'primeng/card'
import { Router, RouterLink } from '@angular/router'
import { AuthService } from '../../auth/auth-service'
import { PromptService } from '../prompt-service'
import { from } from 'rxjs'
import { MessageService } from 'primeng/api'

@Component({
  selector: 'app-prompt-card',
  imports: [Button, Textarea, Tag, Card, RouterLink],
  templateUrl: './prompt-card.html',
  styleUrl: './prompt-card.scss',
})
export class PromptCard {
  prompt = input.required<Prompt>()

  //vote and unvote
  voting = signal(false)

  authService = inject(AuthService)

  promptService = inject(PromptService)

  // injection de la route pour naviguer
  router = inject(Router)

  //injection du message Service
  messageService = inject(MessageService)

  //LinkedSignal pour initialiser le signal avec la valeur du prompt passé en input et pouvoir le mettre à jour après un upvote ou downvote
  score = linkedSignal(() => this.prompt().score)

  // currentUser est un signal qui contient l'utilisateur connecté, on utilise linkedSignal pour que userVote soit mis à jour automatiquement quand currentUser change (ex: quand l'utilisateur se connecte ou se déconnecte)
  userVote = linkedSignal(() => (this.authService.currentUser() ? this.prompt().userVote : null))

  //ajout de l'attribut canEdit pour vérifier si l'utilisateur connecté est l'auteur du prompt
  canEdit = computed(() => {
    const currentUser = this.authService.currentUser()
    return currentUser && this.prompt().author.id === currentUser.id
  })

  //Sans le toast
  /* copyToClipboard() {
    void navigator.clipboard.writeText(this.prompt().content)
  } */

  // avec le toast de PrimeNG pour afficher un message de confirmation après la copie dans le presse-papier
  copyToClipboard() {
    from(navigator.clipboard.writeText(this.prompt().content)).subscribe(() => {
      // Affiche un message de succès
      this.messageService.add({
        severity: 'success',
        summary: 'Copié',
        detail: 'Le prompt a été copié dans le presse-papier',
      })
    })
  }

  upvote() {
    if (!this.authService.currentUser()) {
      void this.router.navigate(['/auth']) //void pour ignorer la promesse retournée par navigate
      return
    }
    this.voting.set(true)
    this.promptService.upvotePrompt(this.prompt().id).subscribe((updatePompt) => {
      this.score.set(updatePompt.score)
      this.userVote.set(updatePompt.userVote)
      this.voting.set(false)
    })
  }

  downvote() {
    if (!this.authService.currentUser()) {
      void this.router.navigate(['/auth']) //void pour ignorer la promesse retournée par navigate
      return
    }
    this.voting.set(true)
    this.promptService.downvotePrompt(this.prompt().id).subscribe((updatePompt) => {
      this.score.set(updatePompt.score)
      this.userVote.set(updatePompt.userVote)
      this.voting.set(false)
    })
  }
}
