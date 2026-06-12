// 1. PASTE LINK GOOGLE SPREADSHEET (CSV) ANDA DI SINI
const urlSpreadsheet = "https://docs.google.com/spreadsheets/d/e/2PACX-1vR8EbUUCJAxWs6PwfjKKB8pCFURgglFZxkYL80vj6PL_ZlZCNAOa8S-8Pn0BaWSCDixNhcjwy-a29XH/pub?output=csv";

// Mengambil elemen tombol dan area tabel dari HTML
const tombolMuat = document.getElementById('tombolMuat');
const kontenTabel = document.getElementById('kontenTabel');

// Fungsi untuk mengubah data teks CSV menjadi tabel HTML
function ubahCsvKeTabel(teksCsv) {
    // Memecah teks spreadsheet per baris
    const semuaBaris = teksCsv.split("\n");
    let hasilHtml = "";

    // Membaca baris data (kita mulai dari baris kedua/indeks 1 agar judul kolom tidak ikut dobel)
    for (let i = 1; i < semuaBaris.length; i++) {
        if (semuaBaris[i].trim() === "") continue; // Lewati jika ada baris kosong

        // Memecah kolom yang dipisahkan oleh koma
        const kolom = semuaBaris[i].split(",");

        // Menyusun baris tabel baru
        hasilHtml += `<tr>
            <td>${i}</td>
            <td>${kolom[0] || '-'}</td>
            <td>${kolom[1] || '-'}</td>
            <td>${kolom[2] || '-'}</td>
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
