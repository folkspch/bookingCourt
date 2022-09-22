<template>
  <div>
    <v-col class="d-flex" cols="12" sm="6">
      <v-select
        v-model="selectedCourt"
        :items="court"
        item-text="Name_th"
        item-value="Court_id"
        @change="plotTable()"
        solo
      ></v-select>
    </v-col>
    <v-simple-table class="mb-5">
      <template v-slot:default>
        <thead>
          <tr>
            <th style="background-color: #bebebe">ช่วงเวลา</th>
            <th
              style="background-color: #ebecf0"
              v-for="(item, index) in time"
              :key="index"
              class="pa-3"
            >
              {{ item }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="pa-5" style="background-color: #ebecf0">
              <v-row
                ><v-avatar class="mt-1" color="red" size="10"></v-avatar>
                <p class="ml-2">ไม่ว่าง</p></v-row
              >
              <v-row
                ><v-avatar class="mt-1" color="blue" size="10"></v-avatar>
                <p class="ml-2">กำลังดำเนินการ</p></v-row
              >
              <v-row
                ><v-avatar class="mt-1" color="green" size="10"></v-avatar>
                <p class="ml-2">ว่าง</p></v-row
              >
            </td>
            <!-- <div v-if="selectedCourt"> -->
            <td
              v-for="index in time.length"
              :key="index"
              :id="'table' + index"
            ></td>
            <!-- </div> -->
          </tr>
        </tbody>
      </template>
    </v-simple-table>

    <v-divider></v-divider>

    <CourtDetail
      :selectedCourt="selectedCourt"
      :page="'timetable'"
    />
    <!-- {{ this.selectedCourt }} -->
    <!-- <v-btn @click="findData(selectedCourt,'Description_th')">GHGHG</v-btn> -->
    <!-- <div id="gg">
    <p @click="print()">
      asdasdasd
    </p>
  </div> -->
    <!-- <v-btn @click="test()">
    gg
  </v-btn>
  <div v-html="this.temp[0].Rules_P1" ></div> -->
  </div>
</template>

<script>
import CourtDetail from "@/components/CourtDetail.vue";
import axios from "axios";
export default {
  components: {
    CourtDetail,
  },
  asyncData() {
    return axios.get("http://localhost:4000/getCourtData").then((res) => {
      let courtt = [];
      courtt = res.data;
      let listCourtt = [];
      for (let i = 0; i < courtt.length; i++) {
        listCourtt[i] = courtt[i].Name_th;
      }
      // console.log(courtt);
      // console.log(listCourtt);
      return {
        court: courtt,
        listCourt: listCourtt,
      };
    });
  },
  data() {
    return {
      court: [
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
      listCourt: [],
      selectedCourt: null,
      timev2: [
        ["08.00", "09.00"],
        ["09.00", "10.00"],
        ["10.00", "11.00"],
        ["11.00", "12.00"],
        ["12.00", "13.00"],
        ["13.00", "14.00"],
        ["14.00", "15.00"],
        ["15.00", "16.00"],
        ["16.00", "17.00"],
        ["17.00", "18.00"],
      ],
      time: [
        "8.00-9.00",
        "9.00-10.00",
        "10.00-11.00",
        "11.00-12.00",
        "12.00-13.00",
        "13.00-14.00",
        "14.00-15.00",
        "15.00-16.00",
        "16.00-17.00",
        "17.00-18.00",
      ],
      table: [],
      plotStatus: 0,
    };
  },

  methods: {
    // print(){
    //   let temp = document.getElementById('gg');
    //   console.log(temp)
    // },
    test() {
      const options = {
        url: `http://localhost:4000/getRules`,
        method: "GET",
      };
      this.$axios(options).then((res) => {
        this.temp = res.data;
        console.log("temp ", this.temp);
      });
    },
    API(date, court) {
      // const options = {
      //   url: `http://localhost:4000/getBookingData/${date}/${court}`,
      //   method: "GET",
      // };
      // this.$axios(options).then((res) => {
      //   this.table = res.data.data;
      //   console.log(this.table);
      //   for (let i = 0; i < this.time.length; i++) {
      //     let temp = i + 1;
      //     let table = temp.toString();
      //     // console.log(table)
      //     if (this.table.find((x) => x.Time === table)) {
      //       console.log(table);
      //       if (this.table.find((x) => x.Time === table).Status === "1") {
      //         console.log("plot1");
      //       } else if (
      //         this.table.find((x) => x.Time === table).Status === "0"
      //       ) {
      //         console.log("plot0");
      //       }
      //     }
      //   }
      // });
    },
    isInRange(value, range) {
      if(this.plotStatus == 1){
        return true
      }
      else{
        return value <= range[0];
      }
      
    },
    plotTable() {
      let d = new Date();
      let today =
        d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();

      const options = {
        url: `http://localhost:4000/getBookingData/${today}/${this.selectedCourt}`,
        method: "GET",
      };
      this.$axios(options).then((res) => {
        this.table = res.data.data;
        console.log(this.table);
        for (let i = 0; i < this.time.length; i++) {
          let temp = i + 1;
          let table = temp.toString();
          let temp1 = document.getElementById("table" + table);
          temp1.classList.remove("reserved");
          temp1.classList.remove("inPorgress");
          temp1.classList.remove("free");
        }

        for (let i = 0; i < this.time.length; i++) {
          let temp = i + 1;
          let table = temp.toString();
          let timeNow =
            ("0" + d.getHours()).slice(-2) +
            "." +
            ("0" + d.getMinutes()).slice(-2);
          // console.log(timeNow, this.timev2[i]);
          // if (this.isInRange(timeNow, this.timev2[i])) {
            // console.log("w");
            // this.plotStatus = 1;
            if (this.table.find((x) => x.Time === table)) {
              console.log(table);
              if (this.table.find((x) => x.Time === table).Status === "1") {
                let temp = document.getElementById("table" + table);
                temp.classList.add("reserved");
                // console.log("plot1");
              } else if (
                this.table.find((x) => x.Time === table).Status === "0"
              ) {
                let temp = document.getElementById("table" + table);
                temp.classList.add("inProgress");
                // console.log("plot0");
              }
            } else {
              let temp = document.getElementById("table" + table);
              temp.classList.add("free");
            }
          // }
        }
      });
    },
  },
  mounted() {
    console.log(this.court);
    this.$store.state.courtDetail.time = null
    // console.log("mmmmmm"+this.listCourt);
    // this.API();
  },
};
</script>

<style scoped>
.reserved {
  background-color: #f44336;
  border-style: solid;
  border-width: 5px;
  border-color: #ebecf0;
}
.inProgress {
  background-color: #2196f3;
  border-style: solid;
  border-width: 5px;
  border-color: #ebecf0;
}
.free {
  background-color: #4caf50;
  border-style: solid;
  border-width: 5px;
  border-color: #ebecf0;
}
.none {
  background-color: #ebecf0;
  border-style: solid;
  border-width: 5px;
  border-color: #ebecf0;
}
</style>
