// 1. LINK SPREADSHEET ANDA (SUDAH BENAR)
const urlSpreadsheet = "https://docs.google.com/spreadsheets/d/e/2PACX-1vR8EbUUCJAxWs6PwfjKKB8pCFURgglFZxkYL80vj6PL_ZlZCNAOa8S-8Pn0BaWSCDixNhcjwy-a29XH/pub?output=csv";

// Mengambil elemen tombol dan area tabel dari HTML
const tombolMuat = document.getElementById('tombolMuat');
const kontenTabel = document.getElementById('kontenTabel');

// Fungsi untuk mengubah data teks CSV menjadi tabel HTML (SUDAH DISESUAIKAN)
function ubahCsvKeTabel(teksCsv) {
    // Memecah teks spreadsheet per baris
    const semuaBaris = teksCsv.split("\n");
    let hasilHtml = "";

    // Membaca baris data (mulai dari baris kedua/indeks 1 agar judul kolom tidak ikut dobel)
    for (let i = 1; i < semuaBaris.length; i++) {
        if (semuaBaris[i].trim() === "") continue; // Lewati jika ada baris kosong

        // Memecah kolom yang dipisahkan oleh koma
        const kolom = semuaBaris[i].split(",");

        // PENJELASAN INDEKS KOLOM:
        // kolom[0] -> Berisi nomor urut dari Kolom A Spreadsheet
        // kolom[1] -> Berisi Nama Siswa dari Kolom B Spreadsheet
        // kolom[2] -> Berisi Kelas dari Kolom C Spreadsheet
        // kolom[3] -> Berisi Status/Nilai dari Kolom D Spreadsheet

        // Menyusun baris tabel baru
        hasilHtml += `<tr>
            <td>${kolom[0] || i}</td> 
            <td>${kolom[1] || '-'}</td> 
            <td>${kolom[2] || '-'}</td> 
            <td>${kolom[3] || '-'}</td> 
        </tr>`;
    }

    // Memasukkan baris-baris baru ke dalam tabel HTML
    kontenTabel.innerHTML = hasilHtml;
}

// Memberikan fungsi klik pada tombol untuk mengambil data
tombolMuat.addEventListener('click', function() {
    tombolMuat.textContent = "Sedang Memuat Data...";
    tombolMuat.disabled = true;

    // Mengambil data dari Google Spreadsheet
    fetch(urlSpreadsheet)
        .then(response => response.text())
        .then(data => {
            ubahCsvKeTabel(data);
            tombolMuat.textContent = "Data Berhasil Diperbarui!";
            tombolMuat.style.backgroundColor = "#28a745";
            tombolMuat.disabled = false;
        })
        .catch(error => {
            alert("Gagal mengambil data. Pastikan link spreadsheet sudah benar.");
            console.error(error);
            tombolMuat.textContent = "Coba Lagi";
            tombolMuat.disabled = false;
        });
});
