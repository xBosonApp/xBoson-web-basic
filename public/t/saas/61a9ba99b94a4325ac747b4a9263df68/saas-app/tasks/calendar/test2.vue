<!-- Create By xBoson System -->
<link href='/xboson/face/t/saas/61a9ba99b94a4325ac747b4a9263df68/saas-app/tasks/calendar/bootstrap.min.css' rel='stylesheet' />
<template>
  <doc>
    <h2>日历组件-月视图 (可点击)</h2>
    <FullCalendar :options="co2" />
  </doc>
</template>

<script>
export default {
  components: {
    // FullCalendar // make the <FullCalendar> tag available
  },
  
  mounted() {
    // setTimeout(this.buildEvents, 1000);
  },
  
  data() {
    return {
      co2: {
        locale: 'chs',
        // themeSystem: 'bootstrap',
        initialView: 'dayGridMonth',
        displayEventEnd: true, //所有视图显示结束时间
        weekNumbers: true,
        navLinks: true, // can click day/week names to navigate views
        editable: true,
        selectable: true,
        selectMirror: true,
        nowIndicator: true,
        dayMaxEvents: true, // allow "more" link when too many events
        weekends: true, // initial value
        headerToolbar: {
          left: 'prevYear,prev,next,nextYear',
          center: 'title',
          // center: 'prevYear,prev title next,nextYear',
          right: 'today dayGridMonth,timeGridWeek,timeGridDay,listMonth'
        },
        buttonText:{
          today:'今天',
          month:'月',
          week:'周',
          day:'日',
          list:'列表',
        },

        events: [
          {
            id: '1001',
            title: '全天事件',
            start: '2021-08-01',
          },
          {
            id: '1002',
            title: '长事件',
            start: '2021-08-07',
            end: '2021-08-10'
          },
          {
            id: '1003',
            groupId: 999,
            title: '重复事件',
            start: '2021-08-09T16:00:00'
          },
          {
            id: '1004',
            groupId: 999,
            title: '重复事件',
            start: '2021-08-16T16:00:00'
          },
          {
            id: '1005',
            title: 'Conference',
            start: '2021-08-11',
            end: '2021-08-13'
          },
          {
            id: '1006',
            title: '会议',
            start: '2021-08-12T10:30:00',
            end: '2021-08-12T12:30:00'
          },
          {
            id: '1007',
            title: '午餐',
            start: '2021-08-12T12:00:00'
          },
          {
            id: '1008',
            title: '会议',
            start: '2021-08-12T14:30:00'
          },
          {
            id: '1009',
            title: '快乐时光',
            start: '2021-08-12T17:30:00'
          },
          {
            id: '1010',
            title: '晚餐',
            start: '2021-08-12T20:00:00'
          },
          {
            id: '1011',
            title: '生日聚会',
            start: '2021-08-13T07:00:00'
          },
          {
            id: '1012',
            title: 'Click for 百度',
            url: 'https://baidu.com/',
            start: '2021-08-28'
          }
        ],

        eventClick: function(e) {
           // 点击日历日程事件
           console.log('eventClick e = ', e)
        },
        dateClick: function(info) {
          console.log('dateClick info = ', info)
          // change the day's background color just for fun
          info.dayEl.style.backgroundColor = 'red';
        },
      },
      
    }
  },
  
  methods: {
    toggleWeekends: function() {
      this.calendarOptions.weekends = !this.calendarOptions.weekends // toggle the boolean!
    },
    
    buildEvents() {
      let Draggable = FullCalendar.Draggable;
      let dom = this.$refs.externalEvents;
      
      new Draggable(dom, {
        itemSelector: '.fc-event',
        eventData: function(eventEl) {
          return {
            // title: eventEl.innerText
          };
        }
      });
    },
  }
}

</script>

<style scoped>
.colPanel {
  display: grid; grid-template-columns: 300px 1fr; gap: 5px;
}
.fc-event {
  margin: 2px 0;
}
</style>