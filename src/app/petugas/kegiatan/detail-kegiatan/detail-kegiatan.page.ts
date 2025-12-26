import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { KegiatanService } from '../../../services/kegiatan.service';

@Component({
  selector: 'app-detail-kegiatan',
  templateUrl: './detail-kegiatan.page.html',
  styleUrls: ['./detail-kegiatan.page.scss'],
  standalone: false,
})
export class DetailKegiatanPage implements OnInit {
  

  kegiatan: any;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private kegiatanService: KegiatanService,
    private router: Router
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.getDetail(id);
  }

  // 🔁 PENTING: refresh saat balik halaman
  ionViewWillEnter() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.getDetail(id);
  }

  getDetail(id: number) {
    this.kegiatanService.getKegiatanById(id).subscribe({
      next: (res) => {
        this.kegiatan = res.data || res;
        console.log('DETAIL KEGIATAN:', this.kegiatan);


        // 🔥 JIKA SUDAH DIMULAI, PINDAHKAN KE PAGE MULAI
        if (this.kegiatan.status === 'sedang_berjalan') {
          this.router.navigate(
            ['/petugas/mulai-kegiatan', this.kegiatan.id],
            { replaceUrl: true }
          );
          return;
        }

        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  baseUrl = 'http://localhost:8000';

  getFotoUrl(path: string) {
    return `${this.baseUrl}/storage/${path}`;
  }


  // ▶️ MULAI KEGIATAN
    mulai() {
    this.kegiatanService.mulaiKegiatan(this.kegiatan.id).subscribe({
      next: () => {
        this.router.navigate(['/petugas/mulai-kegiatan', this.kegiatan.id]);
      }
    });
  }


  // ✅ INI DIA METHOD YANG LU TANYA
  keHalamanMulai() {
    this.router.navigate(['/petugas/mulai-kegiatan', this.kegiatan.id]);
  }
}
