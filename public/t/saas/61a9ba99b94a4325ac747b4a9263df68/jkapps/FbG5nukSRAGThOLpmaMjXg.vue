<!-- 这是 xboson 低代码平台自动生成的文件, 勿手动编辑 -->
<!-- Automatic(0.1) generated at Thu Aug 26 2021 11:00:17 GMT+0800 (CST) -->
<!-- http://xboson.net -->

<template>
<div>
<h1 style='text-align:center;'>病人随访表（头颈部）
</h1>
<x-url-param v-model='v$43'>URL参数
</x-url-param>
<xvs-form label-position='top' label-width='100%' inputWidth='100%' api='addFormData' :whenSuccess='[]' v-model='v$37' org='61a9ba99b94a4325ac747b4a9263df68' app='ad46646a8d424128ba3b2d6c353c8e99' mod='formdata' style='padding-left:10px;padding-right:10px;padding-bottom:10px;text-align:center;'>
<h3 style='text-align:left;font-weight:normal;font-size:18px;font-family:微软雅黑;'>1、目前有无不适
</h3>
<xvs-radio label='(1)、口腔溃疡' name='f1_1' mode='radio' :options='[{"n":"是","v":"1"},{"n":"否","v":"0"}]' style='text-align:left;'>
</xvs-radio>
<xvs-radio label='(2)、皮肤红肿、溃疡' name='f1_2' mode='radio' :options='[{"n":"是","v":"1"},{"n":"否","v":"0"}]' style='text-align:left;'>
</xvs-radio>
<xvs-radio label='(3)、吞咽困难' name='f1_3' mode='radio' :options='[{"n":"是","v":"1"},{"n":"否","v":"0"}]' style='text-align:left;'>
</xvs-radio>
<xvs-radio label='　(3.1)、进食' name='f1_3_1' mode='radio' :options='[{"n":"流食","v":"1"},{"n":"半流食","v":"2"},{"n":"全食","v":"3"}]' op='eq' opleft='f1_3' opval='1' style='text-align:left;'>
</xvs-radio>
<xvs-radio label='(4)、气套管是否拔除' name='f1_4' mode='radio' :options='[{"n":"是","v":"1"},{"n":"否","v":"0"}]' style='text-align:left;'>
</xvs-radio>
<xvs-date label='　(4.1)、拔管时间' name='f1_4_1' op='eq' type='datetime' opleft='f1_4' opval='1' style='text-align:left;'>
</xvs-date>
<xvs-radio label='(5)、鼻饲管或胃造瘘是否拔除' name='f1_5' mode='radio' :options='[{"n":"是","v":"1"},{"n":"否","v":"0"}]' style='text-align:left;'>
</xvs-radio>
<xvs-date label='　(5.1)、拔管时间' name='f1_5_1' op='eq' type='datetime' opleft='f1_5' opval='1' style='text-align:left;'>
</xvs-date>
<xvs-radio label='(6)、疼痛' name='f1_6' mode='radio' :options='[{"n":"有","v":"1"},{"n":"无","v":"0"}]' style='text-align:left;'>
</xvs-radio>
<xvs-input label='(6.1)、疼痛部位：' name='f1_6_1' :required='true' min='0' max='99' op='eq' text1='formName' opleft='f1_6' opval='1' style='text-align:left;'>文本输入
</xvs-input>
<xvs-radio label='(6.2)、较出院好转' name='f1_6_2' mode='radio' :options='[{"n":"是","v":"1"},{"n":"否","v":"0"}]' op='eq' opleft='f1_6' opval='1' style='text-align:left;'>
</xvs-radio>
<xvs-input label='(7)、有无其他不适症状' name='f1_7' min='0' max='99' text1='formName' style='text-align:left;'>文本输入
</xvs-input>
<xvs-number label='2、目前体重（Kg）' name='f2' :min='0' :max='99' :step='1' style='text-align:left;'>
</xvs-number>
<xvs-radio label='3、有无影像学复查' name='f3' mode='radio' :options='[{"n":"是","v":"1"},{"n":"否","v":"0"}]' style='text-align:left;'>
</xvs-radio>
<xvs-checkbox name='f3_1' :options='[{"n":"MRI","v":"1"},{"n":"CT","v":"2"},{"n":"超声","v":"3"}]' op='eq' opleft='f3' opval='1' style='text-align:left;'>
</xvs-checkbox>
<xvs-date label='时间' name='f3_2' op='eq' type='datetime' opleft='f3' opval='1' style='text-align:left;'>
</xvs-date>
<xvs-radio label='4、原发灶有无复发' name='f4' mode='radio' :options='[{"n":"是","v":"1"},{"n":"否","v":"0"}]' style='text-align:left;'>
</xvs-radio>
<xvs-date label='(4.1)、复发时间' name='f4_1' op='eq' type='datetime' opleft='f4' opval='1' style='text-align:left;'>
</xvs-date>
<xvs-radio label='5、有无其他器官转移' name='f5' mode='radio' :options='[{"n":"是","v":"1"},{"n":"否","v":"0"}]' style='text-align:left;'>
</xvs-radio>
<xvs-date label='时间' name='f5_1' op='eq' type='datetime' opleft='f5' opval='1' style='text-align:left;'>
</xvs-date>
<xvs-input label='部位' name='f5_2' min='0' max='99' op='eq' text1='formName' opleft='f5' opval='1' style='text-align:left;'>文本输入
</xvs-input>
<xvs-radio v-if='fc$38()' label='6、若4和（或）5有复发或转移是否采取后续治疗' name='f6' mode='radio' :options='[{"n":"是","v":"1"},{"n":"否","v":"0"}]' style='text-align:left;'>
</xvs-radio>
<xvs-checkbox label='治疗方案' name='f6_1' :options='[{"n":"手术","v":"1"},{"n":"放疗","v":"2"},{"n":"化疗","v":"3"},{"n":"生物治疗","v":"4"}]' op='eq' opleft='f6' opval='1' style='text-align:left;'>
</xvs-checkbox>
<xvs-input label='7、手术病理' name='f7' min='0' max='99' op='has' text1='formName' opleft='f6_1' opval='1' style='text-align:left;padding-bottom:auto;'>文本输入
</xvs-input>
</xvs-form>
</div>
</template>
<script>
const _cl_requires = {"elementui.js" : require("cdn/xboson-vue/1.0.0/loader/elementui.js"),"index.js" : require("xui://saas/afb9a9a1c80647e6a0d7e807f68e055a/vsmartform/index.js"),
};
export default{
props:{
},
computed:{
},
watch:{
"v$37": function(nv, ov){this.v$37.pid=this.v$43.pid /* URL参数 */
this.v$37.type=this.v$43.type /* 表单类型 */
this.v$37.tk=this.v$43.tk /* token */
},
},
data(){
return{requires: _cl_requires,v$37:null,v$43:null,
};
},
methods:{fc$38(){if (this.v$37){
return this.v$37.f4=='1'||this.v$37.f5=='1' /* 表单数据 */
}
},
},
components:{
"cl-select-api": require('./cl-select-api.vue', 1,1),
},
mounted(){
},
beforeDestroy(){
},
} 
</script>
<style scoped>
</style>