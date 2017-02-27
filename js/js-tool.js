(function () {
	"use strict";

	const ACTION_FAILED_MSG = "<strong>Error!</strong> Something went wrong. Please fix the js and try again.";
	const FILE_MODE_JS = 'js';

	let fileMode = FILE_MODE_JS;

	const settings_instructions =

		`<pre><span>//default minify settings</span>
		<span class="inst-property">sequences</span>     : <span class="inst-value">true</span>,  <span class="inst-comment">// join consecutive statemets with the “comma operator</span>
		<span class="inst-property">properties</span>    : <span class="inst-value">true</span>,  <span class="inst-comment">// optimize property access: a["foo"] → a.foo</span>
		<span class="inst-property">dead_code</span>     : <span class="inst-value">true</span>,  <span class="inst-comment">// discard unreachable code</span>
		<span class="inst-property">drop_debugger</span> : <span class="inst-value">true</span>,  <span class="inst-comment">// discard “debugger” statements</span>
		<span class="inst-property">unsafe</span>        : <span class="inst-value">false</span>, <span class="inst-comment">// some unsafe optimizations (see below)</span>
		<span class="inst-property">conditionals</span>  : <span class="inst-value">true</span>,  <span class="inst-comment">// optimize if-s and conditional expressions</span>
		<span class="inst-property">comparisons</span>   : <span class="inst-value">true</span>,  <span class="inst-comment">// optimize comparisons</span>
		<span class="inst-property">evaluate</span>      : <span class="inst-value">true</span>,  <span class="inst-comment">// evaluate constant expressions</span>
		<span class="inst-property">booleans</span>      : <span class="inst-value">true</span>,  <span class="inst-comment">// optimize boolean expressions</span>
		<span class="inst-property">loops</span>         : <span class="inst-value">true</span>,  <span class="inst-comment">// optimize loops</span>
		<span class="inst-property">unused</span>        : <span class="inst-value">true</span>,  <span class="inst-comment">// drop unused variables/functions</span>
		<span class="inst-property">hoist_funs</span>    : <span class="inst-value">true</span>,  <span class="inst-comment">// hoist function declarations</span>
		<span class="inst-property">hoist_vars</span>    : <span class="inst-value">false</span>, <span class="inst-comment">// hoist variable declarations</span>
		<span class="inst-property">if_return</span>     : <span class="inst-value">true</span>,  <span class="inst-comment">// optimize if-s followed by return/continue</span>
		<span class="inst-property">join_vars</span>     : <span class="inst-value">true</span>,  <span class="inst-comment">// join var declarations</span>
		<span class="inst-property">cascade</span>       : <span class="inst-value">true</span>,  <span class="inst-comment">// try to cascade \`right\` into \`left\` in sequences</span>
		<span class="inst-property">side_effects</span>  : <span class="inst-value">true</span>,  <span class="inst-comment">// drop side-effect-free statements</span>
		<span class="inst-property">warnings</span>      : <span class="inst-value">true</span>,  <span class="inst-comment">// warn about potentially dangerous optimizations/code</span>
		<span class="inst-property">global_defs</span>   : <span class="inst-value">{}</span>     <span class="inst-comment">// global definitions</span></br></pre>`;

	const default_settings = {
		minify:{
			sequences     : true,  // join consecutive statemets with the “comma operator”
			properties    : true,  // optimize property access: a["foo"] → a.foo
			dead_code     : true,  // discard unreachable code
			drop_debugger : true,  // discard “debugger” statements
			unsafe        : false, // some unsafe optimizations (see below)
			conditionals  : true,  // optimize if-s and conditional expressions
			comparisons   : true,  // optimize comparisons
			evaluate      : true,  // evaluate constant expressions
			booleans      : true,  // optimize boolean expressions
			loops         : true,  // optimize loops
			unused        : true,  // drop unused variables/functions
			hoist_funs    : true,  // hoist function declarations
			hoist_vars    : false, // hoist variable declarations
			if_return     : true,  // optimize if-s followed by return/continue
			join_vars     : true,  // join var declarations
			cascade       : true,  // try to cascade `right` into `left` in sequences
			side_effects  : true,  // drop side-effect-free statements
			warnings      : true,  // warn about potentially dangerous optimizations/code
			global_defs   : {}     // global definitions
		},
		uglify:{}
	};


	function calculateSize() {
		const sizeOutput = editorOut.getValue().length;
		const sizeInput = editorInput.getValue().length;
		$('#output-length').text(sizeOutput + '');
		$('#source-length').text(sizeInput + '');
		const efficiency = DevUtils.calculateEfficienty(sizeOutput, sizeInput);
		$('#efficiency').text(efficiency);
	}

	function getMinifySettings(){
			const userSettings = DevUtils.getLocalItem("js-user-settings");
			if(userSettings){
				try{
					const userSettingsObj = JSON.parse(userSettings);
					if(userSettingsObj.minify){
						return userSettingsObj.minify;
					}
				}catch(err){}	
			}

			return default_settings.minify;
			
	}

	function getSettingsAsString(){
			const userSettings = DevUtils.getLocalItem("js-user-settings");
			if(userSettings){
				try{
					const userSettingsObj = JSON.parse(userSettings);
					return JSON.stringify(userSettingsObj, null, 4);
					
				}catch(err){}	
			}

			return JSON.stringify(default_settings, null, 4);
			
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
	editorInput.setValue(example, 1);
	editorInput.$blockScrolling = Infinity;
	editorInput.getSession().on('change', function () {
		const text = editorInput.getValue();
		DevUtils.storeItem("js-input", text);
	});

	//End create input editor

	//Start settings editor
	const editorSettings = ace.edit("settings-editor");
	editorSettings.setTheme("ace/theme/twilight");
	editorSettings.getSession().setMode("ace/mode/json");
	const jsSettings = getSettingsAsString();
	editorSettings.setValue(jsSettings, 1);
	
	//End settings editor

	//start init settings instructions
	$('.settings-instructions').html(settings_instructions);
	//end init settings instructions

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
			const minifySettings = getMinifySettings();
			const compressor = UglifyJS.Compressor(minifySettings);
			ast = ast.transform(compressor);
			// need to figure out scope again so mangler works optimally
			ast.figure_out_scope();
			ast.compute_char_frequency();
			ast.mangle_names();
			// get Ugly code back :)
			const code = ast.print_to_string();
			editorOut.setValue(code, 1);
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
			const minifySettings = getMinifySettings();
			const compressor = UglifyJS.Compressor(minifySettings);
			ast = ast.transform(compressor);
			const output = ast.print_to_string(); // get compressed code
			editorOut.setValue(output, 1);
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

	$('#btn-settings').on("click", function () {
		$('#tool-settings').modal();
	});


	$('#save-settings').on("click", function () {
		try{
			const text = editorSettings.getValue();
			const jsonObj = JSON.parse(text);
			const validatedText = JSON.stringify(jsonObj);
			DevUtils.storeLocalItem("js-user-settings", validatedText);
		}
		catch(err){

		}

		$('#tool-settings').modal('hide');
	});


	$('#restore-settings').on("click", function () {
		try{
			const defaultSettingsTxt = JSON.stringify(default_settings, null, 4);
			DevUtils.storeLocalItem("js-user-settings", defaultSettingsTxt);
			editorSettings.setValue(defaultSettingsTxt,1);
		}
		catch(err){

		}

	});


    DevUtils.initLoadFile("#btn-load", "#load-input", editorInput);

    //End add click listeners to action buttons

})();