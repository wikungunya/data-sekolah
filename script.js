// 1. LINK SPREADSHEET ANDA
const urlSpreadsheet = "https://docs.google.com/spreadsheets/d/e/2PACX-1vR8EbUUCJAxWs6PwfjKKB8pCFURgglFZxkYL80vj6PL_ZlZCNAOa8S-8Pn0BaWSCDixNhcjwy-a29XH/pub?output=csv";

// Mengambil elemen-elemen dari HTML
const kontenTabel = document.getElementById('kontenTabel');
const tombolMuat = document.getElementById('tombolMuat');
const tombolSebelumnya = document.getElementById('tombolSebelumnya');
const tombolBerikutnya = document.getElementById('tombolBerikutnya');
const infoHalaman = document.getElementById('infoHalaman');

// PENGATURAN PAGINATION
let dataKoleksiBaris = []; // Tempat menyimpan semua baris data dari Google Sheets
let halamanSekarang = 1;
const dataPerHalaman = 10; // UBAH ANGKA INI untuk mengatur jumlah baris per halaman

// Fungsi untuk menampilkan data spesifik sesuai halaman yang aktif
function tampilkanDataHalaman(nomorHalaman) {
    let hasilHtml = "";

    // Menghitung indeks data yang akan diambil
    // Misal Hal 1: data ke-0 sampai ke-9. Hal 2: data ke-10 sampai ke-19
    const indeksMulai = (nomorHalaman - 1) * dataPerHalaman;
    const indeksSelesai = Math.min(indeksMulai + dataPerHalaman, dataKoleksiBaris.length);

    // Menghitung total halaman maksimal
    const totalHalaman = Math.ceil(dataKoleksiBaris.length / dataPerHalaman) || 1;

    // Jika data kosong
    if (dataKoleksiBaris.length === 0) {
        kontenTabel.innerHTML = `<tr><td colspan="10" style="text-align: center; color: #888;">Tidak ada data ditemukan.</td></tr>`;
        infoHalaman.textContent = "Halaman 1 dari 1";
        tombolSebelumnya.disabled = true;
        tombolBerikutnya.disabled = true;
        return;
    }

    // Menyusun baris tabel hanya untuk data di halaman ini
    for (let i = indeksMulai; i < indeksSelesai; i++) {
        const kolom = dataKoleksiBaris[i].split(",");

        // Sesuaikan urutan kolom[0], kolom[1], dst dengan file Anda sebelumnya
        hasilHtml += `<tr>
            <td>${kolom[0] || (i + 1)}</td> 
            <td>${kolom[1] || '-'}</td> 
            <td>${kolom[2] || '-'}</td> 
            <td>${kolom[3] || '-'}</td> 
            <td>${kolom[4] || '-'}</td> 
        </tr>`;
    }

    // Masukkan ke dalam tabel HTML
    kontenTabel.innerHTML = hasilHtml;

    // Perbarui teks informasi halaman (Contoh: Halaman 1 dari 5)
    infoHalaman.textContent = `Halaman ${nomorHalaman} dari ${totalHalaman}`;

    // Atur tombol aktif/nonaktif agar tidak kebablasan
    tombolSebelumnya.disabled = (nomorHalaman === 1);
    tombolBerikutnya.disabled = (nomorHalaman === totalHalaman);
}

// Fungsi utama untuk mengambil data awal dari Google Spreadsheet
function muatDataOtomatis() {
    if (tombolMuat) {
        tombolMuat.textContent = "Sedang Memuat Data...";
        tombolMuat.disabled = true;
    }

    fetch(urlSpreadsheet)
        .then(response => response.text())
        .then(data => {
            // Memecah teks csv per baris
            const semuaBaris = data.split("\n");
            
            // Menyaring baris agar baris judul (indeks 0) dan baris kosong tidak ikut disimpan
            dataKoleksiBaris = semuaBaris.filter((baris, indeks) => indeks > 0 && baris.trim() !== "");

            // Tampilkan halaman pertama secara default
            halamanSekarang = 1;
            tampilkanDataHalaman(halamanSekarang);
            
            if (tombolMuat) {
                tombolMuat.textContent = "Data Berhasil Diperbarui!";
                tombolMuat.style.backgroundColor = "#28a745";
                tombolMuat.disabled = false;
            }
        })
        .catch(error => {
            alert("Gagal mengambil data otomatis.");
            console.error(error);
            if (tombolMuat) {
                tombolMuat.textContent = "Gagal Memuat, Coba Lagi";
                tombolMuat.disabled = false;
            }
        });
}

// --- LOGIKA TOMBOL NAVIGASI HALAMAN ---
tombolSebelumnya.addEventListener('click', () => {
    if (halamanSekarang > 1) {
        halamanSekarang--;
        tampilkanDataHalaman(halamanSekarang);
    }
});

tombolBerikutnya.addEventListener('click', () => {
    const totalHalaman = Math.ceil(dataKoleksiBaris.length / dataPerHalaman);
    if (halamanSekarang < totalHalaman) {
        halamanSekarang++;
        tampilkanDataHalaman(halamanSekarang);
    }
});

// Jalankan otomatis saat web dibuka
muatDataOtomatis();

// Tombol refresh manual tetap berfungsi jika ada
if (tombolMuat) {
    tombolMuat.addEventListener('click', muatDataOtomatis);
}
