document.addEventListener('DOMContentLoaded', () => {
    fetchStudents();
});

function fetchStudents() {
    fetch('/api/students')
        .then(response => response.json())
        .then(data => {
            const studentsBody = document.getElementById('studentsBody');
            studentsBody.innerHTML = '';

            data.forEach(student => {
                const row = document.createElement('tr');

                row.innerHTML = `
                    <td>${student.id}</td>
                    <td>${student.firstName}</td>
                    <td>${student.lastName}</td>
                    <td>
                        <select>
                            <option value="Present">Present</option>
                            <option value="Absent">Absent</option>
                        </select>
                    </td>
                `;

                studentsBody.appendChild(row);
            });
        })
        .catch(error => console.error('Error fetching students:', error));
}

function saveAttendance() {
    const rows = document.querySelectorAll('#studentsBody tr');
    const attendanceData = [];

    rows.forEach(row => {
        const studentId = row.cells[0].textContent;
        const status = row.cells[3].querySelector('select').value;
        attendanceData.push({ studentId, status });
    });

    fetch('/api/attendance', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ attendance: attendanceData })
    })
    .then(response => {
        if (response.ok) {
            alert('Attendance saved successfully!');
        } else {
            alert('Error saving attendance.');
        }
    })
    .catch(error => console.error('Error saving attendance:', error));
}
