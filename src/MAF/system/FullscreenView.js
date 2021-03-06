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
define('MAF.system.FullscreenView', function () {
	return new MAF.Class({
		ClassName: 'FullscreenView',

		Extends: MAF.system.WindowedView,

		viewType: 'FULLSCREEN',

		config: {
			showPassthroughVideo: false
		},

		setTVViewportSize: function(x, y, width, height) {
			MAF.mediaplayer.setViewportBounds(x, y, width, height);
		},

		getTVViewportSize: function() {
			return MAF.mediaplayer.getViewportBounds();
		}
	});
}, {
	FullscreenView: {
		styles: {
			width: '1920px',
			height: '1080px'
		}
	}
});
