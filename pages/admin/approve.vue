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
      <div class="modal-content">
        <span class="close" @click="closeLogModal">&times;</span>
        <h2>LOBBY ID: {{ selectedLobbyId }}</h2> <!-- Dynamically display the selected Lobby ID -->
        <div class="modal-actions">
          <v-btn x-small color="blue" class="confirm-button" @click="closeLogModal"> ปิด </v-btn>
        </div>
      </div>
    </div>

    <!-- First Modal (Cancellation) -->
    <div class="modal" v-if="showCancelModal">
      <div class="modal-background" @click="closeCancelModal"></div>
      <div class="modal-content">
        <span class="close" @click="closeCancelModal">&times;</span>
        <h2>สาเหตุที่ต้องการยกเลิก</h2>
        <p>Lobby ID: {{ selectedLobbyId }}</p> <!-- Show the selected lobby id -->
        <textarea placeholder="สาเหตุที่ต้องการยกเลิก..." class="cancel-reason-input"></textarea>
        <div class="modal-actions">
          <v-btn x-small color="green" class="confirm-button" @click="closeCancelModal"> ยืนยัน </v-btn>
        </div>
      </div>
    </div>

    <!-- Second Modal (Confirmation or Other Action) -->
    <div class="modal" v-if="showConfirmationModal">
      <div class="modal-background" @click="closeConfirmationModal"></div>
      <div class="modal-content">
        <span class="close" @click="closeConfirmationModal">&times;</span>
        <h2>ยืนยันการจอง</h2>
        <p>คุณต้องการยืนยันการจองสำหรับ Lobby ID: {{ selectedLobbyId }}?</p>
        <div class="modal-actions">
          <v-btn x-small color="blue" class="confirm-button" @click="confirmBooking"> ยืนยัน </v-btn>
          <v-btn x-small color="red" class="cancel-button" @click="closeConfirmationModal"> ยกเลิก </v-btn>
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
      this.showConfirmationModal = true; // Show the confirmation modal
    },
    closeConfirmationModal() {
      this.showConfirmationModal = false; // Close the confirmation modal
    },
    logLobbyId(idLobby) {
      console.log("Clicked idLobby:", idLobby);
      this.selectedLobbyId = idLobby; // Store the clicked lobby ID
      this.showLogModal = true; // Show the log modal
    },
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
  padding: 20px;
  border-radius: 8px;
  width: 400px;
  max-width: 90%;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
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
