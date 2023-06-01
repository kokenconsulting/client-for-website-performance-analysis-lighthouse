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

async function GoogleSupportLP() {
  //get current working directory
  const configFullPath = path.join(process.cwd(), 'auditConfigurations/Google-Support-LP.json');
  const auditRunner = new PerformanceMonitorOrchestrator(configFullPath);
  await auditRunner.run(true);
}
async function MagicRatingLandingL6() {
  //get current working directory
  const configFullPath = path.join(process.cwd(), 'auditConfigurations/MagicRating-Landing-L6.json');
  const auditRunner = new PerformanceMonitorOrchestrator(configFullPath);
  await auditRunner.run(true);
}
async function MagicRatingLandingLP() {
  //get current working directory
  const configFullPath = path.join(process.cwd(), 'auditConfigurations/MagicRating-Landing-LP.json');
  const auditRunner = new PerformanceMonitorOrchestrator(configFullPath);
  await auditRunner.run(true);
}

//await TestConfig();

//await GoogleSupportLP();
//await MagicRatingLandingL6();
await MagicRatingLandingLP();