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
      <v-col class="file-upload">
        <input type="file" color="primary" @change="handleFileUpload" />
      </v-col>
    </v-row>
    <v-row>
      <div class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th>Stadium</th>
              <th>Section</th>
              <th>Code</th>
              <th>Day</th>
              <th>Time Start</th>
              <th>Time End</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in excelData" :key="row.id" class="data-row">
              <td><input v-model="row.stadium" /></td>
              <td><input v-model="row.section" /></td>
              <td><input v-model="row.code" /></td>
              <td><input v-model="row.day" /></td>
              <td><input v-model="row.timeStart" /></td>
              <td><input v-model="row.timeEnd" /></td>
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

export default {
  data() {
    return {
      excelData: [],
      dataBooking: [],
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
        this.excelData = jsonData
          .slice(1)
          .filter(
            (row) => row[0] !== undefined && row[0] !== null && row[0] !== ""
          )
          .map((row, id) => ({
            id,
            stadium: row[0] || "",
            section: row[1] || "",
            code: row[2] || "",
            day: row[3] || "",
            timeStart: row[4] ? this.formatTime(row[4]) : "",
            timeEnd: row[5] ? this.formatTime(row[5]) : "",
            dateTimeStart: this.dateTimeStart || "",
            dateTimeEnd: this.dateTimeEnd || "",
          }));
      };

      reader.readAsArrayBuffer(file);
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
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed; /* Ensures consistent column widths */
}

.data-table th,
.data-table td {
  padding: 8px;
  border: 1px solid #ddd;
  text-align: left;
  white-space: nowrap; /* Prevent text from wrapping */
}

.data-table th {
  background-color: #f2f2f2;
  font-weight: bold;
}

.data-table th,
.data-table td {
  padding: 8px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

.data-table tbody tr:nth-child(even) {
  background-color: #f2f2f2;
}

.data-table th:nth-child(5),
.data-table th:nth-child(6),
.data-table td:nth-child(5),
.data-table td:nth-child(6) {
  width: 120px; /* Adjust as needed */
}

.align-right {
  display: flex;
  justify-content: flex-end;
}

@media screen and (max-width: 768px) {
  .data-table th, .data-table td {
    display: block;
    text-align: right;
    padding-left: 50%;
  }

  .data-table th::before, .data-table td::before {
    content: attr(data-label);
    position: absolute;
    left: 0;
    width: 50%;
    padding-left: 15px;
    font-weight: bold;
    text-align: left;
  }

  .data-table th, .data-table td {
    position: relative;
    text-align: left;
  }

  .data-table th::before, .data-table td::before {
    position: absolute;
    left: 0;
    width: 50%;
    padding-left: 15px;
    font-weight: bold;
    text-align: left;
  }
}
</style>
