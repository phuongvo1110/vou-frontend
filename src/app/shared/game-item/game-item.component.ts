import { Component, Input, OnInit } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { Utils } from '../../_helpers/utils';

@Component({
  selector: 'app-game-item',
  templateUrl: './game-item.component.html',
  styleUrl: './game-item.component.css'
})
export class GameItemComponent implements OnInit {
  @Input() title?: string;
  @Input({ required: true }) image!: string;
  @Input({ required: true }) startTime: string;

  subscription: Subscription | null = null;
  timeRemainFormat: string = "--:--:--"

  ngOnInit(): void {
    this.startCountdown()
  }

  startCountdown(): void {
    const source = interval(1000);
    this.subscription = source.subscribe(() => {
      const difference = Utils.timeToSeconds(this.startTime) - Utils.getCurrentTimeInSeconds()
      if (difference > 0) {
        this.timeRemainFormat = Utils.formatSeconds(difference);
      } else {
        if (this.subscription) {
          this.timeRemainFormat = "00:00:00";
          this.subscription.unsubscribe(); // Dừng đếm ngược khi thời gian đạt 0
        }
      }
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe(); // Hủy đăng ký khi component bị hủy
    }
  }
}
