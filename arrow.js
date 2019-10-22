!function () {

    let $left = $('.arrow-left')
    let $right = $('.arrow-right')
    let x = 0   //起始位置
    let y = 66    //每次移动距离
    let totalWidth=$(window).height()*0.26*40*0.9
    let currentWidth=$('.channel-wrapper').width()
    let limit=(totalWidth/currentWidth)*100
    $(window).resize(function() {
        totalWidth=$(window).height()*0.26*40*0.9
        currentWidth=$('.channel-wrapper').width()
        limit=(totalWidth/currentWidth)*100
    })

    $right.on('click', function (e) {
        x += y
        if(x>limit){x=limit}  //要根据当前视窗实际宽度计算确定
        $('.channels').css({transform: 'translateX(-' + x + '%)'})
    })


    $left.on('click', function (e) {
        x-= y
        if(x<0){x=0}
        $('.channels').css({transform: 'translateX(-' + x + '%)'})
    })


}.call()

