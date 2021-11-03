<!-- Create By xBoson System -->

<template>
<div>
<div v-frag v-for="(item, i) in list" :key="i">
  <v-list-group
    no-action
    sub-group
    v-if='item.child && item.child.length' 
  >
    <template v-slot:activator>
      <v-list-item-icon>
        <v-icon v-text="item.icon" dense></v-icon>
      </v-list-item-icon>
      
      <v-list-item-content>
        <v-list-item-title>{{ item.text }}</v-list-item-title>
      </v-list-item-content>
    </template>
    
    <mainmenu :list='item.child' :deep='deep || 1'/>
  </v-list-group>
    
  <v-list-item v-else :to="item.to">
    <v-list-item-icon>
      <v-icon v-text="item.icon" dense></v-icon>
    </v-list-item-icon>

    <v-list-item-content>
      <v-list-item-title>{{ item.text }}</v-list-item-title>
    </v-list-item-content>
  </v-list-item>
</div>
</div>
</template>

<script>
export default {
  //
  // list : [ {icon, text, child, to}...]
  //
  props: ['list', 'deep'],
  components: {
    'mainmenu': require("./menu.vue", 1, 1),
  },
}
</script>

<style scoped>
</style>