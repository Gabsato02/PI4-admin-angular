import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ImageCroppedEvent } from 'ngx-image-cropper';

@Component({
  selector: 'app-image-cropper',
  templateUrl: './image-cropper.component.html',
  styleUrls: ['./image-cropper.component.scss']
})
export class ImageCropperComponent implements OnInit {
  @Input() set selectedImage(value: any) {
    this.base64Image = value;
  }
  @Output() imageCropEvent = new EventEmitter<string>();

  base64Image: any = '';
  croppedImage: any = '';
  selectMode = true;

  constructor() { }

  ngOnInit(): void {
  }

  async fileChangeEvent(event: any): Promise<any>  {
    this.base64Image = await this.toBase64(event.srcElement.files[0]);
    this.selectMode = false;
  }

  toBase64(file: any): any {
    return new Promise<any>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }

  imageCropped(event: ImageCroppedEvent): void {
    this.croppedImage = event.base64;
  }

  saveImage(): void {
    this.imageCropEvent.emit(this.croppedImage || this.base64Image);
    this.selectMode = true;
  }

  clearImage(): void {
    this.imageCropEvent.emit('');
    this.base64Image = '';
    this.selectMode = true;
  }
}
