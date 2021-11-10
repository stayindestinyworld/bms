        var SiwHistoryClaimReward = function (
                     siwhistoryclaimrewardid,
                     walletid,
                     shortwallet,
                     usercode,
                     status,
                     claim,
                     dateclaim,
                     description
                     //end table database field
                         ) {
            var self = this;
            self.siwHistoryClaimRewardID = ko.observable(siwhistoryclaimrewardid);
            self.walletID = ko.observable(walletid);
            self.shortWallet = ko.observable(shortwallet);
            self.userCode = ko.observable(usercode);
            self.status = ko.observable(status);
            self.claim = ko.observable(claim);
            self.dateClaim = ko.observable(parseStringToDateTime(dateclaim,DateTimeFormat.APIStringToDateTime));
            self.dateClaimF = ko.observable(parseStringToDisplayDateTime(dateclaim,DateTimeFormat.APIStringToDateTime,DateTimeFormat.DateTimeToDisplay));
            self.description = ko.observable(description);
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
