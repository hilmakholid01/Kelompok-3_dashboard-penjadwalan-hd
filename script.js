const patients = [
  { nama: "Ahmad Fauzan", rm: "RM001", jam: "07.00–11.00", sesi: "Pagi", mesin: "HD-01", status: "Terjadwal" },
  { nama: "Budi Santoso", rm: "RM002", jam: "07.00–11.00", sesi: "Pagi", mesin: "HD-02", status: "Selesai" },
  { nama: "Citra Lestari", rm: "RM003", jam: "07.00–11.00", sesi: "Pagi", mesin: "HD-03", status: "Sedang Berlangsung" },
  { nama: "Deni Pratama", rm: "RM004", jam: "07.00–11.00", sesi: "Pagi", mesin: "HD-04", status: "Terjadwal" },
  { nama: "Eka Wulandari", rm: "RM005", jam: "07.00–11.00", sesi: "Pagi", mesin: "HD-05", status: "Terjadwal" },
  { nama: "Fajar Hidayat", rm: "RM006", jam: "07.00–11.00", sesi: "Pagi", mesin: "HD-06", status: "Terjadwal" },
  { nama: "Gita Permata", rm: "RM007", jam: "07.00–11.00", sesi: "Pagi", mesin: "HD-07", status: "Terjadwal" },
  { nama: "Hendra Wijaya", rm: "RM008", jam: "07.00–11.00", sesi: "Pagi", mesin: "HD-08", status: "Dibatalkan" },

  { nama: "Susanto", rm: "RM009", jam: "13.00–17.00", sesi: "Siang", mesin: "HD-01", status: "Terjadwal" },
  { nama: "Joko Susilo", rm: "RM010", jam: "13.00–17.00", sesi: "Siang", mesin: "HD-02", status: "Terjadwal" },
  { nama: "Kartika Dewi", rm: "RM011", jam: "13.00–17.00", sesi: "Siang", mesin: "HD-03", status: "Terjadwal" },
  { nama: "Lukman Hakim", rm: "RM012", jam: "13.00–17.00", sesi: "Siang", mesin: "HD-04", status: "Sedang Berlangsung" },
  { nama: "Maya Putri", rm: "RM013", jam: "13.00–17.00", sesi: "Siang", mesin: "HD-05", status: "Terjadwal" },
  { nama: "Nanda Saputra", rm: "RM014", jam: "13.00–17.00", sesi: "Siang", mesin: "HD-06", status: "Terjadwal" },
  { nama: "Oki Ramadhan", rm: "RM015", jam: "13.00–17.00", sesi: "Siang", mesin: "HD-07", status: "Selesai" },
  { nama: "Putri Amelia", rm: "RM016", jam: "13.00–17.00", sesi: "Siang", mesin: "HD-08", status: "Terjadwal" },

  { nama: "Rian Kurniawan", rm: "RM017", jam: "07.00–11.00", sesi: "Pagi", mesin: "HD-02", status: "Dibatalkan" },
  { nama: "Salsa Maharani", rm: "RM018", jam: "13.00–17.00", sesi: "Siang", mesin: "HD-04", status: "Dibatalkan" },
  { nama: "Taufik Hidayat", rm: "RM019", jam: "07.00–11.00", sesi: "Pagi", mesin: "HD-01", status: "Dibatalkan" },
  { nama: "Umi Kalsum", rm: "RM020", jam: "13.00–17.00", sesi: "Siang", mesin: "HD-03", status: "Dibatalkan" }
];

const machines = ["HD-01","HD-02","HD-03","HD-04","HD-05","HD-06","HD-07","HD-08"];

const scheduleBody = document.getElementById("scheduleBody");
const sessionFilter = document.getElementById("sessionFilter");
const statusFilter = document.getElementById("statusFilter");
const searchInput = document.getElementById("searchInput");
const shownCount = document.getElementById("shownCount");
const dataCount = document.getElementById("dataCount");

function statusClass(status) {
  if (status === "Selesai") return "badge-green";
  if (status === "Sedang Berlangsung") return "badge-blue";
  if (status === "Dibatalkan") return "badge-red";
  return "badge-yellow";
}

function renderTable() {
  const search = searchInput.value.toLowerCase().trim();
  const session = sessionFilter.value;
  const status = statusFilter.value;

  const filtered = patients.filter(p => {
    const matchesSearch = p.nama.toLowerCase().includes(search) || p.rm.toLowerCase().includes(search);
    const matchesSession = session === "Semua" || p.sesi === session;
    const matchesStatus = status === "Semua" || p.status === status;
    return matchesSearch && matchesSession && matchesStatus;
  });

  scheduleBody.innerHTML = filtered.map((p, i) => `
    <tr>
      <td>${i + 1}</td>
      <td><div class="patient-name">${p.nama}</div></td>
      <td><span class="rm">${p.rm}</span></td>
      <td>${p.jam}</td>
      <td>${p.sesi}</td>
      <td><strong>${p.mesin}</strong></td>
      <td><span class="badge ${statusClass(p.status)}">${p.status}</span></td>
    </tr>
  `).join("");

  if (!filtered.length) {
    scheduleBody.innerHTML = `<tr><td colspan="7" style="text-align:center;color:#6b7785;padding:30px;">Data tidak ditemukan.</td></tr>`;
  }

  shownCount.textContent = filtered.length;
  dataCount.textContent = patients.length;
}

function updateSummary() {
  document.getElementById("totalPatients").textContent = patients.length;
  document.getElementById("morningPatients").textContent = patients.filter(p => p.sesi === "Pagi").length;
  document.getElementById("afternoonPatients").textContent = patients.filter(p => p.sesi === "Siang").length;

  const activePatients = patients.filter(p => p.status !== "Dibatalkan");
  const used = new Set(activePatients.map(p => p.mesin));
  document.getElementById("usedMachines").textContent = used.size;
}

function renderMachines() {
  const grid = document.getElementById("machineGrid");

  grid.innerHTML = machines.map(machine => {
    const morning = patients.filter(p => p.mesin === machine && p.sesi === "Pagi" && p.status !== "Dibatalkan").length;
    const afternoon = patients.filter(p => p.mesin === machine && p.sesi === "Siang" && p.status !== "Dibatalkan").length;
    const occupied = morning > 0 || afternoon > 0;
    const percentage = occupied ? 100 : 0;

    return `
      <div class="machine ${occupied ? "busy" : "available"}">
        <div class="machine-head">
          <strong>${machine}</strong>
          <span class="machine-status">${occupied ? "Terpakai" : "Tersedia"}</span>
        </div>
        <small>Pagi: ${morning} pasien · Siang: ${afternoon} pasien</small>
        <div class="machine-bar" style="margin-top:9px;"><span style="width:${percentage}%"></span></div>
      </div>
    `;
  }).join("");
}

function checkAlerts() {
  const panel = document.getElementById("alertPanel");
  const title = document.getElementById("alertTitle");
  const text = document.getElementById("alertText");

  const conflicts = [];
  for (const sesi of ["Pagi", "Siang"]) {
    machines.forEach(machine => {
      const count = patients.filter(p => p.sesi === sesi && p.mesin === machine && p.status !== "Dibatalkan").length;
      if (count > 1) conflicts.push(`${machine} pada sesi ${sesi}`);
    });
  }

  const cancelled = patients.filter(p => p.status === "Dibatalkan").length;
  const activeBySession = {
    Pagi: new Set(patients.filter(p => p.sesi === "Pagi" && p.status !== "Dibatalkan").map(p => p.mesin)).size,
    Siang: new Set(patients.filter(p => p.sesi === "Siang" && p.status !== "Dibatalkan").map(p => p.mesin)).size
  };

  panel.className = "alert-panel";

  if (conflicts.length) {
    panel.classList.add("danger");
    title.textContent = "Peringatan Konflik Jadwal";
    text.textContent = `Terdapat penggunaan mesin ganda: ${conflicts.join(", ")}. Periksa kembali penempatan pasien.`;
  } else if (cancelled > 0 && (activeBySession.Pagi === machines.length || activeBySession.Siang === machines.length)) {
    title.textContent = "Peringatan Kapasitas";
    text.textContent = `Salah satu sesi menggunakan seluruh kapasitas mesin. Terdapat ${cancelled} jadwal dibatalkan.`;
  } else {
    panel.classList.add("ok");
    title.textContent = "Jadwal Terkendali";
    text.textContent = "Tidak ditemukan konflik penggunaan mesin pada sesi yang sama. Kapasitas masih dapat dipantau melalui tabel.";
  }
}

function updateClock() {
  const now = new Date();
  const date = now.toLocaleDateString("id-ID", {
    weekday: "long", day: "2-digit", month: "long", year: "numeric"
  });
  const time = now.toLocaleTimeString("id-ID", {
    hour: "2-digit", minute: "2-digit", second: "2-digit"
  });
  document.getElementById("todayLabel").textContent = date;
  document.getElementById("clock").textContent = time + " WIB";
}

function resetFilters() {
  searchInput.value = "";
  sessionFilter.value = "Semua";
  statusFilter.value = "Semua";
  renderTable();
}

[searchInput, sessionFilter, statusFilter].forEach(el => {
  el.addEventListener("input", renderTable);
  el.addEventListener("change", renderTable);
});

document.getElementById("resetBtn").addEventListener("click", resetFilters);

updateSummary();
renderTable();
renderMachines();
checkAlerts();
updateClock();
setInterval(updateClock, 1000);
