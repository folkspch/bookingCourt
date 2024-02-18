import Vuex from "vuex";
import Vue from "vue";

Vue.use(Vuex);

export default () =>
  new Vuex.Store({
    state: () => ({
      userId: "",
      userName: "",
      selectedCourt: "",
      selectedTimeRange : "",
      selectedTime: {
        time_start: null,
        time_end: null,
      },
      courtDetail: {},
    }),
    getters: () => ({
      getSomeValue: state => state.courtDetail,
    }),
    mutations: {
      clearState(state) {
        (state.selectedCourt = ""),
          (state.selectedTime = {
            time_start: null,
            time_end: null,
          }),
          (state.courtDetail = {});
          console.log('state cleared');
      },
      setSelectedCourt(state, value) {
        state.selectedCourt = value;
      },
      setSelectedTime(state, value) {
        state.selectedTime.time_start = value[0];
        state.selectedTime.time_end = value[1];
      },
      setUserId(state, value) {
        state.userId = value;
      },
      setUserName(state, value) {
        state.userName = value;
      },
      setCourtDetail(state, value) {
        state.courtDetail = value;
      },
    },
    actions: {},
    modules: {},
  });
