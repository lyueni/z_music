<template>
  <div class="song" :style="{ backgroundImage: 'url(http://music.163.com/api/img/blur/'+song.pic_str+')' }">
    <div class="song-wrap">
      <div class="clearfix" :style="{ height: screen.height + 'px' }">
        <div class="song-player" ref="songPlayerNode" @click="songFun">
          <i class="pointer" :style="{ transform: song.isPlay ? 'rotate(20deg)' : 'rotate(0deg)' }"></i>
          <i class="img-bg" :style="{ 'animation-play-state': song.isPlay ? 'running' : 'paused' }"></i>
          <div class="img" :style="{ 'animation-play-state': song.isPlay ? 'running' : 'paused' }">
            <img :src="song.picUrl" alt="">
            <i class="status" v-show="!song.isPlay"></i>
          </div>
        </div>

        <div class="lyric" :style="{ height: screen.lyricHeight + 'px' }">
          <div class="lyric-wrap">
            <ul class="lyric-list" :style="{ 'transition-duration': transitionDurationTime, transform: 'translate(0, '+ -activeIndex*(80/75) +'rem)'}">
              <li :class="{ active: index == activeIndex }" v-for="(item,index) in song.lyric" :key="index">{{ item.content !=null? item.content:item.content+1}}</li>
            </ul>
          </div>
        </div>
      </div>
      <!--作业 写其他内容-->
      <div class="clearfix">
        <ul class="simiSong-list">
          <app-title class="song_title">喜欢这首歌的人也听</app-title>
          <li v-for="item in simiSongData" :key="item.id">
            <!-- <router-link :to="'/simi/song/'+item.id"> -->
            <div class="pic_text">
              <div class="cover"><img src=""></div>
              <div class="text">
                <div class="name">{{ item.name }}</div>
                <div class="singer">{{ item.artists[0] != null ? item.artists[0].name : '' }}   {{ item.album.artists.name }}</div>
              </div>
            </div>
              <i class="fa fa-play-circle-o"></i>
            <!-- </router-link> -->
          </li>
        </ul>        
      </div>
      <div class="clearfix" >
        <ul class="hotComment-list">
          <app-title class="song_title">精彩评论</app-title>
          <li v-for="item in hotCommentData" :key="item.id">
            <div class="infomation">
              <div class="pic_text">
                <div class="photo"><img :src="item.user.avatarUrl"></div>
                <div class="text">
                  <div class="name">{{ item.user.nickname }}</div>
                  <div class="time">{{ parseDate(item.time)}}</div>
                </div>
              </div>
              <div class="likedCount">
                <i class="count">{{item.likedCount}}</i>
                <i class="fa fa-thumbs-o-up"></i>
              </div>
            </div>
            <div class="content">{{ item.content }}</div>
          </li>
        </ul>        
      </div>
    </div>
  </div>
</template>

<script>
import { getSongUrl, getSongDetail, getSongLyric, getSimiSong ,getHotComment } from '@/api/song';
import appTitle from '@/components/app-title'
import { parseDate } from '@/utils/date.js';


export default {
  async created(){
    await this.getSongDetail();
    await this.getSongLyric();

    this.getSongUrl();
    this.getSimiSong();
    this.getHotComment();
  },
  mounted(){
    var dpr = document.documentElement.getAttribute('data-dpr');
    var windowResize = ()=>{
      this.screen.height = window.screen.height * dpr;
      this.screen.lyricHeight = this.screen.height - this.$refs.songPlayerNode.clientHeight - this.$refs.songPlayerNode.offsetTop;//得到歌词可视高度=屏高-播放器可视高度
      
      //console.log(this.screen.height, this.screen.lyricHeight)
    };
    window.onresize = windowResize;
    windowResize();
  },
  data(){
    return {
      song: {
        isPlay: true,//是否在播放
        name: '',//歌名
        url: null,
        picUrl: '',//图片
        pic_str: '',
        lyric: [],//{ time: 0, content: '歌词' }
        activeIndex: 0,//歌词激活位置，默认是第一句。（就刚开始用了0，后来的activeindex都是来自store中）
      },

      screen: {
        height: null,//屏幕的高度,以px作为单位返回的值
        lyricHeight: null,//歌词可以占据的高度,以px作为单位返回的值
      },

      transitionDurationTime: 0,//过渡的动画时间
      simiSongData:[],//相似音乐/喜欢这首歌的也喜欢
      hotCommentData:[],//热门评论
    };
  },
  methods: {
    parseDate,
    songFun(){
      this.song.isPlay = !this.song.isPlay;
      this.$store.commit('updateSong', this.song)
    },
    getSongUrl(){//歌url接口
      var id = this.$route.params.id;
      getSongUrl({ 
        params: {
          id
        }
      }).then(res =>{
        var data = res.data;
        if(data.code == 200){
          var song = data.data[0];
          if(song){
            if(this.url != song.url){//对同一首歌进入不做重新播放处理
              this.song.url = song.url;
              this.songFun();
            }
          }
        }
      });
    },
    getSongDetail(){//歌详情接口
      return new Promise((resolve,reject) =>{
        var ids = this.$route.params.id;
        getSongDetail({ 
          params: {
            ids
          }
        }).then(res =>{
          var data = res.data;
          if(data.code == 200){
            var songData = data.songs[0];
            if(songData){
              var al = songData.al;
              this.song.name = al.name;
              this.song.picUrl = al.picUrl;
              this.song.pic_str = al.pic_str;
            }
          }
          resolve(true);
        });
      });
    },
    getSongLyric(){//歌词接口
      return new Promise((resolve,reject) =>{
        var id = this.$route.params.id;
        getSongLyric({ 
          params: {
            id
          }
        }).then(res =>{
          var data = res.data;
          if(data.code == 200){
            var lyric = data.lrc.lyric
            if(lyric){
              var lyricArr = lyric.split(/\n/);
              var newLyricArr = lyricArr.map(item => {
                var arrItem = item.split(']');
                var arrTime = arrItem[0].slice(1).split(':');
                var time = arrTime[0]*60+Number(arrTime[1]);
                var content = arrItem[1];
                return { 
                  time, 
                  content 
                };
              });
              this.song.lyric = newLyricArr;
              console.log(newLyricArr)
            }
          }
          resolve(true);
        });
      });
    },
    getSimiSong(){
      var id = this.$route.params.id;
      getSimiSong({
        params: {
          id
        }
      }).then(res =>{
        var data = res.data;
        if(data.code == 200){//成功
          this.simiSongData = data.songs;
          console.log( this.simiSongData);
          console.log(  this.simiSongData.artists[0]);
        }
      })
    },
    getHotComment(){
      var id = this.$route.params.id;
      getHotComment({
        params: {
          id,
          type:0,
          limit:5,
        }
      }).then(res =>{
        var data = res.data;
        if(data.code == 200){//成功
          this.hotCommentData = data.hotComments; 
          console.log( this.hotCommentData);
        }
      })
    },
    transitionDuration(){//得到过渡时间
      var activeLyric = this.song.lyric[this.activeIndex];//当前歌词
      var nextLyric = this.song.lyric[this.activeIndex + 1];//下一句歌词
      if(nextLyric){
        this.transitionDurationTime = (nextLyric.time - activeLyric.time) + 's';
      }
      else{
        this.transitionDurationTime = 0;
      }
      console.log(this.transitionDurationTime)
    },
  },
  computed: {
    songStore(){//得到歌的数据
      return this.$store.getters.song;
    },
    activeIndex(){
      return this.songStore.activeIndex;
    },
    url(){
      return this.songStore.url;
    },
    isPlay(){
      return this.songStore.isPlay;
    },
  },
  watch: {
    isPlay(newval){
      this.song.isPlay = newval;
    },
    activeIndex(newval){
      this.transitionDuration();
    },
  },
  components: {
    appTitle,
  }
}
</script>

<style lang="scss" scoped>
@keyframes circle
{
  from { transform: rotate(0deg);}
  to {transform: rotate(360deg);}
}

.song{
  background: #484848 no-repeat center 0 / auto 100%;
}
.song-wrap{
  background: rgba(0,0,0,0.5);
  .lyric{
    box-sizing: border-box;
    padding: 46px 0;
    display: flex;
  }
  .lyric-wrap{
    width: 100%;
    text-align: center;
    color: rgba(255,255,255,0.4);
    font-size: 34px; /*px*/
    overflow: hidden;
    .lyric-list{
      transition-property: transform;
    }
    li{
      min-height: 80px;
      line-height: 80px;
    }
    .active{  color: rgba(255,255,255,1); }
  }
}
.song-player{
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  width: 585px;
  height: 585px;
  margin: 175px auto 0;
  .pointer{
    position: absolute;
    left: 50%;
    top: -185px;
    z-index: 8;
    width: 207px;
    height: 315px;
    background: url('~@/assets/img/needle.png') no-repeat center 0 / 168px 244px;
    transition: transform 0.5s;
    transform-origin: 80px 0;
  }
  .img-bg{
    position: absolute;
    left: 0;
    top: 0;
    z-index: 2;
    width: 100%;
    height: 100%;
    background: url('~@/assets/img/disc.png') no-repeat 0 0 / 100% 100%; 
    animation: circle 5s linear infinite;
  }
  .img{
    position: relative;
    z-index: 5;
    width: 370px;
    height: 370px;
    border-radius: 50%;
    overflow: hidden;
    background: #000;
    animation: circle 5s linear infinite;
  }
  .status{
    position: absolute;
    left: 50%;
    top: 50%;
    margin: -50px 0 0 -50px;
    width: 100px;
    height: 100px;
    background: url('~@/assets/img/play-icon.png') no-repeat 0 0 / 100% 100%;
  }
}  
.song_title{
    color:white;
    font-size: 36px;/*px*/
    padding-bottom: 20px;
}
.simiSong-list{
  padding-top: 40px;
  li{
    padding: 0 0 38px 30px;
    display: flex;
    justify-content: space-between;
    .pic_text{
      display: flex;
      justify-content: space-between;
      .cover{
        width: 84px;
        height: 84px;
        background: #fff;
      }
      .text{
        margin-left: 20px;
      }
      .name{
        font-size: 30px;/*px*/
        line-height: 48px;/*px*/
        color:#fff;
      }
      .singer{
        font-size: 24px;/*px*/
        line-height: 36px;/*px*/
        color:#989898;
      }
    }
    .fa-play-circle-o{
      display: flex;
      align-items: center;
      font-size: 44px;/*px*/
      color: #aaaaaa;
      margin-right: 30px;
    }
  }
}
.hotComment-list{
  li{
    padding: 0 0 30px 30px;
    .infomation{
    display: flex;
    justify-content: space-between;
    }
    .pic_text{
      display: flex;
      justify-content: space-between;
      .photo img{
        width: 66px;
        height: 66px;
        background: #fff;
        border-radius: 50%
      }
      .text{
        margin-left: 20px;
      }
      .name{
        font-size: 26px;/*px*/
        line-height: 36px;/*px*/
        color:#ccc;
      }
      .time{
        font-size: 20px;/*px*/
        line-height: 30px;/*px*/
        color:#8a8a8a;
        font-weight: bold;
      }
    }
    .likedCount{
      display: flex;
      align-items: center;
      .count{
        font-size: 20px;
        font-style:normal;
        margin-right: 8px;
      }
      .fa-thumbs-o-up{
        font-size: 26px;/*px*/
      }
      color: #aaa;
      margin-right: 30px;
    }
    .content{
      color: #dcdcdc;
      font-size: 26px;/*px*/
      line-height: 38px;/*px*/
      padding:25px 30px 25px 86px;
    }
  }
}
</style>
