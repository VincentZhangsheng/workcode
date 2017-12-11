
    seajs.use(['jquery', 'Dialog', 'common'], function($, Dialog, com) {
        var familyTeams = '';
        if(familyTeams) {
            var selected_max = familyTeams;
        }else{
            var selected_max = 6;
        }

        // 选择日期
        $(function() {
            $('.js-date-select').on('click', function() {
                $('.date-sele-layout').show();
            });

            $('.js-layout-bg, .js-close-btn').on('click', function() {
                $(this).closest('.js-layout').hide();
            });

            $('.js-layout').on('click', '.date-wrapper .row', function() {
                var $this = $(this),
                    dateTime    = $this.attr('data-time'),
                    $spotSelect = $('.spot-select');

                // 重置其他列表 active
                $this.addClass('active').siblings('.row').removeClass('active');
                $('.date-sele-layout').hide();
                $('.js-date-select .d-time').text($(this).text());

                // 显示对应的选择场次
                $spotSelect.removeClass('active').css('display','none');
                $('.spot-select[data-time="' + dateTime + '"]').addClass('active').css('display','block');


                if($('.price-select .item').hasClass('active')){
                    $('.sele-tickets .row').remove();
                    setPrice();
                    //弹窗提示信息
                    Dialog.msg({
                        content: '更改场次后需要重新选择票价',
                        seconds: 1
                    })
                }
            });
        });

        // 选择场次
        $(function() {
            $('.spot-select').on('click', '.item:not(.disable):not(.active)', function(){
                var _this = $(this);
                var isFamilyCard = "0";
                if(parseInt(isFamilyCard)){
                    $.post('http://m.juooo.com/Item/familyCardAlready',{scid:_this.attr('data_id')},function(res){
                            if(res.code == 50011){
                                Dialog.msg({
                                    content: res.msg,
                                    seconds: 1
                                })
                                return false;
                            }else{
                                var overdue = _this.attr('overdue');
                                if(!overdue){
                                    Dialog.msg({
                                        content: '该年卡无法购买此排期',
                                        seconds: 1
                                    })
                                    return false;
                                }
                                switchScreen(_this);
                            }
                    },'json');
                }else{
                    switchScreen(_this);
                }
            });


            //异步请求票价
            if($('.spot-select .item').hasClass('active')) {
                var dataId = $('.spot-select .active').attr('data_id');
                var isFamilyCard = $('.spot-select .active').attr('isFamilyCard');
                var cooperation = $('.spot-select .active').attr('cooperation');
                var showTime = $('.spot-select .active').attr('showTime');
                var shelfTime = $('.spot-select .active').attr('shelfTime');

                priceInfo(dataId,isFamilyCard,cooperation,showTime,shelfTime);
            }
        });

        // 选择票价
        $(function() {
            //防止重复弹窗
            var msg_flag = 0;
            $('.price-select').on('click', '.item:not(.disable)', function(){
                var index,
                    $html,
                    price,
                    ticketid,
                    selected;
                if($(this).hasClass('active')) {
                    index = $(this).attr('data-index');
                    $(this).removeClass('active');
                    $('.sele-tickets .row[data-index='+ index +']').remove();
                    if($('.price-select .item.active').length === 0) {
                        $('.sele-tickets').hide();
                    }
                    boolMax();
                } else {
                    // 选票达到最大值，提醒用户
                    if(boolMax()) {
                        if(msg_flag === 1) return;
                        var content = parseInt(familyTeams) > 0 ? '年卡购票每单限购'+parseInt(selected_max)+'张' : '最多购买6张';
                           Dialog.msg({
                               content: content,
                               seconds: 1
                           });

                        setTimeout(function() {
                            msg_flag = 0;
                        }, 1000);
                        return;
                    }

                    index = +new Date();
                    price = $(this).find('.normal-price').text();
                    ticketid = $(this).find('.normal-price').attr('ticketid');
                    $(this).addClass('active').attr('data-index', index);
                    $html = "<div class=\"row\" data-index=\""+ index +"\">" +
                            "<span class=\"price\" ticketid="+ticketid+">"+ price +"</span>" +
                            "<div class=\"operate\">" +
                            "<i class=\"icon icon-minus js-minus disable\"></i>" +
                            "<span class=\"num\">1</span>" +
                            "<i class=\"icon icon-plus js-plus\"></i>" +
                            "<span class=\"line\"></span>" +
                            "<i class=\"icon icon-delete js-remove\"></i>" +
                            "</div>" +
                            "</div>";
                    $('.sele-tickets').append($html).show();
                }
                setPrice();
                selected = $('.js-sele-num .num').text();
                if(+selected == selected_max) {
                    $('.js-plus').addClass('disable');
                }
            });
        });

        // 底部已选门票操作
        $(function() {
            $('.sele-tickets').on('tap', '.js-minus, .js-plus, .js-remove', function() {
                var d_num,
                        sele_num = parseInt($('.js-sele-num .num').text()),
                        index;
                if($(this).hasClass('js-remove')) {
                    index = $(this).closest('.row').attr('data-index');
                    $('.price-select .item[data-index='+ index +']').removeClass('active');
                    d_num = $(this).closest('.row').find('.num').text();
                    $(this).closest('.row').remove();
                    $('.js-sele-num .num').text(sele_num - d_num);
                    if(sele_num - d_num === 0) {
                        $('.sele-tickets').hide();
                    }
                } else {
                    countNum($(this), 1, selected_max);
                }
                setPrice();
            });

            // 展开收起已选票
            // 展开收起已选票
            $('.js-sele-num').on('click', function() {
                if($('.sele-tickets .row').length > 0) {
                    $('.sele-tickets').toggle();
                    iconToggle();
                }
            });


            //点击提交按钮
            $('.sele-confirm').on('click',function(){
                var checkLogin = '4698374';
                if(checkLogin) {
                    var num = $('.js-sele-num .num').html();
                    if(parseInt(num) > 6) {
                        Dialog.msg({
                            content: '购买数量超出限制，每单限购6张'
                        })
                        return false;
                    }else {
                        //需要判断是否有票
                        if (parseInt(num) == 0)
                        {
                            Dialog.msg({
                                content: '请选择票价'
                            })
                        }else {
                            var ticketid,
                                quantity,
                                    tickets ='',
                                    type = 2;
                            
                            var sportItemSelect = $("#js-select-wrapper").find('div.spot-select.active').find('.item.active');
                            if(sportItemSelect.length == 1)
                            {	//避免机型不兼容出现选择多个场次
                            	var selectedScheId = sportItemSelect.attr('data_id');
                            	if(selectedScheId > 0)
                            	{
                            		$('.sele-tickets .row').each(function() {
                                        ticketid = $(this).find('.price').attr('ticketid');
                                        quantity = $(this).find('.operate .num').text();
                                        tickets += ticketid+'_'+quantity+'_'+type+'^';
                                    });

                                    $.ajax({
                                        type:'POST',
                                        url:'http://m.juooo.com/Item/buyTickets',
                                        data:{type:1,tickets:tickets,isFamilyCard:'0',scid:selectedScheId},
                                        dataType:'json',
                                        success:function(result)
                                        {
                                            if(result.code == 'ok' && result.data) {
                                                window.location.href=result.data;
                                            }else{
                                                Dialog.msg({
                                                    content:result.msg,
                                                })
                                            }
                                        }
                                    });
                            	}
                            }
                            else
                            {
                            	Dialog.msg({
                                    content : '请选择一个场次',
                                })
                            }
                        }
                    }
                }else{
                    window.location.href="http://m.juooo.com/passport/login?return_url=http%3A%2F%2Ftouch.juooo.com%2Fticket%2F74472";
                }
            });
        });

        function iconToggle() {
            if($('.sele-tickets').css('display') == 'block') {
                $('.js-sele-num .icon').removeClass('icon-circle-arrow-bottom').addClass('icon-circle-arrow-top');
            } else {
                $('.js-sele-num .icon').removeClass('icon-circle-arrow-top').addClass('icon-circle-arrow-bottom');
            }
        }



        /**
         *切换场次请求票价
         */
        function switchScreen(_this){
            _this.siblings('.item').removeClass('active');
            _this.addClass('active');

            if($('.price-select .item').hasClass('active')){
                $('.sele-tickets .row').remove();
                setPrice();
                //弹窗提示信息
                Dialog.msg({
                    content: '更改场次后需要重新选择票价',
                    seconds: 1
                })
            }


            //清空票价
            $('.price-select').html('');
            //异步请求票价
            if($('.spot-select .item').hasClass('active')) {
                var dataId = _this.attr('data_id');
                var isFamilyCard = _this.attr('isFamilyCard');
                var cooperation = _this.attr('cooperation');
                var showTime = _this.attr('showTime');
                var shelfTime = _this.attr('shelfTime');

                priceInfo(dataId,isFamilyCard,cooperation,showTime,shelfTime);
            }
        }

        //请求票价
        function priceInfo(dataId,isFamilyCard,cooperation,showTime,shelfTime){
            var isFamilySell = "0";
            $.ajax({
                type:'POST',
                url:'http://m.juooo.com/Item/ticketPriceInfo',
                data:{scid:dataId,isFamilyCard:isFamilyCard,cooperation:cooperation,showTime:showTime,shelfTime:shelfTime,isFamilySell:isFamilySell},
                dataType:'json',
                success:function(result)
                {
                    if(result.msg == 'ok' && result.data) {
                        //票价排序
                        function sortprice(a, b){
                            return a.price - b.price;
                        }
                        result.data.sort(sortprice);

                        var html = '';
                        $('.price-select').html('');
                        $.each(result.data, function (key, val) {
                            html += '<div class="item '+val.num+'" data-price="' + val.price + '">';
                            html += '<span class="row normal-price" ticketid="'+val.id+'">￥' + val.price + '</span>';
                            if(val.name){
                                html += '<span class="row group-price">';
                               /*if(val.ispackage){
                                   html += '套票';
                               }*/
                                html += val.name+'</span>';
                            }
                            html += '</div>';
                        });
                        $('.price-select').append(html);
                    }else{
                        var html = '';
                        html += '<div class="item disable">';
                        html += '<span class="row normal-price">票价待定</span>';
                        html += ' </div>';
                        $('.price-select').html(html);
                    }
                }
            });
        }
        function countNum($ele, min, max) {
            var $num    = $ele.siblings('.num'),
                    selected = +$('.js-sele-num .num').text(),
                    num     = $num.text();

            if($ele.hasClass('js-minus') && $num.text() > min) {
                $num.text(num - 1);
                $('.js-plus').removeClass('disable');
                if($num.text() == min) {
                    $ele.addClass('disable');
                }
            } else if($ele.hasClass('js-plus') && selected < max) {
                $num.text(+num + 1);
                $('.js-sele-num .num').text(selected + 1);
                $ele.siblings('.js-minus').removeClass('disable');
                boolMax();
            } else {
                return;
            }

        }

        function boolMax() {
            var selected = +$('.js-sele-num .num').text();
            if(parseInt(selected) === parseInt(selected_max)) {
                $('.js-plus').addClass('disable');
                return 1;
            } else {
                $('.js-plus').removeClass('disable');
                return 0;
            }
        }

        // 设置总票价
        function setPrice() {
            var total_price = 0,
                    single_price,
                    index,
                    single_num,
                    total_num = 0;
            $('.price-select .item.active').each(function() {
                single_price = +$(this).attr('data-price');
                index = $(this).attr('data-index');
                single_num = +$('.sele-tickets .row[data-index='+ index +']').find('.num').text();
                total_num += single_num;
                total_price += single_price * single_num;
            });

            $('.js-sele-price').text('￥' + total_price.toFixed(2));
            $('.js-sele-num .num').text(total_num);
            boolMax();
            iconToggle();
        }

        $('.date-sele-layout-wrapper').on('touchmove', function(e) {
            e.stopPropagation();
        })
    });



	
    seajs.use(['jquery', 'Dialog','dateFormat', 'countDown', 'tab', 'swipe','common'], function($, Dialog,dateFormat) {
    	var promotionUrl   = "http://m.juooo.com/Item/receivePromotion";
    	var loginUrl       = "http://m.juooo.com/passport/login?return_url=http%3A%2F%2Fm.juooo.com%2Fticket%2F77391"; 
    	var isScheOffShelf = "";
    	var sid = "77391";
    	var sellState = "1";
    	
    	if( !isScheOffShelf )
    	{
    		//促销信息
        	getDiscountInfo();
    	}
    	
        //关注
        $('.js-guanzhu-btn').on('tap', function() {
            var $that = $(this);
            var checkLogin = '4698374';
            if(checkLogin) {
                $.ajax({
                    type:'POST',
                    url:"http://m.juooo.com/Item/followSchedule",
                    data:{'scid':"77391",'uid':checkLogin},
                    dataType:'json',
                    success:function(result)
                    {
                        //关注数据
                        $that.toggleClass('active');
                        if($that.hasClass('active')){
                            Dialog.msg({
                                content: '关注成功'
                            })
                        }else{
                            Dialog.msg({
                                content: '取消关注'
                            })
                        }
                    }
                });
            } else {
                window.location.href='http://m.juooo.com/passport/login?return_url=http%3A%2F%2Fm.juooo.com%2Fticket%2F77391';
            }
        });

        //获取巡演总数
        $.ajax({
            type:'POST',
            url:"http://m.juooo.com/Item/getTourScheduleNum",
            data:{sid:"32048"},
            dataType:'json',
            success:function(result)
            {
                if (result.msg == 'ok' && parseInt(result.data) > 2) {
                    //巡演数据
                    $('.round-num span').html(result.data);
                    $('.round-num').css('display','block');
                    $('.round-num').attr('href','http://m.juooo.com/tour/tourshowinfo?sid='+"32048");
                }
            }
        });

        // 弹框
        $(function() {
            var isWeiXin = "";
            var $share = isWeiXin ? $('.share-wechat-wrapper') : $('.share-wrapper');
            var $kill = $('.kill-wrapper'),
                    $schedule = $('.schedule-wrapper'),
                    $coupon = $('.coupon-wrapper'),
                    $promotion = $('.promotion-wrapper'),
                    $bg = $('.js-shadow-bg');

            // 分享按钮点击，弹出分享框
            $('.js-share-btn').on('tap', function() {
                $share.addClass('active');
                $bg.addClass('active');

                var title = '【小橙堡】大型奇幻音乐儿童剧《小伴龙·魔法生日会》'; // 分享标题
                var returnUrl = 'http://m.juooo.com/ticket//77391';
                var schedularPic = "http://image.juooo.com/group1/M00/00/A1/rAoKOVimYQ6Ad6tUAAH25-kuG-I880.jpg";
                var content = '【小橙堡】大型奇幻音乐儿童剧《小伴龙·魔法生日会》';

                //微博分享
                $('.icon-weibo').on('tap', function(){
                    var weiXinUrl = 'http://service.weibo.com/share/share.php?&title='+title+'&url='+returnUrl+'&pic='+schedularPic;
                    $(this).attr('href',weiXinUrl);
                });

                //qq分享
                $('.icon-qq').on('tap', function(){
                    var qqUrl= 'http://share.v.t.qq.com/index.php?c=share&a=index&url='+returnUrl+'&title='+title+'&summary='+'&pic='+schedularPic;
                     $(this).attr('href',qqUrl);
                });

                //qq空间分享
                $('.icon-qzone').on('tap', function(){
                    var qzoneUrl = 'http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url='+returnUrl+'&title='+title+'&summary='+'&pic='+schedularPic;
                    $(this).attr('href',qzoneUrl);
                });

            });
            
         	// 优惠券点击，弹出优惠券弹框
            $(document).on('tap', '.js-coupon', function() {
                $coupon.addClass('active');
                $bg.addClass('active');
            });

            // 促销点击，弹出促销信息弹框
            $(document).on('tap', '.js-promotion', function() {
                $promotion.addClass('active');
                $bg.addClass('active');
            });
            
            $('.coupon-wrapper,.promotion-wrapper').on('touchmove', '.coupons,.promotions',function(e) {
                e.stopPropagation();
            });

            // 年卡选座按钮点击，弹出选择场次框
            $('.js-card-seating').on('tap', function() {
                var checkLogin = '4698374';
                if(checkLogin) {
                    var ticket_url = "";
                    var _this = $(this);

                    //已经登录则判断年卡
                    $.post("http://m.juooo.com/Item/isBingdingYearCard", {scid:"77391",isFamilyCard:"1",
                        showTime:"1498876200",cooperation:"1",shelfTime:"0",
                        cate1Id:"38",cate2Id:"55",
                        sid:"32048",venueId:"1949"},function(res){
                        if(res.yearCardOk == 'yes' || (res.yearCardIsOnlineseat == 'yes' &&　ticket_url)) {
                            //场次
                            $.ajax({
                                type:'POST',
                                url:'http://m.juooo.com/Item/showStage',
                                data:{show_id:'32048',city_id:'10019',venue_id:'1949',
                                    is_family_sell:'1',sellStatus:_this.attr('sell-status')},
                                dataType:'json',
                                success:function(result) {

                                    if(result.msg == 'ok') {
                                        if(result.num) {
                                            var htmlTime = '';
                                            $.each(result.data,function(key, val){
                                                htmlTime+= '<span class="day swiper-slide">'+key+'</span>';

                                            });
                                            $('.date-swiper .swiper-wrapper').append(htmlTime);

                                            var html;
                                            $('.sche-block .swiper-wrapper').html('');
                                            $.each(result.data,function(k, v){
                                                html='';
                                                html+= '<div class="swiper-slide sche-sessions">';
                                                $.each(result.data[k],function(key,val){
                                                    html+= '<div class="session '+val.time+'" schedularId="'+val.id+'" ' +
                                                            'isFamilyCard ="'+val.is_family_sell+'" cooperation="'+val.method+'"' +
                                                            'showTime="'+val.showtime+'" shelfTime="'+val.shelf_time+'" cate1Id="'+"38"+'"' +
                                                            ' cate2Id="'+"55"+'" showId="'+val.show_id+'"' +
                                                            ' venueId ="'+"1949"+'" ' +
                                                            ' seatTicketUrl="'+val.seatTicketUrl+'"  selectPriceUrl="'+val.selectPriceUrl+'">';
                                                    if(parseInt(val.is_through_ticket) == 1 && val.custom_show_time){
                                                        html+= '<p class="se-date">'+val.custom_show_time+'</p>';
                                                    }else{
                                                        html+='<p class="se-date">'+val.show_time+'</p><p class="se-time">'+val.week_time+'</p>';
                                                    }
                                                    html+= '</div>';
                                                });
                                                html+= '</div>';
                                                $('.sche-block .swiper-wrapper').append(html);
                                            });
                                            schSlide();


                                        } else {
                                            var html;
                                            $('.date-swiper .swiper-wrapper').hide();
                                            $('.sche-block .swiper-wrapper').html('');
                                            html='';
                                            html+= '<div class="swiper-slide sche-sessions">';
                                            $.each(result.data,function(key,val){
                                                html+= '<div class="session '+val.time+'" schedularId="'+val.id+'" ' +
                                                        'isFamilyCard ="'+val.is_family_sell+'" cooperation="'+val.method+'"' +
                                                        'showTime="'+val.showtime+'" shelfTime="'+val.shelf_time+'" cate1Id="'+"38"+'"' +
                                                        ' cate2Id="'+"55"+'" showId="'+val.show_id+'"' +
                                                        ' venueId ="'+"1949"+'" ' +
                                                        ' seatTicketUrl="'+val.seatTicketUrl+'"  selectPriceUrl="'+val.selectPriceUrl+'">';
                                                if(parseInt(val.is_through_ticket) == 1 && val.custom_show_time){
                                                    html+= '<p class="se-date">'+val.custom_show_time+'</p>';
                                                }else{
                                                    html+='<p class="se-date">'+val.show_time+'</p><p class="se-time">'+val.week_time+'</p>';
                                                }
                                                html+= '</div>';
                                            });
                                            html+= '</div>';
                                            $('.sche-block .swiper-wrapper').append(html);
                                        }

                                        $schedule.addClass('active');
                                        $bg.addClass('active');
                                    }
                                }});
                        } else {
                            if(res.yearCardMsg){
                                Dialog.msg({
                                    content: res.yearCardMsg
                                })
                                return false;
                            }else{
                                // // 绑定年卡提示弹窗
                                Dialog.open({
                                    title: '提示',
                                    content: '<span style="text-align: center;">您还未绑定年卡，是否现在去绑定</span>',
                                    okBtnText: '去绑定',
                                    cancelBtnText: '取消',
                                    okBtnCallback: function(index) {
                                        window.location.href="http://m.juooo.com/Card/bindCard";//需要添加绑定流程页面
                                        Dialog.close(index);
                                    }
                                })
                            }
                        }
                    },'json');
                } else{
                    window.location.href='http://m.juooo.com/passport/login?return_url=http%3A%2F%2Fm.juooo.com%2Fticket%2F77391';
                }
            });


            //年卡购票
            $('.js-card-ticket').on('tap',function(){
                var checkLogin = '4698374';
                if(checkLogin) {
                    //已经登录则判断年卡
                    $.post("http://m.juooo.com/Item/isBingdingYearCard", {scid:"77391",isFamilyCard:"1",
                        showTime:"1498876200",cooperation:"1",shelfTime:"0",
                        cate1Id:"38",cate2Id:"55",
                        sid:"32048",venueId:"1949"},function(res){
                        var cardId = "0";

                        if(res.yearCardOk == 'yes' && res.yearCardMsg == 'ok') {
                            if(parseInt(res.yearCardNum) > 1 && parseInt(cardId) == 0){
                                var scid = "77391";
                                var resultUrl = "http%3A%2F%2Fm.juooo.com%2FItem%2FselectPrice%3Fscid%3D77391%26isFamilyCard%3D1";
                                window.location.href='http://m.juooo.com/Card/index?return_url='+resultUrl+'&scid='+scid;
                            }else{
                                var url = "http://m.juooo.com/Item/selectPrice?scid=77391&isFamilyCard=1";
                                window.location.href=url;
                            }
                        }else{
                            if(res.yearCardMsg){
                                Dialog.msg({
                                    content: res.yearCardMsg
                                })
                                return false;
                            }else{
                                Dialog.msg({
                                    content: '您当前不满足年卡购买条件！'
                                })
                                return false;
                            }

                        }
                    },'json');
                } else {
                    window.location.href='http://m.juooo.com/passport/login?return_url=http%3A%2F%2Fm.juooo.com%2Fticket%2F77391';
                }
            });

            //在线选座
            $('.js-seat-online,.sell-now').on('tap', function(){

                var checkLogin = '4698374';
                if(checkLogin) {
                    var _this = $(this);
                    //场次
                    $.ajax({
                        type: 'POST',
                        url: 'http://m.juooo.com/Item/showStage',
                        data: {
                            'show_id': '32048',
                            'city_id': '10019',
                            'venue_id': '1949',
                            'sellStatus': _this.attr('sell-status'),
                        },
                        dataType: 'json',
                        success: function (result) {
                            if (result.msg == 'ok') {
                                if (result.num) {
                                    var htmlTime = '';
                                    $.each(result.data, function (key, val) {
                                        htmlTime += '<span class="day swiper-slide">' + key + '</span>';

                                    });
                                    $('.date-swiper .swiper-wrapper').append(htmlTime);

                                    var html;
                                    $('.sche-block .swiper-wrapper').html('');
                                    $.each(result.data, function (k, v) {
                                        html = '';
                                        html += '<div class="swiper-slide sche-sessions">';
                                        $.each(result.data[k], function (key, val) {
                                            html += '<div class="session ' + val.time + '" schedularId="'+val.id+'"  isFamilySell="'+val.is_family_sell+'" cooperation="'+val.method+'"' +
                                                    ' showTime="'+val.showtime+'" shelfTime="'+val.shelf_time+'" url="'+val.url+'">';
                                            if(parseInt(val.is_through_ticket) == 1 && val.custom_show_time){
                                                html+= '<p class="se-date">'+val.custom_show_time+'</p>';
                                            }else{
                                                html+='<p class="se-date">'+val.show_time+'</p><p class="se-time">'+val.week_time+'</p>';
                                            }
                                            html += '</div>';
                                        });
                                        html += '</div>';
                                        $('.sche-block .swiper-wrapper').append(html);
                                    });
                                    schSlide();

                                } else {
                                    var html = '';;
                                    $('.date-swiper .swiper-wrapper').hide();
                                    $('.sche-block .swiper-wrapper').html('');
                                    html += '<div class="swiper-slide sche-sessions">';
                                    $.each(result.data, function (key, val) {
                                        html +=  '<div class="session ' + val.time + '" schedularId="'+val.id+'"  isFamilySell="'+val.is_family_sell+'" cooperation="'+val.method+'"' +
                                                ' showTime="'+val.showtime+'" shelfTime="'+val.shelf_time+'" url="'+val.url+'">';
                                        if(parseInt(val.is_through_ticket) == 1 && val.custom_show_time){
                                            html+= '<p class="se-date">'+val.custom_show_time+'</p>';
                                        }else{
                                            html+='<p class="se-date">'+val.show_time+'</p><p class="se-time">'+val.week_time+'</p>';
                                        }
                                        html += '</div>';
                                    });
                                    html += '</div>';
                                    $('.sche-block .swiper-wrapper').append(html);
                                }

                                $schedule.addClass('active');
                                $bg.addClass('active');
                                myScroll.refresh();
                            }
                        }
                    });
                } else {
                    window.location.href='http://m.juooo.com/passport/login?return_url=http%3A%2F%2Fm.juooo.com%2Fticket%2F77391';
                }
            });

            if(!isScheOffShelf && sellState == 1)
            {
	            //秒杀
	            $.ajax({
	                type:'POST',
	                url:'http://m.juooo.com/Item/getSeckillList',
	                data:{schedularId:'77391'},
	                dataType:'json',
	                success:function(result) {
	                    //双11使用
	                    /*
	                    if(result.msg == 'ok' && result.data.list){
	                        var html = '';
	                        $.each(result.data.list, function(key, val){
	                        	if(isScheOffShelf)
	                        	{
	                        		var jsKillClass = '';
	                        	}
	                        	else
	                        	{
	                        		var jsKillClass = 'js-kill';
	                        	}
	                            var nowtime = Date.parse(new Date())/1000;
	                            html += '<article class="dt-kill ';
	                            if ( (val.activity_seckill_start_time < nowtime) && (parseInt(val.ticketStock) == 0 || parseInt(val.listStock) == 0) )
	                            {
	                                html += 'dt-kill-out';
	                            }
	                            html += '">';
	                            html+= '<div class="left js-count-down" data-time="00">';
	                            html+= '<i class="icon-1212"></i></div>';
	                            html+= ' <div class="right '+jsKillClass+'" seckill_ticket_id="'+val.activity_seckill_ticket_list_id+'" ticket_id="'+val.ticket_id+'">';
	                            html+= '<span class="price-now">￥'+val.seckill_ticket_price+'</span>';
	                            html+= '<span class="price-pre">￥'+val.ticket_price+'</span>';
	                            
	                            if ( (val.activity_seckill_start_time < nowtime) && (parseInt(val.ticketStock) != 0 && parseInt(val.listStock) != 0  &&  !isScheOffShelf))
	                            {
	                                html+= ' <i class="icon icon-menu-right"></i>';
	                            }
	                            
	                            html+= '</div>';
	                            if ( (val.activity_seckill_start_time < nowtime) && (parseInt(val.ticketStock) == 0 || parseInt(val.listStock) == 0) )
	                            {
	                                html+= '<div class="kill-out-img"></div>';
	                            }
	                            html+= '</article>';
	                        });
	
	                        $('.seckill').append(html);
	
	                        setTimeout(function() {
	                            myScroll.refresh();
	                        }, 10);
	                    }
	                    */
	                    //先注释
	                    
	                    if(result.msg == 'ok' &&　result.data.list) {
	                        var html ='';
	                        var nowTime = parseInt(Date.parse(new Date())/1000);
	                        $.each(result.data.list,function(key, val) {
	                            html += '<article class="dt-kill ';
	                            if ( (val.activity_seckill_start_time < nowTime) && (parseInt(val.ticketStock) == 0 || parseInt(val.listStock) == 0 || val.activity_seckill_end_time < nowTime ))
                                {
	                                html += 'dt-kill-out';
	                            }
                                html += '">';
	                            
	                            if(val.activity_seckill_start_time > result.data.time){
	                                html+= '<div class="left js-count-down js-count-down-start" data-time-start="'+val.activity_seckill_start_time+'" data-time-end="'+val.activity_seckill_end_time+'">';
	                                html+= '<i class="icon icon-time">秒杀</i>';
	                                html+= '<span class="status js-count-down-text">距离开始</span>';
	                            }else if((val.activity_seckill_end_time > result.data.time)){
	                                html+= '<div class="left js-count-down js-count-down-start" data-time="'+val.activity_seckill_end_time+'">';
	                                html+= '<i class="icon icon-time">秒杀</i>';
	                                html+= '<span class="status js-count-down-text">距离结束</span>';
	                            }else{
	                                html+= '<div class="left js-count-down js-count-down-start" data-time="00">';
	                                html+= '<i class="icon icon-time">秒杀</i>';
	                                html+= '<span class="status js-count-down-text">秒杀结束</span>';
	                            }
	                            if(isScheOffShelf)
	                            {
	                            	var jsKill = "";
	                            }
	                            else
	                            {
	                            	var jsKill = "js-kill";
	                            }
	                            html+= '<span class="hh js-hours">00</span>：<span class="mm js-minutes">00</span>：<span class="ss js-seconds">00</span>';
	                            html+= '</div>';
	                            html+= '<div class="right '+jsKill+'" seckill_ticket_id="'+val.activity_seckill_ticket_list_id+'" ticket_id="'+val.ticket_id+'">';
	                            html+= '<span class="price-now">￥'+val.seckill_ticket_price+'</span>';
	                            html+= '<span class="price-pre">￥'+val.ticket_price+'</span>';
	                            if(val.activity_seckill_start_time < nowTime)
	                            {
	                                if (parseInt(val.ticketStock) != 0 && parseInt(val.listStock) != 0 && !isScheOffShelf)
	                                {
	                                    html+= ' <i class="icon icon-menu-right"></i>';
	                                }
	                                html+= '</div>';
	                                if (parseInt(val.ticketStock) == 0 || parseInt(val.listStock) == 0 || val.activity_seckill_end_time < nowTime)
	                                {
	                                    html+= '<div class="kill-out-img"></div>';
	                                }
	                                html+= '</article>';
	                            }
	                            else
	                            {
	                                html+= ' <i class="icon icon-menu-right"></i>';
	                                html+= '</div>';
	                                html+= '</article>';
	                            }
	                            
	                        });
	
	                        $('.seckill').append(html);
	                        $('.js-count-down').countdown({});
	
	                        // 秒杀倒计时
	                        var startTime = $('.js-count-down-start').attr('data-time-start') * 1000;
	                        $('.js-count-down-start').countdown({
	                            endTime: startTime,
	                            endProcess: function () {
	                                var $countDown = $('.js-count-down');
	
	                                // 判断当前是开始时间还是结束时间
	                                if($('.js-count-down-start').length > 0) {
	
	                                    // 修改文本
	                                    $countDown.find('.js-count-down-text').text('距离结束');
	                                    var endTime = $countDown.attr('data-time-end') * 1000;
	
	                                    $('.js-count-down').countdown({
	                                        endTime: endTime
	                                    })
	                                }
	                            }
	                        });
	                        setTimeout(function() {
	                            myScroll.refresh();
	                        }, 10);
	                    }
						
	                }
	            });
            }
            // 秒杀点击，弹出秒杀弹框
            $(document).on('tap', '.dt-kill:not(.dt-kill-out) .js-kill',function(e) {
                var checkLogin = '4698374';
                if(checkLogin) {
                    var _this = $(this);
                    var seckill_ticket_id = $(this).attr('seckill_ticket_id');
                    $.ajax({
                        type:'POST',
                        url:'http://m.juooo.com/Item/getSeckillInfo',
                        data:{'activity_seckill_ticket_list_id':seckill_ticket_id},
                        dataType:'json',
                        success:function(result) {
                            if(result.msg == 'ok' && result.data) {
                                var nowtime = Date.parse(new Date())/1000;
                                if(result.data.activity_seckill_start_time < nowtime){
                                    if(parseInt(result.data.limit_nums) == 0){
                                        Dialog.msg({
                                            content: '该秒杀已抢完',
                                            seconds: 1
                                        });
                                        return false;
                                    }

                                    if(parseInt(result.data.limit_nums) !== 0){
                                        $kill.addClass('active');
                                        var html= '';
                                        html+= '<div class="kill-layout">';
                                        html+= '<div class="title">选择数量<i class="icon icon-remove js-close-btn"></i></div>';
                                        html+= '<div class="kill-block"><div class="kill-item">';
                                        html+= '<img class="poster" src="http://image.juooo.com'+result.data.pic+'" alt="">';
                                        html+= '<div class="kill-right">';
                                        html+= '<div class="desc">'+result.data.schedular_name+'</div>';
                                        html+= ' <span class="time">时间： '+result.data.show_time+'</span>';
                                        html+= '<span class="price">￥ '+result.data.seckill_ticket_price+'<s class="c-666">￥'+result.data.ticket_price+'</s></span>';
                                        html+= '</div></div>';
                                        html+= '<div class="kill-num">';
                                        html+= '<span>数量：</span>';
                                        html+= '<div class="count"><span class="icon icon-minus js-minus disable" limit_num="'+result.data.limit_nums+'"></span>';
                                        html+= '<span class="num">1</span>';
                                        html+= '<span class="icon icon-plus js-plus';
                                        if(parseInt(result.data.limit_nums) == 1){
                                            html+= ' disable';
                                        }
                                        html+= '" limit_num="'+result.data.limit_nums+'""></span></div></div>';
                                        if(!isScheOffShelf)
                                        {
                                        	var classKill = "kill-submit";
                                        }
                                        else
                                        {
                                        	var classKill = "";
                                        }
                                        html+= '<div class="'+classKill+' layout-confirm-btn" ticketid="'+result.data.activity_seckill_ticket_list_id+'">提交</div></div></div>';
                                        $kill.html(html);
                                        $bg.addClass('active');
                                    }
                                }else{
                                    Dialog.msg({
                                        content: '该秒杀还未开始哦~',
                                        seconds: 1
                                    });
                                    return false; 
                                }
                            }
                        }
                    });
                } else {
                    window.location.href='http://m.juooo.com/passport/login?return_url=http%3A%2F%2Fm.juooo.com%2Fticket%2F77391';
                }
            });


            //立即购买
            $('.buy-now').on('tap',function(){
                var checkLogin = '4698374';
                var isJumpBuy  = "";
                
                if(checkLogin) {
                    var _this = $(this);
                    if(isJumpBuy == "1")
                    {	//自动结算页
                    	checkJumpScid();
                    	return false;
                    }
                    else
                    {
                    	//场次
                        $.ajax({
                            type: 'POST',
                            url: 'http://m.juooo.com/Item/showStage',
                            data: {
                                'show_id': '32048',
                                'city_id': '10019',
                                'venue_id': '1949',
                                'sellStatus': _this.attr('sell-status'),
                            },
                            dataType: 'json',
                            success: function (result) {
                                if(result.sell) {//场次
                                    showGame(result, $schedule, $bg);
                                }else {//选择票价页
                                    window.location.href="http://m.juooo.com/Item/selectPrice?scid=77391";
                                }
                            }
                        });
                    }
                    
                } else {
                	var returnUrl = (isJumpBuy == "1") ? "http://m.juooo.com/passport/login?return_url=http%253A%252F%252Fm.juooo.com%252Fticket%252F77391" : 'http://m.juooo.com/passport/login?return_url=http%3A%2F%2Fm.juooo.com%2FItem%2FselectPrice%3Fscid%3D77391';
                	window.location.href = returnUrl;
                }
            });

            //结算页
            $(document).on('tap','.kill-submit', function(){
                var _this = $(this);
                var ticketid = _this.attr('ticketid');
                var num = _this.prev('.kill-num').find('.count .num').text();
                $.ajax({
                    type:'POST',
                    url:'http://m.juooo.com/Item/buyTickets',
                    data:{type:2,ticketid:ticketid,quantity:num,sid:sid},
                    dataType:'json',
                    success:function(result) {
                        if(result.code == 'ok' && result.data) {
                            window.location.href=result.data;
                        }else{
                            _this.closest('.active').removeClass('active');
                            $bg.removeClass('active');
                            Dialog.msg({
                                content:result.msg,
                            })
                        }
                    }
                });
            });

            // 弹框关闭按钮点击，关闭相应弹框
            $(document).on('tap', '.js-close-btn', function() {
                $('.date-swiper .swiper-wrapper').html('');

                $(this).closest('.active').removeClass('active');
                $bg.removeClass('active');
            });

            $('.js-shadow-bg').on('tap', function() {
                $('.js-close-btn').closest('.active').removeClass('active');
                $(this).removeClass('active');
                $('.share-wechat-wrapper').removeClass('active');
            });

            $('.share-wechat-wrapper').on('tap', function() {
                $bg.removeClass('active');
                $('.share-wechat-wrapper').removeClass('active');
            });

            // 弹框激活状态， 禁止背景内容滚动
            $(document).on('touchmove', function(e) {
                if ($bg.hasClass('active')) {
                    e.preventDefault();
                    e.stopPropagation();
                }
            });
        });

        //选择场次
        function showGame(result, $schedule, $bg){
            if (result.msg == 'ok') {
                if (result.num) {
                    var htmlTime = '';
                    $.each(result.data, function (key, val) {
                        htmlTime += '<span class="day swiper-slide">' + key + '</span>';

                    });
                    $('.date-swiper .swiper-wrapper').append(htmlTime);

                    var html;
                    $('.sche-block .swiper-wrapper').html('');
                    $.each(result.data, function (k, v) {
                        html = '';
                        html += '<div class="swiper-slide sche-sessions">';
                        $.each(result.data[k], function (key, val) {
                            html += '<div class="session ' + val.time + '" schedularId="'+val.id+'"  isFamilySell="'+val.is_family_sell+'" cooperation="'+val.method+'"' +
                                    ' showTime="'+val.showtime+'" shelfTime="'+val.shelf_time+'" url="'+val.url+'">';
                            if(parseInt(val.is_through_ticket) == 1 && val.custom_show_time){
                                html+= '<p class="se-date">'+val.custom_show_time+'</p>';
                            }else{
                                html+='<p class="se-date">'+val.show_time+'</p><p class="se-time">'+val.week_time+'</p>';
                            }
                            html += '</div>';
                        });
                        html += '</div>';
                        $('.sche-block .swiper-wrapper').append(html);
                    });

                    schSlide();

                } else {
                    var html = '';;
                    $('.date-swiper .swiper-wrapper').hide();
                    $('.sche-block .swiper-wrapper').html('');
                    html += '<div class="swiper-slide sche-sessions">';
                    $.each(result.data, function (key, val) {
                        html +=  '<div class="session ' + val.time + '" schedularId="'+val.id+'"  isFamilySell="'+val.is_family_sell+'" cooperation="'+val.method+'"' +
                                ' showTime="'+val.showtime+'" shelfTime="'+val.shelf_time+'" url="'+val.url+'">';
                        if(parseInt(val.is_through_ticket) == 1 && val.custom_show_time){
                            html+= '<p class="se-date">'+val.custom_show_time+'</p>';
                        }else{
                            html+='<p class="se-date">'+val.show_time+'</p><p class="se-time">'+val.week_time+'</p>';
                        }
                        html += '</div>';
                    });
                    html += '</div>';
                    $('.sche-block .swiper-wrapper').append(html);
                }

                $schedule.addClass('active');
                $bg.addClass('active');
                myScroll.refresh();
            }
        }

        function  schSlide(){
            var slide_width = $('.day.swiper-slide').width() + 2 * parseInt($('.day.swiper-slide').css('margin-left'));
            var sche_swiper = new Swiper('.sche-swiper', {
                spaceBetween: 100,
                speed: 300,
                onTransitionStart: function(swiper) {
                    $('.sche-swiper .swiper-slide .session').removeClass('active');
                    $('.sche-swiper .swiper-slide-active .session').eq(0).addClass('active');
                }
            });

            var date_swiper = new Swiper('.date-swiper', {
                spaceBetween: 0,
                slidesPerView : 'auto',
                slidesOffsetAfter : $('body').width() - slide_width,
                // centeredSlides: true,
                // touchRatio: 0.2,
                slideToClickedSlide: true,
            });

            sche_swiper.params.control = date_swiper;
            date_swiper.params.control = sche_swiper;
        }

        $(function() {
            $('.kill-wrapper').on('tap', '.js-minus, .js-plus', function() {
                var limitNum = parseInt($(this).attr('limit_num'));
                countNum($(this), 1, limitNum);
            });
            // 选择票数，加减操作
            function countNum($ele, min, max) {
                var $num = $ele.siblings('.num'),
                        num = $num.text();
                if ($ele.hasClass('js-minus') && $num.text() > min) {
                    $num.text(num - 1);
                    $ele.siblings('.js-plus').removeClass('disable');
                    if ($num.text() == min) {
                        $ele.addClass('disable');
                    }
                } else if ($ele.hasClass('js-plus') && $num.text() < max) {
                    $num.text(+num + 1);
                    $ele.siblings('.js-minus').removeClass('disable');
                    if ($num.text() == max || $num.text() == 1) {
                        $ele.addClass('disable');
                    }
                } else {
                    return;
                }
            }
        });


        $(function() {
            //在线选座提交
            $('.sche-confirm').on('tap',function(){
                var _this = $(this).parent().find('.sche-sessions');
                var active = _this.find('.session').hasClass('active');
                if(active) {
                    var active = _this.find('.active');
                    var schedularid = active.attr('schedularId');
                    //var sellStatus = "1";
                    var sellStatus = "1";;
                    if(parseInt(sellStatus) == 3 || parseInt(sellStatus) == 4){
                        //立即预订
                        var isfamilycard = active.attr('isfamilysell');
                        var cooperation = active.attr('cooperation');
                        var showtime = active.attr('showtime');
                        var shelftime = active.attr('shelftime');

                        var returnUrl = "?scid="+schedularid+'&isfamilycard='+isfamilycard+'&cooperation='+cooperation+'&showtime='+showtime+'&shelftime='+shelftime;
                        window.location.href="http://m.juooo.com/Item/orderRegister"+returnUrl;
                        return true;
                    }

                    if((typeof(active.attr('isFamilyCard')) !=='undefined' && parseInt(active.attr('isFamilyCard')) == 1)) {//年卡选座
                        var isFamilyCard = active.attr('isFamilyCard');
                        var cooperation = active.attr('cooperation');
                        var showTime = active.attr('showTime');
                        var shelfTime = active.attr('shelfTime');
                        var cate1Id = active.attr('cate1Id');
                        var cate2Id = active.attr('cate2Id');
                        var showId = active.attr('showId');
                        var venueId = active.attr('venueId');
                        var seatticketUrl = active.attr('seatticketurl');
                        var selectpriceUrl = active.attr('selectpriceurl');

                        var ticket_url = "http://p.juooo.com:8080/page/ticket/online/SelPlay.jsp?prjID=1352&ssnid=2885";
                        $.post('http://m.juooo.com/Item/isBingdingYearCard',{scid:schedularid,isFamilyCard:isFamilyCard,cooperation:cooperation,showTime:showTime,shelfTime:shelfTime,cate1Id:cate1Id,cate2Id:cate2Id,
                            sid:showId,venueId:venueId},function(res){
                            var cardId = "0";
                            var scid = schedularid;
                            if(res.yearCardIsOnlineseat == 'yes'){//支持在线选座
                                if(parseInt(res.yearCardNum) > 1 && parseInt(cardId) == 0){
                                    if(seatticketUrl == undefined){//防止404报错
                                        seatticketUrl = "http%3A%2F%2Fm.juooo.com%2Fseatticket%2Farea%2F77391%3FisFamilyCard%3D1";
                                    }
                                    window.location.href='http://m.juooo.com/Card/index?return_url='+seatticketUrl+'&scid='+scid;
                                }else{
                                    var val = '/'+schedularid+'?isFamilyCard='+active.attr('isFamilyCard');
                                    window.location.href= 'http://m.juooo.com/seatticket/area'+val;
                                }
                            }else{//不支持在线选座
                                if(parseInt(res.yearCardNum) > 1 && parseInt(cardId) == 0){
                                    if(selectpriceUrl == undefined){//防止404报错
                                        selectpriceUrl = "http%3A%2F%2Fm.juooo.com%2FItem%2FselectPrice%3Fscid%3D77391%26isFamilyCard%3D1";
                                    }

                                    window.location.href='http://m.juooo.com/Card/index?return_url='+selectpriceUrl+'&scid='+scid;
                                }else{
                                    var isFamilyCard = "1";
                                    window.location.href="http://m.juooo.com/Item/selectPrice?scid=77391&isFamilyCard="+isFamilyCard;
                                }
                            }
                        },'json');
                    }else{
                        //在线选座 or 立即购票
                        var url = active.attr('url');
                        window.location.href= url;
                    }
                }
            });

            //在线选座，点击，取消
            $(document).on('tap', '.sche-block .sche-sessions .session:not(.sell-out)', function() {
                $('.sche-sessions .session').removeClass('active');
                $(this).addClass('active');
            });

            $(function() {
                //获取相关演出
                $.ajax({
                    type:'POST',
                    url:'http://m.juooo.com/Item/getRecommendSchedule',
                    data:{'type':'A5','cityId':"10019",'categoryId':"38",'num':4,'venueId':"1949"},
                    dataType:'json',
                    success:function(result) {

                        if(result.msg == 'ok') {
                            var html = '';
                            $.each(result.data,function(key, val){
                                html+= '<li class="list-item border-bottom">';
                                html+= '<div class="media-panel media-style-1">';
                                html+= '<div class="media-wrap">';
                                html+= '<div class="img-wrap">';
                                html+= '<a class="link" href="http://m.juooo.com/ticket/'+val.id+'">';
                                html+= '<img class="img-media" src="'+'http://image.juooo.com'+val.pic+'" alt="">';
                                html+= '</a>';
                                html+= '</div></div>';
                                html+= '<div class="media-content">';
                                html+= '<div class="media-title">';
                                html+= '<a class="link" href="http://m.juooo.com/ticket/'+val.id+'">'+val.schedular_name.replace(/\\/g,'')+'</a>';
                                html+= '</div>';
                                html+= '<div class="media-info">';
                                html+= ' <p>时间：'+val.show_time+'</p><p class="text-single">场馆：'+val.venue_name+'</p>';
                                html+= '</div>';
                                html+= ' <div class="media-tag"> <span>'+val.price+'</span> </div> </div></div>';
                                html+= '</li>';
                            });
                            $('.list-block').append(html);
                            setTimeout(function() {
                                myScroll.refresh();
                            }, 10);
                        }
                    }
                });
            })
            
            //场馆定位
            $('.icon-map-marker').on('tap',function(){
                var _this = $(this);
                window.location.href="http://m.juooo.com/Venue/venueAddress?venueId="+"1949";
            });
			
            //领取
            $(document).on('tap', '.js-c-btn', function() {
            	if( $(this).hasClass('js-coupon-more') )
            	{
	            	var _this = $(this); 
	            	var cid   = _this.attr('data-cid');
	            	$.post(promotionUrl,{cid:cid},function(res){
	            		
	                	if(res.code == 'ok')
	                	{
	                		_this.html('已领');
	                		_this.removeClass('js-coupon-more');
	                	}
	                	else if(res.code == 'false')
	                	{
	                        window.location.href= loginUrl;
	                	}
	                	else
	                	{
	                		Dialog.msg({
	                            content: res.msg,
	                            seconds: 2
	                        })
	                	}
	                },'json');
            	}
            	else
            	{
            		Dialog.msg({
                        content: '您已领取过优惠券或已被领完',
                        seconds: 2
                    })
            	}
            	
            })
            
            
        });
        
        function getDiscountInfo()
        {
        	//促销折扣
            $.post('http://m.juooo.com/Item/getPromotions',{scid:"77391",cate1Id:"38",
                showTime:"1498876200",isScheOffShelf:isScheOffShelf},function(res){
                if(res.code == 'ok')
                {
                    var html = '';
                    var couponHtml ='';
                    var discountHtml ='';
                    var couponMoreHtml ='';
                    var discountMoreHtml ='';
                    if(res.data.coupon)
                    {
                    	couponHtml   = getCouponHtml(res.data.coupon);
                    	couponMoreHtml = getMoreCouponHtml(res.data.coupon);
                    }
                    
                    if(res.data.discount)
                    {
                    	discountHtml = getDiscountHtml(res.data.discount);
                        discountMoreHtml = getMoreDiscountHtml(res.data.discount);
                    }
                    
                  	//领券
                    $('.discount').html(couponHtml);
                    //更多领券信息
                    $('.coupon-layout .more-coupon').after(couponMoreHtml);
                    
                    //促销信息
                    if(couponHtml)
                    {
                    	$('.discount .row').after(discountHtml);
                    }
                    else
                    {
                    	$('.discount').html(discountHtml);
                    }
                    
                    //更多促销信息
                    $('.promotion-layout .more-promotion').after(discountMoreHtml);
                    var promotions = new Swiper('.promotions', {
                    	freemode: true,
                    	direction: 'vertical',
                    	slidesPerView : 'auto',
                    	scrollbar:'.swiper-scrollbar',
                        scrollbarHide: false,
                    });
                    
                    var coupons = new Swiper('.coupons', {
                    	freemode: true,
                    	direction: 'vertical',
                    	slidesPerView : 'auto',
                    	scrollbar:'.swiper-scrollbar',
                        scrollbarHide: false,
                    });
                    reviseCouponCss();
                    //领券class
                    $('.coupon-layout a').attr('class','c-btn js-c-btn js-coupon-more');
                    setTimeout(function() {
                        myScroll.refresh();
                    }, 10);
                }
            },'json');
        }
        
        //领券html
        function getCouponHtml(list)
        {
        	
        	if(list && list.length > 0)
        	{
        		var html = '';
        		html+='<div class="row js-coupon">';
        		html+='<div class="left">领券：';        	
        		$.each(list,function(key, val){
        			if(key <= 1)
        			{
        				html+='<span class="coupon-item">'+val.actdesclist[0];
                    	html+='<i class="border-left"></i>';
                        html+='<i class="border-right"></i>';
                        html+='</span>';
        			}
                });
                html+='</div>';
            	html+='<div class="right">';
            	html+='<span class="num"></span>';
            	html+='<i class="icon icon-menu-right"></i>';
            	html+='</div>';
            	html+='</div>';   
        	}
        	return html;
        }
        
      	//更多领券html
        function getMoreCouponHtml(list)
      	{
        	if(list &&  list.length > 0)
        	{
        		var html = '';
        		html+='<div class="coupons">';
        		html+='<div class="swiper-wrapper">';
        		html+='<div class="tip swiper-slide">点击领取以下优惠券：</div>';
        		$.each(list,function(key, val){
        			html+='<div class="item swiper-slide">';
        			html+='<div class="left">';
        			html+='<span class="c-title">'+val.actdesclist[1]+'</span>';
        			html+='<span class="c-limit">'+val.actdesclist[0]+'</span>';
        			html+='<span class="deadline">有效期： '+dateFormat.dateFormat('Y.m.d',val.begin_valid_time)+'-'+dateFormat.dateFormat('Y.m.d',val.end_valid_time)+'</span>';
        			html+='</div>';
        			html+='<div class="right">';
        			html+='<span class="value">￥'+ (val.coupon_price)+'</span>';
        			html+=val.actdesclist[2];
        			html+='</div>';
        			html+='</div>';
        		});
        		html+='</div>';
        		html+='<div class="swiper-scrollbar"></div>';
        		html+='</div>';
        	}
        	return html;
      	}
      	
      	//折扣促销html
        function getDiscountHtml(list)
        {
        	if(list.length > 0)
        	{
        		var listOne = list[0];
        		var html = '';
        		html+='<div class="row js-promotion">';
        		html+='<div class="left">促销：';    
        		html+='<span class="sup">';  
        		html+='<span class="sup-item">'+listOne.activityTitle+'</span>';  
        		html+='</span>';
        		html+='<span class="promotion">';
        		html+='<div class="txt">'+listOne.activityDesc;
                html+='</div>';
                html+='<span class="tip">促销方式可在结算时任选其一</span></span>';
                html+='</div>';
                html+='<div class="right">';
                html+='<span class="num"></span>';
                html+='<i class="icon icon-menu-right"></i>';
                html+='</div>'; 
        	}
        	return html;
        }
      	
      	//更多折扣促销html
        function getMoreDiscountHtml(list)
        {
        	if(list.length > 0)
        	{
        		
        		var html = '';
        		html+='<div class="promotions">';
        		html+='<div class="swiper-wrapper">';
        		html+='<div class="tip swiper-slide">以下促销方式可在结算时任选其一</div>';
        		
        		$.each(list,function(key, val){
        			html+='<div class="row swiper-slide">';
            		html+='<span class="type">'+val.activityTitle+'</span>';
            		html+='<span class="txt">'+val.activityDesc+'</span>';
            		html+='<i class="icon"></i>';
            		html+='</div>';
                });
        		html+='</div>';
        		html+='<div class="swiper-scrollbar"></div>';
        		html+='</div>';
        		
        	}
        	return html;
        }
      	
      	function reviseCouponCss()
      	{
      		//优惠券样式显示
            $('.coupon-layout .item').each(function() {
	            var otxt = $(this).find('.right').find('.value'),
	                atxt = otxt.text(otxt.text().replace(/[ ]/g, "")),
	                otext = atxt.text(atxt.text().replace(/[\r\n]/g, ""));
	            if (otext.text().length > 5) {
	                $(this).find('.right .value').addClass('small-txt');
	            }
	        })
      	}
      	
      //购票跳跃结算页
      function buyJumpTickets()
      {
          var jumpTickets = "";
   		   $.ajax({
               type:'POST',
               url:'http://m.juooo.com/Item/buyTickets',
               data:{type:1, tickets:jumpTickets, isFamilyCard:0, scid:sid},
               dataType:'json',
               success:function(result) {
               	if(result.code == 'ok'){
               		window.location.href = result.data;
               	} else {
               		Dialog.msg({
                           content: '未知错误'
                       })
               	}
               }
           });
       }
      
      //检查是否允许跳跃结算页
      function checkJumpScid()
      {
    	  var isLimit = "";
    	  
    	  $.ajax({
              type:'POST',
              url:'http://m.juooo.com/Item/checkBingDingFamilyCardTotal',
              data:{scid:sid},
              dataType:'json',
              success:function(result) {
              	if(result.code != '200' && isLimit == true){
              		Dialog.msg({
                        content: '每个账号限购一次'
                    })
              	} else {
              		buyJumpTickets();
              	}
              }
          });
      }
      	
    });


	var otxt='';
	$(document).on('click','.js-minus',function(){
		otxt = $('.js-txt').val();
		otxt--;
		if(otxt > 0){
			$('.js-txt').val(otxt)
			$('.js-add .icon-plus').css('color','#808080');
		}
		if(otxt == 1){
			$('.js-minus .icon-minus').css('color','#e6e6e6');
		}
	});
	$(document).on('click','.js-add',function(){
		otxt = $('.js-txt').val();
		otxt++;
		if(otxt <= 6){
			$('.js-txt').val(otxt);
			$('.js-minus .icon-minus').css('color','#808080');
		}
		if(otxt == 6){
			$('.js-add .icon-plus').css('color','#e6e6e6');
		}
	})
		









seajs.use(['common/juo', 'jquery', 'countDown', 'swipe', 'tabsCommon', 'tabsSlide','slideScroll','index'], function(ex, $) {
    function countTime(time) {
        var time,
            time1,
            time2,
            time1 = time;
        time1 = time1.split(':');
        time1 = 3600 * parseInt(time1[0]) + 60 * parseInt(time1[1]);
        time2 = new Date();
        time2 = 3600 * time2.getHours() + 60 * time2.getMinutes() + time2.getSeconds();
        if (time1 > time2) {
            time = time1 - time2;
            $('#words').html('距离开始还有');
        } else {
            $('#words').html('距离结束还有');
            time = 24 * 3600 - time2;
        }
        return time * 1000;
    }

    $(function() {
        var $kill_time = $('#kill-time'),
        	time = '10:00';
        stopCount($kill_time);
        $kill_time.attr('time', countTime(time)).countdown(function(){
            getSeckillList('seckillA', '2,3');
            stopCount($kill_time);
            $kill_time.attr('time', countTime(time)).countdown();
        });

        function stopCount(obj) {
            clearInterval(obj[0].timer);
            obj[0].timer = null;
            obj[0].num = undefined;
        }
    });

    var itemUrl   = "http://item.juooo.com/";
    var imgUrl    = "http://image.juooo.com";
    var aroundUrl = "http://around.juooo.com/";
    var returnUrl = "http://passport.juooo.com/?return_url=http%3A%2F%2Factivity.juooo.com%2F";
	var userId	  = 0;

    $(function() {

    	$(document).on('click','#js-tying-buy',function(){
    		if(userId == 0){
    			window.location.href=returnUrl;
    		} else {
    			var obj = $(this);
        		var tyingId = obj.attr('data-tying-id');
        		$.ajax({
                    type: 'POST',
                    url: "getbuytying",
                    data: {tid: tyingId},
                    dataType: 'json',
                    beforeSend: function(result) {
                        //发送请求前
                    },
                    success: function(result) {
                    	//请求成功
                    	if(result.code == 1){
                    		if(typeof(result.data) != undefined && result.data != null) {
                    			window.location.href=result.data;
                    		}
                    	}
                    },
                    error: function(result) {
                        //请求错误
                    },
                    complete: function(result) {
                        //请求完成

                    }
                });
    		}
    	})
    	
        getSeckillList('seckillA', '2,3');
        getBankList();
        getSpecialList();
    });

    //获取秒杀列表
    function getSeckillList(obj, type) {
        $.ajax({
            type: 'POST',
            url: "getSeckillList",
            data: {
                type  : type,
            },
            dataType: 'json',
            beforeSend: function(result) {
                //发送请求前
            },
            success: function(result) {
                //请求成功后
                var seckList = '';
                var nowTime, startTime, endTime;
                var buttonClass, buttonText;
				var dateObj = new Date();
				var seckLength;
				
                nowTime = new Date().getTime();
                if (result.code == 1) {
                    if (result.data.list != null && typeof(result.data) == "object") {
                    	seckLength = result.data.list.length;
                    	if(seckLength < 5){
                    		$("#sidebarA").find('.arrow-left').hide();
                    		$("#sidebarA").find('.arrow-right').hide();
                    	}
                        $.each(result.data.list, function(key, item) {
                            if (typeof(item.schedular_name) != "undefined") {
                            	startTime = item['activity_seckill_start_time'] * 1000;
                                endTime   = item['activity_seckill_end_time'] * 1000;
                                showTime  = item['show_time'] * 1000;
                                // if(type == 2){	
                                	dateObj.setHours(10);
                                // } else {	    
                                	// dateObj.setHours(16);
                                // }
                                dateObj.setMinutes(0);
                            	dateObj.setSeconds(0);
                            	dateObj.setMilliseconds(0);
                            	

                                if (nowTime < startTime) {
                                    buttonText  = '即将开始';
                                    buttonClass = 'tab-item sksb-buy start';
                                } else if(nowTime > showTime || nowTime > endTime){
                                	buttonText  = '已结束';
                                	buttonClass = 'tab-item sksb-buy disable';
                                } else if (item.ticketStock < 1 || item.listStock < 1) {
                                    buttonText = '卖光了';
                                    buttonClass = 'tab-item sksb-buy disable';
                                } else if (key < 4) {
                                    buttonText = '立即抢票';
                                    buttonClass = 'tab-item sksb-buy';
                                } else {
                                    buttonText = '立即抢票';
                                    buttonClass = 'tab-item sksb-buy';
                                }

                                //范围内则显示
                                if (key < 5) {
                                    buttonClass += ' active';
                                }

                                seckList += '<li class="' + buttonClass + '">';
                                seckList += '<a href="' + itemUrl + item.schedular_id + '" target="_blank">';
                                seckList += '<span>';
                                seckList += '<img delayLoad="' + imgUrl + item.pic + '" alt="' +item.schedular_name.replace(/\\/g,"") + '"  title="' +item.schedular_name.replace(/\\/g,"") + '">';
                                seckList += '</span>';
                                seckList += '<p>[' + item.city_name + ']【' + item.schedular_name.replace(/\\/g,"") + '】</p>';
                                seckList += '</a>';
                                seckList += '<div class="discount f-bold">秒杀价<span class="sale">￥<em class="num">' + item.seckill_ticket_price + '</em></span></div>';
                                seckList += '<div class="bd">';
                                seckList += '<del>￥' + item.ticket_price + '</del>';
                                seckList += '<span class="discount-txt">' + item.discount + '折</span></div>';
                                seckList += '<a href="' + itemUrl + item.schedular_id + '" class="sks-btn" target="_blank">' + buttonText + '</a>';
                                seckList += '</li>';
                            }
                        });
                        
                        $("#" + obj).find("ul").html(seckList);
                        $('img').scrollLoading();
                    } else {
                    	$("#sidebarA").hide().prev('.block-title-wrap').hide();
                    }
                }
            },
            error: function(result) {
                //请求错误
            },
            complete: function(result) {
                //请求完成

            }
        });
    }

    //获取天天特价
    function getSpecialList() {
        $.ajax({
            type: 'POST',
            url: "getSpecialList",
            data: {
                type: 1
            },
            dataType: 'json',
            beforeSend: function(result) {
                //发送请求前
            },
            success: function(result) {
                //请求成功后
                var specList = '';
                var nowTime, endTime, diffTime;
                var buttonClass;

                nowTime = new Date().getTime();
                if (result.code == 1) {
                    if (result.data.list != null && typeof(result.data) == "object") {
                        $.each(result.data.list, function(key, item) {
//                        	var tips = '';
//                        	var child = '';
//                        	if(item.method == '1' || item.method == '4')
//                        	{
//                        		tips = '<i class="logo_i"></i>';
//                        	}
//                        	if(item.method == '1' && item.cate_parent_id == '38')
//                        	{
//                        		child = '<i class="logo_i ju_icon"></i>';
//                        	}
                            specList += '<li class="">';
                            specList += '<a href="' + itemUrl + item.schedular_id + '" title="' + item.schedular_name + '" target="_blank">';
                            specList += '<span>';
                            //specList +=  tips + child;
                            specList += item.ico;
                            specList += '<img alt="' + item.schedular_name.replace(/\\/g,"")+ '" title="' + htmlspecialchars_decode(item.schedular_name) + '"  delayLoad="' + imgUrl + item.pic + '">';
                            specList += '</span>';
                            specList += '<p>[' + item.city_name + ']' +item.schedular_name.replace(/\\/g,"")+ '</p>';
                            specList += '</a>';
                            specList += '<div class="special-sale"><span class="sale"><em class="num">' + item.discount + '</em>折</span></div>';
                            specList += '</li>';
                        });
                        $(".special-pro").prepend(specList);
                        $('img').scrollLoading();
                        
                    } else {
                    	$(".special").hide().prev('.block-title-wrap').hide();
                    }
                }
            },
            error: function(result) {
                //请求错误
            },
            complete: function(result) {
                //请求完成

            }
        });
    }


    //获取银行优惠活动
    function getBankList() {
        $.ajax({
            type: 'POST',
            url: "getBankList",
            data: {
                type: 1
            },
            dataType: 'json',
            beforeSend: function(result) {
                //发送请求前
            },
            success: function(result) {
                //请求成功后
                var bankList = '';
                var nowTime, endTime, diffTime;
                var buttonClass;

                nowTime = new Date().getTime();
                if (result.code == 1) {
                    if (result.data.list != null && typeof(result.data) == "object") {
                    	if (result.data.list.length < 4) {
                            $("#bank-discount").find("div").remove();
                        }
                    	
                        $.each(result.data.list, function(key, item) {
                            if (key < 3) {
                                buttonClass = 'item tab-item active';
                            } else {
                                buttonClass = 'item tab-item';
                            }
                            endTime = item['end_time'] * 1000;
                            diffTime = endTime - nowTime;
                            diffTime = (diffTime < 1) ? '0' : diffTime;

                            bankList += '<li class="' + buttonClass + '">';
                            bankList += '<div class="img-wrap">';
                            bankList += '<a href="' + item.url + '" target="_blank">';
                            bankList += '<span class="img"><img class="" delayLoad="' + imgUrl + item.pic + '" align=""></span>';
                            bankList += '</a>';
                            bankList += '<div class="img-title">剩余时间：';
                            bankList += '<span class="timer js-countdown" time="' + diffTime + '">';
                            bankList += '<span class="time js-d">00</span><span class="txt">天</span>';
                            bankList += '<span class="time js-h">00</span><span class="txt">时</span>';
                            bankList += '<span class="time js-m">00</span><span class="txt">分</span>';
                            bankList += '<span class="time js-s">00</span><span class="txt">秒</span>';
                            bankList += '</span></div></div></li>';
                        });

                        $(".goods-list").prepend(bankList);
                        $('img').scrollLoading();
                        
                        $('.js-countdown').countdown();
                    } else {
                    	$(".bank-discount").hide().prev('.block-title-wrap').hide();
                    }
                }
            },
            error: function(result) {
                //请求错误
            },
            complete: function(result) {
                //请求完成

            }
        });
    }

    function htmlspecialchars_decode(str)
    {           
        str = str.replace(/&amp;/g, '&'); 
        str = str.replace(/&lt;/g, '<');
        str = str.replace(/&gt;/g, '>');
        str = str.replace(/&quot;/g, "''");  
        str = str.replace(/&#039;/g, "'");  
        return str;  
    }

});

