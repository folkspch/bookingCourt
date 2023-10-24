<template>
  <div id="card">
    <v-card
      v-if="selectedCourt != null & this.court.length!=0"
      :class="classPage"
      style="padding: 20px;"
      max-width="60%"
      elevation="3"
      light
    >
      <!-- {{ this.data[selectedID].Description_th }} -->
      <v-card-title>รายละเอียดสนาม</v-card-title>
      <div class="mx-auto">
        <v-card-text >
          <p>
            ชื่อสนาม : {{ this.court[parseInt(this.selectedCourt ? this.selectedCourt: this.Court) - 1].Name_th }}
          </p>
          <p>
            ชนิดสนามกีฬา : {{ this.court[parseInt(this.selectedCourt ? this.selectedCourt: this.Court) - 1].Type_th }}
          </p>
          <p>
            สถานที่ตั้ง : {{ this.court[parseInt(this.selectedCourt ? this.selectedCourt: this.Court) - 1].Place_th }}
          </p>
          <p>
            จำนวนผู้เล่นขั้นต่ำ :
            {{ this.court[parseInt(this.selectedCourt ? this.selectedCourt: this.Court) - 1].Players }} คน
          </p>
          <p v-if="$store.state.courtDetail.time">
            ช่วงเวลาที่ต้องการจอง :
            {{ this.$store.state.courtDetail.time }}
          </p>
        </v-card-text>
      </div>
      <v-img
        :max-width="this.mw"
        :src="this.court[parseInt(this.selectedCourt ? this.selectedCourt: this.Court) - 1].Img"
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
      mw: "500px",
      classPage: "",
      court:[],
      COURT:null
    };
  },
  props: {
    Court: String,
    selectedCourt: String,
    page: String,
  },
  methods: {
    getCourtList(){
       this.$axios
        .get("http://localhost:4000/getCourtData")
        .then((res) => {
          this.court=res.data
          if(!this.$store.state.courtDetail.Players){
            this.$store.commit("setCourtDetail", res.data);
            console.log(this.$store.state.courtDetail)
          }
          // console.log(this.court,"thiscourttt")
        });
    },
  },
  mounted() {
    if(!this.selectedCourt){
      this.COURT = this.court
    }
    else{
      this.COURT = this.selectedCourt
    }
    if (this.page === "timetable") {
      this.classPage = "mx-auto d-flex mt-5";
      this.mw = "200px";
    }
  },
  created() {
    this.getCourtList()
  },
};
</script>

<style></style>
