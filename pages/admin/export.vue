<template>
  <div>
    <v-row align="center" class="d-flex mb-3 mt-2">
      <v-col cols="10" lg="">
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
      <div class="px-5">และ</div>
      <v-col cols="5" lg="">
        <v-row no-gutters class="d-flex">
          <v-col cols="" lg="">
            <v-select
              hide-details
              item-color="orange"
              label="เลือกระยะเวลาที่ต้องการจอง"
              v-model="selectedTimeA"
              :items="timeChoice"
              item-text="time"
              item-value="time"
              solo
              @change="updateTimeChoices"
            ></v-select>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="5" lg="">
        <v-row no-gutters class="d-flex">
          <v-col cols="" lg="">
            <v-select
              hide-details
              item-color="orange"
              label="เลือกระยะเวลาที่ต้องการจอง"
              v-model="selectedTimeB"
              :items="timeChoice.filter((item) => item.time >= selectedTimeA)"
              item-text="time"
              item-value="time"
              solo
            ></v-select>
          </v-col>
        </v-row>
      </v-col>
      <!-- Add two select fields for dates -->
      <v-col cols="5" lg="">
        <v-row no-gutters class="d-flex">
          <v-col cols="" lg="">
            <input type="date" v-model="selectedDateA" class="orange-input" />
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="5" lg="">
        <v-row no-gutters class="d-flex">
          <v-col cols="" lg="">
            <input type="date" v-model="selectedDateB" class="orange-input" />
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="4" lg="">
        <v-row no-gutters class="d-flex">
          <v-col cols="" lg="">
            <v-btn @click="getData()">Get Data</v-btn>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <!-- Add a button to trigger export -->
    <v-btn @click="exportData()">Export Data</v-btn>

    <!-- Display simple data -->
    <div v-if="items.length">
      <h2>Items</h2>
      <table class="items-table">
        <thead>
          <tr>
            <th>Stadium</th>
            <th>Time</th>
            <th>Count</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in items" :key="index">
            <td>{{ item.stadium }}</td>
            <td>{{ item.time }}</td>
            <td>{{ item.count }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Your existing template code -->
    <!-- ... -->
  </div>
</template>


<script>
import CourtDetail from "@/components/CourtDetail.vue";
import Timetable from "~/components/Timetable.vue";
export default {
  components: {
    CourtDetail,
    Timetable,
  },
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
      timeChoice: [],
      // Define the start and end time for the time range
      startTime: 9, // Start time: 09:00
      endTime: 18, // End time: 18:00
      selectedTimeA: "",
      selectedTimeB: "",
      dateChoices: [], // Define dateChoices array
      
      timeChoice: [
        { time: "09:00" },
        { time: "10:00" },
        { time: "11:00" },
        { time: "12:00" },
        { time: "13:00" },
        { time: "14:00" },
        { time: "15:00" },
        { time: "16:00" },
        { time: "17:00" },
        { time: "18:00" },
      ],
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
      OpsTime: { OpenTime: null, CloseTime: null, ArrTime: [] },
      table: [],
      plotStatus: 0,
      countSlot: 0,
      timeChoice: [],
      invite_code: null,
      dialog: false,
      // Modified data structure with name and time properties
      items: [
        { stadium: "BasketBall", time: "10:00-11:00", count: "5" },
        { stadium: "BasketBall", time: "09:00-10:00", count: "7" },
        { stadium: "Football", time: "10:00-11:00", count: "9" },
        { stadium: "Football", time: "13:00-14:00", count: "20" },
        { stadium: "Badminton", time: "14:00-15:00", count: "11" },
        { stadium: "Judo", time: "10:00-11:00", count: "5" },
        { stadium: "Futsal", time: "10:00-11:00", count: "5" },
        // Add more items as needed
      ],
      // Your existing data properties
      // ...
    };
  },
  methods: {
    // Method to export data in CSV format
    updateTimeChoices() {
      // Update the items available for selection in selectTimeB
      // based on the value selected in selectTimeA
      if (this.selectedTimeA) {
        this.selectedTimeB = null; // Reset the selected time in selectTimeB
      }
    },
    setTimeRange() {
      // Initialize an empty array to store the time options
      this.timeChoice = [];

      // Loop through the time range and add time options to the array
      for (let i = this.startTime; i < this.endTime; i++) {
        // Format the time as "HH:00"
        const hour = i < 10 ? `0${i}` : `${i}`;

        // Add the time options to the array
        this.timeChoice.push({ time: `${hour}:00` }); // e.g., "09:00"
      }
    },
    exportData() {
      // Convert data to CSV format
      const csvContent =
        "data:text/csv;charset=utf-8," +
        "Stadium,Time,Count\n" +
        this.items
          .map((item) => `${item.stadium},${item.time},${item.count}`)
          .join("\n");

      // Create a temporary anchor element
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "exported_data.csv");

      // Append the anchor to the body and click it programmatically to trigger download
      document.body.appendChild(link);
      link.click();

      // Cleanup
      document.body.removeChild(link);
    },
    getData() {
      console.log("assadsads");
      console.log(this.selectedTimeA);
      console.log(this.selectedTimeB);
      console.log(this.selectedDateA);
      console.log(this.selectedDateB);
      // query data ตาม field สนาม และ เวลา
    },
    setSelectedCourt() {
      let data = this.court.find((e) => e.Court_id === this.selectedCourt);
      data.time = this.selectedTime[0] + "-" + this.selectedTime[1];
      this.$store.commit("setSelectedTime", this.selectedTime);
      this.$store.commit("setSelectedCourt", this.selectedCourt);
      this.$store.commit("setCourtDetail", data);
      console.log(this.$store.state.courtDetail);
      this.$router.replace("/confirm_booking");
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
        this.filterTime();
      });
      this.setOpTime();
    },
    setOpTime() {
      console.log("SET");
      for (let i = this.OpsTime.OpenTime; i < this.OpsTime.CloseTime; i += 3) {
        var temp1 = i + ".00";
        var temp2 = i + 1 + ".00";
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
    // Your existing methods
    // ...
  },
  mounted() {
    console.log(this.court);
    this.setTimeRange();
  },
};
</script>

<style scoped>
/* CSS for the table */
.items-table {
  width: 100%;
  border-collapse: collapse;
}

.items-table th,
.items-table td {
  padding: 8px;
  border: 1px solid #ddd;
  text-align: left;
}

.items-table th {
  background-color: #f2f2f2;
  font-weight: bold;
}

.items-table tbody tr:nth-child(even) {
  background-color: #f2f2f2;
}
</style>
