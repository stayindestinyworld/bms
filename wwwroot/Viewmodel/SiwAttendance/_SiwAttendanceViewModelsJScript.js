var SiwAttendancesViewModel = function () {
    var self = this;
    self.getUrl = {     
       getInit      : "/SiwAttendance/GetInit",
       getSiwAttendances        : "/SiwAttendance/GetAll",
       saveSiwAttendance        : "/SiwAttendance/Save",
       removeSiwAttendance      : "/SiwAttendance/Remove",
       saveListSiwAttendance      : "/SiwAttendance/SaveList",
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
    self.arrSSiwAttendance = ko.observableArray([]);
    self.arrSiwAttendance = ko.observableArray([]);
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
       InitSiwAttendances();
    };
    self.initLocalData = function (data) {
        var arrItem = ko.utils.arrayMap(data, function (item) {
            return self.convertDataToSiwAttendance(item);
        });
        self.arrSiwAttendance.removeAll();
        self.arrSiwAttendance(arrItem);
        if(self.ffInit() != null) self.ffInit()();
    };
    //--------------- For Searching -----------------------------//
    self.searchSiwAttendances = function(){
        InitSiwAttendances();
    };
    //--------------- For Item -----------------------------//
    //--------------- Model Event ----------//
    self.startAddSiwAttendance = function(){
        self.processing().setProcessing("SiwAttendances",true);
         CallAPI(self.getUrl.getInit, {}, "GET", FinishInitNewSiwAttendance,CallAPIFail);
    };
    self.startEditSiwAttendance = function(item){
        item.oldValue(ko.toJS(item));
        item.isEdit(true);
        if(item.siwAttendanceID() != 0)
        {
            item.editMode("Edit");
        }
        else
        {
            item.editMode("New");
        }
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
    }
    function InitSiwAttendances(){
        self.processing().setProcessing("SiwAttendances",true);
        var postParam = CollectGetParams();
        var json = JSON.stringify(postParam);
        CallAPI(
           self.getUrl.getSiwAttendances,
           json,
           "POST",
           FinishInitSiwAttendances,
           CallAPIFail
      );
    }
    function FinishInitSiwAttendances(data){
        if(data.result == "Success"){
           var arrItem = ko.utils.arrayMap(data.siwAttendances,function(item){
               return self.convertDataToSiwAttendance(item);
           });
           self.arrSiwAttendance.removeAll();
           self.arrSiwAttendance(arrItem);
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
                 CallAPIFail
             );
        }
    } 
    function FinishSaveSiwAttendance(data){
        if(data.result == "Success"){
            var item;
            if(data.siwAttendanceID != null&&data.siwAttendanceID != 0)
            {
                item = ko.utils.arrayFirst(self.arrSiwAttendance(),function(item1){
                           return item1.siwAttendanceID() == data.siwAttendanceID;
                       });
            }else
            {
                item = ko.utils.arrayFirst(self.arrSiwAttendance(),function(item1){
                           return item1.guid() == data.guid;
                       });
            }
            if(item!=null)
            {
                item.siwAttendanceID(data.siwAttendance.siwAttendanceID);
                item.isEdit(false);
            }
        }
        self.processing().setProcessing("SiwAttendances",false);
        if(self.ffSave()!=null)
        {
            self.ffSave()();
        }
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
    function FinishDeleteSiwAttendance(data)
    {
        if(data.result == "Success")
        {
            self.arrSiwAttendance.remove(function(item) { return item.siwAttendanceID() == data.siwAttendanceID; });
        }
        else
        {
            swal("", Language.DeleteResultFailMessage, "warning");
       }
        self.processing().setProcessing("SiwAttendances", false);
       if(self.ffDelete() != null) self.ffDelete()();
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
               postObject.timeAttendanceS = parseDateToSaveString(item.timeAttendance(),DateTimeFormat.DateMomentConvertFormat);
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
    function ValidateSiwAttendance(item){
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
     self.startAddListSiwAttendance = function(){
         self.processing().setProcessing("SiwAttendances",true);
         CallAPI(self.getUrl.getInit, null,"GET", FinishInitListNewSiwAttendance);
     };
     self.startEditListSiwAttendance = function(item){
        item.oldValue(ko.toJS(item));
        item.isEdit(true);
        if(item.siwAttendanceID()>0){
            item.editMode("Edit");
        }
    };
    self.finishEditListSiwAttendance = function(item){
        if(ValidateSiwAttendance(item)){
           item.isEdit(false);
        }
    };
    self.cancelEditListSiwAttendance = function(item){
        if(item.editMode()=="Delete"){ item.editMode("");}
        ResetSiwAttendance(item);
        item.isEdit(false);
    };
    self.removeListSiwAttendance = function(item){
        if(item.siwAttendanceID()==null||item.siwAttendanceID()==0){
           self.arrSiwAttendance.remove(item);
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
    function FinishInitListNewSiwAttendance(data){
       if(data.result =="Success"){
          var item = self.convertDataToSiwAttendance(data.siwAttendance);
          item.editMode("New");
          item.oldValue(ko.toJS(item));
          item.isEdit(true);
          self.arrSiwAttendance.push(item);
       }
       self.processing().setProcessing("SiwAttendances",false);
    }
    self.saveAllSiwAttendance = function(){
        SaveListSiwAttendance();
    };
    function CallAPIFail(jqXHR, textStatus, errorThrown)
    {
        // If fail
        self.processing().setProcessing("SiwAttendances", false);
        swal(Language.CallAPIFailMessage, "", "warning");
    }
    function SaveListSiwAttendance() {
        var postArray = new Array();
        var isOK = true;
        var nexitem = self.arrSSiwAttendance().length;
        var numsave = self.numItemSave();
        for (var i = nexitem; i < self.arrSiwAttendance().length&&numsave>0; i++) {
            var item = self.arrSiwAttendance()[i];
            if(item.editMode() != "Delete") {
                isOK = isOK && ValidateSiwAttendance(item);
                if(isOK) {
                    postArray.push(ko.toJS(item));
                }
            }
            else {
                postArray.push(ko.toJS(item));
            }
            self.arrSSiwAttendance.push(item);
            numsave--;
        }
        if(postArray.length>0) {
            self.processing().setProcessing("SiwAttendances", true);
            var json = JSON.stringify(postArray);
            CallAPI(
               self.getUrl.saveListSiwAttendance,
                 json,
                "POST",
                FinishSaveListSiwAttendance,
                CallAPIFail
            );
        }
    }
    function FinishSaveListSiwAttendance(data) {
        if(data.result == "Success") {
            ko.utils.arrayForEach(self.arrSSiwAttendance(), function (item) {
                if(item.siwAttendanceID() == null||item.siwAttendanceID() == 0) {
                    var dataItem = ko.utils.arrayFirst(data.siwAttendances, function (item1) {
                        return item1.guid == item.guid();
                    });
                    if(dataItem != null) {
                        item.siwAttendanceID(dataItem.siwAttendanceID);
                    }
                }
                if(item.editMode() != "Delete") {
                    item.editMode("");
                }
                item.isEdit(false);
            });
        }
        if(self.arrSiwAttendance().length == self.arrSSiwAttendance().length) {
            self.processing().setProcessing("SiwAttendances", false);
            self.arrSSiwAttendance.removeAll();
            self.arrSiwAttendance.remove(function(item){ return item.editMode()=="Delete";});
            if(self.ffSaveAll() != null) {
                self.ffSaveAll()();
            }
        } else {
            SaveListSiwAttendance();
        }
    }
     //--------------- End Action Function ----------//
     //--------------- End For item -----------------------------//
};
