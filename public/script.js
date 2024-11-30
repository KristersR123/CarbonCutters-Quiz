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

// Additional checks to ensure correct behavior on subsequent attempts
function drop(event) {
    event.preventDefault();
    var data = event.dataTransfer.getData("text");
    var person = document.getElementById(data);
    var target = event.target;

    if (target.className.includes("car") && !target.classList.contains('locked')) {
        if (target.children.length < 2) {
            target.appendChild(person);
            updateEmissions();
            if (target.children.length === 2) {
                lockOtherCar(target);
                document.getElementById('successSound').play();
                document.querySelector('.game-container').classList.add('success-background');
                setTimeout(() => {
                    document.getElementById('next-button').style.display = 'inline-block';  // Show the "Next" button after all transitions are complete
                }, 500);  // Delay to ensure the background change and sound are noticed
            }
            // Check if both drivers are now in one car
            if (target.children.length === 2 && (target.children[0].id !== target.children[1].id)) {
                alert("Congratulations! You have saved emissions by carpooling :)");
            }
        } else {
            alert("This car is full.");
        }
    }
}

// Make sure that locking other cars doesn't prevent future correct interactions
function lockOtherCar(filledCar) {
    const cars = document.querySelectorAll('.car');
    cars.forEach(car => {
        if (car.id !== filledCar.id) {
            car.classList.add('locked');  // Lock the other cars
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

function goToNextChallenge() {
    window.location.href = 'nextChallenge.html'; // Redirect to next challenge
}

function resetGame() {
    const people = document.getElementById('people');
    const cars = document.querySelectorAll('.car');

    // Move all person elements back to the people container and unlock cars
    cars.forEach(car => {
        Array.from(car.children).forEach(child => {
            if (child.classList.contains('person')) {
                people.appendChild(child);  // Move person back to the starting area
            }
        });
        car.classList.remove('locked');  // Unlock the car
    });

    // Reset visual elements and hide the "Next" button
    document.querySelector('.game-container').classList.remove('success-background');
    document.getElementById('results').textContent = '';  // Clear results text
    document.getElementById('next-button').style.display = 'none';  // Hide the "Next" button

    // Optionally, reset emissions data or any other visual feedback
}
