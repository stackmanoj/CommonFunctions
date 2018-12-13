(function ($) {
    $.fn.buttonLoading = function (action) {
        var $this = $(this);
        var data = $this.attr('data-click-count');
        if (typeof data === 'undefined' || data == 0) {
            $this.attr('data-click-count', 1);
        }
        else {
            $this.attr('data-click-count', (parseInt(data) + 1));
        }
        data = $this.attr('data-click-count');
        if (data == 1 || typeof data === 'undefined') {
            return true;
        }
        else {
            return false;
        }
    }
}(jQuery));

(function (func) {
    $.fn.addClass = function () {
        func.apply(this, arguments);
        if ($(this).hasClass('input-validation-error')) {
            $(this).closest('form').find('input[type="button"],input[type="submit"]').each(function (index, item) {
                if ($(item).attr('data-click-count')) {
                    $(item).attr('data-click-count', 0);
                }
            });
        }
        return this;
    }
})($.fn.addClass);

$(function () {
    // due to A potentially dangerous Request.Form value was detected from the client
    $('input[type=text],textarea').live("keypress", function (e) {
        var $this = this;
        //if (!$this.hasClass('htmlAllow'))
        if (!$this.classNames == 'htmlAllow')
        {
            if (e.which == 60 || e.which == 62) {
                return false;
            }
        }
    });
    // due to A potentially dangerous Request.Form value was detected from the client
    $("input[type=text],textarea").live("paste", function (e) {
        var $this = this;
        //  if (!$this.hasClass('htmlAllow'))
        if (!$this.classNames=='htmlAllow')
        {
            var pastedData = e.originalEvent.clipboardData.getData('text');
            if (pastedData.indexOf("<") >= 0 || pastedData.indexOf(">") >= 0) {
                return false;
            }
        }
    });
    // Disallow Char for Textbox
    $('input[data-invalidchars],textarea[data-invalidchars]').live("keypress", function (e) {
        var invalidChar = $(this).attr('data-invalidchars');
        var currentChar = String.fromCharCode(e.which);
        if (invalidChar.indexOf(currentChar) >= 0) {
            return false;
        }
    });
    // Disallow Char for Textbox -- For Paste
    $('input[data-invalidchars],textarea[data-invalidchars]').live("paste", function (e) {
        var pastedData = e.originalEvent.clipboardData.getData('text');
        var invalidChar = $(this).attr('data-invalidchars');
        for (var i = 0; i < invalidChar.length; i++) {
            if (pastedData.indexOf(invalidChar[i]) >= 0) {
                return false;
            }
        }

    });
 
    // check valid email address
    $('#Email').live("keypress", function (e) {
        //alert(e.which);
        var specialChar = new Array(33, 34, 35, 36, 37, 94, 38, 39, 42, 40, 41, 43, 44, 45, 47, 61, 123, 91, 92, 124, 93, 96, 125, 126, 59, 58, 60, 62, 63);
        if ($.inArray(e.which, specialChar) > -1) {
            return false;
        }
        //if ($.inArray(e.which, specialChar) != -1)
    });
    // for valid email address
    $('.email').live("blur", function (e) {
        //alert(e.which);
        var emailId = $(this).val();
        if (!isValidEmailAddress(emailId) && emailId.trim() != '') {
            alert('Invalid email address.');
            var controlId = $(this).attr('id');
            setTimeout(function () {
                $('#' + controlId).focus();
            }, 1);
        }
        //if ($.inArray(e.which, specialChar) != -1)
    });
    // validation for Time
    $('.t-timepicker input[type=text],.t-datetimepicker input[type=text]').live("keypress", function (e) {
        if (e.which != 8 && e.which != 0 && (e.which < 47 || e.which > 57) && e.which != 58 && e.which != 97 && e.which != 109 && e.which != 112 && e.which != 80 && e.which != 77 && e.which != 65 && e.which != 32) {
            return false;
        }
        if ($(this).parent().parent().hasClass('t-timepicker') && e.which == 47) {
            return false;
        }
        var timeValue = $(this).val();
        if (timeValue.indexOf(':') != -1) {
            var colanLength = timeValue.indexOf(':');
            var tLength = timeValue.length;
            if (tLength - colanLength == 3) {
                $(this).val(timeValue + " ");
            }
        }
        if (e.which == 58) {
            if (timeValue.indexOf(':') === -1 && timeValue.length > 0) {
                $(this).val(timeValue);
                return true;
            }
            else
                return false;
        }
    });
    $('.t-timepicker input[type=text]').live("focusout", function () {
        var crntTime = $(this).val();
        if (crntTime != '') {
            var validTime = crntTime.match(/^(0?[1-9]|1[012])(:[0-5]\d) [APap][mM]$/);
            if (!validTime) {
                alert("Please enter valid time.");
                var controlId = $(this).attr('id');
                setTimeout(function () {
                    $('#' + controlId).focus();
                }, 1);
                $(this).val('');
            }
        }
    });
    // validation for DateTime
    $('.t-datetimepicker input[type=text]').live("focusout", function () {
        var crntDate = $(this).val();
        if (crntDate != '') {
            if (!IsValidDateTimeFormat(crntDate)) {
                alert("Please enter valid date time format.");
                var controlId = $(this).attr('id');
                setTimeout(function () {
                    $('#' + controlId).focus();
                }, 1);
                $(this).val('');
            }
        }
    });
    // validation for Date
    $('.t-datepicker input[type=text]').live("keypress", function (e) {
        // alert(e.which);
        if (e.which != 8 && e.which != 0 && (e.which < 47 || e.which > 57)) {
            return false;
        }
    });
    $('.t-datepicker input[type=text]').live("focusout", function () {
        debugger;
        //$(document).on('focusout', '.t-datepicker input[type=text]', function () {
        //$('.t-datepicker input[type=text]').focusout(function () {
        var VisitDate = $(this).val();
        if (VisitDate != '') {
            if (!IsValidMMDDYYYDateFormat(VisitDate)) {
                alert("Please enter valid date format.");
                var controlId = $(this).attr('id');
                setTimeout(function () {
                    $('#' + controlId).focus();
                }, 1);
                $(this).val('');
            }
        }
    });
    
});

function AddDaysInDate(date, days) {
    var newdate = new Date(date);
    newdate.setDate(newdate.getDate() + days);
    return ConvertDateIntoMMddyyyy(newdate);
}
function ConvertDateIntoMMddyyyy(date) {
    var nd = new Date(date);
    nd = (nd.getMonth() + 1) + '/' + nd.getDate() + '/' + nd.getFullYear()
    return nd;
}
function IsValidMMDDYYYDateFormat(txtDate) {
    var currVal = txtDate;
    if (currVal == '')
        return false;
    //Declare Regex
    var rxDatePattern = /^(\d{1,2})(\/|-)(\d{1,2})(\/|-)(\d{4})$/;
    var dtArray = currVal.match(rxDatePattern); // is format OK?
    if (dtArray == null)
        return false;
    //Checks for mm/dd/yyyy format.
    dtMonth = dtArray[1];
    dtDay = dtArray[3];
    dtYear = dtArray[5];
    if (dtMonth < 1 || dtMonth > 12)
        return false;
    else if (dtDay < 1 || dtDay > 31)
        return false;
    else if ((dtMonth == 4 || dtMonth == 6 || dtMonth == 9 || dtMonth == 11) && dtDay == 31)
        return false;
    else if (dtMonth == 2) {
        var isleap = (dtYear % 4 == 0 && (dtYear % 100 != 0 || dtYear % 400 == 0));
        if (dtDay > 29 || (dtDay == 29 && !isleap))
            return false;
    }
    if (dtYear < 1900)
        return false;
    return true;
}
function IsValidDateTimeFormat(txtDate) {
    var currVal = txtDate;
    if (currVal == '')
        return false;
    //Declare Regex
    var rxDatePattern = /^(\d{1,2})(\/|-)(\d{1,2})(\/|-)(\d{4} (0?[1-9]|1[012])(:[0-5]\d) [APap][mM])$/;
    var dtArray = currVal.match(rxDatePattern); // is format OK?
    if (dtArray == null)
        return false;
    //Checks for mm/dd/yyyy format.
    dtMonth = dtArray[1];
    dtDay = dtArray[3];
    dtYear = dtArray[5].split(' ')[0];
    if (dtMonth < 1 || dtMonth > 12)
        return false;
    else if (dtDay < 1 || dtDay > 31)
        return false;
    else if ((dtMonth == 4 || dtMonth == 6 || dtMonth == 9 || dtMonth == 11) && dtDay == 31)
        return false;
    else if (dtMonth == 2) {
        var isleap = (dtYear % 4 == 0 && (dtYear % 100 != 0 || dtYear % 400 == 0));
        if (dtDay > 29 || (dtDay == 29 && !isleap))
            return false;
    }
    if (dtYear < 1900)
        return false;
    return true;
}
$(document).find('.decimal').live("keypress", (function (event) {
    if ((event.which != 46 || $(this).val().indexOf('.') != -1) &&
      ((event.which < 48 || event.which > 57) &&
        (event.which != 0 && event.which != 8))) {
        event.preventDefault();
    }
    var text = $(this).val();
    if ((text.indexOf('.') != -1) &&
      (text.substring(text.indexOf('.')).length > 7) &&
      (event.which != 0 && event.which != 8)) {
        event.preventDefault();
    }
}));
$(document).find('.number').live("keypress", (function (event) {
    if (event.ctrlKey) {
        return true;
    }
    $(this).val($(this).val().replace(/[^\d].+/, ""));
    if ((event.which < 48 || event.which > 57) && event.which != 8 && event.which != 0) {
        event.preventDefault();
    }
}));
$(document).find('.number').live("paste", function (e) {
    var pastedData = e.originalEvent.clipboardData.getData('text');
    var intRegex = /^\d+$/;
    if (intRegex.test(pastedData)) {
        return true;
    }
    else {
        alert('Only digits are allowed !');
        return false;
    }
});
$(document).find('.alphanumeric').live("keypress", (function (event) {
    var mask = new RegExp('^[A-Za-z0-9 ]*$')
    if (!event.charCode) return true;
    var part1 = this.value.substring(0, this.selectionStart);
    var part2 = this.value.substring(this.selectionEnd, this.value.length);
    if (!mask.test(part1 + String.fromCharCode(event.charCode) + part2))
        return false;
}));
$(document).find('.alphanumeric').live("paste", (function (e) {
    var pastedData = e.originalEvent.clipboardData.getData('text').replace('"', '');
    var d = pastedData.trim().replace('"', '');
    var intRegex = new RegExp('^[A-Za-z0-9 ]*$');
    if (intRegex.test(d)) {
        return true;
    }
    else {
        alert('Only alphanumric characters are allowed !');
        return false;
    }
}));

function isValidEmailAddress(emailAddress) {
    var pattern = /^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
    return pattern.test(emailAddress);
};
function formatAMPM(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
}
Date.prototype.addMinutes = function (minutes) {
    this.setMinutes(this.getMinutes() + minutes);
    return this;
};
Date.prototype.addHours = function (h) {
    this.setHours(this.getHours() + h);
    return this;
}
Date.prototype.addSeconds = function (h) {
    this.setSeconds(this.getSeconds() + h);
    return this;
}
Array.prototype.where = function (obj) {
    return this.filter(function (item) {
        for (var prop in obj)
            if (!(prop in item) || obj[prop] !== item[prop])
                return false;
        return true;
    });
};
function ScrollWindowToElement(ele, isHighlight) {
    var sc = $(ele[0]).offset().top;
    $('body,html').animate({
        scrollTop: (sc - 30)
    },
    'slow');
    if (isHighlight == true) {
        HighlightInput(ele, true);
    }
}
function IsNullOrEmpty(item) {
    if (item == null || item == '' || typeof item == "undefined") {
        return true;
    }
    return false;
}
function JSONfind(obj, searchField, searchVal) {
    var results = [];
    for (var i = 0 ; i < obj.length ; i++) {
        if (obj[i][searchField] == searchVal) {
            results.push(obj[i]);
        }
    }
    return results;
}
$.fn.serializeObject = function () {
    var o = {};
    var a = this.serializeArray();
    $.each(a, function () {
        if (o[this.name] !== undefined) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};
function ParseJsonDate(jsonDateString) {
    return new Date(parseInt(jsonDateString.replace('/Date(', '')));
}
Date.prototype.addMonths = function (m) {
    var d = new Date(this);
    var years = Math.floor(m / 12);
    var months = m - (years * 12);
    if (years) d.setFullYear(d.getFullYear() + years);
    if (months) d.setMonth(d.getMonth() + months);
    return d;
}
