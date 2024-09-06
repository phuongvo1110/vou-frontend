// websocket.service.ts

import { Injectable } from '@angular/core';
import * as Stomp from '@stomp/stompjs';
import SockJS from 'sockjs-client';

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  private stompClient: any
  private socket: any
  private playerId?: string
  private sessionId?: string
  private gameType?: string
  private gameId?: string
  private onUpdateGameStatus: (message: any) => void
  private onUpdateConnection: (message: any) => void
  private onStartGame: (message: any) => void
  private onEndGame: (message: any) => void

  private timeSubscription: any
  private connectionSubscription: any
  private startSubscription: any
  private endSubscription: any

  setOnUpdateGameStatus(callback: (message: any) => void) {
    this.onUpdateGameStatus = callback
  }

  setOnUpdateConnection(callback: (message: any) => void) {
    this.onUpdateConnection = callback
  }

  setOnStartGame(callback: (message: any) => void) {
    this.onStartGame = callback
  }

  setOnEndGame(callback: (message: any) => void) {
    this.onEndGame = callback
  }

  connect(sessionId: string, playerId: string, gameType: string, gameId: string): void {
    this.sessionId = sessionId
    this.playerId = playerId
    this.gameType = gameType
    this.gameId = gameId

    this.stompClient = new Stomp.Client({
      brokerURL: 'ws://localhost:8084/sessions/ws',
      webSocketFactory: () => new SockJS('http://localhost:8084/sessions/ws'),
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
    this.timeSubscription = this.stompClient.subscribe(`/topic/time/${this.sessionId}`, this.onUpdateGameStatus);

    this.connectionSubscription = this.stompClient.subscribe(`/topic/connection/${this.sessionId}`, this.onUpdateConnection);
    this.updateConnection()

    this.startSubscription = this.stompClient.subscribe(`/topic/start/${this.sessionId}/${this.playerId}`, this.onStartGame);

    this.endSubscription = this.stompClient.subscribe(`/topic/end/${this.sessionId}`, this.onEndGame);
  }

  private onError(message: any): void {
    console.log('Error connecting to websocket', message);
  }

  updateConnection(): void {
    if (!this.stompClient) {
      console.log('No connection to websocket');
      return;
    }
    // Get number of connection
    this.stompClient.publish({
      destination: '/app/game',
      body: JSON.stringify({
        type: 'CONNECTION',
        payload: JSON.stringify({
          playerId: this.playerId,
          sessionId: this.sessionId,
          gameType: this.gameType,
        }),
      })
    }
    );
  }

  startGame(): void {
    if (!this.stompClient) {
      console.log('No connection to websocket');
      return;
    }
    this.stompClient.publish({
      destination: '/app/game',
      body: JSON.stringify({
        type: 'START',
        payload: JSON.stringify({
          playerId: this.playerId,
          sessionId: this.sessionId,
          gameType: this.gameType,
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
          gameType: this.gameType,
          score: score,
        }),
      }),
    });
  }

  disconnectGame() {
    if (!this.stompClient) {
      console.log('No connection to websocket');
      return;
    }
    this.stompClient.publish({
      destination: '/app/game',
      body: JSON.stringify({
        type: 'DISCONNECT',
        payload: JSON.stringify({
          playerId: this.playerId,
          sessionId: this.sessionId,
          gameType: this.gameType,
        }),
      }),
    });

    this.destroyWebsocket()
  }

  receiveItem(itemId: string): void {
    if (!this.stompClient) {
      console.log('No connection to websocket');
      return;
    }
    this.stompClient.publish({
      destination: '/app/game',
      body: JSON.stringify({
        type: 'RECEIVE',
        payload: JSON.stringify({
          sessionId: this.sessionId,
          playerId: this.playerId,
          gameType: this.gameType,
          gameId: this.gameId,
          itemId: itemId
        }),
      }),
    });
  }

  endGame(): void {
    if (!this.stompClient) {
      console.log('No connection to websocket');
      return;
    }
    this.stompClient.publish({
      destination: '/app/game',
      body: JSON.stringify({
        type: 'END',
        payload: JSON.stringify({
          sessionId: this.sessionId,
          playerId: this.playerId,
          gameType: this.gameType,
        }),
      }),
    });
  }

  destroyWebsocket(): void {
    if (!this.stompClient) {
      console.log('No connection to websocket');
      return;
    }
    console.log("DESTROY WEBSOCKET")
    this.startSubscription.unsubscribe();
    this.timeSubscription.unsubscribe();
    this.connectionSubscription.unsubscribe();
    this.stompClient.deactivate()
    this.stompClient = null
  }
}
