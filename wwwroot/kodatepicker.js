ko.bindingHandlers.datepicker = {
    init: function (element, valueAccessor, allBindingsAccessor) {
        //initialize datepicker with some optional options
        var options = allBindingsAccessor().datepickerOptions || {};
        $(element).datepicker({
            keyboardNavigation: false,
            forceParse: false,
            calendarWeeks: false,
            format: "dd/mm/yyyy",
            todayBtn: true,
            autoclose: true,
            todayHighlight: true
        });
       // handle the field changing
        ko.utils.registerEventHandler(element, "change", function () {
            var observable = valueAccessor();
            observable($(element).datepicker("getDate"));
        });
        //handle disposal (if KO removes by the template binding)
        ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
            $(element).datepicker("destroy");
        });
    },
    update: function (element, valueAccessor) {
        var value = ko.utils.unwrapObservable(valueAccessor());
        //handle date data coming via json from Microsoft
        if (value != null) {
            if (moment(value).isValid()) {
                var current = $(element).datepicker("getDate");
                if (value - current !== 0) {
                    $(element).datepicker("setDate", value);
                }
            }
        } else {
            $(element).datepicker("setDate", null);
        }
    }
};

