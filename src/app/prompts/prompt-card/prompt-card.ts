import { Component, computed, inject, input } from '@angular/core'
import { Prompt } from '../prompt.model'
import { Button, ButtonModule } from 'primeng/button';
import { TextareaModule, Textarea } from 'primeng/textarea';
import { TagModule, Tag } from 'primeng/tag';
import { CardModule, Card } from 'primeng/card';
import { RouterLink } from "@angular/router";
import { AuthService } from '../../auth/auth-service';



@Component({
  selector: 'app-prompt-card',
  imports: [Button, Textarea, Tag, Card, RouterLink],
  templateUrl: './prompt-card.html',
  styleUrl: './prompt-card.scss',
})
export class PromptCard {
  prompt = input.required<Prompt>()

  authService = inject(AuthService)

  //ajout de l'attribut canEdit pour vérifier si l'utilisateur connecté est l'auteur du prompt
  canEdit = computed(() => {
    const currentUser = this.authService.currentUser()
    return currentUser && this.prompt().author.id === currentUser.id
  })

  copyToClipboard() {
    void navigator.clipboard.writeText(this.prompt().content)
  }
  
}

