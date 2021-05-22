<!-- Create By xBoson System -->

<template><doc>
  <h2>警告提示框(Alert)</h2>
  <demo :x='x'>
  <template v-pre>
  <div>
    <b-alert show>Default Alert</b-alert>

    <b-alert variant="success" show>Success Alert</b-alert>

    <b-alert v-model="showDismissibleAlert" variant="danger" dismissible>
      Dismissible Alert!
    </b-alert>

    <b-alert
      :show="dismissCountDown"
      dismissible
      variant="warning"
      v-on:dismissed="dismissCountDown=0"
      v-on:dismiss-count-down="countDownChanged"
    >
      <p>This alert will dismiss after {{ dismissCountDown }} seconds...</p>
      <b-progress
        variant="warning"
        :max="dismissSecs"
        :value="dismissCountDown"
        height="4px"
      ></b-progress>
    </b-alert>

    <b-button v-on:click="showAlert" variant="info" class="m-1">
      Show alert with count-down timer
    </b-button>
    <b-button v-on:click="showDismissibleAlert=true" variant="info" class="m-1">
      Show dismissible alert ({{ showDismissibleAlert ? 'visible' : 'hidden' }})
    </b-button>
  </div>
</template></demo>

<h3>上下文变体</h3>
<demo :x='x'><a v-pre>
  <div>
  <b-alert show variant="primary">Primary Alert</b-alert>
  <b-alert show variant="secondary">Secondary Alert</b-alert>
  <b-alert show variant="success">Success Alert</b-alert>
  <b-alert show variant="danger">Danger Alert</b-alert>
  <b-alert show variant="warning">Warning Alert</b-alert>
  <b-alert show variant="info">Info Alert</b-alert>
  <b-alert show variant="light">Light Alert</b-alert>
  <b-alert show variant="dark">Dark Alert</b-alert>
</div>
</a></demo>

<h3>警告提示框中的其他内容</h3>
<demo :x='x'><a v-pre>
  <div>
  <b-alert show variant="success">
    <h4 class="alert-heading">Well done!</h4>
    <p>
      Aww yeah, you successfully read this important alert message. This example text is going to
      run a bit longer so that you can see how spacing within an alert works with this kind of
      content.
    </p>
    <hr>
    <p class="mb-0">
      Whenever you need to, be sure to use margin utilities to keep things nice and tidy.
    </p>
  </b-alert>
</div>
</a></demo>

<h3>警告提示框中链接的颜色</h3>
<demo :x='x'><a v-pre><div>
  <b-alert show variant="primary"><a href="#" class="alert-link">Primary Alert</a></b-alert>
  <b-alert show variant="secondary"><a href="#" class="alert-link">Secondary Alert</a></b-alert>
  <b-alert show variant="success"><a href="#" class="alert-link">Success Alert</a></b-alert>
  <b-alert show variant="danger"><a href="#" class="alert-link">Danger Alert</a></b-alert>
  <b-alert show variant="warning"><a href="#" class="alert-link">Warning Alert</a></b-alert>
  <b-alert show variant="info"><a href="#" class="alert-link">Info Alert</a></b-alert>
  <b-alert show variant="light"><a href="#" class="alert-link">Light Alert</a></b-alert>
  <b-alert show variant="dark"><a href="#" class="alert-link">Dark Alert</a></b-alert>
</div></a></demo>

<h3>可忽略的警告提示框</h3>
<demo :x='x'><a v-pre><div>
  <b-alert show dismissible>
    Dismissible Alert! Click the close button over there <b>&rArr;</b>
  </b-alert>
</div></a></demo>

<h3>自动关闭警告提示框</h3>
<demo :x='x'><a v-pre><template>
  <div>
    <b-alert
      :show="dismissCountDown"
      dismissible
      variant="warning"
      v-on:dismissed="dismissCountDown=0"
      v-on:dismiss-count-down="countDownChanged"
    >
      This alert will dismiss after {{ dismissCountDown }} seconds...
    </b-alert>
    <b-button v-on:click="showAlert" variant="info" class="m-1">
      Show alert with count-down timer
    </b-button>
  </div>
</template></a></demo>

<h3>褪色警告提示框</h3>
<demo :x='x'><a v-pre><template>
  <div>
    <b-alert show dismissible fade>Dismissible Alert!</b-alert>

    <b-alert
      variant="danger"
      dismissible
      fade
      :show="showDismissibleAlert"
      v-on:dismissed="showDismissibleAlert=false"
    >
      Dismissible Alert!
    </b-alert>

    <b-alert
      :show="dismissCountDown"
      dismissible
      fade
      variant="warning"
      v-on:dismiss-count-down="countDownChanged"
    >
      This alert will dismiss after {{ dismissCountDown }} seconds...
    </b-alert>

    <b-button v-on:click="showAlert" variant="info" class="m-1">
      Show alert with count-down timer
    </b-button>
    <b-button v-on:click="showDismissibleAlert=true" variant="info" class="m-1">
      Show dismissible alert ({{ showDismissibleAlert ? 'visible' : 'hidden' }})
    </b-button>
  </div>
</template></a></demo>

</doc></template>

<script>
let x = {
    data() {
      return {
        dismissSecs: 10,
        dismissCountDown: 0,
        showDismissibleAlert: false
      }
    },
    methods: {
      countDownChanged(dismissCountDown) {
        this.dismissCountDown = dismissCountDown
      },
      showAlert() {
        this.dismissCountDown = this.dismissSecs
      }
    }
  }
export default {
  data() {
    return {x};
  }
}
</script>

<style>
</style>