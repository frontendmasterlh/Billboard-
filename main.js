var audio = new Audio()
audio.autoplay = false
audio.loop = false
audio.volume = 0.5
var selectedChannel = ''
var selectedChannelName = ''
var song = {}
var allChannel = {}
var timer1
var timer2
var lyricY = 0


channelInit()
buttonInit()
selectProgress()




function channelInit() {
    $.ajax({
        url: '//jirenguapi.applinzi.com/fm/getChannels.php',    //请求频道API
        method: 'get'
    }).done(function (x) {
        let info = JSON.parse(x)
        let channels = info.channels
        channels.forEach((value) => {
            let channel = $('<div></div>')
                .addClass('channel')
                .attr("channel-id", value.channel_id)
                .attr("channel-name", value.name)
            $('.channels').append(channel)
            let title = $('<h3></h3>')
                .innerText = value.name
            let img = document.createElement('img')
            img.src = value.cover_small
            channel.append(img)
            channel.append(title)
        })
        allChannel = $('.channel')
        selectChannel(allChannel)
        initPlay(allChannel)
    })
}


function buttonInit() {
    $button = $('main .left .action>svg')
    $button.eq(0).on('click', function () {
        $button.eq(0).addClass('hidden')
        $button.eq(1).removeClass('hidden')
        audio.loop = true
    })

    $button.eq(1).on('click', function () {
        $button.eq(1).addClass('hidden')
        $button.eq(0).removeClass('hidden')
        audio.loop = false
    })
    $button.eq(2).on('click', function () {
        audio.play()
        audio.autoplay = true
    })
    $button.eq(3).on('click', function () {
        audio.pause()
    })
    $button.eq(4).on('click', function () {
        songSwitch(selectedChannel)
    })


    audio.addEventListener('playing', function () {
        $button.eq(2).addClass('hidden')
        $button.eq(3).removeClass('hidden')
        progressUpdate()
        lyricsScroll()
    })

    audio.addEventListener('pause', function () {
        $button.eq(3).addClass('hidden')
        $button.eq(2).removeClass('hidden')
        window.clearInterval(timer1)
        window.clearInterval(timer2)
        autoNext()
    })
}


var initPlay = function (channel) {
    let random = Math.round(Math.random() * (channel.length - 1))
    channel.eq(random).trigger('click')
}
var selectChannel = function (channel) {
    channel.on('click', function (e) {
        let $currentChannel = $(e.currentTarget)
        $currentChannel.addClass('active')
            .siblings().removeClass('active')
        selectedChannel = ($currentChannel[0].attributes[1].value)
        selectedChannelName = ($currentChannel[0].attributes[2].value)
        songSwitch(selectedChannel)
    })
}

var songSwitch = function (selectedChannel) {
    audio.pause()
    $('.right .duration')[0].innerText = '-0:00'
    setTimeout(function () {
        $.getJSON('//jirenguapi.applinzi.com/fm/getSong.php',  //请求歌曲API
            {channel: selectedChannel})
            .done(function (x) {
                song = x.song[0]
                setSong(song)
                getLyrics(song)
                window.clearInterval(timer2)
                lyricY = 0
            })
    }, 0)

}
var getLyrics = function (song) {
    $.getJSON('//jirenguapi.applinzi.com/fm/getLyric.php',  //请求歌词API
        {sid: song.sid})
        .done(function (x) {
            if (x.lyric) {
                let lyricArray = x.lyric.split('\n')   //将string转为array
                console.log(lyricArray);
                let html = ''
                lyricArray.forEach((value) => {
                    html += '<p>' + value.replace(/\[.+?\]/g, '') + '</p> '   //正则整理歌词
                    $('.lyrics').html(html)
                })
            } else {
                $('.lyrics').html('<p>暂无歌词</p>>')
            }

        })
}
var setSong = function (song) {
    audio.src = song.url
    $('.right>.tagName')[0].innerText = selectedChannelName
    $('.left>h1')[0].innerText = song.title
    $('.left>h2')[0].innerText = song.artist
    $('.right>h1')[0].innerText = song.title
    $('.right>h2')[0].innerText = song.artist
    $('.left>figure').css("background-image", "url(" + song.picture + ")")
}


var autoNext = function () {
    if (audio.ended === true && audio.loop === false) {
        console.log('end')
        $button.eq(4).trigger('click')
    }
}

var progressUpdate = function () {
    timer1 = setInterval(function () {
        let leftTime = audio.duration - audio.currentTime
        let min = parseInt(leftTime / 60)
        let sec = parseInt(leftTime % 60)
        if (sec < 10) {
            $('.right .duration')[0].innerText = '-' + min + ':0' + sec
        } else {
            $('.right .duration')[0].innerText = '-' + min + ':' + sec
        }
        let progress = audio.currentTime / audio.duration * 100
        $('.right .currentBar').css("width", progress + "%")
    }, 200)
}


var lyricsScroll = function () {
    timer2 = setInterval(function () {
        lyricY += 1
        let maxY = $('.lyrics').height() - ($(window).height() * 0.06)
        if (lyricY > maxY) {
            lyricY = 0
        }
        $('.lyrics').css({transform: 'translateY(-' + lyricY + 'px)'})
    }, 200)
}


function selectProgress(){
    let $progress=$('.progressBar')
    let {left,width}=$progress[0].getBoundingClientRect()
    $progress.on('click',(e)=>{
        let target=e.clientX;
        let progress= (target-left)/width
        console.log(progress);
        audio.currentTime=audio.duration*progress
    })
}


