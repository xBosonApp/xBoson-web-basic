<!-- Create By xBoson System -->

<template>
  <a-collapse>
    <a-collapse-panel v-for="(c, i) in config" :key="i" :header="c.title">
      <div v-for='item in c.list'>
        <label>{{item[1]}} <span class='tip'>{{item[0]}}</span></label>
        <hr v-if='item[0]==null'/>
        
        <a-input 
          v-model='styleVal[item[0]]' v-if='item[2]==2' :placeholder='item[3]'/>
        <a-input-number
          v-model='styleVal[item[0]]' v-if='item[2]==6' :placeholder='item[3]' style='width:100%'/>
        <cl-color-picker 
          v-model="styleVal[item[0]]" v-if='item[2]==1' :default='item[3]'/>
        <cl-css-number
          v-model="styleVal[item[0]]" v-if='item[2]==3' :default='item[3]'/>
        <a-select
          v-model="styleVal[item[0]]" v-if='item[2]==4' :options='getSelectOpt(item[3])' style='width:100%' />
        <cl-css-border
          v-model="styleVal[item[0]]" v-if='item[2]==5' />
      </div>
    </a-collapse-panel>
  </a-collapse>
</template>

<script>
// 1:颜色选择器, 2:字符串, 3:css长度, 4:选项, 5:边框, 6:数字
const config = [
  { title : '文字',
    list: [
      [ 'font-family', '字体', 4, ['黑体', '宋体', '楷体', '微软雅黑', 'times', 'courier', 'arial', 'serif', 'sans-serif', 'cursive', 'fantasy', 'monospace']],
      [ 'color', '字色', 1, '#000000'],
      [ 'font-size', '字号', 3],
      [ 'font-weight', '重量', 4, {"正常":'normal', '粗体':'bold', '更粗体':'bolder', '更细':'lighter'}],
      [ 'font-style', '风格', 4, {'普通*':'normal', '斜体':'italic', '继承':'inherit'}],
      [ 'letter-spacing', '字符间距', 3],
      [ 'line-height', '行高', 3],
      [ 'text-align', '对齐', 4, {'左*':'left', '右':'right', '居中':'center', '两端':'justify', '继承':'inherit'}],
      [ 'vertical-align', '垂直对齐', 4, {'基线*':'baseline', '下标':'sub', '上标':'super', '顶端':'top', '字体顶端':'text-top', '中间':'middle', '底端':'bottom', '文本底端':'text-bottom'}],
      [ 'text-decoration', '装饰', 4, {'无*':'none', '下划线':'underline', '上划线':'overline', '删除线':'line-through', '闪烁':'blink'}],
      [ 'text-indent', '首行缩进', 3],
      [ 'text-overflow', '文本溢出', 4, {'修剪*':'clip', '显示省略号':'ellipsis'}],
      [ 'white-space', '空白', 4, {'忽略*':'normal', '保留':'pre', '不换行':'nowrap', '保留并换行':'pre-wrap', '合并空白并换行':'pre-line'}],
      [ 'word-break', '折行方式', 4, {'默认*':'normal', '可以打断单词':'break-all', '保留单词':'keep-all'}],
      [ 'font-variant', '大写字母化', 4, {'普通*':'normal', '应用':'small-caps', '继承':'inherit'}],
      [ 'direction', '文本方向', 4, {'左到右*':'ltr', '右到左':'rtl', '继承':'inherit'}],
      [ 'writing-mode', '书写方向', 4, {'水平*':'horizontal-tb', '垂直右至左':'vertical-rl', '垂直左至右':'vertical-lr'}],
      [ 'font-kerning', '字体字距', 4, {'浏览器决定*':'auto', '应用字体字距调整':'normal', '不应用字体字距调整':'none'}],
      [ 'word-spacing', '字间距', 3],
      [ 'column-count', '分列排版', 6],
      [ 'column-gap', '分列间隔', 3],
      [ 'column-rule', '分列样式', 5],
      [ 'column-span', '跨列', 6],
      [ 'column-width', '列宽', 3],
    ]
  },
  
  { title : '背景',
    list: [
      [ 'background-color', '背景色', 1, '#ffffff'],
      [ 'background-attachment', '背景固定方式', 4, {'滚动*':'scroll', '固定':'fixed', '继承':'inherit'}],
      [ 'background-blend-mode', '背景混合方式', 4, {'普通*':'normal', '相乘':'multiply', '屏幕':'screen', 
        '覆盖':'overlay', '变暗':'darken', '变亮':'lighten', '颜色减淡':'color-dodge', '饱和度':'saturation', '颜色':'color', '亮度':'luminosity' }],
      [ 'background-clip', '背景绘制区域', 4, {'裁剪到边框盒*':'border-box', '裁剪到内边距框':'padding-box', "裁剪到内容框":"content-box"}],
      [ 'background-image', '背景图像', 2, 'url(...)'],
      [ 'background-origin', '背景定位目标', 4, {'相对于内边距框':'padding-box', '相对于边框盒':'border-box', '相对于内容框':'content-box'}],
      [ 'background-position', '背景定位起点', 4, {'top left':'top left', 'top center':'top center', 'top right':'top right', 'center left':'center left', 'center center':'center center', 'center right':'center right', 'bottom left':'bottom left', 'bottom center':'bottom center', 'bottom right':'bottom right'}],
      [ 'background-repeat', '背景重复', 4, {'垂直及水平*':'repeat', '只有水平':'repeat-x', '只有垂直':'repeat-y', '没有重复':'no-repeat', '继承':'inherit'}],
      [ 'background-size', '背景尺寸', 4, {'拉伸':'cover', '平铺':'contain'}],
    ]
  },
  
  { title: '显示',
    list: [
      [ 'display', '显示方法', 4, {'内联*':'inline', '块':'block', '内联块':'inline-block', '列表':'list-item', '上下文判断':'run-in', '表格':'table', '内联表格':'inline-table', '继承':'inherit'}],
      [ 'position', '定位', 4, { '普通*':'static', '绝对定位':'absolute', '相对定位':'relative', '固定定位':'fixed', '继承':'inherit'}],
      [ 'top', '顶偏移', 3],
      [ 'bottom', '底偏移', 3],
      [ 'left', '左偏移', 3],
      [ 'right', '右偏移', 3],
      [ 'width', '宽度', 3],
      [ 'height', '高度', 3],
      [ 'float', '浮动', 4, {'不浮动*':'none', '向左浮动':'left', '向右浮动':'right', '继承':'inherit'}],
      [ 'resize', '可调整尺寸', 4, {'不能调整*':'none', '可以调整':'both', '可调整宽度':'horizontal', '可调整高度':"vertical"}],
      [ 'visibility', '可见', 4, {'可见*':'visible', '不可见':'hidden'}],
    ]
  },
  
  { title: '边界',
    list: [
      [ 'padding-top', '上内边距', 3],
      [ 'padding-bottom', '下内边距', 3],
      [ 'padding-left', '左内边距', 3],
      [ 'padding-right', '右内边距', 3],
      [ 'border-top', '上边框', 5],
      [ 'border-bottom', '下边框', 5],
      [ 'border-left', '左边框', 5],
      [ 'border-right', '右边框', 5],
      [ 'border-collapse', '边框合并 Table', 4, {'分开*':'separate', '合并':'collapse', '继承':'inherit'}],
      [ 'border-radius', '圆角', 3, 0],
      [ 'outline', '轮廓', 5],
      [ 'margin-top', '上外边距', 3],
      [ 'margin-bottom', '下外边距', 3],
      [ 'margin-left', '左外边距', 3],
      [ 'margin-right', '右外边距', 3],
    ]
  },
  
  { title: '其他',
    list: [
      [ 'caption-side', '表格标题位置', 4, {'表格顶*':'top', '表格底':'bottom', '继承':'inherit'}],
      [ 'caret-color', '光标颜色', 1],
      [ 'clear', '清除浮动元素', 4, {'允许*':'none', '清除左侧':'left', '清除右侧':'right', '不允许浮动':'both', '继承':'inherit'}],
      [ 'cursor', '光标样式', 4, ['auto', 'default', 'crosshair', 'pointer', 'move', 'e-resize', 'ne-resize', 'nw-reset', 'n-resize', 'se-resize', 'sw-resize', 's-resize', 'w-resize', 'text', 'wait', 'help']],
      [ 'opacity', '透明度 (0-1)', 6],
      [ 'overflow-x', '水平剪裁', 4, {'总是显示*':'visible', '总是剪裁':'hidden', '滚动条':'scroll', '自动':'auto', '发生剪裁时删除':'no-display'}],
      [ 'overflow-y', '垂直剪裁', 4, {'总是显示*':'visible', '总是剪裁':'hidden', '滚动条':'scroll', '自动':'auto', '发生剪裁时删除':'no-display'}],
      [ 'user-select', '选择文本', 4, {'自动*':'auto', '禁止选择':'none', '可以选择':'text', '单击选中':'all'}],
      [ 'z-index', 'Z高度', 6, 0],
    ]
  },
];

export default {
  components: {
    'cl-color-picker': require("./cl-color-picker.vue", 1, 1),
    'cl-css-number'  : require("./cl-css-number.vue", 1, 1),
    'cl-css-border'  : require("./cl-css-border.vue", 1, 1),
  },
  
  props: ['styleVal'],
  
  data() {
    return {
      config,
    };
  },
  
  methods: {
    getSelectOpt(opt) {
      let ret = [];
      if (opt.constructor == Array) {
        for (let i=0; i<opt.length; ++i) {
          ret.push({label:opt[i], value:opt[i]});
        }
      } else {
        for (let label in opt) {
          ret.push({label, value:opt[label]});
        }
      }
      return ret;
    },
  }
}
</script>

<style scoped>
hr {
  border-style: dashed; border-color: #ccc; margin: 15px 5px; border-width: 1px 0 0 0;
}
.tip {
  font-size: smaller; color: #aaa; float: right;
}
</style>