var SiwEmailSubscribeViewModel = function(){
    var self = this;
    self.getUrl = {
        getSiwEmailSubscribe : "/SiwEmailSubscribe/Get",
        saveSiwEmailSubscribe   : "/SiwEmailSubscribe/Save",
        removeSiwEmailSubscribe : "/SiwEmailSubscribe/Remove",
        gotoMaster       : "vi-VN/SiwEmailSubscribe/Admin",
        getInit : "/SiwEmailSubscribe/GetInit",
        getParam : "/SiwEmailSubscribe/GetOne",
    };
    self.siwEmailSubscribeID = ko.observable(null);
    self.siwEmailSubscribe = ko.observable(null);
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
    self.setSiwEmailSubscribeID = function(id){
        self.siwEmailSubscribeID(id);
    };
    self.initData =function(){
        InitSiwEmailSubscribe();
    };
    self.initLocalData = function (data) {
        self.siwEmailSubscribe(self.convertDataToSiwEmailSubscribe(data));
        if(self.ffInit() != null) self.ffInit()();
    };
    self.startEditSiwEmailSubscribe = function(siwEmailSubscribe){
        siwEmailSubscribe.oldValue(ko.toJS(siwEmailSubscribe));
        siwEmailSubscribe.isEdit(true);
    };
    self.finishEditSiwEmailSubscribe = function(siwEmailSubscribe){
        SaveSiwEmailSubscribe(siwEmailSubscribe);
    };
    self.cancelEditSiwEmailSubscribe = function(siwEmailSubscribe){
        ResetSiwEmailSubscribe(siwEmailSubscribe);
        siwEmailSubscribe.isEdit(false);
    };
    self.removeSiwEmailSubscribe = function(siwEmailSubscribe){
        DeleteSiwEmailSubscribe(siwEmailSubscribe);
    };
    self.goBackToHome = function(){
        window.location.href = self.getUrl.gotoMaster;
    };
    function InitSiwEmailSubscribe()
    {
        self.processing().setProcessing("SiwEmailSubscribe", true);
        if(self.arrSearchParam().length > 0) //get a Siw Email Subscribe searh param
        {
           var postParam = CollectGetParams();
            var json = JSON.stringify(postParam);
            CallAPI(
                self.getUrl.getParam,
                json,
                "POST",
                FinishInitSiwEmailSubscribe,
                CallAPIFail
            );
        }
        else
        {
            if(self.siwEmailSubscribeID() != null && self.siwEmailSubscribeID() != 0)  //get a Siw Email Subscribe by SiwEmailSubscribeID
            {
                CallAPI(
                    self.getUrl.getSiwEmailSubscribe + "?id=" + self.siwEmailSubscribeID(),
                    null,
                    "GET",
                    FinishInitSiwEmailSubscribe,
                    CallAPIFail
                );
            }
            else
            { //init new SiwEmailSubscribe
                CallAPI(
                    self.getUrl.getInit,
                    null,
                    "GET",
                    FinishInitNewSiwEmailSubscribe,
                    CallAPIFail
                );
            }
        }
    }
    function FinishInitSiwEmailSubscribe(data)
    {
        if(data.result == "Success")
        {
            self.siwEmailSubscribe(self.convertDataToSiwEmailSubscribe(data.siwEmailSubscribe));
        }
        if(self.ffInit() != null) self.ffInit()();
        self.processing().setProcessing("SiwEmailSubscribe", false);
    }
    function FinishInitNewSiwEmailSubscribe(data)
    {
        if(data.result == "Success")
        {
            var item = self.convertDataToSiwEmailSubscribe(data.siwEmailSubscribe);
            item.guid(data.siwEmailSubscribe.guid);
            self.siwEmailSubscribe(item);
            self.siwEmailSubscribe().allowEdit(true);
            self.siwEmailSubscribe().allowRemove(true);
            self.siwEmailSubscribe().oldValue(ko.toJS(self.siwEmailSubscribe()));
            self.siwEmailSubscribe().isEdit(true);
        }
        if(self.ffInit() != null) self.ffInit()();
        self.processing().setProcessing("SiwEmailSubscribe", false);
    }
    function SaveSiwEmailSubscribe(item){
        if(ValidateSiwEmailSubscribe(item)){
            self.processing().setProcessing("SiwEmailSubscribe",true);
            var json = JSON.stringify(ConvertSiwEmailSubscribeToPostObject(item));
            CallAPI(
                self.getUrl.saveSiwEmailSubscribe,
                json,
                "POST",
                FinishSaveSiwEmailSubscribe,
                CallAPIFail
            );
        }
    } 
    function ValidateSiwEmailSubscribe(item){
        return true;
    }
    function FinishSaveSiwEmailSubscribe(data){
        if(data.result == "Success"){
            self.siwEmailSubscribe(self.convertDataToSiwEmailSubscribe(data.siwEmailSubscribe));
            self.siwEmailSubscribeID(data.siwEmailSubscribe.siwEmailSubscribeID);
            self.siwEmailSubscribe().isEdit(false);
        }else{
             swal("", Language.SaveResultFailMessage, "warning");
        }
        if(self.ffSave() != null) self.ffSave()();
        self.processing().setProcessing("SiwEmailSubscribe",false);
    }
    function DeleteSiwEmailSubscribe(siwEmailSubscribe){
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
                    if(siwEmailSubscribe != null) {
                        self.processing().setProcessing("SiwEmailSubscribe", true);
                        CallAPI(
                            self.getUrl.removeSiwEmailSubscribe,
                            { id: self.siwEmailSubscribe().siwEmailSubscribeID() },
                            "DELETE",
                            function (data) {
                                self.processing().setProcessing("SiwEmailSubscribe", false);
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
