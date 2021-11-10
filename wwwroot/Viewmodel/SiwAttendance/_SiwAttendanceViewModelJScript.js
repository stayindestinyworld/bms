var SiwAttendanceViewModel = function(){
    var self = this;
    self.getUrl = {
        getSiwAttendance : "/SiwAttendance/Get",
        saveSiwAttendance   : "/SiwAttendance/Save",
        removeSiwAttendance : "/SiwAttendance/Remove",
        gotoMaster       : "vi-VN/SiwAttendance/Admin",
        getInit : "/SiwAttendance/GetInit",
        getParam : "/SiwAttendance/GetOne",
    };
    self.siwAttendanceID = ko.observable(null);
    self.siwAttendance = ko.observable(null);
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
    self.setSiwAttendanceID = function(id){
        self.siwAttendanceID(id);
    };
    self.initData =function(){
        InitSiwAttendance();
    };
    self.initLocalData = function (data) {
        self.siwAttendance(self.convertDataToSiwAttendance(data));
        if (self.ffInit() != null) self.ffInit()(data);
    };
    self.startEditSiwAttendance = function(siwAttendance){
        siwAttendance.oldValue(ko.toJS(siwAttendance));
        siwAttendance.isEdit(true);
    };
    self.finishEditSiwAttendance = function(siwAttendance){
        SaveSiwAttendance(siwAttendance);
    };
    self.cancelEditSiwAttendance = function(siwAttendance){
        ResetSiwAttendance(siwAttendance);
        siwAttendance.isEdit(false);
    };
    self.removeSiwAttendance = function(siwAttendance){
        DeleteSiwAttendance(siwAttendance);
    };
    self.goBackToHome = function(){
        window.location.href = self.getUrl.gotoMaster;
    };
    function InitSiwAttendance()
    {
        self.processing().setProcessing("SiwAttendance", true);
        if(self.arrSearchParam().length > 0) //get a Siw Attendance searh param
        {
           var postParam = CollectGetParams();
            var json = JSON.stringify(postParam);
            CallAPI(
                self.getUrl.getParam,
                json,
                "POST",
                FinishInitSiwAttendance,
                CallAPIFail
            );
        }
        else
        {
            if(self.siwAttendanceID() != null && self.siwAttendanceID() != 0)  //get a Siw Attendance by SiwAttendanceID
            {
                CallAPI(
                    self.getUrl.getSiwAttendance + "?id=" + self.siwAttendanceID(),
                    null,
                    "GET",
                    FinishInitSiwAttendance,
                    CallAPIFail
                );
            }
            else
            { //init new SiwAttendance
                CallAPI(
                    self.getUrl.getInit,
                    null,
                    "GET",
                    FinishInitNewSiwAttendance,
                    CallAPIFail
                );
            }
        }
    }
    function FinishInitSiwAttendance(data)
    {
        if(data.result == "Success")
        {
            self.siwAttendance(self.convertDataToSiwAttendance(data.siwAttendance));
        }
        if (self.ffInit() != null) self.ffInit()(data);
        self.processing().setProcessing("SiwAttendance", false);
    }
    function FinishInitNewSiwAttendance(data)
    {
        if(data.result == "Success")
        {
            var item = self.convertDataToSiwAttendance(data.siwAttendance);
            item.guid(data.siwAttendance.guid);
            self.siwAttendance(item);
            self.siwAttendance().allowEdit(true);
            self.siwAttendance().allowRemove(true);
            self.siwAttendance().oldValue(ko.toJS(self.siwAttendance()));
            self.siwAttendance().isEdit(true);
        }
        if(self.ffInit() != null) self.ffInit()();
        self.processing().setProcessing("SiwAttendance", false);
    }
    function SaveSiwAttendance(item){
        if(ValidateSiwAttendance(item)){
            self.processing().setProcessing("SiwAttendance",true);
            var json = JSON.stringify(ConvertSiwAttendanceToPostObject(item));
            CallAPI(
                self.getUrl.saveSiwAttendance,
                json,
                "POST",
                FinishSaveSiwAttendance,
                CallAPIFail
            );
        }
    } 
    function ValidateSiwAttendance(item){
        return true;
    }
    function FinishSaveSiwAttendance(data){
        if(data.result == "Success"){
            self.siwAttendance(self.convertDataToSiwAttendance(data.siwAttendance));
            self.siwAttendanceID(data.siwAttendance.siwAttendanceID);
            self.siwAttendance().isEdit(false);
        }else{
             swal("", Language.SaveResultFailMessage, "warning");
        }
        if(self.ffSave() != null) self.ffSave()();
        self.processing().setProcessing("SiwAttendance",false);
    }
    function DeleteSiwAttendance(siwAttendance){
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
                    if(siwAttendance != null) {
                        self.processing().setProcessing("SiwAttendance", true);
                        CallAPI(
                            self.getUrl.removeSiwAttendance,
                            { id: self.siwAttendance().siwAttendanceID() },
                            "DELETE",
                            function (data) {
                                self.processing().setProcessing("SiwAttendance", false);
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
                          //timeAttendance:item.timeAttendance(),
                          twitter:item.twitter(),
                          linkRetweet:item.linkRetweet(),
                          shortWallet:item.shortWallet(),
                          //end table database field
                          guid:item.guid()
                         };
           //update datetime format                
           //if(item.timeAttendance()!==null)
           //{
           //    postObject.timeAttendanceS = parseDateToSaveString(item.timeAttendance(),DateTimeFormat.DateTimeToAPIString);
           //}
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
