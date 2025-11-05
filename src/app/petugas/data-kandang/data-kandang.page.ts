import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-data-kandang',
  templateUrl: './data-kandang.page.html',
  styleUrls: ['./data-kandang.page.scss'],
  standalone: false,
})
export class DataKandangPage implements OnInit {

  previewUrl : string | undefined ;

  constructor() { }

  ngOnInit() {
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.previewUrl = reader.result as string;
    };
    reader.readAsDataURL(file);

  }

}
