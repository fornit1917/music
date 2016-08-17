var Catalog = {
	data: null,
	currentCategory: null,
	filterTimeoutId: 0,

	$filterField: null,
	$categoriesScreen: null,
	$musicScreen: null,
	$playlists: null,

	currentFilterQuery: '',
};

Catalog.init = function () {

	Catalog.$categoriesScreen = $('#category-list');
	Catalog.$musicScreen = $('#music');
	Catalog.$playlists = $('#playlists');
	Catalog.$filterField = $('#filter');

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
			Catalog.showPlaylists(Catalog.data[categoryId]);
		}
		Catalog.$musicScreen.show();
		Catalog.$categoriesScreen.hide();
		Catalog.currentCategory = categoryId;
	});

	Catalog.$filterField.on('input', function () {
		Catalog.restartFilterTimeout();
	});

	$('#back-to-categories').on('click', function () {
		Catalog.$musicScreen.hide();
		Catalog.$categoriesScreen.show();
	});
};

Catalog.load = function () {
	$.ajax('data/all.json?' + Math.random()).promise()
		.done(function (resp) {
			if (typeof resp === 'string') {
				resp = JSON.parse(resp);
			}
			for (var key in resp) {
				for (var i = 0; i < resp[key].length; i++) {
					resp[key][i].tags = resp[key][i].tags.map(function (item) { return item.toLowerCase() })
				}
			}
			Catalog.data = resp;
		});
};

Catalog.restartFilterTimeout = function () {
	if (Catalog.filterTimeoutId !== 0) {
		clearTimeout(Catalog.filterTimeoutId);
	}
	Catalog.filterTimeoutId = setTimeout(function () {
		var query = Catalog.$filterField.val();
		query = query.toLowerCase();
		if (query === Catalog.currentFilterQuery) {
			return;
		}
		Catalog.currentFilterQuery = query;
		
		var playlists = Catalog.filterPlaylists(query);
		Catalog.showPlaylists(playlists);
	}, 1000);
};

Catalog.filterPlaylists = function (query) {
	var playlists = Catalog.data[Catalog.currentCategory];
	if (query.trim() === "") {
		return playlists;
	}
	return playlists.filter(function (item) {
		for (var key in item.tags) {
			if (Catalog.strStartsWith(item.tags[key], query)) {
				return true;
			}
		}
		return false;
	});
};

Catalog.showPlaylists = function (playlists) {
	var columns = [[],[]];
	for (var i = 0; i < playlists.length; i++) {
		columns[i % 2].push(playlists[i].html);
	}
	var html = '<div class="playlists-column">' + columns[0].join('') + '</div>';
	html += '<div class="playlists-column">' + columns[1].join('') + '</div>';
	Catalog.$playlists.html(html);
};


Catalog.strStartsWith = function (str, query) {
	if (typeof String.prototype.startsWith === 'function') {
		return str.startsWith(query);
	} else {
		if (query.length > str.length) {
			return false;
		}
		for (var i = 0; i < query.length; i++) {
			if (str.charAt(i) != query.charAt(i)) {
				return false;
			}
		}
		return true;
	}
}
