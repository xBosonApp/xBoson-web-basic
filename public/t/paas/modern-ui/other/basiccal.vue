<!-- Create By xBoson System -->

<template><doc>
  <h2>日历组件</h2>
  
  <h3>星期视图</h3>
  <FullCalendar :options="co1" />
  
  <h3>月视图 (可点击)</h3>
  <FullCalendar :options="co2" />
  
  <h3>时间视图</h3>
  <FullCalendar :options="co3" />
  
  <h3>列表视图</h3>
  <FullCalendar :options="co4" />
  
  <h3>拖拽事件</h3>
  <div class='colPanel'>
    <div ref='externalEvents'>
      <p>
        <strong>Draggable Events</strong>
      </p>
  
      <div class='fc-event fc-h-event fc-daygrid-event fc-daygrid-block-event'>
        <div class='fc-event-main'>My Event 1</div>
      </div>
      <div class='fc-event fc-h-event fc-daygrid-event fc-daygrid-block-event'>
        <div class='fc-event-main'>My Event 2</div>
      </div>
      <div class='fc-event fc-h-event fc-daygrid-event fc-daygrid-block-event'>
        <div class='fc-event-main'>My Event 3</div>
      </div>
      <div class='fc-event fc-h-event fc-daygrid-event fc-daygrid-block-event'>
        <div class='fc-event-main'>My Event 4</div>
      </div>
      <div class='fc-event fc-h-event fc-daygrid-event fc-daygrid-block-event'>
        <div class='fc-event-main'>My Event 5</div>
      </div>
  
      <!--<p>-->
      <!--  <input type='checkbox' id='drop-remove' />-->
      <!--  <label for='drop-remove'>remove after drop</label>-->
      <!--</p>-->
    </div>
    <FullCalendar :options='co5' />
  </div>
  
</doc></template>

<script>
export default {
  components: {
    // FullCalendar // make the <FullCalendar> tag available
  },
  
  mounted() {
    setTimeout(this.buildEvents, 1000);
  },
  
  data() {
    return {
      co1: {
        locale: 'chs',
        // plugins: [ dayGridPlugin, interactionPlugin ],
        initialView: 'dayGridWeek',
        weekends: true // initial value
      },
      
      co2: {
        initialView: 'dayGridMonth',
        weekends: true, // initial value
        dateClick: function(info) {
          let buf = [];
          buf.push('Clicked on: ' + info.dateStr);
          buf.push('Coordinates: ' + info.jsEvent.pageX + ',' + info.jsEvent.pageY);
          buf.push('Current view: ' + info.view.type);
          msg(buf);
          // change the day's background color just for fun
          info.dayEl.style.backgroundColor = 'red';
        },
        locale: 'chs',
      },
      
      co3: {
        initialView: 'timeGridWeek',
        locale: 'chs',
        events: [{"title":"Long Event","start":"2021-07-07","end":"2021-07-10"},{"groupId":"999","title":"Repeating Event","start":"2021-07-09T16:00:00+00:00"},{"title":"Conference","start":"2021-07-08","end":"2021-07-10"},{"title":"Meeting","start":"2021-07-09T10:30:00+00:00","end":"2021-07-09T12:30:00+00:00"},{"title":"Lunch","start":"2021-07-09T12:00:00+00:00"},{"title":"Birthday Party","start":"2021-07-10T07:00:00+00:00"}],
      },
      
      co4: {
        initialView: 'listWeek',
        locale: 'chs',
        // customize the button names,
        // otherwise they'd all just say "list"
        views: {
          listDay: { buttonText: 'list day' },
          listWeek: { buttonText: 'list week' },
          listMonth: { buttonText: 'list month' }
        },
  
        headerToolbar: {
          left: 'title',
          center: '',
          right: 'listDay,listWeek,listMonth'
        },
        events: [{"title":"Long Event","start":"2021-07-07","end":"2021-07-10"},{"groupId":"999","title":"Repeating Event","start":"2021-07-09T16:00:00+00:00"},{"title":"Conference","start":"2021-07-08","end":"2021-07-10"},{"title":"Meeting","start":"2021-07-09T10:30:00+00:00","end":"2021-07-09T12:30:00+00:00"},{"title":"Lunch","start":"2021-07-09T12:00:00+00:00"},{"title":"Birthday Party","start":"2021-07-10T07:00:00+00:00"}],
      },
      
      co5: {
        headerToolbar: {
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay'
        },
        locale: 'chs',
        editable: true,
        droppable: true, // this allows things to be dropped onto the calendar
        drop: function(info) {
        }
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
            title: eventEl.innerText
          };
        }
      });
    },
  }
}

function msg(arr, sp) {
  let description = arr.join(sp || '\n');
  antd.notification.info({
    message: 'click',
    description,
    placement: 'bottomRight',
  });
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