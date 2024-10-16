<template>
  <div>
    <v-row>
      <v-col cols="7">
        <div>
          <tr>
            <td><div class="mr-3">ชื่อสนามกีฬา :</div></td>
            <td>
              <v-text-field
                hide-details
                v-model="courtData.Name_th"
                solo
              ></v-text-field>
            </td>
          </tr>
          <tr>
            <td><div class="mr-3">ชนิดสนามกีฬา :</div></td>
            <td class="py-2">
              <v-text-field
                hide-details
                v-model="courtData.Type_th"
                solo
              ></v-text-field>
            </td>
          </tr>
          <tr>
            <td><div class="mr-3">จำนวนผู้เล่น :</div></td>
            <td class="py-2">
              <v-text-field
                hide-details
                v-model="courtData.Players"
                solo
              ></v-text-field>
            </td>
            <td class="pl-4">
              <v-checkbox
                :false-value="0"
                :true-value="1"
                hide-details="auto"
                color="orange"
                v-model="courtData.Player_strict"
                label="บังคับ"
                dense
              ></v-checkbox>
            </td>
          </tr>
          <tr>
            <td><div class="mr-3">สถานที่ตั้ง :</div></td>
            <td class="py-2">
              <v-text-field
                hide-details
                v-model="courtData.Place_th"
                solo
              ></v-text-field>
            </td>
          </tr>
          <tr>
            <td><div class="mr-3">เวลาให้บริการ :</div></td>
            <td class="py-2">
              <v-select
                item-color="orange"
                color="orange"
                class="mb-2"
                solo
                hide-details
                v-model="scheduleType"
                :items="scheduleList"
                item-text="type"
                item-value="value"
                label="Select"
                single-line
              ></v-select>
              <div v-if="scheduleType == 'custom'">
                <table
                  class="table"
                  style="background-color: #e0e0e0; border-radius: 5px"
                >
                  <tr class="table">
                    <th>จันทร์</th>
                    <th>อังคาร</th>
                    <th>พุธ</th>
                    <th>พฤหัสบดี</th>
                    <th>ศุกร์</th>
                    <th>เสาร์</th>
                    <th>อาทิตย์</th>
                  </tr>
                  <tr style="background-color: white">
                    <td
                      class="table"
                      v-for="(day, index) in courtData.Operation_time"
                      :key="index"
                    >
                      <div
                        style="text-align: center; padding: 1%"
                        v-if="!day.isClose"
                      >
                        {{ day.open }} - {{ day.close }}
                      </div>
                      <div
                        style="
                          background-color: #ff8080;
                          text-align: center;
                          padding: 1%;
                        "
                        v-else
                      >
                        ปิดบริการ
                      </div>
                    </td>
                  </tr>
                </table>
                <div>
                  <v-btn class="mt-2" @click="editTimeDialog = !editTimeDialog">
                    <div>แก้ไขเวลาให้บริการ</div>
                  </v-btn>
                </div>
              </div>
              <div v-else style="display: flex; align-items: center">
                <!-- <v-text-field hide-details solo suffix="น."></v-text-field> -->
                <v-menu
                  ref="menu"
                  v-model="timePicker.open"
                  :close-on-content-click="false"
                  :return-value.sync="time"
                  transition="scale-transition"
                  offset-y
                  max-width="290px"
                  min-width="290px"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      solo
                      hide-details
                      v-model="courtData.Operation_time[0].open"
                      label="เวลาเปิด"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-time-picker
                    v-if="timePicker.open"
                    format="24hr"
                    v-model="courtData.Operation_time[0].open"
                    full-width
                    @click:minute="
                      $refs.menu.save(courtData.Operation_time[0].open)
                    "
                  ></v-time-picker>
                </v-menu>
                <v-spacer class="px-2"> ถึง </v-spacer>
                <!-- <v-text-field hide-details solo suffix="น."></v-text-field> -->
                <v-menu
                  ref="menu"
                  v-model="timePicker.close"
                  :close-on-content-click="false"
                  :return-value.sync="time"
                  transition="scale-transition"
                  offset-y
                  max-width="290px"
                  min-width="290px"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      solo
                      hide-details
                      v-model="courtData.Operation_time[0].close"
                      label="เวลาปิด"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                      format="24hr"
                    ></v-text-field>
                  </template>
                  <v-time-picker
                    v-if="timePicker.close"
                    format="24hr"
                    v-model="courtData.Operation_time[0].close"
                    full-width
                    @click:minute="
                      $refs.menu.save(courtData.Operation_time[0].close)
                    "
                  ></v-time-picker>
                </v-menu>
              </div>
              <!-- <v-text-field
                hide-details
                v-model="courtData.Name_th"
                solo
              ></v-text-field> -->
            </td>
          </tr>
          
        </div>
      </v-col>
      <v-col cols="5">
        <div class="image-container">
          <v-img :src="courtData.Img" class="hover-shadow" contain></v-img>
          <div class="overlay">
            <v-btn color="orange" @click="triggerFileInput">
              <v-icon left> mdi-image-edit </v-icon>
              เปลี่ยนรูป
            </v-btn>
            <input
              type="file"
              ref="fileInput"
              style="display: none"
              accept="image/*"
              @change="onFileChange"
            />
          </div>
        </div>
      </v-col>
    </v-row>
    <v-card class="mt-3" :elevation="isEditing ? '0' : '2'">
      <v-app-bar dense elevation="2">
        <v-toolbar-title>ประกาศ</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn
          v-if="isEditing == false"
          @click="isEditing = !isEditing"
          color="amber lighten-1"
        >
          <v-icon left>mdi-file-edit-outline</v-icon>
          แก้ไข</v-btn
        >
        <div v-else>
          <v-btn dark color="red" @click="cancelEditing()"> ยกเลิก</v-btn>
          <v-btn dark color="green" @click="isEditing = false">
            เสร็จสิ้น</v-btn
          >
        </div>
      </v-app-bar>
      <div v-if="courtData.Content || isEditing">
        <div
          v-if="isEditing == false"
          class="pa-2"
          v-html="courtData.Content"
        ></div>
        <div class="mt-2" v-else>
          <TinyMCEEditor v-model="courtData.Content" />
        </div>
      </div>
      <div v-else>
        <div class="d-flex justify-center py-5" v-if="!courtData.Content">
          ไม่มีข้อมูล
        </div>
      </div>
    </v-card>
    <div
      style="margin-top: 5%"
      class="d-flex justify-center"
      v-if="!isEditing && isDataChage"
    >
      <v-btn
        class="pa-5"
        style="width: 35%; height: 60px; font-size: 20px"
        dark
        color="green"
      >
        <v-icon left> mdi-content-save </v-icon>
        บันทึก</v-btn
      >
    </div>
    <!-- {{ this.courtData }}
    <div></div>
    {{ this.oldData }} -->

    <v-dialog v-model="editTimeDialog" width="25%">
      <v-card>
        <v-card-title>แก้ไขเวลาให้บริการ</v-card-title>
        <div>
          <v-simple-table>
            <thead style="background-color: #e0e0e0">
              <tr>
                <th style="text-align: center; font-size: small">วัน</th>
                <th style="text-align: center; font-size: small">เวลาเปิด</th>
                <th style="text-align: center; font-size: small">เวลาปิด</th>
                <th style="text-align: center; font-size: small">ปิดบริการ</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(day, index) in tmpDailyData" :key="index">
                <td
                  style="text-align: center"
                  :style="{ backgroundColor: day.isClose ? '#e0e0e0' : '' }"
                >
                  {{ dayTh[index] }}
                </td>
                <td
                  class="py-2"
                  :style="{ backgroundColor: day.isClose ? '#e0e0e0' : '' }"
                >
                  <v-menu
                    :disabled="day.isClose"
                    ref="menuOpen"
                    v-model="menuOpen[index]"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    :return-value.sync="day.open"
                    transition="scale-transition"
                    offset-y
                    max-width="290px"
                    min-width="290px"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        :disabled="day.isClose"
                        dense
                        hide-details
                        outlined
                        color="green"
                        v-model="day.open"
                        wi
                        prepend-icon="mdi-clock-time-four-outline"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-time-picker
                      color="green"
                      v-if="menuOpen[index]"
                      format="24hr"
                      v-model="day.open"
                      full-width
                      @click:minute="$refs.menuOpen[index].save(day.open)"
                    ></v-time-picker>
                  </v-menu>
                </td>
                <td :style="{ backgroundColor: day.isClose ? '#e0e0e0' : '' }">
                  <v-menu
                    :disabled="day.isClose"
                    ref="menuClose"
                    v-model="menuClose[index]"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    :return-value.sync="day.close"
                    transition="scale-transition"
                    offset-y
                    max-width="290px"
                    min-width="290px"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        :disabled="day.isClose"
                        dense
                        hide-details
                        outlined
                        color="red"
                        v-model="day.close"
                        prepend-icon="mdi-clock-remove-outline"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-time-picker
                      color="red"
                      v-if="menuClose[index]"
                      format="24hr"
                      v-model="day.close"
                      full-width
                      @click:minute="$refs.menuClose[index].save(day.close)"
                    ></v-time-picker>
                  </v-menu>
                </td>
                <td :style="{ backgroundColor: day.isClose ? '#e0e0e0' : '' }">
                  <v-checkbox
                    v-model="day.isClose"
                    on-icon="mdi-minus-circle"
                    off-icon="mdi-minus-circle-outline"
                    color="red"
                  ></v-checkbox>
                </td>
              </tr>
            </tbody>
          </v-simple-table>
        </div>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" @click="editTimeDialog = false">ยกเลิก</v-btn>
          <v-btn color="success" @click="updateOperationTimeValue"
            >ยืนยัน</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- {{ tmpDailyData }}
    <div></div>
    {{ courtData.Operation_time }} -->
  </div>
</template>

<script>
import TinyMCEEditor from "@/components/TinyMCEEditor.vue";
import axios from "axios";
import _ from "lodash";
export default {
  async asyncData({ params }) {
    const court_id = params.court_id;
    return court_id;
  },
  beforeRouteEnter(to, from, next) {
    if (!to.params.id) {
      next("/admin/stadium");
    } else {
      next();
    }
  },
  components: {
    TinyMCEEditor,
  },
  data() {
    return {
      test: [
        {
          day: "mon",
          reserve: [
            {
              title: "",
              timeStart: "",
              timeEnd: "",
            },
          ],
        },
      ],
      menuOpen: Array(7).fill(false),
      menuClose: Array(7).fill(false),
      test: null,
      tmpDailyData: Array(7)
        .fill()
        .map(() => ({ open: null, close: null, isClose: false })),
      // tmpDailyData: [
      //   { open: null, close: null, isClose: false },
      //   { open: null, close: null, isClose: false },
      //   { open: null, close: null, isClose: false },
      //   { open: null, close: null, isClose: false },
      //   { open: null, close: null, isClose: false },
      //   { open: null, close: null, isClose: false },
      //   { open: null, close: null, isClose: false },
      // ],
      dayTh: [
        "จันทร์",
        "อังคาร",
        "พุธ",
        "พฤหัสบดี",
        "ศุกร์",
        "เสาร์",
        "อาทิตย์",
      ],
      timePicker: {
        open: false,
        close: false,
      },
      scheduleList: [
        { type: "ทุกวัน", value: "daily" },
        { type: "กำหนดเอง", value: "custom" },
      ],
      scheduleType: { type: null, value: null },
      editTimeDialog: false,
      time: null,
      menu2: false,
      oldData: null,
      courtData: {
        Name_th: null,
        Place_th: null,
        Img: null,
        Type_th: null,
        Players: null,
        Player_strict: null,
        TimeOpen: null,
        TimeClose: null,
        Operation_time: [{ open: null, close: null }],
        is_available: null,
        remark: null,
        Content: null,
      },
      isDataChage: false,
      isEditing: false,
    };
  },
  watch: {
    courtData: {
      handler(newValue, oldValue) {
        const isDataChage = _.isEqual(newValue, this.oldData);
        this.isDataChage = !isDataChage;
        console.log(newValue, this.oldData);
      },
      deep: true,
    },
    scheduleType: {
      handler(newValue, oldValue) {
        if (newValue == "custom") {
          for (let i = 0; i < 7; i++) {
            this.courtData.Operation_time[i] = {
              open: this.courtData.Operation_time[0].open,
              close: this.courtData.Operation_time[0].close,
              isClose: false,
            };

            this.tmpDailyData[i] = {
              open: this.courtData.Operation_time[0].open,
              close: this.courtData.Operation_time[0].close,
              isClose: false,
            };
          }
        } else if (newValue == "daily") {
          this.courtData.Operation_time = [
            {
              open: this.courtData.Operation_time[0].open,
              close: this.courtData.Operation_time[0].close,
            },
          ];
        }
        this.courtData = { ...this.courtData };
      },
    },
  },
  methods: {
    async fetchCourtData() {
      this.$axios
        .post("http://localhost:4000/admin/getCourtDataById", {
          court_id: this.$route.params.id,
        })
        .then((res) => {
          if (!res.data.Content) {
            res.data.Content = "";
          }
          if (res.data.Operation_time.length > 1) {
            this.scheduleType = "custom";
          } else {
            this.scheduleType = "daily";
          }
          if (res.data.Operation_time.length > 1) {
            res.data.Operation_time = this.formatArrTime(
              res.data.Operation_time
            );
          }
          this.oldData = _.cloneDeep(res.data);
          this.courtData = { ...res.data };
        });
    },
    updateOperationTimeValue() {
      this.courtData.Operation_time = _.cloneDeep(this.tmpDailyData);
      this.editTimeDialog = false;
    },
    async updateAnnouce() {
      this.$axios
        .post("http://localhost:4000/admin/announce/save", {
          court: this.$route.params.id,
          type: "booking",
          content: this.courtData.Content,
        })
        .then((res) => {
          this.isEditing = false;
          console.log(res);
        });
    },
    cancelEditing() {
      this.courtData.Content = this.oldData.Content;
      this.isEditing = false;
    },
    triggerFileInput() {
      this.$refs.fileInput.click();
    },
    onFileChange(e) {
      const file = e.target.files[0];
      if (file) {
        this.courtData.Img = URL.createObjectURL(file);
      }
    },
    formatArrTime(timeArr) {
      let firstElement = timeArr.shift();
      timeArr.push(firstElement);
      return timeArr;
    },
  },
  mounted() {
    this.fetchCourtData();
  },
};
</script>
<style scoped>
.table {
  border: 1px solid #dddddd;
}

.image-container {
  position: relative;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0);
  color: white;
  opacity: 0;
  transition: background-color 0.3s ease, opacity 0.3s ease;
}

.image-container:hover .overlay {
  background-color: rgba(0, 0, 0, 0.3);
  opacity: 1;
}

.overlay v-btn {
  z-index: 1;
}
</style>
