<!-- Create By xBoson System -->

<template>
<div class='g4'>
  <div v-for='(cfg, i) in k' :class="{sl: cfg.list.length <= 0, sp: true}" v-if='!cfg.hide'>
    <div class='ti'>{{ cfg.title }} <span class='note rf'>{{ i }}</span></div>
    <div v-for='item in cfg.list'>
      <a href='#' @click='cfg.push(item.id)'>{{ item.name }}</a>
    </div>
    <div v-if='cfg.list.length == 0' class='note'>
      [没有数据]
    </div>
  </div>
</div>
</template>

<script>
export default {
  props: ['org', 'hideOrgSelect'],
  
  data() {
    return {
      k: {
        org: {
          title: '机构',
          value: '', 
          list : [],
          url  : '/user/getuserorg?app=ZYAPP_LOGIN&mod=ZYMODULE_LOGIN&org=',
          parm : this.orgParm,
          push : this.pushOrg,
          filter : this.filterOrg,
          hide : this.hideOrgSelect,
        },
        app: {
          title: '应用',
          value: '',
          list : [],
          url  : '@/cfb82858dc0a4598834d356c661a678f/log_request/app_select',
          parm : this.appParm,
          push : this.pushApp,
          filter : this.filterApp,
        },
        mod: {
          title: '模块',
          value: '', 
          list : [],
          url  : '@/cfb82858dc0a4598834d356c661a678f/log_request/mod_select',
          parm : this.modParm,
          push : this.pushMod,
        },
        api: {
          title: '接口',
          value: '', 
          list : [],
          url  : '@/cfb82858dc0a4598834d356c661a678f/log_request/api_select',
          parm : this.apiParm,
          push : this.pushApi,
        },
      },
      openid : null,
      openidurl : '/app/a297dfacd7a84eab9656675f61750078/19cb7c3b79e949b88a9c76396854c2b1/prjmgr/getopenid',
    };
  },
  
  mounted() {
    if (this.hideOrgSelect) {
      this.k.org.value = this.org;
      this.getData(this.k.app);
    } else {
      this.getOpenID();
    }
  },
  
  methods: {
    getOpenID() {
      this.$xapi(xv.ctx_prefix + this.openidurl, {}).then(ret=>{
        this.openid = ret.openid;
        this.getData(this.k.org);
      }).catch(this.error);
    },
    
    getUrl(cnf) {
      let url;
      if (cnf.url[0] == '@') {
        url = '/app/'+ this.k.org.value + cnf.url.substr(1);
      } else {
        url = cnf.url;
      }
      return xv.ctx_prefix + url;
    },
    
    getData(cnf) {
      this.$xapi(this.getUrl(cnf), cnf.parm()).then(ret=>{
        if (cnf.filter) {
          cnf.list = cnf.filter(ret.result);
        } else {
          cnf.list = ret.result;
        }
      }).catch(this.error);
    },
    
    filterOrg(arr) {
      return arr.map(a=>{
        return {
          id : a.orgid,
          name : a.orgnm,
        }
      });
    },
    
    filterApp(arr) {
      let ret = [];
      arr.forEach(r=>{
        r.children.forEach(c=>{
          ret.push(c);
        });
      });
      return ret;
    },
    
    error(err) {
      xv.popError("Api 选择", err);
    },
    
    orgParm() {
      return { openid: this.openid };
    },
    
    appParm() {
      return { orgid: this.k.org.value };
    },
    
    modParm() {
      return { appid: this.k.app.value };
    },
    
    apiParm() {
      return { appid: this.k.app.value, modid: this.k.mod.value };
    },
    
    pushOrg(id) {
      this.k.org.value = id;
      this.k.api.list = [];
      this.k.mod.list = [];
      this.k.app.list = [];
      this.getData(this.k.app);
    },
    
    pushApp(id) {
      this.k.app.value = id;
      this.k.api.list = [];
      this.k.mod.list = [];
      this.getData(this.k.mod);
    },
    
    pushMod(id) {
      this.k.mod.value = id;
      this.k.api.list = [];
      this.getData(this.k.api);
    },
    
    pushApi(id) {
      this.k.api.value = id;
      this.$emit('change', {
        org : this.k.org.value,
        app : this.k.app.value,
        mod : this.k.mod.value,
        api : id,
      });
    },
  },
}
</script>

<style scoped>
.g4 {
  display: grid; grid-template-columns: 1fr 1fr 1fr 1fr;
}
.ti {
  font-size: 12pt; margin-bottom: 6px;
}
.sp {
  border-left: 1px dashed #eee; padding-left: 10px;
}
.sp:first-child {
  border-width: 0;
}
.sl {
  opacity: 0.6;
}
.rf {
  margin-left: 25px;
}
</style>