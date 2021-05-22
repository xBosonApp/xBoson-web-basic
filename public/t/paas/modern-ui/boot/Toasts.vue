<!-- Create By xBoson System -->
<template><doc>


<h2>冒泡推送(Toasts)</h2>
<demo :x='x'><a v-pre><template>
  <div class="p-3 bg-secondary progress-bar-striped" style="min-height: 170px;">
    <b-button class="mb-2" variant="primary" v-on:click="$bvToast.show('example-toast')">
      Show toast
    </b-button>
    <b-toast id="example-toast" title="BootstrapVue" static no-auto-hide>
      Hello, world! This is a toast message.
    </b-toast>
  </div>
</template>
</a></demo>

<h3>Toasts 需求</h3>
<demo :x='x'><a v-pre><template>
  <div>
    <b-button v-on:click="makeToast()">Show Toast</b-button>
    <b-button v-on:click="makeToast(true)">Show Toast (appended)</b-button>
  </div>
</template>
</a></demo>

<h3>Variants</h3>
<demo :x='x'><a v-pre><template>
  <div>
    <b-button v-on:click="makeToast2()" class="mb-2">Default</b-button>
    <b-button variant="primary" v-on:click="makeToast2('primary')" class="mb-2">Primary</b-button>
    <b-button variant="secondary" v-on:click="makeToast2('secondary')" class="mb-2">Secondary</b-button>
    <b-button variant="danger" v-on:click="makeToast2('danger')" class="mb-2">Danger</b-button>
    <b-button variant="warning" v-on:click="makeToast2('warning')" class="mb-2">Warning</b-button>
    <b-button variant="success" v-on:click="makeToast2('success')" class="mb-2">Success</b-button>
    <b-button variant="info" v-on:click="makeToast2('info')" class="mb-2">Info</b-button>
  </div>
</template>
</a></demo>

<h3>Toaster target</h3>
<demo :x='x'><a v-pre><template>
  <div>
    <b-button v-on:click="toast('b-toaster-top-right')" class="mb-2">b-toaster-top-right</b-button>
    <b-button v-on:click="toast('b-toaster-top-left')" class="mb-2">b-toaster-top-left</b-button>
    <b-button v-on:click="toast('b-toaster-top-center')" class="mb-2">b-toaster-top-center</b-button>
    <b-button v-on:click="toast('b-toaster-top-full')" class="mb-2">b-toaster-top-full</b-button>
    <b-button v-on:click="toast('b-toaster-bottom-right', true)" class="mb-2">b-toaster-bottom-right</b-button>
    <b-button v-on:click="toast('b-toaster-bottom-left', true)" class="mb-2">b-toaster-bottom-left</b-button>
    <b-button v-on:click="toast('b-toaster-bottom-center', true)" class="mb-2">b-toaster-bottom-center</b-button>
    <b-button v-on:click="toast('b-toaster-bottom-full', true)" class="mb-2">b-toaster-bottom-full</b-button>
  </div>
</template>
</a></demo>

<h3>component 部件</h3>
<demo :x='x'><a v-pre>
  <template>
  <div>
    <b-button v-on:click="$bvToast.show('my-toast')">Show toast</b-button>

    <b-toast id="my-toast" variant="warning" solid>
      <template v-slot:toast-title>
        <div class="d-flex flex-grow-1 align-items-baseline">
          <b-img blank blank-color="#ff5555" class="mr-2" width="12" height="12"></b-img>
          <strong class="mr-auto">Notice!</strong>
          <small class="text-muted mr-2">42 seconds ago</small>
        </div>
      </template>
      This is the content of the toast.
      It is short and to the point.
    </b-toast>
  </div>
</template>
</a></demo>

<h3>Advanced usage 高级使用</h3>
<demo :x='x'><a v-pre><template>
  <div>
    <b-button v-on:click="popToast">Show Toast with custom content</b-button>
  </div>
</template>
</a></demo>

<h3>Alerts versus toasts</h3>
<demo :x='x'><a v-pre><template>
  <div>
    <b-button size="sm" v-on:click="showBottom = !showBottom">
      {{ showBottom ? 'Hide' : 'Show' }} Fixed bottom Alert
    </b-button>
    <b-alert
      v-model="showBottom"
      class="position-fixed fixed-bottom m-0 rounded-0"
      style="z-index: 2000;"
      variant="warning"
      dismissible
    >
      Fixed position (bottom) alert!
    </b-alert>

    <b-button size="sm" v-on:click="showTop = !showTop">
      {{ showTop ? 'Hide' : 'Show' }} Fixed top Alert
    </b-button>
    <b-alert
      v-model="showTop"
      class="position-fixed fixed-top m-0 rounded-0"
      style="z-index: 2000;"
      variant="success"
      dismissible
    >
      Fixed position (top) alert!
    </b-alert>
  </div>
</template>
</a></demo>

  
  
</doc></template>

<script>
let x = {
    data() {
      return {
        toastCount: 0,
        count: 0,
        showBottom: false,
        showTop: false,
      }
    },
    methods: {
      makeToast(append = false) {
        this.toastCount++
        this.$bvToast.toast(`This is toast number ${this.toastCount}`, {
          title: 'BootstrapVue Toast',
          autoHideDelay: 5000,
          appendToast: append
        })
      },
      makeToast2(variant = null) {
        this.$bvToast.toast('Toast body content', {
          title: `Variant ${variant || 'default'}`,
          variant: variant,
          solid: true
        })
      },
      toast(toaster, append = false) {
        this.counter++
        this.$bvToast.toast(`Toast ${this.counter} body content`, {
          title: `Toaster ${toaster}`,
          toaster: toaster,
          solid: true,
          appendToast: append
        })
      },
      popToast() {
        // Use a shorter name for this.$createElement
        const h = this.$createElement
        // Increment the toast count
        this.count++
        // Create the message
        const vNodesMsg = h(
          'p',
          { class: ['text-center', 'mb-0'] },
          [
            h('b-spinner', { props: { type: 'grow', small: true } }),
            ' Flashy ',
            h('strong', 'toast'),
            ` message #${this.count} `,
            h('b-spinner', { props: { type: 'grow', small: true } })
          ]
        )
        // Create the title
        const vNodesTitle = h(
          'div',
          { class: ['d-flex', 'flex-grow-1', 'align-items-baseline', 'mr-2'] },
          [
            h('strong', { class: 'mr-2' }, 'The Title'),
            h('small', { class: 'ml-auto text-italics' }, '5 minutes ago')
          ]
        )
        // Pass the VNodes as an array for message and title
        this.$bvToast.toast([vNodesMsg], {
          title: [vNodesTitle],
          solid: true,
          variant: 'info'
        })
      },
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