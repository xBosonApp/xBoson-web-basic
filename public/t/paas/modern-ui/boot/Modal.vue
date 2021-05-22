<!-- Create By xBoson System -->
<template><doc>


<h2>弹出模式框(Modal)</h2>
<demo :x='x'><a v-pre><div>
  <b-button v-b-modal.modal-1>Launch demo modal</b-button>

  <b-modal id="modal-1" title="BootstrapVue">
    <p class="my-4">Hello from modal!</p>
  </b-modal>
</div>
</a></demo>

<h3>切换模式可见性</h3>
<demo :x='x'><a v-pre><div>
  <!-- Using modifiers -->
  <b-button v-b-modal.my-modal>Show Modal</b-button>

  <!-- Using value -->
  <b-button v-b-modal="'my-modal'">Show Modal</b-button>

  <!-- The modal -->
  <b-modal id="my-modal">Hello From My Modal!</b-modal>
</div>
</a></demo>

<h3>使用 this.$bvModal.show() 和 this.$bvModal.hide()实例方法</h3>
<demo :x='x'><a v-pre><div>
  <b-button id="show-btn" v-on:click="$bvModal.show('bv-modal-example')">Open Modal</b-button>

  <b-modal id="bv-modal-example" hide-footer>
    <template v-slot:modal-title>
      Using <code>$bvModal</code> Methods
    </template>
    <div class="d-block text-center">
      <h3>Hello From This Modal!</h3>
    </div>
    <b-button class="mt-3" block v-on:click="$bvModal.hide('bv-modal-example')">Close Me</b-button>
  </b-modal>
</div>
</a></demo>

<h3>使用 show(), hide(), 和 toggle()组件方法</h3>
<demo :x='x'><a v-pre><template>
  <div>
    <b-button id="show-btn" v-on:click="showModal">Open Modal</b-button>
    <b-button id="toggle-btn" v-on:click="toggleModal">Toggle Modal</b-button>

    <b-modal ref="my-modal" hide-footer title="Using Component Methods">
      <div class="d-block text-center">
        <h3>Hello From My Modal!</h3>
      </div>
      <b-button class="mt-3" variant="outline-danger" block v-on:click="hideModal">Close Me</b-button>
      <b-button class="mt-2" variant="outline-warning" block v-on:click="toggleModal">Toggle Me</b-button>
    </b-modal>
  </div>
</template>
</a></demo>

<h3>使用 v-model 属性</h3>
<demo :x='x'><a v-pre><template>
  <div>
    <b-button v-on:click="modalShow = !modalShow">Open Modal</b-button>

    <b-modal v-model="modalShow">Hello From Modal!</b-modal>
  </div>
</template>
</a></demo>

  
  
</doc></template>

<script>
let x = {
    methods: {
      showModal() {
        this.$refs['my-modal'].show()
      },
      hideModal() {
        this.$refs['my-modal'].hide()
      },
      toggleModal() {
        // We pass the ID of the button that we want to return focus to
        // when the modal has hidden
        this.$refs['my-modal'].toggle('#toggle-btn')
      }
    },
    data() {
      return {
        modalShow: false
      }
    },
  };
export default {
  data() {
    return {x};
  }
}
</script>

<style>
</style>