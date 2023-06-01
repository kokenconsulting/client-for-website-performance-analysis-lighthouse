var mainChartObject;
class DATA_SOURCES {
    static REPORTS_FOLDER_NAME() {
        return "reports";
    }
    static CHART_DATA_FOLDER_NAME() {
        return "chartdata";
    }
    static AUDITS_FOLDER_NAME() {
        return "throttledAudits";
    }

    static WEBAPP_LIST_ENDPOINT() {
        return `${DATA_SOURCES.REPORTS_FOLDER_NAME()}/web-application-list-report.json`
    }
    static WEBPAGE_LIST_ENDPOINT(webappId) {
        return `${DATA_SOURCES.REPORTS_FOLDER_NAME()}/${webappId}/web-page-list-report.json`
    }
    static ENVIRONMENT_LIST_ENDPOINT(webappId, webPageId) {
        return `${DATA_SOURCES.REPORTS_FOLDER_NAME()}/${webappId}/${webPageId}/web-page-environment-list-report.json`
    }
    static ENVIRONMENT_THROTTLE_OPTIONS_ENDPOINT(webappId, webPageId, env) {
        return `${DATA_SOURCES.REPORTS_FOLDER_NAME()}/${webappId}/${webPageId}/${env}/web-page-environment-throttle-settings.json`
    }
    static ENVIRONMENT_THROTTLED_AUDIT_CHART_DATA(webappId, webPageId, env, cpu, network) {
        return `${DATA_SOURCES.REPORTS_FOLDER_NAME()}/${webappId}/${webPageId}/${env}/${DATA_SOURCES.CHART_DATA_FOLDER_NAME()}/cpu_${cpu}_${network}_web-page-environment-specific-throttle-setting-throttle-impact-report.json`
    }
    static THROTTLED_AUDIT_SUMMARY_CHART_DATA(webappId, webPageId, env, throttledAuditGroupId) {
        return `${DATA_SOURCES.REPORTS_FOLDER_NAME()}/${webappId}/${webPageId}/${env}/${DATA_SOURCES.AUDITS_FOLDER_NAME()}/${throttledAuditGroupId}/${DATA_SOURCES.CHART_DATA_FOLDER_NAME()}/web-page-throttled-audit-throttle-impact-report.json`
    }
}

var COCKPIT_ELEMENTS = {
    webAppListDDL: {
        id: "webAppListDDL",
        ajaxResponseDataProperty: "webApplicationList"
    },
    webPageListDDL: {
        id: "webPageListDDL",
        ajaxResponseDataProperty: "webPageList"
    },
    envListDDL: {
        id: "envListDDL",
        ajaxResponseDataProperty: "environmentList"
    },
    cpuOptionsDDL: {
        id: "cpuOptionsDDL",
        ajaxResponseDataProperty: "cpuSlowDownMultiplierList"
    },
    networkThrottleOptionsDDL: {
        id: "networkThrottleOptionsDDL",
        ajaxResponseDataProperty: "networkSpeedList"
    },
    environmentAuditResultsChart: {
        id: "environmentAuditResultsChart",
        ajaxResponseDataProperty: "environmentAuditResultsChartData"
    }
}

function ajaxCall(url, fnSuccessCallback) {
    $.ajax({
        url: url,
        type: 'GET',
        success: fnSuccessCallback,
        error: function (data) {
            console.log("error: " + data)
            alert("Error getting data for url: " + url + "");
        }
    });
};

$(document).ready(function () {
    setWebApplicationList();
});


function setWebApplicationList() {
    url = DATA_SOURCES.WEBAPP_LIST_ENDPOINT();
    const $ddl = $(`#${COCKPIT_ELEMENTS.webAppListDDL.id}`);
    // AJAX request to get dropdown data
    ajaxCall(url, function (ajaxResponseData) {
        populateWebApplicationListDDLOptions($ddl, ajaxResponseData);
    });
    $ddl.change(function () {
        var webAppId = $(this).val();
        setWebPageList(webAppId);
    });
}
function cleanDDL($ddl, addDefaultOption = true) {
    $ddl.empty();
    if (addDefaultOption) {
        $ddl.append('<option selected="true" disabled>Please Choose Option</option>');
    }
}
function populateWebApplicationListDDLOptions($ddl, ajaxResponseData) {
    cleanDDL($ddl);
    $.each(ajaxResponseData[COCKPIT_ELEMENTS.webAppListDDL.ajaxResponseDataProperty], function (key, value) {
        //console.log(key + " " + JSON.stringify(value))
        const ddOptionValue = value;
        const ddOptionKey = `${value}`
        $ddl.append($('<option></option>').attr('value', ddOptionValue).text(ddOptionKey));
    });
};

function setWebPageList(webAppId) {
    url = DATA_SOURCES.WEBPAGE_LIST_ENDPOINT(webAppId);
    const $ddl = $(`#${COCKPIT_ELEMENTS.webPageListDDL.id}`);
    // AJAX request to get dropdown data
    ajaxCall(url, function (ajaxResponseData) {
        populateWebPagesListDDLOptions($ddl, ajaxResponseData);
    });
    $ddl.change(function () {
        var webPageId = $(this).val();
        setEnvironmentList(webAppId, webPageId)
    });
}

function populateWebPagesListDDLOptions($ddl, ajaxResponseData) {
    cleanDDL($ddl);
    $.each(ajaxResponseData[COCKPIT_ELEMENTS.webPageListDDL.ajaxResponseDataProperty], function (key, value) {
        //console.log(key + " " + JSON.stringify(value))
        const ddOptionValue = value;
        const ddOptionKey = `${value}`
        $ddl.append($('<option></option>').attr('value', ddOptionValue).text(ddOptionKey));
    });
};

function setEnvironmentList(webAppId, webPageId) {
    url = DATA_SOURCES.ENVIRONMENT_LIST_ENDPOINT(webAppId, webPageId);
    const $ddl = $(`#${COCKPIT_ELEMENTS.envListDDL.id}`);
    // AJAX request to get dropdown data
    ajaxCall(url, function (ajaxResponseData) {
        populateEnvironmentListDDLOptions($ddl, ajaxResponseData);
    });

    $ddl.change(function () {
        var env = $(this).val();
        setEnvironmentThrottleOptions(webAppId, webPageId, env)
    });
}

function populateEnvironmentListDDLOptions($ddl, ajaxResponseData) {
    cleanDDL($ddl);
    $.each(ajaxResponseData[COCKPIT_ELEMENTS.envListDDL.ajaxResponseDataProperty], function (key, value) {
        //console.log(key + " " + JSON.stringify(value))
        const ddOptionValue = value;
        const ddOptionKey = `${value}`
        $ddl.append($('<option></option>').attr('value', ddOptionValue).text(ddOptionKey));
    });
};

function setEnvironmentThrottleOptions(webAppId, webPageId, env) {
    function generateChart() {
        var cpuOption = $cpuddl.val();
        var network = $networkddl.val();
        generateEnvChart(webAppId, webPageId, env, cpuOption, network);
    }
    url = DATA_SOURCES.ENVIRONMENT_THROTTLE_OPTIONS_ENDPOINT(webAppId, webPageId, env);
    const $cpuddl = $(`#${COCKPIT_ELEMENTS.cpuOptionsDDL.id}`);
    const $networkddl = $(`#${COCKPIT_ELEMENTS.networkThrottleOptionsDDL.id}`);
    // AJAX request to get dropdown data
    ajaxCall(url, function (ajaxResponseData) {
        populateEnvironmentThrottleDDLOptions($cpuddl, $networkddl, ajaxResponseData);
        generateChart();
    });

    $cpuddl.change(function () {
        generateChart();


    });
    $networkddl.change(function () {
        generateChart()
    });
}

function populateEnvironmentThrottleDDLOptions($cpuddl, $networkddl, ajaxResponseData) {
    cleanDDL($cpuddl, false);
    cleanDDL($networkddl, false);
    $.each(ajaxResponseData[COCKPIT_ELEMENTS.cpuOptionsDDL.ajaxResponseDataProperty], function (key, value) {
        const ddOptionValue = value;
        const ddOptionKey = `${value}`
        $cpuddl.append($('<option></option>').attr('value', ddOptionValue).text(ddOptionKey));
    });
    $.each(ajaxResponseData[COCKPIT_ELEMENTS.networkThrottleOptionsDDL.ajaxResponseDataProperty], function (key, value) {
        const ddOptionValue = value;
        const ddOptionKey = `${value}`
        $networkddl.append($('<option></option>').attr('value', ddOptionValue).text(ddOptionKey));
    });
};

function generateEnvChart(webAppId, webPageId, env, cpuOption, network) {
    const url = DATA_SOURCES.ENVIRONMENT_THROTTLED_AUDIT_CHART_DATA(webAppId, webPageId, env, cpuOption, network);
    fetch(url)
        .then(response => response.json())
        .then(data => processChartData(data, webAppId, webPageId, env, cpuOption, network));
}

function processChartData(data, webAppId, webPageId, env, cpuOption, network) {
    //TODOs
    let currentColorIndex = 0;
    let dataSetValues = [];
    let labels = processApplicationLabels(data);

    //loop over the keys and values of data.listOfDataSets object
    for (const [key, value] of Object.entries(data.listOfDataSets)) {
        const dataSet = {
            label: key,
            data: value,
            borderColor: colorList[currentColorIndex],
            fill: false
        };
        currentColorIndex = currentColorIndex + 1;
        dataSetValues.push(dataSet);
    }

    generateApplicationChartOnPage(labels, dataSetValues, webAppId, webPageId, env, cpuOption, network)
}

function processApplicationLabels(data) {
    return data.labels;
}

function generateApplicationChartOnPage(labels, dataSetValues, webAppId, webPageId, env, cpuOption, network) {
    const chartData = {
        labels: labels,
        datasets: dataSetValues,
    };

    const chartOptions = {
        onClick: (evt) => {
            var activePoints = mainChartObject.getElementsAtEventForMode(evt, 'nearest', { intersect: false });
            console.log(activePoints);
            if (activePoints.length) {
                const firstPoint = activePoints[0];
                var labelIndex = firstPoint.index;
                var datasetIndex = firstPoint.datasetIndex;
                const label = mainChartObject.data.labels[firstPoint.index];
                const value = mainChartObject.data.datasets[firstPoint.datasetIndex].data[firstPoint.index];
                console.log(label);
                //audit instance id is second part of label split with -
                const throttledAuditGroupId = label.split("Z-")[1];
                console.log(value);
                console.log(datasetIndex);
                console.log("audit instance id"+throttledAuditGroupId);
                setAuditChartData(webAppId, webPageId, env, throttledAuditGroupId)
            }
        },
        interaction: {
            intersect: false,
            mode: 'point',
        },
        responsive: true,
        plugins: {
            title: {
                display: true,
                text: `Environment Audit Results for Web Application - ${webAppId} - Web Page ${webPageId} - Environment ${env} - CPU Slow Down Multiplier - ${cpuOption} - Network Throttling Setting -  ${network}`
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
                    text: "Audit Start Date Time"
                }
            }
        }
    };

    const ctx = document.getElementById(COCKPIT_ELEMENTS.environmentAuditResultsChart.id).getContext("2d");
    //destroy chart if it already exists
    if (typeof mainChartObject !== "undefined") {
        mainChartObject.destroy();
    }
    mainChartObject = new Chart(ctx, {
        type: "line",
        events: ['click'],
        data: chartData,
        options: chartOptions
    });
}




