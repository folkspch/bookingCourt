<template>
  <div>
    <v-simple-table class="mb-5">
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
            <td
              v-for="index in countSlot"
              :key="index"
              :id="'table' + index"
            ></td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>
  </div>
</template>

<script>
export default {
   data(){
    return{
        OpsTime: { OpenTime: null, CloseTime: null, ArrTime: [] },
        countSlot: 0,
        table: [],
    }
   },
   props:{
    selectedCourt : String,
    court : Array
   },
methods:{
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
      this.OpsTime.OpenTime = parseInt(
        this.court[parseInt(this.selectedCourt) - 1].TimeOpen.substring(0, 2)
      );
      this.OpsTime.CloseTime = parseInt(
        this.court[parseInt(this.selectedCourt) - 1].TimeClose.substring(0, 2)
      );
      for (let i = this.OpsTime.OpenTime; i < this.OpsTime.CloseTime; i++) {
        var temp1 = i + ".00";
        var temp2 = i + 1 + ".00";
        this.OpsTime.ArrTime.push({
          Time: [temp1, temp2],
          TimeForShow: temp1 + " - " + temp2,
        });
      }
    },
},
watch: {
    selectedCourt() {
     this.plotTable()
    }
  },
  mounted(){
    console.log("dasdasd",this.court)
  }
}
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
  background-color: #ebecf0;
  border-style: solid;
  border-width: 5px;
  border-color: #ebecf0;
}
</style>