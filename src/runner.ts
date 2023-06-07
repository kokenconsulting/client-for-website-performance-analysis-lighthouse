import * as path from 'path';
import {
  PerformanceMonitorOrchestrator
} from 'website-performance-analysis-lighthouse-draft';

async function TestConfig(): Promise<void> {
  //get current working directory
  const configFullPath = path.join(process.cwd(), 'auditConfigurations/test-config.json');
  const auditRunner = new PerformanceMonitorOrchestrator(configFullPath);
  await auditRunner.run(false);
}

async function GoogleSupportLP(): Promise<void> {
  //get current working directory
  const configFullPath = path.join(process.cwd(), 'auditConfigurations/Google-Support-LP.json');
  const auditRunner = new PerformanceMonitorOrchestrator(configFullPath);
  await auditRunner.run(true);
}

async function MagicRatingLandingL6(): Promise<void> {
  //get current working directory
  const configFullPath = path.join(process.cwd(), 'auditConfigurations/MagicRating-Landing-L6.json');
  const auditRunner = new PerformanceMonitorOrchestrator(configFullPath);
  await auditRunner.run(true);
}

async function MagicRatingLandingLP(): Promise<void> {
  //get current working directory
  const configFullPath = path.join(process.cwd(), 'auditConfigurations/MagicRating-Landing-LP.json');
  const auditRunner = new PerformanceMonitorOrchestrator(configFullPath);
  await auditRunner.run(true);
}

async function DCC_CS_LandingLP(): Promise<void> {
  //get current working directory
  const configFullPath = path.join(process.cwd(), 'auditConfigurations/DCC-CS-Landing-LP.json');
  const auditRunner = new PerformanceMonitorOrchestrator(configFullPath);
  await auditRunner.run(true);
}

async function runAudits(): Promise<void> {
  await DCC_CS_LandingLP();
  await MagicRatingLandingL6();  
  await MagicRatingLandingLP();

}

runAudits();
