<template>
  <div>
    <div v-if="bookingList.length == 0" style="display: flex;align-items: center;justify-content: center;height: 80vh;">
      <p>ยังไม่มีรายการจองสนามในวันนี้</p>
    </div>
    <div v-else>
      <div v-for="(item, index) in bookingList" :key="index">
        <BookingBox :bookingList="item" />
      </div>
    </div>
  </div>
</template>

<script>
import BookingBox from "~/components/BookingBox.vue";
export default {
  data() {
    return {
      bookingList: [],
    };
  },
  components: {
    BookingBox,
  },
  methods: {
    getMybookList() {
      const options = {
        url: `http://localhost:4000/getBookList`,
        method: "POST",
      };
      this.$axios(options).then((res) => {
        this.bookingList = [...res.data];
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