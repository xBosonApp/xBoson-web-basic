<!-- Create By xBoson System -->

<template>
  <a-select :value="value" @change="up" :showSearch='true' :allowClear='true'>
    <a-select-opt-group v-for='g in group'>
      <span slot="label">{{g.name}}</span>
      <a-select-option v-for='icon in g.list' :value="icon">
        <a-icon :type="icon"></a-icon> {{icon}}
      </a-select-option>
    </a-select-opt-group>
  </a-select>
</template>

<script>
let group = [];

p('方向', "step-backward","step-forward","fast-backward","fast-forward","shrink","arrows-alt","down","up","left","right","caret-up","caret-down","caret-left","caret-right","up-circle","down-circle","left-circle","right-circle","double-right","double-left","vertical-left","vertical-right","vertical-align-top","vertical-align-middle","vertical-align-bottom","forward","backward","rollback","enter","retweet","swap","swap-left","swap-right","arrow-up","arrow-down","arrow-left","arrow-right","play-circle","up-square","down-square","left-square","right-square","login","logout","menu-fold","menu-unfold","border-bottom","border-horizontal","border-inner","border-outer","border-left","border-right","border-top","border-verticle","pic-center","pic-left","pic-right","radius-bottomleft","radius-bottomright","radius-upleft","radius-upright","fullscreen","fullscreen-exit");

p('提示建议', "question","question-circle","plus","plus-circle","pause","pause-circle","minus","minus-circle","plus-square","minus-square","info","info-circle","exclamation","exclamation-circle","close","close-circle","close-square","check","check-circle","check-square","clock-circle","warning","issues-close","stop");

p('编辑', "edit","form","copy","scissor","delete","snippets","diff","highlight","align-center","align-left","align-right","bg-colors","bold","italic","underline","strikethrough","redo","undo","zoom-in","zoom-out","font-colors","font-size","line-height","dash","small-dash","sort-ascending","sort-descending","drag","ordered-list","unordered-list","radius-setting","column-width","column-height");

p('数据', "area-chart","pie-chart","bar-chart","dot-chart","line-chart","radar-chart","heat-map","fall","rise","stock","box-plot","fund","sliders");

p('通用', "inbox","key","laptop","link","line","loading-3-quarters","loading","man","menu","monitor","more","number","percentage","paper-clip","pound","poweroff","pull-request","qrcode","reload","safety","robot","scan","search","select","shake","share-alt","shopping-cart","solution","sync","table","team","to-top","trademark","transaction","upload","user-add","user-delete","usergroup-add","user","usergroup-delete","wifi","woman");

function p() {
  let name = arguments[0];
  let list = [];
  for (let i=1; i<arguments.length; ++i) {
    list.push(arguments[i]);
  }
  group.push({ name, list });
}

export default {
  props: ['value'],
  
  data() {
    return {
      group,
    }
  },
  
  methods: {
    up(v) {
      this.$emit('input', v || '');
    }
  }
}
</script>

<style>
</style>