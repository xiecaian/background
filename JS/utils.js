var xhr = (function(){
	var o = window.XMLHttpRequest ? new XMLHttpRequest 
								  : new ActiveXObject('Micrsoft.XMLHTTP');
	function _doAjax(opt){
		console.log(opt);
		var opt = opt || {},
			transferType = (opt.type || 'GET').toUpperCase(),
			asyncTrue = opt.async || true,
			url = opt.url,
			data = opt.data,
			error = opt.error || function(){},
			success = opt.success || function(){},
			complete = opt.complete || function(){};
			if(!url){
				throw new Error('您没有输入URL');
			}
			o.open(transferType,url,asyncTrue);
			transferType === 'POST' && o.setRequestHeader('Content-type','application/x-www-form-urlencoded');
			o.send(transferType === 'GET' ? null
										  : formatDatas(data));
			o.onreadystatechange = function(){
				if(o.readyState == 4 && o.status == 200){
					/*服务器请求已完成，且响应已就绪 且服务器响应OK*/
					success(o.responseText);
				}
				if(o.status == 404){
					error();
				}
				complete();
			}
	}	
	/*
	* @目的： 将传入的
	*opt{a：1，
	*	b:2} 
	*转换成字符串“a = 1&b=2”
	*/
	function formatDatas(opt){
		var str = '';
		for(var key in opt){
			str += key + '=' + opt[key] + '&';
		}
		return str.replace(/&$/,'');
	}
	
	return {
		ajax: function(obj){
			_doAjax(obj);
		},
		post: function(url,data,callBackFunction){
			_doAjax({
				url: url,
				type: 'POST',
				data:data,
				success : callBackFunction
			});
		},
		get: function(url,callBackFunction){
			_doAjax({			
				url : url,
				type: 'get',
				success: callBackFunction 
			})
		}
	}
})();

/**在tpl的模块中用opt中的数据替换掉符合tpl中符合正则表达式的数据 */
function setTplToHTML(tpl,regExp,opt){
    return tpl.replace(regExp(),function(node,key){
        return opt[key];
    });
}

/** 正则表达式*/
function regTpl(){
    return new RegExp(/{{(.*?)}}/,'gim');
}

/*事件监听函数*/
;(function(){
	function addEvent(el,type,fn){
		if(addEventListener){
			el.addEventListener(type,fn,false);
		}
		else if(el.attachEvent){
			el.attachEvent('on' + type,function(){
				fn.call(el);/*attachEvent默认是指向window，需要改*/
			});
		}
		else{
			el['on'+type] = fn;
		}
	}
	window.addEvent = addEvent;
})();

/*取消事件监听函数 */
;(function(){
	function removeEvent(el,type,fn){
		if(el.addEventListener){
			el.removeEventListener(type,fn,false);
		}
		else if(el.attachEvent){
			el.detachEvent('on' +type,fn);
		}
		else{
			el['on'+'type'] = null;
		}
	}
	window.removeEvent = removeEvent;
})();

/** 
 * @ target : 将时间戳变成xxxx-xx-xx-xx-xx-xx
*/

;(function(){
	function setTimeFormat(timestamp){
		var time = new Date(timestamp);
		console.log(time);
		console.log(time.getFullYear());
		console.log(time.getTime());
		return time.getFullYear() + '-'+time.getMonth()+'-'+time.getDate() +'-'+ time.getHours() + '-'+time.getMinutes() + '-'+time.getSeconds();
		
	};
	window.setTimeFormat = setTimeFormat;
})();

/** 找到当前元素Elem的N级的父元素*/
;(function(){

	var findParents = function(Elem,N){
		if(N <= 0){
			return ;
		}
		while(N){
			Elem = Elem.parentNode;
			N--;
		}
		return Elem;
		
	}
	window.findParents = findParents;
})();

/** 
 * @ target： 找到兄弟节点
*/
Element.prototype.FindsiblingNode = function(num){
	var elem = this;
	while(num){
		if(num>0){
			elem = elem.nextSibling;
			while(elem && 1 !== elem.nodeType){
				elem = elem.nextSibling;
			}
			num--;
		}
		else if(num<0){
			elem = elem.previousSibling;
			while(elem && 1 !== elem.nodeType){
				elem = elem.previousSibling;
			}
			num++;
		}
	}
	return elem;
};

/*
* @target :分页模板
* @传入值 Elem 代表的是需要将分页的挂在哪个元素上
*		  pages:代表是当前总页，curPages代表的是当前页
*/
var InitPagingBtns = (function(){
	
	var PagingBtn = function(elem){
		var _self = this;
		this.btnGroup = '';
		this.elem = elem;
		return function(pages,curPage){
				_self.elem.innerHTML = _self.render(curPage,pages,_self.btnGroup);
		}
	}

	PagingBtn.prototype = {
		init : function(){
			console.log(this.elem,this.btnGroup);
		},
		pagingBtnTpl : function(type,curPage,num,pages){
			switch(type){
				case 'btn':
					if(num === curPage){
						return '<span class = "page-btn page-btn-cur">'+num+'</span>'
					}else{
						return '<a href="javascript:;" class="page-btn" data-page="'+ num +'" data-field="btn">'+ num +'</a>';
					}
					break;
				case 'prev':
					if(curPage == 1){
						return '<span class="dir-btn prev-btn disabled"><i class="fa fa-angle-left"></i></span>';
					}else{
						return '<a href="javascript:;" class="dir-btn prev-btn" data-field="prev"><i class="fa fa-angle-left" data-field="prev"></i></a>';
					}
					break;
				case  'next':
				  if(curPage == pages){
					return '<span class="dir-btn next-btn disabled"><i class="fa fa-angle-right"></i></span>';
				  }else{
					return '<a href="javascript:;" class="dir-btn next-btn" data-field="next"><i class="fa fa-angle-right" data-field="next"></i></a>';
				  }
				  break;
				case 'points':
				  return '<span class="points">...</span>';
				  break;
				default:
					return '分页时输入type有问题'
			}
		},

		/* 制作从start到end的btn模板*/
		makePagingGroup: function(start,end,curPage){
			var tpl = '';
			for(var i = start;i <= end;i++){
				tpl += this.pagingBtnTpl('btn',curPage,i);
			}
			console.log(tpl);
			return tpl;
		},

		render: function(curPage,pages,btnGroup){
			console.log(btnGroup);
			btnGroup += this.pagingBtnTpl('prev',curPage,pages);/**最开始的左按钮 */
			if(pages > 7){
				if(curPage <= 4){
					btnGroup += this.makePagingGroup(1,curPage+1,curPage);
					btnGroup += this.pagingBtnTpl('points');
					btnGroup += this.makePagingGroup(pages-1,pages,curPage);
				}else if(curPage > 4 && curPage <= pages-4){
					btnGroup += this.makePagingGroup(1,2,curPage);
					btnGroup += this.pagingBtnTpl('points');
					btnGroup += this.makePagingGroup(curPage-1,curPage+1,curPage);
					btnGroup += this.pagingBtnTpl('points');
					btnGroup += this.makePagingGroup(pages-1,pages,curPage);
				}else if(curPage > pages-4 && curPage < pages){
					btnGroup += this.makePagingGroup(1,2,curPage);
					btnGroup += this.pagingBtnTpl('points');
					btnGroup += this.makePagingGroup(curPage-1,pages,curPage);
				}else{
					btnGroup += this.makePagingGroup(1,2,curPage);
					btnGroup += this.pagingBtnTpl('points');
					btnGroup += this.makePagingGroup(curPage-2,pages,curPage);

				}
			}else{
				btnGroup += this.makePagingGroup(1,pages,curPage);
			}
			console.log(btnGroup);
			btnGroup += this.pagingBtnTpl('next',curPage,pages);/**最开始的右按钮 */
			return btnGroup;
			
		}
	}
	return PagingBtn; 
})()	

/**
 *@ 目的：面向对象编程模板  */
/**
var initTable = (function(){

    var Table = function(node){
        this.node = node;
        console.log(this.node);
        this.init();
    };
    Table.prototype = {
        init: function(){
            var data;

            data = this.getData(this.node);
            this.setData(data);
            this._getDateFromAJAX();
            this.bindEvent();
            console.log(data);
            
        },

        bindEvent: function(){
            var _self = this;
            addEvent(_self.tableWrap,'click',_self._clickShow)
        },

        _clickShow: function(e){
            var event = e || window.event,
                tar = event.target ||  event.srcElement,
                tarName,
                bortherNode;
            if('table_button' == tar.className){
                tarName = findParents(tar,1);
                bortherNode = tarName.FindsiblingNode(-2);
                console.log(bortherNode.innerHTML);
                console.log(tarName);
                alert(bortherNode.innerHTML);
            }
        },

        getData: function(node){
            var data = JSON.parse(node.getAttribute("data-config"));
            return {   
                tableWrap: data.tableWrap,
                JXml: data.J_Xml,
            }
        },

        setData: function(data){
            this.tableWrap = document.getElementsByClassName(data.tableWrap)[0];
            this.JXml = document.getElementById(data.JXml);
        },

        /** 
         * @ target: AJAX和get，POST交互
        *//*
	   _getDateFromAJAX : function(){
		/*
		xhr.ajax({
			url: 'wwww',
			type:'POST',
			data:{

			},
			success: function(datas){
				console.log(1);
			},
			error: function(){
				console.log(1);
			}
			
		}),
		*//*
	   var _self = this;
		xhr.get('http://192.168.31.91:9001/Role/RoleList?roleid=&rolename=&rows=2&page=1',
			function(datas){
				var data = JSON.parse(datas);
				console.log(data);
				
				_self._render({
					datas: data,
					xml: _self.JXml.innerHTML,
					wrap: _self.tableWrap
				});
			}
		);
/*
		xhr.post(
			url:"www",
			data:"",
			success:function(datas){

			
		})*//*
	},

	/** 
	 * @ target:渲染数据
	 * @ 传入的opt对象中的datas：是从后台传入的值;xml:传入的是模板，wrap：要渲染到哪个div盒子中
	*//*
	_render: function(opt){
		var list = '',
			_self = this,
			datas = opt.datas.data,
			tplNow = opt.xml;/**得到模板 *//*
			console.log(opt.wrap);
			datas.forEach(function(val,index,array){
				console.log(1);
				console.log(setTimeFormat(val.createtime.time));
				list += setTplToHTML(tplNow,regTpl,{
					rolename: val.rolename,
					roleid: val.roleid,
					time: setTimeFormat(val.createtime.time)
				})
			});
			
			opt.wrap.innerHTML += list;
	},
	_setTime(opt){
		return opt.year + '-'+opt.month+'-'+opt.day +'-'+ opt.hours + '-'+opt.minutes + '-'+opt.seconds;
		
	}

}
return Table;
})();*/