<!-- Create By xBoson System -->

<template>
  <div class='menu' ref='menu'>
    <div class='menu-item lf'>
      <div>
        <dv-border-box-12 class='i'>
          <router-link to="/p1" class='txt'>设备状态总览</router-link>
        </dv-border-box-12>
      </div>
      
      <div>
        <dv-border-box-12 class='i'>
          <router-link to="/p2" class='txt'>设备预警</router-link>
        </dv-border-box-12>
      </div>
    </div>
    
    <h1 class='ti'><b class='txt ti_b'>TACS数据中心【6号线】</b></h1>
    
    <div class='menu-item ri'>
      <div>
        <dv-border-box-12 class='i'>
          <router-link to="/p3" class='txt'>数据分析</router-link>
        </dv-border-box-12>
      </div>
      
      <div>
        <dv-border-box-12 class='i'>
          <router-link to="/p4" class='txt'>系统优化</router-link>
        </dv-border-box-12>
      </div>
    </div>
  </div>
</template>

<script>
export default {
}
</script>

<style scoped>
.menu {
  position: block; width: 100%; top: 0; left: 0;
  display: grid; grid-template-columns: 200px 678px 200px; 
  justify-content: space-between; height: 100px;
}
.ti {
  background-image: url("img/ti.png");
  background-repeat: no-repeat;
  height: 70px; margin-top: 10px;
  text-align: center;
  border-bottom: 1px solid #fff;
  border-image-source: linear-gradient(to left, #743ad5, #d53a9d);
}
.ti_b {
  font-size: 2.5em;
  text-shadow: 0 0 0px #fff, 0 0 8px #882eff, 0 0 8px #985bff, 0 0 20px #ff00de, 0 0 20px #ff00de;
}
.lf {
  text-align: left; margin-left: 10px;
}
.ri {
  text-align: right; margin-right: 20px;
}
.menu-item {
}
.menu-item .i {
  text-align: left; height: 35px; padding-top: 3px;
}
</style>