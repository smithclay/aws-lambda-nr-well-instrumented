'use strict';

const aws = require('aws-sdk');
const codedeploy = new aws.CodeDeploy({apiVersion: '2014-10-06'});

exports.handler = (event, context, callback) => {

    console.log(`Entering PostTraffic Hook for ${process.env.CurrentVersion}`);
    console.log(JSON.stringify(event));
    
    // Read the DeploymentId from the event payload.
    var deploymentId = event.DeploymentId;
    console.log(deploymentId);

    //Read the LifecycleEventHookExecutionId from the event payload
    var lifecycleEventHookExecutionId = event.LifecycleEventHookExecutionId;
    console.log(lifecycleEventHookExecutionId);

    /*
        Query New Relic for count of JavaScript errors with new release
    */
    try {     
        const version = parseInt(process.env.CurrentVersion.split(":").slice(-1)[0], 10);
        // TODO: Run this query in New Relic
        console.log(`SELECT count(*) FROM JavaScriptError WHERE releaseIds='{"functionVersion":"${version}"}' SINCE 10 minutes ago`)
    } catch (e) {
        return callback('Could not parse version information');
    }



    // Prepare the validation test results with the deploymentId and
    // the lifecycleEventHookExecutionId for AWS CodeDeploy.
    var params = {
        deploymentId: deploymentId,
        lifecycleEventHookExecutionId: lifecycleEventHookExecutionId,
        status: 'Succeeded' // status can be 'Succeeded' or 'Failed'
    };
    
    // Pass AWS CodeDeploy the prepared validation test results.
    codedeploy.putLifecycleEventHookExecutionStatus(params, function(err, data) {
        if (err) {
            // Validation failed.
            console.log('Validation test failed');
            console.log(err);
            console.log(data);
            callback('Validation test failed');
        } else {
            // Validation succeeded.
            console.log('Validation test succeeded');
            callback(null, 'Validation test succeeded');
        }
    });
}
