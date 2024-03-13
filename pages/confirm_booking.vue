<template>
  <div>
    <v-row no-gutters class="d-flex">
      <v-col :cols="$vuetify.breakpoint.xsOnly ? 9 : 6">
        <v-text-field
          height="51px"
          hint="กรอกชื่อผู้ใช้ที่ต้องการเชิญเข้าร่วมการจอง เช่น s6101234567890"
          v-on:keyup.enter="getInfoByID()"
          v-model="inputID"
          clearable
          solo
          label="กรอกชื่อผู้ใช้ที่ต้องการเชิญเข้าร่วมการจอง"
          color="black"
        >
        </v-text-field>
      </v-col>
      <v-col cols="1">
        <v-btn
          height="51px"
          @click="getInfoByID()"
          color="primary"
          :disabled="this.btnLoading"
          :loading="this.btnLoading"
          >ตกลง</v-btn
        >
      </v-col>
    </v-row>
    <v-dialog v-model="confirmationDialog" persistent>
      <v-card>
        <v-card-title>ยืนยันการเชิญ</v-card-title>
        <v-card-text>
          คุณต้องการเชิญ
          <strong
            >{{ this.invitee.username }} {{ this.invitee.displayname }}</strong
          >
          หรือไม่?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" @click="dialog = false">ยกเลิก</v-btn>
          <v-btn color="success" @click="addToInviteList()">ยืนยัน</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="canceledDialog" persistent>
      <v-card>
        <v-card-title>ยกเลิกการจอง</v-card-title>
        <v-card-text>
          คุณได้ยกเลิกการจองนี้แล้ว
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="$router.replace('booking')">ตกลง</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialog" persistent>
      <v-card>
        <v-card-title>ยืนยันการเชิญ</v-card-title>
        <v-card-text>
          คุณต้องการเชิญ
          <strong
            >{{ this.invitee.username }} {{ this.invitee.displayname }}</strong
          >
          หรือไม่?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" @click="dialog = false">ยกเลิก</v-btn>
          <v-btn color="success" @click="addToInviteList()">ยืนยัน</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogConfirmDel">
      <v-card>
        <v-card-title>ยืนยันการลบ</v-card-title>
        <v-card-text>
          คุณต้องการลบ
          <strong> {{ this.delUser.id }} {{ this.delUser.name }}</strong>
          ออกจากรายชื่อหรือไม่?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" @click="dialogConfirmDel = false">ยกเลิก</v-btn>
          <v-btn color="success" @click="deleteFromList(delUser.id)"
            >ยืนยัน</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogError">
      <v-card>
        <v-card-title>{{ this.errorText.title }}</v-card-title>
        <v-card-text>
          {{ this.errorText.text }}
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="dialogError = false">ตกลง</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogCancel">
      <v-card>
        <v-card-title>ยืนยันการยกเลิก</v-card-title>
        <v-card-text> คุณต้องการยกเลิกการจองนี้หรือไม่? </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" @click="cancelBook(true)">ตกลง</v-btn>
          <v-btn @click="dialogCancel = false">ยกเลิก</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogEmail">
      <v-card>
        <v-card-title>ส่งลิงก์ยืนยันการเข้าร่วมแล้ว</v-card-title>
        <v-card-text>
          ส่งลิงก์ยืนยันการเข้าร่วมไปยังอีเมลล์ <br />{{
            this.inputID + "@email.kmutnb.ac.th"
          }}
          แล้ว
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="dialogEmail = false">ตกลง</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-row>
      <v-col :cols="$vuetify.breakpoint.xsOnly ? 12 : 6">
        <v-card>
          <v-system-bar window style="height: 100%;">
            <v-card-title style="font-size: 1rem"
              >รายชื่อผู้เข้าร่วมการจอง ({{ this.inviteList.length }}/{{
                playerCondition.player
              }})
            </v-card-title>
            <v-spacer></v-spacer>
            <div>
              รหัสเข้าร่วม: {{ this.code }}
              <v-icon @click="copyToClipboard()" small color="orange lighten-1"
                >mdi-content-copy</v-icon
              >
            </div>
            <v-divider light vertical inset class="mr-2"></v-divider>
            <v-btn @click="getLobbyList()" x-small>
              <v-icon color="green lighten-1">mdi-refresh</v-icon>
              รีเฟรชรายชื่อ
            </v-btn>
          </v-system-bar>
          <v-card
            v-if="this.inviteList.length != 0"
            max-height="500px"
            class="overflow-auto"
            elevation="0"
          >
            <v-simple-table>
              <tbody>
                <tr v-for="item in this.inviteList" :key="item.id">
                  <td>{{ item.id }}</td>
                  <td>{{ item.name }}</td>
                  <td>
                    <v-icon
                      v-if="item.status == 'Confirmed'"
                      color="green"
                      dense
                      small
                    >
                      mdi-checkbox-marked-circle</v-icon
                    ><v-icon
                      v-else-if="item.status == 'Pending'"
                      color="primary"
                      dense
                      small
                    >
                      mdi-timer-sand</v-icon
                    >{{ item.status }}
                  </td>
                  <td>
                    <v-btn
                      v-if="checkDelBtn(item.id)"
                      icon
                      @click="showDialogCfDel(item.id, item.name)"
                    >
                      <v-icon color="red lighten-1">mdi-minus-circle</v-icon>
                    </v-btn>
                  </td>
                </tr>
                <tr style="background-color: #e0e0e0">
                  <td></td>
                  <td></td>
                  <td>ยืนยันแล้ว {{ this.memberCount }} คน</td>
                  <td></td>
                </tr>
              </tbody>
            </v-simple-table>
            <!-- <v-list-item v-for="items in this.inviteList" :key="items.id">
            <v-list-item-content>
              <v-list-item-subtitle
                >{{ items.id }} &ensp; {{ items.name }}</v-list-item-subtitle
              >
            </v-list-item-content>
            <v-list-item-action>
              <v-btn
                v-if="checkDelBtn(items.id)"
                icon
                @click="showDialogCfDel(items.id, items.name)"
              >
                <v-icon color="red lighten-1">mdi-minus-circle</v-icon>
              </v-btn>
            </v-list-item-action>
          </v-list-item> -->
          </v-card>
          <v-card v-else height="500px">
            <v-card-text class="d-flex justify-center align-center"
              >ไม่มีข้อมูล</v-card-text
            >
          </v-card>
        </v-card>
      </v-col>
      <v-col :cols="$vuetify.breakpoint.xsOnly ? 12 : 6">
        <CourtDetail
          class="d-flex justify-center"
          :Court="this.court"
          :selectedCourt="this.court"
          :page="'confirm_booking'"
          :selectedTime="this.selectedTime"
        ></CourtDetail>
      </v-col>
    </v-row>
    <!-- <v-row class="d-flex justify-end">
      <v-btn class="mx-2" dark large color="red" width="auto"
        >ยกเลิกการจอง</v-btn
      >
      <v-btn @click="sendRequest()" large color="primary" width="auto"
        >ส่งคำขอการจองสนาม</v-btn
      >
    </v-row> -->
    <v-footer absolute :class="$vuetify.breakpoint.xsOnly ? 'sticky-footer py-5' : 'mb-5'" :color="$vuetify.breakpoint.xsOnly ? '#e0e0e0' : 'white'">
      <v-row class="d-flex justify-center justify-lg-end">
        <v-btn
          @click="dialogCancel = true"
          class="mx-2"
          dark
          large
          color="red"
          width="auto"
          >ยกเลิกการจอง</v-btn
        >
        <v-btn @click="sendRequest()" large color="primary" width="auto"
          >ส่งคำขอการจองสนาม</v-btn
        >
      </v-row>
    </v-footer>
  </div>
</template>

<script>
import CourtDetail from "@/components/CourtDetail.vue";
export default {
  middleware: "checkBookingValue",
  async asyncData({ params }) {
    const code = params.code;
    const court = params.court;

    console.log(court, code);
    return { code, court };
  },
  components: {
    CourtDetail,
  },
  data() {
    return {
      memberCount: 0,
      inputID: null,
      btnLoading: false,
      inviteList: [],
      dialog: false,
      dialogError: false,
      dialogConfirmDel: false,
      dialogEmail: false,
      dialogCancel: false,
      errorText: { title: "", text: "" },
      delUser: { id: "", name: "" },
      invitee: {
        username: "",
        displayname: "",
      },
      code: null,
      court: null,
      interval: null,
      user: {},
      confirmExit: false,
      playerCondition: {},
      confirmationDialog: false,
      confirmationDialogText: {
        header: "",
        msg: "",
      },
      canceledDialog:false,
      selectedTime:null
    };
  },
  methods: {
    sendRequest() {
      console.log(this.user);
      let check =
        (this.user.username != undefined) &
        (this.$store.state.selectedCourt != "");

      if (this.$store.state.courtDetail.Player_strict) {
        if (this.memberCount < this.$store.state.courtDetail.Players) {
          this.errorText = {
            title: "ผู้เล่นไม่ครบตามเกณฑ์",
            text: "สนามนี้จำเป็นต้องมีผู้เล่นครบตามกำหนด",
          };
          this.dialogError = true;
          check = false;
          return;
        }
      }
      // มีชื่อในสนามอื่นไหม,คนครบไหม,สนามว่างไหม
      // console.log(this.$store.state.courtDetail);
      if (check) {
      }
    },
    checkDelBtn(x) {
      let g = this.inviteList.find((e) => e.id === x);
      const myId = this.inviteList.find((e) => e.id === this.user.username);
      if (myId.status == "Host") {
        if (myId.id == g.id) {
          return false;
        } else if (g.status == "Confirmed") {
          return false;
        } else {
          return true;
        }
      } else {
        if (myId.id == g.id) {
          return true;
        } else {
          return false;
        }
      }
      // const myId = this.inviteList.find((e) => e.id === this.user.username);
      // if (
      //   x == this.user.username ||
      //   myId.status != "Host" ||
      //   g.status == "Confirmed" ||
      //   g.status !== "Host"
      // ) {
      //   return false;
      // } else {
      //   return true;
      // }
    },
    copyToClipboard() {
      navigator.clipboard.writeText(this.code);
    },
    showDialogCfDel(id, name) {
      this.dialogConfirmDel = true;
      this.delUser.id = id;
      this.delUser.name = name;
    },
    deleteFromList(x) {
      console.log(x);
      // let body = {
      //   userId: x,
      //   code: this.code,
      //   court: this.$store.state.selectedCourt,
      // };
      // console.log(body);
      this.$axios
        .delete("http://localhost:4000/delFromList", {
          data: {
            userId: x,
            code: this.code,
            court: this.$store.state.selectedCourt
              ? this.$store.state.selectedCourt
              : this.court,
          },
        })
        .then((res) => {
          console.log(res);
          this.getLobbyList();
        });
      // var del = this.inviteList.findIndex((e) => e.id === x);
      // console.log(del);
      // this.inviteList.splice(del, 1);
      this.dialogConfirmDel = false;

      // console.log(this.inviteList);
    },
    addToInviteList() {
      this.$axios
        .post("http://localhost:4000/addToList", {
          userId: this.invitee.username,
          code: this.code,
          court: this.$store.state.selectedCourt
            ? this.$store.state.selectedCourt
            : this.court,
          courtName: this.$store.state.courtDetail.Name_th,
          time: this.$store.state.courtDetail.time,
        })
        .then((res) => {
          console.log(res);
          this.getLobbyList();
          this.dialog = false;
          this.dialogEmail = true;
        });
      // this.inviteList.push({
      //   id: this.invitee.username,
      //   name: this.invitee.displayname,
      // });
      console.log(this.inviteList);
    },
    getInfoByID() {
      if (this.inputID) {
        var isDulplicate = this.inviteList.find((e) => e.id === this.inputID);
        if (isDulplicate) {
          this.errorText.title = "รหัสซ้ำ";
          this.errorText.text = `รหัส ${this.inputID} มีอยู่แล้ว`;
          this.dialogError = true;
          // this.btnLoading = false;
          return;
        }
        this.btnLoading = true;
        const token = "jnNJKFFN9-X55FNmqmLazn1B47BlYmw7";
        var body = {
          username: this.inputID,
        };
        this.$axios
          .post("http://localhost:4000/getICITinfo", body)
          .then((res) => {
            console.log(res.data.userInfo);
            if (res.data.userInfo != null) {
              this.invitee = res.data.userInfo;
              this.btnLoading = false;
              this.dialog = true;
            } else {
              this.btnLoading = false;
              this.errorText.title = "ไม่พบรหัส";
              this.errorText.text = "ไม่พบรหัสนี้ในระบบ";
              this.dialogError = true;
            }
          })
          .catch(() => {
            this.btnLoading = false;
          });
      }

      //   const token = "jnNJKFFN9-X55FNmqmLazn1B47BlYmw7";
      //   const options = {
      //     url: `https://account.kmutnb.ac.th/api/account-api/user-info`,
      //     method: "POST",
      //     headers: { Authorization:`Bearer ${token}`},

      //   };
      //   this.$axios(options).then((res) => {
      //     this.temp = res.data;
      //     console.log("temp ", this.temp);
      //   });
    },
    createLobby() {
      let body = {
        court: this.$store.state.selectedCourt,
        time_start: this.$store.state.selectedTime.time_start,
        time_end: this.$store.state.selectedTime.time_end,
      };
      console.log('body',body);
      if (
        (body.court != "") &
        (body.time_start != null) &
        (body.time_end != null)
      ) {
        this.$axios
          .post("http://localhost:4000/createList", body)
          .then((res) => {
            this.code = res.data.code;
            this.getLobbyList();
          });
      } else {
        // this.$router.replace("/booking");
        console.error("error occurred");
      }
    },
    getLobbyList() {
      let body = {
        court:  this.court,
        code: this.code,
      };
      if (body.code != "" && body.court != "") {
        this.$axios
          .post("http://localhost:4000/getLobbyData", body)
          .then((res) => {
            console.log(res,"resss");
            this.selectedTime = `${res.data[0].Time_start} - ${res.data[0].Time_end}`
            this.inviteList = [];
            for (let i = 0; i < res.data.length; i++) {
              this.playerCondition.player = res.data[0].Players;
              this.playerCondition.player_strict = res.data[0].Players_strict;
              this.inviteList.push({
                id: res.data[i].User_id,
                name: res.data[i].User_name,
                status: res.data[i].Invite_status,
              });
            }
            this.memberCount = 0;
            for (let i = 0; i < this.inviteList.length; i++) {
              if (
                this.inviteList[i].status == "Confirmed" ||
                this.inviteList[i].status == "Host"
              ) {
                this.memberCount++;
              }
            }
          });
      } else {
        console.error("error occurred lb");
      }
    },
    pollData() {
      if (this.user.username != undefined && this.$store.state.selectedCourt) {
        this.interval = setInterval(() => {
          if (this.code) {
            this.getLobbyList();
            console.log("getlb");
          }
        }, 5000);
      }
    },
    cancelBook(btn) {
      this.dialogCancel = false
      if ((this.$store.state.selectedCourt||this.court) && this.code) {
        this.$axios
          .delete("http://localhost:4000/cancelBook", {
            data: {
              court: this.$store.state.selectedCourt
                ? this.$store.state.selectedCourt
                : this.court,
              code: this.code,
            },
          })
          .then((res) => {
            if (res.status === 200){
              this.canceledDialog = true
            }
          });
      }
      this.confirmExit = true;
    },

    // beforeWindowUnload(e) {
    //   console.log("exitt");
    //   const answer = window.confirm(
    //     "การจองนี้จะถูกยกเลิกหากคุณออกจากหน้านี้ คุณยืนยันจะออกหรือไม่?"
    //   );
    //   if (!answer) {
    //     // Cancel the event
    //     e.preventDefault();
    //     // Chrome requires returnValue to be set
    //     e.returnValue = "";
    //   }
    // },
    
  },
  beforeRouteLeave(to, from, next) {
    this.$store.commit("clearState");
    next();
  },
  created() {
    // window.addEventListener("beforeunload", this.beforeWindowUnload);
  },
  mounted() {
    this.user.username = this.$auth.user.user_id;
    if (!this.code) {
      this.createLobby();
    } else {
      this.getLobbyList();
    }
    // this.pollData();
  },
  beforeDestroy() {
    this.$store.commit("clearState");
    clearInterval(this.interval);
  },
};
</script>

<style scoped>
.sticky-footer {
  position: fixed;
  width: 100%;
  z-index: 10;
}

</style>
