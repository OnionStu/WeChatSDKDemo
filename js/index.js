$(document).ready(function(){
  $('.bar-tab').on('click','.tab-item',function(e){
    if(this.classList.contains('active'))return;
    // console.log(this.dataset.type)
    $('.tab-item.active').removeClass('active')
    this.classList.add('active')
    $(".foot-content.active").removeClass('active');
    $(".foot-content[data-type="+this.dataset.type+"]").addClass('active');
  })
  $('#submitBtn').click(function(){
    var str = $('#submitText').val()
    if(str){
      $('.record').append('<div class="record-row clearfix"><div class="dialog text">'+str+'</div><span class="close">X</span></div>')
      $('#submitText')[0].value = "";
    }
  })
  // $('.close').click(function(){
  $('.record').on('click','.close',function(){
    $(this.parentNode).remove()
  })
})



wx.ready(function () {
  // 1 判断当前版本是否支持指定 JS 接口，支持批量判断
  document.querySelector('#checkJsApi').onclick = function () {
    wx.checkJsApi({
      jsApiList: [
        'getNetworkType',
        'previewImage'
      ],
      success: function (res) {
        alert(JSON.stringify(res));
      }
    });
  };
  // 3 智能接口
  var voice = {
    localId: '',
    serverId: ''
  };

  // 4 音频接口
  // 4.2 开始录音
  document.querySelector('#startRecord').onclick = function () {
    wx.startRecord({
      cancel: function () {
        alert('用户拒绝授权录音');
      }
    });
  };


  document.querySelector('#transcription').onclick = function () {
    console.log(this)
    var el = this;
    var status = el.dataset.status
    if("start"===status){
      wx.startRecord({
        cancel: function () {
          alert('用户拒绝授权录音');
          el.dataset.status = "start";
          el.innerHTML = "开始录音";
        }
      });
      el.dataset.status = "stop";
      el.innerHTML = "停止录音";
    }else if("stop"===status){
      wx.stopRecord({
        success: function (res) {
          voice.localId = res.localId;
          el.dataset.status = "start";
          el.innerHTML = "开始录音";
          $('.record').append('<div class="record-row clearfix"><div class="dialog voice" data-vid="'+voice.localId+'"></div><span class="close">X</span></div>')
        },
        fail: function (res) {
          alert(JSON.stringify(res));
        }
      });
    }
  };


  // 4.3 停止录音
  document.querySelector('#stopRecord').onclick = function () {
    wx.stopRecord({
      success: function (res) {
        voice.localId = res.localId;
      },
      fail: function (res) {
        alert(JSON.stringify(res));
      }
    });
  };

  // 4.4 监听录音自动停止
  wx.onVoiceRecordEnd({
    complete: function (res) {
      voice.localId = res.localId;
      alert('录音时间已超过一分钟');
      $('.record').append('<div class="record-row clearfix"><div class="dialog voice" data-vid="'+voice.localId+'"></div><span class="close">X</span></div>')
    }
  });

  $('.record').on('click','.dialog.voice',function(){
    voiceID = this.dataset.vid;
    if(voiceID){
      wx.playVoice({
        localId: voiceID
      });
    }
  })
  // 4.5 播放音频
  document.querySelector('#playVoice').onclick = function () {
    if (voice.localId == '') {
      alert('请先使用 startRecord 接口录制一段声音');
      return;
    }
    wx.playVoice({
      localId: voice.localId
    });
  };

  // 4.6 暂停播放音频
  document.querySelector('#pauseVoice').onclick = function () {
    wx.pauseVoice({
      localId: voice.localId
    });
  };

  // 4.7 停止播放音频
  document.querySelector('#stopVoice').onclick = function () {
    wx.stopVoice({
      localId: voice.localId
    });
  };

  // 4.8 监听录音播放停止
  wx.onVoicePlayEnd({
    complete: function (res) {
      alert('录音（' + res.localId + '）播放结束');
    }
  });

  // 4.8 上传语音
  document.querySelector('#uploadVoice').onclick = function () {
    if (voice.localId == '') {
      alert('请先使用 startRecord 接口录制一段声音');
      return;
    }
    wx.uploadVoice({
      localId: voice.localId,
      success: function (res) {
        alert('上传语音成功，serverId 为' + res.serverId);
        voice.serverId = res.serverId;
      }
    });
  };

  // 4.9 下载语音
  document.querySelector('#downloadVoice').onclick = function () {
    if (voice.serverId == '') {
      alert('请先使用 uploadVoice 上传声音');
      return;
    }
    wx.downloadVoice({
      serverId: voice.serverId,
      success: function (res) {
        alert('下载语音成功，localId 为' + res.localId);
        voice.localId = res.localId;
      }
    });
  };

  // 5 图片接口
  // 5.1 拍照、本地选图
  var images = {
    localId: [],
    serverId: []
  };
  document.querySelector('#chooseImage').onclick = function () {
    wx.chooseImage({
      success: function (res) {
        images.localId = res.localIds;
        alert('已选择 ' + res.localIds.length + ' 张图片');
      }
    });
  };

  document.querySelector('#chooseImg').onclick = function () {
    wx.chooseImage({
      success: function (res) {
        console.log(res)
        images.localId = res.localIds;
        alert('已选择 ' + res.localIds.length + ' 张图片');
        // var img = new Image;
        // img.src = images.localId[0]

        for(var i = 0, len = images.localId.length;i<len;i++){
          var imgSrc = images.localId[i]
          htmlStr = '<div class="record-row clearfix"><div class="dialog img"><img src="'+imgSrc+'"></div><span class="close">X</span></div>'
          $('.record').append(htmlStr)
        }
      }
    });
  };



  // 5.2 图片预览
  document.querySelector('#previewImage').onclick = function () {
    wx.previewImage({
      current: 'http://img5.douban.com/view/photo/photo/public/p1353993776.jpg',
      urls: [
        'http://img3.douban.com/view/photo/photo/public/p2152117150.jpg',
        'http://img5.douban.com/view/photo/photo/public/p1353993776.jpg',
        'http://img3.douban.com/view/photo/photo/public/p2152134700.jpg'
      ]
    });
  };

  // 5.3 上传图片
  document.querySelector('#uploadImage').onclick = function () {
    if (images.localId.length == 0) {
      alert('请先使用 chooseImage 接口选择图片');
      return;
    }
    var i = 0, length = images.localId.length;
    images.serverId = [];
    function upload() {
      wx.uploadImage({
        localId: images.localId[i],
        success: function (res) {
          i++;
          //alert('已上传：' + i + '/' + length);
          images.serverId.push(res.serverId);
          if (i < length) {
            upload();
          }
        },
        fail: function (res) {
          alert(JSON.stringify(res));
        }
      });
    }
    upload();
  };

  // 5.4 下载图片
  document.querySelector('#downloadImage').onclick = function () {
    if (images.serverId.length === 0) {
      alert('请先使用 uploadImage 上传图片');
      return;
    }
    var i = 0, length = images.serverId.length;
    images.localId = [];
    function download() {
      wx.downloadImage({
        serverId: images.serverId[i],
        success: function (res) {
          i++;
          alert('已下载：' + i + '/' + length);
          images.localId.push(res.localId);
          if (i < length) {
            download();
          }
        }
      });
    }
    download();
  };
});

wx.error(function (res) {
  alert(res.errMsg);
});

