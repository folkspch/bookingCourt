<template>
  <div>
    <v-container fluid>
      <v-col cols="4">
      <v-card elevation="5" rounded="xl">
        <v-card-title> Login </v-card-title>
        <v-card-subtitle> Login by using ICIT Account </v-card-subtitle>
        <v-card-text>
          <v-form>
            <v-text-field v-model="user" label="USERNAME"></v-text-field>
            <v-text-field
              v-model="password"
              :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
              :type="show1 ? 'text' : 'password'"
              label="PASSWORD"
              @click:append="show1 = !show1"
            ></v-text-field>
            <v-btn color="primary">LOGIN</v-btn>
          </v-form>
        </v-card-text>
      </v-card>
      </v-col>
    </v-container>
  </div>
</template>

<script>
export default {
  layout: "loginLayout",
  data() {
    return {
      show1: false,
      user:null,
      password:null,
    };
  },
};
</script>

<style scoped>
.v-application{
  background-color: #a1cae2;
}
</style>
