var Pager = {
	PAGE_SIZE: 6,
	pageNum: 0,
	pageCount: 0,
	items: [],
	start: 0,
	end: 0,

	$total: null,
	$current: null,
	$btnNext: null,
	$btnPrev: null,
};

Pager.init = function () {
	Pager.$total = $('#paginator-total');
	Pager.$current = $('#paginator-current');
	Pager.$btnNext = $('#paginator-next');
	Pager.$btnPrev = $('#paginator-prev');
};

Pager.setItems = function (items) {
	Pager.items = items;
	Pager.pageNum = 0;
	Pager.pageCount = Math.ceil(items.length / Pager.PAGE_SIZE);
	Pager.setButtonsStatus();
	Pager.setStartEnd();
	Pager.$total.html(items.length);
	return Pager.getSlice();
};

Pager.next = function () {
	if (Pager.pageNum == Pager.pageCount-1) {
		return null;
	}
	Pager.pageNum++;
	Pager.setButtonsStatus();
	Pager.setStartEnd();
	return Pager.getSlice();
};

Pager.prev = function () {
	if (Pager.pageNum == 0) {
		return null;
	}
	Pager.pageNum--;
	Pager.setButtonsStatus();
	Pager.setStartEnd();
	return Pager.getSlice();
};

Pager.getSlice = function () {
	return Pager.items.slice(Pager.start, Pager.end);
};

Pager.setButtonsStatus = function () {

	console.log(Pager);

	if (Pager.pageNum == Pager.pageCount-1) {
		Pager.$btnNext.prop('disabled', true);
	} else {
		Pager.$btnNext.prop('disabled', false);
	}
	if (Pager.pageNum == 0) {
		Pager.$btnPrev.prop('disabled', true);
	} else {
		Pager.$btnPrev.prop('disabled', false);
	}
};

Pager.setStartEnd = function () {
	Pager.start = Pager.pageNum*Pager.PAGE_SIZE;
	Pager.end = Pager.start + Pager.PAGE_SIZE;
	if (Pager.end > Pager.items.length) {
		Pager.end = Pager.items.length;
	}

	Pager.$current.html((Pager.start+1) + '-' + Pager.end);
};
