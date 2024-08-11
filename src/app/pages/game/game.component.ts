import {
  animate,
  AnimationBuilder,
  AnimationFactory,
  style,
} from "@angular/animations";
import {AfterViewInit, Component, OnInit} from "@angular/core";
import {WebSocketService} from "../../websocket.service";
import {VideoService} from "../../video.service";
import {NgFor} from "@angular/common";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";

interface QuizItem {
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
  correct_answer_index: number;
  audio_url: string;
}

interface GameInfo {
  name: string;
  number_of_questions: number;
  duration: number;
  startTime: number;
}

@Component({
  selector: "app-game",
  templateUrl: "./game.component.html",
  styleUrl: "./game.component.css",
})
export class GameComponent implements OnInit, AfterViewInit {
  triviaContainer = document.querySelector("#trivia-container") as HTMLElement;
  startGameBtn: HTMLButtonElement;
  playingScreen: HTMLElement;
  backBtn = document.getElementById("back-btn") as HTMLButtonElement;
  audio: HTMLAudioElement;
  waitingScreen: HTMLElement;
  waitingAudio: HTMLAudioElement;
  score: number = 0;
  quizIndex: number = 0;
  quizzes: QuizItem[] = [];
  gameInfo: GameInfo = {
    name: "HQ Trivia",
    number_of_questions: 3,
    duration: 30,
    startTime: Math.floor(Date.now() / 1000),
  };
  playerId: string = "1";
  eventId: string = "2";
  gameId: string = "3";
  sessionId: string = "669fedc17ada690bd952c608";
  timeRemain: number = 0;
  difference: number = 0;
  leaderboard: any;
  baseScore: number = 10;
  selectedAnswerTarget: any;
  connectionCount: number = 0;
  currentQuestion: string = "";
  currentAnswers: string[] = [];
  fadeInAnimation: AnimationFactory;
  fadeOutAnimation: AnimationFactory;
  questionNumber: number = 1;

  constructor(
    private webSocketService: WebSocketService,
    private videoService: VideoService,
    private animationBuilder: AnimationBuilder
  ) {
    this.fadeInAnimation = this.animationBuilder.build([
      style({opacity: 0}),
      animate("500ms ease-in", style({opacity: 1})),
    ]);
    this.fadeOutAnimation = this.animationBuilder.build([
      style({opacity: 1}),
      animate("500ms ease-out", style({opacity: 0})),
    ]);
  }

  ngAfterViewInit(): void {
    this.waitingScreen = document.getElementById(
      "waiting-screen"
    ) as HTMLElement;
    this.startGameBtn = document.getElementById(
      "start-game-btn"
    ) as HTMLButtonElement;
    this.playingScreen = document.getElementById(
      "playing-screen"
    ) as HTMLElement;
    this.audio = document.getElementById("audio") as HTMLAudioElement;
    this.videoService.setVideo(document.querySelector('.video') as HTMLVideoElement)
    this.videoService.setHiddenVideo(document.querySelector('.hidden-video') as HTMLVideoElement)
  }

  ngOnInit(): void {
    console.log("Audio ", this.audio)

    this.webSocketService.connect(this.sessionId, this.playerId);
    this.webSocketService.setOnUpdateGameStatus((message: any) => {
      this.difference = parseInt(message.body) - this.gameInfo.startTime;
      this.timeRemain =
        this.gameInfo.duration -
        (this.difference % (this.gameInfo.duration + 1));
      this.quizIndex = Math.floor(
        this.difference / (this.gameInfo.duration + 1)
      );
      if (this.quizIndex >= this.gameInfo.number_of_questions) {
        this.endGame();
      } else {
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
      const messageBody = JSON.parse(message.body)
      this.quizzes = messageBody.quizResponse.results;
      console.log("Quizzes: ", this.quizzes);
      this.updateScore(messageBody.totalScore);
      this.updateQuestionNumber();
      this.displayQuiz();
      this.videoService.displayStatic();
      if (this.timeRemain < this.gameInfo.duration) this.readQuestion();
      if (this.timeRemain < 5) this.readAnswer();
    })

    // this.webSocketService.onUpdateLeaderboard((message: any) => {
    //   console.log(message);
    // });
  }

  onClickStartBtn(): void {
    this.waitingAudio = document.getElementById("waiting-audio") as HTMLAudioElement;
    console.log('audio', this.waitingAudio);
    this.playingScreen.classList.remove("hidden");
    this.waitingScreen.classList.add("hidden");
    this.startGameBtn.classList.add("hidden");

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
            {transform: "scale(1)"},
            {transform: "scale(1.2) rotate(5deg)"},
            {transform: "scale(1)"},
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
    const triviaContainer = document.querySelector("#trivia-container");
    while (triviaContainer?.firstChild) {
      triviaContainer.removeChild(triviaContainer.firstChild);
    }
  }

  endGame(): void {
    const triviaDiv = document.querySelector(".trivia-item");
    if (triviaDiv) {
      const animation = this.fadeOutAnimation.create(triviaDiv);
      animation.onDone(() => {
        this.clearQuiz();
        const html = `<p class="game-over-message">Game over. Your final score is ${this.score}.</p>`;
        this.triviaContainer?.insertAdjacentHTML("beforeend", html);
        const gameOverMessage =
          this.triviaContainer?.querySelector(".game-over-message");
        if (gameOverMessage)
          this.fadeInAnimation.create(gameOverMessage).play();
      });
      animation.play();
    }
  }

  calculateScore(): number {
    return this.timeRemain * (this.baseScore + this.quizIndex);
  }

  readQuestion(): void {
    this.audio.src = this.quizzes[this.quizIndex].audio_url;
    if (this.gameInfo.duration - this.timeRemain >= this.audio.duration) return;
    this.audio.currentTime = this.gameInfo.duration - this.timeRemain;
    this.audio.play();
    this.videoService.startSpeaking();
  }

  readAnswer(): void {
    this.audio.src = `https://voubucket.s3.amazonaws.com/answers/${this.incrementChar(
      "A",
      this.quizzes[this.quizIndex].correct_answer_index
    )}.mp3`;
    if (5 - this.timeRemain < 0) return;
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
}
