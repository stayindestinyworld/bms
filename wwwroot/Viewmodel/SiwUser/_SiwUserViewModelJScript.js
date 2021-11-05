var SiwUserViewModel = function(){
    var self = this;
    self.getUrl = {
        getSiwUser : "/SiwUser/Get",
        saveSiwUser   : "/SiwUser/Save",
        removeSiwUser : "/SiwUser/Remove",
        gotoMaster       : "vi-VN/SiwUser/Admin",
        getInit : "/SiwUser/GetInit",
        getParam : "/SiwUser/GetOne",
    };
    self.siwUserID = ko.observable(null);
    self.siwUser = ko.observable(null);
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
    self.setSiwUserID = function(id){
        self.siwUserID(id);
    };
    self.initData =function(){
        InitSiwUser();
    };
    self.initLocalData = function (data) {
        self.siwUser(self.convertDataToSiwUser(data));
        if(self.ffInit() != null) self.ffInit()();
    };
    self.startEditSiwUser = function(siwUser){
        siwUser.oldValue(ko.toJS(siwUser));
        siwUser.isEdit(true);
    };
    self.finishEditSiwUser = function(siwUser){
        SaveSiwUser(siwUser);
    };
    self.cancelEditSiwUser = function(siwUser){
        ResetSiwUser(siwUser);
        siwUser.isEdit(false);
    };
    self.removeSiwUser = function(siwUser){
        DeleteSiwUser(siwUser);
    };
    self.goBackToHome = function(){
        window.location.href = self.getUrl.gotoMaster;
    };
    function InitSiwUser()
    {
        self.processing().setProcessing("SiwUser", true);
        if(self.arrSearchParam().length > 0) //get a Siw User searh param
        {
           var postParam = CollectGetParams();
            var json = JSON.stringify(postParam);
            CallAPI(
                self.getUrl.getParam,
                json,
                "POST",
                FinishInitSiwUser,
                CallAPIFail
            );
        }
        else
        {
            if(self.siwUserID() != null && self.siwUserID() != 0)  //get a Siw User by SiwUserID
            {
                CallAPI(
                    self.getUrl.getSiwUser + "?id=" + self.siwUserID(),
                    null,
                    "GET",
                    FinishInitSiwUser,
                    CallAPIFail
                );
            }
            else
            { //init new SiwUser
                CallAPI(
                    self.getUrl.getInit,
                    null,
                    "GET",
                    FinishInitNewSiwUser,
                    CallAPIFail
                );
            }
        }
    }
    function FinishInitSiwUser(data)
    {
        if(data.result == "Success")
        {
            self.siwUser(self.convertDataToSiwUser(data.siwUser));
        }
        if(self.ffInit() != null) self.ffInit()();
        self.processing().setProcessing("SiwUser", false);
    }
    function FinishInitNewSiwUser(data)
    {
        if(data.result == "Success")
        {
            var item = self.convertDataToSiwUser(data.siwUser);
            item.guid(data.siwUser.guid);
            self.siwUser(item);
            self.siwUser().allowEdit(true);
            self.siwUser().allowRemove(true);
            self.siwUser().oldValue(ko.toJS(self.siwUser()));
            self.siwUser().isEdit(true);
        }
        if(self.ffInit() != null) self.ffInit()();
        self.processing().setProcessing("SiwUser", false);
    }
    function SaveSiwUser(item){
        if(ValidateSiwUser(item)){
            self.processing().setProcessing("SiwUser",true);
            var json = JSON.stringify(ConvertSiwUserToPostObject(item));
            CallAPI(
                self.getUrl.saveSiwUser,
                json,
                "POST",
                FinishSaveSiwUser,
                CallAPIFail
            );
        }
    } 
    function ValidateSiwUser(item){
        return true;
    }
    function FinishSaveSiwUser(data){
        if(data.result == "Success"){
            self.siwUser(self.convertDataToSiwUser(data.siwUser));
            self.siwUserID(data.siwUser.siwUserID);
            self.siwUser().isEdit(false);
            swal(SiwAirdropLanguage.valTitleSuccess, SiwAirdropLanguage.valTitleMessage, "success");
        }else{
             swal("", Language.SaveResultFailMessage, "warning");
        }
        if(self.ffSave() != null) self.ffSave()();
        self.processing().setProcessing("SiwUser",false);
    }
    function DeleteSiwUser(siwUser){
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
                    if(siwUser != null) {
                        self.processing().setProcessing("SiwUser", true);
                        CallAPI(
                            self.getUrl.removeSiwUser,
                            { id: self.siwUser().siwUserID() },
                            "DELETE",
                            function (data) {
                                self.processing().setProcessing("SiwUser", false);
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
