import { Injectable } from '@angular/core';
import { Motion } from '@capacitor/motion';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShakeDetectService {
  private shakeThreshold: number = 10; // Adjust this value as needed
  private shakeDetected = new BehaviorSubject<boolean>(false);

  shakeDetected$ = this.shakeDetected.asObservable();

  constructor() {
    this.initializeShakeDetection();
  }

  private initializeShakeDetection() {
    let lastX = 0;
    let lastY = 0;
    let lastZ = 0;

    Motion.addListener('accel', (accelData) => {
      const { accelerationIncludingGravity } = accelData;
      const { x, y, z } = accelerationIncludingGravity;
      console.log(`X: ${x}, Y: ${y}, Z: ${z}`);
      const deltaX = Math.abs(lastX - x);
      const deltaY = Math.abs(lastY - y);
      const deltaZ = Math.abs(lastZ - z);

      if (deltaX + deltaY + deltaZ > this.shakeThreshold) {
        this.shakeDetected.next(true);
        setTimeout(() => this.shakeDetected.next(false), 1000); // Reset after 1 second
      }

      lastX = x;
      lastY = y;
      lastZ = z;
    });
  }
}
