        var SiwMyBackPack = function (
                     siwmybackpackid,
                     itemid,
                     name,
                     code,
                     status,
                     image,
                     point,
                     walletid,
                     siwuserid,
                     shortwallet
                     //end table database field
                         ) {
            var self = this;
            self.siwMyBackPackID = ko.observable(siwmybackpackid);
            self.itemID = ko.observable(itemid);
            self.name = ko.observable(name);
            self.code = ko.observable(code);
            self.status = ko.observable(status);
            self.image = ko.observable(image);
            self.point = ko.observable(point);
            self.walletID = ko.observable(walletid);
            self.siwUserID = ko.observable(siwuserid);
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
            
            self.itemName = ko.observable("");
            self.walletName = ko.observable("");
            self.siwUserName = ko.observable("");
          };
