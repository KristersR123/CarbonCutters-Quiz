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

function allowDrop(event) {
    event.preventDefault();
}

function drag(event) {
    event.dataTransfer.setData("text", event.target.id);
}

function drop(event) {
    event.preventDefault();
    var data = event.dataTransfer.getData("text");
    event.target.appendChild(document.getElementById(data));
}

function calculateEmissions() {
    const car = document.getElementById('car');
    const bus = document.getElementById('bus');
    const numInCar = car.getElementsByTagName('div').length;
    const numInBus = bus.getElementsByTagName('div').length;
    const carEmissions = numInCar * 0.24; // Assuming 0.24kg CO2 per km per person
    const busEmissions = 0.98; // Assuming 0.98kg CO2 per km, regardless of number of passengers
    const results = document.getElementById('results');
    results.innerHTML = `Total Car Emissions: ${carEmissions.toFixed(2)}kg CO2<br>` +
                        `Total Bus Emissions: ${busEmissions.toFixed(2)}kg CO2 per km`;
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
