        var SiwAttendance = function (
                     siwattendanceid,
                     walletid,
                     confirmwallet,
                     fullname,
                     usercode,
                     status,
                     attendance,
                     timeattendance,
                     twitter,
                     linkretweet,
                     shortwallet
                     //end table database field
                         ) {
            var self = this;
            self.siwAttendanceID = ko.observable(siwattendanceid);
            self.walletID = ko.observable(walletid);
            self.confirmWallet = ko.observable(confirmwallet);
            self.fullName = ko.observable(fullname);
            self.userCode = ko.observable(usercode);
            self.status = ko.observable(status);
            self.attendance = ko.observable(attendance);
            self.timeAttendance = ko.observable(parseStringToDateTime(timeattendance,DateTimeFormat.APIStringToDateTime));
            self.timeAttendanceF = ko.observable(parseStringToDisplayDateTime(timeattendance,DateTimeFormat.APIStringToDateTime,DateTimeFormat.DateTimeToDisplay));
            self.twitter = ko.observable(twitter);
            self.linkRetweet = ko.observable(linkretweet);
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
