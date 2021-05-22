<!-- Create By xBoson System -->
<template><doc>


<h2>表单时间选择器(Form Datepicker)</h2>
<demo :x='x'><a v-pre><template>
  <div>
    <label for="example-datepicker">Choose a date</label>
    <b-form-datepicker id="example-datepicker" v-model="value" class="mb-2"></b-form-datepicker>
    <p>Value: '{{ value }}'</p>
  </div>
</template>
</a></demo>

<h3>禁用和只读状态</h3>
<demo :x='x'><a v-pre><template>
  <div>
    <b-form-group label="Select date picker interactive state">
      <b-form-radio-group v-model="state" aria-controls="ex-disabled-readonly">
        <b-form-radio value="disabled">Disabled</b-form-radio>
        <b-form-radio value="readonly">Readonly</b-form-radio>
        <b-form-radio value="normal">Normal</b-form-radio>
      </b-form-radio-group>
    </b-form-group>
    <b-form-datepicker id="ex-disabled-readonly" :disabled="disabled" :readonly="readonly"></b-form-datepicker>
  </div>
</template>
</a></demo>

<h3>最小和最大日期</h3>
<demo :x='x'><a v-pre><template>
  <div>
    <b-form-datepicker v-model="value" :min="min" :max="max" locale="en"></b-form-datepicker>
  </div>
</template>
</a></demo>

<h3>禁用日期</h3>
<demo :x='x'><a v-pre><template>
  <div>
    <b-form-datepicker v-model="value" :date-disabled-fn="dateDisabled" locale="en"></b-form-datepicker>
  </div>
</template>
</a></demo>

<h3>验证状态</h3>
<demo :x='x'><a v-pre><template>
  <div>
    <label for="datepicker-invalid">Choose a date (invalid style)</label>
    <b-form-datepicker id="datepicker-invalid" :state="false" class="mb-2"></b-form-datepicker>
    <label for="datepicker-valid">Choose a date (valid style)</label>
    <b-form-datepicker id="datepicker-valid" :state="true"></b-form-datepicker>
  </div>
</template>
</a></demo>

<h3>控制尺寸</h3>
<demo :x='x'><a v-pre><template>
  <div>
    <label for="datepicker-sm">Small date picker</label>
    <b-form-datepicker id="datepicker-sm" size="sm" local="en" class="mb-2"></b-form-datepicker>
    <label for="datepicker-lg">Large date picker</label>
    <b-form-datepicker id="datepicker-lg" size="lg" local="en"></b-form-datepicker>
  </div>
</template>
</a></demo>

<h3>占位符</h3>
<demo :x='x'><a v-pre><template>
  <div>
    <label for="datepicker-placeholder">Date picker with placeholder</label>
    <b-form-datepicker id="datepicker-placeholder" placeholder="Choose a date" local="en"></b-form-datepicker>
  </div>
</template>
</a></demo>

<h3>可选控件</h3>
<demo :x='x'><a v-pre><template>
  <div>
    <label for="datepicker-buttons">Date picker with optional footer buttons</label>
    <b-form-datepicker
      id="datepicker-buttons"
      today-button
      reset-button
      close-button
      locale="en"
    ></b-form-datepicker>
  </div>
</template>
</a></demo>

<h3>国际化</h3>
<demo :x='x'><a v-pre><template>
  <div>
    <label for="example-locales">Locale:</label>
    <b-form-select id="example-locales" v-model="locale" :options="locales" class="mb-2"></b-form-select>

    <label for="example-weekdays">Start weekday:</label>
    <b-form-select id="example-weekdays" v-model="weekday" :options="weekdays" class="mb-2"></b-form-select>

    <label for="example-i18n-picker">Date picker:</label>
    <b-form-datepicker
      id="example-i18n-picker"
      v-model="value"
      v-bind="labels[locale] || {}"
      :locale="locale"
      :start-weekday="weekday"
      class="mb-2"
     ></b-form-datepicker>
     <p>Value: <b>'{{ value }}'</b></p>
   </div>
</template>
</a></demo>
  
  
</doc></template>

<script>
let x = {
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
        state: 'disabled',
        min: minDate,
        max: maxDate,
        
        locale: 'en-US',
        locales: [
          { value: 'en-US', text: 'English US (en-US)' },
          { value: 'de', text: 'German (de)' },
          { value: 'ar-EG', text: 'Arabic Egyptian (ar-EG)' },
          { value: 'zh', text: 'Chinese (zh)' }
        ],
        weekday: 0,
        weekdays: [
          { value: 0, text: 'Sunday' },
          { value: 1, text: 'Monday' },
          { value: 6, text: 'Saturday' }
        ],
        labels: {
          de: {
            labelPrevYear: 'Vorheriges Jahr',
            labelPrevMonth: 'Vorheriger Monat',
            labelCurrentMonth: 'Aktueller Monat',
            labelNextMonth: 'Nächster Monat',
            labelNextYear: 'Nächstes Jahr',
            labelToday: 'Heute',
            labelSelected: 'Ausgewähltes Datum',
            labelNoDateSelected: 'Kein Datum gewählt',
            labelCalendar: 'Kalender',
            labelNav: 'Kalendernavigation',
            labelHelp: 'Mit den Pfeiltasten durch den Kalender navigieren'
          },
          'ar-EG': {
            labelPrevYear: 'العام السابق',
            labelPrevMonth: 'الشهر السابق',
            labelCurrentMonth: 'الشهر الحالي',
            labelNextMonth: 'الشهر المقبل',
            labelNextYear: 'العام المقبل',
            labelToday: 'اليوم',
            labelSelected: 'التاريخ المحدد',
            labelNoDateSelected: 'لم يتم اختيار تاريخ',
            labelCalendar: 'التقويم',
            labelNav: 'الملاحة التقويم',
            labelHelp: 'استخدم مفاتيح المؤشر للتنقل في التواريخ'
          },
          zh: {
            labelPrevYear: '上一年',
            labelPrevMonth: '上个月',
            labelCurrentMonth: '当前月份',
            labelNextMonth: '下个月',
            labelNextYear: '明年',
            labelToday: '今天',
            labelSelected: '选定日期',
            labelNoDateSelected: '未选择日期',
            labelCalendar: '日历',
            labelNav: '日历导航',
            labelHelp: '使用光标键浏览日期'
          }
        }
      }
    },
    computed: {
      disabled() {
        return this.state === 'disabled'
      },
      readonly() {
        return this.state === 'readonly'
      }
    },
    methods: {
      dateDisabled(ymd, date) {
        // Disable weekends (Sunday = `0`, Saturday = `6`) and
        // disable days that fall on the 13th of the month
        const weekday = date.getDay()
        const day = date.getDate()
        // Return `true` if the date should be disabled
        return weekday === 0 || weekday === 6 || day === 13
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