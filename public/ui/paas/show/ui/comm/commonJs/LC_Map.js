function Map() {
    this.elements = new Array();
 
      //��ȡMAPԪ�ظ���
     this.size = function() {
         return this.elements.length;
     };
 
      //�ж�MAP�Ƿ�Ϊ��
     this.isEmpty = function() {
         return (this.elements.length < 1);
     };
  
      //ɾ��MAP����Ԫ��
     this.clear = function() {
         this.elements = new Array();
     };
 
     //��MAP������Ԫ�أ�key, value) 
     this.put = function(_key, _value) {
         this.elements.push( {
            key : _key,
             value : _value
         });
     };
 
     //ɾ��ָ��KEY��Ԫ�أ��ɹ�����True��ʧ�ܷ���False
     this.removeByKey = function(_key) {
         var bln = false;
         try {
             for (i = 0; i < this.elements.length; i++) {
                 if (this.elements[i].key == _key) {
                     this.elements.splice(i, 1);
                     return true;
                 }
             }
         } catch (e) {
             bln = false;
         }
         return bln;
     };
     
     //ɾ��ָ��VALUE��Ԫ�أ��ɹ�����True��ʧ�ܷ���False
     this.removeByValue = function(_value) {//removeByValueAndKey
         var bln = false;
         try {
             for (i = 0; i < this.elements.length; i++) {
                 if (this.elements[i].value == _value) {
                     this.elements.splice(i, 1);
                     return true;
                 }
             }
         } catch (e) {
             bln = false;
         }
         return bln;
     };
     
     //ɾ��ָ��VALUE��Ԫ�أ��ɹ�����True��ʧ�ܷ���False
     this.removeByValueAndKey = function(_key,_value) {
         var bln = false;
         try {
             for (i = 0; i < this.elements.length; i++) {
                 if (this.elements[i].value == _value && this.elements[i].key == _key) {
                     this.elements.splice(i, 1);
                     return true;
                 }
             }
         } catch (e) {
             bln = false;
         }
         return bln;
     };

     //��ȡָ��KEY��Ԫ��ֵVALUE��ʧ�ܷ���NULL
     this.get = function(_key) {
         try {
             for (i = 0; i < this.elements.length; i++) {
                 if (this.elements[i].key == _key) {
                     return this.elements[i].value;
                 }
             }
         } catch (e) {
             return false;
         }
         return false;
     };
 
     //��ȡָ��������Ԫ�أ�ʹ��element.key��element.value��ȡKEY��VALUE����ʧ�ܷ���NULL
     this.element = function(_index) {
         if (_index < 0 || _index >= this.elements.length) {
             return null;
         }
         return this.elements[_index];
     };
 
     //�ж�MAP���Ƿ���ָ��KEY��Ԫ��
     this.containsKey = function(_key) {
         var bln = false;
         try {
             for (i = 0; i < this.elements.length; i++) {
                 if (this.elements[i].key == _key) {
                     bln = true;
                 }
             }
         } catch (e) {
             bln = false;
         }
         return bln;
     };
 
     //�ж�MAP���Ƿ���ָ��VALUE��Ԫ��
     this.containsValue = function(_value) {
         var bln = false;
         try {
             for (i = 0; i < this.elements.length; i++) {
                 if (this.elements[i].value == _value) {
                     bln = true;
                 }
             }
         } catch (e) {
             bln = false;
         }
         return bln;
     };
     
     //�ж�MAP���Ƿ���ָ��VALUE��Ԫ��
     this.containsObj = function(_key,_value) {
         var bln = false;
         try {
             for (i = 0; i < this.elements.length; i++) {
                 if (this.elements[i].value == _value && this.elements[i].key == _key) {
                     bln = true;
                 }
             }
         } catch (e) {
             bln = false;
         }
         return bln;
     };
 
     //��ȡMAP������VALUE�����飨ARRAY��
     this.values = function() {
         var arr = new Array();
         for (i = 0; i < this.elements.length; i++) {
             arr.push(this.elements[i].value);
         }
         return arr;
     };
     
    //��ȡMAP������VALUE�����飨ARRAY��
     this.valuesByKey = function(_key) {
         var arr = new Array();
         for (i = 0; i < this.elements.length; i++) {
             if (this.elements[i].key == _key) {
                 arr.push(this.elements[i].value);
             }
         }
         return arr;
     };
 
     //��ȡMAP������KEY�����飨ARRAY��
     this.keys = function() {
         var arr = new Array();
         for (i = 0; i < this.elements.length; i++) {
             arr.push(this.elements[i].key);
         }
         return arr;
     };
     
     //��ȡkeyͨ��value
     this.keysByValue = function(_value) {
         var arr = new Array();
         for (i = 0; i < this.elements.length; i++) {
             if(_value == this.elements[i].value){
                 arr.push(this.elements[i].key);
             }
         }
         return arr;
     };
     
     //��ȡMAP������KEY�����飨ARRAY��
     this.keysRemoveDuplicate = function() {
         var arr = new Array();
         for (i = 0; i < this.elements.length; i++) {
             var flag = true;
             for(var j=0;j<arr.length;j++){
                 if(arr[j] == this.elements[i].key){
                     flag = false;
                     break;
                 } 
             }
             if(flag){
                 arr.push(this.elements[i].key);
             }
         }
         return arr;
     };
 }