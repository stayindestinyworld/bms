var SiwHistoryClaimRewardsPageViewModel = function () {
    var self = this;
    self.getUrl = {
        getSiwHistoryClaimRewards   : "/SiwHistoryClaimReward/GetPage",
        saveSiwHistoryClaimReward   : "/SiwHistoryClaimReward/Save",
        removeSiwHistoryClaimReward : "/SiwHistoryClaimReward/Remove",
        getInit : "/SiwHistoryClaimReward/GetInit",
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
    self.arrSiwHistoryClaimReward = ko.observableArray([]);
    self.arrSSiwHistoryClaimReward = ko.observableArray([]);
    self.actionOnLocal = ko.observable(false);
    //------- Init data for view model----------------------------
    self.initModel = function(transition,processing){
        self.transition = transition;
        self.processing = processing;
    };
    self.initData = function () {
        InitSiwHistoryClaimRewards();
    };
    self.initLocalData = function (data) {
       var arrItem = ko.utils.arrayMap(data, function (item) {
           return self.convertDataToSiwHistoryClaimReward(item);
       });
       self.arrSiwHistoryClaimReward.removeAll();
       self.arrSiwHistoryClaimReward(arrItem);
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
    self.searchSiwHistoryClaimRewards = function(){
        InitSiwHistoryClaimRewards();
    };
    self.resetSearchSiwHistoryClaimReward = function() {
        self.setSearchParam("searchCode", null);
        InitSiwHistoryClaimRewards();
    };
    self.gotoPage = function(page){
       if(page!=self.paging().pageIndex()){
           self.paging().pageIndex(page);
           InitSiwHistoryClaimRewards();
       }
    };
    self.gotoNextPage = function(){
       if(self.paging().pageIndex()<self.paging().totalPages()){
           self.paging().pageIndex(self.paging().pageIndex()+1);
           InitSiwHistoryClaimRewards();
       }
    };
    self.gotoPrevPage = function(){
        if(self.paging().pageIndex()>1){
            self.paging().pageIndex(self.paging().pageIndex()-1);
            InitSiwHistoryClaimRewards();
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
    self.startAddSiwHistoryClaimReward = function(){
        self.processing().setProcessing("SiwHistoryClaimRewards",true);
        CallAPI(self.getUrl.getInit, null,"GET", FinishInitNewSiwHistoryClaimReward);
    };
    self.startEditSiwHistoryClaimReward = function(item){
        item.oldValue(ko.toJS(item));
        item.isEdit(true);
    };
    self.finishEditSiwHistoryClaimReward = function(item){
        SaveSiwHistoryClaimReward(item);
    };
    self.cancelEditSiwHistoryClaimReward = function(item){
        if(item.siwHistoryClaimRewardID()==null||item.siwHistoryClaimRewardID()==0){
           self.arrSiwHistoryClaimReward.remove(item);
        }else{
           ResetSiwHistoryClaimReward(item);
           item.isEdit(false);
         }
    };
    self.removeSiwHistoryClaimReward = function(item){
        DeleteSiwHistoryClaimReward(item);
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
        InitSiwHistoryClaimRewards();
    };
    //--------------- Action Function ----------//
    function FinishInitNewSiwHistoryClaimReward(data){
       if(data.result =="Success"){
           var item = self.convertDataToSiwHistoryClaimReward(data.siwHistoryClaimReward);
           item.guid(data.siwHistoryClaimReward.guid);
           item.oldValue(ko.toJS(item));
           item.isEdit(true);
           self.arrSiwHistoryClaimReward.unshift(item);
       }
       self.processing().setProcessing("SiwHistoryClaimRewards",false);
       if(self.ffInitNew() != null) self.ffInitNew()();
    }
    function InitSiwHistoryClaimRewards()
    {
        if (self.actionOnLocal() == false)
        {
            self.processing().setProcessing("SiwHistoryClaimRewards", true);
            var postParam = CollectGetParams();
            var json = JSON.stringify(postParam);
            CallAPI(
                self.getUrl.getSiwHistoryClaimRewards,
                json,
                "POST",
                FinishInitSiwHistoryClaimRewards,
                CallAPIFail);
        }
        else
        {
            if (self.arrSiwHistoryClaimReward().length == 0)
            {
                self.processing().setProcessing("SiwHistoryClaimRewards", true);
                self.setSearchParam("isViewAll", true);
                var postParam = CollectGetParams();
                var json = JSON.stringify(postParam);
                CallAPI(
                    self.getUrl.getSiwHistoryClaimRewards,
                    json,
                    "POST",
                    FinishInitSiwHistoryClaimRewards,
                    CallAPIFail);
            }
            else
            {
                self.processing().setProcessing("SiwHistoryClaimRewards", true);
                var searchCode = self.getSearchParam("searchCode").value();
                var arrFilter = self.arrSiwHistoryClaimReward();
                if (searchCode != null)
                {
                    searchCode = GenSearchKeyword(searchCode);
                    arrFilter = ko.utils.arrayFilter(arrFilter, function(item) {
                        return item.searchKeyword().indexOf(searchCode) > -1;
                    });
                }
                var start = (self.paging().pageIndex() - 1) * self.paging().pageSize();
                self.arrSSiwHistoryClaimReward(arrFilter.slice(start, start + self.paging().pageSize()));
                self.paging().resetPaging(self.paging().pageIndex(), self.paging().pageSize(), self.arrSiwHistoryClaimReward().length);
                if (self.ffInit() != null) self.ffInit()();
                self.processing().setProcessing("SiwHistoryClaimRewards", false);
            }
        }
    }
     function FinishInitSiwHistoryClaimRewards(data){
         if(data.result == "Success"){
             var arrItem = ko.utils.arrayMap(data.siwHistoryClaimRewards,function(item){
                  return self.convertDataToSiwHistoryClaimReward(item);
             });
             self.arrSiwHistoryClaimReward.removeAll();
             self.arrSiwHistoryClaimReward(arrItem);
             self.paging().resetPaging(data.pageIndex,data.pageSize,data.totalCount);
         }
         //function run after init data
         if(self.ffInit() != null) self.ffInit()();
         self.processing().setProcessing("SiwHistoryClaimRewards",false);
     }
     function SaveSiwHistoryClaimReward(item){
          if(ValidateSiwHistoryClaimReward(item)){
              self.processing().setProcessing("SiwHistoryClaimRewards",true);
              var json = JSON.stringify(ConvertSiwHistoryClaimRewardToPostObject(item));
              CallAPI(
                  self.getUrl.saveSiwHistoryClaimReward,
                  json,
                  "POST",
                  FinishSaveSiwHistoryClaimReward,
                  CallAPIFail);
         }
     } 
     function FinishSaveSiwHistoryClaimReward(data) {
        if(data.result == "Success") {
            var item;
            if(data.siwHistoryClaimRewardID != null && data.siwHistoryClaimRewardID != 0) {
                item = ko.utils.arrayFirst(self.arrSiwHistoryClaimReward(), function (item1) {
                    return item1.siwHistoryClaimRewardID() == data.siwHistoryClaimRewardID;
                });
            } else {
                item = ko.utils.arrayFirst(self.arrSiwHistoryClaimReward(), function (item1) {
                    return item1.guid() == data.guid;
                });
            }
            if(item != null) {
                if(item.siwHistoryClaimRewardID() == null || item.siwHistoryClaimRewardID() == 0) {
                    self.paging().resetPaging(self.paging().pageIndex(), self.paging().pageSize(), self.paging().totalItems() + 1);
                }
                item.siwHistoryClaimRewardID(data.siwHistoryClaimReward.siwHistoryClaimRewardID);
                item.isEdit(false);
            }
        } else {
            swal("", Language.SaveResultFailMessage, "warning");
        }
        self.processing().setProcessing("SiwHistoryClaimRewards", false);
        if(self.ffSave() != null) self.ffSave()();
     }
     function DeleteSiwHistoryClaimReward(item)
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
                     if(item.siwHistoryClaimRewardID() == null || item.siwHistoryClaimRewardID() == 0)
                     {
                         self.arrSiwHistoryClaimReward.remove(item);
                     }
                     else
                     {
                         self.processing().setProcessing("SiwHistoryClaimRewards", true);
                         CallAPI(
                             self.getUrl.removeSiwHistoryClaimReward + "?id=" + item.siwHistoryClaimRewardID(),
                             null,
                             "DELETE",
                             FinishDeleteSiwHistoryClaimReward,
                             CallAPIFail
                         );
                     }
                 }
             }
         });
     }
     function FinishDeleteSiwHistoryClaimReward(data) {
         if(data.result == "Success") {
             self.arrSiwHistoryClaimReward.remove(function (item) { return item.siwHistoryClaimRewardID() == data.siwHistoryClaimRewardID; });
             self.paging().resetPaging(self.paging().pageIndex(), self.paging().pageSize(), self.paging().totalItems() - 1);
         }
         else {
             swal(Language.DeleteResultFailMessage, "", "warning");
         }
         self.processing().setProcessing("SiwHistoryClaimRewards", false);
         if(self.ffDelete() != null) self.ffDelete()();
     }
     function CallAPIFail(jqXHR, textStatus, errorThrown) {
         self.processing().setProcessing("SiwHistoryClaimReward", false);
         swal("", Language.CallAPIFailMessage,"warning");
     }
     function ResetSiwHistoryClaimReward(item){
         item.siwHistoryClaimRewardID(item.oldValue().siwHistoryClaimRewardID);
         item.walletID(item.oldValue().walletID);
         item.shortWallet(item.oldValue().shortWallet);
         item.userCode(item.oldValue().userCode);
         item.status(item.oldValue().status);
         item.claim(item.oldValue().claim);
         item.dateClaim(item.oldValue().dateClaim);
         item.description(item.oldValue().description);
         //end table database field
         item.walletName(item.oldValue().walletName);
     }
     function ConvertSiwHistoryClaimRewardToPostObject(item){
         var postObject = {
                    siwHistoryClaimRewardID:item.siwHistoryClaimRewardID(),
                    walletID:item.walletID(),
                    shortWallet:item.shortWallet(),
                    userCode:item.userCode(),
                    status:item.status(),
                    claim:item.claim(),
                    dateClaim:item.dateClaim(),
                    description:item.description(),
                    //end table database field               
                    guid:item.guid()
             };
             //update datetime format               
           if(item.dateClaim()!==null)
           {
               postObject.dateClaimS = parseDateToSaveString(item.dateClaim(),DateTimeFormat.DateTimeToAPIString);
           }
             //end update datetime format                
        return postObject;
    }
    self.convertDataToSiwHistoryClaimReward = function(dataItem){
        var item = new SiwHistoryClaimReward(
                         dataItem.siwHistoryClaimRewardID,
                         dataItem.walletID,
                         dataItem.shortWallet,
                         dataItem.userCode,
                         dataItem.status,
                         dataItem.claim,
                         dataItem.dateClaimS,
                         dataItem.description
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
    function ValidateSiwHistoryClaimReward(item){
         return true;
    } 
    //--------------- End Action Function ----------//
    //--------------- End For item -----------------------------//
};
