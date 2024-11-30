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

// Variables for score tracking
let carpoolScore = 0;
const maxCarpoolScore = 30; // Maximum carpool score
const startQuizScore = parseInt(localStorage.getItem('startQuizScore')) || 0; // Retrieved from startQuiz

// DOM elements
const scoreDisplay = document.getElementById('score-display');
const continueBtn = document.getElementById('continue-btn');

// Initialize score display
scoreDisplay.textContent = `Current Score: ${startQuizScore}`;

// Function to allow dropping elements
function allowDrop(event) {
    event.preventDefault();
}

// Function for dragstart event
function drag(event) {
    event.dataTransfer.setData('text', event.target.id);
}

// Function to handle the drop event
function drop(event) {
    event.preventDefault();
    const personId = event.dataTransfer.getData('text');
    const person = document.getElementById(personId);
    const car = event.target.closest('.car');
    const occupants = parseInt(car.getAttribute('data-occupants'));

    // Check if the car can accept another person
    if (car && occupants < 2 && person) {
        car.setAttribute('data-occupants', occupants + 1); // Increment occupants
        person.style.display = 'none'; // Hide the person after they enter the car

        // Update car image based on occupants
        if (occupants + 1 === 1) {
            car.src = 'images/person_in_car.png'; // Car with one person
        } else if (occupants + 1 === 2) {
            car.src = 'images/car_with_two_people.png'; // Car with two people
        }

        updateScore(); // Recalculate the score
        checkAllPlaced(); // Check if all people are placed
    } else {
        console.log('Invalid drop or car is full!');
    }
}

// Function to update the score
function updateScore() {
    carpoolScore = 0; // Reset carpool score
    const cars = document.querySelectorAll('.car');

    // Award points only for cars with exactly two people
    cars.forEach(car => {
        const occupants = parseInt(car.getAttribute('data-occupants'));
        if (occupants === 2) {
            carpoolScore += 10; // 10 points per car with two people
        }
    });

    carpoolScore = Math.min(carpoolScore, maxCarpoolScore); // Cap score at 30
    const totalScore = startQuizScore + carpoolScore;

    scoreDisplay.textContent = `Current Score: ${totalScore}`;
}

// Function to check if all people are placed
function checkAllPlaced() {
    const allPeoplePlaced = Array.from(document.querySelectorAll('#top-bar img')).every(person => person.style.display === 'none');
    if (allPeoplePlaced) {
        continueBtn.disabled = false; // Enable the "Continue" button
        continueBtn.style.display = 'inline-block'; // Show the button
    }
}

// Add event listeners for drag-and-drop
document.addEventListener('DOMContentLoaded', function () {
    const persons = document.querySelectorAll('#top-bar img'); // All draggable people
    const cars = document.querySelectorAll('.car'); // All cars

    // Initialize cars with 0 occupants
    cars.forEach(car => car.setAttribute('data-occupants', '0'));

    // Attach dragstart events to people
    persons.forEach(person => {
        person.addEventListener('dragstart', drag);
    });

    // Attach dragover and drop events to cars
    cars.forEach(car => {
        car.addEventListener('dragover', allowDrop);
        car.addEventListener('drop', drop);
    });

    // Handle "Continue" button click
    continueBtn.addEventListener('click', function () {
        const totalScore = startQuizScore + carpoolScore; // Calculate total so far
        localStorage.setItem('challengeScore', carpoolScore); // Save challenge score
        localStorage.setItem('totalScore', totalScore); // Save the running total
        window.location.href = 'finalQuiz.html'; // Redirect to the final quiz
    });
    
});