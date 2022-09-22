<template>
  <div>
    <v-row no-gutters class="d-flex">
      <v-col cols="6">
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
          <!-- <v-btn large slot="append-outer">TEST</v-btn> -->
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
      <v-col cols="6">
        <v-card>
          <!-- <v-list-item> -->
          <v-system-bar window>
            <v-card-title
              >รายชื่อผู้เข้าร่วมการจอง ({{ this.memberCount }}/{{
                this.$store.state.courtDetail.Players
              }})</v-card-title
            >
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
          <!-- </v-list-item> -->
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
      <v-col cols="6">
        <CourtDetail
          class="d-flex justify-center"
          :selectedCourt="this.$store.state.selectedCourt"
          :page="'confirm_booking'"
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
    <v-footer absolute class="mb-5" color="white">
      <v-row class="d-flex justify-end">
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
import axios from "axios";
import CourtDetail from "@/components/CourtDetail.vue";
export default {
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
      code: "",
      interval: null,
      user: {},
      confirmExit: false,
    };
  },
  methods: {
    test() {
      console.log(this.$store.state.userId);
    },
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

      // console.log(this.$store.state.courtDetail);
      if (check) {
      }
    },
    checkDelBtn(x) {
      let g = this.inviteList.find((e) => e.id === x);
      if (x == this.user.username) {
        return false;
      } else if (g.status == "Confirmed") {
        return false;
      } else {
        return true;
      }
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
      axios
        .delete("http://localhost:4000/delFromList", {
          data: {
            userId: x,
            code: this.code,
            court: this.$store.state.selectedCourt,
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
      axios
        .post("http://localhost:4000/addToList", {
          userId: this.invitee.username,
          userName: this.invitee.displayname,
          code: this.code,
          court: this.$store.state.selectedCourt,
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
        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };
        axios
          .post(
            "https://cors-anywhere.herokuapp.com/https://account.kmutnb.ac.th/api/account-api/user-info",
            body,
            config
          )
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
        userId: this.user.username,
        userName: this.user.displayname,
        court: this.$store.state.selectedCourt,
      };
      console.log(body);

      if (
        (body.userId != undefined) &
        (body.court != "") &
        (body.userName != undefined)
      ) {
        axios.post("http://localhost:4000/createList", body).then((res) => {
          this.code = res.data.code;
          this.getLobbyList();
        });
      } else {
        console.error("error occurred");
      }
    },
    getLobbyList() {
      let body = {
        court: this.$store.state.selectedCourt,
        code: this.code,
        status: 0,
      };
      if (body.code != "" && body.court != "") {
        axios.post("http://localhost:4000/getLobbyData", body).then((res) => {
          // console.log(res,"resss");
          this.inviteList = [];
          for (let i = 0; i < res.data.length; i++) {
            this.inviteList.push({
              id: res.data[i].User_id,
              name: res.data[i].User_name,
              status: res.data[i].Invite_status,
            });
          }
          console.log(this.inviteList, "invitelist");
          this.memberCount = this.inviteList.length;
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
      if (this.$store.state.selectedCourt && this.code) {
        axios
          .delete("http://localhost:4000/cancelBook", {
            data: {
              court: this.$store.state.selectedCourt,
              code: this.code,
            },
          })
          .then(() => {
            console.log("canceled");
          });
      }
      this.confirmExit = true;
      if (btn) {
        this.$router.replace("/booking");
      }
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
    if (this.$auth.loggedIn == true) {
      if (this.confirmExit) {
        next();
      } else {
        if (
          window.confirm(
            "การจองนี้จะถูกยกเลิกหากคุณออกจากหน้านี้ คุณยืนยันจะออกหรือไม่?"
          )
        ) {
          this.cancelBook();
          next();
        }
      }
    }
  },
  created() {
    // window.addEventListener("beforeunload", this.beforeWindowUnload);
  },
  mounted() {
    this.user = this.$auth.$storage.getUniversal("user");
    this.createLobby();
    this.pollData();
  },
  beforeDestroy() {
    console.log("TEST");
    clearInterval(this.interval);
  },
};
</script>

<style>
</style>
