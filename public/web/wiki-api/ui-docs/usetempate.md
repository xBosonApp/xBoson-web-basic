# 常用代码模板


## 添加页面模态对话框

常用文件名: create.htm add.htm

```html
<moda:frame title='创建[TITLE]'>
  <ui:form id='create' class='update_form'>
    <!-- 属性字段 -->
    <fieldset>
      <form:text name='standardname' label='文本字段' tooltip='最少1字符' width='6'>
        <vali:string min='1' max='45'/>
      </form:text>
      <form:textarea name='setcodenode' label='文本域' tooltip='最少1字符' width='6'>
        <vali:string min='1' max='45'/>
      </form:text>
      <form:select_dict name='typecd' label='选择字典' width='6'>
        <vali:string min='1' max='100'/>
      </form:select_dict>
      <!-- 修改 typecd 为字典主键, 可查字典. -->
      <form:dict name='sourceorgan' label='选择字典中的数据' tooltip='必须选择一个[TITLE]' width='6'
            typecd='NS-APP-01-ORGAN' />
    </fieldset>
    <!-- 模态按钮 -->
    <footer>
      <moda:cancel/>
      <moda:ok>
        <!-- 修改 app/mod/api 为对应接口, 当接口执行成功 更新 datatable0 表格中的数据 -->
        <form:post app='9da3e4550d1f42d3979ae30931d498c9' mod='nsdata' api='cri_create'>
          <mp:close when='this.code == 0'>
            <mp:send type='TABLE_UPDATE_REQ' id='datatable0'/>
          </mp:close>
        </form:post>
      </moda:ok>
    </footer>
  </ui:form>
</moda:frame>
```


## 修改/详情模态对话框

常用文件名: edit.htm detail.htm

```html
<moda:frame title='修改[TITLE]]'>
    <ui:form id='create' class='update_form'>
      <!-- 读取表格 datatable0 当前行的数据, 需要与 mp:loaddata 配合 -->
      <mp:loaddata id='datatable0'/>
      <!-- 属性字段 -->
      <fieldset>
        <form:text name='standardname' label='文本字段' tooltip='最少1字符' width='6'>
          <vali:string min='1' max='45'/>
        </form:text>
        <form:textarea name='setcodenode' label='文本域' tooltip='最少1字符' width='6'>
          <vali:string min='1' max='45'/>
        </form:text>
      </fieldset>
      <!-- 模态按钮 -->
      <footer>
        <moda:cancel/>
        <!-- 修改 app/mod/api 为对应接口, 当接口执行成功 更新 datatable0 表格中的数据 -->
        <moda:ok>
          <form:post app='9da3e4550d1f42d3979ae30931d498c9' mod='nsdata' api='cri_modfiy'>
            <mp:close when='this.code == 0'>
              <mp:send type='TABLE_UPDATE_REQ' id='datatable0'/>
            </mp:close>
          </form:post>
        </moda:ok>
      </footer>
    </ui:form>
</moda:frame>
```


## 列表页面

常用文件名: list.htm

```html
<ui:grid id='idid' class='list' title='[TITLE]表'>
  <ui:form id='listform'>
    <!-- 查询字段集合 -->
    <form:text name='[NAME]' label='[LABEL]名称' tooltip='模糊查询'/>
    <form:date name='dt_from' label='开始日期'/>
    <form:time name='time_from' label='开始时间' value='00:00:00'/>
    <form:status/>
    <form:br/>
    <!-- 按钮组 -->
    <form:btn_toolbar>
      <form:group>
        <form:submit label='查询'/>
        <form:reset/>
      </form:group>
      <form:group>
        <form:button label='添加' icon='magic'>
          <!-- 修改配创建数据的模态页面路径 -->
          <moda:open url='add.htm'/>
        </form:button>
        <form:button label='修改' icon='edit'>
          <!-- 修改配编辑数据的模态页面路径 -->
          <mp:usability recvid='datatable0'/>
          <moda:open url='edit.htm'/>
        </form:button>
        <form:button label='删除' icon='trash-o'>
          <mp:usability recvid='datatable0'/>
          <!-- 修改 app/mod/api 为对应接口, 当接口执行成功, 数据被删除, 并更新 datatable0 表格中的数据 -->
          <mp:delete app='9da3e4550d1f42d3979ae30931d498c9' primary='criid'
              mod='nsdata' api='cri_rm' dataid='datatable0'>
            <mp:send type='TABLE_UPDATE_REQ' id='datatable0'/>
          </mp:delete>
        </form:button>
      </form:group>
    </form:btn_toolbar>
  </ui:form>
  <!-- 当表格行被鼠标选中, 保存当前选中行的数据 -->
  <mp:savedata type='SELECT_TABLE_ROW' id='datatable0'/>
  <!-- 修改 app/mod/api 为对应查询表格数据的接口 -->
  <table:api app='9da3e4550d1f42d3979ae30931d498c9' mod='nsdata' 
      api='cri_list' form='#listform' id='datatable0'>
    <!-- 自定义字段, 如果删除全部的 mapper 可以看到原始数据表 -->
    <table:mapper label='[LABEL]' key='standardname'/>
    <!-- 数据固定有的属性 -->
    <table:mapper label='状态' key='status'><table:render_status/></table:mapper>
    <table:mapper label='更新时间' key='updatedt'/>
    <table:mapper label='创建时间' key='createdt'/>
  </table:api>
</ui:grid>
```