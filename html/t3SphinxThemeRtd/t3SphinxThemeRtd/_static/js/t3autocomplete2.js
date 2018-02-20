/* t3autocomplete2.js
 * for pages that DO load searchtools.js
 * load BEFORE searchtools.js
 */

if (typeof window.T3Docs === 'undefined') {
	window.T3Docs = {};
}

window.T3Docs['enableAutocompletion'] = function () {
	$("#searchinput").focusin(function () {
		var url = $('#rtd-search-form').attr('action').replace('search.html', 'searchindex.js');
		var theKeys;
		theKeys = $u.sortBy(
			$u.union($u.keys(Search._index.terms),
				$u.keys(Search._index.titleterms)), function (s) {
				return s;
			});
		$("#searchinput").autocomplete({
			source: theKeys
		});
		$("#searchinput").unbind('focusin');
	});
}
