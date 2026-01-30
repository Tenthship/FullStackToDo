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
    .then(() => {
        inputTask.value = ""
        displayLastTask()
    })
})

function displayLastTask() {
    fetch(`${URL}/todo`)
        .then(res => res.json())
        .then(todos => {
            console.log(todos.at(-1))
            currTask = todos.at(-1)
            tasks.innerHTML += `
                <div class="task">
                    <p>${currTask.task}</p>
                    <p>${currTask.date}</p>
                    <p>${currTask.completed}</p>
                    <button onclick="deleteTask(${currTask.id})">Delete</button>
                </div>
            `   

    })

}

function displayTasks() {
    fetch(`${URL}/todo`)
        .then(res => res.json())
        .then(todos => {
        todos.forEach(todo => {
            tasks.innerHTML += `
                <div class="task">
                    <p>${todo.task}</p>
                    <p>${todo.date}</p>
                    <p>${todo.completed}</p>
                    <button onclick="deleteTask(${todo.id})">Delete</button>
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
        tasks.innerHTML = ""
        displayTasks()
    })
}