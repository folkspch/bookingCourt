<template>
<div id="card">
  <v-card
    v-if="selectedCourt != null"
    :class="classPage"
    style="padding: 20px; margin-top: 20px"
    max-width="50%"
    elevation="3"
    light
  >
    <!-- {{ this.data[selectedID].Description_th }} -->
    <v-card-title>รายละเอียดสนาม</v-card-title>
    <div class="mx-auto">
      <v-card-text>
        <p>ชื่อสนาม : {{ this.court[parseInt(selectedCourt) - 1].Name_th }}</p>
        <p>
          ชนิดสนามกีฬา : {{ this.court[parseInt(selectedCourt) - 1].Type_th }}
        </p>
        <p>
          สถานที่ตั้ง : {{ this.court[parseInt(selectedCourt) - 1].Place_th }}
        </p>
        <p>
          จำนวนผู้เล่นที่อนุญาตให้จอง :
          {{ this.court[parseInt(selectedCourt) - 1].Description_th }}
        </p>
      </v-card-text>
    </div>
    <v-img
      :max-width="this.mw"
      :src="this.court[parseInt(selectedCourt) - 1].Img"
    >
    </v-img>
    <!-- {{selectedID}} -->
    <!-- {{this.court}} -->
    
  </v-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
        mw:'500px',
        classPage:''

    };
  },
  props: {
    court: [],
    selectedCourt: String,
    page: String,
  },
  mounted(){
      if(this.page==='timetable'){
          this.classPage='mx-auto d-flex'
          this.mw='200px'
      }
  }
  
};
</script>

<style></style>
