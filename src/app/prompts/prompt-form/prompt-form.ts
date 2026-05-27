import { Component, effect, inject, input, signal } from '@angular/core'
import { Card } from 'primeng/card'
import { Textarea } from 'primeng/textarea'
import { InputTextModule, InputText } from 'primeng/inputtext'
import { SelectModule, Select } from 'primeng/select'
import { CategoryService } from '../category-service'
import { toSignal } from '@angular/core/rxjs-interop'
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { Button } from 'primeng/button'
import { PromptService } from '../prompt-service'
import { Router, RouterLink } from '@angular/router'
import { MessageService } from 'primeng/api'
import { ProgressSpinner } from "primeng/progressspinner";

@Component({
  selector: 'app-prompt-form',
  imports: [Card, Textarea, InputText, Select, ReactiveFormsModule, Button, RouterLink, ProgressSpinner],
  templateUrl: './prompt-form.html',
  styleUrl: './prompt-form.scss',
})
export class PromptForm {
  router = inject(Router)

  promptService = inject(PromptService)

  categroyService = inject(CategoryService)

  //loader 
  loading = signal(false)

  //spinner for form submission
  submitting = signal(false)

   //spinner for form submission
  deleting = signal(false)

  promptId = input<number>()


  // Injection du message Service
  messageService = inject(MessageService)

  categories = toSignal(this.categroyService.getCategories(), { initialValue: [] })

  form = new FormGroup({
    title: new FormControl('', {
      validators: [Validators.required, Validators.maxLength(30)],
      nonNullable: true,
    }),
    content: new FormControl('', { validators: [Validators.required], nonNullable: true }),
    categoryId: new FormControl(-1, {
      validators: [Validators.required, Validators.min(0)],
      nonNullable: true,
    }),
  })

  //Preremplissage du formulaire en cas de modification
  constructor() {
    effect(() => {
      console.log('effect', this.promptId())
      const promptId = this.promptId()
      //si promptId est setté, on fetch le prompt et on préremplit le formulaire
      if (promptId) {
        this.loading.set(true)
        this.promptService.getPrompt(promptId).subscribe((prompt) => {
          this.form.patchValue({
            title: prompt.title,
            content: prompt.content,
            categoryId: prompt.category.id,
          })
          this.loading.set(false)
        })
      }
    })
  }

  submit() {
    console.log(this.form.value)
    this.form.markAllAsTouched()
    if (this.form.invalid) return

    const prompt = this.form.getRawValue()
    const promptId = this.promptId()

    this.submitting.set(true)
    if (promptId) {
      //Mode modification
      this.promptService.updatePrompt(promptId, prompt).subscribe(() => {
        // Affiche un message de succès
        this.messageService.add({
          severity: 'success',
          summary: 'Modifié',
          detail: 'Le prompt a été modifié avec succès',
        })
        void this.router.navigate(['/prompts'])
        this.submitting.set(false)
      })
    } else {
      //Mode création
      this.promptService.createPrompt(prompt).subscribe(() => {
        // Affiche un message de succès
        this.messageService.add({
          severity: 'success',
          summary: 'Créé',
          detail: 'Le prompt a été créé avec succès',
        })
        void this.router.navigate(['/prompts'])
        this.submitting.set(false)
      })
    }
  }

  //delete prompt sans toast
  /* deletePrompt() {
    this.promptService.deletePrompt(this.promptId()!).subscribe(() => {
      void this.router.navigate(['/prompts'])
    })
  } */

  //delete prompt avec toast de confirmation
  deletePrompt() {
    this.deleting.set(true)
    this.promptService.deletePrompt(this.promptId()!).subscribe(() => {
      // Affiche un message de succès
      this.messageService.add({
        severity: 'success',
        summary: 'Supprimé',
        detail: 'Le prompt a été supprimé avec succès',
      })
      void this.router.navigate(['/prompts'])
      this.deleting.set(false)
    })
  }
}
