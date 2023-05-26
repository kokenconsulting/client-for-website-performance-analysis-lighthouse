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
import * as exec from 'child_process';
const { TEST_LOGIN_NAME, TEST_LOGIN_PW, GITHUB_PAGES, DEBUG = false } = process.env;
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

const localReportsFolderPath = __dirname + '/docs/reports'
if (!fs.existsSync(localReportsFolderPath)) {
    fs.mkdirSync(localReportsFolderPath);
    logInfo(`Reports folder created at ${localReportsFolderPath}`);
}

const sessionId = uuidv4();
logInfo(`session id is ${sessionId}`);

var reportsFolderAbsolutePath = path.resolve(localReportsFolderPath);
logInfo(`Saving reports to ${reportsFolderAbsolutePath}`)


export const standardNetworkSpeeds = [
    // { rttMs: 100, throughputKbps: 1500 },
    // { rttMs: 100, throughputKbps: 2500 },
    // { rttMs: 100, throughputKbps: 5000 },
    // { rttMs: 100, throughputKbps: 10000 },
    // //{ rttMs: 100, throughputKbps: 20000 },
    // { rttMs: 100, throughputKbps: 22500 },
    // { rttMs: 100, throughputKbps: 25000 },
    // //{ rttMs: 100, throughputKbps: 27500 },
    // { rttMs: 100, throughputKbps: 28000 },
    //{ rttMs: 100, throughputKbps: 29000 },
    { rttMs: 100, throughputKbps: 29500 },
    //{ rttMs: 100, throughputKbps: 30000 },
    //{ rttMs: 100, throughputKbps: 35000 },
    //{ rttMs: 100, throughputKbps: 40000 },
    //{ rttMs: 100, throughputKbps: 45000 },
];


await runAnalysisWithExternalThrottling(appInfo, url, reportsFolderAbsolutePath, sessionId,[0],standardNetworkSpeeds);
await createSummaryForSession(appInfo, reportsFolderAbsolutePath, sessionId);
//wait until compile data for session is done
prepareThrottlingChartDataForSession(appInfo, sessionId, reportsFolderAbsolutePath);
prepareSessionListForApp(appInfo, reportsFolderAbsolutePath);
// await pushChanges();
// async function pushChanges(){
//     try {
//         await terminal(`git config --global user.email 'ci.automation@example.com'`);
//         await terminal(`git config --global user.name 'CI Automation'`);
//         await terminal(`git add --all`);
//         await terminal(`git commit -m 'Lighthouse tests'`);
//         await terminal(
//             `git push https://${GITHUB_PAGES}@github.com/FedEx/eai-3536169-frontend.git HEAD:debug-lighthouse -f`,
//         );
//     } catch (err) {
//         console.error(err);
//         process.exit(1);
//     }
// }

// const terminal = (command) =>
//     new Promise((resolve, reject) => {
//         const commandLine = exec(command);
//         let output = '';
//         let error = '';

//         commandLine.stdout.on('data', (data) => {
//             const outputString = data.toString();
//             output += outputString;
//             console.log(outputString);
//         });

//         commandLine.stderr.on('data', (data) => {
//             const errorString = data.toString();
//             error += errorString;
//             console.error(errorString);
//         });

//         commandLine.on('exit', (code) => {
//             resolve({
//                 output,
//                 error,
//                 code: code.toString(),
//             });
//         });
//     });
