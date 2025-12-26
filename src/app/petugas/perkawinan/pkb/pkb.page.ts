import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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
  selector: 'app-pkb',
  templateUrl: './pkb.page.html',
  styleUrls: ['./pkb.page.scss'],
  standalone: false,
})
export class PKBPage implements OnInit {

  searchTerm: string = '';
  selectedFilter: string = 'all';

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

  get filteredHewan(): HewanData[] {
    let filtered = this.hewanList;

    // Filter berdasarkan jenis hewan
    if (this.selectedFilter !== 'all') {
      filtered = filtered.filter(h => h.jenis.toLowerCase() === this.selectedFilter.toLowerCase());
    }

    // Filter berdasarkan search term
    if (this.searchTerm.trim() !== '') {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(h =>
        h.id.toLowerCase().includes(term) ||
        h.eartag.toLowerCase().includes(term) ||
        h.pemilik.toLowerCase().includes(term)
      );
    }

    return filtered;
  }

  constructor(private router: Router) { }

  ngOnInit() {
  }

  goBack() {
    window.history.back();
  }

  setFilter(filter: string) {
    this.selectedFilter = filter;
  }

  filterHewan() {
    // Filter sudah dilakukan melalui getter filteredHewan
  }

  // Navigate ke detail PKB page dengan queryParams
  lihatDetail(hewan: HewanData) {
    console.log('Navigate ke detail hewan:', hewan);
    
    // Metode 1: Dengan query params (paling aman)
    this.router.navigate(
      ['/petugas/perkawinan/detail-pkb'],
      { queryParams: { id: hewan.id } }
    );
    
    // ATAU Metode 2: Dengan route params (uncomment jika mau pakai ini)
    // this.router.navigate(['/petugas/perkawinan/detail-pkb', hewan.id]);
  }

  // Lakukan PKB - langsung navigate ke input PKB
  lakukanPKB(hewan: HewanData) {
    if (hewan.status === 'belum siap') {
      alert('Hewan belum siap untuk melakukan PKB!');
      return;
    }

    console.log('Lakukan PKB untuk hewan:', hewan);
    
    // Metode 1: Dengan query params (paling aman)
    this.router.navigate(
      ['/petugas/perkawinan/input-perkawinan'],
      { queryParams: { id: hewan.id, mode: 'pkb' } }
    );
    
    // ATAU Metode 2: Dengan route params (uncomment jika mau pakai ini)
    // this.router.navigate(['/petugas/perkawinan/input-perkawinan', hewan.id]);
  }

}