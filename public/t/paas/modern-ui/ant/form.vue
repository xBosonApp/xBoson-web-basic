<!-- Create By xBoson System -->

<template><doc>
  
<h2>Form 表单</h2>
<demo :x='x'><a v-pre>
  <template>
  <a-form :label-col="labelCol" :wrapper-col="wrapperCol">
    <a-form-item
      label="Fail"
      validate-status="error"
      help="Should be combination of numbers & alphabets"
    >
      <a-input id="error" placeholder="unavailable choice" />
    </a-form-item>
    <a-form-item label="Warning" validate-status="warning">
      <a-input id="warning" placeholder="Warning" />
    </a-form-item>
    <a-form-item
      label="Validating"
      has-feedback
      validate-status="validating"
      help="The information is being validated..."
    >
      <a-input id="validating" placeholder="I'm the content is being validated" />
    </a-form-item>
    <a-form-item label="Success" has-feedback validate-status="success">
      <a-input id="success" placeholder="I'm the content" />
    </a-form-item>
    <a-form-item label="Warning" has-feedback validate-status="warning">
      <a-input id="warning2" placeholder="Warning" />
    </a-form-item>
    <a-form-item
      label="Fail"
      has-feedback
      validate-status="error"
      help="Should be combination of numbers & alphabets"
    >
      <a-input id="error2" placeholder="unavailable choice" />
    </a-form-item>
    <a-form-item label="Success" has-feedback validate-status="success">
      <a-date-picker style="width: 100%" />
    </a-form-item>
    <a-form-item label="Warning" has-feedback validate-status="warning">
      <a-time-picker style="width: 100%" />
    </a-form-item>
    <a-form-item label="Error" has-feedback validate-status="error">
      <a-select default-value="1">
        <a-select-option value="1">
          Option 1
        </a-select-option>
        <a-select-option value="2">
          Option 2
        </a-select-option>
        <a-select-option value="3">
          Option 3
        </a-select-option>
      </a-select>
    </a-form-item>
    <a-form-item
      label="Validating"
      has-feedback
      validate-status="validating"
      help="The information is being validated..."
    >
      <a-cascader :default-value="['1']" :options="[]" />
    </a-form-item>
    <a-form-item label="inline" style="margin-bottom:0;">
      <a-form-item
        validate-status="error"
        help="Please select the correct date"
        :style="{ display: 'inline-block', width: 'calc(50% - 12px)' }"
      >
        <a-date-picker style="width: 100%" />
      </a-form-item>
      <span :style="{ display: 'inline-block', width: '24px', textAlign: 'center' }">
        -
      </span>
      <a-form-item :style="{ display: 'inline-block', width: 'calc(50% - 12px)' }">
        <a-date-picker style="width: 100%" />
      </a-form-item>
    </a-form-item>
    <a-form-item label="Success" has-feedback validate-status="success">
      <a-input-number style="width: 100%" />
    </a-form-item>
    <a-form-item label="Success" has-feedback validate-status="success">
      <a-input allow-clear placeholder="with allowClear" />
    </a-form-item>

    <a-form-item label="Warning" has-feedback validate-status="warning">
      <a-input-password placeholder="with input password" />
    </a-form-item>

    <a-form-item label="Error" has-feedback validate-status="error">
      <a-input-password allow-clear placeholder="with input password and allowClear" />
    </a-form-item>
  </a-form>
</template>
</a></demo>

<h3>登录框</h3>
<demo><a v-pre>
  <a-form
    id="components-form-demo-normal-login"
    :form="form"
    class="login-form"
  >
    <a-form-item>
      <a-input
        v-decorator="[
          'userName',
          { rules: [{ required: true, message: 'Please input your username!' }] },
        ]"
        placeholder="Username"
      >
        <a-icon slot="prefix" type="user" style="color: rgba(0,0,0,.25)" />
      </a-input>
    </a-form-item>
    <a-form-item>
      <a-input
        v-decorator="[
          'password',
          { rules: [{ required: true, message: 'Please input your Password!' }] },
        ]"
        type="password"
        placeholder="Password"
      >
        <a-icon slot="prefix" type="lock" style="color: rgba(0,0,0,.25)" />
      </a-input>
    </a-form-item>
    <a-form-item>
      <a-checkbox
        v-decorator="[
          'remember',
          {
            valuePropName: 'checked',
            initialValue: true,
          },
        ]"
      >
        Remember me
      </a-checkbox>
      <a class="login-form-forgot" href="">
        Forgot password
      </a>
      <a-button type="primary" html-type="submit" class="login-form-button">
        Log in
      </a-button>
      Or
      <a href="">
        register now!
      </a>
    </a-form-item>
  </a-form>
</a></demo>
  
</doc></template>

<script>
export default {
  data() {
    return {
      x:{
        data:{
          labelCol: {
            xs: { span: 24 },
            sm: { span: 5 },
          },
          wrapperCol: {
            xs: { span: 24 },
            sm: { span: 12 },
          },
          form:null,
        },
      }
    };
  },
};
</script>


<style>
#components-form-demo-normal-login .login-form {
  max-width: 300px;
}
#components-form-demo-normal-login .login-form-forgot {
  float: right;
}
#components-form-demo-normal-login .login-form-button {
  width: 100%;
}
</style>