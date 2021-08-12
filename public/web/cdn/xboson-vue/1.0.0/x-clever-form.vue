<!-- Create By xBoson System -->

<template>
<div>
  <v-dialog
    v-model="showMsg"
    fullscreen
    hide-overlay
    transition="dialog-bottom-transition"
  >
    <v-card>
      <v-toolbar
        :color="isError ? error : primary"
      >表单返回</v-toolbar>
      <v-card-text>
        <div class="text-h2 pa-12">{{ message }}</div>
      </v-card-text>
      <v-card-actions class="justify-end">
        <v-btn
          text
          @click="showMsg = false"
        >关闭</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  
  <v-form ref='form' v-model="value">
    <slot></slot>
    <div style='sp'>
      <v-btn color="primary" @click='submit'>递交</v-btn>
      <v-btn @click='reset'>重置</v-btn>
    </div>
  </v-form>
</div>
</template>

<script>
export default {
  props: ['value', 'url'],
  
  data() {
    return {
      message : '',
      showMsg : false,
      isError : false,
    };
  },
  
  mounted() {
    //..
  },
  
  methods: {
    validate() {
      return this.$refs.form.validate();
    },
    
    submit() {
      if (this.validate()) {
        this.callApi();
      }
    },
    
    callApi() {
      let data = new FormData(form);
      let xhr = new XMLHttpRequest();
      
      xhr.addEventListener('load', this.apiCheck);
      xhr.addEventListener('error', this.apiError);
      
      xhr.open("GET", this.url);
      xhr.send(data);
    },
    
    apiCheck() {
      try {
        switch (xhr.status) {
          case 200:
            this.apiSuccess(xhr);
            return;
            
          default:
            this.apiError(new Error(xhr.responseText || xhr.statusText));
            return;
        }
      } catch(err) {
        this.apiError(err);
      }
    },
    
    apiSuccess(xhr) {
      let ct = xhr.getResponseHeader("Content-Type");
      let i = ct.indexOf(';');
      if (i >= 0) {
        ct = ct.substr(0, i);
      }
      
      switch (ct) {
        default:
          this.message = xhr.responseText;
          break;
          
        case 'text/html':
          //TODO 显示原始 html
          this.message = xhr.responseText;
          break;
          
        case 'application/json':
          try {
            let d = JSON.stringify();
            this.message = d.msg;
            this.isError = d.code != 0;
          } catch(err) {
            this.apiError(err);
          }
          break;
      }
      this.showMsg = true;
    },
    
    apiError(err) {
      this.message = err.message;
      this.isError = true;
      this.showMsg = true;
      console.error(err);
    },
    
    reset() {},
  },
}
</script>

<style scoped>
.sp {
  border-top: 1px dashed #eee;
}
</style>