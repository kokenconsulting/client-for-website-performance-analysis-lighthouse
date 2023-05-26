//import { runAnalysisWithBuiltInThrottling, runAnalysisWithExternalThrottling,AppInfo, logInfo,prepareThrottlingChartDataForSession,compileDataForSession, } from '/opt/homebrew/lib/node_modules/website-performance-analysis-lighthouse-draft/index.js';
import {
    runAnalysisWithBuiltInThrottling,
    runAnalysisWithExternalThrottling,
    AppInfo,
    logInfo,
    prepareThrottlingChartDataForSession,
    createSummaryForSession,
    prepareSessionListForApp
} from 'website-performance-analysis-lighthouse-draft';
import * as path from 'path';
import * as fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

function GetAppInfoInstance() {
    const githubRepoUrl = 'https://github.com/repo';
    const githubBranchName = 'main';
    const appName = 'AppName';
    const appVersion = '0.0.1';
    const appInfo = new AppInfo(appName, appVersion, githubRepoUrl, githubBranchName, "performance folder");
    return appInfo;
}
const url = 'https://www.google.com'
const appInfo = GetAppInfoInstance();

//get current directory of the mjs file
const __dirname = path.dirname(new URL(import.meta.url).pathname);

const localReportsFolderPath = __dirname + '/reports'
if (!fs.existsSync(localReportsFolderPath)) {
    fs.mkdirSync(localReportsFolderPath);
    logInfo(`Reports folder created at ${localReportsFolderPath}`);
}

const sessionId = uuidv4();
logInfo(`session id is ${sessionId}`);

var reportsFolderAbsolutePath = path.resolve(localReportsFolderPath);
logInfo(`Saving reports to ${reportsFolderAbsolutePath}`)

await runAnalysisWithExternalThrottling(appInfo, url, reportsFolderAbsolutePath, sessionId);
await createSummaryForSession(appInfo, reportsFolderAbsolutePath, sessionId);
//wait until compile data for session is done
prepareThrottlingChartDataForSession(appInfo, sessionId, reportsFolderAbsolutePath);
prepareSessionListForApp(appInfo, reportsFolderAbsolutePath);

