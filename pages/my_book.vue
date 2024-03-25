<template>
  <div>
    <div v-if="this.isLoading" cols="12" style="display: flex;align-items: center;justify-content: center;height: 90vh;">
      <v-progress-circular color="deep-orange-lighten-2" :indeterminate="isLoading"></v-progress-circular>
    </div>
    <div v-if="bookingList.length == 0" style="display: flex;align-items: center;justify-content: center;height: 80vh;">
      <p>ยังไม่มีรายการจองสนามในวันนี้</p>
    </div>
    <div v-else>
      <v-col cols="12" lg="7">
      <div v-for="(item, index) in bookingList" :key="index">
        <BookingBox :bookingList="item" />
      </div>
    </v-col>
    </div>
  </div>
</template>

<script>
import BookingBox from "~/components/BookingBox.vue";
export default {
  data() {
    return {
      bookingList: [],
      isLoading:false
    };
  },
  components: {
    BookingBox,
  },
  methods: {
    getMybookList() {
      this.isLoading = true
      const options = {
        url: `http://localhost:4000/getBookList`,
        method: "POST",
      };
      this.$axios(options).then((res) => {
        this.bookingList = [...res.data];
        this.isLoading = false
      });
    },
  },
  mounted() {
    this.getMybookList();
  },
};
</script>

<style>
</style>