# Sample Client for Website Performance Analysis Tool
## Installation of NPM Package
- Install the package globally
```` shell
npm i -g website-performance-analysis-lighthouse-draft 
````

## Usage 
Sample Config File
```json
{
    "ReportFolderRelativePath": "./docs/reports",
    "WebPage": {
        "Id": "Test-Configuration",
        "Name": "Test-Configuration",
        "Url": "https://www.google.com/",
        "Description": "Sample Description",
        "Environment": "LP"
    },
    "Application": {
        "Id": "test-website",
        "Name": "test-website",
        "Version": "1.0.0",
        "Description": "Sample Application",
        "GitUrl": "",
        "GitBranch": "master"
    },
    "ThrottlingSettings": {
        "NetworkSpeeds": [
            {
                "rttMs": 100,
                "throughputKbps": 29500
            },
            {
                "rttMs": 100,
                "throughputKbps": 35500
            }
        ],
        "CPUSlowDownMultipliers": [
            0
        ]
    }
}
```

Run Script

```javascript
import * as path from 'path';
import {
  PerformanceMonitorOrchestrator,
}
  from 'website-performance-analysis-lighthouse-draft';

async function TestConfig() {
  //get current working directory
  const configFullPath = path.join(process.cwd(), 'auditConfigurations/test-config.json');
  const auditRunner = new PerformanceMonitorOrchestrator(configFullPath);
  await auditRunner.run(false);
}
await TestConfig()
```        