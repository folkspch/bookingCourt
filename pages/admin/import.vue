<template>
  <div>
    <v-row>
      <v-col>
        <v-text-field
          v-model="dateTimeStart"
          label="Date Time Start"
          type="datetime-local"
          outlined
        ></v-text-field>
      </v-col>
      <v-col>
        <v-text-field
          v-model="dateTimeEnd"
          label="Date Time End"
          type="datetime-local"
          outlined
        ></v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" lg="5">
        <v-select
          hide-details
          item-color="orange"
          label="กรุณาเลือกสนามที่ต้องการจอง"
          v-model="selectedCourt"
          :items="court"
          item-text="Name_th"
          item-value="Court_id"
          solo
        ></v-select>
      </v-col>
    </v-row>
    <v-row>
      <v-col class="file-upload">
        <input type="file" color="primary" @change="handleFileUpload" />
      </v-col>
    </v-row>
    <v-row>
      <div class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th>วัน / เวลา</th>
              <th>08:00-09:00</th>
              <th>09:00-10:00</th>
              <th>10:00-11:00</th>
              <th>11:00-12:00</th>
              <th>12:00-13:00</th>
              <th>13:00-14:00</th>
              <th>14:00-15:00</th>
              <th>15:00-16:00</th>
              <th>16:00-17:00</th>
              <th>17:00-18:00</th>
              <th>18:00-19:00</th>
              <th>19:00-20:00</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row) in excelData" :key="row.id" class="data-row">
  <td><span>{{ row.days }}</span></td>
              <td><input v-model="row.data8to9" /></td>
              <td><input v-model="row.data9to10" /></td>
              <td><input v-model="row.data10to11" /></td>
              <td><input v-model="row.data11to12" /></td>
              <td><input v-model="row.data12to13" /></td>
              <td><input v-model="row.data13to14" /></td>
              <td><input v-model="row.data14to15" /></td>
              <td><input v-model="row.data15to16" /></td>
              <td><input v-model="row.data16to17" /></td>
              <td><input v-model="row.data17to18" /></td>
              <td><input v-model="row.data18to19" /></td>
              <td><input v-model="row.data19to20" /></td>
              <!-- <td><input v-model="row.code" /></td>
              <td><input v-model="row.day" /></td>
              <td><input v-model="row.timeStart" /></td>
              <td><input v-model="row.timeEnd" /></td> -->
            </tr>
          </tbody>
        </table>
      </div>
    </v-row>
    <v-row class="align-right">
      <v-btn @click="getLobbyList()" color="green" class="import-button">
        Import data
      </v-btn>
    </v-row>
  </div>
</template>


<script>
import * as XLSX from "xlsx";
import CourtDetail from "@/components/CourtDetail.vue";
import Timetable from "~/components/Timetable.vue";
export default {
  components: {
    CourtDetail,
    Timetable,
  }, async asyncData({ $axios }) {
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
      excelData: [],
      dateTimeStart: "",
      dateTimeEnd: "",
    };
  },
  methods: {
    
    handleFileUpload(event) {
  const file = event.target.files[0];
  const reader = new FileReader();
  reader.onload = (e) => {
    const data = new Uint8Array(e.target.result);
    const workbook = XLSX.read(data, { type: "array" });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
    console.log(jsonData);

    const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

    const groupedList = jsonData
      .slice(1) // Skip header row
      .filter(row => row.some(cell => cell !== undefined && cell !== null && cell !== "")) // Filter out empty rows
      .map((row, id) => {
        const dayOfWeek = daysOfWeek[id % daysOfWeek.length]; // Map each row to a day of the week based on the order

        // Group consecutive identical values
        const groupedData = this.groupData(row);
        console.log("groupedData",groupedData);
        
        return {
          id,
          days: dayOfWeek,
          groupedData,
        };
      });

    this.excelData = groupedList; // Update the excelData with the grouped list
    console.log("Grouped Data", this.excelData);
  };
  reader.readAsArrayBuffer(file);
},

groupData(row) {
  const groupedData = [];
  let currentGroup = { timeRange: '08:00-09:00', value: row[1] };
  const timeSlots = [
    '08:00-09:00', '09:00-10:00', '10:00-11:00', '11:00-12:00',
    '12:00-13:00', '13:00-14:00', '14:00-15:00', '15:00-16:00',
    '16:00-17:00', '17:00-18:00', '18:00-19:00', '19:00-20:00'
  ];

  for (let i = 1; i <= 12; i++) {
    const currentValue = row[i];

    if (currentValue === currentGroup.value) {
      // Extend the current group time range
      currentGroup.timeRange = `${currentGroup.timeRange.split('-')[0]}-${timeSlots[i].split('-')[1]}`;
    } else {
      // Save the current group and start a new one
      groupedData.push({ ...currentGroup });
      currentGroup = { timeRange: timeSlots[i], value: currentValue };
    }
  }

  // Push the last group
  groupedData.push({ ...currentGroup });

  return groupedData;

},
    formatTime(time) {
      if (typeof time === "number") {
        const totalMinutes = Math.round(time * 24 * 60);
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
          2,
          "0"
        )}`;
      }
      return time;
    },
    addRow() {
      this.excelData.push({
        id: this.excelData.length,
        stadium: '',
        section: '',
        code: '',
        day: '',
        timeStart: '',
        timeEnd: ''
      });
    },
    deleteRow(index) {
      this.excelData.splice(index, 1);
    },
    getLobbyList() {
      this.dataBooking = [...this.excelData];
      console.log("<--", this.dataBooking);
      console.log("--> Stadium:", this.dataBooking[0]?.stadium || "N/A");
      console.log("--> Day:", this.dataBooking[0]?.day || "N/A");
      console.log("--> Time Start:", this.dataBooking[0]?.timeStart || "N/A");
    },
    
  },
};
</script>
<style scoped>
.table-responsive {
  width: 100%;
  overflow-x: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table th,
.data-table td {
  padding: 8px;
  border: 1px solid #ddd;
  text-align: left;
  white-space: nowrap;
}

.data-table th {
  background-color: #f2f2f2;
  font-weight: bold;
}

.data-table td input {
  width: 100%;
  box-sizing: border-box;
  padding: 6px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.data-table tbody tr:nth-child(even) {
  background-color: #f2f2f2;
}

.align-right {
  display: flex;
  justify-content: flex-end;
}

.add-button {
  margin-right: 10px;
}
</style>
