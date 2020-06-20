<template>
  <div>
    <app-nav></app-nav>
    <app-title>推荐歌单</app-title>
    <ul class="imgText-list">
      <li v-for="item in imgTextData" :key="item.id">
        <router-link :to="''+item.id">
          <div class="img">
            <img :src="item.picUrl" alt="">
            <span><i class="fa fa-headphones"></i>{{ (item.playCount/10000).toFixed(1) + '万' }}</span>
          </div>
          <div class="text">
            {{ item.name }}
          </div>
        </router-link>
      </li>
    </ul>
    <app-title>最新音乐</app-title>
    <ul class="newSong-list">
      <li v-for="item in newSongData" :key="item.id">
        <router-link :to="'/song/'+item.id">
          <div class="text">
            <div class="name">{{ item.name }}</div>
            <div class="singer">{{ item.song.artists[0] != null ? item.song.artists[0].name : '' }} - {{ item.song.album.name }}</div>
          </div>
          <i class="fa fa-play-circle-o"></i>
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script>
import appNav from '@/components/app-nav'
import appTitle from '@/components/app-title'
import { getPersonalized, getPersonalizedNewsong } from '@/api/recommendation'

export default {
  created(){
    this.getPersonalized();
    this.getPersonalizedNewsong();
  },
  data(){
    return {
      imgTextData: [],//推荐歌单的数据
      newSongData: [],//新音乐数据
    };
  },
  methods: {
    getPersonalized(){
      getPersonalized({
        params: {
          limit: 6
        }
      }).then(res =>{
        var data = res.data;
        if(data.code == 200){//成功
          this.imgTextData = data.result;
        }
      });
    },
    getPersonalizedNewsong(){
      getPersonalizedNewsong({}).then(res =>{
        var data = res.data;
        if(data.code == 200){//成功
          this.newSongData = data.result;
        }
      })
    },
  },
  components: {
    appNav,
    appTitle,
  }
}
</script>

<style lang="scss" scoped>
.imgText-list{
  display: flex;
  flex-flow: wrap;
  li{
    width: 33.33%;
    a{
      display: display;
    }
  }
  .img{
    position: relative;
    width: 245px;
    height: 245px;
    overflow: hidden;
    img{ width: 100%;}
    span{
      position: absolute;
      right: 12px;
      top: 10px;
      color: #fff;
      font-size: 22px;/*px*/
    }
    .fa-headphones{
      margin-right: 6px;
    }
  }
  .text{
    margin: 12px 12px 32px;
    font-size: 30px;/*px*/
    line-height: 34px; /*px*/
    height: 68px;/*px*/
    overflow : hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
}
.newSong-list{
  li{
    padding-left: 20px;
    &>a{
      display: flex;
      justify-content: space-between;
      border-bottom: #e2e2e3 1px solid;/*no*/
    }
    .text{
      padding: 13px 0;
    }
    .name{
      font-size: 26px;/*px*/
      line-height: 48px;/*px*/
    }
    .singer{
      font-size: 24px;/*px*/
      line-height: 36px;/*px*/
      color:#888888;
    }
    .fa-play-circle-o{
      display: flex;
      align-items: center;
      font-size: 44px;/*px*/
      color: #aaaaaa;
      margin-right: 20px;
    }
  }
}
</style>
