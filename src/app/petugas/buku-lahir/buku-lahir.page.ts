import { Component, OnInit } from '@angular/core';
import { ActionSheetController } from '@ionic/angular';
import { Router } from '@angular/router';

interface BirthRecord {
  id: string;
  date: string;
  childId: string;
  parentId: string;
  animalType: string;
  status: string;
  imageUrl: string;
}

@Component({
  selector: 'app-buku-lahir',
  templateUrl: './buku-lahir.page.html',
  styleUrls: ['./buku-lahir.page.scss'],
  standalone: false,
})
export class BukuLahirPage implements OnInit {

  kelompokHewan: string = "";
  selectedMonth: string = '';
  selectedAnimalType: string = '';
  searchQuery: string = '';

  allBirthRecords: BirthRecord[] = [
    {
      id: '1',
      date: '2024-07-20',
      childId: '#A123',
      parentId: '#123',
      animalType: 'sapi',
      status: 'Hidup',
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAu2woTfUFWjXO4IMPyKEhoXVtq7ZyC5SCrNstITE2cBZ8I2MWMx8GIsQz7Jy5A7ZoJwt_YY8xM272oi8PzeXSxZOvHgW3jvLYX3IGuM_mhGHGSXLjLS9tM7a3hSJ7UqsC0VfbxwvrB24-9RYx6cYYSVl2BWz8aps3X0_g4fUYX1HpzLG0W2AzL58L-uYnA1YDe-yAQc5bYESNm6sulBb6v5ZRBHxPccZd0lrLK7eaaAHh4W-E3wMP6ooK4vqzRUQGdeNXYMJ5OOym5'
    },
    {
      id: '2',
      date: '2024-07-15',
      childId: '#B456',
      parentId: '#456',
      animalType: 'kambing',
      status: 'Hidup',
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDlIN5mu5B5ZRsddupUSCLr26PWTHNNUVGZ3sguvQ-laDF8ta0ApYbBRs6D2gAW-VPqrG3iHr-YUTn59F7-55Def8lKkY2zbdRKSmHSHQrVS18og8PCFAak9GwuuZZVBPEzV6qW89v05ztsxqro3usg0rEqmxJhWEvYOwpHKdhGn6Xd99StekJkm43Pau75loNF-vSn1-C1e8e9K3ZetzbRnYUBWJbCTC0TfkbglVrIK9jA4dWfXjAogFEnOYpV2Jf_o8fydcgxkF3f'
    },
    {
      id: '3',
      date: '2024-07-10',
      childId: '#C789',
      parentId: '#789',
      animalType: 'ayam',
      status: 'Mati',
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCCQg0SppadAe9fLXWoPVpXzt-LGjnwStIRJyHgmFAo7zABYuXSq-kXwF4-ektZk1GcnW8_TQzk0U7y6u5PdFC2cYrGug2ujwH6IGwGq9DacG2kDiAFNrspfYlgosxzkkx59rrXWK15R-fWEd6E1zVMKNYTFNrSJ5xY686iExROqLyBQf23PvhTI68byOZVkExoPoZaoZR622G1WN1__921zWCu1t4O2sR4BHwRQyKrr5-NQVmRHi4cfqM10Vu58dBOneJUVYCDI40N'
    },
    {
      id: '4',
      date: '2024-06-25',
      childId: '#D321',
      parentId: '#321',
      animalType: 'sapi',
      status: 'Hidup',
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAu2woTfUFWjXO4IMPyKEhoXVtq7ZyC5SCrNstITE2cBZ8I2MWMx8GIsQz7Jy5A7ZoJwt_YY8xM272oi8PzeXSxZOvHgW3jvLYX3IGuM_mhGHGSXLjLS9tM7a3hSJ7UqsC0VfbxwvrB24-9RYx6cYYSVl2BWz8aps3X0_g4fUYX1HpzLG0W2AzL58L-uYnA1YDe-yAQc5bYESNm6sulBb6v5ZRBHxPccZd0lrLK7eaaAHh4W-E3wMP6ooK4vqzRUQGdeNXYMJ5OOym5'
    },
    {
      id: '5',
      date: '2024-06-10',
      childId: '#E654',
      parentId: '#654',
      animalType: 'bebek',
      status: 'Hidup',
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDlIN5mu5B5ZRsddupUSCLr26PWTHNNUVGZ3sguvQ-laDF8ta0ApYbBRs6D2gAW-VPqrG3iHr-YUTn59F7-55Def8lKkY2zbdRKSmHSHQrVS18og8PCFAak9GwuuZZVBPEzV6qW89v05ztsxqro3usg0rEqmxJhWEvYOwpHKdhGn6Xd99StekJkm43Pau75loNF-vSn1-C1e8e9K3ZetzbRnYUBWJbCTC0TfkbglVrIK9jA4dWfXjAogFEnOYpV2Jf_o8fydcgxkF3f'
    }
  ];

  filteredBirthRecords: BirthRecord[] = [];

  constructor(
    private actionSheetController: ActionSheetController,
    private router: Router
  ) {}

  ngOnInit() {
    this.filteredBirthRecords = [...this.allBirthRecords];
  }

  ngDoCheck() {
    this.applyFilters();
  }

  // Fungsi filter data berdasarkan bulan, jenis hewan, dan pencarian
  applyFilters() {
    this.filteredBirthRecords = this.allBirthRecords.filter(record => {
      // Filter berdasarkan bulan
      if (this.selectedMonth) {
        const recordMonth = record.date.split('-')[1];
        if (recordMonth !== this.selectedMonth) {
          return false;
        }
      }

      // Filter berdasarkan jenis hewan
      if (this.selectedAnimalType) {
        if (record.animalType !== this.selectedAnimalType) {
          return false;
        }
      }

      // Filter berdasarkan pencarian
      if (this.searchQuery.trim()) {
        const query = this.searchQuery.toLowerCase();
        const searchableText = `${record.childId} ${record.parentId} ${record.animalType}`.toLowerCase();
        if (!searchableText.includes(query)) {
          return false;
        }
      }

      return true;
    });
  }

  // Bersihkan semua filter
  clearFilters() {
    this.selectedMonth = '';
    this.selectedAnimalType = '';
    this.searchQuery = '';
  }

  // Pilih kelompok hewan
  async pilihKelompokHewan() {
    const actionSheet = await this.actionSheetController.create({
      header: "Pilih Kelompok Hewan",
      buttons: [
        {
          text: 'Ruminansia',
          icon: 'paw-outline',
          handler: () => {
            console.log('Ruminansia dipilih');
            this.kelompokHewan = 'Ruminansia';
            this.router.navigate(['/petugas/ruminansia']);
          },
        },
        {
          text: 'Unggas',
          icon: 'egg-outline',
          handler: () => {
            console.log('Unggas dipilih');
            this.kelompokHewan = 'Unggas';
            this.router.navigate(['/petugas/unggas']);
          },
        },
        {
          text: 'Primata',
          icon: 'people-outline',
          handler: () => {
            console.log('Primata dipilih');
            this.kelompokHewan = 'Primata';
            this.router.navigate(['/petugas/primata']);
          }
        },
        {
          text: 'Kesayangan',
          icon: 'heart-outline',
          handler: () => {
            console.log('Kesayangan dipilih');
            this.kelompokHewan = 'Kesayangan';
            this.router.navigate(['/petugas/kesayangan']);
          },
        },
        {
          text: 'Batal',
          role: 'cancel',
        },
      ],
    });

    await actionSheet.present();
  }

}