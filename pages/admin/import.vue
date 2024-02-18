<template>
  <div>
    <input type="file" @change="handleFileUpload" />
    <table class="data-table">
      <thead>
        <tr>
          <th>Stadium</th>
          <th>Day</th>
          <th>Time</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in excelData" :key="row.id" class="data-row">
          <td>{{ row.stadium }}</td>
          <td>{{ row.day }}</td>
          <td>{{ row.time }}</td>
        </tr>
      </tbody>
    </table>
    <v-btn @click="getLobbyList()" x-small class="import-button">
      <v-icon color="green lighten-1">mdi-refresh</v-icon>
      Import data
    </v-btn>
  </div>
</template>

<script>
import * as XLSX from "xlsx";

export default {
  data() {
    return {
      excelData: [],
      dataBooking: [],
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

        this.excelData = jsonData.map((row, id) => ({
          id,
          stadium: row[0],
          day: row[1],
          time: row[2],
        }));
      };

      reader.readAsArrayBuffer(file);
    },
    getLobbyList() {
      this.dataBooking = [...this.excelData];
      console.log("<--",this.dataBooking);
      console.log("-->",this.dataBooking[0].stadium);
      console.log("-->",this.dataBooking[0].day);
      console.log("-->",this.dataBooking[0].time);
    },
  },
};
</script>

<style scoped>
.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table th,
.data-table td {
  padding: 8px;
  border: 1px solid #ddd;
  text-align: left;
}

.data-table th {
  background-color: #f2f2f2;
  font-weight: bold;
}

.data-table tbody tr:nth-child(even) {
  background-color: #f2f2f2;
}

.data-row {
  /* Add your CSS styles for table rows here */
}
</style>
