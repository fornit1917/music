var Catalog = {
	data: null,
	currentCategory: null
};

Catalog.init = function () {
	Catalog.load();
	$('.category-item').on('click', function () {
		if (Catalog.data === null) {
			return;
		}
		var $this = $(this);
		var categoryId = $this.attr('data-category-id');

		var playlists = Catalog.data[categoryId];
		if (!playlists || playlists.length === 0) {
			console.log('Playlist ' + categoryId + ' is empty');
			return;
		}

		if (categoryId !== Catalog.currentCategory) {
			var html = [];
			for (var i=0; i<playlists.length; i++) {
				html.push(playlists[i].html);
			}

			$('#playlists').html(html.join(''));
		}
		$('#music').show();
		$('#category-list').hide();
		Catalog.currentCategory = categoryId;
	});

	$('#back-to-categories').on('click', function () {
		$('#music').hide();
		$('#category-list').show();
	});
};

Catalog.load = function () {
	$.ajax('data/all.json').promise()
		.done(function (resp) {
			if (typeof resp === 'string') {
				resp = JSON.parse(resp);
			}
			Catalog.data = resp;
		});
};

