let state = {
    level: 1,
    points: 0,
    pointsToNextLevel: 100,
    habits: [],
    totalStreaks: 0
};


function loadState() {
    const savedState = localStorage.getItem('habitTrackerState');
    if (savedState) {
        state = JSON.parse(savedState);
        updateUI();
    }
}


function saveState() {
    localStorage.setItem('habitTrackerState', JSON.stringify(state));
}


function updateUI() {
    document.getElementById('level').textContent = state.level;
    document.getElementById('points').textContent = state.points;
    document.getElementById('total-streaks').textContent = state.totalStreaks;

   
    const progressPercentage = (state.points / state.pointsToNextLevel) * 100;
    document.getElementById('level-progress-bar').style.width = `${progressPercentage}%`;
    document.getElementById('level-progress-text').textContent = `${state.points}/${state.pointsToNextLevel}`;

    
    document.getElementById('numcoin').textContent = state.points;

 
    renderHabits();
    updateTaskList();  
}


function renderHabits() {
    const habitList = document.getElementById('habit-list');
    habitList.innerHTML = '';

    if (state.habits.length === 0) {
        habitList.innerHTML = '<p>No habits added yet. Add your first habit above!</p>';
        return;
    }

    state.habits.forEach((habit, index) => {
        const habitElement = document.createElement('div');
        habitElement.className = 'habit-item';

        const habitName = document.createElement('div');
        habitName.className = 'habit-name';
        habitName.textContent = habit.name;

        const streakCount = document.createElement('div');
        streakCount.className = 'streak-count';
        streakCount.textContent = `${habit.streak} 🔥`;

        const completeButton = document.createElement('button');

        const today = new Date().toLocaleDateString();
        const completedToday = habit.completionDates.includes(today);

        completeButton.textContent = completedToday ? 'Completed' : 'Complete';
        completeButton.disabled = completedToday;
        completeButton.style.backgroundColor = completedToday ? '#6c757d' : '';

        if (!completedToday) {
            completeButton.addEventListener('click', () => completeHabit(index));
        }

        const streakCalendar = document.createElement('div');
        streakCalendar.className = 'streak-calendar';

        const last10Days = [];
        for (let i = 9; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            last10Days.push(date.toLocaleDateString());
        }

        last10Days.forEach(date => {
            const dayMarker = document.createElement('div');
            dayMarker.className = `day-marker ${habit.completionDates.includes(date) ? 'completed' : ''}`;
            dayMarker.title = date;

            const dayNumber = new Date(date).getDate();
            dayMarker.textContent = dayNumber;

            streakCalendar.appendChild(dayMarker);
        });

        habitElement.appendChild(habitName);
        habitElement.appendChild(streakCalendar);
        habitElement.appendChild(streakCount);
        habitElement.appendChild(completeButton);

        habitList.appendChild(habitElement);
    });
}


function addHabit() {
    const habitInput = document.getElementById('habit-input');
    const habitName = habitInput.value.trim();

    if (habitName) {
        state.habits.push({
            name: habitName,
            streak: 0,
            completionDates: [],
            completed: false  
        });

        habitInput.value = '';
        saveState();
        updateUI();
    }
}


function completeHabit(index) {
    const habit = state.habits[index];
    const today = new Date().toLocaleDateString();

    if (!habit.completionDates.includes(today)) {
        habit.completionDates.push(today);
        habit.streak++;
        state.points += 10;  

        
        if (habit.streak >= 7) {
            state.points += 5;
        }
        if (habit.streak >= 30) {
            state.points += 10;
        }

        state.totalStreaks++;

    
        habit.completed = true;

     
        if (state.points >= state.pointsToNextLevel) {
            levelUp();
        }

        saveState();
        updateUI();
    }
}


function levelUp() {
    state.level++;
    state.points -= state.pointsToNextLevel;
    state.pointsToNextLevel = Math.floor(state.pointsToNextLevel * 1.5);

    
    const notification = document.getElementById('level-up-notification');
    document.getElementById('new-level').textContent = state.level;
    notification.style.display = 'block';

  
    setTimeout(() => {
        notification.style.display = 'none';
    }, 3500);
}


function resetState() {
    state = {
        level: 1,
        points: 0,
        pointsToNextLevel: 100,
        habits: [],
        totalStreaks: 0
    };
    saveState();
    updateUI();
}

function updateTaskList() {
    const taskList = document.getElementById('tasklist');
    taskList.innerHTML = '<p style="margin:0px; float: left; font-weight: bold;">Tasks</p>';

   
    const spacingDiv = document.createElement('div');
    spacingDiv.style.height = "55px";  

    state.habits.forEach((habit, index) => {
        const taskItem = document.createElement('p');
        taskItem.textContent = habit.name;
        taskItem.style.margin = "5px 0";
        taskItem.style.padding = "5px";
        taskItem.style.background = habit.completed ? "#6c757d" : "#ff9800"; // Gray if completed
        taskItem.style.color = "white";
        taskItem.style.borderRadius = "5px";
        taskItem.style.cursor = "pointer";
        taskItem.style.textDecoration = habit.completed ? "line-through" : "none";

       
        taskItem.addEventListener('click', () => completeHabit(index));

        taskList.appendChild(taskItem);
    });
}




document.getElementById('add-habit').addEventListener('click', addHabit);
document.getElementById('habit-input').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        addHabit();
    }
});


loadState();
