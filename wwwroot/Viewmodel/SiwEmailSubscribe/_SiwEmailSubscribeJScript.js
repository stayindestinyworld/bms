        var SiwEmailSubscribe = function (
                     siwemailsubscribeid,
                     email,
                     code,
                     status
                     //end table database field
                         ) {
            var self = this;
            self.siwEmailSubscribeID = ko.observable(siwemailsubscribeid);
            self.email = ko.observable(email);
            self.code = ko.observable(code);
            self.status = ko.observable(status);
            //end table database field
            self.guid = ko.observable('');
            self.editMode = ko.observable('');
            self.isEdit = ko.observable(false);
            self.isSelected = ko.observable(false);
            self.allowEdit = ko.observable(true);
            self.allowRemove = ko.observable(true);
            self.oldValue = ko.observable({});
            self.valManager = ko.observable(new ValidationManager());
            
          };
