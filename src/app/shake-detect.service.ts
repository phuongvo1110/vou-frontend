import { Injectable } from '@angular/core';
import { Motion } from '@capacitor/motion';

@Injectable({
  providedIn: 'root'
})
export class ShakeDetectService {
  private shakeThreshold: number = 15;
  private lastShakeTime: number = 0;
  private shakeTimeOut: number = 1000;
  constructor() { }
  startShakeDetection(onDeviceShake: any) {
    Motion.addListener('accel', (event) => {
      const { x, y, z } = event.accelerationIncludingGravity;

      const totalAcceleration = Math.sqrt(x * x + y * y + z * z);


      const currentTime = new Date().getTime();

      if (totalAcceleration > this.shakeThreshold && currentTime - this.lastShakeTime > this.shakeTimeOut) {
        this.lastShakeTime = currentTime;
        onDeviceShake();
      }
    });
  }

  stopShakeDetection() {
    Motion.removeAllListeners();
  }

  onDeviceShake() {
    console.log('Device shaken!');
    // Add your custom logic here
  }
}
