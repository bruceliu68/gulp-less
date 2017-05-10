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
    var consumeType;
    var consumeValue;
    var storeName;
    //获取问题
    function getInfo(){
        $('#loadingToast').show();
        $.ajax({
            type:'post',
            url:'/mc-wechat/user/info',
            dataType:'json',
            contentType:"application/json; charset=UTF-8",
            data:JSON.stringify({
                "storeId": storeId,
                "custId": custId
            }),
            success:function(msg){
                if(msg.code === 'ACK'){
                    var data = msg.data;
                    consumeType = data.consumeType;
                    storeName = data.storeName;
                    data.storeId = storeId;
                    data.custId = custId;
                    var Templ = document.getElementById('info').innerHTML;
                    var tml = template(Templ,data);
                    $('.g-box').html(tml);
                    getYxInfo();
                }else{
                    alert('请求出错啦');
                }
                $('#loadingToast').hide();
            },
            error:function(msg){
                console.log('请求出错啦');
            }
        });
    }
    getInfo();

    //获取营销信息
    function getYxInfo(){
        $.ajax({
            type:'get',
            url:'/mc-wechat/promotion/info/'+ storeId,
            dataType:'json',
            contentType:"application/json; charset=UTF-8",
            success:function(msg){
                if(msg.code === 'ACK'){
                    if(msg.data){
                        var data = msg.data;
                        var Templ = document.getElementById('yx').innerHTML;
                        var tml = template(Templ,data);
                        $('.yx-box').html(tml);
                    }
                }else{
                    alert('请求出错啦');
                }
            },
            error:function(msg){
                console.log('请求出错啦');
            }
        });
    }

    function confirmPay(){
        $.ajax({
            type:'post',
            url:'/mc-wechat/user/consumption',
            dataType:'json',
            contentType:"application/json; charset=UTF-8",
            data:JSON.stringify({
                "consumeType": consumeType,
                "consumeValue": consumeValue,
                "storeId": storeId,
                "custId": custId
            }),
            success:function(msg){
                if(msg.code === 'ACK'){
                    localStorage.params = '{"consumeValue":"'+consumeValue+'","consumeType":"'+consumeType+'","storeName":"'+storeName+'","storeId":"'+storeId+'","custId":"'+custId+'"}';
                    window.location.href = '../success/success.html?storeId='+storeId+'&custId='+custId;
                }else{
                    alert('支付失败');
                }
            },
            error:function(msg){
                console.log('请求出错啦');
            }
        });
    }

    $('body').on('click','.comfirmpay',function(){
        var _this = $(this);
        consumeValue = _this.parent().find('input[type=text]').val();
        confirmPay();
    });

    $('body').on('focus','.box input[type=text]',function(){
        var _this = $(this);
        _this.addClass('redborder');
    });
    $('body').on('blur','.box input[type=text]',function(){
        var _this = $(this);
        _this.removeClass('redborder');
    });

});
