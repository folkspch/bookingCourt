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
      dataGroup : "",
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

    // Convert Excel data to the format you need
    const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

    const rawData = jsonData.slice(1)
      .filter(row => row.some(cell => cell !== undefined && cell !== null && cell !== "")) // Filter out empty rows
      .map((row, id) => {
        return {
          id,
          days: daysOfWeek[id % daysOfWeek.length],
          data8to9: row[1] || "a11",
          data9to10: row[2] || "a11",
          data10to11: row[3] || "a11",
          data11to12: row[4] || "a11",
          data12to13: row[5] || "a11",
          data13to14: row[6] || "a11",
          data14to15: row[7] || "a11",
          data15to16: row[8] || "a11",
          data16to17: row[9] || "a11",
          data17to18: row[10] || "a11",
          data18to19: row[11] || "a11",
          data19to20: row[12] || "a11",
        };
      });

    // Now group the data by day using the previously defined function
    
    this.dataGroup = this.groupDataByDay(rawData);
    this.excelData = jsonData
      .slice(1) // Skip header row
      .filter(row => row.some(cell => cell !== undefined && cell !== null && cell !== "")) // Filter out empty rows
      .map((row, id) => {
        const dayOfWeek = daysOfWeek[id % daysOfWeek.length]; // Map each row to a day of the week based on the order

        return {
          id,
          days: dayOfWeek,   // Assign the day of the week based on the row order
          data8to9: row[1] || "a11",
          data9to10: row[2] || "a11",
          data10to11: row[3] || "a11",
          data11to12: row[4] || "a11",
          data12to13: row[5] || "a11",
          data13to14: row[6] || "a11",
          data14to15: row[7] || "a11",
          data15to16: row[8] || "a11",
          data16to17: row[9] || "a11",
          data17to18: row[10] || "a11",
          data18to19: row[11] || "a11",
          data19to20: row[12] || "a11",
        };
      });
        console.log("Grouped Data:", JSON.stringify(this.dataGroup, null, 2));
  };
  reader.readAsArrayBuffer(file);
},

groupDataByDay(dataArray) {
  return dataArray.map(dayData => {
    const timeSlots = [
      { key: 'data8to9', label: '08:00-09:00' },
      { key: 'data9to10', label: '09:00-10:00' },
      { key: 'data10to11', label: '10:00-11:00' },
      { key: 'data11to12', label: '11:00-12:00' },
      { key: 'data12to13', label: '12:00-13:00' },
      { key: 'data13to14', label: '13:00-14:00' },
      { key: 'data14to15', label: '14:00-15:00' },
      { key: 'data15to16', label: '15:00-16:00' },
      { key: 'data16to17', label: '16:00-17:00' },
      { key: 'data17to18', label: '17:00-18:00' },
      { key: 'data18to19', label: '18:00-19:00' },
      { key: 'data19to20', label: '19:00-20:00' }
    ];

    const groupedData = [];
    let currentGroup = { timeRange: timeSlots[0].label, value: dayData[timeSlots[0].key] };
    let startTimeIndex = 0;

    for (let i = 1; i < timeSlots.length; i++) {
      const currentValue = dayData[timeSlots[i].key];

      if (currentValue === currentGroup.value) {
        // Extend the current group time range
        currentGroup.timeRange = `${timeSlots[startTimeIndex].label.split('-')[0]}-${timeSlots[i].label.split('-')[1]}`;
      } else {
        // Push the current group and start a new one
        groupedData.push({ ...currentGroup });
        startTimeIndex = i;
        currentGroup = { timeRange: timeSlots[i].label, value: currentValue };
      }
    }

    // Push the last group
    groupedData.push({ ...currentGroup });

    return {
      id: dayData.id,
      days: dayData.days,
      groupedData: groupedData
    };
  });
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
      console.log("Grouped Data:", JSON.stringify(this.dataGroup, null, 2));
      
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
