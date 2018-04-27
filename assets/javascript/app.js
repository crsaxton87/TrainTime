// Initialize Firebase
var config = {
    apiKey: "AIzaSyBY_oRxz4de83Tobo_P8ku1JGADMtE3zZY",
    authDomain: "traintime-ca67f.firebaseapp.com",
    databaseURL: "https://traintime-ca67f.firebaseio.com",
    projectId: "traintime-ca67f",
    storageBucket: "",
    messagingSenderId: "288608711330"
};
firebase.initializeApp(config);

var database = firebase.database(),
    main = $('body');

// Submit button
$(main).on('click', '#submit', function(event) {
    event.preventDefault();

    // Save user input
    var trainName = $('#trainName').val().trim(),
        destination = $('#destination').val().trim(),
        first = $('#first').val().trim(),
        frequency = $('#frequency').val().trim();

    // Object to hold train data
    var newTrain = {
        name: trainName,
        destination: destination,
        first: first,
        frequency: frequency
    };

    // Push data to firebase
    database.ref().push(newTrain);

    // Log to console
    console.log(newTrain.name, newTrain.destination, newTrain.first, newTrain.frequency);

    // Clear inputs
    $('#trainName').val('');
    $('#destination').val('');
    $('#first').val('');
    $('#frequency').val('');
});

// When train added, add row to table
database.ref().on('child_added', function(childSnapshot, prevChildKey){

    console.log(childSnapshot.val());

    // Store locally
    var trainName = childSnapshot.val().name,
        destination = childSnapshot.val().destination,
        first = childSnapshot.val().first,
        frequency = childSnapshot.val().frequency;
    
    console.log(trainName, destination, first, frequency);

    // Calculate Minutes Away
    var firstConverted = moment(first, 'HH:mm');
    console.log(firstConverted);

    // Current Time
    var currentTime = moment();
    console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

    // Difference between the times
    var diffTime = moment().diff(moment(firstConverted), "minutes");
    console.log("DIFFERENCE IN TIME: " + diffTime);

    // Time apart (remainder)
    var remainder = diffTime % frequency;
    console.log(remainder);

    // Minute Until Train
    var minutesTill = frequency - remainder;
    console.log("MINUTES TILL TRAIN: " + minutesTill);

    // Next Train
    var nextTrain = moment().add(minutesTill, "minutes").format("HH:mm");
    console.log("ARRIVAL TIME: " + moment(nextTrain));

    // Add each train's data into the table
    $("#trainTable").append("<tr><td>" + trainName + "</td><td>" + destination + "</td><td>" +
    first + "</td><td>" + frequency + "</td><td>" + minutesTill + "</td><td>" + nextTrain + "</td></tr>");
});