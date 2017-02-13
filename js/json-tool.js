	(function () {
		"use strict";
		
		$('.editors-container').height(500).split({
			orientation: 'vertical',
			limit: 10,
			position: '25%', // if there is no percentage it interpret it as pixels
			onDrag: function () {
				editorInput.resize();
				editorOut.resize();
		}
		});



		const editorInput = ace.edit("leftPane");

		editorInput.setTheme("ace/theme/twilight");

		editorInput.getSession().setMode("ace/mode/json");

		const jsonExample = { name: "John", age: 31, city: "New York" };

		editorInput.setValue(JSON.stringify(jsonExample, null, 1));



		const editorOut = ace.edit("rightPane");

		editorOut.setTheme("ace/theme/twilight");

		editorOut.getSession().setMode("ace/mode/json");

		editorOut.setReadOnly(true);
	})();