var SiwEmailSubscribesViewModel = function () {
    var self = this;
    self.getUrl = {     
       getInit      : "/SiwEmailSubscribe/GetInit",
       getSiwEmailSubscribes        : "/SiwEmailSubscribe/GetAll",
       saveSiwEmailSubscribe        : "/SiwEmailSubscribe/Save",
       removeSiwEmailSubscribe      : "/SiwEmailSubscribe/Remove",
       saveListSiwEmailSubscribe      : "/SiwEmailSubscribe/SaveList",
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
    self.arrSSiwEmailSubscribe = ko.observableArray([]);
    self.arrSiwEmailSubscribe = ko.observableArray([]);
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
       InitSiwEmailSubscribes();
    };
    self.initLocalData = function (data) {
        var arrItem = ko.utils.arrayMap(data, function (item) {
            return self.convertDataToSiwEmailSubscribe(item);
        });
        self.arrSiwEmailSubscribe.removeAll();
        self.arrSiwEmailSubscribe(arrItem);
        if(self.ffInit() != null) self.ffInit()();
    };
    //--------------- For Searching -----------------------------//
    self.searchSiwEmailSubscribes = function(){
        InitSiwEmailSubscribes();
    };
    //--------------- For Item -----------------------------//
    //--------------- Model Event ----------//
    self.startAddSiwEmailSubscribe = function(){
        self.processing().setProcessing("SiwEmailSubscribes",true);
         CallAPI(self.getUrl.getInit, {}, "GET", FinishInitNewSiwEmailSubscribe,CallAPIFail);
    };
    self.startEditSiwEmailSubscribe = function(item){
        item.oldValue(ko.toJS(item));
        item.isEdit(true);
        if(item.siwEmailSubscribeID() != 0)
        {
            item.editMode("Edit");
        }
        else
        {
            item.editMode("New");
        }
    };
    self.finishEditSiwEmailSubscribe = function(item){
        SaveSiwEmailSubscribe(item);
    };
    self.cancelEditSiwEmailSubscribe = function(item){
        if(item.siwEmailSubscribeID()==null||item.siwEmailSubscribeID()==0){
            self.arrSiwEmailSubscribe.remove(item);
        }else{
            ResetSiwEmailSubscribe(item);
            item.isEdit(false);
        }
    };
    self.removeSiwEmailSubscribe = function(item){
        DeleteSiwEmailSubscribe(item);
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
        InitSiwEmailSubscribes();
    };
    //--------------- Action Function ----------//
    function FinishInitNewSiwEmailSubscribe(data){
        if(data.result =="Success"){
            var item = self.convertDataToSiwEmailSubscribe(data.siwEmailSubscribe);
            item.guid(data.siwEmailSubscribe.guid);
            item.oldValue(ko.toJS(item));
            item.isEdit(true);
            self.arrSiwEmailSubscribe.unshift(item);
        }
        self.processing().setProcessing("SiwEmailSubscribes",false);
    }
    function InitSiwEmailSubscribes(){
        self.processing().setProcessing("SiwEmailSubscribes",true);
        var postParam = CollectGetParams();
        var json = JSON.stringify(postParam);
        CallAPI(
           self.getUrl.getSiwEmailSubscribes,
           json,
           "POST",
           FinishInitSiwEmailSubscribes,
           CallAPIFail
      );
    }
    function FinishInitSiwEmailSubscribes(data){
        if(data.result == "Success"){
           var arrItem = ko.utils.arrayMap(data.siwEmailSubscribes,function(item){
               return self.convertDataToSiwEmailSubscribe(item);
           });
           self.arrSiwEmailSubscribe.removeAll();
           self.arrSiwEmailSubscribe(arrItem);
        }
        //function run after init data
        if(self.ffInit() != null) self.ffInit()();
        self.processing().setProcessing("SiwEmailSubscribes",false);
    }
    function SaveSiwEmailSubscribe(item){
        if(ValidateSiwEmailSubscribe(item)){
            self.processing().setProcessing("SiwEmailSubscribes",true);
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
    function FinishSaveSiwEmailSubscribe(data){
        if(data.result == "Success"){
            var item;
            if(data.siwEmailSubscribeID != null&&data.siwEmailSubscribeID != 0)
            {
                item = ko.utils.arrayFirst(self.arrSiwEmailSubscribe(),function(item1){
                           return item1.siwEmailSubscribeID() == data.siwEmailSubscribeID;
                       });
            }else
            {
                item = ko.utils.arrayFirst(self.arrSiwEmailSubscribe(),function(item1){
                           return item1.guid() == data.guid;
                       });
            }
            if(item!=null)
            {
                item.siwEmailSubscribeID(data.siwEmailSubscribe.siwEmailSubscribeID);
                item.isEdit(false);
            }
        }
        self.processing().setProcessing("SiwEmailSubscribes",false);
        if(self.ffSave()!=null)
        {
            self.ffSave()();
        }
    }
    function DeleteSiwEmailSubscribe(item)
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
                  if(item.siwEmailSubscribeID() == null || item.siwEmailSubscribeID() == 0)
                  {
                     self.arrSiwEmailSubscribe.remove(item);
                 }
                 else
                 {
                      self.processing().setProcessing("SiwEmailSubscribes", true);
                      CallAPI(
                         self.getUrl.removeSiwEmailSubscribe + "?id=" + item.siwEmailSubscribeID(),
                         null,
                         "DELETE",
                         FinishDeleteSiwEmailSubscribe,
                         CallAPIFail
                     );
                }
            }
        }
    });
    }
    function FinishDeleteSiwEmailSubscribe(data)
    {
        if(data.result == "Success")
        {
            self.arrSiwEmailSubscribe.remove(function(item) { return item.siwEmailSubscribeID() == data.siwEmailSubscribeID; });
        }
        else
        {
            swal("", Language.DeleteResultFailMessage, "warning");
       }
        self.processing().setProcessing("SiwEmailSubscribes", false);
       if(self.ffDelete() != null) self.ffDelete()();
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
    function ValidateSiwEmailSubscribe(item){
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
     self.startAddListSiwEmailSubscribe = function(){
         self.processing().setProcessing("SiwEmailSubscribes",true);
         CallAPI(self.getUrl.getInit, null,"GET", FinishInitListNewSiwEmailSubscribe);
     };
     self.startEditListSiwEmailSubscribe = function(item){
        item.oldValue(ko.toJS(item));
        item.isEdit(true);
        if(item.siwEmailSubscribeID()>0){
            item.editMode("Edit");
        }
    };
    self.finishEditListSiwEmailSubscribe = function(item){
        if(ValidateSiwEmailSubscribe(item)){
           item.isEdit(false);
        }
    };
    self.cancelEditListSiwEmailSubscribe = function(item){
        if(item.editMode()=="Delete"){ item.editMode("");}
        ResetSiwEmailSubscribe(item);
        item.isEdit(false);
    };
    self.removeListSiwEmailSubscribe = function(item){
        if(item.siwEmailSubscribeID()==null||item.siwEmailSubscribeID()==0){
           self.arrSiwEmailSubscribe.remove(item);
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
    function FinishInitListNewSiwEmailSubscribe(data){
       if(data.result =="Success"){
          var item = self.convertDataToSiwEmailSubscribe(data.siwEmailSubscribe);
          item.editMode("New");
          item.oldValue(ko.toJS(item));
          item.isEdit(true);
          self.arrSiwEmailSubscribe.push(item);
       }
       self.processing().setProcessing("SiwEmailSubscribes",false);
    }
    self.saveAllSiwEmailSubscribe = function(){
        SaveListSiwEmailSubscribe();
    };
    function CallAPIFail(jqXHR, textStatus, errorThrown)
    {
        // If fail
        self.processing().setProcessing("SiwEmailSubscribes", false);
        swal(Language.CallAPIFailMessage, "", "warning");
    }
    function SaveListSiwEmailSubscribe() {
        var postArray = new Array();
        var isOK = true;
        var nexitem = self.arrSSiwEmailSubscribe().length;
        var numsave = self.numItemSave();
        for (var i = nexitem; i < self.arrSiwEmailSubscribe().length&&numsave>0; i++) {
            var item = self.arrSiwEmailSubscribe()[i];
            if(item.editMode() != "Delete") {
                isOK = isOK && ValidateSiwEmailSubscribe(item);
                if(isOK) {
                    postArray.push(ko.toJS(item));
                }
            }
            else {
                postArray.push(ko.toJS(item));
            }
            self.arrSSiwEmailSubscribe.push(item);
            numsave--;
        }
        if(postArray.length>0) {
            self.processing().setProcessing("SiwEmailSubscribes", true);
            var json = JSON.stringify(postArray);
            CallAPI(
               self.getUrl.saveListSiwEmailSubscribe,
                 json,
                "POST",
                FinishSaveListSiwEmailSubscribe,
                CallAPIFail
            );
        }
    }
    function FinishSaveListSiwEmailSubscribe(data) {
        if(data.result == "Success") {
            ko.utils.arrayForEach(self.arrSSiwEmailSubscribe(), function (item) {
                if(item.siwEmailSubscribeID() == null||item.siwEmailSubscribeID() == 0) {
                    var dataItem = ko.utils.arrayFirst(data.siwEmailSubscribes, function (item1) {
                        return item1.guid == item.guid();
                    });
                    if(dataItem != null) {
                        item.siwEmailSubscribeID(dataItem.siwEmailSubscribeID);
                    }
                }
                if(item.editMode() != "Delete") {
                    item.editMode("");
                }
                item.isEdit(false);
            });
        }
        if(self.arrSiwEmailSubscribe().length == self.arrSSiwEmailSubscribe().length) {
            self.processing().setProcessing("SiwEmailSubscribes", false);
            self.arrSSiwEmailSubscribe.removeAll();
            self.arrSiwEmailSubscribe.remove(function(item){ return item.editMode()=="Delete";});
            if(self.ffSaveAll() != null) {
                self.ffSaveAll()();
            }
        } else {
            SaveListSiwEmailSubscribe();
        }
    }
     //--------------- End Action Function ----------//
     //--------------- End For item -----------------------------//
};
