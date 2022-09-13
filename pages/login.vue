<template>
  <div>
    <v-container>
      <v-row justify="center" dense>
        <v-alert
          v-model="dialogError"
          dismissible
          width="50%"
          transition="scale-transition"
          type="error"
        >
          ชื่อผู้ใช้หรือรหัสผ่านผิด โปรดตรวจสอบและลองอีกครั้ง
        </v-alert>
        <v-img
          contain
          max-height="900px"
          src="https://sv1.picz.in.th/images/2022/08/24/aSEICl.jpg"
        >
          <v-col
            cols="12"
            class="d-flex justify-center align-center"
            style="padding-top: 13%"
          >
            <v-card width="30%" flat color="transparent">
              <v-card-title> เข้าสู่ระบบ </v-card-title>
              <v-card-subtitle> เข้าสู่ระบบโดยใช้บัญชี ICIT </v-card-subtitle>
              <v-card-text>
                <v-text-field color="orange" v-model="user" label="USERNAME"
                  ><v-icon slot="prepend" color="orange">
                    mdi-account
                  </v-icon></v-text-field
                >

                <v-text-field
                  color="orange"
                  v-model="password"
                  v-on:keyup.enter="authen()"
                  :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                  :type="show1 ? 'text' : 'password'"
                  label="PASSWORD"
                  @click:append="show1 = !show1"
                  ><v-icon slot="prepend" color="orange">
                    mdi-lock
                  </v-icon></v-text-field
                >
                <!-- <v-checkbox v-model="remember" label="จดจำฉันไว้?"></v-checkbox> -->
                <div class="d-flex justify-center align-center">
                  <v-btn
                    @click="authen()"
                    :disabled="this.loading"
                    :loading="this.loading"
                    color="primary"
                    >LOGIN</v-btn
                  >
                  <v-divider class="mx-3" vertical light></v-divider>
                  <a href="https://account.kmutnb.ac.th/web/recovery/index"
                    >ลืมรหัสผ่าน?</a
                  >
                </div>
              </v-card-text>
            </v-card>
          </v-col>
          <!-- </v-row> -->
        </v-img>

        <!-- </v-card> -->
        <!-- </v-col> -->
      </v-row>

      <!-- <v-dialog v-model="dialogError">
      <v-card>
        <v-card-title>ชื่อผู้ใช้หรือรหัสผ่านผิด</v-card-title>
        <v-card-text>
          ชื่อผู้ใช้หรือรหัสผ่านผิด โปรดตรวจสอบและลองอีกครั้ง
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="dialogError = false">ตกลง</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog> -->
    </v-container>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      show1: false,
      user: null,
      password: null,
      userInfo: {},
      loading: false,
      dialogError: false,
    };
  },
  methods: {
    async authen() {
      if (this.user && this.password) {
        this.loading = true;
        try {
          const response = await this.$auth
            .loginWith("local", {
              data: {
                username: this.user,
                password: this.password,
                scopes: "personel,student,templecturer,exchange_student",
              },
            })
            // .then((response) => {
            //   console.log(response)
            //   if (response.data.api_status == "fail") {
            //     this.dialogError = true;
            //     console.log("wrong pass");

            //   } else if (response.data.api_status == "success") {
            //     this.$router.replace({ name: "index" });
            //     this.$auth.setUser(response.data.userInfo);
            //     this.$auth.$storage.setUniversal(
            //       "user",
            //       response.data.userInfo,
            //       true
            //     );
            //   }
            //   this.loading = false;
            // });
          // console.log(response);

          // if (response.data.success) {
          //   this.$router.replace({ name: 'blogs' })
          // }
        } catch (err) {
          this.loading = false;
          console.log(err);
        }
        // console.log(this.$auth);
      }

      // let token = "jnNJKFFN9-X55FNmqmLazn1B47BlYmw7";
      // const config = {
      //   headers: { Authorization: `Bearer ${token}` },
      // };
      // let body = {
      //   username: this.user,
      //   password: this.password,
      //   scopes: "personel,student,templecturer,exchange_student",
      // };
      // if (this.user && this.password) {
      //   this.loading = true;
      //   axios
      //     .post(
      //       "https://cors-anywhere.herokuapp.com/https://api.account.kmutnb.ac.th/api/account-api/user-authen",
      //       body,
      //       config
      //     )
      //     .then((res) => {
      //       console.log(res,"resppp")
      //       this.userInfo = res.data.userInfo;
      //       console.log(this.userInfo, "userinfo");
      //       if (res.data.api_status == "success") {
      //         this.$store.commit("setUserName", this.userInfo.displayname);
      //         this.$store.commit("setUserId", this.userInfo.username);
      //         console.log(this.$store.state);
      //         if (this.remember) {
      //           let now = new Date();
      //           let time = now.getTime();
      //           let expireTime = time + 86400000 * 30;
      //           now.setTime(expireTime);
      //           document.cookie =
      //             `Uid=${this.userInfo.username};expires=` +
      //             now.toUTCString() + expireTime
      //             ";path=/";
      //         }
      //         this.$router.replace("/");
      //       } else if (res.data.api_status == "fail") {
      //         this.dialogError = true;
      //         console.log("wrong");
      //       }
      //       this.loading = false;
      //     });
      // } else {
      //   console.log("dsfsdfsdf");
      // }
    },
  },
};
</script>

<style scoped>
body {
  background: #ff964f;
}
</style>
