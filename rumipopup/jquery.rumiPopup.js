/*
* 명칭 : rumiPopup (한글명칭:루미팝업)
* 제작일 : 2019년 01월 31일
* 제작자 : 조정영(루미집사)
* 이메일 : cjy7627@naver.com
* 기술지원 : cjy7627@naver.com
* 홈페이지 : https://www.suu.kr
* 라이센트 : FREE
* 자유롭게 수정 및 배포 가능하나 위 정보는 반드시 포함하여야 합니다.
**/

document.addEventListener("DOMContentLoaded", function(){
    rumiPopup.start();
});

var rumiPopup = (function(){
    var arr = {
        width : 800,
        height : 600,
        fadeIn : true,
        fadeinTime : 500,
        url : "#",
        title : "rumiPopup",        
        buttonView : true,
        reloadBtn : true,
        button : function() {},
        open : function() {},
        close : function() {}
    }

    var el = {};
    var currentScroll=0;

    this.init = function() {

        // 레이어팝업창으로 사용할 요소 생성. (레이어 팝업후 부모페이지 클릭 방지하기 위해 div#rumipopup_sub를 화면크기로 생성한다.)
        var divTag = "<div id='rumipopup_sub'></div>"; // 배경클릭 방지용 레이어
            divTag += "<div id='rumipopup' class='rumi_layer  pop_layer' style='display:none;'>"; // 팝업레이어
            divTag += "<div class='rumiTitle'></div>"; // 상단 문서 타이틀
            divTag += "<span class='rumiClose' onclick='rumiPopup.close();'><i class='fa fa-times' aria-hidden='true'></i></span>"; // 창닫기 "X" 버튼
            divTag += "<iframe name='rumiIframe' id='rumiIframe' class='rumiIframe' src='' width='100%'></iframe>"; // 문서 로드되는 iframe
            divTag += "<div class='rumiButton'></div>"; // 하단 사용자 버튼
            divTag += "<span class='rumiReload'><button type='button' class='rumi_btn' onclick='rumiPopup.iframeReload();'><i class='fa fa-refresh' aria-hidden='true'></i> 새로고침</button></span>"; // 새로고침 버튼
            divTag += "</div>"; 
        
        $("body").append(divTag);

        // 셀렉터 - 플러그인에서 사용될 전역변수 (고정값.)
        el.Pop_sub = $("#rumipopup_sub");
        el.Popup   = $("#rumipopup");
        el.Title   = $("#rumipopup > .rumiTitle");
        el.Iframe  = $("#rumiIframe");
        el.iframe  = $(".rumiIframe");        
        el.Button  = $("div.rumiButton");
        el.noFrame = $("#rumipopup .noIframe");
        el.FName   = "rumiIframe";
    }
    
    var popup = function(option) {

        if(option && typeof option == "object") {
            arr = $.extend(arr, option);
        };        

        if(arr.width <= 100) {
            var W = arr.width+"%";
            var margin_left = (parseInt(arr.width/2)*-1)+"%";
        } else {
            var W = arr.width+"px";
            var margin_left = (parseInt(arr.width/2)*-1)+"px";            
        }

        if(arr.height <= 100) {
            var H = arr.height+"%";
            //var window_H = parseInt(window.getComputedStyle(document.body).height);
            var window_H = parseInt(window.innerHeight);
            var margin_top = (parseInt((window_H * (arr.height/100))/2) * -1);           
        } else {
            var H = arr.height+"px";
            var margin_top = (parseInt(arr.height/2)*-1)+"px";
        }
        
        if(g5_is_mobile) {
            margin_left = "0px";
            margin_top = "0px";
            el.Popup.css({"left":"0px", "top":"0px"});
            H = window.innerHeight+"px";
        }
        //console.log(parseInt(window.getComputedStyle(document.body).height));
        //console.log(margin_top);

        el.Popup.css({ "width" : W, "height" : H, "margin-left" : margin_left, "margin-top" : margin_top });
        
        // 외부문서를 불러올경우 항상 Iframe 방식을 사용.
        if(arr.iframe==true || arr.url) {
            el.Iframe.attr("src",arr.url);
        } else {
            el.Iframe.hide();
            el.noIframe.show();
        }        
        el.Title.html("<i class='fa fa-folder-open' aria-hidden='true'></i> "+arr.title); //상단 타이틀
        
        el.Button.empty(); // 버튼 초기화
        el.Pop_sub.show(); // 팝업이후 부모페이지 클릭 방지 레이어.
        popup_kind(arr.fadeIn); // 팝업 모션(fadeIn 또는 즉시.)
        

        if(arr.print==true) {
            print();
        }
        
        if(arr.button && arr.buttonView==true) {
            buttons(arr.button);
        }

        if(arr.open) {
            arr.open();
        }       

        if(arr.reloadBtn==false) {
            document.querySelector('.rumiReload').style.display = 'none';
        } else {
            document.querySelector('.rumiReload').style.display = 'block';
        }

        if(arr.buttonView==false) {
            document.querySelector('.rumiButton').style.display = 'none';
            document.querySelector('.rumiIframe').style.padding = '0px 0px 60px 20px';
        } else {
            document.querySelector('.rumiButton').style.display = 'block';
        }

        if(g5_is_mobile) {
            //$(".rumiIframe").css({"padding":"0px 5px 90px 5px !important"});
            document.querySelector('.rumiIframe').style.padding = '0px 5px 90px 10px';
           // console.log(g5_is_mobile);
        }
    

    }
    
    var popup_kind = function(v) {
        
        // 부모창 스크롤 막기
		$('html, body').css({'overflow': 'hidden'});

        if(v==true) {
            setTimeout(function(){
                el.Popup.fadeIn(arr.fadeinTime);
            },100);
        } else {
            setTimeout(function(){
                el.Popup.show();
            },100);
        };
    };

    var close = function(a,b) {

        arr.close();
        
        $('html').css({'overflow': 'scroll'}); //스크롤 락 해제
        $("#"+el.FName).attr("src",""); // 프레임 src 초기화.
        
        // 프레임 제거
        //var frame = document.getElementById(el.FName), frameDoc = frame.contentDocument || frame.contentWindow.document;
        //frame.parentNode.removeChild(frame);
        
        el.Pop_sub.hide(); 
        el.Popup.hide();
    }

    var iframeReload = function() {
        document.getElementById(el.FName).contentDocument.location.reload(true);
        //popup_msg("페이지를 새로고침하였습니다.");
    }

    var print = function(e) {
        //console.log(arr);
    }

    // 레이어 팝업 하단에 사용자 버튼 생성. 
    var buttons = function(btn) {
        // 버튼 생성.
        $.each(btn, function(index, item){
            el.Button.append("<button type='button' class='rumi_btn'>"+index+"</button>");
            $(".rumiButton button:contains('"+index+"')").click(item);
        });
    }

    return {
        popup : popup,
        close : close,
        iframeReload : iframeReload,
        start : init
    }

}());