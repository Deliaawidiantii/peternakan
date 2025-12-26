import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import { CommonModule } from '@angular/common';



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
  selector: 'app-edit-data-pkb',
  templateUrl: './edit-data-pkb.page.html',
  styleUrls: ['./edit-data-pkb.page.scss'],
  standalone: false,
})
export class EditDataPKBPage implements OnInit {

  editForm: FormGroup;
  hewan: HewanData = {
    id: '1',
    eartag: 'ET12345',
    jenis: 'sapi',
    rumpun: 'Limousin',
    usia: 36,
    pemilik: 'Budi Santoso',
    status: 'siap'
  };

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
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.editForm = this.fb.group({
      eartag: ['', Validators.required],
      rumpun: ['', Validators.required],
      usia: ['', [Validators.required, Validators.min(1)]],
      status: ['', Validators.required],
      pemilik: ['', Validators.required],
      alamat: ['', Validators.required],
      noTelepon: ['', Validators.required],
      catatan: ['']
    });
  }

  ngOnInit() {
    // Ambil ID dari query params
    this.route.queryParams.subscribe(params => {
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
      // Set form values dengan data hewan
      this.editForm.patchValue({
        eartag: this.hewan.eartag,
        rumpun: this.hewan.rumpun,
        usia: this.hewan.usia,
        status: this.hewan.status,
        pemilik: this.hewan.pemilik,
        alamat: 'Jl. Merdeka No. 123, Jakarta',
        noTelepon: '+62 812-3456-7890',
        catatan: ''
      });
    }
  }

  simpanData() {
    if (!this.editForm.valid) {
      alert('Mohon isi semua field dengan benar!');
      return;
    }

    const updatedData = {
      ...this.hewan,
      ...this.editForm.value
    };

    console.log('Data yang disimpan:', updatedData);
    alert('Data PKB berhasil diperbarui!');

    // Navigate kembali ke detail PKB
    this.router.navigate(
      ['/petugas/perkawinan/detail-pkb'],
      { queryParams: { id: this.hewan.id } }
    );
  }

  batal() {
    console.log('Edit dibatalkan');
    // Navigate kembali ke detail PKB
    this.router.navigate(
      ['/petugas/perkawinan/detail-pkb'],
      { queryParams: { id: this.hewan.id } }
    );
  }

}
