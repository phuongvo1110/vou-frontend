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
import { GamesService } from '../../_services/games.service';
import { SessionsService } from "../../_services/sessions.service";
import { VideoService } from "../../video.service";
import { WebSocketService } from "../../websocket.service";
import { ItemService } from './../../_services/item.service';

interface QuizItem {
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
  correct_answer_index: number;
  audio_url: string;
}

interface GameInfo {
  name: string;
  type: string;
  number_of_questions: number;
  duration: number;
  startTime: number;
}

enum GameStatus {
  STARTED, PLAYING, ENDED
}

@Component({
  selector: "app-game",
  templateUrl: "./game.component.html",
  styleUrl: "./game.component.css",
})
export class GameComponent implements OnInit, AfterViewInit, OnDestroy {
  triviaContainer: HTMLElement;
  startGameBtn: HTMLButtonElement;
  playingScreen: HTMLElement;
  audio: HTMLAudioElement;
  waitingScreen: HTMLElement;
  waitingAudio: HTMLAudioElement;
  score: number = 0;
  quizIndex: number = 0;
  quizzes: QuizItem[] = [];
  gameInfo: GameInfo = {
    name: "HQ Trivia",
    type: "quiz",
    number_of_questions: 4,
    duration: 30,
    startTime: Math.floor(Date.now() / 1000),
    // startTime: 1725281957
  };
  game: Game
  timeRemain: number = 30;
  difference: number = 0;
  leaderboard: any = [];
  baseScore: number = 10;
  selectedAnswerTarget: any;
  connectionCount: number = 0;
  currentQuestion: string = "";
  currentAnswers: string[] = [];
  fadeInAnimation: AnimationFactory;
  fadeOutAnimation: AnimationFactory;
  questionNumber: number = 1;
  gameStatus: GameStatus = GameStatus.STARTED;
  items: Item2[] = [];
  playerId: string | null
  eventId: string | undefined
  gameId: string | undefined
  sessionId: string;
  date: string = (new Date()).toLocaleString("en-CA", { timeZone: "Asia/Ho_Chi_Minh" }).slice(0, 10);
  receivedItem: Item2
  rank: number = -1

  constructor(
    private webSocketService: WebSocketService,
    private videoService: VideoService,
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
    this.videoService.setVideo(document.querySelector('.video') as HTMLVideoElement)
    this.videoService.setHiddenVideo(document.querySelector('.hidden-video') as HTMLVideoElement)
    this.audio = document.getElementById("audio") as HTMLAudioElement;
    this.audio.src = "";
    this.audio.addEventListener("ended", () => {
      console.log("Stop video")
      this.videoService.stopSpeaking()
    })
    this.startGameBtn = document.getElementById("start-game-btn") as HTMLButtonElement;
  }

  ngOnInit(): void {
    this.eventId = this.route.snapshot.paramMap.get("eventId")?.toString();
    this.gameId = this.route.snapshot.paramMap.get("gameId")?.toString();
    if (!this.eventId) {
      console.error("Event ID is not found");
      return;
    }

    this.playerId = JSON.parse(localStorage.getItem("playerId") as string);
    if (!this.playerId) {
      console.error("Player ID is not found");
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
          if (this.gameStatus == GameStatus.ENDED) return;

          this.difference = parseInt(message.body) - Math.floor(Utils.convertToUnixTime(this.date, this.game.startTime) / 1000);
          console.log("Difference: ", this.difference)
          console.log("Start time: ", Utils.convertToUnixTime(this.date, this.game.startTime))
          this.timeRemain =
            this.gameInfo.duration -
            (this.difference % (this.gameInfo.duration + 1));
          this.quizIndex = Math.floor(
            this.difference / (this.gameInfo.duration + 1)
          );

          console.log("=======================================")
          console.log("Quiz index: ", this.quizIndex)
          console.log("Time remain: ", this.timeRemain)
          console.log("=======================================")

          if (this.quizIndex >= this.gameInfo.number_of_questions) {
            if (this.quizIndex == this.gameInfo.number_of_questions) {
              this.receivedItem = this.items[Math.floor(Math.random() * this.items.length)]
              this.rank = this.leaderboard.findIndex((player: any) => {
                console.log("Compare ID: ", player.userId, this.playerId)
                return player.userId == this.playerId
              }) + 1
              if (this.rank <= 2) {
                this.webSocketService.receiveItem(this.receivedItem.id)
              }
              this.endGame(false);
            } else {
              this.endGame(true);
            }
          } else if (this.gameStatus == GameStatus.PLAYING) {
            if (this.timeRemain === this.gameInfo.duration) {
              this.displayQuiz();
              this.updateQuestionNumber();
              this.readQuestion();
            } else if (this.timeRemain === 5) {
              this.readAnswer();
            }
          }
        });

        this.webSocketService.setOnUpdateConnection((message: any) => {
          this.connectionCount = parseInt(message.body);
        });

        this.webSocketService.setOnStartGame((message: any) => {
          if (this.gameStatus == GameStatus.STARTED) {
            this.gameStatus = GameStatus.PLAYING
          }

          const messageBody = JSON.parse(message.body)
          this.quizzes = messageBody.quizResponse.results;
          console.log("Quizzes: ", this.quizzes);
          this.updateScore(messageBody.totalScore);
          this.updateQuestionNumber();
          this.displayQuiz();
          this.videoService.displayStatic();
          if (this.timeRemain <= this.gameInfo.duration) this.readQuestion();
          if (this.timeRemain < 5) this.readAnswer();
        })

        this.webSocketService.setOnEndGame((message: any) => {
          const messageBody = JSON.parse(message.body)
          console.log("LEADERBOARD: ", messageBody);
          this.leaderboard = messageBody;
          setTimeout(() => {
            this.webSocketService.destroyWebsocket()
            this.destroyAudio();
          }, 5000);
        })

        this.sessionsService.findActiveSession(this.eventId!, this.gameId!, this.date).subscribe((response: any) => {
          console.log("GET ACTIVE SESSION ID: ", response);
          this.sessionId = response.sessionId;
          this.webSocketService.connect(this.sessionId, this.playerId!, this.gameInfo.type, this.game.id);
        })
      }
    })
  }

  onClickStartBtn(): void {
    const playerTurns = JSON.parse(localStorage.getItem("turns") as string);
    localStorage.setItem("turns", JSON.stringify(playerTurns - 1));

    this.triviaContainer = document.querySelector("#trivia-container") as HTMLElement;
    this.waitingAudio = document.getElementById("waiting-audio") as HTMLAudioElement;
    console.log('audio', this.waitingAudio);
    this.playingScreen.classList.remove("hidden");
    this.waitingScreen.classList.add("hidden");
    this.startGameBtn.classList.add("hidden");

    if (this.quizIndex >= this.gameInfo.number_of_questions) {
      this.endGame(true);
      return;
    }

    // Set up websocket to start game
    this.webSocketService.startGame();
  }

  displayQuiz(): void {
    const triviaItem = this.quizzes[this.quizIndex];
    if (!triviaItem) return;

    const {
      question,
      correct_answer: correctAnswer,
      incorrect_answers: incorrectAnswers,
      correct_answer_index: correctAnswerIndex,
    } = triviaItem;

    const allAnswers = [correctAnswer, ...incorrectAnswers];
    allAnswers[0] = allAnswers[correctAnswerIndex];
    allAnswers[correctAnswerIndex] = correctAnswer;

    this.currentQuestion = question;
    this.currentAnswers = allAnswers;

    const triviaAnswers = document.querySelectorAll(
      ".trivia-item__button"
    ) as NodeListOf<HTMLButtonElement>;
    triviaAnswers.forEach((answer, index) => {
      answer.innerHTML = allAnswers[index];
      this.resetStateOfAnswer(answer)
    });

    const triviaDiv = document.querySelector(".trivia-item");
    if (triviaDiv) {
      this.fadeInAnimation.create(triviaDiv).play();
    }
  }

  resetStateOfAnswer(answer: HTMLButtonElement): void {
    this.selectedAnswerTarget = undefined;
    answer.disabled = false;
    answer.classList.remove("trivia-item__button--pending");
    answer.classList.remove("trivia-item__button--disabled");
    answer.classList.remove("trivia-item__button--correct");
    answer.classList.remove("trivia-item__button--incorrect");
  }

  onAnswerClicked(index: number): void {
    this.selectedAnswerTarget = document.querySelectorAll(
      ".trivia-item__button"
    )[index];
    document
      .querySelectorAll<HTMLButtonElement>(".trivia-item__button")
      .forEach((answer) => {
        answer.classList.add("trivia-item__button--disabled");
        answer.disabled = true;
      });

    this.selectedAnswerTarget.classList.add("trivia-item__button--pending");
  }

  showCorrectAnswer(): void {
    const quiz = this.quizzes[this.quizIndex];
    const correctAnswer = quiz.correct_answer;
    let isChosen = true;

    if (this.selectedAnswerTarget === undefined) {
      isChosen = false;
      document
        .querySelectorAll<HTMLButtonElement>(".trivia-item__button")
        .forEach((answer) => {
          if (answer.innerText.trim() === correctAnswer.trim()) {
            this.selectedAnswerTarget = answer;
          }
        });
    }

    const selectedAnswer = this.selectedAnswerTarget.innerText;
    if (selectedAnswer.trim() === correctAnswer.trim()) {
      console.log("Correct!");
      this.selectedAnswerTarget.classList.add("trivia-item__button--correct");
      if (isChosen) {
        this.updateScore(this.score + this.calculateScore());
        // Update score to server
        this.webSocketService.updateGameScore(this.score);
      }
    } else {
      console.log("Incorrect!");
      this.selectedAnswerTarget.classList.add("trivia-item__button--incorrect");
      document
        .querySelectorAll(".trivia-item__button")
      [quiz.correct_answer_index].classList.add(
        "trivia-item__button--correct"
      );
    }
  }

  updateScore(newScore: number): void {
    const shouldAnimate = this.score !== newScore;
    this.score = newScore;
    const scoreElement = document.querySelector("#score");
    if (scoreElement) scoreElement.textContent = this.score.toString();

    if (shouldAnimate) {
      const scoreContainerElement = scoreElement?.parentElement;
      if (scoreContainerElement) {
        scoreContainerElement.animate(
          [
            { transform: "scale(1)" },
            { transform: "scale(1.2) rotate(5deg)" },
            { transform: "scale(1)" },
          ],
          {
            duration: 500,
            iterations: 2,
            easing: "ease-in-out",
          }
        );
      }
    }
  }

  updateQuestionNumber(): void {
    this.questionNumber = this.quizIndex + 1;
  }

  clearQuiz(): void {
    while (this.triviaContainer?.firstChild) {
      this.triviaContainer.removeChild(this.triviaContainer.firstChild);
    }
  }

  endGame(isEndedBefore: boolean): void {
    this.gameStatus = GameStatus.ENDED
    console.log("SHOW LEADERBOARD")
    const stats = document.querySelector(".stats");
    const triviaDiv = document.querySelector(".trivia-item");
    if (stats) {
      this.fadeOutAnimation.create(stats).play();
    }

    if (triviaDiv) {
      const animation = this.fadeOutAnimation.create(triviaDiv);
      animation.onDone(() => {
        this.clearQuiz();

        let html = isEndedBefore ? `<p class="game-over-message text-center font-bold text-lg">This game is ended. Please comeback tomorrow</p>` : `<p class="game-over-message text-center font-bold text-lg">Game over. Your final score is ${this.score}.</br>
        You are in rank ${this.rank} out of ${this.leaderboard.length} players.</br>`;

        if (this.rank <= 2) {
          html += `Congratulation ! You've achieved the item <span class="text-red-500">${this.receivedItem.name}</span></p>`
        } else {
          html += `Oops !! You've achieved nothing. Better luck at next time !</p>`
        }

        this.triviaContainer?.insertAdjacentHTML("beforeend", html);
        const gameOverMessage =
          this.triviaContainer?.querySelector(".game-over-message");
        if (gameOverMessage)
          this.fadeInAnimation.create(gameOverMessage).play();
        console.log("Animation done")
      });
      animation.play();
    }
  }

  calculateScore(): number {
    let score = this.timeRemain * (this.baseScore + this.quizIndex);
    console.log("Score: ", score);
    return score
  }

  readQuestion(): void {
    console.log("READING QUESTION")
    if (this.gameInfo.duration - this.timeRemain >= this.audio.duration) {
      this.audio.currentTime = 0;
      console.log('QUESTION END')
      return;
    }

    this.audio.src = this.quizzes[this.quizIndex].audio_url;
    this.audio.currentTime = this.gameInfo.duration - this.timeRemain;
    this.audio.play();
    console.log("QUESTION CONTINUE")
    this.videoService.startSpeaking();
  }

  readAnswer(): void {
    console.log("READING ANSWER")
    if (5 < this.timeRemain) {
      this.audio.currentTime = 0;
      return;
    }

    this.audio.src = `https://voubucket.s3.amazonaws.com/answers/${this.incrementChar(
      "A",
      this.quizzes[this.quizIndex].correct_answer_index
    )}.mp3`;
    this.audio.currentTime = 5 - this.timeRemain;
    this.audio.play();
    this.videoService.startSpeaking();
    setTimeout(() => this.showCorrectAnswer(), 3000);
  }

  incrementChar(char: string, num: number): string {
    let charCode = char.charCodeAt(0);
    let newCharCode = charCode + num;
    return String.fromCharCode(newCharCode);
  }

  ngOnDestroy(): void {
    this.webSocketService.disconnectGame();
    console.log("WebSocket connection closed.");
    this.destroyAudio();
  };


  destroyAudio(): void {
    if (this.audio) {
      this.audio.pause();
      this.audio.src = "";
    }

    if (this.waitingAudio) {
      this.waitingAudio.pause();
      this.waitingAudio.src = "";
    }
  }
}
