"use strict";
 
 const $alertContainer = $('#alert-container');

// Initialize the Amazon Cognito credentials provider
AWS.config.region = 'us-east-1'; // Region
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
	IdentityPoolId: 'us-east-1:b193ee3b-a701-44b6-88d1-1b2838f5f58c',
});


$('#btn-submit-msg').on('click', sendToTopic);

$alertContainer.hide();

function sendToTopic() {
		   
			const sns = new AWS.SNS();
			const contactName = $('#contactName').val();
			const contactEmail = $('#contactEmail').val();
			const contactMsg = $('#contactMsg').val();
			if(!contactName || !contactEmail || !contactMsg){
				$alertContainer.removeClass();
				$alertContainer.addClass("alert-danger").addClass('alert');
				$('#alert-message').text('Please fill in all fields!');
				$alertContainer.show();
				return;
			}
			const msg ="From: " + contactName + ", Email: "+  contactEmail+ ", Message: " + contactMsg;
			const params = {
				Message:  msg,
				Subject: 'DevToolMania - contact form',
				TopicArn: 'arn:aws:sns:us-east-1:579390887961:com-dev-tool-mania-contact-form'
			};
			$('.alert').hide();
		    sns.publish(params, function(err) {
				if (err){
					$alertContainer.removeClass();
					$alertContainer.addClass("alert-danger").addClass('alert');
					$('#alert-message').text('Something went wrong. Please try again later.');
					$alertContainer.show();
			}
				else{
					$alertContainer.removeClass();
					$alertContainer.addClass("alert-success").addClass('alert');
					$('#alert-message').text('Your message has been successfully sent. Thank you for getting in touch!');
					$alertContainer.show();
			}
					 
			});
}