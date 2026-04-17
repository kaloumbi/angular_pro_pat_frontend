import { Component, effect, inject, input } from '@angular/core'
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

@Component({
  selector: 'app-prompt-form',
  imports: [Card, Textarea, InputText, Select, ReactiveFormsModule, Button, RouterLink],
  templateUrl: './prompt-form.html',
  styleUrl: './prompt-form.scss',
})
export class PromptForm {
  router = inject(Router)

  promptService = inject(PromptService)

  categroyService = inject(CategoryService)

  promptId = input<number>()

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
        this.promptService.getPrompt(promptId).subscribe((prompt) => {
          this.form.patchValue({
            title: prompt.title,
            content: prompt.content,
            categoryId: prompt.category.id,
          })
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

    if (promptId) {
      //Mode modification
      this.promptService.updatePrompt(promptId, prompt).subscribe(() => {
        void this.router.navigate(['/prompts'])
      })
    } else {
      //Mode création
      this.promptService.createPrompt(prompt).subscribe(() => {
        void this.router.navigate(['/prompts'])
      })
    }
  }

  //delete prompt
  deletePrompt(){
    this.promptService.deletePrompt(this.promptId()!).subscribe(() => {
      void this.router.navigate(['/prompts'])
    })
  }
}
