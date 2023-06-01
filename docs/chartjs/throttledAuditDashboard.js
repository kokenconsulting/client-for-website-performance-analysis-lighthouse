
$(document).ready(function () {
    // populateSessionDropDownListData(applicationId);
    // $('#dropdown').change(function () {
    //     var sessionId = $(this).val();
    //     setAuditChartData(applicationId, sessionId);
    // });
});

function populateSessionDropDownListData(applicationId) {
    let url = constants.baseUrl + '/' + constants.reportsFolderName + '/' + applicationId + '/' + applicationId + constants.auditlistSuffix;
    url= constants.reportsFolderName + '/' + applicationId + '/' + applicationId + constants.auditlistSuffix;
    console.log("url: " + url);
    // AJAX request to get dropdown data
    $.ajax({
        url: url,
        type: 'GET',
        success: function (data) {
            // Populate dropdown with data
            var dropdown = $('#dropdown');
            //reset dropdown list 
            dropdown.empty();
            dropdown.append('<option selected="true" disabled>Choose Session</option>');
            $.each(data[constants.AUDITS_NAME], function (key, value) {
                //console.log(key + " " + JSON.stringify(value))
                const ddOptionValue = value[constants.AUDIT_INSTANCE_ID];
                const ddOptionKey = `${applicationId}-${value[constants.AUDIT_INSTANCE_ID]}-${value.endDateTime}`
                dropdown.append($('<option></option>').attr('value', ddOptionValue).text(ddOptionKey));
            });
        },
        error: function (data) {
            console.log("error: " + data)
            alert("Error getting session list data");
        }
    });
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
            setApplicationChartData(applicationId, sessionId);
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
            setApplicationChartData(applicationId, sessionId);
        });
    }
}