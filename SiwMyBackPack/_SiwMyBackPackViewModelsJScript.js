var SiwMyBackPacksViewModel = function () {
    var self = this;
    self.getUrl = {     
       getInit      : "/SiwMyBackPack/GetInit",
       getSiwMyBackPacks        : "/SiwMyBackPack/GetAll",
       saveSiwMyBackPack        : "/SiwMyBackPack/Save",
       removeSiwMyBackPack      : "/SiwMyBackPack/Remove",
       saveListSiwMyBackPack      : "/SiwMyBackPack/SaveList",
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
    self.arrSSiwMyBackPack = ko.observableArray([]);
    self.arrSiwMyBackPack = ko.observableArray([]);
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
       InitSiwMyBackPacks();
    };
    self.initLocalData = function (data) {
        var arrItem = ko.utils.arrayMap(data, function (item) {
            return self.convertDataToSiwMyBackPack(item);
        });
        self.arrSiwMyBackPack.removeAll();
        self.arrSiwMyBackPack(arrItem);
        if(self.ffInit() != null) self.ffInit()();
    };
    //--------------- For Searching -----------------------------//
    self.searchSiwMyBackPacks = function(){
        InitSiwMyBackPacks();
    };
    //--------------- For Item -----------------------------//
    //--------------- Model Event ----------//
    self.startAddSiwMyBackPack = function(){
        self.processing().setProcessing("SiwMyBackPacks",true);
         CallAPI(self.getUrl.getInit, {}, "GET", FinishInitNewSiwMyBackPack,CallAPIFail);
    };
    self.startEditSiwMyBackPack = function(item){
        item.oldValue(ko.toJS(item));
        item.isEdit(true);
        if(item.siwMyBackPackID() != 0)
        {
            item.editMode("Edit");
        }
        else
        {
            item.editMode("New");
        }
    };
    self.finishEditSiwMyBackPack = function(item){
        SaveSiwMyBackPack(item);
    };
    self.cancelEditSiwMyBackPack = function(item){
        if(item.siwMyBackPackID()==null||item.siwMyBackPackID()==0){
            self.arrSiwMyBackPack.remove(item);
        }else{
            ResetSiwMyBackPack(item);
            item.isEdit(false);
        }
    };
    self.removeSiwMyBackPack = function(item){
        DeleteSiwMyBackPack(item);
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
        InitSiwMyBackPacks();
    };
    //--------------- Action Function ----------//
    function FinishInitNewSiwMyBackPack(data){
        if(data.result =="Success"){
            var item = self.convertDataToSiwMyBackPack(data.siwMyBackPack);
            item.guid(data.siwMyBackPack.guid);
            item.oldValue(ko.toJS(item));
            item.isEdit(true);
            self.arrSiwMyBackPack.unshift(item);
        }
        self.processing().setProcessing("SiwMyBackPacks",false);
    }
    function InitSiwMyBackPacks(){
        self.processing().setProcessing("SiwMyBackPacks",true);
        var postParam = CollectGetParams();
        var json = JSON.stringify(postParam);
        CallAPI(
           self.getUrl.getSiwMyBackPacks,
           json,
           "POST",
           FinishInitSiwMyBackPacks,
           CallAPIFail
      );
    }
    function FinishInitSiwMyBackPacks(data){
        if(data.result == "Success"){
           var arrItem = ko.utils.arrayMap(data.siwMyBackPacks,function(item){
               return self.convertDataToSiwMyBackPack(item);
           });
           self.arrSiwMyBackPack.removeAll();
           self.arrSiwMyBackPack(arrItem);
        }
        //function run after init data
        if(self.ffInit() != null) self.ffInit()();
        self.processing().setProcessing("SiwMyBackPacks",false);
    }
    function SaveSiwMyBackPack(item){
        if(ValidateSiwMyBackPack(item)){
            self.processing().setProcessing("SiwMyBackPacks",true);
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
    function FinishSaveSiwMyBackPack(data){
        if(data.result == "Success"){
            var item;
            if(data.siwMyBackPackID != null&&data.siwMyBackPackID != 0)
            {
                item = ko.utils.arrayFirst(self.arrSiwMyBackPack(),function(item1){
                           return item1.siwMyBackPackID() == data.siwMyBackPackID;
                       });
            }else
            {
                item = ko.utils.arrayFirst(self.arrSiwMyBackPack(),function(item1){
                           return item1.guid() == data.guid;
                       });
            }
            if(item!=null)
            {
                item.siwMyBackPackID(data.siwMyBackPack.siwMyBackPackID);
                item.isEdit(false);
            }
        }
        self.processing().setProcessing("SiwMyBackPacks",false);
        if(self.ffSave()!=null)
        {
            self.ffSave()();
        }
    }
    function DeleteSiwMyBackPack(item)
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
                  if(item.siwMyBackPackID() == null || item.siwMyBackPackID() == 0)
                  {
                     self.arrSiwMyBackPack.remove(item);
                 }
                 else
                 {
                      self.processing().setProcessing("SiwMyBackPacks", true);
                      CallAPI(
                         self.getUrl.removeSiwMyBackPack + "?id=" + item.siwMyBackPackID(),
                         null,
                         "DELETE",
                         FinishDeleteSiwMyBackPack,
                         CallAPIFail
                     );
                }
            }
        }
    });
    }
    function FinishDeleteSiwMyBackPack(data)
    {
        if(data.result == "Success")
        {
            self.arrSiwMyBackPack.remove(function(item) { return item.siwMyBackPackID() == data.siwMyBackPackID; });
        }
        else
        {
            swal("", Language.DeleteResultFailMessage, "warning");
       }
        self.processing().setProcessing("SiwMyBackPacks", false);
       if(self.ffDelete() != null) self.ffDelete()();
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
    function ValidateSiwMyBackPack(item){
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
     self.startAddListSiwMyBackPack = function(){
         self.processing().setProcessing("SiwMyBackPacks",true);
         CallAPI(self.getUrl.getInit, null,"GET", FinishInitListNewSiwMyBackPack);
     };
     self.startEditListSiwMyBackPack = function(item){
        item.oldValue(ko.toJS(item));
        item.isEdit(true);
        if(item.siwMyBackPackID()>0){
            item.editMode("Edit");
        }
    };
    self.finishEditListSiwMyBackPack = function(item){
        if(ValidateSiwMyBackPack(item)){
           item.isEdit(false);
        }
    };
    self.cancelEditListSiwMyBackPack = function(item){
        if(item.editMode()=="Delete"){ item.editMode("");}
        ResetSiwMyBackPack(item);
        item.isEdit(false);
    };
    self.removeListSiwMyBackPack = function(item){
        if(item.siwMyBackPackID()==null||item.siwMyBackPackID()==0){
           self.arrSiwMyBackPack.remove(item);
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
    function FinishInitListNewSiwMyBackPack(data){
       if(data.result =="Success"){
          var item = self.convertDataToSiwMyBackPack(data.siwMyBackPack);
          item.editMode("New");
          item.oldValue(ko.toJS(item));
          item.isEdit(true);
          self.arrSiwMyBackPack.push(item);
       }
       self.processing().setProcessing("SiwMyBackPacks",false);
    }
    self.saveAllSiwMyBackPack = function(){
        SaveListSiwMyBackPack();
    };
    function CallAPIFail(jqXHR, textStatus, errorThrown)
    {
        // If fail
        self.processing().setProcessing("SiwMyBackPacks", false);
        swal(Language.CallAPIFailMessage, "", "warning");
    }
    function SaveListSiwMyBackPack() {
        var postArray = new Array();
        var isOK = true;
        var nexitem = self.arrSSiwMyBackPack().length;
        var numsave = self.numItemSave();
        for (var i = nexitem; i < self.arrSiwMyBackPack().length&&numsave>0; i++) {
            var item = self.arrSiwMyBackPack()[i];
            if(item.editMode() != "Delete") {
                isOK = isOK && ValidateSiwMyBackPack(item);
                if(isOK) {
                    postArray.push(ko.toJS(item));
                }
            }
            else {
                postArray.push(ko.toJS(item));
            }
            self.arrSSiwMyBackPack.push(item);
            numsave--;
        }
        if(postArray.length>0) {
            self.processing().setProcessing("SiwMyBackPacks", true);
            var json = JSON.stringify(postArray);
            CallAPI(
               self.getUrl.saveListSiwMyBackPack,
                 json,
                "POST",
                FinishSaveListSiwMyBackPack,
                CallAPIFail
            );
        }
    }
    function FinishSaveListSiwMyBackPack(data) {
        if(data.result == "Success") {
            ko.utils.arrayForEach(self.arrSSiwMyBackPack(), function (item) {
                if(item.siwMyBackPackID() == null||item.siwMyBackPackID() == 0) {
                    var dataItem = ko.utils.arrayFirst(data.siwMyBackPacks, function (item1) {
                        return item1.guid == item.guid();
                    });
                    if(dataItem != null) {
                        item.siwMyBackPackID(dataItem.siwMyBackPackID);
                    }
                }
                if(item.editMode() != "Delete") {
                    item.editMode("");
                }
                item.isEdit(false);
            });
        }
        if(self.arrSiwMyBackPack().length == self.arrSSiwMyBackPack().length) {
            self.processing().setProcessing("SiwMyBackPacks", false);
            self.arrSSiwMyBackPack.removeAll();
            self.arrSiwMyBackPack.remove(function(item){ return item.editMode()=="Delete";});
            if(self.ffSaveAll() != null) {
                self.ffSaveAll()();
            }
        } else {
            SaveListSiwMyBackPack();
        }
    }
     //--------------- End Action Function ----------//
     //--------------- End For item -----------------------------//
};
