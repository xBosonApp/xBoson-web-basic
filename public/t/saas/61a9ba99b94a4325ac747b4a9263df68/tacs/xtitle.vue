<!-- Create By xBoson System -->

<template>
  <div class='menu' ref='menu'>
    <div class='menu-item lf'>
      <div style="padding-top:10px;">
        <router-link to="/p1"><div class="button fire">设备状态总览</div></router-link>
        <!--<dv-border-box-12 class="button ice">-->
        <!--  <router-link to="/p1" class='txt'>设备状态总览</router-link>-->
        <!--</dv-border-box-12>-->
      </div>
      
      <div style="padding-top:10px;">
        <router-link to="/p2"><div class="button ice">设备预警</div></router-link>
        <!--<dv-border-box-12 class='i'>-->
        <!--  <router-link to="/p2" class='txt'>设备预警</router-link>-->
        <!--</dv-border-box-12>-->
      </div>
    </div>
    
    <h1 class='ti'><b class='txt ti_b'>TACS数据中心【6号线】</b></h1>
    
    <div class='menu-item ri'>
      <div style="padding-top:10px;">
        <router-link to="/p3"><div class="button fire">数据分析</div></router-link>
        <!--<dv-border-box-12 class='i'>-->
        <!--  <router-link to="/p3" class='txt'>数据分析</router-link>-->
        <!--</dv-border-box-12>-->
      </div>
      
      <div style="padding-top:10px;">
        <!--<router-link to="/p4"><div class="button ice button-lg">系统优化</div></router-link>-->
        <button class="button1 button-danger button-lg">系统优化</button>
        
        <!--<dv-border-box-12 class='i'>-->
        <!--  <router-link to="/p4" class='txt'>系统优化</router-link>-->
        <!--</dv-border-box-12>-->
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



.button {
    text-decoration: none;
    border: 1px solid green;
    -webkit-backdrop-filter: blur(10px);
    backdrop-filter: blur(10px);
    -webkit-transform: skewX(-10deg);
    transform: skewX(-10deg);
    height: 32px;
    width: 180px;
    border-radius: 20px 5px 20px 0px;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
    font: 15px sans-serif;
    font-weight: 300;
    text-shadow: 0 0 20px #fff;
    text-transform: uppercase;
    -webkit-animation: breath2 2s 0.5s infinite alternate;
    animation: breath2 2s 0.5s infinite alternate;
    transition: all 0.2s ease;
    cursor: pointer;
}

.button:before {
    content: "";
    display: block;
    width: calc(100% - 22px);
    height: calc(32px - 8px);
    -webkit-animation: breath 2s infinite alternate;
    animation: breath 2s infinite alternate;
    left: 10px;
    top: 3px;
    position: absolute;
    background-color: transparent;
    border: 1px solid #fff;
    border-radius: 15px 3px 15px 3px;
}

.button.fire {
    border-color: #ffeca8;
    background-image: linear-gradient(to bottom, rgba(255, 138, 48, 0.6), rgba(240, 96, 29, 0.6));
    box-shadow: 0 0 70px rgba(255, 138, 48, 0.6), 0 5px 20px rgba(255, 138, 48, 0.6), inset 0 1px #ffeca8, inset 0 -1px #ffeca8;
    color: #ffeca8;
}

.button.fire:before {
    box-shadow: inset 0 0 30px 0 #ffeca8;
}

.button.ice {
    border-color: #a8ecff;
    background-image: linear-gradient(to bottom, rgba(48, 138, 255, 0.5), rgba(29, 96, 240, 0.5));
    box-shadow: 0 0 70px rgba(48, 138, 255, 0.5), 0 5px 20px rgba(48, 138, 255, 0.5), inset 0 1px #ffeca8, inset 0 -1px #ffeca8;
    color: #a8ecff;
}

.button.ice:before {
    box-shadow: inset 0 0 30px 0 #a8ecff;
}

.button:hover.fire {
    box-shadow: 0 0 70px rgba(255, 138, 48, 0.8), 0 5px 20px rgba(255, 138, 48, 0.8), inset 0 1px #ffeca8, inset 0 -1px #ffeca8;
}

.button:hover.fire:before {
    box-shadow: inset 0 0 50px 0 #ffeca8;
}

.button:hover.ice {
    box-shadow: 0 0 70px rgba(48, 138, 255, 0.8), 0 5px 20px rgba(48, 138, 255, 0.8), inset 0 1px #a8ecff, inset 0 -1px #a8ecff;
}

.button:hover.ice:before {
    box-shadow: inset 0 0 50px 0 #a8ecff;
}

.button + .button {
    margin-top: 15px;
    -webkit-animation-delay: 0.3s;
    animation-delay: 0.3s;
}

@-webkit-keyframes breath {
    0% {
        -webkit-transform: scaleX(1);
        transform: scaleX(1);
    }

    100% {
        -webkit-transform: scaleX(0.95);
        transform: scaleX(0.95);
    }
}

@keyframes breath {
    0% {
        -webkit-transform: scaleX(1);
        transform: scaleX(1);
    }

    100% {
        -webkit-transform: scaleX(0.95);
        transform: scaleX(0.95);
    }
}

@-webkit-keyframes breath2 {
    0% {
        -webkit-transform: skewX(-10deg) scaleX(1);
        transform: skewX(-10deg) scaleX(1);
    }

    100% {
        -webkit-transform: skewX(-10deg) scaleX(0.95);
        transform: skewX(-10deg) scaleX(0.95);
    }
}

@keyframes breath2 {
    0% {
        -webkit-transform: skewX(-10deg) scaleX(1);
        transform: skewX(-10deg) scaleX(1);
    }

    100% {
        -webkit-transform: skewX(-10deg) scaleX(0.95);
        transform: skewX(-10deg) scaleX(0.95);
    }
}

.ref {
    -webkit-backdrop-filter: blur(10px);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.6);
    border-radius: 3px;
    padding: 5px 8px;
    position: absolute;
    font-size: 16px;
    bottom: 10px;
    right: 10px;
    color: #fff;
    font-weight: 300;
    font-family: sans-serif;
    text-decoration: none;
}

.ref::first-letter {
    font-size: 12px;
}

.button1 {
    height: 32px;
    width: 180px;
    border-radius: 2px;
    border: 0px;
    cursor: pointer;
    position: relative;
    box-shadow: inset 0 1px 0 rgb(255 255 255 / 15%), 0 1px 1px rgb(0 0 0 / 8%);
    transition: all 0.1s ease;
}
.button-lg {
    border-radius: 20px;
    display: inline-block;
    text-align: center;
    line-height: 1.42857143;
    font-size: 16px;
}
.button-danger {
    color: #fff;
    background-color: #0d3d51b3;
    border: 1px solid var(--danger-d);
}
.button-lg:before, .button-lg:after {
    content: "";
    position: absolute;
    border-radius: 20px;
    top: -2px;
    left: -2px;
    background: linear-gradient( 45deg, #fb0094, #0000ff, #00ff00, #ffff00, #ff0000, #fb0094, #0000ff, #00ff00, #ffff00, #ff0000 );
    background-size: 400%;
    width: calc(100% + 4px);
    height: calc(100% + 4px);
    z-index: -1;
    animation: animate 20s linear infinite;
}

.button-lg:after {
    filter: blur(20px);
}

@keyframes animate {
  0% {
    background-position: 0 0;
  }
  50% {
    background-position: 300% 0;
  }
  100% {
    background-position: 0 0;
  }
}

</style>