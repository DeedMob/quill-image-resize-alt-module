import IconAlignLeft from 'quill/assets/icons/align-left.svg';
import IconAlignCenter from 'quill/assets/icons/align-center.svg';
import IconAlignRight from 'quill/assets/icons/align-right.svg';
import IconComment from 'quill/assets/icons/font.svg';
// import IconLink from 'quill/assets/icons/link.svg';

import { BaseModule } from './BaseModule';

let Parchment = {};
let FloatStyle = {};
let MarginStyle = {};
let DisplayStyle = {};

export class Toolbar extends BaseModule {
    onCreate = (parchment) => {
        // Initilize styles
        Parchment = parchment;
        FloatStyle = new Parchment.Attributor.Style('float', 'float');
        MarginStyle = new Parchment.Attributor.Style('margin', 'margin');
        DisplayStyle = new Parchment.Attributor.Style('display', 'display');

        // Setup Toolbar
        this.toolbar = document.createElement('div');
        Object.assign(this.toolbar.style, this.options.toolbarStyles);
        this.overlay.appendChild(this.toolbar);

        // Setup Buttons
        this._defineAlignments();
        this._defineActions();
        this._addToolbarButtons();
        this._addToolbarButtonsToActions();
    };

	// The toolbar and its children will be destroyed when the overlay is removed
    onDestroy = () => {};

	// Nothing to update on drag because we are are positioned relative to the overlay
    onUpdate = () => {};

    _defineActions = () => {
		this.actions = [
			// {
			// 	icon: IconLink,
			// 	apply: () => {
			// 		const findImg = Parchment.find(this.img);
			// 		const offset = findImg.offset(this.quill.scroll);
			// 		this.quill.setSelection(offset, 1, window.Quill.sources.USER);
			// 		const toolbar = this.quill.getModule('toolbar');
			// 		toolbar.container.querySelector('.ql-link').click();
			// 	},
			// 	isApplied: () => {
			// 		const findImg = Parchment.find(this.img);
			// 		return findImg.parent.domNode.tagName === 'A'
			// 	},
			// },
			{
				icon: IconComment,
				apply: () => {
					const findImg = Parchment.find(this.img);
					const imgTitle = findImg.domNode.alt;
					let title = prompt(this.options.altTextPromptText, imgTitle);
					if (title !== null) {
						findImg.domNode.alt = title;
					}
                },
                isApplied: () => {
					const findImg = Parchment.find(this.img);
					return findImg.domNode.alt && findImg.domNode.alt !== '';
				},
			},
		]
    };
    
    _defineAlignments = () => {
        this.alignments = [
            {
                icon: IconAlignLeft,
                apply: () => {
                    DisplayStyle.add(this.img, 'inline');
                    FloatStyle.add(this.img, 'left');
                    MarginStyle.add(this.img, '0 1em 1em 0');
                },
                isApplied: () => FloatStyle.value(this.img) == 'left',
            },
            {
                icon: IconAlignCenter,
                apply: () => {
                    DisplayStyle.add(this.img, 'block');
                    FloatStyle.remove(this.img);
                    MarginStyle.add(this.img, 'auto');
                },
                isApplied: () => MarginStyle.value(this.img) == 'auto',
            },
            {
                icon: IconAlignRight,
                apply: () => {
                    DisplayStyle.add(this.img, 'inline');
                    FloatStyle.add(this.img, 'right');
                    MarginStyle.add(this.img, '0 0 1em 1em');
                },
                isApplied: () => FloatStyle.value(this.img) == 'right',
            },
        ];
    };

    _addToolbarButtons = () => {
		const buttons = [];
		this.alignments.forEach((alignment, idx) => {
			const button = document.createElement('span');
			buttons.push(button);
			button.innerHTML = alignment.icon;
			button.addEventListener('click', () => {
					// deselect all buttons
				buttons.forEach(button => button.style.filter = '');
				if (alignment.isApplied()) {
						// If applied, unapply
					FloatStyle.remove(this.img);
					MarginStyle.remove(this.img);
					DisplayStyle.remove(this.img);
				}				else {
						// otherwise, select button and apply
					this._selectButton(button);
					alignment.apply();
				}
					// image may change position; redraw drag handles
				this.requestUpdate();
			});
			Object.assign(button.style, this.options.toolbarButtonStyles);
			if (idx > 0) {
				button.style.borderLeftWidth = '0';
			}
			Object.assign(button.children[0].style, this.options.toolbarButtonSvgStyles);
			if (alignment.isApplied()) {
					// select button if previously applied
				this._selectButton(button);
			}
			this.toolbar.appendChild(button);
		});
    };

    _addToolbarButtonsToActions = () => {
		const buttons = [];
		this.actions.forEach((action, idx) => {
			const button = document.createElement('span');
			buttons.push(button);
			button.innerHTML = action.icon;
			button.addEventListener('click', () => {
				buttons.forEach(button => button.style.filter = '');
				action.apply();
				this.requestUpdate();
			});
			Object.assign(button.style, this.options.toolbarButtonStyles);
			if (idx > 0) {
				button.style.borderLeftWidth = '0';
			} else if (idx === 0) {
				button.style.marginLeft = '10px';
			}
			Object.assign(button.children[0].style, this.options.toolbarButtonSvgStyles);
			if (action.isApplied()) {
				// select button if previously applied
				this._selectButton(button);
				button.title = this.img.getAttribute('data-href');
			}
			this.toolbar.appendChild(button);
		})
    };
    
    _selectButton = (button) => {
		button.style.filter = 'invert(20%)';
    };

}
