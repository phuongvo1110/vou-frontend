import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-game-item',
  templateUrl: './game-item.component.html',
  styleUrl: './game-item.component.css'
})
export class GameItemComponent {
  @Input({required: true}) title!: string;
  @Input({required: true}) image!: string;
}
