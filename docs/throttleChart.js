var chartObject;
var applicationId = "AppName";
var colorList = ["red", "blue", "green", "orange", "purple", "yellow", "pink", "brown", "grey", "black"];
var savedCpuSlowDownMultipliers = [];
var savedResultTypes = [];
var firstRun = true;

$(document).ready(function () {
    populateSessionDropDownListData(applicationId);
    $('#dropdown').change(function () {
        var sessionId = $(this).val();
        setSessionChart(applicationId, sessionId);
    });
    //check for the value change of checkboxes with the class resultTypeOptions. 
    //listen to changes even if the checkbox is not parsed yet


});


function populateSessionDropDownListData(applicationId) {
    // AJAX request to get dropdown data
    $.ajax({
        url: 'reports/' + applicationId + '/' + applicationId + '-sessionList.json',
        type: 'GET',
        success: function (data) {
            // Populate dropdown with data
            var dropdown = $('#dropdown');
            //reset dropdown list 
            dropdown.empty();
            dropdown.append('<option selected="true" disabled>Choose Session</option>');
            $.each(data.sessions, function (key, value) {
                //console.log(key + " " + JSON.stringify(value))
                const ddOptionValue = value.sessionId;
                const ddOptionKey = `${applicationId}-${value.sessionId}-${value.endDateTime}`
                dropdown.append($('<option></option>').attr('value', ddOptionValue).text(ddOptionKey));
            });
        },
        error: function (data) {
            console.log("error: " + data)
            alert("Error getting session list data");
        }
    });
}

function generateDataForChartOptions(data, cpuSlowDownMultipliers, resultTypes) {
    for (const [key, value] of Object.entries(data.cpuSlowDownMultiplierResultsList.interactiveResult)) {
        //console.log(key + " " + JSON.stringify(value))
        cpuSlowDownMultipliers.push(key);
    }
    //if savedCpuSlowDownMultipliers is empty, then save the cpuSlowDownMultipliers
    if (firstRun === true && savedCpuSlowDownMultipliers.length == 0) {
        //push each cpuSlowDownMultipliers to savedCpuSlowDownMultipliers
        for (var i = 0; i < cpuSlowDownMultipliers.length; i++) {
            savedCpuSlowDownMultipliers.push(cpuSlowDownMultipliers[i]);
        }
    }

    for (const [key, value] of Object.entries(data.cpuSlowDownMultiplierResultsList)) {
        //console.log(key + " " + JSON.stringify(value))
        resultTypes.push(key);
    }
    if (firstRun === true && savedResultTypes.length == 0) {
        //push each cpuSlowDownMultipliers to savedCpuSlowDownMultipliers
        for (var i = 0; i < resultTypes.length; i++) {
            savedResultTypes.push(resultTypes[i]);
        }
        firstRun = false;
    }

}

function processCPUSlowDownMultiplierResultsUponRequestSuccess(data, applicationId, sessionId) {

    var cpuSlowDownMultipliers = [];
    var resultTypes = [];
    generateDataForChartOptions(data, cpuSlowDownMultipliers, resultTypes);
    generateOptionsForChart(cpuSlowDownMultipliers, resultTypes, applicationId, sessionId);

    var dataSetValues = [];
    //given data: data.cpuSlowDownMultiplierResultsList.interactiveResult, loop
    //through each key and create a dataset object
    var currentColorIndex = 0;
    currentColorIndex = processResultTypeInterActiveResult(data, currentColorIndex, dataSetValues);
    currentColorIndex = processResultTypeSpeedIndex(data, currentColorIndex, dataSetValues);
    //given data: data.cpuSlowDownMultiplierResultsList.speedIndex, loop
    //through each key and create a dataset object
    //keep same color counters
    generateChartOnPage(currentColorIndex, data, dataSetValues, sessionId);
}

function generateChartOnPage(currentColorIndex, data, dataSetValues, sessionId) {
    //currentColorIndex = processResultTypeSpeedIndex(data, currentColorIndex, dataSetValues);

    const chartData = {
        labels: data.networkSpeedList,
        datasets: dataSetValues,
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            title: {
                display: true,
                text: "Performance Results - " + sessionId
            }
        },
        scales: {
            y: {
                title: {
                    display: true,
                    text: "Time (ms)"
                }
            },
            x: {
                title: {
                    display: true,
                    text: "Network Speed (kbps)"
                }
            }
        }
    };

    const ctx = document.getElementById("myChart").getContext("2d");
    //destroy chart if it already exists
    if (typeof chartObject !== "undefined") {
        chartObject.destroy();
    }
    chartObject = new Chart(ctx, {
        type: "line",
        data: chartData,
        options: chartOptions
    });
    return currentColorIndex;
}

function processResultTypeInterActiveResult(data, currentColorIndex, dataSetValues) {
    if (savedResultTypes.includes("interactiveResult")) {
        for (const [key, value] of Object.entries(data.cpuSlowDownMultiplierResultsList.interactiveResult)) {
            if (savedCpuSlowDownMultipliers.includes(key)) {
                var dataSet = {
                    label: "Interactive Result (" + key + "x CPU slowdown)",
                    data: value,
                    borderColor: colorList[currentColorIndex],
                    fill: false
                };
                dataSetValues.push(dataSet);
                currentColorIndex++;
            }
        }
    }
    return currentColorIndex;
}

function processResultTypeSpeedIndex(data, currentColorIndex, dataSetValues) {
    //continue only if savedResultTypes contains speedIndex result type value
    if (savedResultTypes.includes("speedIndex")) {
        for (const [key, value] of Object.entries(data.cpuSlowDownMultiplierResultsList.speedIndex)) {
            if (savedCpuSlowDownMultipliers.includes(key)) {
                var dataSet = {
                    label: "Speed Index (" + key + "x CPU slowdown)",
                    data: value,
                    borderColor: colorList[currentColorIndex],
                    fill: false
                };
                dataSetValues.push(dataSet);
                currentColorIndex++;
            }
        }
    }
    return currentColorIndex;
}

// Upon selection of drowdownlist value, call setSessionChart value
function setSessionChart(applicationId, sessionId) {

    fetch('reports/' + applicationId + '/chartdata/' + sessionId + '_cpuSlowDownMultiplierImpact.json')
        .then(response => response.json())
        .then(data => processCPUSlowDownMultiplierResultsUponRequestSuccess(data, applicationId, sessionId));
}
function generateOptionsForChart(cpuSlowDownMultipliers, resultTypes, applicationId, sessionId) {
    //run this function only if cpuSlowDownMultipliersCheckboxList innerHtml is empty
    parseCPUSlowDownMultipliersCheckList(cpuSlowDownMultipliers, applicationId, sessionId);
    parseResultTypeCheckList(resultTypes, applicationId, sessionId);
}

function parseResultTypeCheckList(resultTypes, applicationId, sessionId) {
    if (document.getElementById("typeOfValuesCheckboxList").innerHTML == "") {
        // Create checkbox list for type of values (Interactive and Speed Index)
        //var resultTypes = ["Interactive", "Speed Index"];
        var typeOfResultsCheckboxList = "";
        for (var i = 0; i < resultTypes.length; i++) {
            typeOfResultsCheckboxList += '<input type="checkbox" class="resultTypeOptions" id="' + resultTypes[i] + '" name="typeOfValues" value="' + resultTypes[i] + '"';
            if (savedResultTypes.includes(resultTypes[i])) {
                typeOfResultsCheckboxList += ' checked';
            }
            typeOfResultsCheckboxList += '>';
            typeOfResultsCheckboxList += '<label for="' + resultTypes[i] + '"> ' + resultTypes[i] + '</label><br>';
        }
        document.getElementById("typeOfValuesCheckboxList").innerHTML = typeOfResultsCheckboxList;
        $(".resultTypeOptions").on('change', function () {
            var value = $(this).val();
            //remove the value from savedResultTypes array if it exists
            if (savedResultTypes.includes(value)) {
                var index = savedResultTypes.indexOf(value);
                if (index > -1) {
                    savedResultTypes.splice(index, 1);
                }
            } else {
                savedResultTypes.push(value);
            }
            setSessionChart(applicationId, sessionId);
        });
    }
}

function parseCPUSlowDownMultipliersCheckList(cpuSlowDownMultipliers, applicationId, sessionId) {
    if (document.getElementById("cpuSlowDownMultipliersCheckboxList").innerHTML == "") {

        // Create checkbox list for CPU Slow Down Multipliers
        // var cpuSlowDownMultipliers = [8, 4, 1, 0];
        var cpuSlowDownMultipliersCheckboxList = "";
        for (var i = 0; i < cpuSlowDownMultipliers.length; i++) {
            cpuSlowDownMultipliersCheckboxList += '<input type="checkbox" class="cpuSlowDownMultiplierOptions" id="cpuSlowDownMultiplier' + cpuSlowDownMultipliers[i] + '" name="cpuSlowDownMultiplier" value="' + cpuSlowDownMultipliers[i] + '"';
            if (savedCpuSlowDownMultipliers.includes(cpuSlowDownMultipliers[i])) {
                cpuSlowDownMultipliersCheckboxList += ' checked';
            }
            cpuSlowDownMultipliersCheckboxList += '>';
            cpuSlowDownMultipliersCheckboxList += '<label for="cpuSlowDownMultiplier' + cpuSlowDownMultipliers[i] + '"> ' + cpuSlowDownMultipliers[i] + 'x</label><br>';
        }
        document.getElementById("cpuSlowDownMultipliersCheckboxList").innerHTML = cpuSlowDownMultipliersCheckboxList;
        $(".cpuSlowDownMultiplierOptions").on('change', function () {
            var value = $(this).val();
            //remove the value from savedCpuSlowDownMultipliers array if it exists
            if (savedCpuSlowDownMultipliers.includes(value)) {
                var index = savedCpuSlowDownMultipliers.indexOf(value);
                if (index > -1) {
                    savedCpuSlowDownMultipliers.splice(index, 1);
                }
            } else {
                savedCpuSlowDownMultipliers.push(value);
            }
            setSessionChart(applicationId, sessionId);
        });
    }
}
