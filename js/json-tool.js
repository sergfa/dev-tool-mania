	(function () {
		"use strict";
		
		const ACTION_FAILED_MSG ="<strong>Error!</strong> Something went wrong. Please fix the json and try again.";
		
		
		$('.editors-container').height(600).split({
			orientation: 'vertical',
			limit: 10,
			position: '25%', // if there is no percentage it interpret it as pixels
			onDrag: function () {
				editorInput.resize();
				editorOut.resize();
		}
		});
	
		//Start private functions
		function showMessage(msg){
			const $messageBox = $('#err-message');
			$messageBox.html(msg);
		}
		//

		//Start create input editor
		const editorInput = ace.edit("leftPane");
		editorInput.setTheme("ace/theme/twilight");
		editorInput.getSession().setMode("ace/mode/json");
		const jsonExample = { name: "John", age: 31, city: "New York" };
		editorInput.setValue(JSON.stringify(jsonExample, null, 1));
		editorInput.$blockScrolling = Infinity;


		editorInput.getSession().on("changeAnnotation", function () {
  		const annot = editorInput.getSession().getAnnotations();

  		for (let key in annot) {
    		if (annot.hasOwnProperty(key)){
				console.log(annot[key].text + "on line " + " " + annot[key].row);
			}
      		
  		}
		});
		//End create input editor

		//Start create output editor
		const editorOut = ace.edit("rightPane");
		editorOut.setTheme("ace/theme/twilight");
		editorOut.getSession().setMode("ace/mode/json");
		editorOut.setReadOnly(true);
		editorOut.$blockScrolling = Infinity;
		//End create output editor

		//Start add click listeners to action buttons
		$('#btn-clear').on("click",function(){
			editorInput.setValue("");
			editorOut.setValue("");
			showMessage("<strong>Success!</strong> All cleared.", 'success');
		});


		$('#btn-beautify').on("click",function(){
			try{
				const input = JSON.parse(editorInput.getValue());
				editorOut.setValue(JSON.stringify(input, null, 4));
				showMessage("<strong>Success!</strong> JSON has been beautified successfully.", 'success');
			}
			catch(err){
				editorOut.setValue("");
				showMessage(ACTION_FAILED_MSG, 'danger');
			}	


		});

		$('#btn-minify').on("click",function(){
			try{
				const input = JSON.parse(editorInput.getValue());
				editorOut.setValue(JSON.stringify(input, null, 0));
				showMessage("<strong>Success!</strong> JSON has been minified successfully.", 'success');
			}
			catch(err){
				editorOut.setValue("");
				showMessage(ACTION_FAILED_MSG, 'danger');
			}	


		});

		$('#btn-copy').on('click', function() {
  			editorOut.selectAll();
  			editorOut.focus();
  			document.execCommand('copy');
  			showMessage("<strong>Success!</strong> JSON has been copied successfully.", 'success');
			  
		});


		$('#btn-save').on("click",function(){
			try{
				const text = editorOut.getValue();
				const blob = new Blob([text], {type: "text/plain;charset=utf-8"});
				saveAs(blob, "json-output.json");
				showMessage("<strong>Success!</strong> JSON has been saved successfully.", 'success');
			}
			catch(err){
				showMessage(ACTION_FAILED_MSG, 'danger');
			}	

		});

		
		//End add click listeners to action buttons

	})();