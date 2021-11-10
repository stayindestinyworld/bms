var SiwHistoryClaimRewardsViewModel = function () {
    var self = this;
    self.getUrl = {     
       getInit      : "/SiwHistoryClaimReward/GetInit",
       getSiwHistoryClaimRewards        : "/SiwHistoryClaimReward/GetAll",
       saveSiwHistoryClaimReward        : "/SiwHistoryClaimReward/Save",
       removeSiwHistoryClaimReward      : "/SiwHistoryClaimReward/Remove",
       saveListSiwHistoryClaimReward      : "/SiwHistoryClaimReward/SaveList",
    };
    self.processing = ko.observable(null);
    self.transition = ko.observable(null);
    self.ffInit = ko.observable(null);
    self.ffSave = ko.observable(null);
    self.ffSaveAll = ko.observable(null);
    self.ffDelete = ko.observable(null);
    self.ffDeleteList = ko.observable(null);
    self.sortedField = ko.observable(null);
    self.arrSearchParam = ko.observableArray([]);
    self.numItemSave = ko.observable(10);
    self.arrSSiwHistoryClaimReward = ko.observableArray([]);
    self.arrSiwHistoryClaimReward = ko.observableArray([]);
    //------- Init data for view model----------------------------
    self.initModel = function(transition,processing){
       self.transition = transition;
       self.processing = processing;
    };
    self.setFFInit = function(ffInit){
        self.ffInit(ffInit);
    };
    self.setFFSave = function(ffSave){
        self.ffSave(ffSave);
    };
    self.setFFSaveAll = function(ffSaveall){
        self.ffSaveAll(ffSaveall);
    };
    self.setFFDelete = function(ffDelete){
        self.ffDelete(ffDelete);
    };
    self.setFFDeleteList = function(ffDeletelist){
        self.ffDeleteList(ffDeletelist);
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
    //--------------- For Searching -----------------------------//
    self.searchSiwHistoryClaimRewards = function(){
        InitSiwHistoryClaimRewards();
    };
    //--------------- For Item -----------------------------//
    //--------------- Model Event ----------//
    self.startAddSiwHistoryClaimReward = function(){
        self.processing().setProcessing("SiwHistoryClaimRewards",true);
         CallAPI(self.getUrl.getInit, {}, "GET", FinishInitNewSiwHistoryClaimReward,CallAPIFail);
    };
    self.startEditSiwHistoryClaimReward = function(item){
        item.oldValue(ko.toJS(item));
        item.isEdit(true);
        if(item.siwHistoryClaimRewardID() != 0)
        {
            item.editMode("Edit");
        }
        else
        {
            item.editMode("New");
        }
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
    }
    function InitSiwHistoryClaimRewards(){
        self.processing().setProcessing("SiwHistoryClaimRewards",true);
        var postParam = CollectGetParams();
        var json = JSON.stringify(postParam);
        CallAPI(
           self.getUrl.getSiwHistoryClaimRewards,
           json,
           "POST",
           FinishInitSiwHistoryClaimRewards,
           CallAPIFail
      );
    }
    function FinishInitSiwHistoryClaimRewards(data){
        if(data.result == "Success"){
           var arrItem = ko.utils.arrayMap(data.siwHistoryClaimRewards,function(item){
               return self.convertDataToSiwHistoryClaimReward(item);
           });
           self.arrSiwHistoryClaimReward.removeAll();
           self.arrSiwHistoryClaimReward(arrItem);
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
                 CallAPIFail
             );
        }
    } 
    function FinishSaveSiwHistoryClaimReward(data){
        if(data.result == "Success"){
            var item;
            if(data.siwHistoryClaimRewardID != null&&data.siwHistoryClaimRewardID != 0)
            {
                item = ko.utils.arrayFirst(self.arrSiwHistoryClaimReward(),function(item1){
                           return item1.siwHistoryClaimRewardID() == data.siwHistoryClaimRewardID;
                       });
            }else
            {
                item = ko.utils.arrayFirst(self.arrSiwHistoryClaimReward(),function(item1){
                           return item1.guid() == data.guid;
                       });
            }
            if(item!=null)
            {
                item.siwHistoryClaimRewardID(data.siwHistoryClaimReward.siwHistoryClaimRewardID);
                item.isEdit(false);
            }
        }
        self.processing().setProcessing("SiwHistoryClaimRewards",false);
        if(self.ffSave()!=null)
        {
            self.ffSave()();
        }
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
    function FinishDeleteSiwHistoryClaimReward(data)
    {
        if(data.result == "Success")
        {
            self.arrSiwHistoryClaimReward.remove(function(item) { return item.siwHistoryClaimRewardID() == data.siwHistoryClaimRewardID; });
        }
        else
        {
            swal("", Language.DeleteResultFailMessage, "warning");
       }
        self.processing().setProcessing("SiwHistoryClaimRewards", false);
       if(self.ffDelete() != null) self.ffDelete()();
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
               postObject.dateClaimS = parseDateToSaveString(item.dateClaim(),DateTimeFormat.DateMomentConvertFormat);
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
        item.walletName(dataItem.walletName);
        item.guid(dataItem.guid);
        return item;
    };
    function CollectGetParams(){
        var postParam = {
           searchparams : null
        };
        if(self.sortedField()!=null){
           var sparam = ko.utils.arrayFirst(self.arrSearchParam(),function(param){return param.key() == "SortedField"});
           if(sparam!=null){
               sparam.value(self.sortedField().name());
               var sparam1 = ko.utils.arrayFirst(self.arrSearchParam(),function(param){return param.key() == "SortedDirection"});
               sparam1.value(self.sortedField().direction());
           }else{
               self.arrSearchParam.push(new SearchParam("SortedField",self.sortedField().name()));
               self.arrSearchParam.push(new SearchParam("SortedDirection",self.sortedField().direction()));
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
     self.startAddListSiwHistoryClaimReward = function(){
         self.processing().setProcessing("SiwHistoryClaimRewards",true);
         CallAPI(self.getUrl.getInit, null,"GET", FinishInitListNewSiwHistoryClaimReward);
     };
     self.startEditListSiwHistoryClaimReward = function(item){
        item.oldValue(ko.toJS(item));
        item.isEdit(true);
        if(item.siwHistoryClaimRewardID()>0){
            item.editMode("Edit");
        }
    };
    self.finishEditListSiwHistoryClaimReward = function(item){
        if(ValidateSiwHistoryClaimReward(item)){
           item.isEdit(false);
        }
    };
    self.cancelEditListSiwHistoryClaimReward = function(item){
        if(item.editMode()=="Delete"){ item.editMode("");}
        ResetSiwHistoryClaimReward(item);
        item.isEdit(false);
    };
    self.removeListSiwHistoryClaimReward = function(item){
        if(item.siwHistoryClaimRewardID()==null||item.siwHistoryClaimRewardID()==0){
           self.arrSiwHistoryClaimReward.remove(item);
           if(self.ffDeleteList() != null) self.ffDeleteList()();
        }else{
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
            function(result){
                if(result){
                    item.editMode("Delete");
                    if(self.ffDeleteList() != null) self.ffDeleteList()();
                }
            });
        }
    };
    function FinishInitListNewSiwHistoryClaimReward(data){
       if(data.result =="Success"){
          var item = self.convertDataToSiwHistoryClaimReward(data.siwHistoryClaimReward);
          item.editMode("New");
          item.oldValue(ko.toJS(item));
          item.isEdit(true);
          self.arrSiwHistoryClaimReward.push(item);
       }
       self.processing().setProcessing("SiwHistoryClaimRewards",false);
    }
    self.saveAllSiwHistoryClaimReward = function(){
        SaveListSiwHistoryClaimReward();
    };
    function CallAPIFail(jqXHR, textStatus, errorThrown)
    {
        // If fail
        self.processing().setProcessing("SiwHistoryClaimRewards", false);
        swal(Language.CallAPIFailMessage, "", "warning");
    }
    function SaveListSiwHistoryClaimReward() {
        var postArray = new Array();
        var isOK = true;
        var nexitem = self.arrSSiwHistoryClaimReward().length;
        var numsave = self.numItemSave();
        for (var i = nexitem; i < self.arrSiwHistoryClaimReward().length&&numsave>0; i++) {
            var item = self.arrSiwHistoryClaimReward()[i];
            if(item.editMode() != "Delete") {
                isOK = isOK && ValidateSiwHistoryClaimReward(item);
                if(isOK) {
                    postArray.push(ko.toJS(item));
                }
            }
            else {
                postArray.push(ko.toJS(item));
            }
            self.arrSSiwHistoryClaimReward.push(item);
            numsave--;
        }
        if(postArray.length>0) {
            self.processing().setProcessing("SiwHistoryClaimRewards", true);
            var json = JSON.stringify(postArray);
            CallAPI(
               self.getUrl.saveListSiwHistoryClaimReward,
                 json,
                "POST",
                FinishSaveListSiwHistoryClaimReward,
                CallAPIFail
            );
        }
    }
    function FinishSaveListSiwHistoryClaimReward(data) {
        if(data.result == "Success") {
            ko.utils.arrayForEach(self.arrSSiwHistoryClaimReward(), function (item) {
                if(item.siwHistoryClaimRewardID() == null||item.siwHistoryClaimRewardID() == 0) {
                    var dataItem = ko.utils.arrayFirst(data.siwHistoryClaimRewards, function (item1) {
                        return item1.guid == item.guid();
                    });
                    if(dataItem != null) {
                        item.siwHistoryClaimRewardID(dataItem.siwHistoryClaimRewardID);
                    }
                }
                if(item.editMode() != "Delete") {
                    item.editMode("");
                }
                item.isEdit(false);
            });
        }
        if(self.arrSiwHistoryClaimReward().length == self.arrSSiwHistoryClaimReward().length) {
            self.processing().setProcessing("SiwHistoryClaimRewards", false);
            self.arrSSiwHistoryClaimReward.removeAll();
            self.arrSiwHistoryClaimReward.remove(function(item){ return item.editMode()=="Delete";});
            if(self.ffSaveAll() != null) {
                self.ffSaveAll()();
            }
        } else {
            SaveListSiwHistoryClaimReward();
        }
    }
     //--------------- End Action Function ----------//
     //--------------- End For item -----------------------------//
};
