var PrivacyPolicyViewModel = function () {
        var self = this;
        self.processing = ko.observable(new ModelProcessing());
        self.transition = ko.observable(new ModelTransition());
        self.emailSubscribeVM = ko.observable(null);
        self.email = ko.observable(null);

        self.initData = function () {
            var emailSubscribeVM = new EmailSubscribeViewModel();
            emailSubscribeVM.initModel(self.transition, self.processing);
            self.emailSubscribeVM(emailSubscribeVM);

            $('#valid-form input[type="text"]').blur(function () {
                if ($(this).val()) {
                    $(this).removeClass("error");
                    $('#valid-form .empty-input').hide();
                }
            });
        };
    self.sendEmailSubscribe = function (item) {
        $('#loading-off').show();
        if (item.email() == null || item.email() == "") {
            $('#loading-off').hide();
            $('#valid-form input[type="text"]').addClass("error");
            $('#valid-form .empty-input').show();
        } else if (item.email().includes("@") == false) {
            $('#loading-off').hide();
            $('#valid-form input[type="text"]').addClass("error");
            $('#valid-form .empty-input').show();
        } else {
            $.getJSON('https://api.ipify.org?format=jsonp&callback=?', function (data) {
                var newEmailSubcribe = new EmailSubscribe(
                    0,
                    item.email(),
                    "",
                    data.ip
                );
                self.emailSubscribeVM().emailSubscribe(newEmailSubcribe);
                self.emailSubscribeVM().finishEditEmailSubscribe(self.emailSubscribeVM().emailSubscribe());
                $('#loading-off').hide();
                swal(PrivacyPolicyLanguage.valTitleSuccess, PrivacyPolicyLanguage.valTitleEmailMessage, "success");
                self.email(null);
            })
        }
    };
    };
