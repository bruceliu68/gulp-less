$(function(){
    FastClick.attach(document.body);
    //获取地址栏信息
    function getQueryString(name){
        var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if(r!=null)return  unescape(r[2]); return null;
    }
    var storeId = parseInt(getQueryString('storeId'));
    var custId = parseInt(getQueryString('custId'));
    var page = 1;
    var size = 8;
    var flag3 = true;//标记ajax加载
    var hasNext = true;
    function getList(){
        $('#loadingToast').show();
        $.ajax({
            type:'post',
            url:'/mc-wechat/user/record',
            dataType:'json',
            contentType:"application/json; charset=UTF-8",
            data:JSON.stringify({
                "page": page,
                "size": size,
                "storeId": storeId,
                "custId": custId
            }),
            success:function(msg){
                if(msg.code === 'ACK'){
                    flag3 = true;
                    if(msg.data.length < size){
                        hasNext = false;
                    }
                    if(msg.data){
                        var data = msg;
                        var Templ = document.getElementById('list').innerHTML;
                        var tml = template(Templ,data);
                        $('.list').append(tml);
                    }else if($.trim($('.list').html()) == '' || $.trim($('.list').html()) == null){
                        $('.list').html('<div class="no-data">暂无数据</div>');
                    }
                }else{
                    console.log('没有数据啦');
                }
                $('#loadingToast').hide();
            },
            error:function(msg){
                console.log('请求出错啦');
            }
        });
    }

    //滚动异步加载
    $(window).scroll(function () {
        var sum = $(document).height();
        var sum2 = $(window).scrollTop() + $(window).height() + 20;
        if (hasNext === true && sum <= sum2 && flag3 === true) {//$(window).scrollTop()滚动条滚动的距离
            flag3 = false;
            page++;
            getList();
        }
    });
    getList();

});
