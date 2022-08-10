<template>
  <div>
    <v-row>
      <v-col cols="4">
        <v-text-field
          v-on:keyup.enter="getInfoByID()"
          v-model="inputID"
          :rules="rules"
          clearable
          solo
          label="กรอกรหัสนักศึกษาเพื่อเชิญเข้าร่วมการจอง"
          color="black"
        ></v-text-field>
      </v-col>
      <v-col cols="1">
        <v-btn
          @click="getInfoByID()"
          large
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
          {{ this.errorText.text }} {{ this.inputID }}
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="dialogError = false">ตกลง</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-col cols="6">
      <v-card>
        <!-- <v-list-item> -->
        <v-system-bar window>
          <v-card-title>รายชื่อผู้เข้าร่วมการจอง</v-card-title>
          <v-spacer></v-spacer>
          <div>
            รหัสเข้าร่วม: {{ this.code }}
              <v-icon @click="copyToClipboard()" small color="orange lighten-1">mdi-content-copy</v-icon>
          </div>
          <v-divider light vertical inset class="mr-2"></v-divider>
          <v-btn x-small>
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
          <v-list-item v-for="items in this.inviteList" :key="items.id">
            <v-list-item-content>
              <v-list-item-subtitle
                >{{ items.id }} &ensp; {{ items.name }}</v-list-item-subtitle
              >
            </v-list-item-content>
            <v-list-item-action>
              <v-btn icon @click="showDialogCfDel(items.id, items.name)">
                <v-icon color="red lighten-1">mdi-minus-circle</v-icon>
              </v-btn>
            </v-list-item-action>
          </v-list-item>
        </v-card>
        <v-card v-else height="500px">
          <v-card-text class="d-flex justify-center align-center">ไม่มีข้อมูล</v-card-text>
        </v-card>
      </v-card>
    </v-col>
   <v-btn @click="test()">hgg</v-btn>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      rules: [(value) => !isNaN(value) || "กรอกเฉพาะตัวเลขเท่านั้น"],
      inputID: null,
      btnLoading: false,
      inviteList: [],
      dialog: false,
      dialogError: false,
      dialogConfirmDel: false,
      errorText: { title: "", text: "" },
      delUser: { id: "", name: "" },
      invitee: {
        username: "",
        displayname: "",
      },
      code: "",
    };
  },
  methods: {
    test(){
      console.log(this.$store.state.userId);
    },
    copyToClipboard(){
      navigator.clipboard.writeText(this.code)
    },
    showDialogCfDel(id, name) {
      this.dialogConfirmDel = true;
      this.delUser.id = id;
      this.delUser.name = name;
    },
    deleteFromList(x) {
      console.log(x);
      var del = this.inviteList.findIndex((e) => e.id === x);
      console.log(del);
      this.inviteList.splice(del, 1);
      this.dialogConfirmDel = false;
      console.log(this.inviteList);
    },
    addToInviteList() {
      this.inviteList.push({
        id: this.invitee.username,
        name: this.invitee.displayname,
      });
      console.log(this.inviteList);
      this.dialog = false;
    },
    getInfoByID() {
      if (this.inputID) {
        var isDulplicate = this.inviteList.find(
          (e) => e.id === "s" + this.inputID
        );
        if (isDulplicate) {
          this.errorText.title = "รหัสซ้ำ";
          this.errorText.text = "รหัสนี้มีอยู่แล้ว";
          this.dialogError = true;
          // this.btnLoading = false;
          return;
        }
        this.btnLoading = true;
        const token = "jnNJKFFN9-X55FNmqmLazn1B47BlYmw7";
        var body = {
          username: "s" + this.inputID,
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
    getCode() {
      const options = {
        url: `http://localhost:4000/generateNewCode`,
        method: "GET",
      };
      this.$axios(options).then((res) => {
        this.code = res.data;
        console.log("code ", this.code);
      });
    },
    getList(){

    },
    
  },
  mounted() {
    this.getCode();
  },
};
</script>

<style></style>
