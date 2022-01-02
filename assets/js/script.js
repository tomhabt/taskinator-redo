var formEl = document.querySelector("#task-form");
var tasksToDoEl = document.querySelector("#tasks-to-do");
var tasksInProgressEl = document.querySelector("#tasks-in-progress");
var tasksCompletedEl = document.querySelector("#tasks-completed");
var pageContentEl = document.querySelector("#page-content");
var taskIdCounter = 0;
var tasks = [];


// 1. SUBMITTING TASKS BY THE FORM FUNCTION
var taskFormHandler = function (event) {
	event.preventDefault();

	var taskNameInput = document.querySelector("input[name='task-name']").value;
	var taskTypeInput = document.querySelector("select[name='task-type']").value;

	// check if input values are empty strings
	if (!taskNameInput || !taskTypeInput) {
		alert("You need to fill out the task form!");
		return false;
	}
	formEl.reset();

	var isEdit = formEl.hasAttribute("data-task-id");
	console.log(isEdit);

	// send it as an argument to createTaskEl
	// has data attribute, so get task id and call function to complete edit process
	if (isEdit) {
		var taskId = formEl.getAttribute("data-task-id");
		completeEditTask(taskNameInput, taskTypeInput, taskId);
	}
	// no data attribute, so create object as normal and pass to createTaskEl function
	else {
		var taskDataObj = {
			name: taskNameInput,
			type: taskTypeInput,
			status: "to do"
		};

		createTaskEl(taskDataObj);
	}
};

// 2. SHOWING TASKS FUNCTION
var createTaskEl = function (taskDataObj) {

    
    // create list item
	var listItemEl = document.createElement("li");
	listItemEl.className = "task-item";
	// add task id as a custom attribute
	listItemEl.setAttribute("data-task-id", taskIdCounter);
    
	// create div to hold task info and add to list item
	taskInfoEl = document.createElement("div")
	taskInfoEl.className = "task-info";
    
	// add HTML content to div
	taskInfoEl.innerHTML = "<h3 class='task-name'>" + taskDataObj.name + "</h3><span class='task-type'>" + taskDataObj.type + "</span>";
    
	listItemEl.appendChild(taskInfoEl);
    
	taskDataObj.id = taskIdCounter;
    
    tasks.push(taskDataObj);
    console.log(tasks);
    saveTasks();

	var taskActionsEl = createTaskActions(taskIdCounter, taskDataObj.status);
	listItemEl.appendChild(taskActionsEl);
    
    
	if (taskDataObj.status === "in progress") {
        
        // add entire list item to list
		tasksInProgressEl.appendChild(listItemEl);
	} else if (taskDataObj.status === "completed") {

		// add entire list item to list
		tasksCompletedEl.appendChild(listItemEl);
	} else {

		// add entire list item to list
		tasksToDoEl.appendChild(listItemEl);
	}
	//}
	taskIdCounter++
};

// 3. EDITTED TASK SUBMISSION FUNCTION
var completeEditTask = function (taskName, taskType, taskId) {
	// find the matching task list item
	var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

	// set new values
	taskSelected.querySelector("h3.task-name").textContent = taskName;
	taskSelected.querySelector("span.task-type").textContent = taskType;

	// loop through tasks array and task object with new content
	for (var i = 0; i < tasks.length; i++) {
		if (tasks[i].id === parseInt(taskId)) {
			tasks[i].name = taskName;
			tasks[i].type = taskType;
		}
	};

	saveTasks();

	alert("Task Updated!");
	formEl.removeAttribute("data-task-id");
	document.querySelector("#save-task").textContent = "Add Task";
};

// 4. CREATING TASKS FUNCTION

var createTaskActions = function (taskId, taskStatus) {
	var actionContainerEl = document.createElement("div");
	actionContainerEl.className = "task-actions";

	// create edit button
	var editButtonEl = document.createElement("button");
	editButtonEl.textContent = "Edit";
	editButtonEl.className = "btn edit-btn";
	editButtonEl.setAttribute("data-task-id", taskId);

	actionContainerEl.appendChild(editButtonEl);

	// create delete button
	var deleteButtonEl = document.createElement("button");
	deleteButtonEl.textContent = "Delete";
	deleteButtonEl.className = "btn delete-btn";
	deleteButtonEl.setAttribute("data-task-id", taskId);

	actionContainerEl.appendChild(deleteButtonEl);

	// create action dropdown
	var statusSelectEl = document.createElement("select");
	statusSelectEl.className = "select-status";
	statusSelectEl.setAttribute("name", "status-change");
	statusSelectEl.setAttribute("data-task-id", taskId);

	var statusChoices = [];

	if (taskStatus === "completed") {
		statusChoices = ["Completed", "To Do", "In Progress"];
	} else if (taskStatus === "in progress") {
		statusChoices = ["In Progress", "Completed", "To Do"];
	} else {
		statusChoices = ["To Do", "In Progress", "Completed"];
	}
	for (var i = 0; i < statusChoices.length; i++) {
		// create option element
		var statusOptionEl = document.createElement("option");
		statusOptionEl.textContent = statusChoices[i];
		statusOptionEl.setAttribute("value", statusChoices[i]);
		// append to select
		statusSelectEl.appendChild(statusOptionEl);
	}

	actionContainerEl.appendChild(statusSelectEl);
	return actionContainerEl;
};

// 5. FINDING THE EXACT TASK ID AND TASK BUTTON CLICK HANDLER FUNCTION
var taskButtonHandler = function (event) {
	// get target element from event
	var targetEl = event.target;

	// edit button was clicked
	if (targetEl.matches(".edit-btn")) {
		var taskId = targetEl.getAttribute("data-task-id");
		editTask(taskId);
	}
	// delete button was clicked
	else if (targetEl.matches(".delete-btn")) {
		var taskId = targetEl.getAttribute("data-task-id");
		deleteTask(taskId);
	}
};

// 6. TASK EDITTING FUNCTION
var editTask = function (taskId) {
	console.log("editing task #" + taskId);

	// get task list item element
	var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
	console.log(taskSelected);
	var taskName = taskSelected.querySelector("h3.task-name").textContent;
	console.log(taskName);
	var taskType = taskSelected.querySelector("span.task-type").textContent;
	console.log(taskType);

	// load the editing task info. into the form
	document.querySelector("input[name='task-name']").value = taskName;
    document.querySelector("select[name='task-type']").value = taskType;
	document.querySelector("#save-task").textContent = "Save Task";
	formEl.setAttribute("data-task-id", taskId);

};


// 6. TASK DELETING FUNCTION
var deleteTask = function (taskId) {
	var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
	taskSelected.remove();
	// create new array to hold updated list of tasks
	var updatedTaskArr = [];

	// loop through current tasks
	for (var i = 0; i < tasks.length; i++) {
		// if tasks[i].id doesn't match the value of taskId, let's keep that task and push it into the new array
		if (tasks[i].id !== parseInt(taskId)) {
			updatedTaskArr.push(tasks[i]);
		}
	}

	// reassign tasks array to be the same as updatedTaskArr
	tasks = updatedTaskArr;
};


// 7. TASK STATUS CHANGER  FUNCTION
var taskStatusChangeHandler = function (event) {

	// get the task item's id
	var taskId = event.target.getAttribute("data-task-id");

	// get the currently selected option's value and convert to lowercase
	var statusValue = event.target.value.toLowerCase();

	// find the parent task item element based on the id
	var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
	if (statusValue === "to do") {
		tasksToDoEl.appendChild(taskSelected);
	} else if (statusValue === "in progress") {
		tasksInProgressEl.appendChild(taskSelected);
	} else if (statusValue === "completed") {
		tasksCompletedEl.appendChild(taskSelected);
	}

	// update task's in tasks array
	for (var i = 0; i < tasks.length; i++) {
		if (tasks[i].id === parseInt(taskId)) {
			tasks[i].status = statusValue;
		}
	}
	saveTasks();
};

// 7. TASK SAVE AT LOCAL STORAGE  FUNCTION
var saveTasks = function () {
	localStorage.setItem("tasks", JSON.stringify(tasks))
}

// 8. TASK LOAD OR GET FROM LOCAL STORAGE  FUNCTION
var loadTasks = function () {
	var tasks = JSON.parse(localStorage.getItem("tasks"));
	console.log(tasks);
	if (tasks != null) {
		for (var i = 0; i < tasks.length; i++) {
			createTaskEl(tasks[i]);
		}
	} else
		return false
};

// event listeners

pageContentEl.addEventListener("click", taskButtonHandler);

formEl.addEventListener("submit", taskFormHandler);

pageContentEl.addEventListener("change", taskStatusChangeHandler);

// call the data from the local storage for the first time
loadTasks();