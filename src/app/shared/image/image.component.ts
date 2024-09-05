import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ImageService } from '../../image.service';

@Component({
  selector: 'app-image',
  templateUrl: './image.component.html',
  styleUrl: './image.component.css'
})
export class ImageComponent implements OnChanges {
  imageSrc: string = '';
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['imageUrl'] && this.imageUrl) {
      this.imageService.getImageUrl(this.imageUrl).subscribe({
        next: (url: string) => this.imageSrc = url,
        error: (error) => console.error('Error:', error)
      });
    }
  }
  @Input() imageUrl?: string;
  constructor(private imageService: ImageService) {

  }
}
