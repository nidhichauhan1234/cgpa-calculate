
function addRow() {
    const tbody = document.getElementById('subjects');
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>Subject ${tbody.children.length + 1}</td>
        <td><input type="number" class="marks" min="0" max="100"></td>
        <td><input type="number" class="credits" min="18" max="23"></td>
        <td class="grade-point"></td>
        <td class="grade"></td>
    `;
    tbody.appendChild(row);
}


function removeLastRow() {
    const tbody = document.getElementById('subjects');
    if (tbody.children.length > 1) {
        tbody.removeChild(tbody.lastChild);
    } else {
        alert('At least one subject is required.');
    }
    updateSubjectNumbers();
}


function updateSubjectNumbers() {
    const rows = document.querySelectorAll('#subjects tr');
    rows.forEach((row, index) => {
        row.cells[0].textContent = `Subject ${index + 1}`;
    });
}


function calculateGrade(marks) {
    if (marks >= 93) return 'A+';
    if (marks >= 85) return 'A';
    if (marks >= 77) return 'B+';
    if (marks >= 69) return 'B';
    if (marks >= 61) return 'C+';
    if (marks >= 53) return 'C';
    if (marks >= 45) return 'D';
    return 'F';
}


function calculateGradePoint(grade) {
    switch (grade) {
        case 'A+': return 10;
        case 'A': return 9;
        case 'B+': return 8;
        case 'B': return 7;
        case 'C+': return 6;
        case 'C': return 5;
        case 'D': return 4;
        case 'F': return 0;
        default: return 0;
    }
}


function calculateCGPA() {
    const marksInputs = document.querySelectorAll('.marks');
    const creditsInputs = document.querySelectorAll('.credits');
    const gradePoints = document.querySelectorAll('.grade-point');
    const grades = document.querySelectorAll('.grade');

    let totalCredits = 0;
    let weightedPoints = 0;

    marksInputs.forEach((input, index) => {
        const marks = parseFloat(input.value);
        const credits = parseFloat(creditsInputs[index].value);

        if (isNaN(marks) || isNaN(credits)) return;
        if (marks < 0 || marks > 100) {
            alert(`Invalid marks in Subject ${index + 1}. Enter between 0–100.`);
            return;
        }
        if (credits < 18 || credits > 23) {
            alert(`Invalid credits in Subject ${index + 1}. Enter between 18–23.`);
            return;
        }

        const grade = calculateGrade(marks);
        const gradePoint = calculateGradePoint(grade);

        grades[index].textContent = grade;
        gradePoints[index].textContent = gradePoint;

        totalCredits += credits;
        weightedPoints += gradePoint * credits;
    });

    const gpa = totalCredits ? (weightedPoints / totalCredits).toFixed(2) : 0.00;
    document.getElementById('result').textContent = `Your Semester GPA is: ${gpa}`;
}

function addSemester() {
    const tbody = document.getElementById('semesters');
    const count = tbody.children.length;

    if (count >= 8) {
        alert("You can only add up to 8 semesters.");
        return;
    }

    const row = document.createElement('tr');
    row.innerHTML = `
        <td>Semester ${count + 1}</td>
        <td><input type="number" class="sem-gpa" min="1" max="10" step="0.01"></td>
        <td><input type="number" class="sem-credits" min="18" max="23"></td>
    `;
    tbody.appendChild(row);
}


function removeSemester() {
    const tbody = document.getElementById('semesters');
    if (tbody.children.length > 1) {
        tbody.removeChild(tbody.lastChild);
    } else {
        alert('At least one semester is required.');
    }
    updateSemesterLabels();
}

function updateSemesterLabels() {
    const rows = document.querySelectorAll('#semesters tr');
    rows.forEach((row, index) => {
        row.cells[0].textContent = `Semester ${index + 1}`;
    });
}

function calculateCumulativeCGPA() {
    const gpas = document.querySelectorAll('.sem-gpa');
    const credits = document.querySelectorAll('.sem-credits');

    let totalCredits = 0;
    let totalWeightedGPA = 0;

    gpas.forEach((input, index) => {
        const gpa = parseFloat(input.value);
        const credit = parseFloat(credits[index].value);

        if (isNaN(gpa) || isNaN(credit)) return;
        if (gpa < 0 || gpa > 10) {
            alert(`Invalid GPA in Semester ${index + 1}. Enter between 0–10.`);
            return;
        }
        if (credit < 18 || credit > 23) {
            alert(`Invalid credits in Semester ${index + 1}. Enter between 18–23.`);
            return;
        }

        totalCredits += credit;
        totalWeightedGPA += gpa * credit;
    });
    const cgpa = totalCredits ? (totalWeightedGPA / totalCredits) : 0.00;
    document.getElementById('cumulative-result').textContent = `Your Semester CGPA is: ${cgpa}`;
}
// dynamic GPA input fields
document.getElementById('completedSems').addEventListener('input', function() {
    const count = parseInt(this.value) || 0;
    const container = document.getElementById('gpaInputs');
    container.innerHTML = "";
    for (let i = 1; i <= count; i++) {
        container.innerHTML += `
            <div>
              <label>Semester ${i} GPA: <input type="number" step="0.01" class="gpa"></label>
              <label>Credits: <input type="number" class="semCredits"></label>
            </div>
        `;
    }
});

function predictCgpa() {
    const totalSems = parseInt(document.getElementById('totalSems').value);
    const completedSems = parseInt(document.getElementById('completedSems').value);
    const targetCgpa = parseFloat(document.getElementById('targetCgpa').value);

    const gpaInputs = document.querySelectorAll('.gpa');
    const creditInputs = document.querySelectorAll('.semCredits');

    let currentPoints = 0, currentCredits = 0;
    gpaInputs.forEach((input, idx) => {
        const gpa = parseFloat(input.value);
        const credits = parseFloat(creditInputs[idx].value);
        if (!isNaN(gpa) && !isNaN(credits)) {
            currentPoints += gpa * credits;
            currentCredits += credits;
        }
    });

    const avgCredits = currentCredits / completedSems; // assume future sem credits same avg
    const totalCredits = avgCredits * totalSems;
    const requiredTotalPoints = targetCgpa * totalCredits;
    const remainingPoints = requiredTotalPoints - currentPoints;
    const remainingCredits = totalCredits - currentCredits;

    let result = "";
    if (remainingCredits <= 0) {
        result = "All semesters completed!";
    } else {
        const requiredGpa = remainingPoints / remainingCredits;
        if (requiredGpa > 10) {
            result = `⚠️ Target CGPA not achievable.`;
        } else if (requiredGpa < 0) {
            result = `You already crossed the target CGPA 🎉`;
        } else {
            result = `To achieve CGPA ${targetCgpa}, you need an average GPA of <b>${requiredGpa}</b> in remaining semesters.`;
        }
    }

    document.getElementById('predictResult').innerHTML = result;
}

