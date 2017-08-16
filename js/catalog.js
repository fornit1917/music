var CATALOG_URL = "https://api.github.com/gists/a5168453131d17caf1e05681da10fe0e";

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
	Pager.init();

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
			var pagePlaylists = Pager.setItems(Catalog.data[categoryId]);
			Catalog.showPlaylists(pagePlaylists);
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

	$('#paginator-prev').on('click', function () {
		var pagePlaylists = Pager.prev();
		Catalog.showPlaylists(pagePlaylists);
	});

	$('#paginator-next').on('click', function () {
		var pagePlaylists = Pager.next();
		Catalog.showPlaylists(pagePlaylists);
	});
};

Catalog.load = function () {
    $.ajax(CATALOG_URL).promise().then(function (resp) {
        if (typeof resp !== "object") {
            resp = JSON.parse(resp);
        }
        var lists = resp.files["gistfile1.txt"].content.split("\n\n")
        var data = {};
        for (var i = 0; i < lists.length; i++) {
            var lines = lists[i].split("\n");
            var genres = lines[0].split(",").map(function (item) { return item.trim() });
            var tags = lines[1].split(",").map(function (item) { return item.trim().toLowerCase() });
            var html = lines[2];

            for (var j = 0; j < genres.length; j++) {
                var genre = genres[j];
                if (!data[genre]) {
                    data[genre] = [];
                }
                data[genre].push({
                    tags: tags,
                    html: html,
                });
            }
        }

        Catalog.data = data;
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
		var pagePlaylists = Pager.setItems(playlists);
		Catalog.showPlaylists(pagePlaylists);
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
