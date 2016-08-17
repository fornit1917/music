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
			var columns = [[],[]];
			for (var i=0; i<playlists.length; i++) {
				columns[i % 2].push(playlists[i].html);
			}
			var html = '<div class="playlists-column">' + columns[0].join('') + '</div>';
			html += '<div class="playlists-column">' + columns[1].join('') + '</div>';
			$('#playlists').html(html);
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

