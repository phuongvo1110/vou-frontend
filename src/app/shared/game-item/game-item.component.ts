import { Component, Input, OnInit } from "@angular/core";
import { interval, Subscription } from "rxjs";
import { Utils } from "../../_helpers/utils";
import { Game } from "../../_models/game";
import { ShareService } from "../../_services/share.service";
import { AccountService } from "../../_services/account.service";
import { ImageService } from "../../image.service";

@Component({
  selector: "app-game-item",
  templateUrl: "./game-item.component.html",
  styleUrl: "./game-item.component.css",
})
export class GameItemComponent implements OnInit {
  @Input() game: Game;
  constructor(
    private shareService: ShareService,
    private accountService: AccountService,
    private imageService: ImageService
  ) {}
  subscription: Subscription | null = null;
  timeRemainFormat: string = "--:--:--";
  isStarted: boolean = false;
  today: Date;
  tomorrow: Date;

  ngOnInit(): void {
    this.startCountdown();
    this.today = new Date();
    this.tomorrow = new Date();
    this.tomorrow.setDate(this.today.getDate() + 1);
    console.log("TODAY: ", this.today);
    console.log("TOMORROW: ", this.tomorrow);
    console.log("START TIME: ", this.game.startTime);
    this.today.setTime(
      Utils.convertToUnixTime(
        this.today.toISOString().slice(0, 10),
        this.game.startTime
      )
    );
    this.tomorrow.setTime(
      Utils.convertToUnixTime(
        this.tomorrow.toISOString().slice(0, 10),
        this.game.startTime
      )
    );
    console.log("GAME TYPE: ", this.game.type);
  }

  startCountdown(): void {
    const source = interval(1000);
    this.subscription = source.subscribe(() => {
      // const difference = Utils.timeToSeconds(this.startTime) - Utils.getCurrentTimeInSeconds()
      const difference = Math.floor(
        (this.today.getTime() - new Date().getTime()) / 1000
      );
      console.log("DIFFERENCE: ", difference);
      if (difference > 0) {
        this.timeRemainFormat = Utils.formatSeconds(difference);
      } else if (difference > -2 * 60) {
        if (this.subscription) {
          this.isStarted = true;
          this.timeRemainFormat = "NOW !!!";
        }
      } else {
        this.timeRemainFormat = Utils.formatSeconds(
          Math.floor((this.tomorrow.getTime() - new Date().getTime()) / 1000)
        );
        this.isStarted = false;
      }
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
  
}
