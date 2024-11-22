var firebaseConfig = {
    apiKey: "AIzaSyAAVtk6bN0lQonLP8z6STdPV2CTkFrNZS0",
    authDomain: "carboncutters-87a2d.firebaseapp.com",
    databaseURL: "https://carboncutters-87a2d-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "carboncutters-87a2d",
    storageBucket: "carboncutters-87a2d.appspot.com",
    messagingSenderId: "563749089257",
    appId: "1:563749089257:web:867bfb633630fceb1c2578"
};
firebase.initializeApp(firebaseConfig);

// Selectors and event listeners
document.querySelectorAll('.person').forEach(person => {
    person.addEventListener('dragstart', function(e) {
        e.dataTransfer.setData('text', e.target.id);
    });
});

document.querySelectorAll('.car, .bus').forEach(vehicle => {
    vehicle.addEventListener('dragover', function(e) {
        e.preventDefault(); // Allow drop
    });

    vehicle.addEventListener('drop', function(e) {
        e.preventDefault();
        const id = e.dataTransfer.getData('text');
        const person = document.getElementById(id);
        if (!this.contains(person)) {
            this.appendChild(person);
        }
    });
});

function calculateEmissions() {
    let carPassengers = document.getElementById('car1').children.length;
    let busPassengers = document.getElementById('bus1').children.length;
    let carEmissions = 0.24 * 10 * carPassengers; // Car emits 0.24kg CO2 per km per person, assume 10 km
    let busEmissions = 0.98 * 10; // Bus emits 0.98kg CO2 per km, assume 10 km, divided by number of passengers

    let results = `Car emissions total: ${carEmissions.toFixed(2)}kg CO2, Bus emissions per passenger: ${(busEmissions / (busPassengers || 1)).toFixed(2)}kg CO2 per passenger.`;
    document.getElementById('results').textContent = results;
}

function calculateScore() {
    let score = 0;
    const cars = document.querySelectorAll('.car');
    cars.forEach(car => {
        if (car.children.length > 0) {
            score += (20 - 5 * car.children.length);
        }
    });
    document.getElementById('score').textContent = 'Score: ' + score;
    saveScore(score); // Save the score to Firebase
}

// Firebase functions
function saveScore(score) {
    firebase.database().ref('scores/' + new Date().toISOString()).set({
        score: score
    }).catch(error => {
        console.error('Error writing new message to Realtime Database:', error);
    });
}

function getScores() {
    const scoresRef = firebase.database().ref('scores/');
    scoresRef.on('value', (snapshot) => {
        const data = snapshot.val();
        console.log(data);
    });
}
