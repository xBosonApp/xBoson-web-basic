/* Create By xBoson System */
jQuery(function() {
  
const URLBase = 'app/a297dfacd7a84eab9656675f61750078/af1880a8938f4756a3f377c93be99d78/chainfs/';
const fs_toolbar          = $('#fs_toolbar');
const fs_showfiles        = $('#fs_showfiles');
const fs_showinfo         = $('#fs_showinfo');
const file_item_template  = $('#file_item_template');
const mkdir_template      = $('#mkdirDialog');
const select_volume_msg   = $('#select_volume_msg');
const fs_showupload       = $('#fs_showupload');
const mask                = $('.mask');
const verifyDialog        = $("#verifyDialog");
const tb                  = toolbar();
const Size1MB             = 1024*1024;

const typename = {
  'vol'   : '数据卷',
  'file'  : '文件',
  'folder': '目录',
  'return': '返回',
};

clearInfo();
show_volume_select();


function show_volume_select() {
  fs_showfiles.empty();
  select_volume_msg.show();
  get('lsvolume', {}, function(err, d) {
    if (err) return;
    if (d) {
      for (let id in d.data) {
        putFile(d.data[id], open_volume, [{name:'ID', val:id}]);
      }
    }
  });
}


function toolbar() {
  const fs_path = $('#fs_path');
  const rmdir   = fs_toolbar.find(".rmdir").click(rmdir_func);
  const rename  = fs_toolbar.find(".rename").click(rename_func);
  const mkdir   = fs_toolbar.find('.mkdir').click(mkdir_func);
  const upload  = fs_toolbar.find('.upload').click(open_upload);
  const _log    = fs_showupload.find(".log");
  const _FileReader = window.FileReader;
  
  let vol, path, pg;
  
  window.fd.logging = zy.debug;
  var upzone = new FileDrop('fs_showupload');
  var bar = fs_showupload.find('.bar_zone');
  var closeUpload = fs_showupload.find('.close');
  var pmsg = fs_showupload.find('.progress_message');
  upzone.multiple(true);
  upzone.event('send', on_send);
  closeUpload.click(close_upload_dialog);
  
  fs_showupload.find('.uploaddir').click(function() {
    let thiz = $(this);
    let dir = thiz.prop('checked');
    if (dir) {
      fs_showupload.find('[type=file]').prop('webkitdirectory', true);
    } else {
      fs_showupload.find('[type=file]').removeProp('webkitdirectory');
    }
  });
  

  return {
    setCurrentSelect(v, p) {
      vol = v;
      path = p;
    },
    
    reset() {
      vol = path = null;
    },
    
    getPath() {
      return fs_path.val();
    },
    
    setPath(x) {
      fs_path.val(x);
    },
    
    show(readonlyVolume, pathGetter) {
      fs_showfiles.empty();
      fs_toolbar.removeClass('hide');
      rmdir.prop('disabled', readonlyVolume);
      rename.prop('disabled', readonlyVolume);
      mkdir.prop('disabled', readonlyVolume);
      pg = pathGetter;
    },
    
    hide() {
      fs_toolbar.addClass('hide');
    },
  };
  
  function close_upload_dialog() {
    fs_showupload.hide(); 
    mask.fadeOut(200);
    _log.empty();
    bar.css('width', '0');
    pmsg.html('');
    return false;
  }
  
  function log(msg, cssClass) {
    _log.prepend(["<div class='", cssClass, "'><span class='note'>", 
        new Date().toLocaleString(), '</span>', msg, "</div>"].join(' '));
  }
  
  function on_send(files) {
    let total_files = files.length;
    let fail = 0, succ = 0;
    log("准备文件..");
    closeUpload.hide();
    
    // 新的浏览器不能显示自定义消息
    window.onbeforeunload = function (e) {
      const msg = "文件上传中, 要终止么?";
      (e || window.event).returnValue = msg;
      return msg;
    }
    
    eachAsync(files, (f, next, i)=>{
      up_file(f, pg().path, next, i);
    }, ()=>{
      bar.css('width', '100%');
      log(['<b>', succ, '成功, ', fail, '失败, 共', total_files, '文件, 上传结束</b>'].join(' '));
      closeUpload.show();
      fs_toolbar.trigger('update');
      window.onbeforeunload = null;
    });
  
    function up_file(file, parent, next, fileIndex) {
      if (file.nativeEntry && file.nativeEntry.isDirectory) {
        log('目录 '+ file.name);
        
        file.listEntries((files)=>{
          total_files += files.length;
          eachAsync(files, (f, snext)=>{
            up_file(f, join(parent, file.name), snext);
          }, next);
        }, (err)=>{
          log(file.name +" 错误 "+ err.message, 'error');
        });
        return;
      }
      
      if (file.size <= 0) {
        log(file.name +" 空文件", 'error');
        return;
      }
      
      file.event('progress', function (current, total) {
        var filec = fileIndex + 1;
        var width = ((current/total) * (1/total_files) + (filec/total_files)) * 100;
        bar.css('width', width+'%');
        pmsg.html([
          '<span>', filec, '/', total_files, '</span>',
          '<span>', width.toFixed(2), '%</span>',
          '<span>', file.name, '</span>'].join(''));
      })
      
      file.event('error', function (err, xhr) {
        if (xhr) {
          log(file.name +" 错误 "+ xhr.statusText, 'error');
        }
        if (err) {
          log(file.name +" 错误 "+ err, 'error');
        }
        ++fail;
        next();
      });
      
      file.event('done', function(x) {
        let ret = JSON.parse(x.responseText).data[0];
        if (ret.ok) {
          log(file.name +" 完成, "+ file.size +'字节 '+ store_size(file.size));
          ++succ;
        } else {
          log(file.name +" 错误 "+ ret.msg, 'error');
          ++fail;
        }
        next();
      });
      
      if (file.nativeFile && file.nativeFile.webkitRelativePath) {
        let p = file.nativeFile.webkitRelativePath;
        let i = p.lastIndexOf('/');
        if (i >= 0) {
          p = p.substring(0, i);
        }
        // parent 不应包含文件名本身
        parent = join(parent, p);
      }
      
      if (file.size > 100*Size1MB) {
        delete window.FileReader;
        log(file.name +"这是一个大文件, 进度条不工作, 请等待上传完成", 'warn');
      } else {
        window.FileReader = _FileReader;
      }
      
      file.sendTo(get_url('upload', {
        v: pg().vol, 
        p: parent,
      }));
    } 
  }
  
  function open_upload() {
    fs_showupload.show();
    mask.fadeIn();
  }
  
  function rmdir_func() {
    if (!path) {
      zy.ui.msg("必要", "选择要删除的文件", 'i');
      return;
    }
    
    get('rmdir', {v:vol, p:path}, (err)=>{
      if (!err) {
        fs_toolbar.trigger('update');
      }
    });
  }
  
  function rename_func() {
    let dg = showDialog('重命名', '目录名称');
    if (!path) {
      zy.ui.msg("必要", "选择要重命名的文件", 'i');
      return;
    }
    
    dg.find('.ok').click(function() {
      let name = dg.find('.fileName').val();
      let inf = pg();
      dg.modal('hide');
      
      get('move', {v:vol, p:path, t:join(inf.path, name)}, function(err) {
        if (!err) fs_toolbar.trigger('update');
      });
    });
  }
  
  function mkdir_func() {
    let dg = showDialog('创建目录', '目录名称');
    
    dg.find('.ok').click(function() {
      let name = dg.find('.fileName').val();
      let inf = pg();
      dg.modal('hide');
      
      get('mkdir', {v:inf.vol, p:join(inf.path, name)}, function(err, d) {
        if (!err) fs_toolbar.trigger('update');
      });
    });
  }
}


function get_url(api, param) {
  if (zy.debug) param.s = 'd';
  return zy.g.host.api + URLBase + api +'?'+ jQuery.param(param);
}


function open_volume(volinfo) {
  let currpath = '/';
  const readonly = !volinfo.w;
  const info_cache = {};
  
  select_volume_msg.hide();
  fs_toolbar.find('form').off('submit').submit(changepath);
  fs_toolbar.off('update').on('update', ()=>{ update(currpath) });
  tb.show(readonly, ()=>{ 
    return { path:currpath, vol:volinfo.id };
  });
  update('/');
  
  
  function update(newPath) {
    let old = currpath;
    fs_showfiles.css('opacity', 0.3);
    
    ls(newPath, function(err, d) {
      fs_showfiles.css('opacity', 1);
      if (err) {
        currpath = old;
        return;
      }
      if (d) {
        fs_showfiles.empty();
        clearInfo();
        currpath = newPath;
        tb.setPath(currpath);
        
        putFile({type:'return', name:'..', r:volinfo.r, w:volinfo.w, owner:'sys', ctime:Date.now() }, up)
          .click(()=>{ tb.reset() });
          
        d.data.sort(function(a, b) {
          return a.name > b.name ? 1 : (a.name < b.name ? -1 : 0);
        });
          
        d.data.forEach(function(f) {
          let xinfo = [{name:'数据卷', val:volinfo.id}];
          let ctrl = [];
          set_ctrl(f, ctrl);
          let fi = putFile(f, open, xinfo, ctrl);
          fi.click(()=>{
            fileSelected(f);
          });
        });
      }
    });
  }
  
  function fileSelected(f) {
    let filepath = join(currpath, f.name);
    tb.setCurrentSelect(volinfo.id, filepath);
    
    if (f.type == 'file') {
      let d = info_cache[filepath];
      if (d) {
        _set(d);
      } else {
        get('fileinfo', {v:volinfo.id, p:filepath}, (err, d)=>{
          if (d) {
            _set(d);
            info_cache[filepath] = d;
          }
        });
      }
      
      function _set(d) {
        f.addx({ name: '区块',   val: d.key });
        f.addx({ name: 'MD5',    val: d.data.md5 });
        f.addx({ name: 'SHA1',   val: d.data.sha1 });
        f.addx({ name: 'SHA512', val: d.data.sha512 });
        f.addx({ name: '上传人', val: d.data.who });
      }
    }
  }
  
  function set_ctrl(info, ctrl) {
    if (info.type == 'file') {
      ctrl.push({
        name : '下载文件',
        func() {
          downfile(info);
        },
      }, {
        name : '校验文件',
        func() {
          verify_file(info);
        }
      });
    }
    if (info.type == 'folder') {
      ctrl.push({
        name : '打包并下载目录',
        func() {
          packdir(info);
        },
      });
    }
  }
  
  function verify_file(info) {
    let filepath = join(currpath, info.name);
    let vd = setupDialog(verifyDialog);
    vd.find('.fileName').val(filepath);
    let res = vd.find(".result").html('校验中...');
    
    get('verify', {v: volinfo.id, p: filepath}, (err, d)=>{
      let msg = [];
      if (err) {
        msg.push(err.message);
      } else {
        for (let n in d.data) {
          msg.push('<tr><th>', n, '</th><td>', d.data[n], '</td></tr>');
        }
      }
      res.html(msg.join(''));
    });
  }
  
  function open(fileinfo) {
    switch (fileinfo.type) {
      case 'folder':
        update(join(currpath, fileinfo.name));
        break;
        
      case 'file':
        downfile(fileinfo);
        break;
    }
  }
  
  function downfile(fileinfo) {
    $('#downloadfile').attr('src', get_url('get', {
      v : volinfo.id,
      p : join(currpath, fileinfo.name),
    }));
  }
  
  function packdir(info) {
    $('#downloadfile').attr('src', get_url('packdir', {
      v : volinfo.id,
      p : join(currpath, info.name),
    }));
  }
  
  function up() {
    tb.reset();
    let p = currpath.split('/');
    if (p.length > 2) {
      p.pop();
      update(p.join('/'));
    }
    else if (p[1]) {
      currpath = '/';
      update('/');
    }
    else {
      tb.hide();
      clearInfo();
      show_volume_select();
    }
  }
  
  function ls(path, cb) {
    get('ls', { v:volinfo.id, p:path }, cb);
  }
  
  function changepath() {
    let p = join('/', tb.getPath());
    if (p != currpath) {
      update(p);
    }
    return false;
  }
}


function showDialog(title, label) {
  let dg = setupDialog(mkdir_template);
  dg.find('.labelName').text(label);
  dg.find('.modal-title').text(title);
  return dg;
}


function setupDialog(jtemplate) {
  let dg = jtemplate.clone();
  dg.appendTo(document.body).modal('show');
  
  dg.on('hidden.bs.modal', function() {
    dg.remove();
  });
  return dg;
}


function clearInfo() {
  fs_showinfo.find('.icon').removeAttr('src');
  fs_showinfo.find('.xinfo').empty();
  fs_showinfo.find('.xctrl').empty();
  fs_showinfo.find('hr').hide();
  
  ['.name', '.type', '.size', '.auth', '.owner', '.time'].forEach((x)=>{
    fs_showinfo.find(x).text('');
  });
}


function showInfo(icon, info, xinfo, xctrl) {
  fs_showinfo.find('hr').show();
  fs_showinfo.find('.icon').attr('src', icon);
  fs_showinfo.find('.name').text(info.name);
  fs_showinfo.find(".type").text(typename[info.type]);
  fs_showinfo.find('.auth').text(info.w ? '可读写' : (info.r ? '只读' : '权限错误'));
  fs_showinfo.find('.owner').text('归属: '+ info.owner);
  fs_showinfo.find('.time').text(new Date(info.ctime).toLocaleString());
  fs_showinfo.find('.size').text(info.size ? info.size +' 字节 '+ store_size(info.size) : '');
  
  const jxinfo = fs_showinfo.find('.xinfo').empty();
  const jxctrl = fs_showinfo.find('.xctrl').empty();
  if (xinfo) xinfo.forEach(addx);
  if (xctrl) xctrl.forEach(addctrl);
  info.addx = addx;
  
  function addx(x) {
    let xdiv = $("<div><span class='note'>"+ x.name +"</span>&nbsp;<span>"+ x.val +"</span></div>");
    jxinfo.append(xdiv);
  }
  
  function addctrl(x) {
    let ctrl = $("<a href='#' class='btn btn-info btn-sm'>"+ x.name +"</a>");
    jxctrl.append(ctrl);
    ctrl.click(function() {
      x.func(info, ctrl);
      return false;
    });
  }
}


function putFile(info, ongoto, xinfo, xctrl) {
  let icon = 'fs-chain/icon/'+ info.type +'.png';
  let fileitem = file_item_template.clone();
  fileitem.find('.icon').attr('src', icon);
  fileitem.find('.name').text(info.name).addClass(info.type);
  // info.size && fileitem.find('.size').text(info.size);
  fs_showfiles.append(fileitem);
  
  if (info.w) fileitem.find('.lock').hide();
  
  fileitem.click(function() {
    fs_showfiles.trigger('unselect');
    fileitem.addClass('selected_fileitem');
    showInfo(icon, info, xinfo, xctrl);
  });
  
  fileitem.dblclick(function() {
    flash(fileitem.find(".icon"));
    ongoto(info, fileitem);
  });
  
  fs_showfiles.on('unselect', function() {
    fileitem.removeClass('selected_fileitem');
  });
  
  function flash(_icon) {
    const offset = 50;
    let icon = _icon.clone();
    let pos = _icon.offset();
    icon.appendTo(document.body);
    icon.css({ position: 'absolute', width: 64, top: pos.top, left: pos.left, });
    icon.animate({ 
      opacity : 0, 
      width   : 64+offset, 
      left    : pos.left-offset/2, 
      top     : pos.top-offset/2,
    }, 300, ()=>{
      icon.remove();
    });
  }
  
  return fileitem;
}


function get(api, param, cb) {
  zy.net.get(URLBase + api, function(d) {
    cb(null, d);
  }, param, 0, function(e) {
    zy.ui.msg("错误", e.msg, 'e');
    cb(e);
  });
}
  
  
function join(apath, bpath) {
  let a = apath.split('/');
  let b = bpath.split('/');
  let c = a.concat(b);
  for (let i=1; i<c.length;) {
    if (!c[i] || c[i] == '.') {
      c.splice(i, 1);
      continue;
    }
    if (c[i] == '..') {
      c.splice(i-1, 2);
      continue;
    }
    ++i;
  }
  return c.join('/') || '/';
}


function store_size(x) {
  if (x < 1024) return '';
  if (x < 1024**2) return parseInt(x/1024) +"KB";
  if (x < 1024**3) return parseInt(x/1024/1024) +"MB";
  return parseInt(x/1024/1024/1024) +"GB";
}


// element: Function(elementObj, next(), index)
function eachAsync(arr, element, end) {
  let i = -1;
  _next();
  
  function _next() {
    if (++i < arr.length) {
      element(arr[i], _next, i);
    } else {
      end();
    }
  }
}
  
});