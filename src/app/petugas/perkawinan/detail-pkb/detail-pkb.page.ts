import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router} from '@angular/router';



interface HewanData {
  id: string;
  eartag: string;
  jenis: 'sapi' | 'kerbau' | 'kambing';
  rumpun: string;
  usia: number;
  pemilik: string;
  status: 'siap' | 'belum siap' | 'dalam proses';
}



@Component({
  selector: 'app-detail-pkb',
  templateUrl: './detail-pkb.page.html',
  styleUrls: ['./detail-pkb.page.scss'],
  standalone: false,
})
export class DetailPKBPage implements OnInit {

  hewan: HewanData = {
    id: '1',
    eartag: 'ET12345',
    jenis: 'sapi',
    rumpun: 'Limousin',
    usia: 36,
    pemilik: 'Budi Santoso',
    status: 'siap'
  };

  // Data hewan dari list (bisa dari service atau passed data)
  hewanList: HewanData[] = [
    {
      id: '1',
      eartag: 'ET12345',
      jenis: 'sapi',
      rumpun: 'Limousin',
      usia: 36,
      pemilik: 'Budi Santoso',
      status: 'siap'
    },
    {
      id: '2',
      eartag: 'ET67890',
      jenis: 'kerbau',
      rumpun: 'Murrah',
      usia: 48,
      pemilik: 'Siti Aminah',
      status: 'belum siap'
    },
    {
      id: '3',
      eartag: 'ET54321',
      jenis: 'kambing',
      rumpun: 'Boer',
      usia: 24,
      pemilik: 'Andi Wijaya',
      status: 'dalam proses'
    },
    {
      id: '4',
      eartag: 'ET98765',
      jenis: 'sapi',
      rumpun: 'Limousin',
      usia: 30,
      pemilik: 'Dewi Lestari',
      status: 'siap'
    },
    {
      id: '5',
      eartag: 'ET11223',
      jenis: 'kerbau',
      rumpun: 'Murrah',
      usia: 42,
      pemilik: 'Rina Kurnia',
      status: 'belum siap'
    },
    {
      id: '6',
      eartag: 'ET44556',
      jenis: 'kambing',
      rumpun: 'Boer',
      usia: 18,
      pemilik: 'Joko Susilo',
      status: 'dalam proses'
    }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    // Ambil ID dari route params
    this.route.params.subscribe(params => {
      const hewanId = params['id'];
      if (hewanId) {
        this.loadHewanDetail(hewanId);
      }
    });
  }

  loadHewanDetail(id: string) {
    // Cari hewan berdasarkan ID
    const found = this.hewanList.find(h => h.id === id);
    if (found) {
      this.hewan = found;
    }
  }

  lakukanPKB(hewan: HewanData) {
    if (hewan.status !== 'siap') {
      alert('Hewan belum siap untuk melakukan PKB!');
      return;
    }

    console.log('Melakukan PKB untuk hewan:', hewan);
    alert(`PKB untuk ${hewan.jenis} ID ${hewan.id} dimulai!`);
    
    // Navigate ke halaman input PKB
    // this.router.navigate(['/petugas/pkb/input', hewan.id]);
     this.router.navigate(['/petugas/perkawinan/input-pkb'],
      { queryParams: { id: hewan.id } }
    );
  }

  editData(hewan: HewanData) {
    console.log('Edit data hewan:', hewan);
    alert('Fitur edit data akan segera tersedia');
    
    // Navigate ke halaman edit
    this.router.navigate(['/petugas/perkawinan/edit-data-pkb'],
      { queryParams: { id: hewan.id } }
    );
  }

}
