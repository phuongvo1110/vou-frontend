import {
  animate,
  AnimationBuilder,
  AnimationFactory,
  style,
} from "@angular/animations";
import { AfterViewInit, Component, DestroyRef, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Utils } from "../../_helpers/utils";
import { Game } from "../../_models/game";
import { Item2 } from "../../_models/item2";
import { EventsService } from "../../_services/events.service";
import { GamesService } from "../../_services/games.service";
import { ItemService } from "../../_services/item.service";
import { SessionsService } from "../../_services/sessions.service";
import { WebSocketService } from "../../websocket.service";

enum GameStatus {
  WAITING, STARTED, PLAYING, ENDED
}

interface GameInfo {
  name: string;
  type: string;
  number_of_questions: number;
  duration: number;
  startTime: number;
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

  waitingScreen: HTMLElement;
  items: Item2[] = [];
  shakingItem: Item2 | undefined = undefined;
  timeRemain: number = 30;
  timeRemainFormat: string;
  difference: number = 0;
  baseScore: number = 10;
  connectionCount: number = 0;
  turns: number = 3;

  fadeInAnimation: AnimationFactory;
  fadeOutAnimation: AnimationFactory;
  gameStatus: GameStatus = GameStatus.WAITING;
  gameOverMessage: HTMLElement

  // playerId: string = prompt("Enter your player ID") || "1";
  playerId: string = "1";
  eventId: string | undefined
  gameId: string | undefined
  sessionId: string;
  date: string = (new Date()).toLocaleString("en-CA", { timeZone: "Asia/Ho_Chi_Minh" }).slice(0, 10);
  game: Game

  constructor(
    private webSocketService: WebSocketService,
    private animationBuilder: AnimationBuilder,
    private destroyRef: DestroyRef,
    private router: Router,
    private sessionsService: SessionsService,
    private route: ActivatedRoute,
    private eventsService: EventsService,
    private gamesService: GamesService,
    private itemService: ItemService
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
    this.startGameBtn = document.getElementById("start-game-btn") as HTMLButtonElement;
  }

  ngOnInit(): void {
    this.eventId = this.route.snapshot.paramMap.get("eventId")?.toString();
    this.gameId = this.route.snapshot.paramMap.get("gameId")?.toString();
    if (!this.eventId) {
      console.error("Event ID is not found");
      return;
    }

    if (!this.gameId) {
      console.error("Game ID is not found");
      return;
    }

    this.playerId = JSON.parse(localStorage.getItem("playerId") as string);
    if (!this.playerId) {
      console.error("Game ID is not found");
      return;
    }

    console.log("EventId & GameId & Date & PlayerId: ", this.eventId, this.gameId, this.date, this.playerId)

    this.itemService.getItemsByEventID(this.eventId).subscribe({
      next: (items) => {
        console.log("ITEMS OF EVENT: ", items)
        this.items = items
      }
    })

    this.eventsService.getGameByEventID(this.eventId).subscribe({
      next: (games) => {
        this.game = games.filter((game) => game.id == this.gameId)[0];
        console.log("GAME INFO: ", this.game)
        this.webSocketService.setOnUpdateGameStatus((message: any) => {
          if (this.gameStatus == GameStatus.WAITING) {
            this.gameStatus = GameStatus.STARTED
            this.startGameBtn = document.getElementById(
              "start-game-btn"
            ) as HTMLButtonElement;
          }

          this.timeRemain = 2 * 60 - (parseInt(message.body) - Math.floor(Utils.convertToUnixTime(this.date, this.game.startTime) / 1000));
          if (this.timeRemain <= 0) {
            this.gameStatus = GameStatus.ENDED
            this.webSocketService.endGame()
          }

          this.timeRemainFormat = Utils.formatSeconds(this.timeRemain)
        });

        this.webSocketService.setOnUpdateConnection((message: any) => {
          this.connectionCount = parseInt(message.body);
        });

        this.webSocketService.setOnStartGame((message: any) => {
          if (this.gameStatus == GameStatus.STARTED) {
            this.gameStatus = GameStatus.PLAYING
          }

          const messageBody = JSON.parse(message.body)
          console.log("START GAME: ", messageBody);
          this.updateTurns(messageBody.turns)
        })

        this.webSocketService.setOnEndGame((message: any) => {
          const messageBody = JSON.parse(message.body)
          this.webSocketService.destroyWebsocket()
        })
        this.sessionsService.findActiveSession(this.eventId!, this.gameId!, this.date).subscribe((response) => {
          console.log("GET ACTIVE SESSION ID: ", response);
          this.sessionId = response.sessionId;
          this.webSocketService.connect(this.sessionId, this.playerId, this.game.type, this.game.id);
        });
      }
    })
  }

  ngOnDestroy(): void {
    // Ngắt kết nối WebSocket khi component bị hủy
    this.webSocketService.disconnectGame();
    console.log("WebSocket connection closed.")
  };

  onClickStartBtn(): void {
    // Minus player's turns by 1
    const playerTurns = JSON.parse(localStorage.getItem("turns") as string);
    localStorage.setItem("turns", JSON.stringify(playerTurns - 1));

    this.bonus = document.querySelector(".bonus") as HTMLElement;
    this.surprises = document.querySelectorAll(".surprises > *");
    this.gameOverMessage = document.querySelector(".game-over-message") as HTMLElement;

    this.playingScreen.classList.remove("hidden");
    this.waitingScreen.classList.add("hidden");
    this.startGameBtn.classList.add("hidden");

    // Set up websocket to start game
    this.webSocketService.startGame();
  }

  shakingBonus() {
    if (this.turns <= 0 || this.gameStatus == GameStatus.ENDED) return;
    this.turns--;
    this.webSocketService.updateGameScore(this.turns);

    if (Math.random() > 0.3) {
      this.shakingItem = this.items[Math.floor(Math.random() * this.items.length)];
      this.webSocketService.receiveItem(this.shakingItem.id)
    } else {
      this.shakingItem = undefined
    }

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

  updateTurns(newTurns: number) {
    this.turns = newTurns;
  }
}
