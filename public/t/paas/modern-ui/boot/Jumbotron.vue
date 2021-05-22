<!-- Create By xBoson System -->
<template><doc>


<h2>Hero大块屏(Jumbotron)</h2>
<demo :x='x'><a v-pre><div>
  <b-jumbotron header="BootstrapVue" lead="Bootstrap v4 Components for Vue.js 2">
    <p>For more information visit website</p>
    <b-button variant="primary" href="#">More Info</b-button>
  </b-jumbotron>
</div>
</a></demo>

<h3>使用插槽</h3>
<demo :x='x'><a v-pre><div>
  <b-jumbotron>
    <template v-slot:header>BootstrapVue</template>

    <template v-slot:lead>
      This is a simple hero unit, a simple jumbotron-style component for calling extra attention to
      featured content or information.
    </template>

    <hr class="my-4">

    <p>
      It uses utility classes for typography and spacing to space content out within the larger
      container.
    </p>

    <b-button variant="primary" href="#">Do Something</b-button>
    <b-button variant="success" href="#">Do Something Else</b-button>
  </b-jumbotron>
</div>
</a></demo>

<h3>变量</h3>
<demo :x='x'><a v-pre><div>
  <b-jumbotron bg-variant="info" text-variant="white" border-variant="dark">
    <template v-slot:header>BootstrapVue</template>

    <template v-slot:lead>
      This is a simple hero unit, a simple jumbotron-style component for calling extra attention to
      featured content or information.
    </template>

    <hr class="my-4">

    <p>
      It uses utility classes for typography and spacing to space content out within the larger
      container.
    </p>
  </b-jumbotron>
</div>
</a></demo>

  
</doc></template>

<script>
let x = {};
export default {
  data() {
    return {x};
  }
}
</script>

<style>
</style>