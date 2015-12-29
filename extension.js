appAPI.ready(function($) {
	var old_change_URL = window.location.href;
	var new_change_URL = "";
	var nowURL = window.location.href;
	var which_url = 1;
	var count_posts = 0;
	var id_spam = [];
	detect_posts();
	//каждую 1 секунду чекаем, не изменился  ли url, если перешли на /feed, то чекаем посты.
	setInterval(function() {
		if (which_url == 1){
			new_change_URL = window.location.href;
			nowURL = new_change_URL;
		}
		else{
		    old_change_URL = window.location.href;
	        nowURL = old_change_URL;
		}
		if (new_change_URL !== old_change_URL && (nowURL === 'http://vk.com/feed' || nowURL === 'http://vk.com/al_feed' )){
			detect_posts();
		}
		which_url ^= 1;
	}, 1000);
	// если нажали на news (на случай перехода feed -> feed)
	l_nwsf.onclick = function (){
		detect_posts();
	}
	//если скролл, то смотрим все записи, если новые появились
	window.onscroll = function() {
		if (count_posts != $(".post").length){
			detect_posts();
		    count_posts = $(".post").length;
		}
	}
	function detect_posts(){
		if (nowURL === 'http://vk.com/feed' || nowURL === 'http://vk.com/al_feed'){
			$(".post").each(function(){
				var text_post = ($(this).text());
				var id = ($(this).attr('id'));
				// отправляем тексты сообщений на сервер, удаляем спамовые сообщения
				appAPI.request.get({
					url: 'http://5.100.72.142:3000/spamdetect?text=' + text_post,   // адрес сервера http://5.100.72.142:3000/
					onSuccess: function(response, additionalInfo) {
						var tmp = JSON.parse(response);
						if (tmp["verdict"] === "SPAM"){
							$("#" + id).hide();
							id_spam[id_spam.length] = id;
							console.log(id_spam.length);
						}
					}
				});
			});
		}
	}

});