var quill = new Quill('#editor', {
	theme: 'snow',
	modules: {
		imageResize: {
			altTextPromptText: "Gimme that alt text",
            parchment: Quill.import('parchment'),
        },
	},
});
