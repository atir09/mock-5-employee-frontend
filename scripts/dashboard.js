const URL = "https://mock-4-employee-backend.onrender.com"
let token=JSON.parse(localStorage.getItem("token"))

if(!token){
    alert("Plz Log in")
    window.location="../index.html"
}

let currentPage = 1;
let totalPages = 1;

Render(`${URL}/employees?page=${currentPage}`)
function Render(url) {
    fetch(url)
        .then(async (res) => {
            try {
                let data = await res.json()
                return { data, status: res.status }
            } catch (error) {
                console.log(error.message)
                alert(error)
            }
        })
        .then((res) => {
            console.log(res)
            if (res.status == 200) {
                RenderTable(res.data)
                currentPage=res.data.page
                totalPages=res.data.totalPages
                displayPagination();
            } else {
                alert(res.data.msg)
            }
        })
}

function RenderTable(data) {
    let list = CreateList(data.employees, data.page)
    document.getElementById("data-cont").innerHTML = list.join(" ")
}

function CreateList(employees, page) {
    let count = ((page - 1) * 5) + 1
    let list = employees.map((el) => {
        return `
    <tr>
        <td>${count++}</td>
        <td>${el.firstName}</td>
        <td>${el.lastName}</td>
        <td>${el.email}</td>
        <td>${el.department}</td>
        <td>RS. ${el.salary}</td>
        <td> <button class="Edit-btn" onclick="Edit('${el._id}','${el.firstName}','${el.lastName}','${el.email}','${el.department}','${el.salary}')"> Edit </button><button class="Del-btn" onclick="Delete('${el._id}')" >Delete</button></td>
    </tr>
        `
    })

    return list
}


// .......................Add Employee.............................
const addEmployeeBtn = document.getElementById('add-employee-btn');
const addEmployeeForm = document.getElementById('add-employee-form');
const employeeForm = document.getElementById('employee-form');



function showAddEmployeeForm() {
    addEmployeeForm.style.display = 'block';
    addEmployeeBtn.style.display = 'none';
}

function hideAddEmployeeForm() {
    addEmployeeForm.style.display = 'none';
    addEmployeeBtn.style.display = 'block';
}

function addEmployee(event) {
    event.preventDefault();

    const firstName = document.getElementById('first-name').value;
    const lastName = document.getElementById('last-name').value;
    const email = document.getElementById('email').value;
    const department = document.getElementById('department').value;
    const salary = document.getElementById('salary').value;

    
 

    fetch(`${URL}/employees`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ firstName, lastName, email, department, salary }),
    })
        .then(async (res) => {
            try {
                let data = await res.json()
                return { data, status: res.status }
            } catch (error) {
                console.log(error)
                alert(error)
            }

        })
        .then((res) => {
            if (res.status == 201) {
                alert(res.data.msg)
                hideAddEmployeeForm();
                employeeForm.reset();
                Render(`${URL}/employees`)
            }else{
                alert(res.data.msg)
                employeeForm.reset();
            }

        })
        .catch((error) => console.error(error));
}

addEmployeeBtn.addEventListener('click', showAddEmployeeForm);
employeeForm.addEventListener('submit', addEmployee);




// .......................Edit Employee.............................
const editEmployeediv = document.getElementById('edit-employee');
const editemployeeForm = document.getElementById('edit-employee-form');



function Edit(id,firstName,lastName,email,department,salary) {
    editEmployeediv.style.display = 'block';
    document.getElementById('e-first-name').value=firstName;
    document.getElementById('e-last-name').value=lastName;
    document.getElementById('e-email').value=email;
    document.getElementById('e-department').value=department;
    document.getElementById('e-salary').value=salary;
    document.getElementById("edit-submit").setAttribute("data-id",id)
}

function hideAddEmployeeForm() {
    editEmployeediv.style.display = 'none';
}

function editEmployee(event) {
    event.preventDefault();

    const firstName = document.getElementById('e-first-name').value;
    const lastName = document.getElementById('e-last-name').value;
    const email = document.getElementById('e-email').value;
    const department = document.getElementById('e-department').value;
    const salary = document.getElementById('e-salary').value;
    const id=document.getElementById("edit-submit").dataset.id

    fetch(`${URL}/employees/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ firstName, lastName, email, department, salary }),
    })
        .then(async (res) => {
            try {
                let data = await res.json()
                return { data, status: res.status }
            } catch (error) {
                console.log(error)
                alert(error)
            }

        })
        .then((res) => {
            if (res.status == 201) {
                alert(res.data.msg)
                hideAddEmployeeForm();
                employeeForm.reset();
                Render(`${URL}/employees`)
            }else{
                alert(res.data.msg)
                employeeForm.reset();
            }

        })
        .catch((error) => console.error(error));
}

editemployeeForm.addEventListener('submit', editEmployee);



// ......................Delete A Employee.................

function Delete(id){
    let res=window.confirm("Do You Really Want to Delete The User?")
    if(res){
        fetch(`${URL}/employees/${id}`, {
            method: 'DELETE'
        })
            .then(async (res) => {
                try {
                    let data = await res.json()
                    return { data, status: res.status }
                } catch (error) {
                    console.log(error)
                    alert(error)
                }
    
            })
            .then((res) => {
                if (res.status == 201) {
                    alert(res.data.msg)
                    Render(`${URL}/employees`)
                }else{
                    alert(res.data.msg)
                }
    
            })
            .catch((error) => console.error(error));
    }
}

// ...............Pagination .................................

const pagination = document.getElementById('pagination');

function displayPagination() {
    pagination.innerHTML = '';
  
    for (let i = 1; i <= totalPages; i++) {
      const pageLink = document.createElement('button');
      pageLink.classList.add('page-link');
      pageLink.innerText = i;
      if (i === currentPage) {
        pageLink.classList.add('active');
      }
      pageLink.addEventListener('click', () => {
        Render(`${URL}/employees?page=${i}`)
      });
  
      pagination.appendChild(pageLink);
    }
  }

//   ...........Search,Filter And Sort .......................

const filterForm = document.getElementById('filter-form');
const sortSelect = document.getElementById('sort-select');
const searchInput = document.getElementById('filter-first-name');

function filterEmployees() {

    const department = document.getElementById("filter-department").value;
  
    const params = new URLSearchParams();
    params.append('department', department);
    console.log(typeof(department))
  
    Render(`${URL}/employees/filter?${params.toString()}`)
      
  }
  
  function sortEmployees() {
    const sortBy = sortSelect.value;
  
    const params = new URLSearchParams();
    params.append('sortBy', sortBy);
  
    Render(`${URL}/employees/sort?${params.toString()}`)
      
  }
  
  function searchEmployees() {

  
    const firstName = searchInput.value.toLowerCase();
  
    const params = new URLSearchParams();
    params.append('firstName', firstName);
  
    Render(`${URL}/employees/search?${params.toString()}`)

  }
  
  

// ....................LogOut......................

function LogOut(){
    localStorage.clear()
    window.location="../index.html"
}