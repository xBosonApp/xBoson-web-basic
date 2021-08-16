<!-- Create By xBoson System -->

<template>
<div>
  <bk img='img/bk2.jpeg'/>
  
  <dv-full-screen-container>
    <xtitle/>
    <rowrow class='f'>
      <rowcol class='row1'>
        <colcol>
          <dv-border-box-7 class="back img1">
            轨道交通线路图
          </dv-border-box-7>
        </colcol>
        <colcol><dv-border-box-7 class="back img2">车辆状态</dv-border-box-7></colcol>
      </rowcol>
      
      <rowcol class='row2'>
        <colcol><dv-border-box-7 class="back img3">C</dv-border-box-7></colcol>
        <colcol><dv-border-box-7 class="back img4">D</dv-border-box-7></colcol>
        <colcol><dv-border-box-7 class="back img5">E</dv-border-box-7></colcol>
      </rowcol>
      <rowcol class='row3'>
        <colcol><dv-border-box-7 class="back img6">C</dv-border-box-7></colcol>
      </rowcol>
    </rowrow>
  </dv-full-screen-container>
</div>
</template>

<script>
export default {
  data() {
    return {
      i:0,
    };
  },
}
</script>

<style scoped>
.f {
  height: calc(100% - 100px); width: 100%; 
}
.row1 {
  flex: none!important;
  height: 45%;
}
.row2 {
  flex: none!important;
  height: 30%;
}
.row3 {
  flex: none!important;
  height: 20%;
}
.back {
  display:table-cell;
  vertical-align:middle;
  opacity: 0.7;
  background-repeat:no-repeat;
  background-size: 100% 100%;
  background-position:center;
}
.img1 {
  background-image: url(./img/guidao.png);
}
.img2 {
  background-image: url(./img/crt.png);
}
.img3 {
  background-image: url(./img/chat01.png);
}
.img4 {
  background-image: url(./img/chat02.png);
}
.img5 {
  background-image: url(./img/chat03.png);
}
.img6 {
  background-image: url(./img/chat04.png);
}
</style>