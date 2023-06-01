// Upon selection of drowdownlist value, call setSessionChart value
function setAuditChartData(webAppId, webPageId, env, throttledAuditGroupId) {
    const url = DATA_SOURCES.THROTTLED_AUDIT_SUMMARY_CHART_DATA(webAppId, webPageId, env,throttledAuditGroupId)
    fetch(url)
        .then(response => response.json())
        .then(data => processCPUSlowDownMultiplierResultsUponRequestSuccess(data, applicationId, throttledAuditGroupId));
}

function processCPUSlowDownMultiplierResultsUponRequestSuccess(data, applicationId, throttledAuditGroupId) {

    var cpuSlowDownMultipliers = [];
    var resultTypes = [];
    generateOptionsForChart(cpuSlowDownMultipliers, resultTypes, applicationId, throttledAuditGroupId);
    generateDataForChartOptions(data, cpuSlowDownMultipliers, resultTypes);

    var dataSetValues = [];
    //given data: data.cpuSlowDownMultiplierResultsList.interactiveResult, loop
    //through each key and create a dataset object
    var currentColorIndex = 0;
    currentColorIndex = processResultTypeInterActiveResult(data, currentColorIndex, dataSetValues);
    currentColorIndex = processResultTypeSpeedIndex(data, currentColorIndex, dataSetValues);
    //given data: data.cpuSlowDownMultiplierResultsList.speedIndex, loop
    //through each key and create a dataset object
    //keep same color counters
    generateChartOnPage(currentColorIndex, data, dataSetValues, throttledAuditGroupId);
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

function generateOptionsForChart(cpuSlowDownMultipliers, resultTypes, applicationId, throttledAuditGroup) {
    //run this function only if cpuSlowDownMultipliersCheckboxList innerHtml is empty
    parseCPUSlowDownMultipliersCheckList(cpuSlowDownMultipliers, applicationId, throttledAuditGroup);
    parseResultTypeCheckList(resultTypes, applicationId, throttledAuditGroup);
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


function generateChartOnPage(currentColorIndex, data, dataSetValues, throttledAuditGroupId) {
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
                    text: "Network Speed (kbps)"
                }
            }
        }
    };

    const ctx = document.getElementById("webPageAuditChart").getContext("2d");
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