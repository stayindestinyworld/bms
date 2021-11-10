        var SiwUser = function (
                     siwuserid,
                     walletid,
                     usercode,
                     status,
                     wallettokensiw,
                     fullname,
                     email,
                     twitter,
                     telegram,
                     molatoken,
                     shortwallet
                     //end table database field
                         ) {
            var self = this;
            self.siwUserID = ko.observable(siwuserid);
            self.walletID = ko.observable(walletid);
            self.userCode = ko.observable(usercode);
            self.status = ko.observable(status);
            self.walletTokenSiw = ko.observable(wallettokensiw);
            self.fullName = ko.observable(fullname);
            self.email = ko.observable(email);
            self.twitter = ko.observable(twitter);
            self.telegram = ko.observable(telegram);
            self.molaToken = ko.observable(molatoken);
            self.shortWallet = ko.observable(shortwallet);
            //end table database field
            self.guid = ko.observable('');
            self.editMode = ko.observable('');
            self.isEdit = ko.observable(false);
            self.isSelected = ko.observable(false);
            self.allowEdit = ko.observable(true);
            self.allowRemove = ko.observable(true);
            self.oldValue = ko.observable({});
            self.valManager = ko.observable(new ValidationManager());
            
            self.walletName = ko.observable("");
          };
