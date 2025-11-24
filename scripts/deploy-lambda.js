const {
  LambdaClient,
  UpdateFunctionCodeCommand,
} = require("@aws-sdk/client-lambda");
const { readFileSync } = require("fs");
const { join } = require("path");

const lambdaClient = new LambdaClient({ region: "us-east-1" });

async function deployLambda(functionName, zipFilePath) {
  try {
    const zipFile = readFileSync(zipFilePath);

    const command = new UpdateFunctionCodeCommand({
      FunctionName: functionName,
      ZipFile: zipFile,
    });

    const response = await lambdaClient.send(command);
    console.log(`✅ ${functionName} deployed successfully:`);
    console.log(`   Version: ${response.Version}`);
    console.log(`   Last Modified: ${response.LastModified}`);
  } catch (error) {
    console.error(`❌ Error deploying ${functionName}:`, error.message);
    throw error;
  }
}

// Export para uso em GitHub Actions
module.exports = { deployLambda };
