var SiwAttendancesPageViewModel = function () {
    var self = this;
    self.getUrl = {
        getSiwAttendances   : "/SiwAttendance/GetPage",
        saveSiwAttendance   : "/SiwAttendance/Save",
        removeSiwAttendance : "/SiwAttendance/Remove",
        getInit: "/SiwAttendance/GetInit",
        getWinnerAttendances: "/SiwAttendance/GetWinnerPage",
    };
    self.processing = ko.observable(null);
    self.transition = ko.observable(null);
    self.ffInit = ko.observable(null);
    self.ffInitNew = ko.observable(null);
    self.ffSave = ko.observable(null);
    self.ffDelete = ko.observable(null);
    self.paging = ko.observable(new ItemPaging(1, 10, 0));
    self.sortedField = ko.observable(null);
    self.arrSearchParam = ko.observableArray([]);
    self.arrSiwAttendance = ko.observableArray([]);
    self.arrSSiwAttendance = ko.observableArray([]);
    self.actionOnLocal = ko.observable(false);
    //------- Init data for view model----------------------------
    self.initModel = function(transition,processing){
        self.transition = transition;
        self.processing = processing;
    };
    self.initData = function () {
        InitSiwAttendances();
    };
    self.initWinnerData = function () {
        InitWinnerAttendances();
    };
    self.initLocalData = function (data) {
       var arrItem = ko.utils.arrayMap(data, function (item) {
           return self.convertDataToSiwAttendance(item);
       });
       self.arrSiwAttendance.removeAll();
       self.arrSiwAttendance(arrItem);
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
    self.searchSiwAttendances = function(){
        InitSiwAttendances();
    };
    self.resetSearchSiwAttendance = function() {
        self.setSearchParam("searchCode", null);
        InitSiwAttendances();
    };
    self.gotoPage = function(page){
       if(page!=self.paging().pageIndex()){
           self.paging().pageIndex(page);
           InitSiwAttendances();
       }
    };
    self.gotoNextPage = function(){
       if(self.paging().pageIndex()<self.paging().totalPages()){
           self.paging().pageIndex(self.paging().pageIndex()+1);
           InitSiwAttendances();
       }
    };
    self.gotoPrevPage = function(){
        if(self.paging().pageIndex()>1){
            self.paging().pageIndex(self.paging().pageIndex()-1);
            InitSiwAttendances();
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
    //--------------- For Winners List -----------------------------//
    self.searchWinners = function () {
        InitWinnerAttendances();
    };
    self.resetSearchSiwAttendance = function () {
        self.setSearchParam("searchCode", null);
        InitWinnerAttendances();
    };
    self.gotoPage = function (page) {
        if (page != self.paging().pageIndex()) {
            self.paging().pageIndex(page);
            InitWinnerAttendances();
        }
    };
    self.gotoNextPage = function () {
        if (self.paging().pageIndex() < self.paging().totalPages()) {
            self.paging().pageIndex(self.paging().pageIndex() + 1);
            InitWinnerAttendances();
        }
    };
    self.gotoPrevPage = function () {
        if (self.paging().pageIndex() > 1) {
            self.paging().pageIndex(self.paging().pageIndex() - 1);
            InitWinnerAttendances();
        }
    };
    //--------------- For Item -----------------------------//
    //--------------- Model Event ----------//
    self.startAddSiwAttendance = function(){
        self.processing().setProcessing("SiwAttendances",true);
        CallAPI(self.getUrl.getInit, null,"GET", FinishInitNewSiwAttendance);
    };
    self.startEditSiwAttendance = function(item){
        item.oldValue(ko.toJS(item));
        item.isEdit(true);
    };
    self.finishEditSiwAttendance = function(item){
        SaveSiwAttendance(item);
    };
    self.cancelEditSiwAttendance = function(item){
        if(item.siwAttendanceID()==null||item.siwAttendanceID()==0){
           self.arrSiwAttendance.remove(item);
        }else{
           ResetSiwAttendance(item);
           item.isEdit(false);
         }
    };
    self.removeSiwAttendance = function(item){
        DeleteSiwAttendance(item);
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
        InitSiwAttendances();
    };
    //--------------- Action Function ----------//
    function FinishInitNewSiwAttendance(data){
       if(data.result =="Success"){
           var item = self.convertDataToSiwAttendance(data.siwAttendance);
           item.guid(data.siwAttendance.guid);
           item.oldValue(ko.toJS(item));
           item.isEdit(true);
           self.arrSiwAttendance.unshift(item);
       }
       self.processing().setProcessing("SiwAttendances",false);
       if(self.ffInitNew() != null) self.ffInitNew()();
    }
    function InitSiwAttendances() {
        if (self.actionOnLocal() == false) {
            self.processing().setProcessing("SiwAttendances", true);
            var postParam = CollectGetParams();
            var json = JSON.stringify(postParam);
            CallAPI(
                self.getUrl.getSiwAttendances,
                json,
                "POST",
                FinishInitSiwAttendances,
                CallAPIFail);
        }
        else {
            if (self.arrSiwAttendance().length == 0) {
                self.processing().setProcessing("SiwAttendances", true);
                self.setSearchParam("isViewAll", true);
                var postParam = CollectGetParams();
                var json = JSON.stringify(postParam);
                CallAPI(
                    self.getUrl.getSiwAttendances,
                    json,
                    "POST",
                    FinishInitSiwAttendances,
                    CallAPIFail);
            }
            else {
                self.processing().setProcessing("SiwAttendances", true);
                var searchCode = self.getSearchParam("searchCode").value();
                var arrFilter = self.arrSiwAttendance();
                if (searchCode != null) {
                    searchCode = GenSearchKeyword(searchCode);
                    arrFilter = ko.utils.arrayFilter(arrFilter, function (item) {
                        return item.searchKeyword().indexOf(searchCode) > -1;
                    });
                }
                var start = (self.paging().pageIndex() - 1) * self.paging().pageSize();
                self.arrSSiwAttendance(arrFilter.slice(start, start + self.paging().pageSize()));
                self.paging().resetPaging(self.paging().pageIndex(), self.paging().pageSize(), self.arrSiwAttendance().length);
                if (self.ffInit() != null) self.ffInit()();
                self.processing().setProcessing("SiwAttendances", false);
            }
        }
    }
    function InitWinnerAttendances()
    {
        if (self.actionOnLocal() == false)
        {
            self.processing().setProcessing("SiwAttendances", true);
            var postParam = CollectGetParams();
            var json = JSON.stringify(postParam);
            CallAPI(
                self.getUrl.getWinnerAttendances,
                json,
                "POST",
                FinishInitSiwAttendances,
                CallAPIFail);
        }
        else
        {
            if (self.arrSiwAttendance().length == 0)
            {
                self.processing().setProcessing("SiwAttendances", true);
                self.setSearchParam("isViewAll", true);
                var postParam = CollectGetParams();
                var json = JSON.stringify(postParam);
                CallAPI(
                    self.getUrl.getWinnerAttendances,
                    json,
                    "POST",
                    FinishInitSiwAttendances,
                    CallAPIFail);
            }
            else
            {
                self.processing().setProcessing("SiwAttendances", true);
                var searchCode = self.getSearchParam("searchCode").value();
                var arrFilter = self.arrSiwAttendance();
                if (searchCode != null)
                {
                    searchCode = GenSearchKeyword(searchCode);
                    arrFilter = ko.utils.arrayFilter(arrFilter, function(item) {
                        return item.searchKeyword().indexOf(searchCode) > -1;
                    });
                }
                var start = (self.paging().pageIndex() - 1) * self.paging().pageSize();
                self.arrSSiwAttendance(arrFilter.slice(start, start + self.paging().pageSize()));
                self.paging().resetPaging(self.paging().pageIndex(), self.paging().pageSize(), self.arrSiwAttendance().length);
                if (self.ffInit() != null) self.ffInit()();
                self.processing().setProcessing("SiwAttendances", false);
            }
        }
    }
     function FinishInitSiwAttendances(data){
         if(data.result == "Success"){
             var arrItem = ko.utils.arrayMap(data.siwAttendances,function(item){
                  return self.convertDataToSiwAttendance(item);
             });
             self.arrSiwAttendance.removeAll();
             self.arrSiwAttendance(arrItem);
             self.paging().resetPaging(data.pageIndex,data.pageSize,data.totalCount);
         }
         //function run after init data
         if(self.ffInit() != null) self.ffInit()();
         self.processing().setProcessing("SiwAttendances",false);
     }
     function SaveSiwAttendance(item){
          if(ValidateSiwAttendance(item)){
              self.processing().setProcessing("SiwAttendances",true);
              var json = JSON.stringify(ConvertSiwAttendanceToPostObject(item));
              CallAPI(
                  self.getUrl.saveSiwAttendance,
                  json,
                  "POST",
                  FinishSaveSiwAttendance,
                  CallAPIFail);
         }
     } 
     function FinishSaveSiwAttendance(data) {
        if(data.result == "Success") {
            var item;
            if(data.siwAttendanceID != null && data.siwAttendanceID != 0) {
                item = ko.utils.arrayFirst(self.arrSiwAttendance(), function (item1) {
                    return item1.siwAttendanceID() == data.siwAttendanceID;
                });
            } else {
                item = ko.utils.arrayFirst(self.arrSiwAttendance(), function (item1) {
                    return item1.guid() == data.guid;
                });
            }
            if(item != null) {
                if(item.siwAttendanceID() == null || item.siwAttendanceID() == 0) {
                    self.paging().resetPaging(self.paging().pageIndex(), self.paging().pageSize(), self.paging().totalItems() + 1);
                }
                item.siwAttendanceID(data.siwAttendance.siwAttendanceID);
                item.isEdit(false);
            }
        } else {
            swal("", Language.SaveResultFailMessage, "warning");
        }
        self.processing().setProcessing("SiwAttendances", false);
        if(self.ffSave() != null) self.ffSave()();
     }
     function DeleteSiwAttendance(item)
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
                     if(item.siwAttendanceID() == null || item.siwAttendanceID() == 0)
                     {
                         self.arrSiwAttendance.remove(item);
                     }
                     else
                     {
                         self.processing().setProcessing("SiwAttendances", true);
                         CallAPI(
                             self.getUrl.removeSiwAttendance + "?id=" + item.siwAttendanceID(),
                             null,
                             "DELETE",
                             FinishDeleteSiwAttendance,
                             CallAPIFail
                         );
                     }
                 }
             }
         });
     }
     function FinishDeleteSiwAttendance(data) {
         if(data.result == "Success") {
             self.arrSiwAttendance.remove(function (item) { return item.siwAttendanceID() == data.siwAttendanceID; });
             self.paging().resetPaging(self.paging().pageIndex(), self.paging().pageSize(), self.paging().totalItems() - 1);
         }
         else {
             swal(Language.DeleteResultFailMessage, "", "warning");
         }
         self.processing().setProcessing("SiwAttendances", false);
         if(self.ffDelete() != null) self.ffDelete()();
     }
     function CallAPIFail(jqXHR, textStatus, errorThrown) {
         self.processing().setProcessing("SiwAttendance", false);
         swal("", Language.CallAPIFailMessage,"warning");
     }
     function ResetSiwAttendance(item){
         item.siwAttendanceID(item.oldValue().siwAttendanceID);
         item.walletID(item.oldValue().walletID);
         item.confirmWallet(item.oldValue().confirmWallet);
         item.fullName(item.oldValue().fullName);
         item.userCode(item.oldValue().userCode);
         item.status(item.oldValue().status);
         item.attendance(item.oldValue().attendance);
         item.timeAttendance(item.oldValue().timeAttendance);
         item.twitter(item.oldValue().twitter);
         item.linkRetweet(item.oldValue().linkRetweet);
        item.shortWallet(item.oldValue().shortWallet);
         //end table database field
         item.walletName(item.oldValue().walletName);
     }
     function ConvertSiwAttendanceToPostObject(item){
         var postObject = {
                    siwAttendanceID:item.siwAttendanceID(),
                    walletID:item.walletID(),
                    confirmWallet:item.confirmWallet(),
                    fullName:item.fullName(),
                    userCode:item.userCode(),
                    status:item.status(),
                    attendance:item.attendance(),
                    timeAttendance:item.timeAttendance(),
                    twitter:item.twitter(),
                    linkRetweet:item.linkRetweet(),
                          shortWallet:item.shortWallet(),
                    //end table database field               
                    guid:item.guid()
             };
             //update datetime format               
           if(item.timeAttendance()!==null)
           {
               postObject.timeAttendanceS = parseDateToSaveString(item.timeAttendance(),DateTimeFormat.DateTimeToAPIString);
           }
             //end update datetime format                
        return postObject;
    }
    self.convertDataToSiwAttendance = function(dataItem){
        var item = new SiwAttendance(
                         dataItem.siwAttendanceID,
                         dataItem.walletID,
                         dataItem.confirmWallet,
                         dataItem.fullName,
                         dataItem.userCode,
                         dataItem.status,
                         dataItem.attendance,
                         dataItem.timeAttendanceS,
                         dataItem.twitter,
                         dataItem.linkRetweet,
                         dataItem.shortWallet
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
    function ValidateSiwAttendance(item){
         return true;
    } 
    //--------------- End Action Function ----------//
    //--------------- End For item -----------------------------//
};
