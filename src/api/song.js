import require from '@/utils/require';

export function getSongUrl(oParams){
  return require.get('/song/url', {
    params: oParams.params
  });
};

export function getSongDetail(oParams){
  return require.get('/song/detail', {
    params: oParams.params
  });
};

export function getSongLyric(oParams){
  return require.get('/lyric', {
    params: oParams.params
  });
};

export function getSimiSong(oParams){
  return require.get('/simi/song', {
    params: oParams.params
  });
};
export function getHotComment(oParams){
  return require.get('/comment/hot', {
    params: oParams.params
  });
};