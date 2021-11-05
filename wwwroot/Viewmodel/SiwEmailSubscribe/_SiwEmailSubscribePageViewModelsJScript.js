var SiwEmailSubscribesPageViewModel = function () {
    var self = this;
    self.getUrl = {
        getSiwEmailSubscribes   : "/SiwEmailSubscribe/GetPage",
        saveSiwEmailSubscribe   : "/SiwEmailSubscribe/Save",
        removeSiwEmailSubscribe : "/SiwEmailSubscribe/Remove",
        getInit : "/SiwEmailSubscribe/GetInit",
    };
    self.processing = ko.observable(null);
    self.transition = ko.observable(null);
    self.ffInit = ko.observable(null);
    self.ffInitNew = ko.observable(null);
    self.ffSave = ko.observable(null);
    self.ffDelete = ko.observable(null);
    self.paging = ko.observable(new ItemPaging(1, 20, 0));
    self.sortedField = ko.observable(null);
    self.arrSearchParam = ko.observableArray([]);
    self.arrSiwEmailSubscribe = ko.observableArray([]);
    self.arrSSiwEmailSubscribe = ko.observableArray([]);
    self.actionOnLocal = ko.observable(false);
    //------- Init data for view model----------------------------
    self.initModel = function(transition,processing){
        self.transition = transition;
        self.processing = processing;
    };
    self.initData = function () {
        InitSiwEmailSubscribes();
    };
    self.initLocalData = function (data) {
       var arrItem = ko.utils.arrayMap(data, function (item) {
           return self.convertDataToSiwEmailSubscribe(item);
       });
       self.arrSiwEmailSubscribe.removeAll();
       self.arrSiwEmailSubscribe(arrItem);
       if(self.ffInit() != null) self.ffInit()();
    };
    self.setFFInit = function(ffInit){
        self.ffInit(ffInit);
    };
    self.setFFInitNew = function(ffInitNew){
        self.ffInitNew(ffInitNew);
    };
    self.setFFSave = function(ffSave){
        self.ffSave(ffSave);
    };
    self.setFFDelete = function(ffDelete){
        self.ffDelete(ffDelete);
    };
    //--------------- For Paging and Searching -----------------------------//
    self.searchSiwEmailSubscribes = function(){
        InitSiwEmailSubscribes();
    };
    self.resetSearchSiwEmailSubscribe = function() {
        self.setSearchParam("searchCode", null);
        InitSiwEmailSubscribes();
    };
    self.gotoPage = function(page){
       if(page!=self.paging().pageIndex()){
           self.paging().pageIndex(page);
           InitSiwEmailSubscribes();
       }
    };
    self.gotoNextPage = function(){
       if(self.paging().pageIndex()<self.paging().totalPages()){
           self.paging().pageIndex(self.paging().pageIndex()+1);
           InitSiwEmailSubscribes();
       }
    };
    self.gotoPrevPage = function(){
        if(self.paging().pageIndex()>1){
            self.paging().pageIndex(self.paging().pageIndex()-1);
            InitSiwEmailSubscribes();
        }
    };
    self.getSearchParam = function (key) {
        var param = ko.utils.arrayFirst(self.arrSearchParam(), function (param1) { return param1.key() == key; });
        if(param == null)
        {
            param = new SearchParam(key, null);
            self.arrSearchParam.push(param);
        }
        return param;
    };
    self.setSearchParam = function (key,value) {
        var param = ko.utils.arrayFirst(self.arrSearchParam(), function (param1) { return param1.key() == key; });
        if(param == null) {
            param = new SearchParam(key, value);
            self.arrSearchParam.push(param);
        }else{ param.value(value);}
    };
    //--------------- For Item -----------------------------//
    //--------------- Model Event ----------//
    self.startAddSiwEmailSubscribe = function(){
        self.processing().setProcessing("SiwEmailSubscribes",true);
        CallAPI(self.getUrl.getInit, null,"GET", FinishInitNewSiwEmailSubscribe);
    };
    self.startEditSiwEmailSubscribe = function(item){
        item.oldValue(ko.toJS(item));
        item.isEdit(true);
    };
    self.finishEditSiwEmailSubscribe = function(item){
        SaveSiwEmailSubscribe(item);
    };
    self.cancelEditSiwEmailSubscribe = function(item){
        if(item.siwEmailSubscribeID()==null||item.siwEmailSubscribeID()==0){
           self.arrSiwEmailSubscribe.remove(item);
        }else{
           ResetSiwEmailSubscribe(item);
           item.isEdit(false);
         }
    };
    self.removeSiwEmailSubscribe = function(item){
        DeleteSiwEmailSubscribe(item);
    };
    self.startSort = function(field){
        if(self.sortedField()!=null){
            if(self.sortedField().name()==field){
                self.sortedField().direction(!self.sortedField().direction());
            }else{
                self.sortedField().name(field);
                self.sortedField().direction(false);
            }
        }else{
            self.sortedField(new SortField(field,false));
        }
        self.paging().pageIndex(1);
        InitSiwEmailSubscribes();
    };
    //--------------- Action Function ----------//
    function FinishInitNewSiwEmailSubscribe(data){
       if(data.result =="Success"){
           var item = self.convertDataToSiwEmailSubscribe(data.siwEmailSubscribe);
           item.guid(data.siwEmailSubscribe.guid);
           item.oldValue(ko.toJS(item));
           item.isEdit(true);
           self.arrSiwEmailSubscribe.unshift(item);
       }
       self.processing().setProcessing("SiwEmailSubscribes",false);
       if(self.ffInitNew() != null) self.ffInitNew()();
    }
    function InitSiwEmailSubscribes()
    {
        if (self.actionOnLocal() == false)
        {
            self.processing().setProcessing("SiwEmailSubscribes", true);
            var postParam = CollectGetParams();
            var json = JSON.stringify(postParam);
            CallAPI(
                self.getUrl.getSiwEmailSubscribes,
                json,
                "POST",
                FinishInitSiwEmailSubscribes,
                CallAPIFail);
        }
        else
        {
            if (self.arrSiwEmailSubscribe().length == 0)
            {
                self.processing().setProcessing("SiwEmailSubscribes", true);
                self.setSearchParam("isViewAll", true);
                var postParam = CollectGetParams();
                var json = JSON.stringify(postParam);
                CallAPI(
                    self.getUrl.getSiwEmailSubscribes,
                    json,
                    "POST",
                    FinishInitSiwEmailSubscribes,
                    CallAPIFail);
            }
            else
            {
                self.processing().setProcessing("SiwEmailSubscribes", true);
                var searchCode = self.getSearchParam("searchCode").value();
                var arrFilter = self.arrSiwEmailSubscribe();
                if (searchCode != null)
                {
                    searchCode = GenSearchKeyword(searchCode);
                    arrFilter = ko.utils.arrayFilter(arrFilter, function(item) {
                        return item.searchKeyword().indexOf(searchCode) > -1;
                    });
                }
                var start = (self.paging().pageIndex() - 1) * self.paging().pageSize();
                self.arrSSiwEmailSubscribe(arrFilter.slice(start, start + self.paging().pageSize()));
                self.paging().resetPaging(self.paging().pageIndex(), self.paging().pageSize(), self.arrSiwEmailSubscribe().length);
                if (self.ffInit() != null) self.ffInit()();
                self.processing().setProcessing("SiwEmailSubscribes", false);
            }
        }
    }
     function FinishInitSiwEmailSubscribes(data){
         if(data.result == "Success"){
             var arrItem = ko.utils.arrayMap(data.siwEmailSubscribes,function(item){
                  return self.convertDataToSiwEmailSubscribe(item);
             });
             self.arrSiwEmailSubscribe.removeAll();
             self.arrSiwEmailSubscribe(arrItem);
             self.paging().resetPaging(data.pageIndex,data.pageSize,data.totalCount);
         }
         //function run after init data
         if(self.ffInit() != null) self.ffInit()();
         self.processing().setProcessing("SiwEmailSubscribes",false);
     }
     function SaveSiwEmailSubscribe(item){
          if(ValidateSiwEmailSubscribe(item)){
              self.processing().setProcessing("SiwEmailSubscribes",true);
              var json = JSON.stringify(ConvertSiwEmailSubscribeToPostObject(item));
              CallAPI(
                  self.getUrl.saveSiwEmailSubscribe,
                  json,
                  "POST",
                  FinishSaveSiwEmailSubscribe,
                  CallAPIFail);
         }
     } 
     function FinishSaveSiwEmailSubscribe(data) {
        if(data.result == "Success") {
            var item;
            if(data.siwEmailSubscribeID != null && data.siwEmailSubscribeID != 0) {
                item = ko.utils.arrayFirst(self.arrSiwEmailSubscribe(), function (item1) {
                    return item1.siwEmailSubscribeID() == data.siwEmailSubscribeID;
                });
            } else {
                item = ko.utils.arrayFirst(self.arrSiwEmailSubscribe(), function (item1) {
                    return item1.guid() == data.guid;
                });
            }
            if(item != null) {
                if(item.siwEmailSubscribeID() == null || item.siwEmailSubscribeID() == 0) {
                    self.paging().resetPaging(self.paging().pageIndex(), self.paging().pageSize(), self.paging().totalItems() + 1);
                }
                item.siwEmailSubscribeID(data.siwEmailSubscribe.siwEmailSubscribeID);
                item.isEdit(false);
            }
        } else {
            swal("", Language.SaveResultFailMessage, "warning");
        }
        self.processing().setProcessing("SiwEmailSubscribes", false);
        if(self.ffSave() != null) self.ffSave()();
     }
     function DeleteSiwEmailSubscribe(item)
     {
         swal({
         title: Language.DeleteConfirmTitle,
         text: Language.DeleteConfirmMessage,
         type: "warning",
         showCancelButton: true,
         confirmButtonColor: "#DD6B55",
         confirmButtonText: Language.DeleteButtonYes,
         cancelButtonText: Language.DeleteButtonNo,
         closeOnConfirm: true,
         closeOnCancel: true
         },
         function(result) {
             if(result)
             {
                 if(item != null)
                 {
                     if(item.siwEmailSubscribeID() == null || item.siwEmailSubscribeID() == 0)
                     {
                         self.arrSiwEmailSubscribe.remove(item);
                     }
                     else
                     {
                         self.processing().setProcessing("SiwEmailSubscribes", true);
                         CallAPI(
                             self.getUrl.removeSiwEmailSubscribe + "?id=" + item.siwEmailSubscribeID(),
                             null,
                             "DELETE",
                             FinishDeleteSiwEmailSubscribe,
                             CallAPIFail
                         );
                     }
                 }
             }
         });
     }
     function FinishDeleteSiwEmailSubscribe(data) {
         if(data.result == "Success") {
             self.arrSiwEmailSubscribe.remove(function (item) { return item.siwEmailSubscribeID() == data.siwEmailSubscribeID; });
             self.paging().resetPaging(self.paging().pageIndex(), self.paging().pageSize(), self.paging().totalItems() - 1);
         }
         else {
             swal(Language.DeleteResultFailMessage, "", "warning");
         }
         self.processing().setProcessing("SiwEmailSubscribes", false);
         if(self.ffDelete() != null) self.ffDelete()();
     }
     function CallAPIFail(jqXHR, textStatus, errorThrown) {
         self.processing().setProcessing("SiwEmailSubscribe", false);
         swal("", Language.CallAPIFailMessage,"warning");
     }
     function ResetSiwEmailSubscribe(item){
         item.siwEmailSubscribeID(item.oldValue().siwEmailSubscribeID);
         item.email(item.oldValue().email);
         item.code(item.oldValue().code);
         item.status(item.oldValue().status);
         //end table database field
     }
     function ConvertSiwEmailSubscribeToPostObject(item){
         var postObject = {
                    siwEmailSubscribeID:item.siwEmailSubscribeID(),
                    email:item.email(),
                    code:item.code(),
                    status:item.status(),
                    //end table database field               
                    guid:item.guid()
             };
             //update datetime format               
             //end update datetime format                
        return postObject;
    }
    self.convertDataToSiwEmailSubscribe = function(dataItem){
        var item = new SiwEmailSubscribe(
                         dataItem.siwEmailSubscribeID,
                         dataItem.email,
                         dataItem.code,
                         dataItem.status
                    //end table database field
                    );
                    item.guid(dataItem.guid);
        return item;
    };
    function CollectGetParams(){
        var postParam = {
           pageindex: self.paging().pageIndex(),
           pagesize: self.paging().pageSize(),
           searchparams : null
        };
        if(self.sortedField()!=null){
           var sparam = ko.utils.arrayFirst(self.arrSearchParam(),function(param){return param.key() == "sortedField"});
           if(sparam!=null){
               sparam.value(self.sortedField().name());
               var sparam1 = ko.utils.arrayFirst(self.arrSearchParam(),function(param){return param.key() == "sortedDirection"});
               sparam1.value(self.sortedField().direction());
           }else{
               self.arrSearchParam.push(new SearchParam("sortedField",self.sortedField().name()));
               self.arrSearchParam.push(new SearchParam("sortedDirection",self.sortedField().direction()));
           }
        }
        if(self.arrSearchParam().length>0){
           postParam.searchparams = ko.toJS(self.arrSearchParam());
        }
        return postParam;
    }
    function ValidateSiwEmailSubscribe(item){
         return true;
    } 
    //--------------- End Action Function ----------//
    //--------------- End For item -----------------------------//
};
