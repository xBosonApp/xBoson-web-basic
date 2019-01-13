(function(window,localStorage,undefined){
var sys_LS = {
    set : function(key, value){
        //在iPhone/iPad上有时设置setItem()时会出现诡异的QUOTA_EXCEEDED_ERR错误
        //这时一般在setItem之前，先removeItem()就ok了
        if( this.get(key) !== null ){
            this.remove(key);
		}
        //localStorage.setItem(key, value);//ys
		store.set(key, value);
    },
    //查询不存在的key时，有的浏览器返回undefined，这里统一返回null
    get : function(key){
        // var v = localStorage.getItem(key); //ys
        var v = store.get(key);
		return v === undefined ? null : v;
    },
	//length:function(){ //ys
	//   return localStorage.length;
	//},
    remove : function(key){ 
	    //localStorage.removeItem(key);//ys 
		store.remove(key)
    },
    clear : function(){ 
	    // localStorage.clear(); //ys
		store.clear();
	}
},
j = window.jQuery, c = window.Core;
//扩展到相应的对象上
window.sys_LS = window.sys_LS || sys_LS;
//扩展到其他主要对象上
if(j) j.sys_LS = j.sys_LS || sys_LS;
if(c) c.sys_LS = c.sys_LS || sys_LS;
})(window,window.localStorage);