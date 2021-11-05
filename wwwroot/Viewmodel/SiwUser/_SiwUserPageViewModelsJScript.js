var SiwUsersPageViewModel = function () {
    var self = this;
    self.getUrl = {
        getSiwUsers   : "/SiwUser/GetPage",
        saveSiwUser   : "/SiwUser/Save",
        removeSiwUser : "/SiwUser/Remove",
        getInit : "/SiwUser/GetInit",
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
    self.arrSiwUser = ko.observableArray([]);
    self.arrSSiwUser = ko.observableArray([]);
    self.actionOnLocal = ko.observable(false);
    //------- Init data for view model----------------------------
    self.initModel = function(transition,processing){
        self.transition = transition;
        self.processing = processing;
    };
    self.initData = function () {
        InitSiwUsers();
    };
    self.initLocalData = function (data) {
       var arrItem = ko.utils.arrayMap(data, function (item) {
           return self.convertDataToSiwUser(item);
       });
       self.arrSiwUser.removeAll();
       self.arrSiwUser(arrItem);
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
    self.searchSiwUsers = function(){
        InitSiwUsers();
    };
    self.resetSearchSiwUser = function() {
        self.setSearchParam("searchCode", null);
        InitSiwUsers();
    };
    self.gotoPage = function(page){
       if(page!=self.paging().pageIndex()){
           self.paging().pageIndex(page);
           InitSiwUsers();
       }
    };
    self.gotoNextPage = function(){
       if(self.paging().pageIndex()<self.paging().totalPages()){
           self.paging().pageIndex(self.paging().pageIndex()+1);
           InitSiwUsers();
       }
    };
    self.gotoPrevPage = function(){
        if(self.paging().pageIndex()>1){
            self.paging().pageIndex(self.paging().pageIndex()-1);
            InitSiwUsers();
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
    self.startAddSiwUser = function(){
        self.processing().setProcessing("SiwUsers",true);
        CallAPI(self.getUrl.getInit, null,"GET", FinishInitNewSiwUser);
    };
    self.startEditSiwUser = function(item){
        item.oldValue(ko.toJS(item));
        item.isEdit(true);
    };
    self.finishEditSiwUser = function(item){
        SaveSiwUser(item);
    };
    self.cancelEditSiwUser = function(item){
        if(item.siwUserID()==null||item.siwUserID()==0){
           self.arrSiwUser.remove(item);
        }else{
           ResetSiwUser(item);
           item.isEdit(false);
         }
    };
    self.removeSiwUser = function(item){
        DeleteSiwUser(item);
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
        InitSiwUsers();
    };
    //--------------- Action Function ----------//
    function FinishInitNewSiwUser(data){
       if(data.result =="Success"){
           var item = self.convertDataToSiwUser(data.siwUser);
           item.guid(data.siwUser.guid);
           item.oldValue(ko.toJS(item));
           item.isEdit(true);
           self.arrSiwUser.unshift(item);
       }
       self.processing().setProcessing("SiwUsers",false);
       if(self.ffInitNew() != null) self.ffInitNew()();
    }
    function InitSiwUsers()
    {
        if (self.actionOnLocal() == false)
        {
            self.processing().setProcessing("SiwUsers", true);
            var postParam = CollectGetParams();
            var json = JSON.stringify(postParam);
            CallAPI(
                self.getUrl.getSiwUsers,
                json,
                "POST",
                FinishInitSiwUsers,
                CallAPIFail);
        }
        else
        {
            if (self.arrSiwUser().length == 0)
            {
                self.processing().setProcessing("SiwUsers", true);
                self.setSearchParam("isViewAll", true);
                var postParam = CollectGetParams();
                var json = JSON.stringify(postParam);
                CallAPI(
                    self.getUrl.getSiwUsers,
                    json,
                    "POST",
                    FinishInitSiwUsers,
                    CallAPIFail);
            }
            else
            {
                self.processing().setProcessing("SiwUsers", true);
                var searchCode = self.getSearchParam("searchCode").value();
                var arrFilter = self.arrSiwUser();
                if (searchCode != null)
                {
                    searchCode = GenSearchKeyword(searchCode);
                    arrFilter = ko.utils.arrayFilter(arrFilter, function(item) {
                        return item.searchKeyword().indexOf(searchCode) > -1;
                    });
                }
                var start = (self.paging().pageIndex() - 1) * self.paging().pageSize();
                self.arrSSiwUser(arrFilter.slice(start, start + self.paging().pageSize()));
                self.paging().resetPaging(self.paging().pageIndex(), self.paging().pageSize(), self.arrSiwUser().length);
                if (self.ffInit() != null) self.ffInit()();
                self.processing().setProcessing("SiwUsers", false);
            }
        }
    }
     function FinishInitSiwUsers(data){
         if(data.result == "Success"){
             var arrItem = ko.utils.arrayMap(data.siwUsers,function(item){
                  return self.convertDataToSiwUser(item);
             });
             self.arrSiwUser.removeAll();
             self.arrSiwUser(arrItem);
             self.paging().resetPaging(data.pageIndex,data.pageSize,data.totalCount);
         }
         //function run after init data
         if(self.ffInit() != null) self.ffInit()();
         self.processing().setProcessing("SiwUsers",false);
     }
     function SaveSiwUser(item){
          if(ValidateSiwUser(item)){
              self.processing().setProcessing("SiwUsers",true);
              var json = JSON.stringify(ConvertSiwUserToPostObject(item));
              CallAPI(
                  self.getUrl.saveSiwUser,
                  json,
                  "POST",
                  FinishSaveSiwUser,
                  CallAPIFail);
         }
     } 
     function FinishSaveSiwUser(data) {
        if(data.result == "Success") {
            var item;
            if(data.siwUserID != null && data.siwUserID != 0) {
                item = ko.utils.arrayFirst(self.arrSiwUser(), function (item1) {
                    return item1.siwUserID() == data.siwUserID;
                });
            } else {
                item = ko.utils.arrayFirst(self.arrSiwUser(), function (item1) {
                    return item1.guid() == data.guid;
                });
            }
            if(item != null) {
                if(item.siwUserID() == null || item.siwUserID() == 0) {
                    self.paging().resetPaging(self.paging().pageIndex(), self.paging().pageSize(), self.paging().totalItems() + 1);
                }
                item.siwUserID(data.siwUser.siwUserID);
                item.isEdit(false);
            }
        } else {
            swal("", Language.SaveResultFailMessage, "warning");
        }
        self.processing().setProcessing("SiwUsers", false);
        if(self.ffSave() != null) self.ffSave()();
     }
     function DeleteSiwUser(item)
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
                     if(item.siwUserID() == null || item.siwUserID() == 0)
                     {
                         self.arrSiwUser.remove(item);
                     }
                     else
                     {
                         self.processing().setProcessing("SiwUsers", true);
                         CallAPI(
                             self.getUrl.removeSiwUser + "?id=" + item.siwUserID(),
                             null,
                             "DELETE",
                             FinishDeleteSiwUser,
                             CallAPIFail
                         );
                     }
                 }
             }
         });
     }
     function FinishDeleteSiwUser(data) {
         if(data.result == "Success") {
             self.arrSiwUser.remove(function (item) { return item.siwUserID() == data.siwUserID; });
             self.paging().resetPaging(self.paging().pageIndex(), self.paging().pageSize(), self.paging().totalItems() - 1);
         }
         else {
             swal(Language.DeleteResultFailMessage, "", "warning");
         }
         self.processing().setProcessing("SiwUsers", false);
         if(self.ffDelete() != null) self.ffDelete()();
     }
     function CallAPIFail(jqXHR, textStatus, errorThrown) {
         self.processing().setProcessing("SiwUser", false);
         swal("", Language.CallAPIFailMessage,"warning");
     }
     function ResetSiwUser(item){
         item.siwUserID(item.oldValue().siwUserID);
         item.walletID(item.oldValue().walletID);
         item.userCode(item.oldValue().userCode);
         item.status(item.oldValue().status);
         item.walletTokenSiw(item.oldValue().walletTokenSiw);
        item.fullName(item.oldValue().fullName);
        item.email(item.oldValue().email);
        item.twitter(item.oldValue().twitter);
        item.telegram(item.oldValue().telegram);
         //end table database field
         item.walletName(item.oldValue().walletName);
     }
     function ConvertSiwUserToPostObject(item){
         var postObject = {
                    siwUserID:item.siwUserID(),
                    walletID:item.walletID(),
                    userCode:item.userCode(),
                    status:item.status(),
                    walletTokenSiw:item.walletTokenSiw(),
                          fullName:item.fullName(),
                          email:item.email(),
                          twitter:item.twitter(),
                          telegram:item.telegram(),
                    //end table database field               
                    guid:item.guid()
             };
             //update datetime format               
             //end update datetime format                
        return postObject;
    }
    self.convertDataToSiwUser = function(dataItem){
        var item = new SiwUser(
                         dataItem.siwUserID,
                         dataItem.walletID,
                         dataItem.userCode,
                         dataItem.status,
                         dataItem.walletTokenSiw,
                         dataItem.fullName,
                         dataItem.email,
                         dataItem.twitter,
                         dataItem.telegram
                    //end table database field
                    );
                    item.guid(dataItem.guid);
                    item.walletName(dataItem.walletName);
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
    function ValidateSiwUser(item){
         return true;
    } 
    //--------------- End Action Function ----------//
    //--------------- End For item -----------------------------//
};
