<!-- Create By xBoson System -->

<template>
  <div class='demo-doc'>
    <slot></slot>
  </div>
</template>

<script>
export default {
}
</script>

<style lang="less">
.demo-doc {
  .preview {
    /*display: flex;*/
  }
  .block {
    /*flex: 1; padding: 2px 10px;*/
    text-align: center;
    margin: 10px;
  }
  .demonstration {
    display: block; margin: 10px;
  }
  .ftable {
    text-align: center;
  }
  .ftable td {
    padding: 10px; border-top: 1px solid #eeeeee;
  }
  
  .el-input-group {
    width: auto;
  }
  .el-input, .el-input-number {
  }
  .el-slider .el-input, .el-slider .el-input-number {
  }

  .el-header, .el-footer {
    background-color: #B3C0D1;
    color: #333;
    text-align: center;
    line-height: 60px;
  }
  
  .el-aside {
    background-color: #D3DCE6;
    color: #333;
    text-align: center;
    line-height: 200px;
  }
  
  .el-main {
    background-color: #E9EEF3;
    color: #333;
    text-align: center;
    line-height: 160px;
  }
  
  body > .el-container {
    margin-bottom: 40px;
  }
  
  .el-container:nth-child(5) .el-aside,
  .el-container:nth-child(6) .el-aside {
    line-height: 260px;
  }
  
  .el-container:nth-child(7) .el-aside {
    line-height: 320px;
  }
  
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
}
</style>