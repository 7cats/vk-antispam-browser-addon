/**
 * Created by yolomachine on 10.02.2016.
 * WORK IN PROGRESS
 */

var postScan = detect_posts();
var news = l_nwsf;

function Window(lastURL, oldURL){
    this.currentURL  = lastURL;
    this.previousURL = oldURL;
}

Window.prototype.refresh = function(href){     // href == window.location.href --
    this.targetURL = "vk.com/feed";            // setInterval(Window.refresh(window.location.href), 1000);
    switch(href){
        case this.currentURL:
            if (href.search( this.targetURL ) !== -1 && href === this.previousURL)
                break
            else
            if (href.search( this.targetURL ) !== -1 && href !== this.previousURL)
                postScan();
            break;
        case this.previousURL:
            this.previousURL = this.currentURL;
            this.currentURL  = href;
            break;
    }
}

appAPI.ready(function($){
    var activeTab = new Window(window.location.href, "");
    postScan;
    setInterval(activeTab.refresh(window.location.href), 1000);

    news.onclick= function(){
        postScan;
    }

    window.onscroll = function(){
        if (postCount != $(".post").length){
            postScan;
            postCount = $(".post").length;
        }
    }
