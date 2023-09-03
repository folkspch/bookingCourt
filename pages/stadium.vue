<template>
  <div style="color: black">
    <v-row>
      <v-col cols="3">
        <div>
          <v-list light>
            <v-subheader style="font-size: 20px">รายชื่อสนาม</v-subheader>
            <v-list-item-group v-model="selectedID" color="primary">
              <v-list-item v-for="(item, index) in this.data" :key="index">
                <!-- <v-list-item-icon>
                  <v-icon v-text="item.icon"></v-icon>
                </v-list-item-icon> -->
                <v-list-item-content>
                  <v-list-item-title >{{ item.Name_th }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </div>
      </v-col>
      <v-col>
        <div v-if="selectedID != null">
          <v-card
            class="mx-auto"
            style="padding: 20px; margin-top: 20px"
            max-width="50%"
            elevation="3"
            light
          >
            <v-card-title>รายละเอียดสนาม</v-card-title>
            <div class="mx-auto">
              <v-card-text>
                <p>ชื่อสนาม : {{ this.data[selectedID].Name_th }}</p>
                <p>ชนิดสนามกีฬา : {{ this.data[selectedID].Type_th }}</p>
                <p>สถานที่ตั้ง : {{ this.data[selectedID].Place_th }}</p>
                <p>
                  จำนวนผู้เล่นที่อนุญาตให้จอง :
                  {{ this.data[selectedID].Players }} คน
                </p>
                <p>
                  เวลาเปิด :
                  {{ this.data[selectedID].TimeOpen.substring(5, 0) }} -
                  {{ this.data[selectedID].TimeClose.substring(5, 0) }}
                </p>
              </v-card-text>
            </div>
            <v-img max-width="600px" :src="this.data[selectedID].Img">
              <template v-slot:placeholder>
                <v-row class="fill-height ma-0" align="center" justify="center">
                  <v-progress-circular
                    indeterminate
                    color="grey-lighten-5"
                  ></v-progress-circular>
                </v-row>
              </template>
            </v-img>
            <!-- {{selectedID}} -->
          </v-card>
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      selectedID: null,
      pic: "https://cdn2.iconfinder.com/data/icons/pretty-office-part-7/256/football_pitch-512.png",
      data: [
        {
          Players: "",
          Id: "",
          Img: "",
          Name_en: "",
          Name_th: "",
          Place_en: "",
          Type_en: "",
          Type_th: "",
        },
      ],
    };
  },
  methods: {
    API() {
      const options = {
        url: `http://localhost:4000/getCourtData`,
        method: "GET",
      };
      this.$axios(options).then((res) => {
        //store all data
        this.data = res.data;
        console.log(this.data);
        console.log("API connected");
      });
    },
  },
  mounted() {
    this.API();
    this.$store.state.courtDetail.time = null;
  },
};
</script>

<style scoped>
.stadiumInfo {
  padding: 20px;
}
</style>
