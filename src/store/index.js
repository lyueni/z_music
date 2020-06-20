import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

var store = new Vuex.Store({
  state: {//放数据的
    song: {//歌曲数据
      url: '',//当前歌曲地址
      name: '',//歌名
      isPlay: false,//是否在播放
      picUrl: '',//图片
      pic_str: '',
      lyric: [],
      activeIndex: 0,//歌词激活位置
    },
  },
  getters: {//在组建中得到state
    song: state => state.song,
  },
  mutations: {//同步处理state
    updateSong(state,playload){
      state.song = playload;
    },
  },
  actions: {//异步处理
    
  }
})

export default store;