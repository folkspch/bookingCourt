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
          {{ this.errorMsg }}
        </v-alert>
        <v-img
          contain
          max-height="900px"
          :src="require('../../assets/Image/login_bg.jpg')"
        >
          <v-col
            cols="12"
            class="d-flex justify-center align-center"
            style="padding-top: 13%"
          >
            <v-card width="30%" flat color="transparent">
              <v-card-title> เข้าสู่ระบบ </v-card-title>
              <v-card-subtitle> เข้าสู่ระบบโดยใช้บัญชี ICIT Admin</v-card-subtitle>
              <v-form>
                <v-card-text>
                  <v-text-field color="orange" v-model="user" label="USERNAME"
                    ><v-icon slot="prepend" color="orange">
                      mdi-account
                    </v-icon></v-text-field
                  >

                  <v-text-field
                    clearable
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
                      @click="login()"
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
              </v-form>
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
export default {
  layout: "loginLayout",
  data() {
    return {
      show1: false,
      user: null,
      password: null,
      userInfo: {},
      loading: false,
      dialogError: false,
      errorMsg: "",
    };
  },
  methods: {
    async login() {
      this.loading = true;
      if (this.user && this.password) {
        try {
          await this.$auth.loginWith("local", {
            data: {
              username: this.user,
              password: this.password,
            },
          });
          // this.$router.push('/')
        } catch (error) {
          this.loading = false;
          if (error.response.status == 401) {
            this.errorMsg =
              "ชื่อผู้ใช้หรือรหัสผ่านผิด โปรดตรวจสอบและลองอีกครั้ง";
            this.dialogError = true;
            setTimeout(() => {
              this.dialogError = false;
            }, 2100);
          } else if (error.response.status == 402) {
            this.errorMsg = "มีข้อผิดพลาดเกิดขึ้น โปรดลองอีกครั้งภายหลัง";
            this.dialogError = true;
          }
        }
      }else {
        this.errorMsg = "โปรดกรอกข้อมูลให้ครบทุกช่อง";
        this.dialogError = true;
        this.loading = false;
        setTimeout(() => {
          this.dialogError = false;
        }, 1600);
      }
    },
    async authen() {
      if (this.user && this.password) {
        this.loading = true;
        try {
          const response = await this.$auth
            .loginWith("local", {
              data: {
                username: this.user,
                password: this.password,
              },
            })
            .then((response) => {
              // console.log(response.data.userInfo);
              // // console.log(response)
              // // if (response.data.message == "Invalid credentials") {

              // //   console.log("wrong pass");
              // // }
              // // else if (response.data.api_status == "success") {
              // //   this.$router.replace({ name: "index" });
              // this.$auth.setUser(response.data.userInfo);
              // let user = {
              //   username: response.data.userInfo.username,
              //   displayname: response.data.userInfo.displayname,
              // };
              // this.$auth.$storage.setUniversal("user", user, true);
              // // }
              this.loading = false;
            })
            .catch((err) => {
              if (err.response.data.message == "Invalid credentials") {
                this.errorMsg =
                  "ชื่อผู้ใช้หรือรหัสผ่านผิด โปรดตรวจสอบและลองอีกครั้ง";
                this.dialogError = true;
                setTimeout(() => {
                  this.dialogError = false;
                }, 2100);
              } else {
                this.errorMsg = "มีข้อผิดพลาดเกิดขึ้น โปรดลองอีกครั้งภายหลัง";
                this.dialogError = true;
              }
              this.loading = false;
            });
        } catch (err) {
          this.errorMsg = "มีข้อผิดพลาดเกิดขึ้น โปรดลองอีกครั้งภายหลัง";
          this.dialogError = true;
          this.loading = false;
          console.log(err);
        }
      } 
    },
  },
};
</script>

<style scoped>
body {
  background: #ff964f;
}
</style>
