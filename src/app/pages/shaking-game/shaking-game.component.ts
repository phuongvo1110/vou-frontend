import {
  animate,
  AnimationBuilder,
  AnimationFactory,
  style,
} from "@angular/animations";
import { AfterViewInit, Component, DestroyRef, OnDestroy, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { WebSocketService } from "../../websocket.service";

interface GameInfo {
  name: string;
  number_of_questions: number;
  duration: number;
  startTime: number;
}

enum GameStatus {
  WAITING, STARTED, PLAYING, ENDED
}

@Component({
  selector: "app-game",
  templateUrl: "./shaking-game.component.html",
  styleUrl: "./shaking-game.component.css",
})
export class ShakingGameComponent implements OnInit, AfterViewInit, OnDestroy {
  shakingContainer: HTMLElement;
  surprises: NodeListOf<HTMLButtonElement>;
  startGameBtn: HTMLButtonElement;
  playingScreen: HTMLElement;
  bonus: HTMLElement;

  backBtn: HTMLButtonElement;
  waitingScreen: HTMLElement;
  gameInfo: GameInfo = {
    name: "Shaking game",
    number_of_questions: 3,
    duration: 30,
    startTime: Math.floor(Date.now() / 1000)
    // startTime: 1725281957
  };
  itemList = ["The Coffee House 1", "Kitkat 2", "Highland 3"]
  shakingItem: string
  // playerId: string = prompt("Enter your player ID") || "1";
  playerId: string = "1";
  eventId: string = "2";
  gameId: string = "3";
  sessionId: string = "66d5611b50080825d7cda679";
  timeRemain: number = 1000;
  timeRemainFormat: string;
  difference: number = 0;
  baseScore: number = 10;
  connectionCount: number = 0;
  turns: number = 3;
  fadeInAnimation: AnimationFactory;
  fadeOutAnimation: AnimationFactory;
  gameStatus: GameStatus = GameStatus.WAITING;
  gameOverMessage: HTMLElement

  constructor(
    private webSocketService: WebSocketService,
    private animationBuilder: AnimationBuilder,
    private destroyRef: DestroyRef,
    private router: Router
  ) {
    this.fadeInAnimation = this.animationBuilder.build([
      style({ opacity: 0 }),
      animate("500ms ease-in", style({ opacity: 1 })),
    ]);
    this.fadeOutAnimation = this.animationBuilder.build([
      style({ opacity: 1 }),
      animate("500ms ease-out", style({ opacity: 0 })),
    ]);
  }

  ngAfterViewInit(): void {
    this.waitingScreen = document.getElementById(
      "waiting-screen"
    ) as HTMLElement;
    this.playingScreen = document.getElementById(
      "playing-screen"
    ) as HTMLElement;
  }

  ngOnInit(): void {
    this.webSocketService.setOnUpdateGameStatus((message: any) => {
      if (this.gameStatus == GameStatus.WAITING) {
        this.gameStatus = GameStatus.STARTED
        this.startGameBtn = document.getElementById(
          "start-game-btn"
        ) as HTMLButtonElement;
      }

      this.timeRemain = 1800 - (parseInt(message.body) - this.gameInfo.startTime);
      if (this.timeRemain <= 0) {
        this.webSocketService.endGame()
      }

      this.timeRemainFormat = this.formatSeconds(this.timeRemain)
    });

    this.webSocketService.setOnUpdateConnection((message: any) => {
      this.connectionCount = parseInt(message.body);
    });

    this.webSocketService.setOnStartGame((message: any) => {
      if (this.gameStatus == GameStatus.STARTED) {
        this.gameStatus = GameStatus.PLAYING
      }

      const messageBody = JSON.parse(message.body)
    })

    this.webSocketService.setOnEndGame((message: any) => {
      const messageBody = JSON.parse(message.body)
      this.webSocketService.destroyWebsocket()
    })

    this.webSocketService.connect(this.sessionId, this.playerId);
  }

  ngOnDestroy(): void {
    // Ngắt kết nối WebSocket khi component bị hủy
    this.webSocketService.disconnectGame();
    console.log("WebSocket connection closed.")
  };

  onClickStartBtn(): void {
    this.bonus = document.querySelector(".bonus") as HTMLElement;
    this.surprises = document.querySelectorAll(".surprises > *");
    this.gameOverMessage = document.querySelector(".game-over-message") as HTMLElement;

    this.playingScreen.classList.remove("hidden");
    this.waitingScreen.classList.add("hidden");
    this.startGameBtn.classList.add("hidden");

    // Set up websocket to start game
    this.webSocketService.startGame();
  }

  back() {
    this.webSocketService.disconnectGame();
    this.router.navigateByUrl('/events/event');
  }

  isStarted(): boolean {
    return this.gameStatus == GameStatus.STARTED
  }

  formatSeconds(seconds: number) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    const formattedTime = [
      hours.toString().padStart(2, '0'),
      minutes.toString().padStart(2, '0'),
      remainingSeconds.toString().padStart(2, '0')
    ].join(':');

    return formattedTime;
  }

  shakingBonus() {
    if (this.turns <= 0) return;
    this.turns--;

    this.shakingItem = this.itemList[Math.floor(Math.random() * this.itemList.length)]


    if (!this.gameOverMessage.classList.contains("hidden")) {
      this.gameOverMessage.classList.add("hidden")
    }

    this.bonus.classList.add("jumping", "disabled")
    this.surprises.forEach(element => {
      element.classList.add('fly', "block");
      element.classList.remove("hidden");
    });

    setTimeout(() => {
      this.bonus.classList.remove("jumping", "disabled")
      this.surprises.forEach(element => {
        element.classList.remove('fly', "block");
        element.classList.add("hidden");
      });
      const message = document.querySelector(".game-over-message") as HTMLElement

      message.classList.add("block")
      message.classList.remove("hidden")
    }, 5000);
  }
}
