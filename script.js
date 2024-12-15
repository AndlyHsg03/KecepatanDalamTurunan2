function hitung() {
    const t = parseFloat(document.getElementById("time").value);
    let persamaan = document.getElementById("persamaan").value;

    // Validasi input
    if (!persamaan || isNaN(t)) {
        alert("Pastikan persamaan dan waktu sudah diisi dengan benar.");
        return;
    }

    // Menambahkan tanda * secara otomatis untuk perkalian yang hilang
    const persamaanAsli = persamaan; // Simpan untuk tampilan
    persamaan = persamaan
        .replace(/([0-9])([t])/g, "$1*$2")  // Menambahkan * antara angka dan t
        .replace(/([t])(\^)/g, "$1**");    // Mengganti ^ dengan ** untuk eksponen

    try {
        // Evaluasi persamaan posisi
        const posisi = eval(persamaan.replace(/t/g, `(${t})`));

        // Menghitung turunan dari persamaan
        const turunanPersamaan = hitungTurunan(persamaan);

        // Evaluasi turunan untuk menghitung kecepatan kendaraan
        const kecepatan = eval(turunanPersamaan.replace(/t/g, `(${t})`));

        // Menampilkan hasil kecepatan dalam m/s dan penjelasan konversi ke km/jam
        document.getElementById("posisi").innerHTML = "";
        document.getElementById("kecepatan").innerHTML = `
            <strong>Kecepatan Kendaraan:</strong> Pada t = ${t} detik, kecepatan kendaraan adalah ${kecepatan} m/s.<br>
            <strong>Pembahasan:</strong>
            <ul>
                <li>Persamaan posisi kendaraan: <em>${persamaanAsli}</em></li>
                <li>Turunan posisi kendaraan (kecepatan): <em>${turunanPersamaan.replace(/\*\*/g, "^").replace(/\*/g, "")}</em></li>
                <li>Substitusi t = ${t} ke turunan posisi kendaraan: <em>${turunanPersamaan.replace(/\*\*/g, "^").replace(/t/g, t)}</em></li>
                <li>Hasil (dalam m/s): ${kecepatan} m/s</li>
            </ul>
            <br>
            <strong>Konversi Kecepatan ke km/jam:</strong>
            <p>Kecepatan dalam satuan m/s dikonversi menjadi km/jam dengan mengalikan hasil kecepatan (m/s) dengan <strong>3.6</strong>, karena:</p>
            <ul>
                <li>1 meter = <span class="fraction"><span class="numerator">1</span><span class="denominator">1000</span></span> kilometer (m ke km)</li>
                <li>1 detik = <span class="fraction"><span class="numerator">1</span><span class="denominator">3600</span></span> jam (s ke jam)</li>
                <li>Sehingga, 1 m/s = 3.6 km/jam</li>
            </ul>
            <strong>Kecepatan dalam km/jam: </strong> ${kecepatan * 3.6} km/jam
        `;
    } catch (error) {
        alert("Terjadi kesalahan dalam menghitung persamaan. Pastikan format persamaan benar.");
    }
}

// Fungsi untuk menghitung turunan
function hitungTurunan(persamaan) {
    const suku = persamaan.split("+").map(s => s.trim());
    let turunan = [];

    suku.forEach((s) => {
        const regex = /([0-9]*)(\*t(?:\*\*([0-9]+))?)/;
        const match = s.match(regex);

        if (match) {
            const koefisien = parseFloat(match[1] || "1");
            const pangkat = parseFloat(match[3] || "1");

            if (pangkat > 1) {
                turunan.push(`${koefisien * pangkat}*t**${pangkat - 1}`);
            } else if (pangkat === 1) {
                turunan.push(`${koefisien}`);
            }
        } else if (!s.includes("t")) {
            // Suku tanpa t (konstanta) diabaikan dalam turunan
        } else {
            turunan.push(s);
        }
    });

    return turunan.join(" + ");
}
