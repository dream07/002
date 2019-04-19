//index.js
//获取应用实例
import audioList from './data.js'
import util from '../../utils/util.js'


var app = getApp()

const backgroundAudioManager = wx.getBackgroundAudioManager()


Page({
  data: {
    audioList: audioList,
    searchAudioList: audioList,
    audioIndex: 0,
    audioSize: 20,
    pauseStatus: true,
    audioPalyStatus: 0,
    listShow: false,
    timer: '',
    currentPosition: 0,
    duration: 0,
    hasMore: true,
    loadHidden: true,
    prev: false,
    show: true,
    open: false,
    mark: 0,
    newmark: 0,
    startmark: 0,
    endmark: 0,
    windowWidth: wx.getSystemInfoSync().windowWidth,
    scrollWidth: ((wx.getSystemInfoSync().windowWidth) * 0.2) + '%',
    staus: 1,
    translate: '',
    like: false,
    circulation: true,
    search: false,
    show: true,
    networkType: '',
    confirmePlay: false,
    onloadPlay: false

  },
  change: function(e) {
    this.true(e)
  },
  true: function(e) { //搜索方法key用户输入的查询字段
    this.setData({
      search: true
    })
    console.log(e);
    var key = e.detail
    var that = this;
    var searchAudioList = wx.getStorage({
      key: 'searchAudioList',
      success: function(res) { //从storage中取出存储的数据
        console.log(res)
        if (key == "") { //用户没有输入全部提示
          that.setData({
            searchAudioList: res.data,
          })
          return;
        }
        var arr = []; //临时数组用于存放匹配到的数据
        for (let i in res.data) {
          res.data[i].show = false; //所有数据隐藏
          var found = res.data[i].name
          if (res.data[i].name.indexOf(key) >= 0) { //查找
            // console.log(res.data[i].name)
            console.log('找到了')
            res.data[i].show = true; //匹配到的数据显示
            arr.push(res.data[i])
          }
        }
        if (arr.length == 0) {
          that.setData({
            searchAudioList: [{
              show: true,
              name: '无相关数据'
            }]
          })
        } else {
          that.setData({
            searchAudioList: arr
          })
        }
        console.log(audioList)
      }

    })
  },

  onLoad: function(options) {
    if (backgroundAudioManager.paused == false && this.data.pauseStatus == true) {
      this.setData({
        onloadPlay: true,
        pauseStatus: false
      })
      backgroundAudioManager.seek((backgroundAudioManager.currentTime)+0.7)
      let that = this

      setInterval(function () {
        that.setDuration(that)
      }, 1000)

    }
    // console.log(backgroundAudioManager.paused)

    let that = this
    console.log(Math.floor(Math.random() * 20))

    wx.getNetworkType({
      success(res) {
        that.setData({
          networkType: res.networkType
        })
        console.log(that.data.networkType)
      }
    })
    wx.onNetworkStatusChange(function(res) {
      that.setData({
        networkType: res.networkType
      })
      console.log(that.data.networkType)
    })
    var searchAudioList = this.data.searchAudioList
    wx.setStorage({
      key: 'searchAudioList',
      data: searchAudioList,
    })

    // console.log(options.name)
    backgroundAudioManager.onPause(() => {
      this.setData({
        pauseStatus: true
      })
    })

    


    




    // console.log('onLoad params:' + options.name)
    //  获取本地存储存储audioIndex
    var audioIndexStorage = wx.getStorageSync('audioIndex')
    var audioIndexNow = (audioIndexStorage && audioIndexStorage < that.data.audioList.length) ? audioIndexStorage : 0
    this.setData({
      audioIndex: audioIndexNow
    })
    wx.setStorageSync('audioIndex', audioIndexNow)
    console.log('默认的audioIndex:' + this.data.audioIndex)
    if (options.name !== undefined) {
      //检测本地是否存在歌曲
      var exists = false
      for (var i = 0; i < this.data.audioList.length; i++) {
        if (that.data.audioList[i].name === options.name) {
          console.log('exists share music')
          audioIndexNow = i
          that.setData({
            audioIndex: audioIndexNow
          })
          wx.setStorageSync('audioIndex', audioIndexNow)
          exists = true
          break;
        }
      }
      if (!exists) { //不存在则加入分享歌曲
        var shareData = [{
          name: options.name,
          poster: options.poster,
          src: options.src,
          author: options.author
        }]
        let updata = that.data.audioList.concat(shareData);
        audioIndexNow = that.data.audioList.length
        this.setData({
          audioList: updata,
          audioIndex: audioIndexNow,
          sliderValue: 0,
          currentPosition: 0,
          duration: 0,
          audioPalyStatus: 0,
        })
        console.log('不存在则加入分享歌曲:' + audioIndexNow)
        wx.setStorageSync('audioIndex', audioIndexNow)
      }
    }

    //自动播放下一首


    // wx.onBackgroundAudioStop(function () {
    //   that.bindTapNext()
    // })
    // let nextTimer = setInterval(function() {
    //   if (that.data.audioPalyStatus === 2) {
    //     if (that.data.pauseStatus === false) {
    //       that.bindTapNext()
    //     }
    //   }
    // }, 2000)
  },

  onReady: function(e) {
    // console.log(backgroundAudioManager.paused)
    
    console.log('onReady')
    app.getUserInfo(function(userinfo) {
      //console.log(userinfo);
    })
    // 使用 wx.createAudioContext 获取 audio 上下文 context
    // this.audioCtx = wx.createAudioContext('audio')
  },
  bindSliderchange: function(e) {
    // this.setData({
    //   listShow: true
    // })
    // clearInterval(this.data.timer)
    let value = e.detail.value
    // console.log(e)
    let that = this
    console.log(e.detail.value)
    // wx.getBackgroundAudioPlayerState({
    //   success: function(res) {
    //     console.log(res)
    //     let {
    //       status,
    //       duration
    //     } = res;
    //     // console.log(res.duration)
    //     if (status === 1 || status === 0) {
    //       that.setData({
    //         sliderValue: value,
    //       })
    //       var position = value * duration / 100

    //       // console.log(BackgroundAudioManager)

    //       backgroundAudioManager.seek(position)

    //     }
    //   }
    // })
    let status = backgroundAudioManager.paused;
    let duration = backgroundAudioManager.duration;
    this.setData({
      sliderValue: value,
    })

    var position = value * duration / 100
    backgroundAudioManager.seek(position)
    // console.log('滑动了')
  },
  bindTapLike: function() {
    let audioIndexNow = this.data.audioIndex;
    // console.log(audioIndexNow);
    let audioIndex = this.data.audioIndex;
    let url = this.data.audioList[audioIndex].src;
    let like = this.data.like
    this.setData({
      like: !like
    })
    if (!like) {
      wx.showToast({
        title: '已收藏',
        icon: 'success',
        duration: 1000
      })
      this.data.audioList[audioIndex].like = true
      wx.setStorage({
        key: '',
        data: '',
      })
      console.log(this.data.audioList[audioIndex])
    }

  },
  bindTapPrev: function() {
    console.log('bindTapNext')
    console.log(this.data)
    let length = this.data.audioList.length
    let audioIndexPrev = this.data.audioIndex
    let audioIndexNow = audioIndexPrev

    switch (this.data.circulation) {
      case true:
        audioIndexNow = audioIndexPrev - 1;
        break;
      case false:
        backgroundAudioManager.seek(0)
        this.setData({
          pauseStatus: false
        })
        break;
      case null:
        audioIndexNow = Math.floor(Math.random() * (length - 1))
    }
    if (audioIndexPrev === 0) {
      audioIndexNow = length - 1
    }
    this.setData({
      prev: true,
      audioIndex: audioIndexNow,
      sliderValue: 0,
      currentPosition: 0,
      duration: 0,
      audioPalyStatus: 0,
    })

    let that = this
    setTimeout(() => {
      if (that.data.pauseStatus === false) {
        that.play()
        that.setData({
          prev: false
        })
      }
    }, 1000)
    wx.setStorageSync('audioIndex', audioIndexNow)

  },

  bindTapNext: function() {
    console.log('bindTapNext')
    let thats = this
    let length = this.data.audioList.length
    let audioIndexPrev = this.data.audioIndex
    let audioSize = this.data.audioSize
    let audioIndexNow = audioIndexPrev


    switch (this.data.circulation) {
      case true:
        audioIndexNow = audioIndexPrev + 1;
        break;
      case false:
        backgroundAudioManager.seek(0)
        this.setData({
          pauseStatus: false
        })
        break;
      case null:
        audioIndexNow = Math.floor(Math.random() * (length - 1))
    }
    if (audioIndexPrev === length - 1) {
      if (length / audioSize > 0) { //分页大于0，有分页
        let pageSize = parseInt(length / audioSize) + 1
        console.log('pageSize:' + pageSize)
        console.log(app.globalData.userInfo)
        wx.request({
          url: 'https://www.bywei.cn/upload/wukong/data.json',
          data: {
            pageSize: pageSize,
            userInfo: JSON.stringify(app.globalData.userInfo)
          },
          header: {
            'content-type': 'application/json' // 默认值
          },
          success: function(res) {
            console.log("up length begin:" + thats.data.audioList.length)
            if (res.data.length > 0) {
              let updata = thats.data.audioList.concat(res.data)
              thats.setData({
                audioList: updata,
                prev: false
              })
              length = thats.data.audioList.length
              audioIndexNow = audioIndexPrev + 1
            }
            console.log("up length end:" + thats.data.audioList.length)
          }
        })
      }
      audioIndexNow = 0
    }

    this.setData({
      audioIndex: audioIndexNow,
      sliderValue: 0,
      currentPosition: 0,
      duration: 0,
      audioPalyStatus: 0,
    })
    let that = this
    setTimeout(() => {
      if (that.data.pauseStatus === false) {
        that.play()
      }
    }, 1000)
    wx.setStorageSync('audioIndex', audioIndexNow)
  },
  bindTapPlay: function() {
    console.log('bindTapPlay')
    console.log(this.data.pauseStatus)

    if (this.data.duration == 0) {
      this.play()
      this.setData({
        pauseStatus: false
      })
    } else if (this.data.pauseStatus === true) {
      backgroundAudioManager.play()
      this.setData({
        pauseStatus: false
      })
    } else {
      backgroundAudioManager.pause()
      this.setData({
        pauseStatus: true
      })
    }
  },
  binTapCirculation: function(e) {
    let circulation = this.data.circulation

    if (circulation == true) {
      this.setData({
        circulation: !circulation
      })
      wx.showToast({
        title: '单曲循环',
        icon: 'none',
        duration: 1000,
      })
      console.log(circulation)
    } else if (circulation == false) {
      this.setData({
        circulation: null
      })
      wx.showToast({
        title: '随机播放',
        icon: 'none',
        duration: 1000
      })
      console.log(circulation)
    } else {
      this.setData({
        circulation: true
      })
      wx.showToast({
        title: '顺序播放',
        icon: 'none',
        duration: 1000
      })
      console.log(circulation)
    }

  },
  bindTapList: function(e) {
    console.log('bindTapList')
    console.log(e)
    this.setData({
      listShow: !this.data.listShow
    })
  },
  bindTapChoose: function(e) {
    console.log('bindTapChoose')
    console.log(e)
    this.setData({
      audioIndex: parseInt(e.currentTarget.dataset.testid, 10),
      listShow: false
    })

    this.play()
    wx.setStorageSync('audioIndex', parseInt(e.currentTarget.dataset.testid, 10))
  },
  play() {
    let {
      audioList,
      audioIndex,
      pauseStatus,
      networkType
    } = this.data
    // wx.playBackgroundAudio({
    //   dataUrl: audioList[audioIndex].src,
    //   title: audioList[audioIndex].name,
    //   coverImgUrl: audioList[audioIndex].poster
    // })
    if (this.data.onloadPlay) {
      this.setData({
        onloadPlay: false
      })
    }
    backgroundAudioManager.title = audioList[audioIndex].name
    backgroundAudioManager.coverImgUrl = audioList[audioIndex].poster
    // console.log(audioIndex)

    backgroundAudioManager.src = audioList[audioIndex].src
    backgroundAudioManager.onPrev(() => {
      console.log(this.data)
      let length = this.data.audioSize
      if (audioIndex === 0) {
        audioIndex = length
      }
      this.setData({
        audioIndex: --audioIndex
      })
      console.log(audioIndex)
      backgroundAudioManager.src = audioList[audioIndex].src
      backgroundAudioManager.title = audioList[audioIndex].name
      backgroundAudioManager.coverImgUrl = audioList[audioIndex].poster
      console.log('上一曲')
    })
    backgroundAudioManager.onNext(() => {
      let length = this.data.audioSize
      if (audioIndex === length - 1) {
        audioIndex = -1;
      }
      this.setData({
        audioIndex: ++audioIndex
      })
      backgroundAudioManager.src = audioList[audioIndex].src
      backgroundAudioManager.title = audioList[audioIndex].name
      backgroundAudioManager.coverImgUrl = audioList[audioIndex].poster
      console.log('下一曲')
    })
    backgroundAudioManager.onEnded(() => {
      console.log(this.data.circulation)
      if (this.data.circulation) {
        console.log('顺序播放')
        this.bindTapNext()
      } else if (this.data.circulation == false) {
        console.log('单曲循环')
        backgroundAudioManager.src = audioList[this.data.audioIndex].src
      } else {
        console.log('随机播放')
        let length = this.data.audioSize - 1;
        Math.floor(Math.random() * length)
        // console.log(Math.floor(Math.random() * length))
        let random = Math.floor(Math.random() * length)
        this.setData({
          audioIndex: random
        })
        backgroundAudioManager.src = audioList[this.data.audioIndex].src
        backgroundAudioManager.title = audioList[this.data.audioIndex].name
        backgroundAudioManager.coverImgUrl = audioList[this.data.audioIndex].poster
      }
    })
    backgroundAudioManager.onError(() => {
      this.bindTapNext()
    })
    backgroundAudioManager.onPlay(() => {
      this.setData({
        pauseStatus: false
      })
    })
    backgroundAudioManager.onPause(() => {
      console.log('音频停止')
      this.setData({
        pauseStatus: true
      })

    })
    backgroundAudioManager.onPlay(() => {
      let that = this
      console.log(this.data.onloadPlay)
      if (this.data.onloadPlay == false) {
        console.log("执行了")
        if (this.data.networkType !== 'wifi' && this.data.confirmePlay == false) {
          backgroundAudioManager.pause();
          console.log('不是wifi');
          // if (this.data.pauseStatus == true) {
          wx.showModal({
            title: '提示',
            content: '当前非Wi-Fi环境,继续播放会被运营商收取流量费用',
            confirmText: '有钱任性',
            cancelText: '朕再想想',
            success(res) {
              if (res.confirm) {
                console.log('用户点击确定')
                backgroundAudioManager.play();
                that.setData({
                  pauseStatus: false,
                  confirmePlay: true
                })

              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })
        }
      }
    })


    // backgroundAudioManager.onCanplay(() => {

    //   console.log("视频缓冲完毕，wx.createInnerAudioContext()的seek方法设置无效&小程序开发教程。可以播放啦~");
    //   console.log(backgroundAudioManager.title);
    //   wx.hideLoading()

    // })


    // console.log(this)
    let that = this

    // let timer = setInterval(function() {
    //   that.setDuration(that)
    //   // console.log(timer)
    // }, 1000)
    setInterval(function() {
      that.setDuration(that)
    },1000)
    
    // console.log(timer)
  //   this.setData({
  //     timer: timer
  //   })
  // console.log(this.data.timer)
  },

  setDuration(that) {
    // wx.getBackgroundAudioPlayerState({
    //   success: function(res) {
    //     // console.log(res)
    //     let {
    //       status,
    //       duration,
    //       currentPosition
    //     } = res
    //     console.log(currentPosition);
    //     if (status === 1 || status === 0) {
    //       that.setData({
    //         currentPosition: that.stotime(currentPosition),
    //         duration: that.stotime(duration),
    //         sliderValue: Math.floor(currentPosition * 100 / duration),
    //         audioPalyStatus: status,
    //       })
    //       console.log(that.data.currentPosition)
    //     }
    //     that.setData({
    //       audioPalyStatus: status
    //     })
    //   }
    // })
    if (this.data.pauseStatus == false) {
      let status = backgroundAudioManager.paused;
      let duration = backgroundAudioManager.duration;
      let currentPosition = backgroundAudioManager.currentTime
      that.setData({
        currentPosition: that.stotime(currentPosition),
        duration: that.stotime(duration),
        sliderValue: Math.floor(currentPosition * 100 / duration)
      })
      // console.log(this.data.currentPosition)
    } 
    
  },
  stotime: function(s) {
    let t = '';
    if (s > -1) {
      // let hour = Math.floor(s / 3600);
      let min = Math.floor(s / 60) % 60;
      let sec = Math.ceil(s % 60);
      // if (hour < 10) {
      //   t = '0' + hour + ":";
      // } else {
      //   t = hour + ":";
      // }

      if (min < 10) {
        t += "0";
      }
      t += min + ":";
      if (sec < 10) {
        t += "0";
      }
      t += sec;
    }
    return t;
  },
  onShareAppMessage: function() {
    let that = this
    let params = 'name=' + that.data.audioList[that.data.audioIndex].name
    params += '&poster=' + that.data.audioList[that.data.audioIndex].poster
    params += '&src=' + that.data.audioList[that.data.audioIndex].src
    return {
      title: '我发现了学习中医里《' + that.data.audioList[that.data.audioIndex].name + '》知识的好方法, 赶紧来！',
      path: '/pages/index/index?author=&' + params,
      success: function(res) {
        wx.showToast({
          title: '分享成功',
          icon: 'success',
          duration: 2000
        })
      },
      fail: function(res) {
        wx.showToast({
          title: '分享失败',
          icon: 'cancel',
          duration: 2000
        })
      }
    }
  },
  binderrorimg: function(e) {
    var errorImgIndex = e.target.dataset.errorimg //获取循环的下标
    console.log("errorImgIndex:" + errorImgIndex)
    console.log("poster:" + this.data.audioList[errorImgIndex].poster)
    this.data.audioList[errorImgIndex].poster = "https://file.bywei.cn/music/chuhe/cover.jpg"
  },
  scrollLoadMore: function(e) {
    let thats = this
    let length = this.data.audioList.length
    let audioSize = this.data.audioSize
    let pageSize = parseInt(length / audioSize) + 1

    if (!this.data.hasMore) return
    thats.setData({
      loadHidden: false
    });

    wx.request({
      url: 'https://www.bywei.cn/upload/wukong/data.json',
      data: {
        pageSize: pageSize,
        userInfo: JSON.stringify(app.globalData.userInfo)
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function(res) {
        console.log("load up length begin:" + thats.data.audioList.length)
        if (res.data.length > 0) {
          let updata = thats.data.audioList.concat(res.data)
          thats.setData({
            audioList: updata
          })
          length = thats.data.audioList.length
          thats.setData({
            hasMore: false
          });
        }
        thats.setData({
          loadHidden: true
        });
        console.log("load up length end:" + thats.data.audioList.length)
      }
    })
  },
  goQuestion: function(e) {
    console.log('open webview page')
    wx.navigateTo({
      url: '../webview/index',
      success: function(e) {
        console.log(e)
      }
    })
  },

  tap_ch: function(e) {
    if (this.data.open) {
      this.setData({
        translate: 'transform: translateX(0px)'
      })
      this.data.open = false;
    } else {
      this.setData({
        translate: 'transform: translateX(' + this.data.windowWidth * 0.75 + 'px)'
      })
      this.data.open = true;
    }
  },
  tap_start: function(e) {
    // console.log(e.touches[0].pageY)
    this.data.mark = this.data.newmark = e.touches[0].pageX;
    if (e.touches[0].pageY > 420) {
      // console.log('超出了');
      return
    } else if (this.data.staus == 1) {
      // staus = 1指默认状态
      this.data.startmark = e.touches[0].pageX;
    } else {
      // staus = 2指屏幕滑动到右边的状态
      this.data.startmark = e.touches[0].pageX;
    }

  },
  tap_drag: function(e) {
    /*
     * 手指从左向右移动
     * @newmark是指移动的最新点的x轴坐标 ， @mark是指原点x轴坐标
     */
    this.data.newmark = e.touches[0].pageX;
    if (e.touches[0].pageY > 420) {
      // console.log('超出了');
      return
    } else if (this.data.mark < this.data.newmark) {
      if (this.data.staus == 1) {
        if (this.data.windowWidth * 0.75 > Math.abs(this.data.newmark - this.data.startmark)) {
          this.setData({
            translate: 'transform: translateX(' + (this.data.newmark - this.data.startmark) + 'px)'
          })
        }
      }

    }
    /*
     * 手指从右向左移动
     * @newmark是指移动的最新点的x轴坐标 ， @mark是指原点x轴坐标
     */
    if (this.data.mark > this.data.newmark) {
      if (e.touches[0].pageY > 420) {
        console.log('超出了');
        return
      } else if (this.data.staus == 1 && (this.data.newmark - this.data.startmark) > 0) {
        this.setData({
          translate: 'transform: translateX(' + (this.data.newmark - this.data.startmark) + 'px)'
        })
      } else if (this.data.staus == 2 && this.data.startmark - this.data.newmark < this.data.windowWidth * 0.75) {
        this.setData({
          translate: 'transform: translateX(' + (this.data.newmark + this.data.windowWidth * 0.75 - this.data.startmark) + 'px)'
        })
      }

    }

    this.data.mark = this.data.newmark;

  },
  tap_end: function(e) {
    // if(e.changedTouches==475)
    // console.log(e.changedTouches[0])
    if (e.changedTouches[0].pageY > 420) {
      // console.log('超出了');
      return
    } else if (this.data.staus == 1 && this.data.startmark < this.data.newmark) {
      if (Math.abs(this.data.newmark - this.data.startmark) < (this.data.windowWidth * 0.3)) {
        this.setData({
          translate: 'transform: translateX(0px)'
        })
        this.data.staus = 1;
      } else {
        this.setData({
          translate: 'transform: translateX(' + this.data.windowWidth * 0.75 + 'px)'
        })
        this.data.staus = 2;
      }
    } else if (Math.abs(this.data.newmark - this.data.startmark == 0)) {
      return;
    } else {
      if (Math.abs(this.data.newmark - this.data.startmark) < (this.data.windowWidth * 0.3)) {
        this.setData({
          translate: 'transform: translateX(' + this.data.windowWidth * 0.75 + 'px)'
        })
        this.data.staus = 2;
      } else {
        this.setData({
          translate: 'transform: translateX(0px)'
        })
        this.data.staus = 1;
      }

    }


    this.data.mark = 0;
    this.data.newmark = 0;
  }

})