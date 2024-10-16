<template>
  <div style="color: black">
    <v-row>
      <v-col cols="3">
        <div>
          <v-list light>
            <v-subheader style="font-size: 20px">รายชื่อสนาม</v-subheader>
            <v-list-item-group v-model="selectedID" color="primary">
              <v-list-item
                v-for="(item, index) in this.data"
                :key="index"
                color="orange"
              >
                <!-- <v-list-item-icon>
                  <v-icon v-text="item.icon"></v-icon>
                </v-list-item-icon> -->
                <v-list-item-content>
                  <v-list-item-title>{{ item.Name_th }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </div>
      </v-col>
      <v-col>
        <div v-if="selectedID != null">
          <v-card
            class="mx-auto"
            style="padding: 20px; margin-top: 20px"
            max-width="60%"
            elevation="3"
            light
          >
            <div>
              <v-row dense align="center">
                <v-card-title>{{ this.data[selectedID].Name_th }}</v-card-title>
              </v-row>
            </div>

            <div class="mx-auto">
              <v-card-text>
                <div class="d-flex">
                  <p class="mr-2">สถานะ :</p>
                  <v-chip
                    small
                    :color="
                      this.data[selectedID].is_available ? 'success' : 'error'
                    "
                  >
                    <v-icon small left>
                      {{
                        this.data[selectedID].is_available
                          ? "mdi-check"
                          : "mdi-close"
                      }}
                    </v-icon>
                    {{
                      this.data[selectedID].is_available
                        ? "เปิดบริการ"
                        : "ปิดบริการ"
                    }}
                  </v-chip>
                </div>
                <p>ชนิดสนามกีฬา : {{ this.data[selectedID].Type_th }}</p>
                <p>สถานที่ตั้ง : {{ this.data[selectedID].Place_th }}</p>
                <p>
                  จำนวนผู้เล่นที่อนุญาตให้จอง :
                  {{ this.data[selectedID].Players }} คน
                </p>
                <p>
                  เวลาเปิด :
                  {{ this.data[selectedID].TimeOpen.substring(5, 0) }} -
                  {{ this.data[selectedID].TimeClose.substring(5, 0) }}
                </p>
              </v-card-text>
            </div>
            <v-img max-width="600px" :src="this.data[selectedID].Img">
              <template v-slot:placeholder>
                <v-row class="fill-height ma-0" align="center" justify="center">
                  <v-progress-circular
                    indeterminate
                    color="grey-lighten-5"
                  ></v-progress-circular>
                </v-row>
              </template>
            </v-img>
            <div align="center" class="pt-4">
              <v-btn
                :color="
                  this.data[selectedID].is_available ? 'error' : 'success'
                "
                @click="
                  data[selectedID].is_available
                    ? (deactivateModal = true)
                    : (confirmActivateModal = true)
                "
              >
                {{
                  this.data[selectedID].is_available
                    ? "ปิดการใช้งานสนามชั่วคราว"
                    : "เปิดการใช้งานสนาม"
                }}
              </v-btn>
              <v-divider light vertical inset class="mx-1"></v-divider>
              <v-btn
                color="warning"
                @click="
                  $router.push({
                    path: `/admin/stadium/manage/${data[selectedID].Court_id}`,
                  })
                "
              >
                แก้ไขข้อมูลสนาม
              </v-btn>
            </div>
            <!-- {{selectedID}} -->
          </v-card>
        </div>
      </v-col>
    </v-row>
    <v-dialog
      v-model="deactivateModal"
      transition="dialog-bottom-transition"
      max-width="600"
    >
      <v-card>
        <v-card-title style="color: white; background-color: orange"
          >ปิดการใช้งานสนามชั่วคราว</v-card-title
        >
        <div class="pa-5 pt-3">
          <h>สาเหตุ :</h>
          <v-textarea
            auto-grow
            placeholder="กรุณากรอกสาเหตุ"
            solo
            rows="5"
          ></v-textarea>
          <h>เลือกช่วงเวลา :</h>
          <v-menu
            ref="menu"
            v-model="menu"
            :close-on-content-click="false"
            :return-value.sync="dateRange"
            transition="scale-transition"
            offset-y
            min-width="auto"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="dateRangeText"
                prepend-icon="mdi-calendar"
                readonly
                v-bind="attrs"
                v-on="on"
                color="orange"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="dateRange"
              scrollable
              color="orange"
              range
              locale="th"
            >
              <v-spacer></v-spacer>
              <v-btn text color="primary" @click="menu = false"> Cancel </v-btn>
              <v-btn text color="primary" @click="$refs.menu.save(dateRange)">
                OK
              </v-btn>
            </v-date-picker>
          </v-menu>
          <v-row class="my-1" justify="center">
            <v-btn color="success" class="mr-3"> ยืนยัน </v-btn>
            <v-btn @click="deactivateModal = false" color="error">
              ยกเลิก
            </v-btn>
          </v-row>
        </div>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="confirmActivateModal"
      transition="dialog-bottom-transition"
      max-width="600"
    >
      <v-card>
        <v-card-title style="color: white; background-color: orange"
          >เปิดการใช้งานสนาม</v-card-title
        >
        <div class="pa-5 pt-3">
          <div align="center" style="justify-self: center">
            <p style="width: 70%">
              คุณต้องการยืนยันการเปิดใช้งานสนามนี้หรือไม่?
            </p>
          </div>
          <v-row class="my-1" justify="center">
            <v-btn color="success" class="mr-3"> ยืนยัน </v-btn>
            <v-btn @click="confirmActivateModal = false" color="error">
              ยกเลิก
            </v-btn>
          </v-row>
        </div>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      selectedID: null,
      pic: "https://cdn2.iconfinder.com/data/icons/pretty-office-part-7/256/football_pitch-512.png",
      data: [
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
      menu: false,
      buttonOn: false,
      deactivateModal: false,
      confirmActivateModal: false,
      dateRange: [],
    };
  },
  methods: {
    API() {
      const options = {
        url: `http://localhost:4000/getCourtData`,
        method: "GET",
      };
      this.$axios(options).then((res) => {
        //store all data
        this.data = res.data;
        console.log(this.data);
        console.log("API connected");
      });
    },
    toggleButton() {
      this.buttonOn = !this.buttonOn;
      console.log(this.buttonOn);
    },
  },
 
  mounted() {
    this.API();
    this.$store.state.courtDetail.time = null;
  },
  computed: {
    dateRangeText() {
      return this.dateRange.join(" - ");
    },
  },
};
</script>

<style scoped>
.stadiumInfo {
  padding: 20px;
}
.toggle-button-on {
  background-color: #4caf50; /* Green */
  border: none;
  color: white;
  padding: 10px 20px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  cursor: pointer;
  border-radius: 8px;
}

.toggle-button-off {
  background-color: #f44336; /* Red */
  border: none;
  color: white;
  padding: 10px 20px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  cursor: pointer;
  border-radius: 8px;
}

.toggle-button-on:hover {
  background-color: #45a049; /* Darker green */
}

.toggle-button-off:hover {
  background-color: #e53935; /* Darker red */
}
</style>
