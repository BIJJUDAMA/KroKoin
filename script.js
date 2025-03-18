let totalPoints = 0;

function addTask() {
    let taskName = document.getElementById("taskName").value;
    let difficulty = parseInt(document.getElementById("difficulty").value);
    let timeLimit = parseInt(document.getElementById("timeLimit").value);

    if (!taskName || !timeLimit) {
        alert("Please enter task name and time limit.");
        return;
    }

    let taskDiv = document.createElement("div");
    taskDiv.className = "task";
    taskDiv.innerHTML = `
        <span>${taskName} - ${timeLimit} min</span>
        <button onclick="startTask(this, ${difficulty}, ${timeLimit})">Start</button>
    `;
    document.getElementById("taskList").appendChild(taskDiv);
}

function startTask(button, points, timeLimit) {
    button.disabled = true;
    button.innerText = "In Progress...";
    setTimeout(() => {
        let completed = confirm("Did you complete the task?");
        if (completed) {
            totalPoints += points;
            document.getElementById("points").innerText = totalPoints;
            button.parentElement.remove();
        } else {
            button.disabled = false;
            button.innerText = "Start";
        }
    }, timeLimit * 60 * 1000);
}