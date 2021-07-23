<!-- Create By xBoson System -->

<template>
  <div>
    <div class='x-login-form-frame'>
      <div class='head'>平台登陆</div>
      <div class='body'>
        <div class='input-item'>
          <label>用户名</label><input v-model='name' :disabled="!showButton"/>
          <div class='tip'>{{ nametip }}</div>
        </div>
        <div class='input-item'>
          <label>密码</label><input v-model='pass' type='password' :disabled="!showButton"/>
          <div class='tip'>{{ passtip }}</div>
        </div>
        <div class='input-item' v-if='captUrl'>
          <label>验证码</label><input v-model='capt'/>
          <img :src='captUrl' @click='changeCapt' class='capt'/>
        </div>
      </div>
      <div class='foot'>
        <span class='errmsg'>{{ errmsg }}</span>
        <span class='infmsg'>{{ infmsg }}</span>
        <div>
          <button @click='showAgree = true' class='norm'>用户协议</button>
          <button @click='login' :disabled='blockok' v-if='showButton'>登陆</button>
        </div>
      </div>
    </div>
    
    <a href='http://xboson.net' target='_blank' class='x-power'>Powered by xBoson</a>
    
    <x-agreement :visible='showAgree' @ok='showAgree = false'/>
  </div>
</template>

<script>
let md5 = require("cdn/md5/2.18.0/md5.min.js");

export default {

  data() {
    return {
      name : '',
      pass : '',
      capt : '',
      
      showButton: true,
      showAgree : false,
      blockok   : false,
      errmsg    : '',
      infmsg    : '',
      fail      : 0,
      captUrl   : '',
      nametip   : '请输入用户名',
      passtip   : '请输入密码',
    };
  },
  
  watch : {
    name(n, v) {
      this.blockok = !this.checkname();
    },
    
    pass(n, v) {
      this.blockok = !this.checkpass();
    }
  },
  
  methods : {
    changeCapt() {
      this.captUrl = xv.ctx_prefix +'/captcha?'+ Date.now();
    },
    
    info(err, inf) {
      if (err) {
        this.errmsg = err.message;
        this.infmsg = '';
      } else if (inf) {
        this.errmsg = '';
        this.infmsg = inf;
      } else {
        this.errmsg = this.infmsg = '';
      }
    },
    
    checkname() {
      let n = this.name;
      if (!n) {
        this.nametip = '请输入用户名';
      } else if (n.length < 4) {
        this.nametip = '用户名至少4个字符';
      } else {
        this.nametip = '';
        return true;
      }
      return false;
    },
    
    checkpass() {
      let n = this.pass;
      if (!n) {
        this.passtip = '请输入密码';
      } else if (n.length < 6) {
        this.passtip = '密码至少6个字符';
      } else {
        this.passtip = '';
        return true;
      }
      return false;
    },
    
    login() {
      this.blockok = true;
      if (!this.checkname()) return;
      if (!this.checkpass()) return;
      
      this.loginApi((ret)=>{
        this.blockok = false;
        this.showButton = false;
        this.info(null, ret.msg);
        this.$globalBus.emit('x-login-success', ret);
        this.$emit('loginSuccess', ret);
      });
    },
    
    loginApi(ok) {
      let q = {
        userid   : this.name,
        password : md5(this.pass),
        c        : this.capt,
      };
      
      this.blockok = true;
      this.$xapi(xv.ctx_prefix +'/user/login', q).then(ok).catch((err)=>{
        this.blockok = false;
        
        if (err.code == 10) {
          this.changeCapt();
        }
        else if (this.fail >= 10 && (this.fail % 3 == 0)) {
          this.changeCapt();
        }
        
        this.fail++;
        this.info(err);
        xv.popError('登陆', err);
      });
    },
  },
}
</script>

<style scoped lang='less'>
@labelWidth : 100px;

.x-power {
  color: #ccc; text-decoration: none; position: fixed; right: 5px; bottom: 5px;
  font-size: 10px; z-index: 999;
}

.x-login-form-frame {
  border: 1px solid #ddd; width: 450px; min-height: 300px; margin: 15px;
  display: flex; justify-content: space-between; flex-direction: column;
  
  .head, .foot {
    padding: 20px; background-color: #eee;
  }
  .body {
    padding: 50px 0 20px 0; border: 1px solid #ddd; border-width: 1px 0;
  }
  .foot {
    display: flex; flex-direction : row; flex-wrap: wrap; justify-content: flex-end;
  }
  .input-item {
    display: grid; grid-template-columns: @labelWidth auto; margin-bottom: 10px; gap: 1px 6px;
  }
}

.tip {
  line-height: 1em; height: 1em; grid-column: 2 / 3; color: #aaa; margin: 3px 0;
}
.capt {
  grid-column: 2 / 3;
}
.errmsg {
  color: red; margin-right: 15px;
}
.infmsg {
  color: #3c3c93; margin-right: 15px;
}

.norm {
  background-color: #6d7f8f; border-color: #6d7f8f;
}
button {
  padding: 3px 25px; color: #fff; background-color: #22639c; border-radius: 3px; 
  border: 1px solid #3696ea; opacity: 0.8;
}
button:hover {
  opacity: 1;
}
button:active {
  transform: scale(0.9);
}
button[disabled=disabled] {
  background-color: #ddd; border-color: #fff;
}
label {
  width: @labelWidth; text-align: right; display: inline-flex; margin-right: 10px;
  align-items: center; justify-content: flex-end; padding: 4px 0px; 
}
input {
  width: 300px; border-radius: 3px; border: 1px solid #acacac;
}

@media screen and (max-width: 900px) {
  .x-login-form-frame {
    margin: 0; border: 0; width: 100%;
    
    .input-item {
      grid-template-columns: 1fr;
    }
    .body {
      padding: 15px;
    }
    .foot {
      justify-content: flex-start;
    }
  }
  label { display: block; text-align: left; }
  .tip, .capt { grid-column: auto; } 
  input { line-height: 2em; }
  .errmsg, .infmsg {
    display: block;
  }
}
</style>