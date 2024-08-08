// websocket.service.ts

import { Injectable } from '@angular/core';
import SockJS from 'sockjs-client';
import * as Stomp from 'stompjs';

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  private stompClient: any;
  private socket: any;
  playerId?: string;
  sessionId?: string;
  connect(sessionId: string, playerId: number): void {
    this.socket = new SockJS('http://localhost:8081/ws');
    this.stompClient = Stomp.over(this.socket);

    this.stompClient.connect({}, () => {
      this.onConnectSuccess(sessionId, playerId);
    }, this.onError);
  }

  private onConnectSuccess(sessionId: string, playerId: number): void {
    this.stompClient.subscribe(`/topic/time/${sessionId}`, (message: any) => {
      // Handle game update
    });
    this.stompClient.subscribe(`/topic/connection/${sessionId}`, (message: any) => {
      // Handle connection update
    });
    this.stompClient.subscribe(`topic/leaderboard/${sessionId}`, (message: any) => {
      // Handle leaderboard update
    });

    // Get number of connection
    this.stompClient.send(
      '/app/game',
      {},
      JSON.stringify({
        type: 'CONNECTION',
        payload: JSON.stringify({
          playerId: playerId,
          sessionId: sessionId,
        }),
      })
    );
  }

  private onError(message: any): void {
    console.log('Error connecting to websocket', message);
  }

  startGame(playerId: number, sessionId: string): void {
    this.stompClient.subscribe(`/topic/start/${playerId}`, (message: any) => {
      // Handle game start
    });

    this.stompClient.send(
      '/app/game',
      {},
      JSON.stringify({
        type: 'START',
        payload: JSON.stringify({
          playerId: playerId,
          sessionId: sessionId,
        }),
      })
    );
  }

  updateGame(playerId: number, sessionId: string, score: number): void {
    this.stompClient.send(
      '/app/game',
      {},
      JSON.stringify({
        type: 'UPDATE',
        payload: JSON.stringify({
          playerId: playerId,
          sessionId: sessionId,
          score: score,
        }),
      })
    );
  }

  onStartGame(callback: (responseBody: any) => void): void {
    this.stompClient.subscribe(`/topic/start/${this.playerId}`, (message: any) => {
      callback(JSON.parse(message.body));
    });
  }

  onUpdateGame(callback: (message: any) => void): void {
    this.stompClient.subscribe(`/topic/time/${this.sessionId}`, (message: any) => {
      callback(message.body);
    });
  }

  onUpdateConnection(callback: (message: any) => void): void {
    this.stompClient.subscribe(`/topic/connection/${this.sessionId}`, (message: any) => {
      callback(message.body);
    });
  }

  onUpdateLeaderboard(callback: (message: any) => void): void {
    this.stompClient.subscribe(`/topic/leaderboard/${this.sessionId}`, (message: any) => {
      callback(message.body);
    });
  }
}
