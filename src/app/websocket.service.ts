// websocket.service.ts

import {Injectable} from '@angular/core';
import SockJS from 'sockjs-client';
import * as Stomp from '@stomp/stompjs';

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  private stompClient: any
  private socket: any
  private playerId?: string
  private sessionId?: string
  private onUpdateGameStatus: (message: any) => void
  private onUpdateConnection: (message: any) => void
  private onStartGame: (message: any) => void

  setOnUpdateGameStatus(callback: (message: any) => void) {
    this.onUpdateGameStatus = callback  
  }

  setOnUpdateConnection(callback: (message: any) => void) {
    this.onUpdateConnection = callback
  }

  setOnStartGame(callback: (message: any) => void) {
    this.onStartGame = callback
  }

  connect(sessionId: string, playerId: string): void {
    // this.stompClient = Stomp.over(new SockJS('http://localhost:8081/ws'));
    this.sessionId = sessionId
    this.playerId = playerId
    // console.log("Connecting", this.stompClient)
    // this.stompClient.connect({}, this.onConnectSuccess.bind(this), this.onError);

    this.stompClient = new Stomp.Client({
      brokerURL: 'ws://localhost:8081/ws',
      webSocketFactory: () => new SockJS('http://localhost:8081/ws'),
      connectHeaders: {},
      debug: (msg: string) => console.log(new Date(), msg),
      onConnect: (frame) => this.onConnectSuccess(),
      onDisconnect: (frame) => console.log('Disconnected', frame),
      onStompError: (frame) => console.log('Error', frame),
    });

    this.stompClient.activate()
  }

  private onConnectSuccess(): void {
    console.log("Connected")
    this.stompClient.subscribe(`/topic/time/${this.sessionId}`, this.onUpdateGameStatus);
    this.stompClient.subscribe(`/topic/connection/${this.sessionId}`, this.onUpdateConnection);
    this.updateConnection()

    this.stompClient.subscribe(`/topic/start/${this.playerId}`, this.onStartGame);
  }

  private onError(message: any): void {
    console.log('Error connecting to websocket', message);
  }

  updateConnection(): void {
    // Get number of connection
    this.stompClient.publish({
        destination: '/app/game',
        body: JSON.stringify({
          type: 'CONNECTION',
          payload: JSON.stringify({
            playerId: this.playerId,
            sessionId: this.sessionId,
          }),
        })
      }
    );
  }

  startGame(): void {
    this.stompClient.publish({
      destination: '/app/game',
      body: JSON.stringify({
        type: 'START',
        payload: JSON.stringify({
          playerId: this.playerId,
          sessionId: this.sessionId,
        }),
      }),
    });
  }

  updateGameScore(score: number): void {
    this.stompClient.publish({
      destination: '/app/game',
      body: JSON.stringify({
        type: 'UPDATE',
        payload: JSON.stringify({
          playerId: this.playerId,
          sessionId: this.sessionId,
          score: score,
        }),
      }),
    });
  }

  // onUpdateLeaderboard(callback: (message: any) => void): void {
  //   this.stompClient.subscribe(`/topic/leaderboard/${this.sessionId}`, (message: any) => {
  //     callback(message.body);
  //   });
  // }
}
