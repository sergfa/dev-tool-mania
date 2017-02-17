(function () {
	"use strict";

	const ACTION_FAILED_MSG = "<strong>Error!</strong> Something went wrong. Please fix the js and try again.";
	const FILE_MODE_JS = 'js';

	let fileMode = FILE_MODE_JS;

	
	function calculateSize() {
		const sizeOutput = editorOut.getValue().length;
		const sizeInput = editorInput.getValue().length;
		$('#output-length').text(sizeOutput + '');
		$('#source-length').text(sizeInput + '');
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
	editorInput.getSession().setMode("ace/mode/javascript");
	const oldInput = DevUtils.retrieveItem("js-input");
	const example = oldInput ? oldInput : "function getX(){return x;}";
	editorInput.setValue(example);
	editorInput.$blockScrolling = Infinity;
	editorInput.getSession().on('change', function () {
		const text = editorInput.getValue();
		DevUtils.storeItem("js-input", text);
	});

	//End create input editor

	//Start create output editor
	const editorOut = ace.edit("rightPane");
	editorOut.setTheme("ace/theme/twilight");
	editorOut.getSession().setMode("ace/mode/javascript");
	editorOut.setReadOnly(true);
	editorOut.$blockScrolling = Infinity;
	//End create output editor

	//Start add click listeners to action buttons
	$('#btn-clear').on("click", function () {
		editorInput.setValue("");
		editorOut.setValue("");
		showMessage("<strong>Success!</strong> All cleared.", 'success');
	});


	$('#btn-uglify').on("click", function () {
		try {
			const input = editorInput.getValue();
			let ast = UglifyJS.parse(input);
			// compressor needs figure_out_scope too
			ast.figure_out_scope();
			const compressor = UglifyJS.Compressor({});
			ast = ast.transform(compressor);
			// need to figure out scope again so mangler works optimally
			ast.figure_out_scope();
			ast.compute_char_frequency();
			ast.mangle_names();
			// get Ugly code back :)
			const code = ast.print_to_string();
			editorOut.setValue(code);
			calculateSize();
			showMessage("<strong>Success!</strong> JS has been uglified successfully.", 'success');
			fileMode = FILE_MODE_JS;
		}
		catch (err) {
			editorOut.setValue("");
			showMessage(ACTION_FAILED_MSG + " " + err.message, 'danger');
		}


	});

	$('#btn-minify').on("click", function () {
		try {
			const input = editorInput.getValue();
			let ast = UglifyJS.parse(input);
			ast.figure_out_scope();
			const compressor = UglifyJS.Compressor({  });
			ast = ast.transform(compressor);
			const output = ast.print_to_string(); // get compressed code
			editorOut.setValue(output);
			calculateSize();
			showMessage("<strong>Success!</strong> JS has been minified successfully.", 'success');
			fileMode = FILE_MODE_JS;

		}
		catch (err) {
			editorOut.setValue("");
			showMessage(ACTION_FAILED_MSG + " " + err.message, 'danger');
		}


	});

	$('#btn-copy').on('click', function () {
		editorOut.selectAll();
		editorOut.focus();
		document.execCommand('copy');
		showMessage("<strong>Success!</strong> JS has been copied successfully.", 'success');

	});


	$('#btn-save').on("click", function () {
		try {
			const text = editorOut.getValue();
			const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
			saveAs(blob, "output." + fileMode);
			showMessage("<strong>Success!</strong> JS has been saved successfully.", 'success');
		}
		catch (err) {
			showMessage(ACTION_FAILED_MSG, 'danger');
		}

	});





	//End add click listeners to action buttons

})();