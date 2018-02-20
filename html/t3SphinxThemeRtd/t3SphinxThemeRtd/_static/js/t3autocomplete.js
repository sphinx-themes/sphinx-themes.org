
/* t3autocomplete.js
 * for pages that DO NOT load searchtools.js
 */


// this is a minimum mockup code to allow the following ajax call
if (typeof Search == 'undefined') {
	/*
	 * searchtools.js_t
	 * ~~~~~~~~~~~~~~~~
	 *
	 * Sphinx JavaScript utilties for the full-text search.
	 *
	 * :copyright: Copyright 2007-2015 by the Sphinx team, see AUTHORS.
	 * :license: BSD, see LICENSE for details.
	 *
	 */
	/**
	 * Search Module
	 */
	var Search = {
		_index: null,
		setIndex: function (index) {
			var q;
			this._index = index;
		},
	};
}


$(document).ready(function () {

	$(function() {
		$("#searchinput").focusin(function () {

			var url = $('#rtd-search-form').attr('action').replace('search.html','searchindex.js');

			if (! Search._index) {
				$.ajax({type: "GET", url: url, data: null,
					dataType: "script", cache: true,
					complete: function(jqxhr, textstatus) {
						var theKeys;
						if (textstatus == "success") {
							theKeys = $u.sortBy(
								$u.union($u.keys(Search._index.terms),
								$u.keys(Search._index.titleterms)), function (s) {return s;});
							$("#searchinput").autocomplete({
								source:theKeys
							});
						}
					}
				});
			}
			$("#searchinput").unbind('focusin');
		});
	});

});
