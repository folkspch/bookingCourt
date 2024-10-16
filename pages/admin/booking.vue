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

            <td v-for="index in 10" :key="index" :id="'table' + index"></td>

            <!-- </div> -->
          </tr>
        </tbody>
      </template>
    </v-simple-table>
    <div v-if="selectedCourt != null">
      <v-divider class="pb-5"></v-divider>
      <v-col cols="12" lg="3">
        <v-row>
          <v-select
            item-color="orange"
            v-model="selectedTime"
            :items="timeChoice"
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
      </v-row>
      <v-row>
        <v-col cols="8">
          <v-col cols="4">
            <strong>สาเหตุการจอง :</strong>
          </v-col>
          <v-col cols="8">
            <v-text-field
              label="ระบุสาเหตุ"
              v-model="remarkBooking"
              outlined
            ></v-text-field>
          </v-col>
        </v-col>
        <v-col cols="12" lg="6">
          <div
            v-if="this.selectedCourt && this.selectedTime"
            class="d-flex justify-end"
          >
            <v-btn
              :absolute="!$vuetify.breakpoint.xsOnly"
              :loading="this.loading"
              @click="showConfirmModal()"
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
    <v-dialog
      v-model="confirmDialog"
      persistent
      max-width="1400"
      class="custom-dialog"
    >
      <v-card>
        <v-card-title class="headline">ยืนยันการจอง</v-card-title>
        <v-card-text>
          คุณต้องการจองสนาม <strong>{{ this.court_name }}</strong>
        </v-card-text>
        <v-card-text>
          ในช่วงเวลา
          <strong>{{ this.time_start + " - " + this.time_end }}</strong>
        </v-card-text>
        <v-card-text>
          สาเหตุการณ์จอง <strong>{{ this.remark_modal }}</strong>
        </v-card-text>
        <v-card-text> ใช่หรือไม่? </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green" text @click="confirmBooking">ยืนยัน</v-btn>
          <v-btn color="red" text @click="confirmDialog = false">ยกเลิก</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
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
      listCourt: [],
      time_start: null,
      remarkBooking: "",
      time_end: null,
      selectedCourt: null,
      selectedTime: null,
      confirmDialog: false,
      courtDetails: {},

      OpsTime: { OpenTime: null, CloseTime: null, ArrTime: [] },
      table: [],
      plotStatus: 0,
      countSlot: 0,
      timeChoice: [],
      invite_code: null,
      dialog: false,
      loading: false,
    };
  },

  methods: {
    showConfirmModal() {
      const courtDetail = this.court.find(
        (e) => e.Court_id === this.selectedCourt
      );
      this.courtDetails = courtDetail;
      this.confirmDialog = true;
      this.time_start = this.selectedTime[0];
      this.time_end = this.selectedTime[1];
      this.court_name = this.court[parseInt(this.selectedCourt) - 1].Name_th;
      this.remark_modal = this.remarkBooking;
      console.log("dfhgfh,", this.selectedTime[0]);
      console.log("sdfgdgf", this.selectedTime[1]);
      console.log(
        "sdfgdgf",
        this.court[parseInt(this.selectedCourt) - 1].Name_th
      );
    },
    confirmBooking() {
  console.log("asd");
  
      const d = new Date();
      const daysOfWeek = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ];
      const currentDay = daysOfWeek[d.getDay()];
      const currentDate = d.toISOString().split("T")[0]; // Format: YYYY-MM-DD

      let body = {
        day: currentDay, // Today’s day, e.g., "Monday"
        court: this.selectedCourt, // Selected court
        time_start: this.selectedTime[0], // Start time
        time_end: this.selectedTime[1], // End time
        description: this.remark_modal, // Booking reason/remark
        date_start: currentDate, // Today’s date in YYYY-MM-DD
        date_end: currentDate, // Same as date_start
      };

      if (body.court && body.time_start && body.time_end) {
        this.$axios
          .post("http://localhost:4000/admin/booking-admin", body)
          .then((res) => {
            console.log("Booking successful:", res.data);

        // Stop loading and navigate to /admin/booking
        this.loading = false;
        this.$router.push("/admin/stadium");
          })
          .catch((error) => {
            this.loading = false;
            console.error("Error occurred:", error);
          });
      } else {
        this.loading = false;
        console.error("Error: Missing required fields");
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
      let today = `${d.getFullYear()}-${(d.getMonth() + 1)
        .toString()
        .padStart(2, "0")}-${d.getDate().toString().padStart(2, "0")}`;

      console.log("Today's Date:", today);

      const options = {
        url: `http://localhost:4000/getBookingData/${today}/${this.selectedCourt}`,
        method: "GET",
      };

      // Get court details
      const courtDetail = this.court.find(
        (e) => e.Court_id === this.selectedCourt
      );
      const OpsHour =
        parseInt(courtDetail.TimeClose.substring(0, 2)) -
        parseInt(courtDetail.TimeOpen.substring(0, 2));

      // Adjust the slot count if needed
      this.countSlot = Math.max(this.countSlot, OpsHour);

      // Fetch booking data
      this.$axios(options).then((res) => {
        this.table = res.data.data;
        console.log("Total Slots:", this.countSlot);
        console.log("Booking Data:", this.table);

        // Reset all slot statuses
        console.log("this.countSlot", this.countSlot);

        for (let i = 0; i < 10; i++) {
          const slot = document.getElementById(`table${i + 1}`);
          slot.classList.remove("reserved", "pending", "free");
          slot.classList.add("free");
        }

        // Update slot statuses based on booking data
        for (let out = 0; out < this.table.length; out++) {
          for (let i = 0; i < this.OpsTime.ArrTime.length; i++) {
            const timeSlot = this.OpsTime.ArrTime[i].Time[0];
            console.log("this.table[i].Time_Start", this.table[i]?.Time_Start);
            console.log("this.table[i].timeSlot", timeSlot);
            const slotElement = document.getElementById(`table${i + 1}`);
            if (this.table[out]?.Time_Start === timeSlot) {
              console.log("asdsad", this.table[i]);
              if (this.table[out]?.Status === "reserved") {
                slotElement.classList.remove("reserved", "pending", "free");
                slotElement.classList.add("reserved");
              } else if (this.table[out]?.Status === "pending") {
                console.log("some data");
                slotElement.classList.remove("reserved", "pending", "free");
                slotElement.classList.add("pending");
              } else {
                slotElement.classList.remove("reserved", "pending", "free");

                slotElement.classList.add("free");
              }
            } else {
              slotElement.classList.remove("reserved", "pending", "free");

              slotElement.classList.add("free");
            }
          }
        }

        this.filterTime();
      });
      const daysOfWeek = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ];

      let currentDay = daysOfWeek[d.getDay()];
      const options2 = {
        url: `http://localhost:4000/admin/getBookingDataAdmin/${currentDay}/${this.selectedCourt}`,
        method: "GET",
      };
      this.$axios(options2).then((res) => {
        this.table = res.data.data;
        console.log("res.data :", res.data.data);
        console.log("Total Slots:", this.countSlot);
        console.log("Booking Data:", this.table);

        // Reset all slot statuses
        for (let i = 0; i < 10; i++) {
          const slot = document.getElementById(`table${i + 1}`);
        }

        // Update slot statuses based on booking data
        for (let out = 0; out < this.table.length; out++) {
          for (let i = 0; i < this.OpsTime.ArrTime.length; i++) {
            const timeSlot = this.OpsTime.ArrTime[i].Time[0];
            console.log("this.table[i].Time_Start2", this.table[i]);
            console.log(
              "this.table[i].Time_Start2aas",
              this.table[i]?.time_start
            );
            console.log("this.table[i].timeSlot2", timeSlot);
            const slot = document.getElementById(`table${i + 1}`);
            if (this.table[out]?.time_start === timeSlot) {
              console.log("asfdrkgjfn");
              slot.classList.remove("reserved", "pending", "free");

              slot.classList.add("reserved");
            } else {
            }
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
      this.OpsTime.OpenTime = parseInt(
        this.court[parseInt(this.selectedCourt) - 1].TimeOpen.substring(0, 2)
      );
      this.OpsTime.CloseTime = parseInt(
        this.court[parseInt(this.selectedCourt) - 1].TimeClose.substring(0, 2)
      );
      console.log("ggin", this.OpsTime.OpenTime, this.OpsTime.CloseTime);
      for (let i = 9; i < 19; i++) {
        var temp1 = i + ":00";
        var temp2 = i + 1 + ":00";
        this.OpsTime.ArrTime.push({
          Time: [temp1, temp2],
          TimeForShow: temp1 + " - " + temp2,
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
.pending {
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
.custom-dialog {
  width: 90% !important; /* Occupy 90% of the screen width */
  max-height: 90vh !important; /* Use 90% of the viewport height */
  overflow-y: auto; /* Allow scrolling if the content exceeds the height */
}

.v-card {
  padding: 32px; /* Add more padding for better spacing */
  height: 100%; /* Ensure the card fills the dialog */
}

.v-card-title {
  font-size: 32px;
  font-weight: bold;
}

.v-card-text {
  font-size: 20px;
  margin-bottom: 24px;
}
.none {
  all: unset;
  /* background-color: #ebecf0;
  border-style: solid;
  border-width: 5px;
  border-color: #ebecf0; */
}
</style>
