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
    
   
    renderHabits();
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
            completionDates: []
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
    state.pointsToNextLevel = Math.floor(state.pointsToNextLevel * 1.5);  // Increase points needed for next level
    
   
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


document.getElementById('add-habit').addEventListener('click', addHabit);
document.getElementById('habit-input').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        addHabit();
    }
});

// Initialize app
loadState();