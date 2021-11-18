class Task {
    constructor(title, description, startDate, dueDate, category) {
        this._title = title;
        this._description = description;
        this._startDate = startDate;
        this._dueDate = dueDate;
        this._category = category;
        this._completed = 'N';
    }

    // Get and Set for Task's Category (Work / Play / Life)
    get category() {
        return this._category;
    }
    set category(category) {
        this._category = category;
    }

    // Get and Set for Task Title (String with the task title)
    get title() {
        return this._title;
    }
    set title(title) {
        this._title = title;
    }
    
    // Get and Set for Task Description (String describing the task)
    get description() {
        return this._description;
    }
    set description(description) {
        this._description = description;
    }

    // Get and Set for Task Start Date (Date value)
    get startDate() {
        return this._startDate;
    }
    set startDate(startDate) {
        this._startDate = startDate;
    }
    
    // Get and Set for Task Due Date (Date value)
    get dueDate() {
        return this._dueDate;
    }
    set dueDate(dueDate) {
        this._dueDate = dueDate;
    }

    // Get and Set for Task completed (Boolean value Y / N)
    get completed() {
        return this._completed;
    }
    set completed(completed) {
        this._completed = completed;
    }
}

let taskArray = [];
let todayTaskArray = [];
let weekTaskArray = [];
let currentList = 'all';
loadFromStorage();
//Start by showing ALL TASKS
updateDisplay('all');

//Get the stored TASKS ARRAYS from the local storage
function loadFromStorage(){
    let allTasksString = localStorage.getItem("allTasks");
    //If there is stored data to load
    if (allTasksString != null) {
        taskArray = JSON.parse(allTasksString);
    }

    let todayTasksString = localStorage.getItem("todayTasks");
    //If there is stored data to load
    if (todayTasksString != null) {
        todayTaskArray = JSON.parse(todayTasksString);
    }
    
    let weekTasksString = localStorage.getItem("weekTasks");
    //If there is stored data to load
    if (weekTasksString != null) {
        weekTaskArray = JSON.parse(weekTasksString);
    }
}

//Save the current data to locale Storage
function saveToStorage(){
    // Save the taskArray to local storage
    allTasksString = JSON.stringify(taskArray);
    localStorage.setItem("allTasks", allTasksString);
    
    //Load the filtered todayArray
    todayTaskArray = [];
    let todayDate = new Date();
    for(i=0; i < taskArray.length; i++){
        let myDateString = taskArray[i]._startDate;
        let myStartDate = new Date(myDateString);
        if(myStartDate.getDate() == todayDate.getDate()){
            todayTaskArray.push(taskArray[i]);
        }
    }
    //Convert to JSON data and write to localstorage
    todayTasksString = JSON.stringify(todayTaskArray);
    localStorage.setItem("todayTasks", todayTasksString);
    
    //Load the filtered weekArray
    weekTaskArray = [];
    let weekDate = new Date();
    for(i=0; i < taskArray.length; i++){
        let myDateString = taskArray[i]._startDate;
        let myStartDate = new Date(myDateString);
        if(myStartDate.getDate() >= weekDate.getDate() && myStartDate.getDate() <= weekDate.getDate()+7){
            weekTaskArray.push(taskArray[i]);
        }
    }
    //Convert to JSON data and write to localstorage
    weekTasksString = JSON.stringify(weekTaskArray);
    localStorage.setItem("weekTasks", weekTasksString);
}

//Refresh the display with the latest data as stored in locale storage
function updateDisplay(filterString) {
    let ul = document.getElementById("myTaskList");
    ul.style.listStyle = 'none';
    ul.innerHTML = "";
    let displayArray = [];

    switch(filterString) {
        case 'all':
            displayArray = taskArray;
            currentList = 'all';
            document.getElementById('listName').innerHTML = 'My Tasks - ALL'
            break;
        case 'today':
            displayArray = todayTaskArray;
            currentList = 'today';
            document.getElementById('listName').innerHTML = 'My Tasks - TODAY' 
            break;
        case 'week':
            displayArray = weekTaskArray;
            currentList = 'week';
            document.getElementById('listName').innerHTML = 'My Tasks - WEEK' 
            break;
        default:
            console.log('updateDisplay() - no array loaded');
    }

    //First check the length, else display 'no task' message
    if (displayArray.length > 0){
        for (i = 0; i < displayArray.length; i++) {
            let myObj = displayArray[i];
            let myString = `Task ${i + 1}: ${myObj._title.toUpperCase()} -  Description: ${myObj._description} `;
            let li = document.createElement("li");
            if (myObj._completed == 'Y'){
                li.style.textDecoration = 'line-through';
            }
            else{
                li.style.textDecoration = 'none';
            }
            li.appendChild(document.createTextNode(myString));
            ul.appendChild(li);
        }

        // Create a REMOVE and COMPLETED buttons and append it to each list item
        let myNodelist = document.getElementsByTagName("li");
        for (i = 0; i < myNodelist.length; i++) {
            let myObj = displayArray[i];
            let button = document.createElement('input');
            button.setAttribute('type', 'button');
            button.setAttribute('value', 'REMOVE');
            button.setAttribute('class', 'buttonStyle');
            button.setAttribute('onclick', `removeTask(${i})`);
            myNodelist[i].appendChild(button);


            let button2 = document.createElement('input');
            button2.setAttribute('type', 'button');
            button2.setAttribute('value', 'COMPLETED');
            button2.setAttribute('class', 'buttonStyle');
            button2.setAttribute('onclick', `completeTask(${i})`);
            myNodelist[i].appendChild(button2);
        }
    }
    else{
        let li = document.createElement("li");
        li.appendChild(document.createTextNode("There are no tasks to display"));
        ul.appendChild(li);
    }
}

//On Submit (and after HTML valiation) push() the new task to the taskArray
function mySubmit(event) {

    event.preventDefault();

    //Get all the values from the DOM and populate the valiables
    let taskTitle = document.getElementById("taskTitle").value;
    let taskDescription = document.getElementById("taskDescription").value;
    let taskStartDate = document.getElementById("taskStartDate").value;
    let taskDueDate = document.getElementById("taskDueDate").value;
    let taskCategory = "";
    if (document.getElementById("category1").checked == true) {
        taskCategory = "WORK";
    }
    else if (document.getElementById("category2").checked == true) {
        taskCategory = "PLAY";
    }
    else {
        taskCategory = "LIFE";
    }

    let myTask = new Task(taskTitle, taskDescription, taskStartDate, taskDueDate, taskCategory)
    taskArray.push(myTask);

    //Save to locale storage
    saveToStorage();
    
    //Update the display
    switch(currentList) {
        case 'all':
            updateDisplay('all');
            break;
        case 'today':
            updateDisplay('today');
            break;
        case 'week':
            updateDisplay('week');
            break;
        default:
            console.log('mySubmit() - no current list');
    }

    //Also clear the inputs in the form
    console.log('clear fields');
    document.getElementById("taskTitle").value = "";
    document.getElementById("taskDescription").value = "";
    document.getElementById("taskStartDate").value = "";
    document.getElementById("taskDueDate").value = "";

}

//Remove a task from the list and update the display
function removeTask(taskNumber) {
    console.log(taskNumber);
    switch(currentList) {
        case 'all':
            myObj = taskArray[taskNumber];
            break;
        case 'today':
            myObj = todayTaskArray[taskNumber];
            break;
        case 'week':
            myObj = weekTaskArray[taskNumber];
            break;
        default:
            console.log('removeTask() - no current list');
    }

    console.log(myObj);
    myString1 = JSON.stringify(myObj);
    let myNodelist = document.getElementsByTagName("li");
    for (i = 0; i < myNodelist.length; i++) {
        myString2 = JSON.stringify(taskArray[i]);
        console.log(myString2);
        if (myString1 == myString2) {
            taskArray.splice(taskNumber, 1);
        }
    }
    //Save to locale storage
    saveToStorage();
    
    //Update the display
    switch(currentList) {
        case 'all':
            updateDisplay('all');
            break;
        case 'today':
            updateDisplay('today');
            break;
        case 'week':
            updateDisplay('week');
            break;
        default:
            console.log('removeTask() - no current list');
    }
}

// Mark a task as completed and update the display
function completeTask(taskNumber) {
    
    switch(currentList) {
        case 'all':
            myObj = taskArray[taskNumber];
            break;
        case 'today':
            myObj = todayTaskArray[taskNumber];
            break;
        case 'week':
            myObj = weekTaskArray[taskNumber];
            break;
        default:
            console.log('completeTask() - no current list');
    }

    myString1 = JSON.stringify(myObj);
    let myNodelist = document.getElementsByTagName("li");
    for (i = 0; i < myNodelist.length; i++) {
        myString2 = JSON.stringify(taskArray[i]);
        if (myString1 == myString2) {
            taskArray[i]._completed = 'Y';
            console.log( taskArray[i]);
        }
    }
    //Save to locale storage
    saveToStorage();
    
    //Update the display
    switch(currentList) {
        case 'all':
            updateDisplay('all');
            break;
        case 'today':
            updateDisplay('today');
            break;
        case 'week':
            updateDisplay('week');
            break;
        default:
            console.log('completeTask() - no current list');
    }
}

// Sort the tasks in alphbetical order
function sortTasks(){
    taskArray.sort(function(a, b){
        let stringA = a._title.toUpperCase();
        let stringB = b._title.toUpperCase();
        if(stringA < stringB) { return -1; }
        if(stringA > stringB) { return 1; }
        return 0;
    })

    //Save to locale storage
    saveToStorage();
    
    //Update the display
    switch(currentList) {
        case 'all':
            updateDisplay('all');
            break;
        case 'today':
            updateDisplay('today');
            break;
        case 'week':
            updateDisplay('week');
            break;
        default:
            console.log('sortTasks() - no current list');
    }
}