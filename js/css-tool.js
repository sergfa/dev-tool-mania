(function () {
	"use strict";

	const ACTION_FAILED_MSG = "<strong>Error!</strong> Something went wrong. Please fix the css and try again.";
	const FILE_MODE_CSS = 'css';

	let fileMode = FILE_MODE_CSS;

	const beautifyOptions = {
		format: {
			breaks: {
				afterAtRule: true,
				afterBlockBegins: true,
				afterBlockEnds: true,
				afterComment: true,
				afterProperty: true,
				afterRuleBegins: true,
				afterRuleEnds: true,
				beforeBlockEnds: true,
				betweenSelectors: true
			},
			indentBy: 4,
			indentWith: 'space',
			spaces: {
				aroundSelectorRelation: true,
				beforeBlockBegins: true,
				beforeValue: true
			},
			wrapAt: false
		}
	};

	function calculateSize(){
		const sizeOutput = editorOut.getValue().length;
		const sizeInput = editorInput.getValue().length;
		$('#output-length').text(sizeOutput+'');
		$('#source-length').text(sizeInput+'');
		const efficiency = DevUtils.calculateEfficienty(sizeOutput, sizeInput);
		$('#efficiency').text(efficiency);
	}

	$('.editors-container').height(700).split({
		orientation: 'vertical',
		limit: 10,
		position: '40%', // if there is no percentage it interpret it as pixels
		onDrag: function () {
			editorInput.resize();
			editorOut.resize();
		}
	});

	//Start private functions
	function showMessage(msg) {
		const $messageBox = $('#err-message');
		$messageBox.html(msg);
	}
	//

	//Start create input editor
	const editorInput = ace.edit("leftPane");
	editorInput.setTheme("ace/theme/twilight");
	editorInput.getSession().setMode("ace/mode/css");
	const example = "p {color: red; text-align: center;}";
	editorInput.setValue(example);
	editorInput.$blockScrolling = Infinity;

	//End create input editor

	//Start create output editor
	const editorOut = ace.edit("rightPane");
	editorOut.setTheme("ace/theme/twilight");
	editorOut.getSession().setMode("ace/mode/css");
	editorOut.setReadOnly(true);
	editorOut.$blockScrolling = Infinity;
	//End create output editor

	//Start add click listeners to action buttons
	$('#btn-clear').on("click", function () {
		editorInput.setValue("");
		editorOut.setValue("");
		showMessage("<strong>Success!</strong> All cleared.", 'success');
	});


	$('#btn-beautify').on("click", function () {
		try {
			const input = editorInput.getValue();
			const output = new CleanCSS(beautifyOptions).minify(input);
			editorOut.getSession().setMode("ace/mode/css");
			if(output.errors && output.errors.length > 0 || (output.warnings && output.warnings.length > 0)){
				showMessage(ACTION_FAILED_MSG, 'danger');
			}else{
				editorOut.setValue(output.styles);
				calculateSize();
				showMessage("<strong>Success!</strong> CSS has been beautified successfully.", 'success');
				fileMode = FILE_MODE_CSS;
			}
		
		}
		catch (err) {
			editorOut.setValue("");
			showMessage(ACTION_FAILED_MSG, 'danger');
		}


	});

	$('#btn-minify').on("click", function () {
		try {
			const input = editorInput.getValue();
			editorOut.getSession().setMode("ace/mode/css");
			const output = new CleanCSS({}).minify(input);
			if(output.errors && output.errors.length > 0 || (output.warnings && output.warnings.length > 0)){
				showMessage(ACTION_FAILED_MSG, 'danger');
			}else{
				editorOut.setValue(output.styles);
				calculateSize();
				showMessage("<strong>Success!</strong> CSS has been minified successfully.", 'success');
				fileMode = FILE_MODE_CSS;

			}
		}
		catch (err) {
			editorOut.setValue("");
			showMessage(ACTION_FAILED_MSG, 'danger');
		}


	});

	$('#btn-copy').on('click', function () {
		editorOut.selectAll();
		editorOut.focus();
		document.execCommand('copy');
		showMessage("<strong>Success!</strong> CSS has been copied successfully.", 'success');

	});


	$('#btn-save').on("click", function () {
		try {
			const text = editorOut.getValue();
			const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
			saveAs(blob, "output." + fileMode);
			showMessage("<strong>Success!</strong> CSS has been saved successfully.", 'success');
		}
		catch (err) {
			showMessage(ACTION_FAILED_MSG, 'danger');
		}

	});





	//End add click listeners to action buttons

})();