import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.scss'],
  standalone: false,
})
export class EditProfilePage implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef;
  previewUrl: string | null = null;

  selectPhoto(){
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: any){
    const file = event.target.files[0];
    if(file){
      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result as string
      };
      reader.readAsDataURL(file);
    }
  }

  constructor() { }

  ngOnInit() {
  }

}
