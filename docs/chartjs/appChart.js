const webApplicationKeysListDdId = "webApplicationKeysList"
const webApplicationChartId = "webApplicationAuditChart";
$(document).ready(function () {
    // populateApplicationKeyListDropdownlist(applicationId);
    // $('#' + webApplicationKeysListDdId).change(function () {
    //     var optionId = $(this).val();
    //     setApplicationChartData(applicationId, optionId);
    // });
});

function populateApplicationKeyListDropdownlist(applicationId) {
    let url = constants.reportsFolderName + '/' + applicationId + '/' + constants.ALL_KEYS;
    console.log("url: " + url);
    // AJAX request to get dropdown data
    $.ajax({
        url: url,
        type: 'GET',
        success: function (data) {
            // Populate dropdown with data
            var dropdown = $('#' + webApplicationKeysListDdId);
            //reset dropdown list 
            dropdown.empty();
            dropdown.append('<option selected="true" disabled>Choose Option</option>');
            $.each(data, function (key, value) {
                //console.log(key + " " + JSON.stringify(value))
                const ddOptionValue = value;
                const ddOptionKey = `${value}`
                dropdown.append($('<option></option>').attr('value', ddOptionValue).text(ddOptionKey));
            });
        },
        error: function (data) {
            console.log("error: " + data)
            alert("Error getting list data");
        }
    });
}

// Upon selection of drowdownlist value, call setSessionChart value
function setApplicationChartData(applicationId, optionId) {
    fetch(constants.reportsFolderName + '/' + applicationId + '/' + constants.CHART_DATA_FOLDER_NAME + '/' + optionId + ".json")
        .then(response => response.json())
        .then(data => processChartData(data, applicationId, optionId));
}
function processChartData(data, applicationId, throttledAuditGroupId) {
    //TODOs
    let currentColorIndex = 0;
    let labels = processApplicationLabels(data);

    let dataSetValues = [];
    currentColorIndex =  processApplicationInteractive(currentColorIndex,dataSetValues,data);
    currentColorIndex = processApplicationSpeedIndex(currentColorIndex,dataSetValues,data);
    generateApplicationChartOnPage(currentColorIndex, labels, dataSetValues, throttledAuditGroupId)
}

function processApplicationLabels(data) {
    let labels = [];
    //loop over array in data.throttledAuditGroupId
    for (const key in data.throttledAuditGroupId) {
        const label = data.throttledAuditGroupId[key].startDateTime;
        labels.push(label);
    }
    return labels;
}

function processApplicationInteractive(currentColorIndex,dataSetValues,data){
    var dataSet = {
        label: "Interactive Result",
        data: data.interactive,
        borderColor: colorList[currentColorIndex],
        fill: false
    };
    currentColorIndex = currentColorIndex + 1;
    dataSetValues.push(dataSet);
    return currentColorIndex;
}
function processApplicationSpeedIndex(currentColorIndex,dataSetValues,data){
    var dataSet = {
        label: "Speed Intext Result",
        data: data.speedIndex,
        borderColor: colorList[currentColorIndex],
        fill: false
    };
    currentColorIndex = currentColorIndex + 1;
    dataSetValues.push(dataSet);
    return currentColorIndex;
}

function generateApplicationChartOnPage(currentColorIndex, labels, dataSetValues, throttledAuditGroupId) {
    const chartData = {
        labels: labels,
        datasets: dataSetValues,
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            title: {
                display: true,
                text: "Performance Results - " + throttledAuditGroupId
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
                    text: "Audit Instance"
                }
            }
        }
    };

    const ctx = document.getElementById(webApplicationChartId).getContext("2d");
    //destroy chart if it already exists
    if (typeof chartObject !== "undefined") {
        chartObject.destroy();
    }
    chartObject = new Chart(ctx, {
        type: "line",
        data: chartData,
        options: chartOptions
    });
}