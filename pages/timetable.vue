<template>
  <div>
    <v-col class="d-flex" cols="12" sm="6">
      <v-select v-model="selectedCourt" :items="listCourt" solo></v-select>
    </v-col>
    {{this.selectedCourt}}
  </div>
</template>

<script>
import axios from 'axios'
export default {
  asyncData() {
    return axios.get("http://localhost:4000/getCourtData").then((res) => {
      let courtt=[];
      courtt = res.data;
      let listCourtt=[];
      for (let i = 0; i < courtt.length; i++) {
        listCourtt[i] = courtt[i].Name_th;
      }
      console.log(listCourtt);
      return{
       court:courtt,
       listCourt:listCourtt
      }
    });
  },
  data() {
    return {
      court: [
        {
          Description_en: "",
          Description_th: "",
          Id: "",
          Img: "",
          Name_en: "",
          Name_th: "",
          Place_en: "",
          Type_en: "",
          Type_th: "",
        },
      ],
      listCourt: [],
      selectedCourt:'',
    };
  },

  methods: {
    API() {
      const options = {
        url: `http://localhost:4000/getCourtData`,
        method: "GET",
      };
      this.$axios(options).then((res) => {
        this.court = res.data;
        for (let i = 0; i < this.court.length; i++) {
          this.listCourt[i] = this.court[i].Name_th;
        }
        console.log(this.court);
      });
    },
    print() {
      console.log(this.court);
    },
  },
  mounted() {
    // console.log("mmmmmm"+this.listCourt);
    // this.API();
  },
};
</script>

<style scoped></style>
