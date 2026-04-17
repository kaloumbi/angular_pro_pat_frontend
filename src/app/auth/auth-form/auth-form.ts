import { Component, signal } from '@angular/core'
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { Card } from "primeng/card";
import { Button } from "primeng/button";
import { InputText } from "primeng/inputtext";
import { Password } from "primeng/password";

@Component({
  selector: 'app-auth-form',
  imports: [ReactiveFormsModule, Card, Button, InputText, Password],
  templateUrl: './auth-form.html',
  styleUrl: './auth-form.scss',
})
export class AuthForm {
  mode = signal<'login' | 'register'>('login')

  form = new FormGroup({
    username: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    password: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(4)],
    }),
  })

  toggleMode() {
    this.mode.update((value) => (value === 'login' ? 'register' : 'login'))
  }

  submit() {
    console.log("data", this.form.value);
    
    this.form.markAllAsTouched()
    if (this.form.invalid) return

    const { username, password } = this.form.getRawValue()

    if (this.mode() === 'login') {
      //console.log('Login with', this.form.getRawValue())
      this.login(username, password)
    } else {
      //console.log('Register with', this.form.getRawValue())
      this.register(username, password)
    }
  }

  login(username: string, password: string) {

  }

  register(username: string, password: string) {

  }
}
