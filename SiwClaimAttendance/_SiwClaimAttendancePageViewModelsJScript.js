var SiwClaimAttendancesPageViewModel = function () {
    var self = this;
    self.getUrl = {
        getSiwClaimAttendances   : "/SiwClaimAttendance/GetPage",
        saveSiwClaimAttendance   : "/SiwClaimAttendance/Save",
        removeSiwClaimAttendance : "/SiwClaimAttendance/Remove",
        getInit: "/SiwClaimAttendance/GetInit",
        getWinnersAttendances: "/SiwClaimAttendance/GetWinnerPage",
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
    self.arrSiwClaimAttendance = ko.observableArray([]);
    self.arrSSiwClaimAttendance = ko.observableArray([]);
    self.actionOnLocal = ko.observable(false);
    //------- Init data for view model----------------------------
    self.initModel = function(transition,processing){
        self.transition = transition;
        self.processing = processing;
    };
    self.initData = function () {
        InitSiwClaimAttendances();
    };
    self.initWinnerData = function () {
        InitWinnersAttendances();
    };
    self.initLocalData = function (data) {
       var arrItem = ko.utils.arrayMap(data, function (item) {
           return self.convertDataToSiwClaimAttendance(item);
       });
       self.arrSiwClaimAttendance.removeAll();
       self.arrSiwClaimAttendance(arrItem);
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
    self.searchSiwClaimAttendances = function(){
        InitSiwClaimAttendances();
    };
    self.resetSearchSiwClaimAttendance = function() {
        self.setSearchParam("searchCode", null);
        InitSiwClaimAttendances();
    };
    self.gotoPage = function(page){
       if(page!=self.paging().pageIndex()){
           self.paging().pageIndex(page);
           InitSiwClaimAttendances();
       }
    };
    self.gotoNextPage = function(){
       if(self.paging().pageIndex()<self.paging().totalPages()){
           self.paging().pageIndex(self.paging().pageIndex()+1);
           InitSiwClaimAttendances();
       }
    };
    self.gotoPrevPage = function(){
        if(self.paging().pageIndex()>1){
            self.paging().pageIndex(self.paging().pageIndex()-1);
            InitSiwClaimAttendances();
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
    self.searchWinnersList = function () {
        InitWinnersAttendances();
    };
    self.resetSearchSiwClaimAttendance = function () {
        self.setSearchParam("searchCode", null);
        InitWinnersAttendances();
    };
    self.gotoPage = function (page) {
        if (page != self.paging().pageIndex()) {
            self.paging().pageIndex(page);
            InitWinnersAttendances();
        }
    };
    self.gotoNextPage = function () {
        if (self.paging().pageIndex() < self.paging().totalPages()) {
            self.paging().pageIndex(self.paging().pageIndex() + 1);
            InitWinnersAttendances();
        }
    };
    self.gotoPrevPage = function () {
        if (self.paging().pageIndex() > 1) {
            self.paging().pageIndex(self.paging().pageIndex() - 1);
            InitWinnersAttendances();
        }
    };
    //--------------- For Item -----------------------------//
    //--------------- Model Event ----------//
    self.startAddSiwClaimAttendance = function(){
        self.processing().setProcessing("SiwClaimAttendances",true);
        CallAPI(self.getUrl.getInit, null,"GET", FinishInitNewSiwClaimAttendance);
    };
    self.startEditSiwClaimAttendance = function(item){
        item.oldValue(ko.toJS(item));
        item.isEdit(true);
    };
    self.finishEditSiwClaimAttendance = function(item){
        SaveSiwClaimAttendance(item);
    };
    self.cancelEditSiwClaimAttendance = function(item){
        if(item.siwClaimAttendanceID()==null||item.siwClaimAttendanceID()==0){
           self.arrSiwClaimAttendance.remove(item);
        }else{
           ResetSiwClaimAttendance(item);
           item.isEdit(false);
         }
    };
    self.removeSiwClaimAttendance = function(item){
        DeleteSiwClaimAttendance(item);
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
        InitSiwClaimAttendances();
    };
    //--------------- Action Function ----------//
    function FinishInitNewSiwClaimAttendance(data){
       if(data.result =="Success"){
           var item = self.convertDataToSiwClaimAttendance(data.siwClaimAttendance);
           item.guid(data.siwClaimAttendance.guid);
           item.oldValue(ko.toJS(item));
           item.isEdit(true);
           self.arrSiwClaimAttendance.unshift(item);
       }
       self.processing().setProcessing("SiwClaimAttendances",false);
       if(self.ffInitNew() != null) self.ffInitNew()();
    }
    function InitSiwClaimAttendances()
    {
        if (self.actionOnLocal() == false)
        {
            self.processing().setProcessing("SiwClaimAttendances", true);
            var postParam = CollectGetParams();
            var json = JSON.stringify(postParam);
            CallAPI(
                self.getUrl.getSiwClaimAttendances,
                json,
                "POST",
                FinishInitSiwClaimAttendances,
                CallAPIFail);
        }
        else
        {
            if (self.arrSiwClaimAttendance().length == 0)
            {
                self.processing().setProcessing("SiwClaimAttendances", true);
                self.setSearchParam("isViewAll", true);
                var postParam = CollectGetParams();
                var json = JSON.stringify(postParam);
                CallAPI(
                    self.getUrl.getSiwClaimAttendances,
                    json,
                    "POST",
                    FinishInitSiwClaimAttendances,
                    CallAPIFail);
            }
            else
            {
                self.processing().setProcessing("SiwClaimAttendances", true);
                var searchCode = self.getSearchParam("searchCode").value();
                var arrFilter = self.arrSiwClaimAttendance();
                if (searchCode != null)
                {
                    searchCode = GenSearchKeyword(searchCode);
                    arrFilter = ko.utils.arrayFilter(arrFilter, function(item) {
                        return item.searchKeyword().indexOf(searchCode) > -1;
                    });
                }
                var start = (self.paging().pageIndex() - 1) * self.paging().pageSize();
                self.arrSSiwClaimAttendance(arrFilter.slice(start, start + self.paging().pageSize()));
                self.paging().resetPaging(self.paging().pageIndex(), self.paging().pageSize(), self.arrSiwClaimAttendance().length);
                if (self.ffInit() != null) self.ffInit()();
                self.processing().setProcessing("SiwClaimAttendances", false);
            }
        }
    }
    function InitWinnersAttendances() {
        if (self.actionOnLocal() == false) {
            self.processing().setProcessing("SiwClaimAttendances", true);
            var postParam = CollectGetParams();
            var json = JSON.stringify(postParam);
            CallAPI(
                self.getUrl.getWinnersAttendances,
                json,
                "POST",
                FinishInitSiwClaimAttendances,
                CallAPIFail);
        }
        else {
            if (self.arrSiwClaimAttendance().length == 0) {
                self.processing().setProcessing("SiwClaimAttendances", true);
                self.setSearchParam("isViewAll", true);
                var postParam = CollectGetParams();
                var json = JSON.stringify(postParam);
                CallAPI(
                    self.getUrl.getWinnersAttendances,
                    json,
                    "POST",
                    FinishInitSiwClaimAttendances,
                    CallAPIFail);
            }
            else {
                self.processing().setProcessing("SiwClaimAttendances", true);
                var searchCode = self.getSearchParam("searchCode").value();
                var arrFilter = self.arrSiwClaimAttendance();
                if (searchCode != null) {
                    searchCode = GenSearchKeyword(searchCode);
                    arrFilter = ko.utils.arrayFilter(arrFilter, function (item) {
                        return item.searchKeyword().indexOf(searchCode) > -1;
                    });
                }
                var start = (self.paging().pageIndex() - 1) * self.paging().pageSize();
                self.arrSSiwClaimAttendance(arrFilter.slice(start, start + self.paging().pageSize()));
                self.paging().resetPaging(self.paging().pageIndex(), self.paging().pageSize(), self.arrSiwClaimAttendance().length);
                if (self.ffInit() != null) self.ffInit()();
                self.processing().setProcessing("SiwClaimAttendances", false);
            }
        }
    }
     function FinishInitSiwClaimAttendances(data){
         if(data.result == "Success"){
             var arrItem = ko.utils.arrayMap(data.siwClaimAttendances,function(item){
                  return self.convertDataToSiwClaimAttendance(item);
             });
             self.arrSiwClaimAttendance.removeAll();
             self.arrSiwClaimAttendance(arrItem);
             self.paging().resetPaging(data.pageIndex,data.pageSize,data.totalCount);
         }
         //function run after init data
         if(self.ffInit() != null) self.ffInit()();
         self.processing().setProcessing("SiwClaimAttendances",false);
     }
     function SaveSiwClaimAttendance(item){
          if(ValidateSiwClaimAttendance(item)){
              self.processing().setProcessing("SiwClaimAttendances",true);
              var json = JSON.stringify(ConvertSiwClaimAttendanceToPostObject(item));
              CallAPI(
                  self.getUrl.saveSiwClaimAttendance,
                  json,
                  "POST",
                  FinishSaveSiwClaimAttendance,
                  CallAPIFail);
         }
     } 
     function FinishSaveSiwClaimAttendance(data) {
        if(data.result == "Success") {
            var item;
            if(data.siwClaimAttendanceID != null && data.siwClaimAttendanceID != 0) {
                item = ko.utils.arrayFirst(self.arrSiwClaimAttendance(), function (item1) {
                    return item1.siwClaimAttendanceID() == data.siwClaimAttendanceID;
                });
            } else {
                item = ko.utils.arrayFirst(self.arrSiwClaimAttendance(), function (item1) {
                    return item1.guid() == data.guid;
                });
            }
            if(item != null) {
                if(item.siwClaimAttendanceID() == null || item.siwClaimAttendanceID() == 0) {
                    self.paging().resetPaging(self.paging().pageIndex(), self.paging().pageSize(), self.paging().totalItems() + 1);
                }
                item.siwClaimAttendanceID(data.siwClaimAttendance.siwClaimAttendanceID);
                item.isEdit(false);
            }
        } else {
            swal("", Language.SaveResultFailMessage, "warning");
        }
        self.processing().setProcessing("SiwClaimAttendances", false);
        if(self.ffSave() != null) self.ffSave()();
     }
     function DeleteSiwClaimAttendance(item)
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
                     if(item.siwClaimAttendanceID() == null || item.siwClaimAttendanceID() == 0)
                     {
                         self.arrSiwClaimAttendance.remove(item);
                     }
                     else
                     {
                         self.processing().setProcessing("SiwClaimAttendances", true);
                         CallAPI(
                             self.getUrl.removeSiwClaimAttendance + "?id=" + item.siwClaimAttendanceID(),
                             null,
                             "DELETE",
                             FinishDeleteSiwClaimAttendance,
                             CallAPIFail
                         );
                     }
                 }
             }
         });
     }
     function FinishDeleteSiwClaimAttendance(data) {
         if(data.result == "Success") {
             self.arrSiwClaimAttendance.remove(function (item) { return item.siwClaimAttendanceID() == data.siwClaimAttendanceID; });
             self.paging().resetPaging(self.paging().pageIndex(), self.paging().pageSize(), self.paging().totalItems() - 1);
         }
         else {
             swal(Language.DeleteResultFailMessage, "", "warning");
         }
         self.processing().setProcessing("SiwClaimAttendances", false);
         if(self.ffDelete() != null) self.ffDelete()();
     }
     function CallAPIFail(jqXHR, textStatus, errorThrown) {
         self.processing().setProcessing("SiwClaimAttendance", false);
         swal("", Language.CallAPIFailMessage,"warning");
     }
     function ResetSiwClaimAttendance(item){
         item.siwClaimAttendanceID(item.oldValue().siwClaimAttendanceID);
         item.walletID(item.oldValue().walletID);
         item.userCode(item.oldValue().userCode);
         item.status(item.oldValue().status);
         item.startClaimAttendance(item.oldValue().startClaimAttendance);
        item.availableClaim(item.oldValue().availableClaim);
        item.shortWallet(item.oldValue().shortWallet);
         //end table database field
         item.walletName(item.oldValue().walletName);
     }
     function ConvertSiwClaimAttendanceToPostObject(item){
         var postObject = {
                    siwClaimAttendanceID:item.siwClaimAttendanceID(),
                    walletID:item.walletID(),
                    userCode:item.userCode(),
                    status:item.status(),
                    startClaimAttendance:item.startClaimAttendance(),
                          availableClaim:item.availableClaim(),
                          shortWallet:item.shortWallet(),
                    //end table database field               
                    guid:item.guid()
             };
             //update datetime format               
           if(item.startClaimAttendance()!==null)
           {
               postObject.startClaimAttendanceS = parseDateToSaveString(item.startClaimAttendance(),DateTimeFormat.DateTimeToAPIString);
           }
             //end update datetime format                
        return postObject;
    }
    self.convertDataToSiwClaimAttendance = function(dataItem){
        var item = new SiwClaimAttendance(
                         dataItem.siwClaimAttendanceID,
                         dataItem.walletID,
                         dataItem.userCode,
                         dataItem.status,
                         dataItem.startClaimAttendanceS,
                         dataItem.availableClaim,
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
    function ValidateSiwClaimAttendance(item){
         return true;
    } 
    //--------------- End Action Function ----------//
    //--------------- End For item -----------------------------//
};
