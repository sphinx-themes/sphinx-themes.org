$.getJSON('https://pypi.python.org/pypi/sunpy/json', function(data) {
	ver= 'Current Version: ' + data.info.version;
	$('.version').html(ver);
});