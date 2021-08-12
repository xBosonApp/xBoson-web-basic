<!-- Create By xBoson System -->
<template>
  <div>
    <h2>【日历】总览（月视图）</h2>
    <FullCalendar :options="co2" />
    
    <v-dialog
      max-width="600px"
      v-model='dialogInfo'
      v-if='dialogInfo'
    >
      <v-card>
        <v-toolbar
          dark
          color="primary"
        >
          <span class="text-h5">事件详情</span>
        </v-toolbar>
        
        <v-card-text style='padding-top: 50px'>
          <v-container>
            <v-row>
              <v-text-field
                  label="标题"
                  required
                  :value='dialogInfo.event.title'
              />
            </v-row>
            
            <v-row>
              <v-text-field
                  label="事件发起人员"
                  required
                  :value='dialogInfo.event.writeRole.join(", ")'
              />
            </v-row>
            <v-row>
              <v-text-field
                  label="事件参与人员"
                  required
                  :value='dialogInfo.event.readRole.join(", ")'
              />
            </v-row>
            
            <v-row>
              <v-text-field
                  label="地址"
                  required
                  :value='dialogInfo.event.location.address +" "+ dialogInfo.event.location.name'
              />
            </v-row>
            
            <v-row>
              <v-textarea
                  label="备注"
                  required
                  rows="1"
                  auto-grow
                  :value='dialogInfo.event.mark'
              />
            </v-row>
          </v-container>
        </v-card-text>
        
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="blue darken-1"
            text
            @click="dialogInfo = null"
          >
            关闭
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    
  </div>
</template>

<script>
export default {
  components: {
    // FullCalendar // make the <FullCalendar> tag available
  },
  
  mounted() {
    // setTimeout(this.buildEvents, 1000);
    this.readCalendar();
  },
  
  data() {
    const vm = this;
    
    return {
      co2: {
        locale: 'chs',
        initialView: 'dayGridMonth',
        displayEventEnd: true, //所有视图显示结束时间
        // weekNumbers: true, //显示周数
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
          // {
          //   id: '1005',
          //   title: 'Conference',
          //   start: '2021-08-11',
          //   end: '2021-08-13'
          // },
          // {
          //   id: '1012',
          //   title: 'Click for 百度',
          //   url: 'https://baidu.com/',
          //   start: '2021-08-28'
          // }
        ],

        eventClick(e) {
          // 点击日历日程事件
          // console.log('eventClick e = ', e)
          vm.dialogInfo = vm.detail[e.event.id];
          console.log('dateClick info = ', e.event.id, vm.dialogInfo);
        },
        
        // dateClick: function(info) {
        //   let event = this.detail[info.id];
        //   console.log('dateClick info = ', info.id, event)
        //   // change the day's background color just for fun
        //   // info.dayEl.style.backgroundColor = 'red';
        // },
      },
      
      detail : {},
      dialogInfo: null,
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
    
    readCalendar() {
      let api = '/app/61a9ba99b94a4325ac747b4a9263df68/f1b4adf82ee54a1c8e18d31349988a4b/task/taskGetPc';
      let parm = {
        start_dt : "2021-08-01T11:25:22.667Z",
        end_dt   : "2021-08-31T11:25:22.667Z",
      };
    
      this.$xapi(xv.ctx_prefix + api, parm).then(r=>{
        r.result.forEach(e=>{
          this.co2.events.push({
            id    : e.event._id,
            title : e.event.title,
            start : e.event.date_end,
          });
          this.$set(this.detail, e.event._id, e);
          // console.log(e.event.title, e.event)
        });
      }).catch(this.error);
    },
    
    error(err) {
      xv.popError("错误", err);
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