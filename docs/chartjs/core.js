var chartObject;
var constants = {
    auditlistSuffix: "_auditlist.json",
    ThrottleImpactReportFileName: "web-page-throttled-audit-throttle-impact-report.json",
    reportsFolderName: "reports",
    AUDITS_NAME: "audits",
    CHART_DATA_FOLDER_NAME: "chartdata",
    ALL_KEYS: "allkeys.json",
    AUDIT_INSTANCE_ID: "auditInstanceId"
};

var baseUrl = "localhost:8000";
var applicationId = "Google_Support_Page";
var colorList = ["red", "blue", "green", "orange", "purple", "yellow", "pink", "brown", "grey", "black"];
var savedCpuSlowDownMultipliers = [];
var savedResultTypes = [];
var firstRun = true;