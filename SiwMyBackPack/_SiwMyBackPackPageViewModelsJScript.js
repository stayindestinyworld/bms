var SiwMyBackPacksPageViewModel = function () {
    var self = this;
    self.getUrl = {
        getSiwMyBackPacks   : "/SiwMyBackPack/GetPage",
        saveSiwMyBackPack   : "/SiwMyBackPack/Save",
        removeSiwMyBackPack : "/SiwMyBackPack/Remove",
        getInit : "/SiwMyBackPack/GetInit",
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
    self.arrSiwMyBackPack = ko.observableArray([]);
    self.arrSSiwMyBackPack = ko.observableArray([]);
    self.actionOnLocal = ko.observable(false);
    //------- Init data for view model----------------------------
    self.initModel = function(transition,processing){
        self.transition = transition;
        self.processing = processing;
    };
    self.initData = function () {
        InitSiwMyBackPacks();
    };
    self.initLocalData = function (data) {
       var arrItem = ko.utils.arrayMap(data, function (item) {
           return self.convertDataToSiwMyBackPack(item);
       });
       self.arrSiwMyBackPack.removeAll();
       self.arrSiwMyBackPack(arrItem);
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
    self.searchSiwMyBackPacks = function(){
        InitSiwMyBackPacks();
    };
    self.resetSearchSiwMyBackPack = function() {
        self.setSearchParam("searchCode", null);
        InitSiwMyBackPacks();
    };
    self.gotoPage = function(page){
       if(page!=self.paging().pageIndex()){
           self.paging().pageIndex(page);
           InitSiwMyBackPacks();
       }
    };
    self.gotoNextPage = function(){
       if(self.paging().pageIndex()<self.paging().totalPages()){
           self.paging().pageIndex(self.paging().pageIndex()+1);
           InitSiwMyBackPacks();
       }
    };
    self.gotoPrevPage = function(){
        if(self.paging().pageIndex()>1){
            self.paging().pageIndex(self.paging().pageIndex()-1);
            InitSiwMyBackPacks();
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
    self.startAddSiwMyBackPack = function(){
        self.processing().setProcessing("SiwMyBackPacks",true);
        CallAPI(self.getUrl.getInit, null,"GET", FinishInitNewSiwMyBackPack);
    };
    self.startEditSiwMyBackPack = function(item){
        item.oldValue(ko.toJS(item));
        item.isEdit(true);
    };
    self.finishEditSiwMyBackPack = function(item){
        SaveSiwMyBackPack(item);
    };
    self.cancelEditSiwMyBackPack = function(item){
        if(item.siwMyBackPackID()==null||item.siwMyBackPackID()==0){
           self.arrSiwMyBackPack.remove(item);
        }else{
           ResetSiwMyBackPack(item);
           item.isEdit(false);
         }
    };
    self.removeSiwMyBackPack = function(item){
        DeleteSiwMyBackPack(item);
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
        InitSiwMyBackPacks();
    };
    //--------------- Action Function ----------//
    function FinishInitNewSiwMyBackPack(data){
       if(data.result =="Success"){
           var item = self.convertDataToSiwMyBackPack(data.siwMyBackPack);
           item.guid(data.siwMyBackPack.guid);
           item.oldValue(ko.toJS(item));
           item.isEdit(true);
           self.arrSiwMyBackPack.unshift(item);
       }
       self.processing().setProcessing("SiwMyBackPacks",false);
       if(self.ffInitNew() != null) self.ffInitNew()();
    }
    function InitSiwMyBackPacks()
    {
        if (self.actionOnLocal() == false)
        {
            self.processing().setProcessing("SiwMyBackPacks", true);
            var postParam = CollectGetParams();
            var json = JSON.stringify(postParam);
            CallAPI(
                self.getUrl.getSiwMyBackPacks,
                json,
                "POST",
                FinishInitSiwMyBackPacks,
                CallAPIFail);
        }
        else
        {
            if (self.arrSiwMyBackPack().length == 0)
            {
                self.processing().setProcessing("SiwMyBackPacks", true);
                self.setSearchParam("isViewAll", true);
                var postParam = CollectGetParams();
                var json = JSON.stringify(postParam);
                CallAPI(
                    self.getUrl.getSiwMyBackPacks,
                    json,
                    "POST",
                    FinishInitSiwMyBackPacks,
                    CallAPIFail);
            }
            else
            {
                self.processing().setProcessing("SiwMyBackPacks", true);
                var searchCode = self.getSearchParam("searchCode").value();
                var arrFilter = self.arrSiwMyBackPack();
                if (searchCode != null)
                {
                    searchCode = GenSearchKeyword(searchCode);
                    arrFilter = ko.utils.arrayFilter(arrFilter, function(item) {
                        return item.searchKeyword().indexOf(searchCode) > -1;
                    });
                }
                var start = (self.paging().pageIndex() - 1) * self.paging().pageSize();
                self.arrSSiwMyBackPack(arrFilter.slice(start, start + self.paging().pageSize()));
                self.paging().resetPaging(self.paging().pageIndex(), self.paging().pageSize(), self.arrSiwMyBackPack().length);
                if (self.ffInit() != null) self.ffInit()();
                self.processing().setProcessing("SiwMyBackPacks", false);
            }
        }
    }
     function FinishInitSiwMyBackPacks(data){
         if(data.result == "Success"){
             var arrItem = ko.utils.arrayMap(data.siwMyBackPacks,function(item){
                  return self.convertDataToSiwMyBackPack(item);
             });
             self.arrSiwMyBackPack.removeAll();
             self.arrSiwMyBackPack(arrItem);
             self.paging().resetPaging(data.pageIndex,data.pageSize,data.totalCount);
         }
         //function run after init data
         if(self.ffInit() != null) self.ffInit()();
         self.processing().setProcessing("SiwMyBackPacks",false);
     }
     function SaveSiwMyBackPack(item){
          if(ValidateSiwMyBackPack(item)){
              self.processing().setProcessing("SiwMyBackPacks",true);
              var json = JSON.stringify(ConvertSiwMyBackPackToPostObject(item));
              CallAPI(
                  self.getUrl.saveSiwMyBackPack,
                  json,
                  "POST",
                  FinishSaveSiwMyBackPack,
                  CallAPIFail);
         }
     } 
     function FinishSaveSiwMyBackPack(data) {
        if(data.result == "Success") {
            var item;
            if(data.siwMyBackPackID != null && data.siwMyBackPackID != 0) {
                item = ko.utils.arrayFirst(self.arrSiwMyBackPack(), function (item1) {
                    return item1.siwMyBackPackID() == data.siwMyBackPackID;
                });
            } else {
                item = ko.utils.arrayFirst(self.arrSiwMyBackPack(), function (item1) {
                    return item1.guid() == data.guid;
                });
            }
            if(item != null) {
                if(item.siwMyBackPackID() == null || item.siwMyBackPackID() == 0) {
                    self.paging().resetPaging(self.paging().pageIndex(), self.paging().pageSize(), self.paging().totalItems() + 1);
                }
                item.siwMyBackPackID(data.siwMyBackPack.siwMyBackPackID);
                item.isEdit(false);
            }
        } else {
            swal("", Language.SaveResultFailMessage, "warning");
        }
        self.processing().setProcessing("SiwMyBackPacks", false);
        if(self.ffSave() != null) self.ffSave()();
     }
     function DeleteSiwMyBackPack(item)
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
                     if(item.siwMyBackPackID() == null || item.siwMyBackPackID() == 0)
                     {
                         self.arrSiwMyBackPack.remove(item);
                     }
                     else
                     {
                         self.processing().setProcessing("SiwMyBackPacks", true);
                         CallAPI(
                             self.getUrl.removeSiwMyBackPack + "?id=" + item.siwMyBackPackID(),
                             null,
                             "DELETE",
                             FinishDeleteSiwMyBackPack,
                             CallAPIFail
                         );
                     }
                 }
             }
         });
     }
     function FinishDeleteSiwMyBackPack(data) {
         if(data.result == "Success") {
             self.arrSiwMyBackPack.remove(function (item) { return item.siwMyBackPackID() == data.siwMyBackPackID; });
             self.paging().resetPaging(self.paging().pageIndex(), self.paging().pageSize(), self.paging().totalItems() - 1);
         }
         else {
             swal(Language.DeleteResultFailMessage, "", "warning");
         }
         self.processing().setProcessing("SiwMyBackPacks", false);
         if(self.ffDelete() != null) self.ffDelete()();
     }
     function CallAPIFail(jqXHR, textStatus, errorThrown) {
         self.processing().setProcessing("SiwMyBackPack", false);
         swal("", Language.CallAPIFailMessage,"warning");
     }
     function ResetSiwMyBackPack(item){
         item.siwMyBackPackID(item.oldValue().siwMyBackPackID);
         item.itemID(item.oldValue().itemID);
         item.name(item.oldValue().name);
         item.code(item.oldValue().code);
         item.status(item.oldValue().status);
         item.image(item.oldValue().image);
         item.point(item.oldValue().point);
         item.walletID(item.oldValue().walletID);
         item.siwUserID(item.oldValue().siwUserID);
        item.shortWallet(item.oldValue().shortWallet);
         //end table database field
         item.itemName(item.oldValue().itemName);
         item.walletName(item.oldValue().walletName);
         item.siwUserName(item.oldValue().siwUserName);
     }
     function ConvertSiwMyBackPackToPostObject(item){
         var postObject = {
                    siwMyBackPackID:item.siwMyBackPackID(),
                    itemID:item.itemID(),
                    name:item.name(),
                    code:item.code(),
                    status:item.status(),
                    image:item.image(),
                    point:item.point(),
                    walletID:item.walletID(),
                    siwUserID:item.siwUserID(),
                          shortWallet:item.shortWallet(),
                    //end table database field               
                    guid:item.guid()
             };
             //update datetime format               
             //end update datetime format                
        return postObject;
    }
    self.convertDataToSiwMyBackPack = function(dataItem){
        var item = new SiwMyBackPack(
                         dataItem.siwMyBackPackID,
                         dataItem.itemID,
                         dataItem.name,
                         dataItem.code,
                         dataItem.status,
                         dataItem.image,
                         dataItem.point,
                         dataItem.walletID,
                         dataItem.siwUserID,
                         dataItem.shortWallet
                    //end table database field
                    );
                    item.guid(dataItem.guid);
                    item.itemName(dataItem.itemName);
                    item.walletName(dataItem.walletName);
                    item.siwUserName(dataItem.siwUserName);
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
    function ValidateSiwMyBackPack(item){
         return true;
    } 
    //--------------- End Action Function ----------//
    //--------------- End For item -----------------------------//
};
