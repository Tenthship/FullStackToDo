const inputTask = document.querySelector("#inputTask")
const inputButton = document.querySelector("#inputButton")
const tasks = document.querySelector("#tasks")
const URL = "http://localhost:5050"

window.addEventListener("DOMContentLoaded", () => {
    displayTasks()
})

inputButton.addEventListener("click", () => {
    fetch(`${URL}/todo`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ task: inputTask.value})
    })
    .then(res => res.json())
    .then(() => {
        // Fetch just to get the new task's ID
        return fetch(`${URL}/todo`)
    })
    .then(res => res.json())
    .then(todos => {
        const currTask = todos.at(-1)
        const newTaskDiv = document.createElement('div')
        newTaskDiv.className = 'task'
        newTaskDiv.id = currTask.id
        newTaskDiv.innerHTML = `
            <p>${currTask.task}</p>
            <p>${currTask.date}</p>
            <p>${currTask.completed}</p>
            <button onclick="deleteTask(${currTask.id})">Delete</button>
            <button onclick="editTask(${currTask.id})">Edit</button>
        `
        tasks.appendChild(newTaskDiv)
        inputTask.value = ""
    })
})

function displayTasks() {
    fetch(`${URL}/todo`)
        .then(res => res.json())
        .then(todos => {
        todos.forEach(todo => {
            tasks.innerHTML += `
                <div class="task" id=${todo.id}>
                    <p>${todo.task}</p>
                    <p>${todo.date}</p>
                    <p>${todo.completed}</p>
                    <button onclick="deleteTask(${todo.id})">Delete</button>
                    <button onclick="editTask(${todo.id})">Edit</button>
                </div>
            `
        })
    })
}

function deleteTask(id){
    fetch(`${URL}/todo/:${id}`, {
        method: "DELETE",
    })
    .then(() => {
        const taskElement = document.getElementById(id);
        taskElement.remove();
    })
}

function editTask(id) {
    fetch(`${URL}/todo/${id}`)
        .then(res => res.json())
        .then(todo => {
            console.log(todo.id)
            const elements = document.querySelectorAll('.task')
            elements.forEach(elem => {
                if (elem.id == id) {
                    const firstTag = elem.querySelector('p')
                    firstTag.contentEditable = true
                    firstTag.focus()
                    firstTag.onblur = () => editedTask(id)
                    document.addEventListener("keydown", (e) => {
                        if (e.key == "Enter") {
                            editedTask(id)
                        }
                    })
                }
            })
        })
    console.log("Pooping")
}

function editedTask(id) {
    const elements = document.querySelectorAll('.task')
        elements.forEach(elem => {
        if (elem.id == id) {
            const firstTag = elem.querySelector('p')
            firstTag.contentEditable = false

            fetch(`${URL}/todo/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ task: firstTag.textContent})
            }).then(() => {
                console.log("Task updated")
            })
        }
    })
}



//contenteditable="true"