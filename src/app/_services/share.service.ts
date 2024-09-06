import { Injectable } from '@angular/core';
import { Browser } from '@capacitor/browser';
import { Share } from '@capacitor/share';

@Injectable({
  providedIn: 'root'
})
export class ShareService {

  constructor() { }
  async shareGameOnFacebook(gameUrl: string, message: string) {
  //   try {
  //     const shareResult = await Share.share({
  //       title: 'Check out this game!',
  //       text: message,
  //       url: gameUrl,
  //       dialogTitle: 'Share the game with your friends'
  //     });

  //     console.log('Share result:', shareResult);

  //     // Here you could add your logic to detect if the sharing was successful.
  //     if (shareResult.activityType) {
  //       // ActivityType indicates that sharing was successful on some platforms (optional)
  //       console.log('Shared successfully');
  //     } else {
  //       console.log('Sharing was canceled or dismissed');
  //     }
  //   } catch (error) {
  //     console.error('Error sharing:', error);
  //   }
  // } 
  const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(gameUrl)}`;
  
  // Open the share URL in the device's default browser
  await Browser.open({
    url: facebookShareUrl,
  });
}

  // Optionally, you can implement a timer to simulate the user returning to the app
  // setTimeout(() => {
  //   this.updateGamePlays(); // Assuming the user successfully shared after 5 seconds
  // }, 5000);
}
