/*
 * Hatena Bookmark count annotation
 * 2010/9/15 Shimizukawa
 *
 * <script type="text/javascript" src="js/HatenaBookmark.js"></script>
 * <script type="text/javascript">
 * Hatena.Bookmark.SiteConfig = {
 *   'div.documentbody h1 a.headerlink': {},
 *   'div.documentbody .toctree-wrapper a': {}
 * };
 * </script>
 *
 * url as:
 * - link to: http://b.hatena.ne.jp/entry/[target-url]
 * - add for: http://b.hatena.ne.jp/entry/add/[target-url]
 * - counts :http://b.hatena.ne.jp/entry/image/[target-url]
 */

if (typeof(Hatena) == 'undefined') {
	Hatena = {};
}
if (typeof(Hatena.xBookmark) == 'undefined') {
    Hatena.xBookmark = {};
}
if (typeof(Hatena.xBookmark.SiteConfig) == 'undefined') {
    Hatena.xBookmark.SiteConfig = {};
}

jQuery(function(){
	var hatena_base_url = 'http://b.hatena.ne.jp/entry/';
	var hatena_bookmark_count_class = 'hatena-bookmark-count';
	var elements = Hatena.xBookmark.SiteConfig;

	for(area in elements) {
		var e = elements[area];
		jQuery(area).each(function(){
			var permanent_url = this.href.match(/^[^#\?]*/);
			if(permanent_url) {
				permanent_url = permanent_url[0];
				var link_elem = document.createElement('a');
				var img_elem = document.createElement('img');
				link_elem.href = hatena_base_url + permanent_url;
				link_elem.className = hatena_bookmark_count_class;
				link_elem.target = '_blank';
				img_elem.src = hatena_base_url + 'image/' + permanent_url;
				jQuery(this).after(jQuery(link_elem).append(img_elem));
			} else {
				return null;
			}
		});
	};
});

