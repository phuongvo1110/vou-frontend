import { Component, Input, OnInit } from '@angular/core';
import { ImageService } from '../../image.service';

@Component({
  selector: 'app-category-item',
  templateUrl: './category-item.component.html',
  styleUrl: './category-item.component.css'
})
export class CategoryItemComponent implements OnInit {
  imageSrc: string = '';
  @Input() title: string = "";
  @Input() image: string = "";
  @Input() quantity?: number;
  @Input() targetQuantity?: number;
  constructor(private imageService: ImageService) {

  }
  ngOnInit(){
    this.imageService.getImageUrl(this.image as string).subscribe({
      next: (url: string) => this.imageSrc = url,
      error: (error) => console.error('Error:', error)
    })
  }
}
