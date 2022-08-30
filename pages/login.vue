<template>
  <div>
    <v-container>
      <v-row justify="center" dense>
        <!-- <v-col cols="12" class="d-flex justify-center align-center"> -->
        <!-- <v-card elevation="5" rounded="m">
            <v-card-title> เข้าสู่ระบบ </v-card-title>
            <v-card-subtitle> เข้าสู่ระบบโดยใช้บัญชี ICIT </v-card-subtitle>
            <v-card-text>
              <v-form>
                <v-text-field v-model="user" label="USERNAME"><v-icon slot="prepend" color="orange"> mdi-account </v-icon></v-text-field>
                <v-text-field
                  v-model="password"
                  v-on:keyup.enter="authen()"
                  :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                  :type="show1 ? 'text' : 'password'"
                  label="PASSWORD"
                  @click:append="show1 = !show1"
                ><v-icon slot="prepend" color="orange"> mdi-lock </v-icon></v-text-field>
                <v-btn
                  @click="authen()"
                  :disabled="this.loading"
                  :loading="this.loading"
                  color="primary"
                  >LOGIN</v-btn
                >
                <a href="https://account.kmutnb.ac.th/web/recovery/index"
                  >ลืมรหัสผ่าน?</a
                >
              </v-form>
            </v-card-text>
          </v-card> -->
        <!-- <v-card img="https://sv1.picz.in.th/images/2022/08/24/aSEICl.jpg"> -->

        <v-img
          contain
          max-height="900px"
          src="https://sv1.picz.in.th/images/2022/08/24/aSEICl.jpg"
        >
          <!-- <v-row justify="center" > -->
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
                <v-checkbox v-model="remember" label="จดจำฉันไว้?"></v-checkbox>
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
    </v-container>
  </div>
</template>

<script>
import axios from "axios";
export default {
  layout: "loginLayout",
  data() {
    return {
      show1: false,
      user: null,
      password: null,
      userInfo: {},
      loading: false,
      remember: false,
    };
  },
  methods: {
    authen() {
      let token = "jnNJKFFN9-X55FNmqmLazn1B47BlYmw7";
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      let body = {
        username: this.user,
        password: this.password,
        scopes: "personel,student,templecturer,exchange_student",
      };
      if (this.user && this.password) {
        this.loading = true;
        axios
          .post(
            "https://cors-anywhere.herokuapp.com/https://api.account.kmutnb.ac.th/api/account-api/user-authen",
            body,
            config
          )
          .then((res) => {
            this.userInfo = res.data.userInfo;
            console.log(this.userInfo, "userinfo");
            if (res.data.api_status == "success") {
              this.$store.commit("setUserName", this.userInfo.displayname);
              this.$store.commit("setUserId", this.userInfo.username);
              console.log(this.$store.state);
              this.$router.replace("/");
            } else {
            }
            this.loading = false;
          });
      } else {
        console.log("dsfsdfsdf");
      }
    },
  },
};
</script>

<style scoped>
</style>
