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

        var id = $(this).attr("id");

        var text_post = ($(this).find(".wall_post_text").text()) + ' ' + ($(this).find(".wall_post_text").find("span").text());  // text of user and text of repost
        var au_id = ($(this)).find(".wall_text_name").find("a").attr('href');
        var au_name = ($(this)).find(".wall_text_name").find("a").text();
        var rel_date = ($(this)).find(".rel_date").text();

        var r_au_id = ($(this)).find(".published_by").attr("href");
        var r_au_name = ($(this)).find(".published_by").text();

        var commercial = $(this).find(".wall_text_name_explain_promoted_post").text();


        /*console.log("r_author " + r_au_name +  " " + r_au_id);
         console.log("text_p " + text_post);
         console.log("author_p " + au_name + " " + au_id);
         console.log("rel_date " + rel_date);
         console.log("commercial " + commercial);*/

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