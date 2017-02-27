(function () {
	"use strict";

	const ACTION_FAILED_MSG = "<strong>Error!</strong> Something went wrong. Please fix the css and try again.";
	const FILE_MODE_CSS = 'css';

	let fileMode = FILE_MODE_CSS;

	const default_settings = {
		minify: {
			format: {
				breaks: {
					afterAtRule: false,
					afterBlockBegins: false,
					afterBlockEnds: false,
					afterComment: false,
					afterProperty: false,
					afterRuleBegins: false,
					afterRuleEnds: false,
					beforeBlockEnds: false,
					betweenSelectors: false
				},
				indentBy: 0,
				indentWith: 'space',
				spaces: {
					aroundSelectorRelation: false,
					beforeBlockBegins: false,
					beforeValue: false
				},
				wrapAt: false
			}
		},
		beautify: {
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
		}


	};


	const settings_instructions =
	`<pre>// minify default options
  format: {
    breaks: { <span class="inst-comment">// controls where to insert breaks </span>
      <span class="inst-property">afterAtRule</span>:  <span class="inst-value">false</span>, // <span class="inst-comment">controls if a line break comes after an at-rule; e.g. \`@charset\`; defaults to \`false\` </span>
      <span class="inst-property">afterBlockBegins</span>:  <span class="inst-value">false</span>, // <span class="inst-comment">controls if a line break comes after a block begins; e.g. \`@media\`; defaults to \`false\` </span>
      <span class="inst-property">afterBlockEnds</span>:  <span class="inst-value">false</span>, // <span class="inst-comment">controls if a line break comes after a block ends, defaults to \`false\` </span>
      <span class="inst-property">afterComment</span>:  <span class="inst-value">false</span>, // <span class="inst-comment">controls if a line break comes after a comment; defaults to \`false\` </span>
     <span class="inst-property"> afterProperty</span>:  <span class="inst-value">false</span>, // <span class="inst-comment">controls if a line break comes after a property; defaults to \`false\` </span>
     <span class="inst-property"> afterRuleBegins</span>:  <span class="inst-value">false</span>, //<span class="inst-comment"> controls if a line break comes after a rule begins; defaults to \`false\` </span>
      <span class="inst-property">afterRuleEnds</span>:  <span class="inst-value">false</span>, // <span class="inst-comment">controls if a line break comes after a rule ends; defaults to \`false\` </span>
      <span class="inst-property">beforeBlockEnds</span>:  <span class="inst-value">false</span>, // <span class="inst-comment">controls if a line break comes before a block ends; defaults to \`false\` </span>
      <span class="inst-property">betweenSelectors</span>:  <span class="inst-value">false </span>// <span class="inst-comment">controls if a line break comes between selectors; defaults to \`false\` </span>
    },
    <span class="inst-property">indentBy</span>:  <span class="inst-value">0</span>, // <span class="inst-comment">controls number of characters to indent with; defaults to \`0\` </span>
    <span class="inst-property">indentWith</span>:  <span class="inst-value">'space'</span>, // <span class="inst-comment">controls a character to indent with, can be \`'space'\` or \`'tab'\`; defaults to \`'space'\` </span>
    spaces: { <span class="inst-comment">// controls where to insert spaces </span>
      <span class="inst-property">aroundSelectorRelation</span>:  <span class="inst-value">false</span>, //<span class="inst-comment"> controls if spaces come around selector relations; e.g. \`div > a\`; defaults to \`false\` </span>
      <span class="inst-property">beforeBlockBegins</span>:  <span class="inst-value">false</span>, // <span class="inst-comment">controls if a space comes before a block begins; e.g. \`.block {\`; defaults to \`false\` </span>
      <span class="inst-property">beforeValue</span>:  <span class="inst-value">false</span> //<span class="inst-comment"> controls if a space comes before a value; e.g. \`width: 1rem\`; defaults to \`false\` </span>
    },
    <span class="inst-property">wrapAt</span>:  <span class="inst-value">false</span> // <span class="inst-comment">controls maximum line length; defaults to \`false\` </span>
  }
</pre>`;



	function getSettings(type) {
		const userSettings = DevUtils.getLocalItem("css-user-settings");
		if (userSettings) {
			try {
				const userSettingsObj = JSON.parse(userSettings);
				if (userSettingsObj[type]) {
					return userSettingsObj[type];
				}
			} catch (err) { }
		}

		return default_settings[type];

	}

	function getSettingsAsString() {
		const userSettings = DevUtils.getLocalItem("css-user-settings");
		if (userSettings) {
			try {
				const userSettingsObj = JSON.parse(userSettings);
				return JSON.stringify(userSettingsObj, null, 4);

			} catch (err) { }
		}

		return JSON.stringify(default_settings, null, 4);

	}


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
	editorInput.getSession().setMode("ace/mode/css");
	const oldInput = DevUtils.retrieveItem("css-input");
	const example = oldInput ? oldInput : "p {color: red; text-align: center;}";
	editorInput.setValue(example);
	editorInput.$blockScrolling = Infinity;
	editorInput.getSession().on('change', function () {
		const text = editorInput.getValue();
		DevUtils.storeItem("css-input", text);
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
			const beautifyOptions = getSettings('beautify');
			const output = new CleanCSS(beautifyOptions).minify(input);
			editorOut.getSession().setMode("ace/mode/css");
			editorOut.setValue(output.styles);
			calculateSize();
			showMessage("<strong>Success!</strong> CSS has been beautified successfully.", 'success');
			fileMode = FILE_MODE_CSS;
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
			const minifySettings = getSettings('minify');
			const output = new CleanCSS(minifySettings).minify(input);
			editorOut.setValue(output.styles);
			calculateSize();
			showMessage("<strong>Success!</strong> CSS has been minified successfully.", 'success');
			fileMode = FILE_MODE_CSS;

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


	$('#btn-settings').on("click", function () {
		$('#tool-settings').modal();
	});


	$('#save-settings').on("click", function () {
		try{
			const text = editorSettings.getValue();
			const jsonObj = JSON.parse(text);
			const validatedText = JSON.stringify(jsonObj);
			DevUtils.storeLocalItem("css-user-settings", validatedText);
		}
		catch(err){

		}

		$('#tool-settings').modal('hide');
	});


	$('#restore-settings').on("click", function () {
		try{
			const defaultSettingsTxt = JSON.stringify(default_settings, null, 4);
			DevUtils.storeLocalItem("css-user-settings", defaultSettingsTxt);
			editorSettings.setValue(defaultSettingsTxt,1);
		}
		catch(err){

		}

	});



    DevUtils.initLoadFile("#btn-load", "#load-input", editorInput);


	//End add click listeners to action buttons

})();