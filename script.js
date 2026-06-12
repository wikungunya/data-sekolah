// 1. LINK SPREADSHEET ANDA (SUDAH VALID)
const urlSpreadsheet = "https://docs.google.com/spreadsheets/d/e/2PACX-1vR8EbUUCJAxWs6PwfjKKB8pCFURgglFZxkYL80vj6PL_ZlZCNAOa8S-8Pn0BaWSCDixNhcjwy-a29XH/pub?output=csv";

// Mengambil elemen area tabel dan tombol dari HTML
const kontenTabel = document.getElementById('kontenTabel');
const tombolMuat = document.getElementById('tombolMuat');

// Fungsi untuk mengubah data teks CSV menjadi tabel HTML
function ubahCsvKeTabel(teksCsv) {
    const semuaBaris = teksCsv.split("\n");
    let hasilHtml = "";

    for (let i = 1; i < semuaBaris.length; i++) {
        if (semuaBaris[i].trim() === "") continue; 

        const kolom = semuaBaris[i].split(",");

        // Menyusun baris sesuai jumlah kolom yang Anda miliki (5 kolom)
        hasilHtml += `<tr>
            <td>${kolom[0] || i}</td> 
            <td>${kolom[1] || '-'}</td> 
            <td>${kolom[2] || '-'}</td> 
            <td>${kolom[3] || '-'}</td> 
            <td>${kolom[4] || '-'}</td> 
        </tr>`;
    }

    kontenTabel.innerHTML = hasilHtml;
}

// FUNGSI UTAMA: Mengambil data dari Google Spreadsheet
function muatDataOtomatis() {
    if (tombolMuat) {
        tombolMuat.textContent = "Sedang Memuat Data...";
        tombolMuat.disabled = true;
    }

    fetch(urlSpreadsheet)
        .then(response => response.text())
        .then(data => {
            ubahCsvKeTabel(data);
            
            if (tombolMuat) {
                tombolMuat.textContent = "Data Berhasil Diperbarui!";
                tombolMuat.style.backgroundColor = "#28a745";
                tombolMuat.disabled = false;
            }
        })
        .catch(error => {
            alert("Gagal mengambil data otomatis. Pastikan koneksi internet aktif.");
            console.error(error);
            if (tombolMuat) {
                tombolMuat.textContent = "Gagal Memuat, Coba Lagi";
                tombolMuat.disabled = false;
            }
        });
}

// JALANKAN LANGSUNG TANPA MENUNGGU APAPUN
muatDataOtomatis();

// Tombol tetap berfungsi untuk refresh manual
if (tombolMuat) {
    tombolMuat.addEventListener('click', muatDataOtomatis);
}
