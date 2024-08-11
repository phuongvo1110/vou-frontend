// video.service.ts

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class VideoService {
  private video: HTMLVideoElement | null = null;
  private hiddenVideo: HTMLVideoElement | null = null;

  constructor() {}

  setVideo(video: HTMLVideoElement) {
    this.video = video
    this.video.style.display = 'none'
  }

  setHiddenVideo(video: HTMLVideoElement) {
    this.hiddenVideo = video
    this.hiddenVideo.style.display = 'none'
  }

  startSpeaking(): void {
    if (this.hiddenVideo) {
      this.hiddenVideo.style.display = 'none';
      this.hiddenVideo.pause();
      this.hiddenVideo.currentTime = 0;
    }
    if (this.video) {
      this.video.style.display = 'block';
      this.video.play();
    }
  }

  stopSpeaking(): void {
    if (this.video) {
      this.video.style.display = 'none';
      this.video.pause();
      this.video.currentTime = 0;
    }
    if (this.hiddenVideo) {
      this.hiddenVideo.style.display = 'block';
      this.hiddenVideo.play();
    }
  }

  displayStatic(): void {
    if (this.hiddenVideo) {
      this.hiddenVideo.style.display = 'none';
      this.hiddenVideo.pause();
    }
    if (this.video) {
      this.video.style.display = 'block';
      this.video.currentTime = 0;
      this.video.pause();
    }
  }
}
