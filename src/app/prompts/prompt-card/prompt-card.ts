import { Component, input } from '@angular/core'
import { Prompt } from '../prompt.model'
import { Button, ButtonModule } from 'primeng/button';
import { TextareaModule, Textarea } from 'primeng/textarea';
import { TagModule, Tag } from 'primeng/tag';
import { CardModule, Card } from 'primeng/card';
import { RouterLink } from "@angular/router";



@Component({
  selector: 'app-prompt-card',
  imports: [Button, Textarea, Tag, Card, RouterLink],
  templateUrl: './prompt-card.html',
  styleUrl: './prompt-card.scss',
})
export class PromptCard {
  prompt = input.required<Prompt>()

  copyToClipboard() {
    void navigator.clipboard.writeText(this.prompt().content)
  }
  
}

