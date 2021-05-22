<!-- Create By xBoson System -->
<template><doc>


<h2>折叠面板(Collapse)</h2>
<demo :x='x'><a v-pre><div>
  <b-button v-b-toggle.collapse-1 variant="primary">Toggle Collapse</b-button>
  <b-collapse id="collapse-1" class="mt-2">
    <b-card>
      <p class="card-text">Collapse contents Here</p>
      <b-button v-b-toggle.collapse-1-inner size="sm">Toggle Inner Collapse</b-button>
      <b-collapse id="collapse-1-inner" class="mt-2">
        <b-card>Hello!</b-card>
      </b-collapse>
    </b-card>
  </b-collapse>
</div>

<!-- b-collapse.vue -->
</a></demo>

<h3>用法</h3>
<demo :x='x'><a v-pre><div>
  <!-- Using modifiers -->
  <b-button v-b-toggle.collapse-2 class="m-1">Toggle Collapse</b-button>

  <!-- Using value -->
  <b-button v-b-toggle="'collapse-2'" class="m-1">Toggle Collapse</b-button>

  <!-- Element to collapse -->
  <b-collapse id="collapse-2">
    <b-card>I am collapsible content!</b-card>
  </b-collapse>
</div>

<!-- b-collapse-usage.vue -->
</a></demo>

<h3>初始可见性（开始扩展）</h3>
<demo :x='x'><a v-pre><div>
  <b-button v-b-toggle.collapse-3 class="m-1">Toggle Collapse</b-button>
  <b-collapse visible id="collapse-3">
    <b-card>I should start open!</b-card>
  </b-collapse>
</div>

<!-- b-collapse-visible.vue -->
</a></demo>

<h3>v-model 支持</h3>
<demo :x='x'><a v-pre><template>
  <div>
    <b-button
      :class="visible ? null : 'collapsed'"
      :aria-expanded="visible ? 'true' : 'false'"
      aria-controls="collapse-4"
      v-on:click="visible = !visible"
    >
      Toggle Collapse
    </b-button>
    <b-collapse id="collapse-4" v-model="visible" class="mt-2">
      <b-card>I should start open!</b-card>
    </b-collapse>
  </div>
</template>
</a></demo>

<h3>触发多个折叠元素</h3>
<demo :x='x'><a v-pre><div>
  <!-- Single button triggers two "<b-collapse>" components -->
  <b-button v-b-toggle.collapse-a.collapse-b>Toggle Both Collapse A and B</b-button>

  <!-- Elements to collapse -->
  <b-collapse id="collapse-a" class="mt-2">
    <b-card>I am collapsible content A!</b-card>
  </b-collapse>
  <b-collapse id="collapse-b" class="mt-2">
    <b-card>I am collapsible content B!</b-card>
  </b-collapse>
</div>

<!-- b-collapse-trigger-multiple.vue -->
</a></demo>

<h3>手风琴支持</h3>
<demo :x='x'><a v-pre><template>
  <div role="tablist">
    <b-card no-body class="mb-1">
      <b-card-header header-tag="header" class="p-1" role="tab">
        <b-button block href="#" v-b-toggle.accordion-1 variant="info">Accordion 1</b-button>
      </b-card-header>
      <b-collapse id="accordion-1" visible accordion="my-accordion" role="tabpanel">
        <b-card-body>
          <b-card-text>I start opened because <code>visible</code> is <code>true</code></b-card-text>
          <b-card-text>{{ text }}</b-card-text>
        </b-card-body>
      </b-collapse>
    </b-card>

    <b-card no-body class="mb-1">
      <b-card-header header-tag="header" class="p-1" role="tab">
        <b-button block href="#" v-b-toggle.accordion-2 variant="info">Accordion 2</b-button>
      </b-card-header>
      <b-collapse id="accordion-2" accordion="my-accordion" role="tabpanel">
        <b-card-body>
          <b-card-text>{{ text }}</b-card-text>
        </b-card-body>
      </b-collapse>
    </b-card>

    <b-card no-body class="mb-1">
      <b-card-header header-tag="header" class="p-1" role="tab">
        <b-button block href="#" v-b-toggle.accordion-3 variant="info">Accordion 3</b-button>
      </b-card-header>
      <b-collapse id="accordion-3" accordion="my-accordion" role="tabpanel">
        <b-card-body>
          <b-card-text>{{ text }}</b-card-text>
        </b-card-body>
      </b-collapse>
    </b-card>
  </div>
</template>
<!-- b-accordion.vue -->
</a></demo>

<h3>根据折叠状态在切换按钮中隐藏和显示内容</h3>
<demo :x='x'><a v-pre><div>
  <b-button v-b-toggle.my-collapse>
    <span class="when-opened">Close</span> <span class="when-closed">Open</span> My Collapse
  </b-button>
  <b-collapse id="my-collapse">
    <!-- Content here -->{{text}}
  </b-collapse>
</div>
</a></demo>
  
  
</doc></template>

<script>
let x = {
    data() {
      return {
        visible: true,
        text: `
          Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry
          richardson ad squid. 3 wolf moon officia aute, non cupidatat skateboard dolor
          brunch. Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon
          tempor, sunt aliqua put a bird on it squid single-origin coffee nulla
          assumenda shoreditch et. Nihil anim keffiyeh helvetica, craft beer labore
          wes anderson cred nesciunt sapiente ea proident. Ad vegan excepteur butcher
          vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic
          synth nesciunt you probably haven't heard of them accusamus labore VHS.
        `
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