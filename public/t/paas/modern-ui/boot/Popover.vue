<!-- Create By xBoson System -->
<template><doc>


<h2>指示备注(Popover)</h2>
<demo :x='x'><a v-pre><div class="text-center my-3">
  <b-button v-b-popover.hover.top="'I am popover directive content!'" title="Popover Title">
    Hover Me
  </b-button>

  <b-button id="popover-target-1">
    Hover Me
  </b-button>
  <b-popover target="popover-target-1" triggers="hover" placement="top">
    <template v-slot:title>Popover Title</template>
    I am popover <b>component</b> content!
  </b-popover>
</div>
</a></demo>

<h3>b-popover 组件基本用法</h3>
<demo :x='x'><a v-pre><template>
  <b-container fluid>
    <h5 class="my-3">Placement</h5>
    <b-row>
      <b-col
        v-for="placement in placements"
        :key="placement"
        md="4"
        class="py-4 text-center"
      >
        <b-button :id="`popover-1-${placement}`" variant="primary">{{ placement }}</b-button>
        <b-popover
          :target="`popover-1-${placement}`"
          :placement="placement"
          title="Popover!"
          triggers="hover focus"
          :content="`Placement ${placement}`"
        ></b-popover>
      </b-col>
    </b-row>

    <h5 class="my-3">Content via properties or slots</h5>
    <b-row>
      <b-col md="6" class="py-4 text-center">
        <b-button id="popover-2" variant="primary">Using properties</b-button>
        <b-popover
          target="popover-2"
          title="Prop Examples"
          triggers="hover focus"
          content="Embedding content using properties is easy"
        ></b-popover>
      </b-col>

      <b-col md="6" class="py-4 text-center">
        <b-button id="popover-3" variant="primary">Using slots</b-button>
        <b-popover target="popover-3" triggers="hover focus">
          <template v-slot:title>Content via Slots</template>
          Embedding content <span class="text-danger">using slots</span> affords you
          <em>greater <strong>control.</strong></em> and basic HTML support.
        </b-popover>
      </b-col>
    </b-row>
  </b-container>
</template>
</a></demo>


</doc></template>

<script>
let x = {
  data() {
      return {
        placements: [
          'topright',
          'top',
          'topleft',
          'bottomright',
          'bottom',
          'bottomleft',
          'righttop',
          'right',
          'lefttop',
          'rightbottom',
          'left',
          'leftbottom'
        ]
      }
    }
};
export default {
  data() {
    return {x};
  }
}
</script>

<style>
</style>