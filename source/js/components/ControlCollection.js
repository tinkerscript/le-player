'use strict';
/**
 * @file ControlCollection.js
 */

import $ from 'jquery';
import Component from './Component';
import Control from './Control';

import { createEl } from '../utils';


/**
 * @param {Player} player Main player
 * @param {Object} [options] Options of component
 * @param {jQuery} [options.controls] Array of rows of control's name
 * @param {Object} [options.controlsOptions] Control options
 * @property {Array} Array of rows of control's name
 * @pr
 *
 */
class ControlCollection extends Component {
	constructor (player, options) {
		const name = options.name;

		let playerOptions = {
			controls : player.options.controls[name],
		}

		if(player.options.controlsOptions[name]) {
			playerOptions['align'] = player.options.controlsOptions[name].align;
			playerOptions['controlsOptions'] = player.options.controlsOptions[name].controls;
		}

		options = $.extend({}, {
			controls : [],
			controlsOptions : {},
			align : 'left',
		}, playerOptions, options);

		super(player, options);

		this.active = options.active || false;
		this.name = options.name;

		this.player.controls[this.name] = this;
	}


	_getControlOptions(name) {
		const { controlsOptions } = this.options;
		let result = controlsOptions.control || {};

		if(controlsOptions[name]) {
			result = $.extend(true, {}, result, controlsOptions[name]);
		}

		return result;
	}

	addControl(indexRow, name, options) {
		const control = Control.create(this.player, name, {
			collection : this.options.name,
			...options
		});

		if(control == null) {
			return;
		}

		while(indexRow > this._rows.length) {
			this.addRow();
		}

		const elemRow = this._rows[indexRow];
		elemRow.append(control.element);

		if (this.controls == null) {
			this.controls = [];
		}
		if (this.controls[indexRow] == null) {
			this.controls[indexRow] = {};
		}

		this.controls[indexRow][name] = control;
	}

	getControl(first, second) {
		if(second == null) {
			const name = first;
			for(let i = 0; i < this.controls.length; i++) {
				if(this.controls[i][name] != null) {
					return this.controls[i][name];
				}
			}
		} else {
			const name = first;
			const indexRow = second;
			return this.controls[indexRow][name];
		}

		return null;
	}

	addRow() {
		const elemRow = createEl('div', {
			className : `leplayer-controls controls-${this.options.name}`
		});

		if (this._rows == null) {
			this._rows = []
		}
		this._rows.push(elemRow);
		this.element.append(elemRow);

		return elemRow;
	}

	getRow(indexRow) {
		return this._rows[indexRow || 0];
	}

	/**
	 * @override
	 */
	createElement() {
		const { name, controls, align } = this.options;
		let globalAlign = null;

		this.element = createEl('div', {
			className : `leplayer-control-collection leplayer-control-collection--${name}`,
		})

		if(typeof align === 'string') {
			globalAlign = align;
		}

		controls.forEach((row, indexRow) => {
			const elemRow = this.addRow();
			let rowAlign = globalAlign;

			if(Array.isArray(align) && align[indexRow]) {
				rowAlign = align[indexRow]
			}

			row.forEach(controlName => {

				if(controlName === 'timeline' && rowAlign !== 'justify') {
					console.warn('Conrols should have justify align, if there is the timeline in it');
				}

				this.addControl(indexRow, controlName, this._getControlOptions(name));
			});

			elemRow.addClass(`leplayer-controls--${rowAlign}`)
				.attr('tabindex', 0);

			elemRow.find('.divider + .divider').remove();
		});

		return this.element;
	}

	hide () {
		this.element.hide();
		this.element.find('.leplayer-controls').hide()
	}

	show () {
		this.element.show()
		this.element.find('.leplayer-controls').show()
	}
}

Component.registerComponent('ControlCollection', ControlCollection);
export default ControlCollection;
