
/**
 * Created by yolomachine on 10.02.2016.
 */

appAPI.ready(function($){
    var currentURL = window.location.href;
    var postCount  = 0;

    function Window(){
        this.targetURL = "vk.com/feed";
    }

    Window.prototype.check = function(href){
        if (href.search( this.targetURL ) !== -1)
            return true;
    }

    Window.prototype.refresh = function(){
        if (this.check(currentURL))
            if (postCount != $(".post").length){
                postCount  = $(".post").length;
                detectPosts();
            }
    }

    var activeTab = new Window();

    l_nwsf.onclick = function(){
        activeTab.refresh()
    }

    window.onscroll = function(){
        activeTab.refresh()
    }

    window.onload = function(){
        activeTab.refresh()
    }

    function detectPosts(){
        if (activeTab.check(currentURL)){
            $(".post").each(function(){

                var ID = $(this).attr("id");
                var spamID = [];

                var commercial     =  $(this).find(".wall_text_name_explain_promoted_post").text();
                var postText       =  $(this).find(".wall_post_text").text() + ' ' + $(this).find(".wall_post_text").find("span").text();
                var relDate        =  $(this).find(".rel_date").text();
                var authorID       =  $(this).find(".wall_text_name").find("a").attr('href');
                var authorName     =  $(this).find(".wall_text_name").find("a").text();
                var repAuthorID    =  $(this).find(".published_by").attr("href");
                var repAuthorName  =  $(this).find(".published_by").text();

                console.log("commercial " + commercial);
                console.log("text_p "     + postText);
                console.log("rel_date "   + relDate);
                console.log("author_p "   + authorName    + " " + authorID);
                console.log("r_author "   + repAuthorName + " " + repAuthorID);

                appAPI.request.get({
                    url: 'http://5.100.72.142:3000/spamdetect?text=' + postText,
                    onSuccess: function(response, additionalInfo) {
                        var temp = JSON.parse(response);
                        if (temp["verdict"] === "SPAM"){
                            $("#" + id).hide();
                            spamID[spamID.length] = ID;
                            console.log(spamID.length);
                        }
                    }
                });
            });
        }
    }
});