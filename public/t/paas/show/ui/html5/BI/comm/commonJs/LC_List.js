function List(){

	this.value = [];
	

	/*���*/
	this.add = function(obj){
		return this.value.push(obj);
	};
	
	/*��С*/
	this.size = function(){
		return this.value.length;
	}

	/*����ָ��������ֵ*/
	this.get = function(index){
		return this.value[index];
	}

	/*ɾ��ָ��������ֵ*/
	this.remove = function(index){
		this.value1 = [];							
		this.value[index]='';						
		for(var i=0;i<this.size();i++){
			if(this.value[i]!=''){					
				this.value1.push(this.value[i]);
			}
		}
		this.value = this.value1;	
		delete this.value1;			
		return this.value;			
	}
	
	/*ɾ��ȫ��ֵ*/
	this.removeAll = function(){
		return this.value=[];		
		
	}

	/*�Ƿ����ĳ������*/
	this.constains = function(obj){
		for(var i in this.value){		
			if( obj == this.value[i] ){	
				return true;
			}else{						
				continue;
			}
		}
		return false;				
	}

}