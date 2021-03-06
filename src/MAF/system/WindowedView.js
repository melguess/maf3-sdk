/**
 * Metrological Application Framework 3.0 - SDK
 * Copyright (c) 2013  Metrological
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 **/
define('MAF.system.WindowedView', function () {
	var performControlInspection = function (statePacket, focusOnly) {
		statePacket = Object.merge(this.persist, statePacket, this.backParams);
		if (statePacket) {
			Object.forEach(this.controls, function (key, controls) {
				if (typeOf(controls) === 'array') {
					controls.forEach(function (control, key) {
						tellControlToInspect.call(this, control, statePacket, focusOnly);
					}, this);
				} else {
					tellControlToInspect.call(this, controls, statePacket, focusOnly);
				}
			}, this);
		}
	};

	var tellControlToInspect = function (control, packet, focusOnly) {
		if (control.config && control.config.guid && control.inspectStatePacket && control.inspectStatePacket.call) {
			control.inspectStatePacket.call(control, packet, focusOnly);
		}
	};

	var tellControlToSave = function (control, savedData) {
		if (control.config && control.config.guid && control.generateStatePacket && control.generateStatePacket.call) {
			savedData[control.config.guid] = control.generateStatePacket.call(control);
		}
	};

	return new MAF.Class({
		ClassName: 'WindowedView',

		Extends: MAF.system.BaseView,

		Protected: {
			dispatchEvents: function (event) {
				this.parent(event);
				switch (event.type) {
					case 'navigate':
						this.fire('onNavigate', event.detail, event);
						break;
					case 'navigateoutofbounds':
						this.fire('onNavigateOutOfBounds', event.detail, event);
						break;
				}
			},
			registerEvents: function (types){
				this.parent([
					'navigate',
					'navigateoutofbounds'
				].concat(types || []));
			},
			setInitialFocus: function () {
				if (this.hasbeenfocused !== true || !document.activeElement) {
					this.parent();
					this.hasbeenfocused = true;
					if (!this.element.focusedView) {
						this.resetFocus();
					}
					performControlInspection.call(this, this.getControlData('statePacket', true), true);
					if (this.fire('onFocusView')) {
						this.focusView();
					}
				}
			},
			onLoadView: function (event) {
				MAF.utility.LoadingOverlay.show();
				this.parent(event);
			},
			onShowView: function (event) {
				MAF.utility.LoadingOverlay.show();
				this.parent(event);
				
			},
			onSelectView: function(event) {
				this.parent(event);
				if (!this.element.focusedView) {
					this.resetFocus();
				}
				performControlInspection.call(this, this.getControlData('statePacket'), false);
				MAF.utility.LoadingOverlay.hide();
			},
			onUnselectView: function (event) {
				this.parent(event);
				var savedData = {};
				Object.forEach(this.controls, function (key, control) {
					if (typeOf(control) === 'array') {
						control.forEach(function (control, key) {
							tellControlToSave.call(this, control, savedData);
						}, this);
					} else {
						tellControlToSave.call(this, control, savedData);
					}
				}, this);
				this.setControlData('statePacket', savedData);
				this.hasbeenfocused = false;
			},
			onHideView: function(event) {
				this.parent(event);
				this.backParams = {};
			}
		},

		focusView: emptyFn,

		resetFocus: function () {
			if (!this.disableResetFocus && this.element) {
				if (!this.element.navigate('down', [0, 0])) {
					this.element.focus();
				}
			}
		}
	});
});
