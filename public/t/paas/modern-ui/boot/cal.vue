<!-- Create By xBoson System -->
<template><doc>


<h2>日历组件(Calendar)</h2>
<demo :x='x'><a v-pre><template>
  <b-row>
    <b-col md="auto">
      <b-calendar v-model="value" v-on:context="onContext" locale="en-US"></b-calendar>
    </b-col>
    <b-col>
      <p>Value: <b>'{{ value }}'</b></p>
      <p class="mb-0">Context:</p>
      <pre class="small">{{ context }}</pre>
    </b-col>
  </b-row>
</template>
</a></demo>

<h3>禁用和只读状态</h3>
<demo :x='x'><a v-pre><template>
  <div>
    <b-form-group label="Select calendar interactive state">
      <b-form-radio-group v-model="state" aria-controls="ex-disabled-readonly">
        <b-form-radio value="disabled">Disabled</b-form-radio>
        <b-form-radio value="readonly">Readonly</b-form-radio>
        <b-form-radio value="normal">Normal</b-form-radio>
      </b-form-radio-group>
    </b-form-group>
    <b-calendar id="ex-disabled-readonly" :disabled="disabled" :readonly="readonly"></b-calendar>
  </div>
</template>
</a></demo>

<h3>日期限制</h3>
<demo :x='x'><a v-pre><template>
  <div>
    <b-calendar v-model="value" :min="min" :max="max" locale="en"></b-calendar>
  </div>
</template>
</a></demo>

<h3>禁用日期</h3>
<demo :x='x'><a v-pre><template>
  <div>
    <b-calendar v-model="value" :date-disabled-fn="dateDisabled" locale="en"></b-calendar>
  </div>
</template>
</a></demo>

<h3>样式</h3>
<demo :x='x'><a v-pre><template>
  <b-calendar selected-variant="success" today-variant="info"></b-calendar>
</template>
</a></demo>

<h3>宽度</h3>
<demo :x='x'><a v-pre><template>
  <b-calendar block local="en-US"></b-calendar>
</template>
</a></demo>

<h3>边框和填充</h3>
<demo :x='x'><a v-pre><template>
  <b-calendar class="border rounded p-2" locale="en"></b-calendar>
</template>
</a></demo>

<h3>默认插槽</h3>
<demo :x='x'><a v-pre><template>
  <b-calendar v-model="value" value-as-date locale="en">
    <div class="d-flex" dir="ltr">
      <b-button
        size="sm"
        variant="outline-danger"
        v-if="value"
        v-on:click="clearDate"
      >
        Clear date
      </b-button>
      <b-button
        size="sm"
        variant="outline-primary"
        class="ml-auto"
        v-on:click="setToday"
      >
        Set Today
      </b-button>
    </div>
  </b-calendar>
</template>
</a></demo>

<h3>为特定日期添加CSS类</h3>
<demo :x='x'><a v-pre><template>
  <div>
    <b-calendar v-model="value" :date-info-fn="dateClass" locale="en"></b-calendar>
  </div>
</template>
</a></demo>
  
  
</doc></template>

<script>
let x =  {
    data() {
      const now = new Date()
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      // 15th two months prior
      const minDate = new Date(today)
      minDate.setMonth(minDate.getMonth() - 2)
      minDate.setDate(15)
      // 15th in two months
      const maxDate = new Date(today)
      maxDate.setMonth(maxDate.getMonth() + 2)
      maxDate.setDate(15)

      return {
        value: '',
        context: null,
        state: 'disabled',
        min: minDate,
        max: maxDate,
        disabled: true,
        readonly: true,
      }
    },
    methods: {
      onContext(ctx) {
        this.context = ctx
      },
      dateDisabled(ymd, date) {
        // Disable weekends (Sunday = `0`, Saturday = `6`) and
        // disable days that fall on the 13th of the month
        const weekday = date.getDay()
        const day = date.getDate()
        // Return `true` if the date should be disabled
        return weekday === 0 || weekday === 6 || day === 13
      },
      setToday() {
        const now = new Date()
        this.value = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      },
      clearDate() {
        this.value = ''
      },
      dateClass(ymd, date) {
        const day = date.getDate()
        return day >= 10 && day <= 20 ? 'table-info' : ''
      },
    },
    computed: {
      disabled() {
        return this.state === 'disabled'
      },
      readonly() {
        return this.state === 'readonly'
      }
    },
  }
export default {
  data() {
    return {x};
  }
}
</script>

<style>
</style>