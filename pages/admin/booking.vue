<template>
  <div>
    <v-row align="center" class="d-flex mb-3 mt-2">
      <v-col cols="12" lg="5">
        <v-select
          hide-details
          item-color="orange"
          label="กรุณาเลือกสนามที่ต้องการจอง"
          v-model="selectedCourt"
          :items="court"
          item-text="Name_th"
          item-value="Court_id"
          @change="plotTable()"
          solo
        ></v-select>
      </v-col>
    </v-row>
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
      <v-col cols="12">
        <v-row>
          <v-select
            item-color="orange"
            v-model="selectedTime"
            :items="timeChoice"
            item-text="TimeBefore"
            item-value="Time"
            solo
            label="กรุณาเลือกช่วงเวลาที่ต้องการจอง"
          >
          </v-select>
          <v-select
            item-color="orange"
            v-model="selectedTimeB"
            :items="timeChoice"
            item-text="TimeAfter"
            item-value="Time"
            solo
            label="กรุณาเลือกช่วงเวลาที่ต้องการจอง"
          >
          </v-select>
        </v-row>
      </v-col>
    </div>
    <v-divider class="pb-5"></v-divider>
    <div v-if="selectedTime != null && selectedTimeB != null">
      <v-row>
        <v-col cols="12" lg="6">
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
                    {{ this.court[parseInt(this.selectedCourt) - 1].Players }}
                    คน
                  </p>
                  <p>
                    ช่วงเวลาที่ต้องการจอง :
                    {{ this.selectedTime[0] + " - " + this.selectedTimeB[1] }}
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
        <v-col cols="12" lg="6">
          <div
            v-if="this.selectedCourt && this.selectedTime && this.selectedTimeB"
            class="d-flex justify-end"
          >
            <v-btn
              :absolute="!$vuetify.breakpoint.xsOnly"
              @click="setSelectedCourt()"
              large
              bottom
              right
              color="primary"
              width="10%"
              >ต่อไป</v-btn
            >
          </div>
        </v-col>
      </v-row>
    </div>
    <!-- <v-btn @click="filterTime()">GG</v-btn> -->
    <v-dialog v-model="dialog" persistent>
      <v-card>
        <v-card-title>ไม่พบรหัสเข้าร่วม</v-card-title>
        <v-card-text> โปรดตรวจสอบรหัสเข้าร่วมและลองอีกครั้ง </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" @click="dialog = false">ตกลง</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  async asyncData({ $axios }) {
    return await $axios
      .get("http://localhost:4000/getCourtData")
      .then((res) => {
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
      timeList: [
        // เข้าหน้าจอนี้แล้วให้ยิง api ไป query database find หา status ที่ยังไม่ได้ approve การจองทุกครั้ง เพื่อให้รู้ได้ว่ามี lobby เข้ามาใหม่หรือไม่
        // ตอนจองให้ส่งเมล์ไปที่ admin เพื่อเป็น notification ให้กับผู้ดูแล
        { time: "1" },
        { time: "2" },
        { time: "3" },
      ],
      listCourt: [],
      selectedCourt: null,
      selectedTimeRange: null,
      selectedTime: null,
      selectedTimeB: null,
      OpsTime: { OpenTime: null, CloseTime: null, ArrTime: [] },
      table: [],
      plotStatus: 0,
      countSlot: 0,
      timeChoice: [],
      invite_code: null,
      dialog: false,
    };
  },

  methods: {
    setSelectedCourt() {
      const timeBefore = parseFloat(this.selectedTime[0]);
      const timeAfter = parseFloat(this.selectedTimeB[1]);
      if (timeAfter >= timeBefore) {
        let data = this.court.find((e) => e.Court_id === this.selectedCourt);
        data.time = this.selectedTime[0] + "-" + this.selectedTimeB[1];
        this.$store.commit("setSelectedTime", this.selectedTime);
        this.$store.commit("setSelectedTimeB", this.selectedTimeB);
        this.$store.commit("setSelectedCourt", this.selectedCourt);
        this.$store.commit("setCourtDetail", data);
        console.log(this.$store.state.courtDetail);
        this.$router.replace("/confirm_booking");
      } else {
        alert("Error: TimeAfter cannot be less than or equal to TimeBefore");
      }
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
      today = "2024-03-23";
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
          if (this.table[0]?.is_available == 0) {
            console.log("asdasd");
            temp.classList.add("inProgress");
          }
          if (found) {
            // console.log("Status", found.Status, "Time", found.Time_Start);
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
         for (let i = 0; i < this.OpsTime.ArrTime.length; i++) {
          
          let temp = document.getElementById("table" + (i + 1));
          if (this.table[0]?.is_available == 0) {
            console.log("asdasd");
            temp.classList.add("inProgress");
          }
          
          
        }
        this.filterTime();
      });
      this.setOpTime();
    },
    setOpTime() {
      console.log("SET");
      this.OpsTime.ArrTime = [];
      this.selectedTime = null;
      this.selectedTimeB = null;
      this.OpsTime.OpenTime = parseInt(
        this.court[parseInt(this.selectedCourt) - 1].TimeOpen.substring(0, 2)
      );
      this.OpsTime.CloseTime = parseInt(
        this.court[parseInt(this.selectedCourt) - 1].TimeClose.substring(0, 2)
      );
      console.log("ggin", this.OpsTime.OpenTime, this.OpsTime.CloseTime);
      console.log("ggin", this.selectedTimeRange);

      for (let i = this.OpsTime.OpenTime; i < this.OpsTime.CloseTime; i += 1) {
        var temp1 = i + ".00";
        var temp2 = i + 1 + ".00";
        this.OpsTime.ArrTime.push({
          Time: [temp1, temp2],
          TimeForShow: temp1 + " a - " + temp2,
          TimeBefore: temp1,
          TimeAfter: temp2,
        });
      }

      console.log(this.OpsTime.ArrTime, "ArrTime");
    },
    filterTime() {
      this.timeChoice = [...this.OpsTime.ArrTime];
      let temp = [];
      for (let i = 0; i < this.table.length; i++) {
        temp.push(this.table[i].Time_Start);
      }
      let Timefilter = this.timeChoice.filter(function (e) {
        if (temp.indexOf(e.Time[0]) > -1) {
          return false;
        }
        return true;
      });
      this.timeChoice = [...Timefilter];
    },
    joinByCode() {
      if (this.invite_code && this.invite_code.length >= 6) {
        this.$axios
          .post("http://localhost:4000/joinFromCode", {
            code: this.invite_code,
          })
          .then((res) => {
            console.log("res", res);
            if (res.data.length != 0) {
              this.$router.push({
                name: "confirm_booking",
                params: {
                  code: res.data.code,
                  court: res.data.court,
                },
              });
            } else {
              this.dialog = true;
              return;
            }
          });
      }
    },
    async paste() {
      this.invite_code = await navigator.clipboard.readText();
    },
  },
  mounted() {
    console.log(this.court);
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
