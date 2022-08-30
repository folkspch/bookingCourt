<template>
  <div>
    <v-col class="d-flex" cols="12" sm="6">
      <v-select
        label="กรุณาเลือกสนามที่ต้องการจอง"
        v-model="selectedCourt"
        :items="court"
        item-text="Name_th"
        item-value="Court_id"
        @change="plotTable()"
        solo
      ></v-select>
    </v-col>
    <v-simple-table v-if="this.selectedCourt" class="mb-5">
      <template v-slot:default>
        <thead>
          <tr>
            <th style="background-color: #bebebe">ช่วงเวลา</th>
            <th
              style="background-color: #ebecf0"
              v-for="(item, index) in OpsTime.ArrTime"
              :key="index"
              class="pa-3"
            >
              {{ item.TimeForShow }}
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
              v-for="index in countSlot"
              :key="index"
              :id="'table' + index"
            ></td>

            <!-- </div> -->
          </tr>
        </tbody>
      </template>
    </v-simple-table>
    <div v-if="selectedCourt != null">
      <v-divider class="pb-5"></v-divider>
      <v-col cols="3">
        <v-row>
          <v-select
            v-model="selectedTime"
            :items="OpsTime.ArrTime"
            item-text="TimeForShow"
            item-value="Time"
            solo
            label="กรุณาเลือกช่วงเวลาที่ต้องการจอง"
          >
          </v-select>
          <!-- {{ this.selectedTime }} -->
        </v-row>
      </v-col>
    </div>
    <v-divider class="pb-5"></v-divider>
    <div v-if="selectedTime != null">
      <v-row>
        <v-col cols="6">
          <v-card>
            <v-card-title>รายละเอียดการจอง</v-card-title>
            <v-row class="mx-0">
              <v-col cols="6">
                <v-card-text>
                  <p>
                    ชื่อสนาม :
                    {{ this.court[parseInt(this.selectedCourt) - 1].Name_th }}
                  </p>
                  <p>
                    ชนิดกีฬา :
                    {{ this.court[parseInt(this.selectedCourt) - 1].Type_th }}
                  </p>
                  <p>
                    ที่อยู่สนาม :
                    {{ this.court[parseInt(this.selectedCourt) - 1].Place_th }}
                  </p>
                  <p>
                    จำนวนผู้เล่นขั้นต่ำ :
                    {{
                      this.court[parseInt(this.selectedCourt) - 1]
                        .Description_th
                    }}
                  </p>
                  <p>
                    ช่วงเวลาที่ต้องการจอง :
                    {{ this.selectedTime[0] + " - " + this.selectedTime[1] }}
                  </p>
                </v-card-text>
              </v-col>
              <v-col cols="6">
                <v-img
                  :src="this.court[parseInt(this.selectedCourt) - 1].Img"
                  max-width="250"
                  class="my-auto mx-auto"
                ></v-img>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
        <v-col cols="6">
          <div v-if="this.selectedCourt&&this.selectedTime">
            <v-btn @click="setSelectedCourt()" large bottom right absolute color="success" width="10%" >ต่อไป</v-btn>
          </div>
        </v-col>
      </v-row>
    </div>
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
      selectedCourt: null,
      selectedTime: null,
      OpsTime: { OpenTime: null, CloseTime: null, ArrTime: [] },
      table: [],
      plotStatus: 0,
      countSlot: 0,
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
    setSelectedCourt(){
      let data = {
        courtName: this.court.find((e) => e.Court_id === this.selectedCourt).Name_th,
        time:this.selectedTime[0]+"-"+this.selectedTime[1]
      }
      this.$store.commit("setSelectedCourt",this.selectedCourt)
      this.$store.commit("setCourtDetail",data)
      this.$router.replace('/confirm_booking');
    },
    isInRange(value, range) {
      if (this.plotStatus == 1) {
        return true;
      } else {
        return value <= range[0];
      }
    },
    plotTable() {
      let d = new Date();
      let today =
        d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
      today = "2022-07-29";
      const options = {
        url: `http://localhost:4000/getBookingData/${today}/${this.selectedCourt}`,
        method: "GET",
      };
      var courtDetail = this.court[parseInt(this.selectedCourt) - 1];
      var OpsHour =
        parseInt(courtDetail.TimeClose.substring(0, 2)) -
        parseInt(courtDetail.TimeOpen.substring(0, 2));
      if (this.countSlot < OpsHour) {
        this.countSlot = OpsHour;
      }
      this.$axios(options).then((res) => {
        this.table = res.data.data;
        console.log(this.countSlot, "cntslot");
        console.log(this.table, "table");
        for (let i = 0; i < this.countSlot; i++) {
          let temp = i + 1;
          let table = temp.toString();
          let temp1 = document.getElementById("table" + table);
          temp1.classList.remove("reserved");
          temp1.classList.remove("inProgress");
          temp1.classList.remove("free");
        }
        for (let i = 0; i < this.OpsTime.ArrTime.length; i++) {
          var found = this.table.find(
            (e) => e.Time_Start === this.OpsTime.ArrTime[i].Time[0]
          );
          let temp = document.getElementById("table" + (i + 1));
          if (found) {
            console.log("Status", found.Status, "Time", found.Time_Start);
            if (found.Status == "0") {
              temp.classList.add("reserved");
            } else if (found.Status == "1") {
              temp.classList.add("inProgress");
            }
          } else {
            temp.classList.add("free");
          }
        }
        this.countSlot = OpsHour;
      });
      this.setOpTime();
    },
    setOpTime() {
      this.OpsTime.ArrTime = [];
      this.selectedTime = null;
      // const options = {
      //   url: `http://localhost:4000/getOpTime/${this.selectedCourt}`,
      //   method: "GET",
      // };
      // this.court[parseInt(this.selectedCourt)].TimeOpen
      // this.$axios(options).then((res) => {
      // var temp = res.data;
      this.OpsTime.OpenTime = parseInt(
        this.court[parseInt(this.selectedCourt) - 1].TimeOpen.substring(0, 2)
      );
      this.OpsTime.CloseTime = parseInt(
        this.court[parseInt(this.selectedCourt) - 1].TimeClose.substring(0, 2)
      );
      console.log("ggin", this.OpsTime.OpenTime, this.OpsTime.CloseTime);
      for (let i = this.OpsTime.OpenTime; i < this.OpsTime.CloseTime; i++) {
        var temp1 = i + ".00";
        var temp2 = i + 1 + ".00";
        this.OpsTime.ArrTime.push({
          Time: [temp1, temp2],
          TimeForShow: temp1 + " - " + temp2,
        });
      }
      console.log(this.OpsTime.ArrTime, "ArrTime");
      // console.log("Time ",this.OpsTime.OpenTime, this.OpsTime.CloseTime);
      // });
      // this.timeOpen = parseInt(this.timeOpen.substring(0, 2))
      // console.log("Time ",this.timeOpen,this.timeClose)
    },
  },
  mounted() {
    console.log(this.court);
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
  all: unset;
  /* background-color: #ebecf0;
  border-style: solid;
  border-width: 5px;
  border-color: #ebecf0; */
}
</style>
