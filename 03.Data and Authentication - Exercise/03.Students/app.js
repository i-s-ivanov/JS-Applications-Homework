function main() {
    loadStudents()
    document.getElementById('form').addEventListener('submit', createStudent);

}
main()

async function loadStudents() {
    const url = 'http://localhost:3030/jsonstore/collections/students'
    const response = await fetch(url);
    const data = await response.json();

    document.querySelector('tbody').innerHTML = '';
    Object.values(data).forEach(s => {
        const result = document.createElement('tr')
        result.innerHTML = `<tr>
                            <td>${s.firstName}</td>
                            <td>${s.lastName}</td>
                            <td>${s.facultyNumber}</td>
                            <td>${s.grade}</td>
                        </tr>`
        document.querySelector('tbody').appendChild(result)
    })
}

async function createStudent(e) {
    e.preventDefault()
    const formData = new FormData(e.target);
    const student = {
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        facultyNumber: formData.get('facultyNumber'),
        grade: formData.get('grade')
    }
    if (
        student.firstName === '' || student.lastName === '' || student.grade === '' || student.facultyNumber === '') {
        alert('You must fill all fields')
    } else {
        const url = 'http://localhost:3030/jsonstore/collections/students';
        const response = await fetch(url, {
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(student)
        })

        e.target.reset()
        loadStudents()
    }


}

