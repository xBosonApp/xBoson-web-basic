<!-- Create By xBoson System -->

<template>
<div>
  <div class='title' v-if='showTitle'>字典选择</div>
  
  <ul class="fas fa-ul">
    <li v-for='i in tree' class='it'>
      <i :class="{ fas:true, 'fa-plus-square': 1==i.isOpen, 
         'fa-minus-square': 2==i.isOpen, 'fa-genderless': 0==i.isOpen }" 
         @click='open(i)'></i> 
         
      <a href='#' @click='select(i.typecd)' class='bt'>{{ i.typenm }}</a>
      
      <x-selector-dict
        v-if='i.isOpen == 2 && i.childen && i.childen.length > 0'
        class='pv'
        :org='org'
        :parentcd='i.typecd'
        @input='select'
      />
    </li>
  </ul>
</div>
</template>

<script>
const fa = require("cdn/fontawesome/5.15.3/css/all.min.css", 1);

export default {
  props: ['value', 'org', 'parentcd', 'showTitle'],
  
  data() {
    return {
      tree: [],
      isOpen: 1,
    };
  },
  
  mounted() {
    if (this.parentcd) this.showTitle = false;
    this.update(this.parentcd || '', this.tree, this);
  },
  
  methods: {
    update(typecd, targetArr, parentSet) {
      let url = xv.ctx_prefix +'/app/'+ this.org +'/d2c8511b47714faba5c71506a5029d94/datadict/gettree';
      let parm = { typecd };
      
      this.$xapi(url, parm).then(ret=>{
        if (ret.result.length > 0) {
          ret.result.forEach(row=>{
            row.isOpen = 1;
            targetArr.push(row);
          });
        } else {
          parentSet.isOpen = 0;
        }
      });
    },
    
    open(item) {
      if (!item.childen) {
        this.$set(item, 'childen', []);
        this.update(item.typecd, item.childen, item);
      }
      
      switch (item.isOpen) {
        case 1: item.isOpen = 2; break;
        case 2: item.isOpen = 1; break;
      }
    },
    
    select(typecd) {
      this.$emit('input', typecd);
      // this.$emit('close');
    },
  },
}
</script>

<style scoped>
.title {
  font-weight: bold; border-bottom: 1px dashed #ccc;
}
.it {
  margin: 3px 0;
}
.pv {
  border-left: 1px dashed #ccc; margin-left: 6px;
}
</style>