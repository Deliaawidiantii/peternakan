import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController } from '@ionic/angular';

interface RiwayatPerkawinan {
  id: string;
  status: 'IB' | 'PKB' | 'Lahir';
  hasIB: boolean;
  hasPKB: boolean;
  hasLahir: boolean;
  eartagBetina: string;
  jenisTernak: 'Sapi' | 'Kerbau';
  rumpunTernak: string;
  umurInduk?: number;
  tanggalIB?: string;
  metodePerkawinan: string;
  inseminasiKe?: number;
  usiaInduk?: number;
  kodeProduksi?: string;
  kodeBatch?: string;
  idPejantan?: string;
  tanggalPKB?: string;
  jenisPerkawinan?: 'IB' | 'Alami';
  umurKebuntingan?: number;
  prediksiLahir?: string;
  tanggalLahir?: string;
  jenisKelaminAnak?: 'Jantan' | 'Betina';
  beratLahirAnak?: number;
  kondisiAnak?: string;
  namaPemilik: string;
  nikPemilik: string;
  telpPemilik: string;
  alamatPemilik: string;
  provinsi: string;
  kabupaten: string;
  kecamatan: string;
  desa: string;
  namaPetugas?: string;
  nikPetugas?: string;
  telpPetugas?: string;
  foto?: string;
  createdAt: string;
  updatedAt: string;
}

@Component({
  selector: 'app-detail-riwayat-perkawinan',
  templateUrl: './detail-riwayat-perkawinan.page.html',
  styleUrls: ['./detail-riwayat-perkawinan.page.scss'],
  standalone: false
})
export class DetailRiwayatPerkawinanPage implements OnInit {

  riwayat: RiwayatPerkawinan | null = null;
  eartagId: string = '';
  eartag: string = '';
  isLoading = true;

  // Mock data untuk testing
  allRiwayatList: RiwayatPerkawinan[] = [
    {
      id: '1',
      status: 'PKB',
      hasIB: true,
      hasPKB: true,
      hasLahir: false,
      eartagBetina: 'ID-001-2024',
      jenisTernak: 'Sapi',
      rumpunTernak: 'Simental',
      umurInduk: 4,
      usiaInduk: 48,
      tanggalIB: '2024-01-15',
      metodePerkawinan: 'IB',
      inseminasiKe: 1,
      kodeProduksi: 'SP-001',
      kodeBatch: 'B-2024-01',
      idPejantan: 'PJ-001',
      tanggalPKB: '2024-02-20',
      jenisPerkawinan: 'IB',
      umurKebuntingan: 2,
      prediksiLahir: '2024-10-15',
      namaPemilik: 'Budi Santoso',
      nikPemilik: '3201234567890001',
      telpPemilik: '081234567890',
      alamatPemilik: 'Jl. Merdeka No. 123',
      provinsi: 'Jawa Barat',
      kabupaten: 'Bandung',
      kecamatan: 'Cibiru',
      desa: 'Cipadung',
      namaPetugas: 'Dr. Ahmad Fauzi',
      nikPetugas: '3201234567890123',
      telpPetugas: '081234567890',
      foto: 'path/to/photo.jpg',
      createdAt: '2024-01-15T10:00:00',
      updatedAt: '2024-02-20T14:30:00'
    },
    {
      id: '2',
      status: 'Lahir',
      hasIB: true,
      hasPKB: true,
      hasLahir: true,
      eartagBetina: 'ID-002-2024',
      jenisTernak: 'Kerbau',
      rumpunTernak: 'Kerbau Lumpur',
      umurInduk: 5,
      usiaInduk: 60,
      tanggalIB: '2023-12-10',
      metodePerkawinan: 'Alam',
      tanggalPKB: '2024-01-15',
      jenisPerkawinan: 'Alami',
      umurKebuntingan: 3,
      prediksiLahir: '2024-09-10',
      tanggalLahir: '2024-09-08',
      jenisKelaminAnak: 'Betina',
      beratLahirAnak: 32,
      kondisiAnak: 'Sehat',
      namaPemilik: 'Siti Rahayu',
      nikPemilik: '3201234567890002',
      telpPemilik: '081234567891',
      alamatPemilik: 'Jl. Raya Rancasari No. 45',
      provinsi: 'Jawa Barat',
      kabupaten: 'Bandung',
      kecamatan: 'Rancasari',
      desa: 'Cipamokolan',
      namaPetugas: 'Dr. Ahmad Fauzi',
      nikPetugas: '3201234567890123',
      telpPetugas: '081234567890',
      foto: 'path/to/photo2.jpg',
      createdAt: '2023-12-10T09:00:00',
      updatedAt: '2024-09-08T08:15:00'
    },
    {
      id: '3',
      status: 'IB',
      hasIB: true,
      hasPKB: false,
      hasLahir: false,
      eartagBetina: 'ID-003-2024',
      jenisTernak: 'Sapi',
      rumpunTernak: 'PO',
      usiaInduk: 36,
      tanggalIB: '2024-03-01',
      metodePerkawinan: 'IB',
      inseminasiKe: 2,
      kodeProduksi: 'SP-002',
      kodeBatch: 'B-2024-03',
      idPejantan: 'PJ-002',
      namaPemilik: 'Joko Widodo',
      nikPemilik: '3201234567890003',
      telpPemilik: '081234567892',
      alamatPemilik: 'Jl. Pasir Biru No. 88',
      provinsi: 'Jawa Barat',
      kabupaten: 'Bandung',
      kecamatan: 'Cibiru',
      desa: 'Pasir Biru',
      namaPetugas: 'Dr. Sinta Maharani',
      nikPetugas: '3201234567890124',
      telpPetugas: '081234567891',
      foto: 'path/to/photo3.jpg',
      createdAt: '2024-03-01T11:00:00',
      updatedAt: '2024-03-01T11:00:00'
    }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private navController: NavController
  ) {}

  ngOnInit() {
    this.getRiwayatFromParams();
  }

  getRiwayatFromParams() {
    this.route.queryParams.subscribe((params: any) => {
      this.eartagId = params['eartagId'];
      this.eartag = params['eartag'];
      
      console.log('Params:', { eartagId: this.eartagId, eartag: this.eartag });
      
      if (this.eartagId) {
        this.loadRiwayatDetail();
      }
    });
  }

  loadRiwayatDetail() {
    this.isLoading = true;
    
    // Cari data berdasarkan ID dari mock data
    const foundRiwayat = this.allRiwayatList.find(item => item.id === this.eartagId);
    
    if (foundRiwayat) {
      this.riwayat = foundRiwayat;
      console.log('Riwayat loaded:', this.riwayat);
    } else {
      console.warn('Data riwayat tidak ditemukan dengan ID:', this.eartagId);
    }
    
    this.isLoading = false;
  }

  getStatusColor(status: string): string {
    switch(status) {
      case 'IB': return 'primary';
      case 'PKB': return 'warning';
      case 'Lahir': return 'success';
      default: return 'medium';
    }
  }

  updateProgress() {
    if (!this.riwayat) return;

    if (this.riwayat.hasPKB && !this.riwayat.hasLahir) {
      this.router.navigate(['/petugas/perkawinan/lahir'], {
        queryParams: {
          eartagId: this.riwayat.id,
          eartag: this.riwayat.eartagBetina
        }
      });
    } else if (this.riwayat.hasIB && !this.riwayat.hasPKB) {
      this.router.navigate(['/petugas/perkawinan/input-pkb'], {
        queryParams: {
          eartagId: this.riwayat.id,
          eartag: this.riwayat.eartagBetina
        }
      });
    }
  }

  editRiwayat() {
    if (this.eartagId) {
      this.router.navigate(['/petugas/perkawinan/edit-riwayat'], {
        queryParams: {
          eartagId: this.eartagId,
          eartag: this.eartag
        }
      });
    }
  }

  goBack() {
    this.navController.back();
  }
}