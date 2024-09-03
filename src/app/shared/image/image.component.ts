import { Component, Input, OnInit } from '@angular/core';
import { ImageService } from '../../image.service';

@Component({
  selector: 'app-image',
  templateUrl: './image.component.html',
  styleUrl: './image.component.css'
})
export class ImageComponent implements OnInit {
  imageSrc: string = '';
  ngOnInit(){
    this.imageService.getImageUrl(this.imageUrl as string).subscribe({
      next: (url: string) => this.imageSrc = url,
      error: (error) => console.error('Error:', error)
    })
  }
  @Input() imageUrl?: string;
  constructor(private imageService: ImageService) {

  }
}
