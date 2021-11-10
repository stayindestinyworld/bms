        var SiwClaimAttendance = function (
                     siwclaimattendanceid,
                     walletid,
                     usercode,
                     status,
                     startclaimattendance,
                     availableclaim,
                     shortwallet
                     //end table database field
                         ) {
            var self = this;
            self.siwClaimAttendanceID = ko.observable(siwclaimattendanceid);
            self.walletID = ko.observable(walletid);
            self.userCode = ko.observable(usercode);
            self.status = ko.observable(status);
            self.startClaimAttendance = ko.observable(parseStringToDateTime(startclaimattendance,DateTimeFormat.APIStringToDateTime));
            self.startClaimAttendanceF = ko.observable(parseStringToDisplayDateTime(startclaimattendance,DateTimeFormat.APIStringToDateTime,DateTimeFormat.DateTimeToDisplay));
            self.availableClaim = ko.observable(availableclaim);
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
