<template>
  <div>
    <v-simple-table class="mb-5 custom-table">
      <template v-slot:default>
        <thead>
          <tr>
            <th class="header-cell">สนาม</th>
            <th class="header-cell">ชื่อผู้จอง</th>
            <th class="header-cell">ช่วงเวลา</th>
            <th class="header-cell"></th>
            <th class="header-cell"></th>
          </tr>
        </thead>
        <tbody>
          <tr 
            v-for="(item, index) in lobbyList" 
            :key="index" 
            class="body-row"
            @click="logLobbyId(item.idLobby)"  
          >
            <td class="body-cell">
              <v-row>
                <p class="ml-2">{{ item.stadium }}</p>
              </v-row>
            </td>
            <td class="body-cell">
              <v-row>
                <p class="ml-2">{{ item.name }}</p>
              </v-row>
            </td>
            <td class="body-cell">
              <v-row>
                <p class="ml-2">{{ item.time }}</p>
              </v-row>
            </td>
            <td class="body-cell action-cell">
              <v-btn x-small color="success" class="confirm-button" @click.stop="openConfirmationModal(item.idLobby)"> ยืนยัน </v-btn>
            </td>
            <td class="body-cell action-cell">
              <v-btn x-small color="error" class="cancel-button" @click.stop="openCancelModal(item.idLobby)">ยกเลิก </v-btn>
            </td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>

    <!-- Log Lobby Modal -->
    <div class="modal" v-if="showLogModal">
      <div class="modal-background" @click="closeLogModal"></div>
      <div class="modal-content large-modal">
        <span class="close" @click="closeLogModal">&times;</span>
        <h2>Lobby Details</h2>
        <v-row>
          <v-col cols="4">
            <strong>Lobby ID:</strong>
          </v-col>
          <v-col cols="8">
            {{ selectedLobbyId }}
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="4">
            <strong>Court:</strong>
          </v-col>
          <v-col cols="8">
            {{ filteredJoinList.length > 0 ? filteredJoinList[0].court : 'N/A' }}
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="4">
            <strong>Time:</strong>
          </v-col>
          <v-col cols="8">
            {{ filteredJoinList.length > 0 ? filteredJoinList[0].time : 'N/A' }}
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="4">
            <strong>Member:</strong>
          </v-col>
          <v-col cols="8">
            <ul>
              <li v-for="(item, index) in filteredJoinList" :key="index">
                {{ item.name }} - {{item.id}}
              </li>
            </ul>
          </v-col>
        </v-row>
        <div class="modal-actions">
          <v-btn x-small color="blue" class="confirm-button" @click="closeLogModal"> ปิด </v-btn>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showLogModal: false, // For showing log modal
      showCancelModal: false, // For cancellation modal
      showConfirmationModal: false, // For confirmation modal
      selectedLobbyId: null, // To store the selected lobby ID
      filteredJoinList: [], // To store the filtered data from joinList
      court: [],
      lobbyList: [
        {
          stadium: "สนามบาสเก็ตบอล",
          name: "ณพล ศรีสุวรรณ",
          time: "09:00 - 10:00",
          idLobby: "a001",
        },
        {
          stadium: "สนามวอลเลบอล",
          name: "เดช เดชาบูรพา",
          time: "11:00 - 12:00",
          idLobby: "a002",
        },
        {
          stadium: "สนามฟุตซอล",
          name: "ศุภชัย พีระชัยรัตน์",
          time: "15:00 - 16:00",
          idLobby: "a003",
        },
        {
          stadium: "สนามแบตมินตัน",
          name: "เอก ยิ่งเจริญ",
          time: "14:00 - 15:00",
          idLobby: "a004",
        },
      ],
      joinList: [
        {
          id: "1",
          court : "02",
          name: "ณพล ศรีสุวรรณ",
          idLobby: "ASD123",
          time : "09:00 - 10:00"
        },
        {
          id: "2",
          court : "02",
          name: "เดช เดชาบูรพา",
          idLobby: "ASD123",
          time : "11:00 - 12:00"
        },
        {
          id: "3",
          court : "02",
          name: "ศุภชัย พีระชัยรัตน์",
          idLobby: "ASD123",
          time : "15:00 - 16:00"
        },
        {
          id: "4",
          court : "02",
          name: "เอก ยิ่งเจริญ",
          idLobby: "ASD123",
          time : "14:00 - 15:00"
        }
      ],
      OpsTime: { OpenTime: null, CloseTime: null, ArrTime: [] },
    };
  },
   mounted() {
    this.API();
  },
  methods: {
    API() {
      const options = {
        url: `http://localhost:4000/getBookingForApprove`,
        method: "GET",
      };
      this.$axios(options).then((res) => {
        //store all data
        this.lobbyList = res.data.data;
        console.log(this.lobbyList);
        console.log("API connected");
      });
    },
    openCancelModal(idLobby) {
      this.selectedLobbyId = idLobby; // Store the clicked lobby ID
      this.showCancelModal = true; // Show the cancellation modal
    },
    closeCancelModal() {
      this.showCancelModal = false; // Close the cancellation modal
    },
   openConfirmationModal(idLobby) {
  this.selectedLobbyId = idLobby; // Store the clicked lobby ID
  console.log(idLobby);

  // Immediately send the POST request to confirm the booking when the modal is opened
  const options = {
    url: `http://localhost:4000/confirmBookingAdmin`, // Backend endpoint
    method: "POST",
    data: {
      idLobby: this.selectedLobbyId, // Send the selected lobby ID for confirmation
    },
  };

  // Make the Axios POST request to confirm the booking
  this.$axios(options)
    .then((res) => {
      console.log("Booking confirmed:", res.data);
      this.showConfirmationModal = false; // Close the confirmation modal if successful
      // Optionally refresh the list or notify the user
    })
    .catch((error) => {
      console.error("Error confirming booking: ", error);
    });

  // Optionally, show the modal, though in this case, the confirmation happens directly
  this.showConfirmationModal = true;
},

    closeConfirmationModal() {
      this.showConfirmationModal = false; // Close the confirmation modal
    },
    logLobbyId(idLobby) {
  console.log("Clicked idLobby:", idLobby);
  this.selectedLobbyId = idLobby; // Store the clicked lobby ID

  // Set up the request options with query params
  const options = {
    url: `http://localhost:4000/getDetailBooking`,
    method: "GET",
    params: {
      court_id: this.selectedLobbyId, // Pass the selectedLobbyId as court_id param
    },
  };

  // Make the Axios GET request
  this.$axios(options).then((res) => {
    // Store all data received from the API
    this.joinList = res.data.data;
    console.log(this.joinList);
    console.log("API connected");

    // Filter the joinList based on the selected lobby ID
    this.filteredJoinList = this.joinList.filter(item => item.idLobby === idLobby);

    // Show the log modal
    this.showLogModal = true;
  }).catch((error) => {
    console.error("API Error: ", error);
  });
}
,
    closeLogModal() {
      this.showLogModal = false; // Close the log modal
    },
    confirmBooking() {
      console.log("Confirmed booking for Lobby ID:", this.selectedLobbyId);
      this.showConfirmationModal = false; // Close confirmation modal after action
    },
  },
};
</script>

<style scoped>
.custom-table {
  width: 100%;
  border-collapse: collapse;
}

.header-cell {
  background-color: #455a64; /* Medium blue-gray for the header */
  color: #ffffff; /* White text color */
  padding: 8px;
  text-align: center;
}

.body-row:nth-child(even) {
  background-color: #e3f2fd; /* Very light blue for even rows */
}

.body-row:nth-child(odd) {
  background-color: #ffffff; /* White for odd rows */
}

.body-cell {
  padding: 8px;
  text-align: center;
  color: #37474f; /* Dark blue-gray text */
}

.action-cell {
  padding: 4px;
}

.confirm-button {
  background-color: #66bb6a !important; /* Soft green */
  color: #ffffff !important;
}

.cancel-button {
  background-color: #ef5350 !important; /* Soft red */
  color: #ffffff !important;
}

/* Modal Styling */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); /* Dark overlay */
}

.modal-content {
  position: relative;
  background-color: #ffffff;
  padding: 30px; /* Increased padding for larger modal */
  border-radius: 8px;
  width: 600px; /* Larger width */
  max-width: 90%;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.large-modal {
  width: 800px; /* Set a wider width for larger modal */
  max-width: 90%;
}

.close {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 24px;
  cursor: pointer;
  color: #d32f2f; /* Red color for the close button */
}

.cancel-reason-input {
  width: 100%;
  height: 100px;
  margin-top: 10px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  resize: none;
}

.modal-actions {
  margin-top: 15px;
  text-align: right;
}

.modal-actions v-btn {
  width: 70px;
  height: 40px;
}
</style>
