<!-- Create By xBoson System -->
<template><doc>


<h2>表单(Form)</h2>
<demo :x='x'><a v-pre><template>
  <div>
    <b-form v-on:submit="onSubmit" v-on:reset="onReset" v-if="show">
      <b-form-group
        id="input-group-1"
        label="Email address:"
        label-for="input-1"
        description="We'll never share your email with anyone else."
      >
        <b-form-input
          id="input-1"
          v-model="form.email"
          type="email"
          required
          placeholder="Enter email"
        ></b-form-input>
      </b-form-group>

      <b-form-group id="input-group-2" label="Your Name:" label-for="input-2">
        <b-form-input
          id="input-2"
          v-model="form.name"
          required
          placeholder="Enter name"
        ></b-form-input>
      </b-form-group>

      <b-form-group id="input-group-3" label="Food:" label-for="input-3">
        <b-form-select
          id="input-3"
          v-model="form.food"
          :options="foods"
          required
        ></b-form-select>
      </b-form-group>

      <b-form-group id="input-group-4">
        <b-form-checkbox-group v-model="form.checked" id="checkboxes-4">
          <b-form-checkbox value="me">Check me out</b-form-checkbox>
          <b-form-checkbox value="that">Check that out</b-form-checkbox>
        </b-form-checkbox-group>
      </b-form-group>

      <b-button type="submit" variant="primary">Submit</b-button>
      <b-button type="reset" variant="danger">Reset</b-button>
    </b-form>
    <b-card class="mt-3" header="Form Data Result">
      <pre class="m-0">{{ form }}</pre>
    </b-card>
  </div>
</template>
</a></demo>

<h3>内联表格</h3>
<demo :x='x'><a v-pre><div>
  <b-form inline>
    <label class="sr-only" for="inline-form-input-name">Name</label>
    <b-input
      id="inline-form-input-name"
      class="mb-2 mr-sm-2 mb-sm-0"
      placeholder="Jane Doe"
    ></b-input>

    <label class="sr-only" for="inline-form-input-username">Username</label>
    <b-input-group prepend="v-on:" class="mb-2 mr-sm-2 mb-sm-0">
      <b-input id="inline-form-input-username" placeholder="Username"></b-input>
    </b-input-group>

    <b-form-checkbox class="mb-2 mr-sm-2 mb-sm-0">Remember me</b-form-checkbox>

    <b-button variant="primary">Save</b-button>
  </b-form>
</div>
</a></demo>

<h3>还支持自定义表单控件和选择。</h3>
<demo :x='x'><a v-pre><div>
  <b-form inline>
    <label class="mr-sm-2" for="inline-form-custom-select-pref">Preference</label>
    <b-form-select
      class="mb-2 mr-sm-2 mb-sm-0"
      :value="null"
      :options="{ '1': 'One', '2': 'Two', '3': 'Three' }"
      id="inline-form-custom-select-pref"
    >
      <template v-slot:first>
        <option :value="null">Choose...</option>
      </template>
    </b-form-select>

    <b-form-checkbox class="mb-2 mr-sm-2 mb-sm-0">Remember my preference</b-form-checkbox>

    <b-button variant="primary">Save</b-button>
  </b-form>
</div>
</a></demo>

<h3>表单文本帮助</h3>
<demo :x='x'><a v-pre><div>
  <b-form v-on:submit.stop.prevent>
    <label for="text-password">Password</label>
    <b-input type="password" id="text-password" aria-describedby="password-help-block"></b-input>
    <b-form-text id="password-help-block">
      Your password must be 8-20 characters long, contain letters and numbers, and must not
      contain spaces, special characters, or emoji.
    </b-form-text>
   </b-form>
</div>
</a></demo>

<h3>反馈辅助</h3>
<demo :x='x'><a v-pre><template>
  <div>
    <b-form  v-on:submit.stop.prevent>
      <label for="feedback-user">User ID</label>
      <b-input v-model="userId" :state="validation" id="feedback-user"></b-input>
      <b-form-invalid-feedback :state="validation">
        Your user ID must be 5-12 characters long.
      </b-form-invalid-feedback>
      <b-form-valid-feedback :state="validation">
        Looks Good.
      </b-form-valid-feedback>
     </b-form>
  </div>
</template>
</a></demo>

<h3>数据列表帮助</h3>
<demo :x='x'><a v-pre>
  <template>
  <label for="input-with-list">Input with datalist</label>
  <b-form-input list="input-list" id="input-with-list"></b-form-input>
  <b-form-datalist id="input-list" :options="options"></b-form-datalist>
</template>
</a></demo>
  
  
</doc></template>

<script>
let x = {
    computed: {
      validation() {
        return this.userId.length > 4 && this.userId.length < 13
      }
    },
    data() {
      return {
        form: {
          email: '',
          name: '',
          food: null,
          checked: []
        },
        foods: [{ text: 'Select One', value: null }, 'Carrots', 'Beans', 'Tomatoes', 'Corn'],
        show: true,
        userId: '',
        options: ['Apple', 'Banana', 'Grape', 'Kiwi', 'Orange'],
      }
    },
    methods: {
      onSubmit(evt) {
        evt.preventDefault()
        alert(JSON.stringify(this.form))
      },
      onReset(evt) {
        evt.preventDefault()
        // Reset our form values
        this.form.email = ''
        this.form.name = ''
        this.form.food = null
        this.form.checked = []
        // Trick to reset/clear native browser form validation state
        this.show = false
        this.$nextTick(() => {
          this.show = true
        })
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