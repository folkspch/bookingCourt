<template>
  <div>
    <v-simple-table class="mb-5">
      <template v-slot:default>
        <thead>
          <tr>
            <th style="background-color: #bebebe">สนาม</th>
            <th
              style="background-color: #ebecf0"
              v-for="(item, index) in OpsTime.ArrTime"
              :key="index"
              class="pa-3"
            ></th>
            <th style="background-color: #bebebe">ชื่อผู้จอง</th>
            <th
              style="background-color: #ebecf0"
              v-for="(item, index) in OpsTime.ArrTime"
              :key="index"
              class="pa-3"
            ></th>
            <th style="background-color: #bebebe">ช่วงเวลา</th>
            <th
              style="background-color: #ebecf0"
              v-for="(item, index) in OpsTime.ArrTime"
              :key="index"
              class="pa-3"
            ></th>
            <th style="background-color: #bebebe"></th>
            <th
              style="background-color: #ebecf0"
              v-for="(item, index) in OpsTime.ArrTime"
              :key="index"
              class="pa-3"
            ></th>
            <th style="background-color: #bebebe"></th>
            <th
              style="background-color: #ebecf0"
              v-for="(item, index) in OpsTime.ArrTime"
              :key="index"
              class="pa-3"
            ></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in lobbyList" :key="index">
            <td class="pa-5" style="background-color: #ebecf0">
              <v-row>
                <p class="ml-2">{{ item.stadium }}</p>
              </v-row>
            </td>
            <td class="pa-5" style="background-color: #ebecf0">
              <v-row>
                <p class="ml-2">{{ item.name }}</p>
              </v-row>
            </td>
            <td class="pa-5" style="background-color: #ebecf0">
              <v-row>
                <p class="ml-2">{{ item.time }}</p>
              </v-row>
            </td>
            <td class="pa-2" style="background-color: #ebecf0">
              <v-btn x-small @click="confirmLobby(index)"> ยืนยัน </v-btn>
            </td>
            <td class="pa-2" style="background-color: #ebecf0">
              <v-btn x-small @click="openModal">ยกเลิก </v-btn>
            </td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>
    <!-- Modal -->
    <div class="modal" v-if="showModal">
      <div class="modal-background"></div>
      <div class="modal-content">
        <div>
          <span class="close" @click="closeModal">&times;</span>
        <h2>สาเหตุที่ต้องการยกเลิก</h2>
        <p></p>
        <input type="text" placeholder="สาเหตุที่ต้องการยกเลิก..."  style="width: 300px; height: 100px; ">
        </div>
        <div style="paddingTop : 15px">
          <v-btn x-small @click="showModal = true" style="width: 70px; height: 50px; "> ยืนยัน </v-btn>
        </div>

      </div>
    </div>
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
      showModal: false,
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
      lobbyList: [
        // เข้าหน้าจอนี้แล้วให้ยิง api ไป query database find หา status ที่ยังไม่ได้ approve การจองทุกครั้ง เพื่อให้รู้ได้ว่ามี lobby เข้ามาใหม่หรือไม่
        // ตอนจองให้ส่งเมล์ไปที่ admin เพื่อเป็น notification ให้กับผู้ดูแล
        {
          stadium: "สนามบาสเก็ตบอล",
          name: "ณพล ศรีสุวรรณ",
          time: "09:00 - 10:00",
          idLobby: "a001",
        },
        {
          stadium: "สนามวอลเลบอล",
          name: "เดช เดชาบูรพา",
          time: "11:00 - 12:00",
          idLobby: "a002",
        },
        {
          stadium: "สนามฟุตซอล",
          name: "ศุภชัย พีระชัยรัตน์",
          time: "15:00 - 16:00",
          idLobby: "a003",
        },
        {
          stadium: "สนามแบตมินตัน",
          name: "เอก ยิ่งเจริญ",
          time: "14:00 - 15:00",
          idLobby: "a004",
        },
      ],
      listCourt: [],
      selectedCourt: null,
      selectedTime: null,
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
    openModal() {
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
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
    confirmLobby(index) {
      // Access data based on the index
      const selectedItem = this.lobbyList[index];
      console.log(
        "Confirmed lobby:",
        selectedItem,
        this.lobbyList[index].stadium,
        index
      );
      console.log(
        "Confirmed lobby:",
        selectedItem,
        this.lobbyList[index].name,
        index
      );
      console.log(
        "Confirmed lobby:",
        selectedItem,
        this.lobbyList[index].time,
        index
      );
      console.log(
        "Confirmed lobby:",
        selectedItem,
        this.lobbyList[index].idLobby,
        index
      );

      //pack data and send to database then change status
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
      this.OpsTime.ArrTime = [];
      this.selectedTime = null;
      this.OpsTime.OpenTime = parseInt(
        this.court[parseInt(this.selectedCourt) - 1].TimeOpen.substring(0, 2)
      );
      this.OpsTime.CloseTime = parseInt(
        this.court[parseInt(this.selectedCourt) - 1].TimeClose.substring(0, 2)
      );
      console.log("ggin", this.OpsTime.OpenTime, this.OpsTime.CloseTime);
      for (let i = this.OpsTime.OpenTime; i < this.OpsTime.CloseTime; i++) {
        var temp1 = i + ".00";
        var temp2 = i + 3 + ".00";
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

/* modal */
.modal {
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-background {
  background-color: rgba(0, 0, 0, 0.4); /* Black background with opacity */
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.modal-content {
  background-color: #fefefe;
  padding: 20px;
  border: 1px solid #888;
  max-width: 80%; /* Set maximum width */
  max-height: 80%; /* Set maximum height */
  overflow-y: auto; /* Enable vertical scrolling if content exceeds height */
  position: relative; /* Relative position for absolute close button */
}

.close {
  color: #aaa;
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 28px;
  font-weight: bold;
}

.close:hover,
.close:focus {
  color: black;
  text-decoration: none;
  cursor: pointer;
}

.textbox {
  position: absolute;
  top: 20px;
  left: 20px;
}
</style>
