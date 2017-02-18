"use strict";
// Initialize the Amazon Cognito credentials provider
AWS.config.region = 'us-east-1'; // Region
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: 'us-east-1:b193ee3b-a701-44b6-88d1-1b2838f5f58c',
});


$('#btn-submit-msg').on('click', sendToTopic);


function sendToTopic() {
            const sns = new AWS.SNS();
            const contactName = $('#contactName').val();
            const contactEmail = $('#contactEmail').val();
            const contactMsg = $('#contactMsg').val();
            const msg ="From: " + contactName + ", Email: "+  contactEmail+ ", Message: " + contactMsg;
            const params = {
                //Message: 'Hello topic', /* required */
                Message:  msg,
                Subject: 'DevToolMania - contact form',
                TopicArn: 'arn:aws:sns:us-east-1:579390887961:com-dev-tool-mania-contact-form'
            };
            sns.publish(params, function(err, data) {
                if (err){
                    console.log(err, err.stack); // an error occurred
                }
                else{
                    console.log(data);           // successful response
                }
                     
            });
}