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
const tb                  = toolbar();

const typename = {
  'vol'   : '数据卷',
  'file'  : '文件',
  'folder': '目录',
  'return': '返回',
};

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
  
  let vol, path, pg;
  
  window.fd.logging = false;
  var upzone = new FileDrop('fs_showupload');
  var bar = fs_showupload.find('.bar_zone');
  var closeUpload = fs_showupload.find('.close');
  upzone.multiple(true);
  upzone.event('send', on_send);
  fs_showupload.find('[type=file]').attr('webkitdirectory', true);
  
  closeUpload.click(()=>{ 
    fs_showupload.hide(); 
    $('.mask').hide();
    _log.empty();
    bar.css('width', '0');
    return false; 
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
  
  function log(msg, cssClass) {
    _log.prepend(["<div class='", cssClass, "'><span class='note'>", 
        new Date().toLocaleString(), '</span>', msg, "</div>"].join(' '));
  }
  
  function on_send(files) {
    let total_files = files.length;
    let fail = 0, succ = 0;
    log("upload..");
    closeUpload.hide();
    
    eachAsync(files, (f, next, i)=>{
      up_file(f, pg().path, next, i);
    }, ()=>{
      bar.css('width', '100%');
      log([succ, '成功, ', fail, '失败, 共', total_files, '文件, 上传结束'].join(' '));
      closeUpload.show();
      fs_toolbar.trigger('update');
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
        var width = ((current / total) * (fileIndex / total_files)) * 100 + '%'
        bar.css('width', width);
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
          log(file.name +" 完成, "+ file.size +'字节');
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
      let param = {
        v: pg().vol, 
        p: parent,
      };
      if (zy.debug) param.s = 'd';
      let url = zy.g.host.api + URLBase +'upload?'+ jQuery.param(param);
      file.sendTo(url);
    } 
  }
  
  function open_upload() {
    fs_showupload.show();
    $('.mask').show();
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


function open_volume(volinfo) {
  let currpath = '/';
  const readonly = !volinfo.w;
  
  select_volume_msg.hide();
  fs_toolbar.find('form').off('submit').submit(changepath);
  fs_toolbar.off('update').on('update', ()=>{ update(currpath) });
  tb.show(readonly, ()=>{ 
    return { path:currpath, vol:volinfo.id };
  });
  update('/');
  
  
  function update(newPath) {
    let old = currpath;
    
    ls(newPath, function(err, d) {
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
          let fi = putFile(f, open, [{name:'数据卷', val:volinfo.id}]);
          fi.click(()=>{
            tb.setCurrentSelect(volinfo.id, join(currpath, f.name));
          });
        });
      }
    });
  }
  
  function open(fileinfo) {
    update(join(currpath, fileinfo.name));
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
  let dg = mkdir_template.clone();
  dg.appendTo(document.body).modal('show');
  dg.find('.labelName').text(label);
  dg.find('.modal-title').text(title);
  
  dg.on('hidden.bs.modal', function() {
    dg.remove();
  });
  return dg;
}


function clearInfo() {
  fs_showinfo.find('.icon').removeAttr('src');
  fs_showinfo.find('.xinfo').empty();
  ['.name', '.type', '.size', '.auth', '.owner', '.time'].forEach((x)=>{
    fs_showinfo.find(x).text('');
  });
  fs_showinfo.find('hr').hide();
}


function showInfo(icon, info, xinfo) {
  fs_showinfo.find('hr').show();
  fs_showinfo.find('.icon').attr('src', icon);
  fs_showinfo.find('.name').text(info.name);
  fs_showinfo.find(".type").text(typename[info.type]);
  fs_showinfo.find('.auth').text(info.w ? '可读写' : (info.r ? '只读' : '权限错误'));
  fs_showinfo.find('.owner').text('归属: '+ info.owner);
  fs_showinfo.find('.time').text(new Date(info.ctime).toLocaleString());
  fs_showinfo.find('.size').text(info.size ? info.size +' 字节' : '');
  
  fs_showinfo.find('.xinfo').empty();
  if (xinfo) xinfo.forEach(addx);
  
  function addx(x) {
    let xdiv = $("<div><span class='note'>"+ x.name +"</span>&nbsp;<span>"+ x.val +"</span></div>");
    fs_showinfo.find('.xinfo').append(xdiv);
  }
}


function putFile(info, ongoto, xinfo) {
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
    showInfo(icon, info, xinfo);
  });
  
  fileitem.dblclick(function() {
    ongoto(info, fileitem);
  });
  
  fs_showfiles.on('unselect', function() {
    fileitem.removeClass('selected_fileitem');
  });
  
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