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
              label="เลือกระยะเวลาเริ่ม"
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
              label="เลือกระยะเวลาสิ้นสุด"
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
    </v-row>
    <v-row>
      <v-col cols="6" lg="">
        <v-row no-gutters class="d-flex">
          <v-col cols="" lg="">
            <input
              type="input"
              v-model="courtCode"
              placeholder="กรอกรหัสห้องที่ต้องการ"
              class="orange-input"
            />
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="6" lg="">
        <v-row no-gutters class="d-flex">
          <v-col cols="" lg="">
            <input type="date" v-model="selectedDateA" class="orange-input" />
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="6" lg="">
        <v-row no-gutters class="d-flex">
          <v-col cols="" lg="">
            <input type="date" v-model="selectedDateB" class="orange-input" />
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="6" lg="">
        <v-row no-gutters class="d-flex">
          <v-col cols="" lg="">
            <v-btn @click="getData()">Get Data</v-btn>
          </v-col>
           <v-col cols="" lg="">
            <v-btn @click="clearData()">Clear Data</v-btn>
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <!-- Report Style for One Lobby -->

    <v-simple-table class="mb-5 custom-table">
      <template v-slot:default>
        <thead>
          <tr>
            <th class="header-cell">สนาม</th>
            <th class="header-cell">รหัสการจอง</th>
            <th class="header-cell">ชื่อผู้จอง</th>
            <th class="header-cell">วันที่จอง</th>
            <th class="header-cell">ช่วงเวลาที่จอง</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(item, index) in lobbyList"
            :key="index"
            class="body-row"
            @click="logLobbyId(item.idLobby)"
          >
            <td class="body-cell">
              <v-row>
                <p class="ml-2">{{ item.stadium }}</p>
              </v-row>
            </td>
            <td class="body-cell">
              <v-row>
                <p class="ml-2">{{ item.codeCourt }}</p>
              </v-row>
            </td>
            <td class="body-cell">
              <v-row>
                <p class="ml-2">{{ item.name }}</p>
              </v-row>
            </td>
            <td class="body-cell">
              <v-row>
                <p class="ml-2">{{ item.dateReserve }}</p>
              </v-row>
            </td>
            <td class="body-cell">
              <v-row>
                <p class="ml-2">{{ item.time }}</p>
              </v-row>
            </td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>
    <!-- Button to export data -->
    <!-- Log Lobby Modal -->
    <div class="modal" v-if="showLogModal">
      <div class="modal-background" @click="closeLogModal"></div>
      <div class="modal-content large-modal">
        <!-- Add the close button -->
        <span class="close" @click="closeLogModal">&times;</span>

        <h2>ข้อมูลการจอง</h2>
        <v-row>
          <v-col cols="4">
            <strong>รหัสการจอง :</strong>
          </v-col>
          <v-col cols="8">
            {{ selectedLobbyId }}
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="4">
            <strong>สนาม :</strong>
          </v-col>
          <v-col cols="8">
            {{
              filteredJoinList.length > 0 ? filteredJoinList[0].court : "N/A"
            }}
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="4">
            <strong>ช่วงเวลา :</strong>
          </v-col>
          <v-col cols="8">
            {{ filteredJoinList.length > 0 ? filteredJoinList[0].time : "N/A" }}
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="4">
            <strong>วันที่จอง :</strong>
          </v-col>
          <v-col cols="8">
            {{
              filteredJoinList.length > 0
                ? filteredJoinList[0].dateReserve
                : "N/A"
            }}
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="4">
            <strong>สมาชิก :</strong>
          </v-col>
          <v-col cols="8">
            <ul>
              <li v-for="(item, index) in filteredJoinList" :key="index">
                {{ item.name }} - {{ item.id }}
              </li>
            </ul>
          </v-col>
        </v-row>
        <v-btn @click="exportPDF()" class="export-button"> Export DATA </v-btn>
      </div>
    </div>
  </div>
</template>

<script>
import CourtDetail from "@/components/CourtDetail.vue";
import Timetable from "~/components/Timetable.vue";
import jsPDF from "jspdf";
import "jspdf-autotable"; // import { THSarabun } from "/assets/fonts/THSarabun.js";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

import { THSarabun } from "../../assets/fonts/THSarabun.js";
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
      showLogModal: false, // For showing log modal

      // Define the start and end time for the time range
      startTime: 9, // Start time: 09:00
      endTime: 18, // End time: 18:00
      selectedTimeA: "",
      selectedTimeB: "",
      courtCode: "",
      dateChoices: [], // Define dateChoices array
      lobbyList: [
        // {
        //   stadium: "สนามบาสเก็ตบอล",
        //   name: "ณพล ศรีสุวรรณ",
        //   time: "09:00 - 10:00",
        //   idLobby: "a001",
        // },
        // {
        //   stadium: "สนามวอลเลบอล",
        //   name: "เดช เดชาบูรพา",
        //   time: "11:00 - 12:00",
        //   idLobby: "a002",
        // },
        // {
        //   stadium: "สนามฟุตซอล",
        //   name: "ศุภชัย พีระชัยรัตน์",
        //   time: "15:00 - 16:00",
        //   idLobby: "a003",
        // },
        // {
        //   stadium: "สนามแบตมินตัน",
        //   name: "เอก ยิ่งเจริญ",
        //   time: "14:00 - 15:00",
        //   idLobby: "a004",
        // },
      ],
      joinList: [
        // {
        //   id: "1",
        //   court: "02",
        //   name: "ณพล ศรีสุวรรณ",
        //   idLobby: "ASD123",
        //   time: "09:00 - 10:00",
        // },
        // {
        //   id: "2",
        //   court: "02",
        //   name: "เดช เดชาบูรพา",
        //   idLobby: "ASD123",
        //   time: "11:00 - 12:00",
        // },
        // {
        //   id: "3",
        //   court: "02",
        //   name: "ศุภชัย พีระชัยรัตน์",
        //   idLobby: "ASD123",
        //   time: "15:00 - 16:00",
        // },
        // {
        //   id: "4",
        //   court: "02",
        //   name: "เอก ยิ่งเจริญ",
        //   idLobby: "ASD123",
        //   time: "14:00 - 15:00",
        // },
      ],
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
      selectedDateB: null,
      selectedDateA: null,
      // Modified data structure with name and time properties
      items: [
        {
          lobby_id: "L001",
          time_start: "09:00",
          time_end: "10:00",
          day_start: "2024-01-16",
          host_name: "John Doe",
          players: [
            { name: "Player 1" },
            { name: "Player 2" },
            { name: "Player 3" },
          ],
        },
        // Add more items as necessary
      ],

      // Your existing data properties
      // ...
    };
  },
  methods: {
    // Method to export data in CSV format
    closeLogModal() {
      this.showLogModal = false; // Close the log modal
    },
    updateTimeChoices() {
      // Update the items available for selection in selectTimeB
      // based on the value selected in selectTimeA
      if (this.selectedTimeA) {
        this.selectedTimeB = null; // Reset the selected time in selectTimeB
      }
    },
    logLobbyId(idLobby) {
      console.log("Clicked idLobby:", idLobby);
      this.selectedLobbyId = idLobby; // Store the clicked lobby ID

      // Set up the request options with query params
      const options = {
        url: `http://localhost:4000/admin/getDetailHistory`,
        method: "GET",
        params: {
          court_id: this.selectedLobbyId, // Pass the selectedLobbyId as court_id param
        },
      };

      // Make the Axios GET request
      this.$axios(options)
        .then((res) => {
          // Store all data received from the API and format dateReserve
          this.joinList = res.data.data.map((item) => {
            // Check if dateReserve exists and split it by 'T'
            const dateReserveFormatted = item.dateReserve
              ? item.dateReserve.split("T")[0]
              : null;
            console.log("this.joinList", this.joinList);
            return {
              ...item, // Keep all existing properties
              dateReserve: dateReserveFormatted, // Override the dateReserve with the formatted value
            };
          });

          console.log(this.joinList);
          console.log("API connected");

          // Filter the joinList based on the selected lobby ID
          this.filteredJoinList = this.joinList.filter(
            (item) => item.idLobby === idLobby
          );

          // Show the log modal
          this.showLogModal = true;
        })
        .catch((error) => {
          console.error("API Error: ", error);
        });
    },
    closeLogModal() {
      this.showLogModal = false; // Close the log modal
    },
    API() {
      const options = {
        url: `http://localhost:4000/admin/getBookingHistory`,
        method: "GET",
      };
      this.$axios(options).then((res) => {
        // Store all data
        this.lobbyList = res.data.data.map((item) => {
          return {
            ...item,
            dateReserve: item.dateReserve?.split("T")[0], // Adjust the dateReserve field
          };
        });

        console.log(this.lobbyList);
        console.log("API connected");
      });
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
      // Convert data to CSV format with UTF-8 BOM for proper encoding
      const csvContent =
        "\uFEFF" + // UTF-8 BOM for handling non-ASCII characters (like Thai)
        "Stadium,Time,Count\n" +
        this.items
          .map((item) => `${item.stadium},${item.time},${item.count}`)
          .join("\n");

      // Create a temporary anchor element
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "exported_data.csv");

      // Append the anchor to the body and click it programmatically to trigger download
      document.body.appendChild(link);
      link.click();

      // Cleanup
      document.body.removeChild(link);
      URL.revokeObjectURL(url); // Release the object URL
    },
    clearData(){
      this.selectedCourt = '',
        this.selectedTimeA = '',
         this.selectedTimeB = '',
         this.selectedDateA = '', // If only one date is provided, set the other as null
         this.selectedDateB = '',
         this.courtCode = ''
    },
    getData() {
      console.log("assadsads");
      console.log(this.selectedTimeA);
      console.log(this.selectedTimeB);
      console.log(this.selectedDateA);
      console.log(this.selectedDateB);

      // Prepare query parameters for court_id, start_date, and end_date
      const params = {
        court_id: this.selectedCourt || null,
        time_start: this.selectedTimeA || null,
        time_end: this.selectedTimeB || null,
        start_date: this.selectedDateA || null, // If only one date is provided, set the other as null
        end_date: this.selectedDateB || null,
        court_code: this.courtCode || null,
      };
      console.log("asdsad", params);

      // Send a GET request to the backend with the query parameters
      this.$axios
        .get("http://localhost:4000/admin/getBookingHistory", { params })
        .then((response) => {
          // Check if data was returned
          if (response.data.data && response.data.data.length > 0) {
            // Update the items with the received data
            this.items = response.data.data;
            this.lobbyList = response.data.data; // Make sure lobbyList gets updated for the table
          } else {
            // If no data is returned, make sure the items array is cleared
            this.items = [];
            this.lobbyList = []; // Clear the table when no data is returned
            console.log("No data returned, table cleared.");
          }
          console.log("Received data:", response);
        })
        .catch((error) => {
          // Handle any error by clearing the items array and logging the error
          this.items = [];
          this.lobbyList = []; // Clear the table in case of an error
          console.error("Error fetching data:", error);
        });
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
    exportPDF() {
      if (!this.selectedLobbyId || this.filteredJoinList.length === 0) {
        alert("No lobby selected or no data available for export.");
        return;
      }

      const doc = new jsPDF();

      // Use a built-in font for testing
      doc.setFont("helvetica"); // Set default font
      doc.setFontSize(18);
      doc.text(`Report Booking Lobby : ${this.selectedLobbyId}`, 20, 20);

      // Get the selected lobby details
      const lobbyDetails = this.filteredJoinList[0];

      // Add lobby details
      doc.setFontSize(12);
      doc.text(`Lobby ID: ${this.selectedLobbyId}`, 20, 40);
      doc.text(`Stadium: ${lobbyDetails.court_en || "N/A"}`, 20, 50);
      doc.text(`Booking Host: ${lobbyDetails.name || "N/A"}`, 20, 60);
      doc.text(`Date Reserved: ${lobbyDetails.dateReserve || "N/A"}`, 20, 70);
      doc.text(`Time: ${lobbyDetails.time || "N/A"}`, 20, 80);

      // Add player names in bulleted format
      let yOffset = 90; // Set the starting Y position for the list
      doc.text("Players:", 20, yOffset); // Add "Players:" title

      this.filteredJoinList.forEach((item, index) => {
        yOffset += 10; // Move down by 10 units for each player
        doc.text(`- ${item.name || "N/A"}`, 30, yOffset); // Add bullet and player name
      });

      // Save the PDF
      doc.save(`${this.selectedLobbyId}_booking_report.pdf`);
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
    this.API();
  },
};
</script>

<style scoped>
/* Styling for the entire table */
.custom-table {
  width: 100%;
  border-collapse: collapse; /* Removes gaps between table cells */
  margin-bottom: 20px; /* Adds space below the table */
}

/* Styling for the header row */
.header-cell {
  background-color: #455a64; /* Dark blue-gray background for header */
  color: #ffffff; /* White text color */
  padding: 10px; /* Adds padding inside the header cells */
  text-align: center; /* Centers the text */
  font-weight: bold; /* Makes header text bold */
}

/* Styling for the table rows */
.body-row:nth-child(even) {
  background-color: #f1f8e9; /* Light green for even rows */
}

.body-row:nth-child(odd) {
  background-color: #ffffff; /* White for odd rows */
}

.body-cell {
  padding: 10px; /* Adds padding inside the body cells */
  text-align: center; /* Centers the text */
  color: #37474f; /* Dark gray-blue text for body cells */
}

/* Styling for action buttons inside the table */
.action-cell {
  padding: 5px; /* Adds space around the buttons */
}

/* Confirm button styling */
.confirm-button {
  background-color: #66bb6a !important; /* Soft green background */
  color: #ffffff !important; /* White text */
  border-radius: 4px; /* Slightly rounded corners */
  padding: 5px 10px; /* Adds padding inside the button */
  cursor: pointer; /* Adds pointer cursor on hover */
}

/* Cancel button styling */
.cancel-button {
  background-color: #ef5350 !important; /* Soft red background */
  color: #ffffff !important; /* White text */
  border-radius: 4px; /* Slightly rounded corners */
  padding: 5px 10px; /* Adds padding inside the button */
  cursor: pointer; /* Adds pointer cursor on hover */
}
.items-table {
  width: 100%;
  border-collapse: collapse;
  background-color: #f9fafb; /* Soft off-white background */
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #e0e0e0; /* Light grey border for the entire table */
}

.items-table th,
.items-table td {
  padding: 12px 15px;
  border: 1px solid #e0e0e0; /* Light grey border for cells */
  text-align: left;
}

.items-table th {
  background-color: #eceff1; /* Light grey-blue for the header */
  font-weight: bold;
  text-transform: uppercase;
  color: #37474f; /* Darker grey-blue text for contrast */
}

.items-table tbody tr:nth-child(even) {
  background-color: #f1f8e9; /* Very light green for even rows */
}

.items-table tbody tr:nth-child(odd) {
  background-color: #ffffff; /* White for odd rows */
}

/* Styling for the export button */

/* Input fields styling */
.orange-input {
  width: 100%;
  padding: 10px;
  border: 1px solid #e0e0e0; /* Light grey border */
  border-radius: 4px;
}

.orange-input:focus {
  border-color: #90caf9; /* Soft blue on focus for consistency */
  outline: none;
}

/* Select fields styling */
.v-select .v-input__control {
  border-color: #e0e0e0; /* Light grey border */
}

.v-select .v-input__control:focus-within {
  border-color: #90caf9 !important; /* Soft blue on focus */
}

/* General styling */
.v-row {
  margin-bottom: 10px;
}

h2 {
  font-size: 1.5em;
  color: #37474f; /* Dark grey-blue text */
  margin-bottom: 15px;
}

/* Button styling */
.v-btn {
  background-color: #90caf9; /* Soft blue */
  color: #11ff00;
  text-transform: uppercase;
  padding: 8px 16px;
  border-radius: 4px;
}
/* Basic modal styling */
.modal {
  position: fixed; /* Makes the modal appear fixed on the screen */
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex; /* Centers the modal content */
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5); /* Dark background with transparency */
}

/* Modal content styling */
.modal-content {
  background-color: #ffffff; /* White background */
  padding: 30px; /* Adds space inside the modal */
  border-radius: 8px; /* Rounded corners */
  width: 600px; /* Set a fixed width */
  max-width: 90%; /* Makes sure the modal doesn't go wider than 90% of the screen */
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); /* Adds a subtle shadow */
}

/* Close button styling for modals */
.close {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 24px;
  cursor: pointer;
  color: #d32f2f;
}

/* Modal background and content styling remains unchanged */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
}

.modal-content {
  position: relative;
  background-color: #ffffff;
  padding: 30px;
  border-radius: 8px;
  width: 600px;
  max-width: 90%;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

/* Styling for buttons inside the modal */
.modal-actions v-btn {
  width: 70px; /* Fixed width for buttons */
  height: 40px; /* Fixed height for buttons */
  margin-top: 10px; /* Adds space between the content and buttons */
}

/* Text area for cancel reason input */
.cancel-reason-input {
  width: 100%; /* Full width of the parent container */
  height: 100px; /* Set a fixed height */
  margin-top: 10px; /* Adds space above */
  padding: 10px; /* Adds padding inside the text area */
  border: 1px solid #ddd; /* Light gray border */
  border-radius: 4px; /* Rounded corners */
  resize: none; /* Prevents resizing */
}
.close {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 24px;
  cursor: pointer;
  color: #d32f2f;
}
</style>
