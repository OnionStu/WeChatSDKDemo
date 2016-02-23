var rid = 0,listData = [];
var $tmp =  _.template(document.getElementById('dialog-template').innerHTML);
var addListItem = function(obj){
  listData.push(obj)
  var htmlStr = $tmp(obj);
  $('.record').append(htmlStr)
  console.log(listData)
};
var removeListItem = function(id){
  listData = _.without(listData,_.find(listData,function(item){return item.id == id}))
  console.log(listData)
};
$(document).ready(function(){
  var $record = $('.record');
  // var tmpFunc = _.template($tmp);
  var editStatus = false;
  var currentField = 'text';
  var editID;
  var list = [{
    type: 'text',
    content: '哈哈'
  },{
    type: 'voice',
    content: '哈哈'
  }];

  $('.bar-tab').on('click','.tab-item',function(e){
    if(this.classList.contains('active'))return;
    // console.log(this.dataset.type)
    $('.tab-item.active').removeClass('active')
    this.classList.add('active')
    currentField = this.dataset.type;
    changeField(currentField);
  })
  $('#submitBtn').click(function(){
    var str = $('#submitText').val()
    // var itemTemp = 
    //   '<div class="record-row clearfix">' +
    //     '<i class="weui_icon_circle select"></i>' +
    //     '<div class="dialog text">' + 
    //       str + 
    //     '</div>' +
    //     '<i class="weui_icon_cancel close"></i>' +
    //   '</div>'
    if(str){
      var obj = {
        id: rid++,
        type: 'text',
        content: str
      }
      addListItem(obj)
      $('#submitText')[0].value = "";
    }
  })

  $record.on('click','.close',function(){
    $(this.parentNode).remove()
    removeListItem(this.dataset.id)
  })

  $record.on('touchstart', '.dialog', function(e) {
    var startTimeStamp = e.timeStamp;
    $(e.currentTarget).on('touchend', function(e) {
      var endTimeStamp = e.timeStamp;
      console.log(startTimeStamp, endTimeStamp);
      if (endTimeStamp - startTimeStamp >= 1000) {
        $record.addClass('edit');
        $('.select').removeClass('weui_icon_success');
        changeField('edit');
      } else {
        console.log('fail');
      }
      $(e.currentTarget).off('touchend');
    })
    $(e.currentTarget).on('touchmove', function(e) {
      console.log(e)
    })
  })

  $record.on('click', '.select', function(e) {
    $('.select').removeClass('weui_icon_success').addClass('weui_icon_circle');
    $(e.target).removeClass('weui_icon_circle').addClass('weui_icon_success');
  })

  $('.foot-content').on('click', '.exit', function(e) {
    $record.removeClass('edit');
    changeField(currentField);
  })

  var changeField = function(type) {
    $(".foot-content.active").removeClass('active');
    $(".foot-content[data-type=" + type + "]").addClass('active');
  }
})

wx.ready(function () {
  // var $tmp =  _.template(document.getElementById('dialog-template').innerHTML);
  // 3 智能接口
  var voice = {
    localId: '',
    serverId: ''
  };

  // // 4 音频接口
  // // 4.2 开始录音
  // document.querySelector('#startRecord').onclick = function () {
  //   wx.startRecord({
  //     cancel: function () {
  //       alert('用户拒绝授权录音');
  //     }
  //   });
  // };


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
          var obj={
            id: rid++,
            type: 'voice',
            content:voice.localId
          }
          addListItem(obj)
        },
        fail: function (res) {
          alert(JSON.stringify(res));
        }
      });
    }
  };


  // // 4.3 停止录音
  // document.querySelector('#stopRecord').onclick = function () {
  //   wx.stopRecord({
  //     success: function (res) {
  //       voice.localId = res.localId;
  //     },
  //     fail: function (res) {
  //       alert(JSON.stringify(res));
  //     }
  //   });
  // };

  // 4.4 监听录音自动停止
  wx.onVoiceRecordEnd({
    complete: function (res) {
      voice.localId = res.localId;
      alert('录音时间已超过一分钟');
      var obj={
        id: rid++,
        type: 'voice',
        content:voice.localId
      }
      addListItem(obj)
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

  // 4.8 监听录音播放停止
  wx.onVoicePlayEnd({
    complete: function (res) {
      // alert('录音（' + res.localId + '）播放结束');
    }
  });

  // // 4.8 上传语音
  // document.querySelector('#uploadVoice').onclick = function () {
  //   if (voice.localId == '') {
  //     alert('请先使用 startRecord 接口录制一段声音');
  //     return;
  //   }
  //   wx.uploadVoice({
  //     localId: voice.localId,
  //     success: function (res) {
  //       alert('上传语音成功，serverId 为' + res.serverId);
  //       voice.serverId = res.serverId;
  //     }
  //   });
  // };

  // // 4.9 下载语音
  // document.querySelector('#downloadVoice').onclick = function () {
  //   if (voice.serverId == '') {
  //     alert('请先使用 uploadVoice 上传声音');
  //     return;
  //   }
  //   wx.downloadVoice({
  //     serverId: voice.serverId,
  //     success: function (res) {
  //       alert('下载语音成功，localId 为' + res.localId);
  //       voice.localId = res.localId;
  //     }
  //   });
  // };

  // 5 图片接口
  // 5.1 拍照、本地选图
  var images = {
    localId: [],
    serverId: []
  };

  document.querySelector('#chooseImg').onclick = function () {
    wx.chooseImage({
      success: function (res) {
        console.log(res)
        images.localId = res.localIds;
        // alert('已选择 ' + res.localIds.length + ' 张图片');
        // var img = new Image;
        // img.src = images.localId[0]

        for(var i = 0, len = images.localId.length;i<len;i++){
          var imgSrc = images.localId[i]
          var obj={
            id: rid++,
            type: 'img',
            content: imgSrc
          }
          addListItem(obj)
        }
      }
    });
  };

});

wx.error(function (res) {
  alert(res.errMsg);
});

