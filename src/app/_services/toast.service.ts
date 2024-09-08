import { Injectable } from '@angular/core';
import { ToastComponent } from '../shared/toast/toast.component';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private toastComponent: ToastComponent;

  registerToastComponent(toastComponent: ToastComponent) {
    this.toastComponent = toastComponent;
  }

  show(message: string, icon: string) {
    if (this.toastComponent) {
      this.toastComponent.openToast(message, icon);
    }
  }
}
