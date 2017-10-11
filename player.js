document.onkeydown = checkKey;

var offsetSecond = 0.0;
var groupName = 'Switch_Mario.mp4';

function closeVideoBtnOnClick(btn,tag) {
    // body...
    var video1 = $("#video_part1_div");
    var video2 = $("#video_part2_div");

    if (tag == 'u1') {
        if (btn.innerHTML == "Show") {
            video1.show();
            video1.removeClass('offset-2');
            video1.removeClass('col-8');
            video1.addClass('col-6');

            video2.removeClass('offset-2');
            video2.removeClass('col-8');
            video2.addClass('col-6');

            btn.innerHTML = "Close";
        }
        else {
            video1.hide();

            video2.show();
            video2.addClass('offset-2');
            video2.removeClass('col-6');
            video2.addClass('col-8');

            btn.innerHTML = "Show";
        }
        
    }
    else {
        if (btn.innerHTML == "Show") {
            video2.show();
            video2.removeClass('offset-2');
            video2.removeClass('col-8');
            video2.addClass('col-6');

            video1.removeClass('offset-2');
            video1.removeClass('col-8');
            video1.addClass('col-6');

            btn.innerHTML = "Close";
        }
        else {
            video2.hide();

            video1.show();
            video1.addClass('offset-2');
            video1.removeClass('col-6');
            video1.addClass('col-8');

            btn.innerHTML = "Show";
        }
    }
    
}

function groupNameBtnOnClick(){
	videoName = $("#groupNameField").val();
	console.log(groupName);

	var video1 = $("#video_part1");
	var video2 = $("#video_part2");

	var videoFile1  = './video/' + videoName;
    var videoFile2  = './video/' + videoName;

    video1.attr('src', videoFile1);
    video1[0].load();

    video2.attr('src', videoFile2);
    video2[0].load();
}

function offsetBtnOnClick(){
	offsetSecond = parseFloat($("#offsetSecField").val());
	console.log(offsetSecond);
}

function checkKey(e) {
    e = e || window.event;
    console.log(e);

    var video = $("#video_part1").get(0);

    var speedLabel = $("#speedTxt");

    if (e.keyCode == '32') {
        // Space
        // play pause        
        if ( video.paused ) {
            video.play();
        } else {
            video.pause();
        }
    }
    else if (e.keyCode == '188') {
        // Comma ,
        // prev 5s
        video.currentTime -= 5;
        if (video.currentTime < 0) {
            video.currentTime = 0;
        }
        // console.log(video.currentTime);
    }
    else if (e.keyCode == '190') {
        //Period .
       // next 5s
       video.currentTime += 5;
    }
    else if (e.keyCode == '219') {
       // Bracker Left [
       // Speed Down
       video.playbackRate -= 0.1;
       speedLabel.text(Math.floor(video.playbackRate*10)/10  +" x");
    }
    else if (e.keyCode == '221') {
       // Bracker Right ]
       // Speed Up
       video.playbackRate += 0.1;
       speedLabel.text(Math.floor(video.playbackRate*10)/10  +" x");
    }
    else if (e.keyCode == '222') {
       // Quote
       // Speed Normal
       video.playbackRate = 1.0;
       speedLabel.text(Math.floor(video.playbackRate*10)/10  +" x");
    }

}


// Always focus
$(document).ready(function() {
    // $("#video_part1").focus().bind('blur', function() {
    //     $(this).focus();            
    // });
    var video1 = $("#video_part1");
    video1.on(
        "timeupdate", 
        function(event){
            onTrackedVideoFrame(this.currentTime, this.duration);
    });
});

function onTrackedVideoFrame(currentTime, duration){
    
    totalSeconds = Math.floor(currentTime);
    minutes = Math.floor(totalSeconds / 60);
    seconds = totalSeconds % 60;

    $("#timeTxt").text(minutes.pad(2)+":"+seconds.pad(2));
}



$(function() {
    var videos = {
            a: Popcorn("#video_part1"),
            b: Popcorn("#video_part2"),
        },
        scrub = $("#scrub"),
        loadCount = 0,
        events = "play pause timeupdate seeking".split(/\s+/g);


    // iterate both media sources
    Popcorn.forEach(videos, function(media, type) {

        // when each is ready... 
        media.on("canplayall", function() {

            // trigger a custom "sync" event
            this.emit("sync");

            // set the max value of the "scrubber"
            scrub.attr("max", this.duration());

            // Listen for the custom sync event...    
        }).on("sync", function() {

            // Once both items are loaded, sync events
            if (++loadCount == 2) {

                // Iterate all events and trigger them on the video B
                // whenever they occur on the video A
                events.forEach(function(event) {

                    videos.a.on(event, function() {

                        // Avoid overkill events, trigger timeupdate manually
                        if (event === "timeupdate") {

                            if (!this.media.paused) {
                                return;
                            }
                            videos.b.emit("timeupdate");

                            // update scrubber
                            scrub.val(this.currentTime());

                            return;
                        }

                        if (event === "seeking") {
                            videos.b.currentTime(this.currentTime() +offsetSecond );
                        }

                        if (event === "play" || event === "pause") {
                            videos.b[event]();
                        }
                    });
                });
            }
        });
    });

    scrub.bind("change", function() {
        var val = this.value;
        videos.a.currentTime(val);
        videos.b.currentTime(val+offsetSecond);
    });

    // With requestAnimationFrame, we can ensure that as 
    // frequently as the browser would allow, 
    // the video is resync'ed.
    function sync() {
        if (videos.b.media.readyState === 4) {
            videos.b.currentTime(
                videos.a.currentTime() + offsetSecond
            );
        }
        // 方法通知瀏覽器我們想要產生動畫，並且要求瀏覽器在刷新畫面前呼叫特定函數刷新動畫
        requestAnimationFrame(sync);
    }

    sync();
});




Number.prototype.pad = function(size) {
  var s = String(this);
  while (s.length < (size || 2)) {s = "0" + s;}
  return s;
}