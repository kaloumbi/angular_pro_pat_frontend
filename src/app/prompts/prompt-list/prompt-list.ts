import { Component, inject } from '@angular/core'
import { Prompt } from '../prompt.model'
import { PromptCard } from "../prompt-card/prompt-card";
import { PromptService } from '../prompt-service';
import { toSignal } from '@angular/core/rxjs-interop';



@Component({
  selector: 'app-prompt-list',
  imports: [PromptCard],
  templateUrl: './prompt-list.html',
  styleUrl: './prompt-list.scss',
})
export class PromptList {

  //Injection du service
  promptService = inject(PromptService)

  //Abonnement automatique à l'observable retourné par getPrompts() et conversion en signal avec une valeur initiale de tableau vide
  prompts = toSignal(this.promptService.getPrompts(), {initialValue: []})

}
