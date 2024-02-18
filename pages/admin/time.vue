<template>
    <div>
    <div class="all">
          <v-form style="text-align:center">
            <v-container style="display:grid">
                <table >
                    <tr>
                        <th></th>
                        <th>09:00 - 10:00</th>
                        <th>10:00 - 11:00</th>
                        <th>11:00 - 12:00</th>
                        <th>12:00 - 13:00</th>
                        <th>13:00 - 14:00</th>
                        <th>14:00 - 15:00</th>
                        <th>15:00 - 16:00</th>
                        <th>16:00 - 17:00</th>
                    </tr>
                    <tr>
                        <td>Monday</td>
                        <td class="use"></td>
                        <td class="nuse"></td>
                        <td class="use"></td>
                        <td class="use"></td>
                        <td class="nuse"></td>
                        <td class="nuse"></td>
                        <td class="use"></td>
                        <td class="nuse"></td>
                    </tr>
                    <tr>
                        <td>Tuesday</td>
                        <td class="nuse"></td>
                        <td class="use"></td>
                        <td class="use"></td>
                        <td class="nuse"></td>
                        <td class="nuse"></td>
                        <td class="use"></td>
                        <td class="nuse"></td>
                        <td class="use"></td>
                    </tr>
                    <tr>
                        <td>Wednesday</td>
                        <td class="nuse"></td>
                        <td class="nuse"></td>
                        <td class="use"></td>
                        <td class="use"></td>
                        <td class="use"></td>
                        <td class="nuse"></td>
                        <td class="nuse"></td>
                        <td class="use"></td>
                    </tr>
                    <tr>
                        <td>Thrusday</td>
                        <td class="nuse"></td>
                        <td class="nuse"></td>
                        <td class="use"></td>
                        <td class="nuse"></td>
                        <td class="use"></td>
                        <td class="nuse"></td>
                        <td class="nuse"></td>
                        <td class="nuse"></td>
                    </tr>
                    <tr>
                        <td>Friday</td>
                        <td class="use"></td>
                        <td class="nuse"></td>
                        <td class="nuse"></td>
                        <td class="nuse"></td>
                        <td class="use"></td>
                        <td class="use"></td>
                        <td class="nuse"></td>
                        <td class="nuse"></td>
                    </tr>
                    </table>
            </v-container>
          </v-form>
          </div>
          <v-container>
              <v-row>
                  <v-col cols="2">
                      <table>
                        <tr>
                            <td class="use"></td>
                        </tr>
                    </table>
                  </v-col>
                  <v-col cols="2">
                  <p style="text-align:center">มีการจองแล้ว</p>
                  </v-col>
                  <v-col cols="2">
                      <table>
                        <tr>
                            <td class="nuse"></td>
                        </tr>
                    </table>
                  </v-col>
                  <v-col cols="2">
                  <p style="text-align:center ">ยังไม่มีจอง</p>
                  </v-col>
              </v-row>
              
          </v-container>
    </div>
</template>
<style scoped>
    *{
        color:black
    }
table, td, th {
  border: 1px solid black;
  height: 5rem;
}

table {
  width: 100%;
  border-collapse: collapse;
}
.use{
    background-color: rgb(230, 49, 49);
}
.nuse{
    background-color: rgb(97, 243, 243);
}
</style>
