<template>
  <div>
  <div v-for="(item, index) in this.courtList" :key="index">
    <v-card
      style="padding: 10px"
      max-width="50%"
      class="d-flex mx-auto my-6"
      light
    >
      <v-col cols="3">
        <img width="150" :src="courtPic[index]" />
      </v-col>
      <v-col cols="5">
        <v-card-title>{{courtList[index]}}</v-card-title>
        <v-btn color="success" style="margin-left: 15px">เลือก</v-btn>
      </v-col>
    </v-card>
  </div>
  </div>
</template>

<script>

export default {
    data() {
    return {
      courtList: ["สนามบาสเกตบอล", "สนามแบดมินตัน", "สนามฟุตซอล"],
      courtPic: [
        "https://img.lovepik.com/photo/50154/0220.jpg_wh860.jpg",
        "https://media-cdn.tripadvisor.com/media/photo-s/0a/b2/e9/e1/caption.jpg",
        "https://s.isanook.com/sp/0/ud/9/46940/413286-01.jpg",
      ],
    };
  },
};
</script>

<style scoped>
</style>