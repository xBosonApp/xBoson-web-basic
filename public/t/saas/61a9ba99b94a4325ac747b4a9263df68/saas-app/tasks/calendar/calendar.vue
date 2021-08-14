<!-- Create By xBoson System -->
<template>
  <div>
    <h2 class="pt-4">【日历】总览</h2>
    <FullCalendar class="pt-4" :options="co2" />
    
    <v-dialog fullscreen v-model='dialogInfo' v-if='dialogInfo'>
      <v-card>
        <v-toolbar dark color="primary">
            <v-btn icon dark @click="dialogInfo = false">
              <v-icon>fa-times</v-icon>
            </v-btn>
          <v-toolbar-title>事件详情</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn icon dark @click="dialogInfo = false">
              <v-icon>far fa-times-circle</v-icon>
            </v-btn>
          </v-toolbar-items>
        </v-toolbar>
        
        <v-card-text style='padding-top: 50px'>
          <v-container>
            <v-row>
              <v-text-field
                  label="标题"
                  readonly
                  :value='dialogInfo.event.title'
              />
            </v-row>
            
            <v-row>
              <v-text-field
                  label="事件发起人员"
                  readonly
                  :value='dialogInfo.event.writeRole.join(", ")'
              />
            </v-row>
            <v-row>
              <v-text-field
                  label="事件参与人员"
                  readonly
                  :value='dialogInfo.event.readRole.join(", ")'
              />
            </v-row>
            
            <v-row v-if='dialogInfo.event.location'>
              <v-text-field
                  label="地址"
                  readonly
                  :value='dialogInfo.event.location.address +" "+ dialogInfo.event.location.name'
              />
            </v-row>
            
            <v-row>
              <v-textarea
                  label="备注"
                  readonly
                  rows="1"
                  auto-grow
                  :value='dialogInfo.event.mark'
              />
            </v-row>
            
            <v-row>
              <div v-if='dialogInfo.event.fileInfos && dialogInfo.event.fileInfos.length' 
                  class='text-decoration-underline'>附件</div>
              <div v-else class="text--disabled">无附件</div>
            </v-row>
            
            <v-row v-if='dialogInfo.event.fileInfos' style='margin-top: 25px;'
                   v-for='f in dialogInfo.event.fileInfos'>
              <v-card>
                <v-img :src="f.url">
                  <template v-slot:placeholder>
                    <v-row
                      class="fill-height ma-0"
                      align="center"
                      justify="center"
                    >
                      <v-progress-circular
                        indeterminate
                        color="grey lighten-5"
                      ></v-progress-circular>
                    </v-row>
                  </template>
                </v-img>
              </v-card>
            </v-row>
          </v-container>
        </v-card-text>
        
        <v-card-actions>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
    
  </div>
</template>

<script>
require("./bootstrap.min.css");
export default {
  components: {
    // FullCalendar // make the <FullCalendar> tag available
  },
  
  mounted() {
    this.readCalendar();
  },
  
  data() {
    const vm = this;
    
    return {
      co2: {
        locale: 'chs',
        themeSystem: 'bootstrap',
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
        ],

        eventClick(e) {
          // 点击日历日程事件
          // console.log('eventClick e = ', e)
          vm.dialogInfo = vm.detail[e.event.id];
          console.log('dateClick info = ', e.event.id, vm.dialogInfo);
        },
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
          this.bindImage(e);
          // console.log(e.event.title, e.event)
        });
      }).catch(this.error);
    },
    
    bindImage(e) {
      let api = '/app/61a9ba99b94a4325ac747b4a9263df68/f1b4adf82ee54a1c8e18d31349988a4b/task/get_attachment';
      let devflag = xv.debug && '&s=d';
      
      if (e.event.fileInfos) {
        e.event.fileInfos.forEach(f=>{
          let path = e.person_id +'/'+ f.filename;
          f.url = xv.ctx_prefix + api +'?path='+ encodeURIComponent(path) + devflag;
        });
      }
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