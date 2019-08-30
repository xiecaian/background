var initTable = (function(){

    var Table = function(node){
        this.node = node;
        this.pages = 20;
        this.rows,
        this.curPage = 1;
        console.log(this.node);
        this.init();
    };
    Table.prototype = {
        init: function(){
            var data;
            data = this.getData(this.node);
            this.setData(data);
            this._renderPaging(this.curPage);
            this._getDateFromAJAX(this.curPage,this.rows);
            this.bindEvent();
            console.log(data);
            
        },

        bindEvent: function(){
            var _self = this;
            addEvent(_self.tableWrap,'click',_self._clickShow);
            addEvent(_self.pagingWrap,'click',_self._clickPagingShow.bind(_self));
        },

        _clickPagingShow: function(e){
            var event = e || window.event,
                tar = event.target || event.srcElement,
                tarClassName = tar.className,
                dataField = tar.getAttribute('data-field');
                if('pageBtn' == tarClassName){
                    this.curPage = parseInt(tar.FindsiblingNode(-1).value) || 1;
                }else if('rowsBtn' == tar.className){
                    this.rows =  parseInt(tar.FindsiblingNode(-1).value) || 1;
                }else if('btn' == dataField){
                    this.curPage = parseInt(tar.innerHTML);
                }else if('prve' == dataField ){
                    this.curPage -= 1;
                }else if('next' == dataField ){
                    this.curPage += 1;
                }
                this._renderPaging(this.curPage); 
                this._getDateFromAJAX(this.curPage,this.rows);
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
                pagingWrap : data.pagingWrap,
                page: data.page,
                pageBtn:data.pageBtn,
                rows: data.rows,
                rowsBtn:data.rowsBtn,
                paging:data.paging
            }
        },

        setData: function(data){
            
            this.tableWrap = document.getElementsByClassName(data.tableWrap)[0];
            this.JXml = document.getElementById(data.JXml);
            this.pagingWrap = document.getElementsByClassName(data.pagingWrap)[0];
            this.paging  = document.getElementsByClassName(data.paging)[0];
            this.page = document.getElementsByClassName(data.page)[0];
            this.rows = document.getElementsByClassName(data.rows)[0];
            console.log(this.pagingWrap);
            console.log(this.paging);
        },
        /**
         * @ target: 渲染分页 
         * @ pages:总页数 curpages：当前页数
         * 
         */
        _renderPaging :function(curPage){
            
            var render = new InitPagingBtns(this.paging);
            render(this.pages,curPage);
        },
        /** 
         * @ target: AJAX和get，POST交互
        */
        _getDateFromAJAX : function(rows,page){
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
            */
           var _self = this;
            xhr.get('http://192.168.31.91:9001/Role/RoleList?roleid=&rolename=&rows='+rows+'&page='+page,
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

                
            })*/
        },

        /** 
         * @ target:渲染数据
         * @ 传入的opt对象中的datas：是从后台传入的值;xml:传入的是模板，wrap：要渲染到哪个div盒子中
        */
        _render: function(opt){
            var list = '',
                _self = this,
                datas = opt.datas.data,
                tplNow = opt.xml;/**得到模板 */
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
})();

new initTable(document.getElementsByClassName('J_Data')[0]);
