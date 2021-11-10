var SiwHistoryClaimRewardViewModel = function(){
    var self = this;
    self.getUrl = {
        getSiwHistoryClaimReward : "/SiwHistoryClaimReward/Get",
        saveSiwHistoryClaimReward   : "/SiwHistoryClaimReward/Save",
        removeSiwHistoryClaimReward : "/SiwHistoryClaimReward/Remove",
        gotoMaster       : "vi-VN/SiwHistoryClaimReward/Admin",
        getInit : "/SiwHistoryClaimReward/GetInit",
        getParam : "/SiwHistoryClaimReward/GetOne",
    };
    self.siwHistoryClaimRewardID = ko.observable(null);
    self.siwHistoryClaimReward = ko.observable(null);
    self.transition = ko.observable(null);
    self.processing = ko.observable(null);
    self.ffInit = ko.observable(null);
    self.ffSave = ko.observable(null);
    self.ffDelete = ko.observable(null);
    self.sortedField = ko.observable(null);
    self.arrSearchParam = ko.observableArray([]);
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
    self.setFFDelete = function(ffDelete){
        self.ffDelete(ffDelete);
    };
    self.setSiwHistoryClaimRewardID = function(id){
        self.siwHistoryClaimRewardID(id);
    };
    self.initData =function(){
        InitSiwHistoryClaimReward();
    };
    self.initLocalData = function (data) {
        self.siwHistoryClaimReward(self.convertDataToSiwHistoryClaimReward(data));
        if(self.ffInit() != null) self.ffInit()();
    };
    self.startEditSiwHistoryClaimReward = function(siwHistoryClaimReward){
        siwHistoryClaimReward.oldValue(ko.toJS(siwHistoryClaimReward));
        siwHistoryClaimReward.isEdit(true);
    };
    self.finishEditSiwHistoryClaimReward = function(siwHistoryClaimReward){
        SaveSiwHistoryClaimReward(siwHistoryClaimReward);
    };
    self.cancelEditSiwHistoryClaimReward = function(siwHistoryClaimReward){
        ResetSiwHistoryClaimReward(siwHistoryClaimReward);
        siwHistoryClaimReward.isEdit(false);
    };
    self.removeSiwHistoryClaimReward = function(siwHistoryClaimReward){
        DeleteSiwHistoryClaimReward(siwHistoryClaimReward);
    };
    self.goBackToHome = function(){
        window.location.href = self.getUrl.gotoMaster;
    };
    function InitSiwHistoryClaimReward()
    {
        self.processing().setProcessing("SiwHistoryClaimReward", true);
        if(self.arrSearchParam().length > 0) //get a Siw History Claim Reward searh param
        {
           var postParam = CollectGetParams();
            var json = JSON.stringify(postParam);
            CallAPI(
                self.getUrl.getParam,
                json,
                "POST",
                FinishInitSiwHistoryClaimReward,
                CallAPIFail
            );
        }
        else
        {
            if(self.siwHistoryClaimRewardID() != null && self.siwHistoryClaimRewardID() != 0)  //get a Siw History Claim Reward by SiwHistoryClaimRewardID
            {
                CallAPI(
                    self.getUrl.getSiwHistoryClaimReward + "?id=" + self.siwHistoryClaimRewardID(),
                    null,
                    "GET",
                    FinishInitSiwHistoryClaimReward,
                    CallAPIFail
                );
            }
            else
            { //init new SiwHistoryClaimReward
                CallAPI(
                    self.getUrl.getInit,
                    null,
                    "GET",
                    FinishInitNewSiwHistoryClaimReward,
                    CallAPIFail
                );
            }
        }
    }
    function FinishInitSiwHistoryClaimReward(data)
    {
        if(data.result == "Success")
        {
            self.siwHistoryClaimReward(self.convertDataToSiwHistoryClaimReward(data.siwHistoryClaimReward));
        }
        if(self.ffInit() != null) self.ffInit()();
        self.processing().setProcessing("SiwHistoryClaimReward", false);
    }
    function FinishInitNewSiwHistoryClaimReward(data)
    {
        if(data.result == "Success")
        {
            var item = self.convertDataToSiwHistoryClaimReward(data.siwHistoryClaimReward);
            item.guid(data.siwHistoryClaimReward.guid);
            self.siwHistoryClaimReward(item);
            self.siwHistoryClaimReward().allowEdit(true);
            self.siwHistoryClaimReward().allowRemove(true);
            self.siwHistoryClaimReward().oldValue(ko.toJS(self.siwHistoryClaimReward()));
            self.siwHistoryClaimReward().isEdit(true);
        }
        if(self.ffInit() != null) self.ffInit()();
        self.processing().setProcessing("SiwHistoryClaimReward", false);
    }
    function SaveSiwHistoryClaimReward(item){
        if(ValidateSiwHistoryClaimReward(item)){
            self.processing().setProcessing("SiwHistoryClaimReward",true);
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
    function ValidateSiwHistoryClaimReward(item){
        return true;
    }
    function FinishSaveSiwHistoryClaimReward(data){
        if(data.result == "Success"){
            self.siwHistoryClaimReward(self.convertDataToSiwHistoryClaimReward(data.siwHistoryClaimReward));
            self.siwHistoryClaimRewardID(data.siwHistoryClaimReward.siwHistoryClaimRewardID);
            self.siwHistoryClaimReward().isEdit(false);
        }else{
             swal("", Language.SaveResultFailMessage, "warning");
        }
        if(self.ffSave() != null) self.ffSave()();
        self.processing().setProcessing("SiwHistoryClaimReward",false);
    }
    function DeleteSiwHistoryClaimReward(siwHistoryClaimReward){
        swal({
            title: Language.DeleteConfirmTitle,
            text: Language.DeleteConfirmMessage,
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: Language.DeleteButtonYes,
            cancelButtonText: Language.DeleteButtonYes,
            closeOnConfirm: true,
            closeOnCancel: true
            },
            function (result) {
                if(result) {
                    if(siwHistoryClaimReward != null) {
                        self.processing().setProcessing("SiwHistoryClaimReward", true);
                        CallAPI(
                            self.getUrl.removeSiwHistoryClaimReward,
                            { id: self.siwHistoryClaimReward().siwHistoryClaimRewardID() },
                            "DELETE",
                            function (data) {
                                self.processing().setProcessing("SiwHistoryClaimReward", false);
                                if(data.result == "Success") {
                                    swal(Language.DeleteResultSuccessMessage, "", "success");
                                    if(self.ffDelete() != null) self.ffDelete()();
                                } else {
                                    swal(Language.DeleteResultFailMessage, "", "warning");
                                }
                            },
                            CallAPIFail
                        );
                    }
                }
            });
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
                         // dateClaim:item.dateClaim(),
                          description:item.description(),
                          //end table database field
                          guid:item.guid()
                         };
           //update datetime format                
           //if(item.dateClaim()!==null)
           //{
           //    postObject.dateClaimS = parseDateToSaveString(item.dateClaim(),DateTimeFormat.DateTimeToAPIString);
           //}
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
         return item;
    }
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
};
