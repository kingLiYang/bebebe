<template style="height:100%;">
  <div style="height:100%;">
    <!-- <pdf src="http://59.110.61.154/PDF/100001625452_6011520.PDF"></pdf> -->
    <iframe :src="src" frameborder="0" scrolling="auto" width="100%" height="700"></iframe>
  </div>
</template>
<script>
export default {
  data() {
    return {
      src: ""
    };
  },
  created() {
    let billnumber = window.localStorage.getItem("BillNumber");
    let tem = window.localStorage.getItem("SheBeiHao");
    this.src = "http://59.110.61.154/PDF/" + billnumber + "_" + tem + ".PDF";
  }
};
</script>
