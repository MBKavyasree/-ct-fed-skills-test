const API_URL = "https://fedskillstest.coalitiontechnologies.workers.dev";
const API_USERNAME = "coalition";
const API_PASSWORD = "skills-test";

let bloodPressureChart;

function showError(message) {
  const box = document.getElementById("errorBox");
  box.textContent = message;
  box.hidden = false;
}

function authHeader() {
  const token = btoa(`${API_USERNAME}:${API_PASSWORD}`);
  return `Basic ${token}`;
}

async function getPatientData() {
  const response = await fetch(API_URL, {
    headers: {
      Authorization: authHeader()
    }
  });

  if (!response.ok) {
    throw new Error(`API request failed (${response.status})`);
  }

  const allPatients = await response.json();
  return allPatients.find((p) => p.name === "Jessica Taylor");
}

function createPatientList(patient) {
  const list = document.getElementById("patientsList");
  list.innerHTML = `
    <article class="patient-row" aria-label="Selected patient">
      <img src="${patient.profile_picture}" alt="${patient.name}" />
      <div>
        <p class="patient-name">${patient.name}</p>
        <p class="patient-desc">${patient.gender}, ${patient.age}</p>
      </div>
    </article>
  `;
}

function createProfile(patient) {
  document.getElementById("profileImage").src = patient.profile_picture;
  document.getElementById("profileImage").alt = patient.name;
  document.getElementById("profileName").textContent = patient.name;

  const rows = [
    ["Date Of Birth", patient.date_of_birth],
    ["Gender", patient.gender],
    ["Contact Info", patient.phone_number],
    ["Emergency Contacts", patient.emergency_contact],
    ["Insurance Provider", patient.insurance_type]
  ];

  document.getElementById("profileMeta").innerHTML = rows
    .map(
      ([label, value]) => `
      <div class="meta-row">
        <dt>${label}</dt>
        <dd>${value}</dd>
      </div>
    `
    )
    .join("");
}

function renderMetrics(latestHistory) {
  const cardData = [
    {
      className: "respiratory",
      title: "Respiratory Rate",
      value: `${latestHistory.respiratory_rate.value} bpm`,
      state: latestHistory.respiratory_rate.levels
    },
    {
      className: "temperature",
      title: "Temperature",
      value: `${latestHistory.temperature.value}\u00b0F`,
      state: latestHistory.temperature.levels
    },
    {
      className: "heart",
      title: "Heart Rate",
      value: `${latestHistory.heart_rate.value} bpm`,
      state: latestHistory.heart_rate.levels
    }
  ];

  document.getElementById("metricsCards").innerHTML = cardData
    .map(
      (card) => `
      <article class="metric-card ${card.className}">
        <h3>${card.title}</h3>
        <p class="value">${card.value}</p>
        <p class="state">${card.state}</p>
      </article>
    `
    )
    .join("");
}

function renderDiagnosticList(diagnosticList) {
  const body = document.getElementById("diagnosticTableBody");
  body.innerHTML = diagnosticList
    .map(
      (item) => `
      <tr>
        <td>${item.name}</td>
        <td>${item.description}</td>
        <td>${item.status}</td>
      </tr>
    `
    )
    .join("");
}

function renderLabs(labs) {
  document.getElementById("labResultsList").innerHTML = labs
    .map((test) => `<li>${test}</li>`)
    .join("");
}

function renderBpChart(history) {
  const recent = history.slice(0, 6).reverse();
  const labels = recent.map((entry) => `${entry.month.substring(0, 3)}, ${entry.year}`);
  const systolic = recent.map((entry) => entry.blood_pressure.systolic.value);
  const diastolic = recent.map((entry) => entry.blood_pressure.diastolic.value);

  if (bloodPressureChart) {
    bloodPressureChart.destroy();
  }

  bloodPressureChart = new Chart(document.getElementById("bpChart"), {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: "Systolic",
          data: systolic,
          borderColor: "#E66FD2",
          backgroundColor: "rgba(230, 111, 210, 0.18)",
          pointRadius: 4,
          borderWidth: 2,
          tension: 0.35,
          fill: false
        },
        {
          label: "Diastolic",
          data: diastolic,
          borderColor: "#7E6CF4",
          backgroundColor: "rgba(126, 108, 244, 0.16)",
          pointRadius: 4,
          borderWidth: 2,
          tension: 0.35,
          fill: false
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "bottom",
          labels: {
            usePointStyle: true,
            boxWidth: 10,
            boxHeight: 10,
            padding: 20,
            font: {
              family: "Manrope"
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: false,
          grid: {
            color: "#edf2f7"
          },
          ticks: {
            stepSize: 20
          }
        },
        x: {
          grid: {
            display: false
          }
        }
      }
    }
  });
}

async function init() {
  try {
    const patient = await getPatientData();

    if (!patient) {
      throw new Error("Jessica Taylor record was not found in the API response.");
    }

    createPatientList(patient);
    createProfile(patient);
    renderBpChart(patient.diagnosis_history);
    renderMetrics(patient.diagnosis_history[0]);
    renderDiagnosticList(patient.diagnostic_list);
    renderLabs(patient.lab_results);
  } catch (error) {
    showError(`Unable to load dashboard data. ${error.message}`);
  }
}

init();
