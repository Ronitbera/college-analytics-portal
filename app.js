// Mock REST endpoint dataset (or replaceable with a fetch() call to a backend API)
const INITIAL_RECORDS = [
  { id: "CS-101", name: "Ronit Bera", department: "Computer Science", semester: 7, cgpa: 7.71, status: "Placed" },
  { id: "CS-102", name: "Ananya Roy", department: "Computer Science", semester: 7, cgpa: 8.42, status: "Placed" },
  { id: "IT-201", name: "Debayan Sen", department: "Information Tech", semester: 6, cgpa: 7.20, status: "Seeking" },
  { id: "EC-301", name: "Subham Das", department: "Electronics", semester: 8, cgpa: 6.85, status: "Seeking" },
  { id: "CS-103", name: "Priya Ghosh", department: "Computer Science", semester: 7, cgpa: 8.90, status: "Placed" },
  { id: "IT-202", name: "Rohan Mukherjee", department: "Information Tech", semester: 8, cgpa: 7.60, status: "Placed" },
  { id: "EC-302", name: "Sayan Paul", department: "Electronics", semester: 6, cgpa: 7.45, status: "Seeking" },
  { id: "CS-104", name: "Riya Banerjee", department: "Computer Science", semester: 8, cgpa: 9.10, status: "Placed" }
];

let records = [...INITIAL_RECORDS];
let deptChartInstance = null;
let cgpaChartInstance = null;

// DOM Elements
const deptFilter = document.getElementById("departmentFilter");
const statusFilter = document.getElementById("statusFilter");
const searchInput = document.getElementById("searchInput");
const recordsBody = document.getElementById("recordsBody");
const recordCount = document.getElementById("recordCount");
const kpiTotal = document.getElementById("kpiTotal");
const kpiAvgCgpa = document.getElementById("kpiAvgCgpa");
const kpiPlacementRate = document.getElementById("kpiPlacementRate");
const refreshBtn = document.getElementById("refreshBtn");

// Filter Logic
function getFilteredRecords() {
  const dept = deptFilter.value;
  const status = statusFilter.value;
  const query = searchInput.value.trim().toLowerCase();

  return records.filter((student) => {
    const matchesDept = dept === "ALL" || student.department === dept;
    const matchesStatus = status === "ALL" || student.status === status;
    const matchesSearch = student.name.toLowerCase().includes(query) || student.id.toLowerCase().includes(query);
    return matchesDept && matchesStatus && matchesSearch;
  });
}

// Render Table
function renderTable(data) {
  recordsBody.innerHTML = "";
  recordCount.textContent = `Showing ${data.length} records`;

  if (data.length === 0) {
    recordsBody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--text-muted); padding: 24px;">No student records found matching filters.</td></tr>`;
    return;
  }

  data.forEach((student) => {
    const tr = document.createElement("tr");
    const badgeClass = student.status === "Placed" ? "badge-placed" : "badge-seeking";

    tr.innerHTML = `
      <td><strong>${student.id}</strong></td>
      <td>${student.name}</td>
      <td>${student.department}</td>
      <td>Sem ${student.semester}</td>
      <td>${student.cgpa.toFixed(2)}</td>
      <td><span class="badge ${badgeClass}">${student.status}</span></td>
    `;
    recordsBody.appendChild(tr);
  });
}

// Update KPI Metrics
function updateKPIs(data) {
  const total = data.length;
  kpiTotal.textContent = total;

  if (total === 0) {
    kpiAvgCgpa.textContent = "0.00";
    kpiPlacementRate.textContent = "0%";
    return;
  }

  const avgCgpa = data.reduce((acc, curr) => acc + curr.cgpa, 0) / total;
  kpiAvgCgpa.textContent = avgCgpa.toFixed(2);

  const placedCount = data.filter((s) => s.status === "Placed").length;
  const rate = Math.round((placedCount / total) * 100);
  kpiPlacementRate.textContent = `${rate}%`;
}

// Charts Initialization & Updates
function updateCharts(data) {
  // Department Counts
  const deptCounts = {};
  data.forEach((s) => {
    deptCounts[s.department] = (deptCounts[s.department] || 0) + 1;
  });

  const deptLabels = Object.keys(deptCounts);
  const deptData = Object.values(deptCounts);

  // CGPA Distribution ranges: <7.0, 7.0-8.0, 8.0-9.0, >9.0
  const cgpaBuckets = { "< 7.0": 0, "7.0 - 8.0": 0, "8.0 - 9.0": 0, "9.0+": 0 };
  data.forEach((s) => {
    if (s.cgpa < 7.0) cgpaBuckets["< 7.0"]++;
    else if (s.cgpa < 8.0) cgpaBuckets["7.0 - 8.0"]++;
    else if (s.cgpa < 9.0) cgpaBuckets["8.0 - 9.0"]++;
    else cgpaBuckets["9.0+"]++;
  });

  // Department Bar Chart
  if (deptChartInstance) deptChartInstance.destroy();
  const ctxDept = document.getElementById("deptChart").getContext("2d");
  deptChartInstance = new Chart(ctxDept, {
    type: "bar",
    data: {
      labels: deptLabels,
      datasets: [
        {
          label: "Enrolled",
          data: deptData,
          backgroundColor: "#182b49",
          borderRadius: 4
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        y: { beginAtZero: true, ticks: { stepSize: 1 } }
      }
    }
  });

  // CGPA Doughnut Chart
  if (cgpaChartInstance) cgpaChartInstance.destroy();
  const ctxCgpa = document.getElementById("cgpaChart").getContext("2d");
  cgpaChartInstance = new Chart(ctxCgpa, {
    type: "doughnut",
    data: {
      labels: Object.keys(cgpaBuckets),
      datasets: [
        {
          data: Object.values(cgpaBuckets),
          backgroundColor: ["#94a3b8", "#38bdf8", "#2563eb", "#16a34a"]
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: "bottom" }
      }
    }
  });
}

// Master Render
function refreshView() {
  const filtered = getFilteredRecords();
  renderTable(filtered);
  updateKPIs(filtered);
  updateCharts(filtered);
}

// Event Listeners
deptFilter.addEventListener("change", refreshView);
statusFilter.addEventListener("change", refreshView);
searchInput.addEventListener("input", refreshView);
refreshBtn.addEventListener("click", () => {
  deptFilter.value = "ALL";
  statusFilter.value = "ALL";
  searchInput.value = "";
  refreshView();
});

// Initial boot
refreshView();