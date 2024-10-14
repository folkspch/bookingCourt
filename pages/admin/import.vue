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
            </tr>
          </tbody>
        </table>
      </div>
    </v-row>
    <v-row class="align-right">
      <v-btn @click="importBookingData" color="green" class="import-button">
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
      excelData: [], // Store processed Excel data
      court: [],
      selectedCourt: "",
      dateTimeStart: "",
      dateTimeEnd: "",
      timeColumns: [
        "08:00-09:00",
        "09:00-10:00",
        "10:00-11:00",
        "11:00-12:00",
        "12:00-13:00",
        "13:00-14:00",
        "14:00-15:00",
        "15:00-16:00",
        "16:00-17:00",
        "17:00-18:00",
        "18:00-19:00",
        "19:00-20:00",
      ],
    };
  },
  async mounted() {
    const response = await this.$axios.get("http://localhost:4000/getCourtData");
    this.court = response.data;
  },
  methods: {
    handleFileUpload(event) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

        // Process the data
        const processedData = jsonData.slice(1, 11).map((row) => ({
          days: row[0],
          data8to9: row[1] || "",
          data9to10: row[2] || "",
          data10to11: row[3] || "",
          data11to12: row[4] || "",
          data12to13: row[5] || "",
          data13to14: row[6] || "",
          data14to15: row[7] || "",
          data15to16: row[8] || "",
          data16to17: row[9] || "",
          data17to18: row[10] || "",
          data18to19: row[11] || "",
          data19to20: row[12] || "",
        }));
        this.excelData = processedData;
      };
      reader.readAsArrayBuffer(file);
    },
    async importBookingData() {
    const payload = {
      court_id: this.selectedCourt,
      dateTimeStart: this.dateTimeStart,
      dateTimeEnd: this.dateTimeEnd,
      bookings: this.excelData, // Ensure excelData is sent correctly
    };

    try {
      const response = await this.$axios.post(
        "http://localhost:4000/import-booking-admin",
        payload
      );
      console.log("Import successful:", response.data);
    } catch (error) {
      console.error("Import failed:", error);
    }
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

.align-right {
  display: flex;
  justify-content: flex-end;
}

.import-button {
  margin-right: 10px;
}
</style>
