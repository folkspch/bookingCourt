<template>
  <v-app>
    <v-navigation-drawer
      :src="require('../assets/Image/sidebar_bg.jpg')"
      v-model="drawer"
      :mini-variant="miniVariant"
      :clipped="clipped"
      fixed
      app
      :color="themeColor"
    >
      <v-row
        justify="space-around"
        style="margin-top: 30px; margin-bottom: 30px"
      >
        <v-avatar color="white" size="120">
          <img
            src="https://icit.kmutnb.ac.th/main/wp-content/uploads/2016/05/icit_logo_big.png"
            alt="profilePic"
          />
        </v-avatar>
      </v-row>
      <v-list>
        <!-- <div class="d-flex justify-center mb-3"></div> -->
        <v-list-item>
        <v-list-item-action>
          <v-icon color="orange lighten-4">mdi-account</v-icon>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title>{{ $auth.user.user_id }}</v-list-item-title>
          <v-list-item-title>{{ $auth.user.name }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :to="item.to"
          router
          exact
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar :clipped-left="clipped" fixed app :color="themeColor">
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-spacer />
      <a style="color: white; margin-right: 0" @click="$router.push('/my_book')">การจองของฉัน</a>
      <v-divider light vertical inset class="mx-2"></v-divider>
      <a @click="logout()" style="color: white; margin-right: 0">ออกจากระบบ</a>
    </v-app-bar>
    <v-main>
      <v-container>
        <Nuxt />
      </v-container>
    </v-main>
    <!-- <v-navigation-drawer v-model="rightDrawer" :right="right" temporary fixed>
      <v-list>
        <v-list-item @click.native="right = !right">
          <v-list-item-action>
            <v-icon light> mdi-repeat </v-icon>
          </v-list-item-action>
          <v-list-item-title>Switch drawer (click me)</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer> -->
    <v-footer fixed app>
      <span>KMUTNB &copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      // themeColor:"#92B9E7",
      userInfo:{
        username:"",
        displayname:""
      },
      themeColor: "#FF8B10",
      clipped: false,
      drawer: true,
      fixed: false,
      items: [
        {
          icon: "mdi-apps",
          title: "หน้าแรก",
          to: "/",
        },
        {
          icon: "mdi-soccer-field",
          title: "สนาม",
          to: "/stadium",
        },
        {
          icon: "mdi-timetable",
          title: "ตารางเวลา",
          to: "/timetable",
        },
        {
          icon: "mdi-order-bool-descending",
          title: "กฏระเบียบ",
          to: "/rules",
        },
        {
          icon: "mdi-clipboard-text-clock-outline",
          title: "จองสนาม",
          to: "/booking",
        },
        {
          icon: "mdi-contacts",
          title: "ติดต่อ",
          to: "/contact",
        },
        {
          icon: "mdi-contacts",
          title: "index",
          to: "/admin/index",
        },
        {
          icon: "mdi-contacts",
          title: "rules",
          to: "/admin/rules",
        },
        {
          icon: "mdi-contacts",
          title: "stadium",
          to: "/admin/stadium",
        },
        {
          icon: "mdi-contacts",
          title: "booking",
          to: "/admin/booking",
        },
        {
          icon: "mdi-contacts",
          title: "timetable",
          to: "/admin/timetable",
        },
        {
          icon: "mdi-contacts",
          title: "import",
          to: "/admin/import",
        },
        {
          icon: "mdi-contacts",
          title: "approve",
          to: "/admin/approve",
        },
        {
          icon: "mdi-contacts",
          title: "export",
          to: "/admin/export",
        },
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: "Vuetify.js",
    };
  },
  methods: {
    logout() {
      this.$auth.logout();
      this.$router.replace('/login');
    },
  },
  created() {
    // console.log(this.$router.name,"router")
  },
};
</script>
<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Prompt:wght@100;300;500&display=swap");
* {
  font-family: "Prompt", sans-serif;
}

</style>
