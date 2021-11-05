var SiwUsersViewModel = function () {
    var self = this;
    self.getUrl = {     
       getInit      : "/SiwUser/GetInit",
       getSiwUsers        : "/SiwUser/GetAll",
       saveSiwUser        : "/SiwUser/Save",
       removeSiwUser      : "/SiwUser/Remove",
       saveListSiwUser      : "/SiwUser/SaveList",
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
    self.arrSSiwUser = ko.observableArray([]);
    self.arrSiwUser = ko.observableArray([]);
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
       InitSiwUsers();
    };
    self.initLocalData = function (data) {
        var arrItem = ko.utils.arrayMap(data, function (item) {
            return self.convertDataToSiwUser(item);
        });
        self.arrSiwUser.removeAll();
        self.arrSiwUser(arrItem);
        if(self.ffInit() != null) self.ffInit()();
    };
    //--------------- For Searching -----------------------------//
    self.searchSiwUsers = function(){
        InitSiwUsers();
    };
    //--------------- For Item -----------------------------//
    //--------------- Model Event ----------//
    self.startAddSiwUser = function(){
        self.processing().setProcessing("SiwUsers",true);
         CallAPI(self.getUrl.getInit, {}, "GET", FinishInitNewSiwUser,CallAPIFail);
    };
    self.startEditSiwUser = function(item){
        item.oldValue(ko.toJS(item));
        item.isEdit(true);
        if(item.siwUserID() != 0)
        {
            item.editMode("Edit");
        }
        else
        {
            item.editMode("New");
        }
    };
    self.finishEditSiwUser = function(item){
        SaveSiwUser(item);
    };
    self.cancelEditSiwUser = function(item){
        if(item.siwUserID()==null||item.siwUserID()==0){
            self.arrSiwUser.remove(item);
        }else{
            ResetSiwUser(item);
            item.isEdit(false);
        }
    };
    self.removeSiwUser = function(item){
        DeleteSiwUser(item);
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
        InitSiwUsers();
    };
    //--------------- Action Function ----------//
    function FinishInitNewSiwUser(data){
        if(data.result =="Success"){
            var item = self.convertDataToSiwUser(data.siwUser);
            item.guid(data.siwUser.guid);
            item.oldValue(ko.toJS(item));
            item.isEdit(true);
            self.arrSiwUser.unshift(item);
        }
        self.processing().setProcessing("SiwUsers",false);
    }
    function InitSiwUsers(){
        self.processing().setProcessing("SiwUsers",true);
        var postParam = CollectGetParams();
        var json = JSON.stringify(postParam);
        CallAPI(
           self.getUrl.getSiwUsers,
           json,
           "POST",
           FinishInitSiwUsers,
           CallAPIFail
      );
    }
    function FinishInitSiwUsers(data){
        if(data.result == "Success"){
           var arrItem = ko.utils.arrayMap(data.siwUsers,function(item){
               return self.convertDataToSiwUser(item);
           });
           self.arrSiwUser.removeAll();
           self.arrSiwUser(arrItem);
        }
        //function run after init data
        if(self.ffInit() != null) self.ffInit()();
        self.processing().setProcessing("SiwUsers",false);
    }
    function SaveSiwUser(item){
        if(ValidateSiwUser(item)){
            self.processing().setProcessing("SiwUsers",true);
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
    function FinishSaveSiwUser(data){
        if(data.result == "Success"){
            var item;
            if(data.siwUserID != null&&data.siwUserID != 0)
            {
                item = ko.utils.arrayFirst(self.arrSiwUser(),function(item1){
                           return item1.siwUserID() == data.siwUserID;
                       });
            }else
            {
                item = ko.utils.arrayFirst(self.arrSiwUser(),function(item1){
                           return item1.guid() == data.guid;
                       });
            }
            if(item!=null)
            {
                item.siwUserID(data.siwUser.siwUserID);
                item.isEdit(false);
            }
        }
        self.processing().setProcessing("SiwUsers",false);
        if(self.ffSave()!=null)
        {
            self.ffSave()();
        }
    }
    function DeleteSiwUser(item)
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
                  if(item.siwUserID() == null || item.siwUserID() == 0)
                  {
                     self.arrSiwUser.remove(item);
                 }
                 else
                 {
                      self.processing().setProcessing("SiwUsers", true);
                      CallAPI(
                         self.getUrl.removeSiwUser + "?id=" + item.siwUserID(),
                         null,
                         "DELETE",
                         FinishDeleteSiwUser,
                         CallAPIFail
                     );
                }
            }
        }
    });
    }
    function FinishDeleteSiwUser(data)
    {
        if(data.result == "Success")
        {
            self.arrSiwUser.remove(function(item) { return item.siwUserID() == data.siwUserID; });
        }
        else
        {
            swal("", Language.DeleteResultFailMessage, "warning");
       }
        self.processing().setProcessing("SiwUsers", false);
       if(self.ffDelete() != null) self.ffDelete()();
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
    function ValidateSiwUser(item){
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
     self.startAddListSiwUser = function(){
         self.processing().setProcessing("SiwUsers",true);
         CallAPI(self.getUrl.getInit, null,"GET", FinishInitListNewSiwUser);
     };
     self.startEditListSiwUser = function(item){
        item.oldValue(ko.toJS(item));
        item.isEdit(true);
        if(item.siwUserID()>0){
            item.editMode("Edit");
        }
    };
    self.finishEditListSiwUser = function(item){
        if(ValidateSiwUser(item)){
           item.isEdit(false);
        }
    };
    self.cancelEditListSiwUser = function(item){
        if(item.editMode()=="Delete"){ item.editMode("");}
        ResetSiwUser(item);
        item.isEdit(false);
    };
    self.removeListSiwUser = function(item){
        if(item.siwUserID()==null||item.siwUserID()==0){
           self.arrSiwUser.remove(item);
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
    function FinishInitListNewSiwUser(data){
       if(data.result =="Success"){
          var item = self.convertDataToSiwUser(data.siwUser);
          item.editMode("New");
          item.oldValue(ko.toJS(item));
          item.isEdit(true);
          self.arrSiwUser.push(item);
       }
       self.processing().setProcessing("SiwUsers",false);
    }
    self.saveAllSiwUser = function(){
        SaveListSiwUser();
    };
    function CallAPIFail(jqXHR, textStatus, errorThrown)
    {
        // If fail
        self.processing().setProcessing("SiwUsers", false);
        swal(Language.CallAPIFailMessage, "", "warning");
    }
    function SaveListSiwUser() {
        var postArray = new Array();
        var isOK = true;
        var nexitem = self.arrSSiwUser().length;
        var numsave = self.numItemSave();
        for (var i = nexitem; i < self.arrSiwUser().length&&numsave>0; i++) {
            var item = self.arrSiwUser()[i];
            if(item.editMode() != "Delete") {
                isOK = isOK && ValidateSiwUser(item);
                if(isOK) {
                    postArray.push(ko.toJS(item));
                }
            }
            else {
                postArray.push(ko.toJS(item));
            }
            self.arrSSiwUser.push(item);
            numsave--;
        }
        if(postArray.length>0) {
            self.processing().setProcessing("SiwUsers", true);
            var json = JSON.stringify(postArray);
            CallAPI(
               self.getUrl.saveListSiwUser,
                 json,
                "POST",
                FinishSaveListSiwUser,
                CallAPIFail
            );
        }
    }
    function FinishSaveListSiwUser(data) {
        if(data.result == "Success") {
            ko.utils.arrayForEach(self.arrSSiwUser(), function (item) {
                if(item.siwUserID() == null||item.siwUserID() == 0) {
                    var dataItem = ko.utils.arrayFirst(data.siwUsers, function (item1) {
                        return item1.guid == item.guid();
                    });
                    if(dataItem != null) {
                        item.siwUserID(dataItem.siwUserID);
                    }
                }
                if(item.editMode() != "Delete") {
                    item.editMode("");
                }
                item.isEdit(false);
            });
        }
        if(self.arrSiwUser().length == self.arrSSiwUser().length) {
            self.processing().setProcessing("SiwUsers", false);
            self.arrSSiwUser.removeAll();
            self.arrSiwUser.remove(function(item){ return item.editMode()=="Delete";});
            if(self.ffSaveAll() != null) {
                self.ffSaveAll()();
            }
        } else {
            SaveListSiwUser();
        }
    }
     //--------------- End Action Function ----------//
     //--------------- End For item -----------------------------//
};
