<template >
<div>
  <v-row justify="center">
      <p style="font-size:60px;">ยินดีต้อนรับเข้าสู่ระบบจองสนามกีฬา admin</p>
      
  </v-row>
  <v-col cols="12" >
  <img style="display:block; margin:auto;margin-top:50px" src="https://sv1.picz.in.th/images/2022/08/24/aSUWpP.jpg"/>
  </v-col>
</div> 
</template>
<script>
export default {
  middleware: 'auth'
}
</script>
<style scoped>
  *{
    color:black;
  }
</style>