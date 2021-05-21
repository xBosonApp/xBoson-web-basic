<!-- Create By xBoson System -->

<template><doc>
  <h2>分割线</h2>
  <demo :x='x'><a v-pre><template>
  <div>
    Text
    <a-divider type="vertical" />
    <a href="#">Link</a>
    <a-divider type="vertical" />
    <a href="#">Link</a>
  </div>
</template>
</a></demo>
  
  <h3>水平分割线 </h3>
  <demo :x='x'><a v-pre><template>
  <div>
    <p>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed nonne merninisti licere mihi ista
      probare, quae sunt a te dicta? Refert tamen, quo modo.
    </p>
    <a-divider />
    <p>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed nonne merninisti licere mihi ista
      probare, quae sunt a te dicta? Refert tamen, quo modo.
    </p>
    <a-divider>With Text</a-divider>
    <p>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed nonne merninisti licere mihi ista
      probare, quae sunt a te dicta? Refert tamen, quo modo.
    </p>
    <a-divider dashed />
    <p>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed nonne merninisti licere mihi ista
      probare, quae sunt a te dicta? Refert tamen, quo modo.
    </p>
  </div>
</template>
</a></demo>
  
  <h3>带文字的分割线</h3>
  <demo :x='x'><a v-pre><template>
  <div>
    <p>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed nonne merninisti licere mihi ista
      probare, quae sunt a te dicta? Refert tamen, quo modo.
    </p>
    <a-divider>Text</a-divider>
    <p>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed nonne merninisti licere mihi ista
      probare, quae sunt a te dicta? Refert tamen, quo modo.
    </p>
    <a-divider orientation="left">
      Left Text
    </a-divider>
    <p>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed nonne merninisti licere mihi ista
      probare, quae sunt a te dicta? Refert tamen, quo modo.
    </p>
    <a-divider orientation="right">
      Right Text
    </a-divider>
    <p>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed nonne merninisti licere mihi ista
      probare, quae sunt a te dicta? Refert tamen, quo modo.
    </p>
  </div>
</template>
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