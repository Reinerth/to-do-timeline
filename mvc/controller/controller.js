'use strict'; /* Used traditional syntax and ES5, except "let". */

/** to-do-timeline *******************************************************
 * Constructing a class "controller" with private and public functions
 * wherein we could use (call) the public functions from other classes
 * even if they are not instantiated at that time,
 * because our container "timeline" is global (in the window-scope).
 * Means, we hoisted our container to window,
 * so the functions are going to be executed 
 * only after the window is loaded with the complete scripts.
 * From my understanding this works similar like the compiled files e.g. in C or JAVA. 
 * In this way JavaScript is kind of precompiled for the browser.
*/
window.timeline.controller = function (){

    // Settings needed inside this class
    let internalSettings = {
        myURLToWrite            :"./mvc/controller/write-to-timeline.php",
        myURLGetTimeline        :"./mvc/model/to-do-timeline-content.txt",
        changedContentString    :[],
        fineToSave              :false,
        somethingHasChanged     :false,
        yesResetBegin           :false,
        addNew                  :false,
        quitNewTask             :document.getElementById("quitNewTask"),
        addNewLine              :document.getElementById("addNewLine"),
        timeframeSelect         :document.getElementById("timeframeSelect"),
        addNewTimeframeOption   :"",
        addNewTimeInput         :document.getElementById("addNewTime"),
        taskDescription         :document.getElementById("taskDescription"),
        mainContainer           :document.getElementById("mainContent"),
        add                     :document.getElementById("add"),
        save                    :document.getElementById("save"),
        reset                   :document.getElementById("reset"),
        amountTasks             :document.getElementById("amountTasks"),
        contentStatus           :document.getElementById("contentStatus")
    };



    // We write the prepared content to the txt-file 
    let writeToFile = function(fileContent){

        window.timeline.makeAJAXRequest(function(responseContent) {

            // On callback ready, we display a message
            // which is quite obsolete, because due to simplicity we just reload the page when saved
            internalSettings.contentStatus.innerHTML = "SAVED";
            internalSettings.somethingHasChanged = false;

        }, internalSettings.myURLToWrite, fileContent);
    };


    // If user has changed a value 
    // we change the corresponding element in the big prepared array
    let prepareTheChangedLine = function(lineNr, columnNumber, changedValue, DOMLineIdNumber){

        internalSettings.contentStatus.innerHTML = "Don't forget to save!";

        if(changedValue == true){
            changedValue = "x";
        } 
        if (changedValue == false) {
            changedValue = "o";
        }

        if (changedValue == "delete") {

            // We loop through the array to find the array-element 
            // where as last element is the number with the id of the DOM-line
            // e.g the 10 -> ["20240724", ">1w", "One week has 7 days", "x", 10]
            // which we have placed there on loding the list.
            // The index of the array could not be used,
            // because if we delete an item from the list 
            // the id of the DOM-line is not getting adapted automatically 
            // with the changed index of the array
            // see in funtion prepareDeepArrayOfContent -> lineContent[4] = arrayLine;
            let myArrayLength = window.timeline.completeContentDeepArray.length;

            for (let i=0; i<myArrayLength; i++){

                if(window.timeline.completeContentDeepArray[i][4] == DOMLineIdNumber){

                    // we remove the line from array
                    window.timeline.completeContentDeepArray.splice(i, 1);
                    // ... then we hide the line from DOM
                    let myLine = document.getElementById(DOMLineIdNumber);
                    myLine.className = "hide";
                    return;
                }
            }
        } else {

            let myArrayLength = window.timeline.completeContentDeepArray.length;

            for (let i=0; i<myArrayLength; i++){
                if(window.timeline.completeContentDeepArray[i][4] == lineNr){ // ... same comment as above
                    window.timeline.completeContentDeepArray[i][columnNumber] = changedValue;
                }
            }
        }
    };



    // Create a select with the option given for the time-frame of the task in every line
    let createSelect = function(container, selectedValue, columnNumber){

        let listOfOptionsLength = window.timeline.listOfOptions.length;
        let optionsContainer = document.createElement("select");

        if (selectedValue == "unset"){
            internalSettings.addNewTimeframeOption = optionsContainer;
        }

        if (selectedValue != "unset"){
            optionsContainer.onchange = function(){
                let theFocusedLine = optionsContainer.parentNode.parentNode.id;
                prepareTheChangedLine(theFocusedLine, columnNumber, this.value);
            };
        }

        for (let i=0; i<listOfOptionsLength; i++){

            let myOption = document.createElement("option");

            if (selectedValue == window.timeline.listOfOptions[i]){
                myOption.selected = true;
            }

            myOption.value = window.timeline.listOfOptions[i];
            myOption.text = window.timeline.listOfOptions[i];
            optionsContainer.appendChild(myOption);
            container.appendChild(optionsContainer);
        }
    };



    // Creates an inputfield for the description of the task in every line
    let createInputFieldTask = function(container, selectedValue, columnNumber){

        let myInputField = document.createElement("input");
        myInputField.type = "text";
        myInputField.value = selectedValue;
        myInputField.className = "taskField";
        
        myInputField.onchange = function(){
            let theFocusedLine = container.parentNode.id;
            if (this.value.indexOf("+") >-1 || this.value.indexOf(">") >-1 || this.value.indexOf("<") >-1){
                myInputField.style.color = "red";
                this.value = "Script-characters like \"plus\" or \"bigger\" and \"lower\" can't be used";
            }
            if (this.value == ""){
                myInputField.style.color = "red";
                this.value = "unset";
            }
            prepareTheChangedLine(theFocusedLine, columnNumber, this.value);
        };

        container.appendChild(myInputField);
    };



    // Creates an inputfield for the date (timestamp) for every task in every line 
    let createInputFieldTime = function(container, selectedValue, columnNumber, lineNumber){

        let myInputField = document.createElement("input");
        myInputField.type = "text";
        myInputField.id = "time"+lineNumber;
        myInputField.value = selectedValue;

        // We get the system date from the pc/client
        let now = new Date();
        let myDay = now.getDate();
        let myMonth = parseInt(now.getMonth())+1; // month is returnd from 0-11,so we need to add 1
        let myYear = now.getFullYear();

        // then we append the strings to each other 
        let myTodayNumber = myYear.toString() + myMonth.toString() + myDay.toString();
        // then we make a number of it
        myTodayNumber = parseInt(myTodayNumber);

        // and compare them
        if (selectedValue > myTodayNumber){ // if they are in future write red
            myInputField.style.color = "red";
        } else { // if they are in past write gray
            myInputField.style.color = "gray";
        }

        myInputField.onchange = function(){
            let theFocusedLine = container.parentNode.id;
            prepareTheChangedLine(theFocusedLine, columnNumber, this.value);
        };

        theJQueryDatePickerAssignment(myInputField.id);

        container.appendChild(myInputField);
    };



    // Assign the jquery-datepicker-functionality to the given inputfield
    let theJQueryDatePickerAssignment = function(myInputId){
        $( function() {
            $( "#"+myInputId ).datepicker({
                dateFormat: "yymmdd"
            });
        });
    };



    // Sort the array with the splitted content by date
    let sortNumerically = function(){
       window.timeline.completeContentDeepArray.sort(function(a,b){

            // The native-JS-sort-function sorts strings (not numbers).
            // Numbers can be sorted if the parameter as function returns a-b.
            // And actually for sorting we directly should return a-b
            // but in our case it could happen, that the date is not given (from user),
            // so we test that like following:
            // if the given string "20231231" is converted to an integer
            // but still is not a number 
            // we know theres something wrong, then we can mark/put the value to "unset"

            let myTest1 = parseInt(a[0]);
            let myTest2 = parseInt(b[0]);

            if ( isNaN( myTest1 )) {
                a[0] = "unset";
            }
            if ( isNaN( myTest2 )) {
                b[0] = "unset";
            }

            return a[0]-b[0];
        });

        window.timeline.completeContentDeepArray.reverse();

        // We need to loop again through the array,
        // because afer sorting nmmerically in ascending order
        // and then reverse, to have it in descending order (newest date on top),
        // we want to have those items without a date (the "unset" one)
        // on top, even if they were sorted/inserted somewhere else.

        let myListLength = window.timeline.completeContentDeepArray.length;
        let collectedUnsetTimes = []; // we colect the index (position of the elements in array )
        let unsetListLength = 0;

        for (let line=0; line<myListLength; line++){
            if (window.timeline.completeContentDeepArray[line][0].indexOf ("unset") >-1){
                collectedUnsetTimes.push(line);
                unsetListLength++;
            }
        }

        // Loop through the list of the lines with unset dates
        // to reposition them on top of the list
        for (let unsetTime=0; unsetTime<unsetListLength; unsetTime++){

            // Next line is hard to read, so here is a minimalistic example of it
            // Example-snippet found on stack-overflow
            // let myArray = [0,1,2,3,4,5];
            // let index = 3;
            // myArray.unshift(myArray.splice(index, 1)[0]);
            // myArray = [3,0,1,2,4,5];
            window.timeline.completeContentDeepArray.unshift(window.timeline.completeContentDeepArray.splice(collectedUnsetTimes[unsetTime], 1)[0]);
        }
    };


    // We split up the strings from the file and place the chunks into an array.
    // Mainly for having a simple way to sort them by date (first column). 
    let prepareDeepArrayOfContent = function(responseContent){

        // We took some strange character-combination for avoiding 
        // that the user uses that combination in his descrition.
        // That would break the code. So a XSS is quite easy on this app.
        responseContent = responseContent.split("~~--");

        let responseContentLength = responseContent.length;
        let amountColumns = responseContent[0].split("||..").length;

        for (let arrayLine=0; arrayLine<responseContentLength-1; arrayLine++){

            // We took some strange character-combination for avoiding 
            // that the user uses that combination in his description.
            // That would break the code. XSS would be quite easy on this app.
            let lineContent = responseContent[arrayLine].split("||..");
            let createAnArrayForEveryColumn = [];

            // column 4 is the id which we will give to the DOM-line 
            // This will not be ordered anymore after sorting or deleting a line,
            // but it will be the same with the line number in DOM.
            // The main problem was, if user deletes a bunch of lines
            // the index of the array is not anymore corresponding 
            // with the id given in DOM-line.
            for (let column=0; column<amountColumns; column++){
                if(column == 0 || column == 1 || column == 2 || column == 3 || column == 4){
                    lineContent[4] = arrayLine;
                    createAnArrayForEveryColumn.push(lineContent[column]);
                }
            }

            window.timeline.completeContentDeepArray.push(createAnArrayForEveryColumn);
        }
    };


    // Count and display the amount of tasks in the header of the page
    let displayTaskAmount = function(){

        let amountTasks = window.timeline.completeContentDeepArray.length;
        internalSettings.amountTasks.innerText = amountTasks;

    };

    // We put the repared content to DOM to be displayed
    let drawTimelineOnContentPrepared = function(){

        let responseContent = window.timeline.completeContentDeepArray;
        let responseContentLength = responseContent.length;
        let lineLength = 0;

        if (responseContentLength > 0){
            lineLength = responseContent[0].length;
        }

        for (let line=0; line<responseContentLength; line++){

            responseContent[line].push(line);
            let DOMLineIdNumber = responseContent[line][4];

            let lineContainer = document.createElement("div");
            lineContainer.className = "lineContainer";
            lineContainer.id = DOMLineIdNumber;

            let deleteLineContainer = document.createElement("div");
            deleteLineContainer.className = "deleteLineContainer";

            let lineContent = responseContent[line];

            for (let column=0; column<lineLength; column++){

                if(column == 0){
                    let timeContainer = document.createElement("div");
                    timeContainer.className = "column timeContainer";
                    createInputFieldTime(timeContainer, lineContent[column], column, line);
                    lineContainer.appendChild(timeContainer);
                }

                if(column == 1){
                    let timeSpanContainer = document.createElement("div");
                    timeSpanContainer.className = "column timeSpanContainer";
                    createSelect(timeSpanContainer, lineContent[column], column);
                    lineContainer.appendChild(timeSpanContainer);
                }

                if(column == 2){
                    let myInputField = document.createElement("div");
                    myInputField.className = "column taskContainer";
                    createInputFieldTask(myInputField, lineContent[column], column);
                    lineContainer.appendChild(myInputField);
                }

                if(column == 3){
                    let statusContainer = document.createElement("div");
                    statusContainer.className = "column statusContainer";

                    let theCheckboxStatus = false;
                    let statusCheckbox = document.createElement("input");
                    statusCheckbox.type = "checkbox";

                    if(lineContent[column].indexOf("x") > -1){
                        statusCheckbox.checked = true;
                    } else {
                        statusCheckbox.checked = false;
                    }

                    statusContainer.onclick = function(){
                        prepareTheChangedLine(line, column, statusCheckbox.checked);
                    };

                    statusContainer.appendChild(statusCheckbox);
                    lineContainer.appendChild(statusContainer);
                }
            }

            lineContainer.onmouseover = function(){
                deleteLineContainer.className = "deleteLineContainer mySwitch";
                deleteLineContainer.innerText = "x";
            }

            lineContainer.onmouseout = function(){
                deleteLineContainer.className = "deleteLineContainer";
                deleteLineContainer.innerText = "";
            }

            deleteLineContainer.onclick = function(){
                // Here was a trouble by deleting many lines 
                // because we dont have anymore the same line-id in DOM like the index of the array, 
                // because the index of the array is going to be changed if an element is deleted in array.
                // Then I invented a next column where we place the DOMLineIdNumber
                prepareTheChangedLine(line, "0", "delete", DOMLineIdNumber);
            };

            lineContainer.appendChild(deleteLineContainer);
            internalSettings.mainContainer.appendChild(lineContainer);
        }

        let spacer = document.createElement("div");
        internalSettings.mainContainer.appendChild(spacer);
        spacer.className = "spacer";
    };




    // If user has clicked to "Add" a new line
    let getAddedLineValues = function(){

        let theValueDate = internalSettings.addNewTimeInput.value;
        let theValueTimeframe = internalSettings.addNewTimeframeOption.value;
        let theValueTaskDescription = internalSettings.taskDescription.value;

        if (theValueDate == "" && internalSettings.addNew == true){
            theValueDate = "unset";
        }

        if (theValueTaskDescription == "" && internalSettings.addNew == true){
            internalSettings.contentStatus.innerHTML = "Task description!";
            internalSettings.fineToSave = false;
        }

        if (theValueTaskDescription.indexOf("+") >-1 || theValueTaskDescription.indexOf(">") >-1 || theValueTaskDescription.indexOf("<") >-1){
            internalSettings.taskDescription.style.color = "red";
            internalSettings.taskDescription.value = "Script-characters like \"plus\" or \"bigger\" and \"lower\" can't be used2";
            return;
        }

        if (theValueTaskDescription != "" && theValueDate != "" && internalSettings.addNew == true){
            internalSettings.fineToSave = true;
            let myNewArrayContainer = []; // Needed because we have an array of arrays (the lines)
            let myNewLineArray = [theValueDate,theValueTimeframe,theValueTaskDescription,"o"];
            myNewArrayContainer.push(myNewLineArray);

            // We add the new line to the big array.
            let myMergedArray = window.timeline.completeContentDeepArray.concat(myNewArrayContainer);
            window.timeline.completeContentDeepArray = myMergedArray;

            // We need to sort the big array again due to a new line.
            sortNumerically();
        }

        if (theValueTaskDescription == "" && theValueDate == "" && internalSettings.addNew == false){
            internalSettings.fineToSave = true;
        }
    };





    // We prepare the changed content from the array 
    // and convert it to a big string to save it in the txt-file.
    let getTheNewContentToSave = function(){

        let changedContentArray = window.timeline.completeContentDeepArray;
        let changedContentString ="";
        let changedContentArrayLength = changedContentArray.length;

        if (internalSettings.yesResetBegin == false){

            for (let line=0; line<changedContentArrayLength; line++){

                let lineContentArray = changedContentArray[line];
                let lineContentArrayLength = lineContentArray.length;
                let lineContentString = "";

                for (let column=0; column<lineContentArrayLength; column++){

                    // If user adds a new line but does not sets a date
                    // we put the value to "unset"
                    if (column == 0 && lineContentArray[column] == ""){
                        lineContentArray[column] = "unset";
                    }

                    // If user has not added a new line
                    // and has removed the date from a date-inputfield already saved,
                    // we put the value to "unset"
                    if (internalSettings.addNew == false && column == 0){
                        if (document.getElementById("time"+line).value == ""){
                            lineContentArray[column] = "unset";
                        }
                    } 

                    // We divide the column-content by our special character-combination ("||..")
                    if(column == 0 || column == 1 || column == 2){
                        lineContentString = lineContentString + lineContentArray[column] + "||..";
                    }

                    // The last entry/column we end with another special character-combination ("~~--") to flag/mark the end
                    if(column == 3){
                        lineContentString = lineContentString + lineContentArray[column] + "~~--";
                    }
                }

                // line is ready to add it to the new file-content-string
                changedContentString = changedContentString + lineContentString;
            }
        }

        // Our string is complete to be saved to the file
        internalSettings.changedContentString = changedContentString;
    };




    let handleEvents = function(){

        // User clicks to "Add" a new task so we show him the inputfields (below the header) for that
        internalSettings.add.onclick = function(){
            internalSettings.addNewLine.style.display = "block";
            internalSettings.addNew = true;
            theJQueryDatePickerAssignment("addNewTime");
            internalSettings.contentStatus.innerHTML = "Don't forget to save!";
        };

        // User saves his changes
        internalSettings.save.onclick = function(){

            getAddedLineValues();

            if (internalSettings.yesResetBegin == true){
                writeToFile("");
                // reload the application
                location.reload();
            }

            if (internalSettings.fineToSave == true){
                getTheNewContentToSave();
                writeToFile(internalSettings.changedContentString);

                // reload the application
                location.reload();
            }
        };

        // User deletes all tasks saved in timeline
        internalSettings.reset.onclick = function(){
            internalSettings.mainContainer.innerHTML = "";
            internalSettings.contentStatus.innerHTML = "Don't forget to save!";
            internalSettings.yesResetBegin = true;
        };

        // On hovering a line, we display the "delete this line"-button on the right end of the line
        internalSettings.addNewLine.onmouseover = function(){
            internalSettings.quitNewTask.className = "deleteLineContainer mySwitch";
            internalSettings.quitNewTask.innerText = "x";
        }

        // On hovering out of the line, we hide the "delete this line"-button from the right end of the line
        internalSettings.addNewLine.onmouseout = function(){
            internalSettings.quitNewTask.className = "deleteLineContainer";
            internalSettings.quitNewTask.innerText = "";
        }

        // User quits the process to add a new task 
        internalSettings.quitNewTask.onclick = function(){
            internalSettings.addNewLine.style.display = "none";
            internalSettings.addNew = false;
            internalSettings.contentStatus.innerHTML = ""; // resset message
            internalSettings.addNewTimeInput.value = ""; // reset the value to emtpy
            internalSettings.taskDescription.value = ""; // reset the value to emtpy
        };
    };



    // Public
    this.init = function(){

        handleEvents();

        // Create a select for the initially hidden line 
        // to add a new task to the timeline 
        createSelect(internalSettings.timeframeSelect, "unset");


        // Get the model-content (file) with "makeAJAXRequest"
        // and when load is finished, do something with the retrieved content 
        // by using callback-functions ("callMeWhenReady")
        window.timeline.makeAJAXRequest(function(responseContent) {

            // Here we are in the callback-part of the request, 
            // means content-load is finished

            // We split up the big string from the file into an array
            prepareDeepArrayOfContent(responseContent);

            // When ready with splitting the string
            // we need to sort the lines by date
            sortNumerically();

            // When ready with sorting the array by date
            // we want to draw the items in DOM
            drawTimelineOnContentPrepared();

            // We want to know how many tasks are in the list, so we display the amount in the header
            displayTaskAmount();


        }, internalSettings.myURLGetTimeline);
    };
};


/***************************************************************************
 * INSTANTIATE (new) a variable (e.g. "timeline")                          *
 * with the class from this file ("controller.js")                         *
 * to make the class available to be invoked (in the "to-do-timeline.htm") *
****************************************************************************/
let timeline = new window.timeline.controller();
