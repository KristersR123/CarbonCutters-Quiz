// Initialize Firebase
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
    var person = document.getElementById(data);
    var target = event.target;

    // Check if the target car can still accept passengers
    if (target.className.includes("car") && !target.classList.contains('locked')) {
        if (target.children.length < 2) {
            target.appendChild(person);
            updateEmissions();
            if (target.children.length === 2) {
                lockOtherCar(target);
                document.getElementById('successSound').play();
                document.querySelector('.game-container').classList.add('success-background');
            }
        } else {
            alert("This car is full.");
        }
    }
}

function lockOtherCar(filledCar) {
    const cars = document.querySelectorAll('.car');
    cars.forEach(car => {
        if (car.id !== filledCar.id) {
            car.classList.add('locked'); // Lock the empty car
        }
    });
}

function updateEmissions() {
    const cars = document.querySelectorAll('.car');
    const distance = 100; // Assuming distance traveled
    const emissionsPerKmPerCar = 0.24; // Emissions per km per car

    let totalEmissions = 0;
    cars.forEach(car => {
        if (car.children.length > 0) {
            totalEmissions += emissionsPerKmPerCar * distance;
        }
    });

    let potentialEmissions = cars.length * emissionsPerKmPerCar * distance; // Emissions if both drove separately
    let savings = potentialEmissions - totalEmissions;
    document.getElementById('results').innerHTML = `<strong>Emissions with current setup:</strong> ${totalEmissions.toFixed(2)} kg CO2<br>` +
                                                    `<strong>Potential emissions if driving separately:</strong> ${potentialEmissions.toFixed(2)} kg CO2<br>` +
                                                    `<strong>Savings by current setup:</strong> ${savings.toFixed(2)} kg CO2`;
}
function resetGame() {
    const people = document.getElementById('people');
    document.querySelectorAll('.person').forEach(person => {
        people.appendChild(person); // Move all persons back to the start area
    });

    const cars = document.querySelectorAll('.car');
    cars.forEach(car => {
        car.classList.remove('locked');
        car.innerHTML = ''; // Clear the car
    });

    document.querySelector('.game-container').classList.remove('success-background');
    document.getElementById('results').textContent = '';
}