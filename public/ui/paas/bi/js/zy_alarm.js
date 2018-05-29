(function($, zy) {

  var _chnKey = {};

  var tools = {
    _label : function(str) {
      var _str = "<" + str + "></" + str + ">";
      return $(_str);
    }
  }

  var _level = [{
    color : 'rgb(204, 51, 0)',
    icon : "fa fa-fire swing animated",
    levelnm : '紧急'
  }, {
    color : '#669900',
    icon : "glyphicon glyphicon-warning-sign swing animated",
    levelnm : '重要'
  }, {
    color : '#00cc00',
    icon : "fa fa-shield swing animated",
    levelnm : '一般'
  }, {
    color : "#3276B1",
    icon : "fa fa-bell swing animated",
    levelnm : '预警'
  }, {
    color : "#356635",
    icon : "fa fa-chain-broken swing animated",
    levelnm : '过期'
  }];

  function _buildTime(_obj) {
    _obj.con.bigbox.find('.bigboxicon a').click(function() {
      var _time = new Date().getTime();
      var _total = _time + Number($(this).val()) * 60 * 1000;
      _obj.con.bigbox.find('i').click();
      _obj.hidetm = _total;
    })
  }

  function _check(_arr) {
    if ($.isArray(_arr)) {
      $.each(_arr, function(i, v) {
        _bigBox(v);
      });
    } else {
      _bigBox(_arr);
    }
  }

  function _label(_str) {
    return '<label style="margin-bottom: 1px;padding : .1em .2em .1em .2em" class="label label-default">' + _str + '</label>';
  }

  function _bigBox(_obj) {

    function _style(_obj) {
      var o = JSON.parse(_obj);
      var _opt = _level[Number(o.level) - 1];
      $.extend(_opt, {
        title : '',
        content : ''
      }, o);
      return _opt;
    }

    function _ins(_obj) {
      function _content(_taget, _obj) {
        var _strf = '', _strs = '';
        _strs = _label('站点:') + ' ' + _obj['站点名称'];
        _strf = _label('原因:') + ' ' + _obj['数据类型'] + ' 实际值:' + _obj['报警值'] + ' ' + _obj['报警规则'] + ' 报警值:' + _obj['规定报警值'];
        var _divf = tools._label('div').html(_strf);
        var _divs = tools._label('div').html(_strs);
        var _divt = tools._label('div').html(_label('设备:') + ' ' + _obj['设备名称']);
        var _divfo = tools._label('div').html(_label('分区:') + ' ' + _obj['分区名称']);
        _taget.append(_divs);
        _taget.append(_divfo);
        _taget.append(_divt);
        _taget.append(_divf);
      }

      function _timeBtn(_obj) {
        _obj.html('');
        var _list = [5, 15, 60, 120];
        var _d = tools._label('div').addClass('btn-group dropup');
        _d.append(tools._label('button').addClass('btn btn-xs btn-default dropdown-toggle').attr('data-toggle', 'dropdown').css('color', '#000').html('延迟报警'));
        var _ul = tools._label('ul').addClass('dropdown-menu');
        for (i in _list) {
          var _n = _list[i] + '分钟';
          var _a = tools._label('a').attr('href', 'javascript:void(0);').val(_list[i]).html(_n);
          var _li = tools._label('li').append(_a);
          _ul.append(_li);
        }
        _d.append(_ul);
        _obj.append(_d);
        _cb(_obj);
        //回调预留
      }

      function _cb(_obj) {
        function _uri(_obj, _str) {
          _obj.click(function() {
            if (_str.param && _str.param != '') {
              if (!zy.g.alarm)
                zy.g.alarm = {
                  chnkey : opt.key
                };
              else
                zy.g.alarm.chnkey = opt.key;
              if (typeof Ea_getalarmlist != 'undefined')
                Ea_getalarmlist._change();
              else
                window.location.hash = _str.param;
            }
          })
        }

        function _fun(_obj, _str) {
          _obj.click(function() {
            alert('uri: ' + _str + ' 功能预留');
          })
        }

        if (opt.cb.length > 0) {
          $.each(opt.cb, function(i, v) {
            var _btn = tools._label('button').css({
              'color' : '#000',
              'margin-left' : '5px'
            }).addClass('btn btn-xs btn-default');
            switch (v.type) {
              case 'u':
                _btn.html('处理报警');
                _uri(_btn, v);
                _obj.find('.btn-group').append(_btn);
                break;
              case 'f':
                _btn.html('执行');
                _fun(_btn, v);
                _obj.find('.btn-group').append(_btn);
                break;
              default:
                break;
            }
          })
        }
      }

      var _tm = new Date(Number(opt.datetimes) * 1000).toFormat('yyyy-MM-dd hh:mm:ss');
      _obj.bigbox.find('span').html(_label('时间:') + ' ' + _tm + ' ' + _label('级别:') + ' ' + opt.levelnm);
      _content(_obj.bigbox.find('p'), opt.value);
      _timeBtn(_obj.bigbox.find('.bigboxicon'));
    }

    var opt = _style(_obj);
    _chnKey[opt.key] = opt;
    if (!_chnKey[opt.key].hidetm)
      _chnKey[opt.key].hidetm = 0;
    var _now = new Date().getTime();
    //  console.log(_now);
    //  console.log(_chnKey[opt.key].hidetm);
    if (_now < _chnKey[opt.key].hidetm)
      return;

    if (_chnKey[opt.key].con) {
      $.each(_chnKey[opt.key].con, function(i, v) {
        v.remove();
      });
    }
    var _box = $.bigBox(opt, function() {
      _chnKey[opt.key].con = null;
    })
    _ins(_box);
    _chnKey[opt.key].con = _box;
    _buildTime(_chnKey[opt.key]);
  }


  $.fn.alarm = {
    init : _check
  }

})(jQuery, zy);

