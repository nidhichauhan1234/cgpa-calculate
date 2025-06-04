// ---------------- Subject-Based CGPA Calculator ----------------

function addRow() {
    const tbody = document.getElementById('subjects');
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>Subject ${tbody.children.length + 1}</td>
        <td><input type="number" class="marks" min="0" max="100"></td>
        <td><input type="number" class="credits" min="1" max="5"></td>
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

        const grade = calculateGrade(marks);
        const gradePoint = calculateGradePoint(grade);

        grades[index].textContent = grade;
        gradePoints[index].textContent = gradePoint;

        totalCredits += credits;
        weightedPoints += gradePoint * credits;
    });

    const cgpa = totalCredits ? (weightedPoints / totalCredits).toFixed(2) : 0.00;
    document.getElementById('result').textContent = `Your Semester CGPA is: ${cgpa}`;
}

// ---------------- Cumulative CGPA Calculator ----------------

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
        <td><input type="number" class="sem-credits" min="1" max="30"></td>
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

        if (
            isNaN(gpa) || isNaN(credit) ||
            gpa < 1 || gpa > 10 ||
            credit <= 0
        ) return;

        totalCredits += credit;
        totalWeightedGPA += gpa * credit;
    });
const cumulative = totalCredits ? (totalWeightedGPA / totalCredits) : 0.00;

    document.getElementById('cumulative-result').textContent = `Your Cumulative CGPA is: ${cumulative}`;
}
