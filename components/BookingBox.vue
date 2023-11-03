<template>
  <div class="my-5 ml-3" id="card">
    <v-card class="mt-3" hover @click="gotoBookingInfo()">
      <v-row dense :no-gutters="$vuetify.breakpoint.xsOnly" align="center">
        <v-col cols="4">
          <div class="px-3 ml-3">
            <v-img width="200" height="170" contain :src="bookingList.Img">
              <template v-slot:placeholder>
                <v-row class="fill-height ma-0" align="center" justify="center">
                  <v-progress-circular
                    indeterminate
                    color="grey-lighten-5"
                  ></v-progress-circular>
                </v-row> </template
            ></v-img>
          </div>
        </v-col>
        <v-col cols="6">
          <div>
            <div
              style="align-items: center; width: 100%"
              :class="$vuetify.breakpoint.xsOnly ? 'd-block' : 'd-flex'"
            >
              <v-card-title>{{ bookingList.Name_th }}</v-card-title>
              <div :class="$vuetify.breakpoint.xsOnly ? 'ml-3 mb-2' : ''" >
                <v-chip color="amber" v-if="bookingList.Status == 'pending'"
                  >กำลังดำเนินการ</v-chip
                >
                <v-chip
                  color="green"
                  v-else-if="bookingList.Status == 'success'"
                  >สำเร็จแล้ว</v-chip
                >
              </div>
            </div>
            <v-card-text style="margin-top: -15px">
              <div>
                <p>ประเภทกีฬา : {{ bookingList.Type_th }}</p>
                <p>ที่ตั้ง : {{ bookingList.Place_th }}</p>
                <p>สร้างคำขอเมื่อ : {{ formatDate(bookingList.Create_at) }}</p>
              </div>
            </v-card-text>
          </div>
        </v-col>
        <v-col cols="2">
          <div
            style="
              display: flex;
              align-items: center;
              justify-content: center;
              height: 100%;
            "
          >
            <v-btn
              color="primary"
              :width="$vuetify.breakpoint.xsOnly ? '100%' : ''"
              @click="gotoBookingInfo()"
              >ดูข้อมูล</v-btn
            >
          </div>
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>
  
  <script>
export default {
  data() {
    return {};
  },
  props: {
    bookingList: Object,
  },
  methods: {
    formatDate(inputDate) {
      const date = new Date(inputDate);
      date.setHours(date.getHours() + 7);
      const options = {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      };
      return date.toLocaleString("fr-FR", options);
    },
    gotoBookingInfo() {
      this.$router.push({
        name: "confirm_booking",
        params: {
          code: this.bookingList.Code,
          court: this.bookingList.Court,
        },
      });
    },
  },
  mounted() {},
  created() {},
};
</script>
  
  <style></style>
  