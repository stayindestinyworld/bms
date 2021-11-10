var SiwClaimAttendanceViewModel = function(){
    var self = this;
    self.getUrl = {
        getSiwClaimAttendance : "/SiwClaimAttendance/Get",
        saveSiwClaimAttendance   : "/SiwClaimAttendance/Save",
        removeSiwClaimAttendance : "/SiwClaimAttendance/Remove",
        gotoMaster       : "vi-VN/SiwClaimAttendance/Admin",
        getInit : "/SiwClaimAttendance/GetInit",
        getParam : "/SiwClaimAttendance/GetOne",
    };
    self.siwClaimAttendanceID = ko.observable(null);
    self.siwClaimAttendance = ko.observable(null);
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
    self.setSiwClaimAttendanceID = function(id){
        self.siwClaimAttendanceID(id);
    };
    self.initData =function(){
        InitSiwClaimAttendance();
    };
    self.initLocalData = function (data) {
        self.siwClaimAttendance(self.convertDataToSiwClaimAttendance(data));
        if(self.ffInit() != null) self.ffInit()();
    };
    self.startEditSiwClaimAttendance = function(siwClaimAttendance){
        siwClaimAttendance.oldValue(ko.toJS(siwClaimAttendance));
        siwClaimAttendance.isEdit(true);
    };
    self.finishEditSiwClaimAttendance = function(siwClaimAttendance){
        SaveSiwClaimAttendance(siwClaimAttendance);
    };
    self.cancelEditSiwClaimAttendance = function(siwClaimAttendance){
        ResetSiwClaimAttendance(siwClaimAttendance);
        siwClaimAttendance.isEdit(false);
    };
    self.removeSiwClaimAttendance = function(siwClaimAttendance){
        DeleteSiwClaimAttendance(siwClaimAttendance);
    };
    self.goBackToHome = function(){
        window.location.href = self.getUrl.gotoMaster;
    };
    function InitSiwClaimAttendance()
    {
        self.processing().setProcessing("SiwClaimAttendance", true);
        if(self.arrSearchParam().length > 0) //get a Siw Claim Attendance searh param
        {
           var postParam = CollectGetParams();
            var json = JSON.stringify(postParam);
            CallAPI(
                self.getUrl.getParam,
                json,
                "POST",
                FinishInitSiwClaimAttendance,
                CallAPIFail
            );
        }
        else
        {
            if(self.siwClaimAttendanceID() != null && self.siwClaimAttendanceID() != 0)  //get a Siw Claim Attendance by SiwClaimAttendanceID
            {
                CallAPI(
                    self.getUrl.getSiwClaimAttendance + "?id=" + self.siwClaimAttendanceID(),
                    null,
                    "GET",
                    FinishInitSiwClaimAttendance,
                    CallAPIFail
                );
            }
            else
            { //init new SiwClaimAttendance
                CallAPI(
                    self.getUrl.getInit,
                    null,
                    "GET",
                    FinishInitNewSiwClaimAttendance,
                    CallAPIFail
                );
            }
        }
    }
    function FinishInitSiwClaimAttendance(data)
    {
        if(data.result == "Success")
        {
            self.siwClaimAttendance(self.convertDataToSiwClaimAttendance(data.siwClaimAttendance));
        }
        if(self.ffInit() != null) self.ffInit()();
        self.processing().setProcessing("SiwClaimAttendance", false);
    }
    function FinishInitNewSiwClaimAttendance(data)
    {
        if(data.result == "Success")
        {
            var item = self.convertDataToSiwClaimAttendance(data.siwClaimAttendance);
            item.guid(data.siwClaimAttendance.guid);
            self.siwClaimAttendance(item);
            self.siwClaimAttendance().allowEdit(true);
            self.siwClaimAttendance().allowRemove(true);
            self.siwClaimAttendance().oldValue(ko.toJS(self.siwClaimAttendance()));
            self.siwClaimAttendance().isEdit(true);
        }
        if(self.ffInit() != null) self.ffInit()();
        self.processing().setProcessing("SiwClaimAttendance", false);
    }
    function SaveSiwClaimAttendance(item){
        if(ValidateSiwClaimAttendance(item)){
            self.processing().setProcessing("SiwClaimAttendance",true);
            var json = JSON.stringify(ConvertSiwClaimAttendanceToPostObject(item));
            CallAPI(
                self.getUrl.saveSiwClaimAttendance,
                json,
                "POST",
                FinishSaveSiwClaimAttendance,
                CallAPIFail
            );
        }
    } 
    function ValidateSiwClaimAttendance(item){
        return true;
    }
    function FinishSaveSiwClaimAttendance(data){
        if(data.result == "Success"){
            self.siwClaimAttendance(self.convertDataToSiwClaimAttendance(data.siwClaimAttendance));
            self.siwClaimAttendanceID(data.siwClaimAttendance.siwClaimAttendanceID);
            self.siwClaimAttendance().isEdit(false);
        }else{
             swal("", Language.SaveResultFailMessage, "warning");
        }
        if(self.ffSave() != null) self.ffSave()();
        self.processing().setProcessing("SiwClaimAttendance",false);
    }
    function DeleteSiwClaimAttendance(siwClaimAttendance){
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
                    if(siwClaimAttendance != null) {
                        self.processing().setProcessing("SiwClaimAttendance", true);
                        CallAPI(
                            self.getUrl.removeSiwClaimAttendance,
                            { id: self.siwClaimAttendance().siwClaimAttendanceID() },
                            "DELETE",
                            function (data) {
                                self.processing().setProcessing("SiwClaimAttendance", false);
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
