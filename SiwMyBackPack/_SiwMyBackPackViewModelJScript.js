var SiwMyBackPackViewModel = function(){
    var self = this;
    self.getUrl = {
        getSiwMyBackPack : "/SiwMyBackPack/Get",
        saveSiwMyBackPack   : "/SiwMyBackPack/Save",
        removeSiwMyBackPack : "/SiwMyBackPack/Remove",
        gotoMaster       : "vi-VN/SiwMyBackPack/Admin",
        getInit : "/SiwMyBackPack/GetInit",
        getParam : "/SiwMyBackPack/GetOne",
    };
    self.siwMyBackPackID = ko.observable(null);
    self.siwMyBackPack = ko.observable(null);
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
    self.setSiwMyBackPackID = function(id){
        self.siwMyBackPackID(id);
    };
    self.initData =function(){
        InitSiwMyBackPack();
    };
    self.initLocalData = function (data) {
        self.siwMyBackPack(self.convertDataToSiwMyBackPack(data));
        if(self.ffInit() != null) self.ffInit()();
    };
    self.startEditSiwMyBackPack = function(siwMyBackPack){
        siwMyBackPack.oldValue(ko.toJS(siwMyBackPack));
        siwMyBackPack.isEdit(true);
    };
    self.finishEditSiwMyBackPack = function(siwMyBackPack){
        SaveSiwMyBackPack(siwMyBackPack);
    };
    self.cancelEditSiwMyBackPack = function(siwMyBackPack){
        ResetSiwMyBackPack(siwMyBackPack);
        siwMyBackPack.isEdit(false);
    };
    self.removeSiwMyBackPack = function(siwMyBackPack){
        DeleteSiwMyBackPack(siwMyBackPack);
    };
    self.goBackToHome = function(){
        window.location.href = self.getUrl.gotoMaster;
    };
    function InitSiwMyBackPack()
    {
        self.processing().setProcessing("SiwMyBackPack", true);
        if(self.arrSearchParam().length > 0) //get a Siw My Back Pack searh param
        {
           var postParam = CollectGetParams();
            var json = JSON.stringify(postParam);
            CallAPI(
                self.getUrl.getParam,
                json,
                "POST",
                FinishInitSiwMyBackPack,
                CallAPIFail
            );
        }
        else
        {
            if(self.siwMyBackPackID() != null && self.siwMyBackPackID() != 0)  //get a Siw My Back Pack by SiwMyBackPackID
            {
                CallAPI(
                    self.getUrl.getSiwMyBackPack + "?id=" + self.siwMyBackPackID(),
                    null,
                    "GET",
                    FinishInitSiwMyBackPack,
                    CallAPIFail
                );
            }
            else
            { //init new SiwMyBackPack
                CallAPI(
                    self.getUrl.getInit,
                    null,
                    "GET",
                    FinishInitNewSiwMyBackPack,
                    CallAPIFail
                );
            }
        }
    }
    function FinishInitSiwMyBackPack(data)
    {
        if(data.result == "Success")
        {
            self.siwMyBackPack(self.convertDataToSiwMyBackPack(data.siwMyBackPack));
        }
        if(self.ffInit() != null) self.ffInit()();
        self.processing().setProcessing("SiwMyBackPack", false);
    }
    function FinishInitNewSiwMyBackPack(data)
    {
        if(data.result == "Success")
        {
            var item = self.convertDataToSiwMyBackPack(data.siwMyBackPack);
            item.guid(data.siwMyBackPack.guid);
            self.siwMyBackPack(item);
            self.siwMyBackPack().allowEdit(true);
            self.siwMyBackPack().allowRemove(true);
            self.siwMyBackPack().oldValue(ko.toJS(self.siwMyBackPack()));
            self.siwMyBackPack().isEdit(true);
        }
        if(self.ffInit() != null) self.ffInit()();
        self.processing().setProcessing("SiwMyBackPack", false);
    }
    function SaveSiwMyBackPack(item){
        if(ValidateSiwMyBackPack(item)){
            self.processing().setProcessing("SiwMyBackPack",true);
            var json = JSON.stringify(ConvertSiwMyBackPackToPostObject(item));
            CallAPI(
                self.getUrl.saveSiwMyBackPack,
                json,
                "POST",
                FinishSaveSiwMyBackPack,
                CallAPIFail
            );
        }
    } 
    function ValidateSiwMyBackPack(item){
        return true;
    }
    function FinishSaveSiwMyBackPack(data){
        if(data.result == "Success"){
            self.siwMyBackPack(self.convertDataToSiwMyBackPack(data.siwMyBackPack));
            self.siwMyBackPackID(data.siwMyBackPack.siwMyBackPackID);
            self.siwMyBackPack().isEdit(false);
        }else{
             swal("", Language.SaveResultFailMessage, "warning");
        }
        if(self.ffSave() != null) self.ffSave()();
        self.processing().setProcessing("SiwMyBackPack",false);
    }
    function DeleteSiwMyBackPack(siwMyBackPack){
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
                    if(siwMyBackPack != null) {
                        self.processing().setProcessing("SiwMyBackPack", true);
                        CallAPI(
                            self.getUrl.removeSiwMyBackPack,
                            { id: self.siwMyBackPack().siwMyBackPackID() },
                            "DELETE",
                            function (data) {
                                self.processing().setProcessing("SiwMyBackPack", false);
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
       item.itemName(dataItem.itemName);
       item.walletName(dataItem.walletName);
       item.siwUserName(dataItem.siwUserName);
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
