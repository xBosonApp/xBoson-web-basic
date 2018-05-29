 var data_export=(function(){
    function _event(options,con,param){
        zy.net.loadHTML('md/ex_inport/export.html', con, function () {
          var ExportModal = $('#export');
          ExportModal.modal('show');
          var section=ExportModal.find('[name=charset]').parent().parent();
          function exportInit() {
            var cb = function () {
              ExportModal.find('[name=charset]').zySelect('charset01', false, {
                width: '100%',
                allowClear: false
              });
              ExportModal.find('[name=charset]').select2('val', 'GBK');
            }
        
            zy.cache.initDicts('charset01', cb);
        
    }
    
          exportInit();
          
          section.bind('visible',function(e,type){
            if(type==3) section.hide()
            else section.show()
            
          })
          
          ExportModal.find('[name=radio]').click(function(){
            section.trigger('visible',[ExportModal.find('[name=radio]:checked').val()])
          })
            
            ExportModal.find('[type=submit]').click(function () {
            param.charset= ExportModal.find('[name=charset]').val(),
            param.type=ExportModal.find('[name=radio]:checked').val()
            
            zy.g.am.app =options.app ;
            zy.g.am.mod = options.mod;
            zy.net.postDownload('download/'+options.api, param);
            ExportModal.modal('hide');
        
          })
        });
      
    }
    return {
    event:_event
  }
 })()