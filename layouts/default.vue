<template>
  <v-app>
    <v-navigation-drawer
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
          <img src="https://www.kindpng.com/picc/m/105-1055656_account-user-profile-avatar-avatar-user-profile-icon.png" alt="profilePic" />
        </v-avatar>
      </v-row>
      <v-list>
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
            <v-list-item-title v-text="item.title" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar :clipped-left="clipped" fixed app :color="themeColor">
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-spacer/>
      <a style="color:white;margin-right:0;">ออกจากระบบ</a>
    </v-app-bar>
    <v-main>
      <v-container>
        <Nuxt />
      </v-container>
    </v-main>
    <v-navigation-drawer v-model="rightDrawer" :right="right" temporary fixed>
      <v-list>
        <v-list-item @click.native="right = !right">
          <v-list-item-action>
            <v-icon light> mdi-repeat </v-icon>
          </v-list-item-action>
          <v-list-item-title>Switch drawer (click me)</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-footer :absolute="!fixed" app>
      <span>KMUTNB &copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      // themeColor:"#92B9E7",
      themeColor:"#ff964f",
      clipped: false,
      drawer: false,
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
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: "Vuetify.js",
    };
  },
};
</script>
<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Prompt:wght@100;300;500&display=swap");
* {
  font-family: "Prompt", sans-serif;
}
</style>
