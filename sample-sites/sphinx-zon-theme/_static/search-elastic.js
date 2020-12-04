/**
 * Monkey-patch the Sphinx built-in `Search` module to use elasticsearch.
 */
window.Search.query = function(query) {
    if (this._client === undefined) {
        this._client = new $.es.Client({
            host: DOCUMENTATION_OPTIONS.ELASTICSEARCH_HOST});
    }

    this._client.search({
        index: DOCUMENTATION_OPTIONS.ELASTICSEARCH_INDEX,
        body: {"query": {"bool": {"should": [
        {"match_phrase": {"title": {"query": query, "boost": 10, "slop": 2}}},
        {"match_phrase": {"headers": {"query": query, "boost": 5, "slop": 3}}},
        {"match_phrase": {"content": {"query": query, "slop": 5}}},
        ]}},
        "highlight": {"fields": {"title": {}, "headers": {}, "content": {}}},
        "_source": ["title", "project", "path"],
        "size": 50  // XXX pagination?
    }}).then(function(response) {
        var resultCount = response.hits.hits.length;
        $u.each(response.hits.hits, function(hit) {
            var data = hit._source;
            var item = $('<li></li>');
            var link = $('<a/>').html(data.project + " - " + data.title);
            link.attr("href", DOCUMENTATION_OPTIONS.PUBLIC_URL_ROOT +
                      data.project + "/" +
                      data.path + DOCUMENTATION_OPTIONS.FILE_SUFFIX +
                      "?highlight=" + query);
            item.append(link);

            var content_count = 0;
            $u.each(hit.highlight.content, function(content) {
                if (content_count >= 3) return;
                // Poor man's XSLT ;)
                content = content.replace(/<em>/g, '<span class="highlighted">');
                content = content.replace(/<\/em>/g, '</span>');
                item.append($('<div class="context"></div>').html(content));
                content_count++;
            });
            Search.output.append(item);
        });

        // copy&paste from upstream
        Search.stopPulse();
        Search.title.text(_('Search Results'));
        if (!resultCount)
          Search.status.text(_('Your search did not match any documents. Please make sure that all words are spelled correctly and that you\'ve selected enough categories.'));
        else
            Search.status.text(_('Search finished, found %s page(s) matching the search query.').replace('%s', resultCount));
        Search.status.show();
    }, function(err) {
        throw err;
    });
};


window.Search.loadIndex = function(url) {
    // For simplicity we keep the API that the built-in `search.html` already
    // talks to on page load.
    // But we use elasticsearch, so we don't need to load a JS-based index
    // file. Thus we only (ab)use this API flow to tell the `Search` module
    // that "everything is ready now", so it runs the query.
    this.setIndex(true);
};
