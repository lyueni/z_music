<template>
  <div class="player" v-show="isShowPlayer">
    <audio ref="audioNode" :src="url" controls="controls" class="song-audio" autoplay="true"></audio>
  </div>
</template>

<script>


export default {
  mounted(){
    this.$refs.audioNode.onpause = () =>{//当播放器暂停的时候
      this.song.isPlay = false;
      this.$store.commit('updateSong', this.song);
    };
    this.$refs.audioNode.onplay = () =>{
      this.song.isPlay = true;
      this.$store.commit('updateSong', this.song);
    };
    this.$refs.audioNode.ontimeupdate = ()=>{
      //console.log(this.$refs.audioNode.currentTime, this.$refs.audioNode.duration)
      //this.lyric[this.actvieIndex].time//当前歌词开始的时间点
      //this.$refs.audioNode.currentTime//当前歌播放的时间点
      var currentTime = this.$refs.audioNode.currentTime;
      for(var index = 0; index < this.lyric.length; index++){
        var item = this.lyric[index];
        if(currentTime < item.time){
          this.song.activeIndex = index == 0 ? 0 : index - 1;
          break;
        }
      }
      //console.log(this.song.activeIndex)
      this.$store.commit('updateSong', this.song);
    };
  },
  computed: {
    song(){//得到歌的数据
      return this.$store.getters.song;
    },
    url(){//歌的url
      return this.song.url;
    },
    actvieIndex(){
      return this.song.actvieIndex;
    },
    lyric(){
      return this.song.lyric;
    },
    isPlay(){ //在song的index界面的songFun方法中，有更新isplay值
      return this.song.isPlay;
    },
    isShowPlayer(){//是否显示播放器
      return this.url != '' && this.url != null
    },
  },
  watch: {
    isPlay(newval,oldval){
      if(newval){
        this.$refs.audioNode.play();
      }
      else{
        this.$refs.audioNode.pause();
      }  
    },
  },
}
</script>

<style lang="scss" scoped>
.player{
  position: fixed;
  right: 0;
  top: 50%;
  transform: translate(0, -50%);
  z-index: 99999;
}
</style>
