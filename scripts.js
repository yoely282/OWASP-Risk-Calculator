document.getElementById('riskForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const threatAgent = parseInt(document.getElementById('threatAgent').value);
    const vulnerability = parseInt(document.getElementById('vulnerability').value);
    const technicalImpact = parseInt(document.getElementById('technicalImpact').value);
    const businessImpact = parseInt(document.getElementById('businessImpact').value);

    const likelihood = (threatAgent + vulnerability) / 2;
    const impact = (technicalImpact + businessImpact) / 2;

    const risk = likelihood * impact;

    const resultText = `Risk Score: ${risk.toFixed(2)}`;
    document.getElementById('result').innerText = resultText;

    // Save the assessment to local storage
    const assessments = JSON.parse(localStorage.getItem('assessments')) || [];
    assessments.push({
        threatAgent,
        vulnerability,
        technicalImpact,
        businessImpact,
        risk: risk.toFixed(2),
        date: new Date().toLocaleString()
    });
    localStorage.setItem('assessments', JSON.stringify(assessments));

    displayPastAssessments();
    updateChart(likelihood, impact);
});

function displayPastAssessments() {
    const assessments = JSON.parse(localStorage.getItem('assessments')) || [];
    const pastAssessmentsDiv = document.getElementById('pastAssessments');
    pastAssessmentsDiv.innerHTML = '<h3>Past Assessments</h3>';
    
    assessments.forEach(assessment => {
        const assessmentDiv = document.createElement('div');
        assessmentDiv.className = 'assessment';
        assessmentDiv.innerHTML = `
            <p><strong>Date:</strong> ${assessment.date}</p>
            <p><strong>Threat Agent:</strong> ${assessment.threatAgent}</p>
            <p><strong>Vulnerability:</strong> ${assessment.vulnerability}</p>
            <p><strong>Technical Impact:</strong> ${assessment.technicalImpact}</p>
            <p><strong>Business Impact:</strong> ${assessment.businessImpact}</p>
            <p><strong>Risk Score:</strong> ${assessment.risk}</p>
            <hr>
        `;
        pastAssessmentsDiv.appendChild(assessmentDiv);
    });
}

// Display past assessments on page load
document.addEventListener('DOMContentLoaded', displayPastAssessments);

// Toggle mobile menu
function toggleMenu() {
    const menu = document.querySelector(".menu-links");
    const icon = document.querySelector(".hamburger-icon");
    menu.classList.toggle("open");
    icon.classList.toggle("open");
}

// Chart.js setup
const ctx = document.getElementById('riskChart').getContext('2d');
let riskChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ['Likelihood', 'Impact'],
        datasets: [{
            label: 'Risk Factors',
            data: [0, 0],
            backgroundColor: ['rgba(75, 192, 192, 0.2)', 'rgba(255, 99, 132, 0.2)'],
            borderColor: ['rgba(75, 192, 192, 1)', 'rgba(255, 99, 132, 1)'],
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});

function updateChart(likelihood, impact) {
    riskChart.data.datasets[0].data = [likelihood, impact];
    riskChart.update();
}
