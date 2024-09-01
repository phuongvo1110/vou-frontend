import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-game-item',
  templateUrl: './game-item.component.html',
  styleUrl: './game-item.component.css'
})
export class GameItemComponent {
  @Input() title?: string;
  @Input({required: true}) image!: string;
}
