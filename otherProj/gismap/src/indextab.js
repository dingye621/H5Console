(function ($) {
    $.nfinetab = {
        fullscreenStatus: false,
        requestFullScreen: function () {
            var de = document.documentElement;
            if (de.requestFullscreen) {
                de.requestFullscreen();
            } else if (de.mozRequestFullScreen) {
                de.mozRequestFullScreen();
            } else if (de.webkitRequestFullScreen) {
                de.webkitRequestFullScreen();
            }
        },
        exitFullscreen: function () {
            var de = document;
            if (de.exitFullscreen) {
                de.exitFullscreen();
            } else if (de.mozCancelFullScreen) {
                de.mozCancelFullScreen();
            } else if (de.webkitCancelFullScreen) {
                de.webkitCancelFullScreen();
            }
        },
        refreshTab: function () {
            var currentId = $('.page-tabs-content').find('.active').attr('data-id');
            var target = $('.NFine_iframe[data-id="' + currentId + '"]');
            var url = target.attr('data-id');

            $.loading(true);
            $(target).html('');
            $(target).load(url, function () {
                $.loading(false);
            });
        },
        activeTab: function (activeId,eleament) {
            //var currentId = $(this).data('id');
            if (activeId.length== undefined) {
                var currentId = $(this).data('id');
            } else {
                var currentId = activeId;
            }

            if (!$(this).hasClass('active')) {

                // 给当前的页面所有的ID都加个字段
                $("#operate").animate({ "left": '-100.1%' }, 200);
                var nowtabId = $('.page-tabs-content').find('.active').attr('data-id');
                var nowtab = $(".NFine_iframe[data-id='" + nowtabId + "']");
                $(nowtab).find('[id]').each(function () {
                    var id = $(this).attr('id');
                    $(this).attr('id', nowtabId + id);
                });

                var nexttab = $(".NFine_iframe[data-id='" + currentId + "']");
                $(nexttab).find('[id]').each(function () {
                    var id = $(this).attr('id');
                    $(this).attr('id', id.replace(currentId, ''));
                });

                $('.mainContent .NFine_iframe').each(function () {
                    if ($(this).data('id') == currentId) {
                        $(this).show().siblings('.NFine_iframe').hide();
                        return false;
                    }
                });
                $(this).addClass('active').siblings('.menuTab').removeClass('active');
                $.nfinetab.scrollToTab(eleament);
            }
        },
        closeOtherTabs: function () {
            $('.page-tabs-content').children("[data-id]").find('.fa-remove').parents('a').not(".active").each(function () {
                $('.NFine_iframe[data-id="' + $(this).data('id') + '"]').remove();
                $(this).remove();
            });
            $('.page-tabs-content').css("margin-left", "0");
        },
        closeTab: function () {
            var closeTabId = $(this).parents('.menuTab').data('id');
            var currentWidth = $(this).parents('.menuTab').width();
            if ($(this).parents('.menuTab').hasClass('active')) {
                if ($(this).parents('.menuTab').next('.menuTab').size()) {
                    var activeId = $(this).parents('.menuTab').next('.menuTab:eq(0)').data('id');                  
                    $.nfinetab.activeTab(activeId, $(this));
                    $(this).parents('.menuTab').next('.menuTab:eq(0)').addClass('active');
                    $('.mainContent .NFine_iframe').each(function () {
                        if ($(this).data('id') == activeId) {
                            $(this).show().siblings('.NFine_iframe').hide();
                            return false;
                        }
                    });
                    var marginLeftVal = parseInt($('.page-tabs-content').css('margin-left'));
                    if (marginLeftVal < 0) {
                        $('.page-tabs-content').animate({
                            marginLeft: (marginLeftVal + currentWidth) + 'px'
                        }, "fast");
                    }
                    $(this).parents('.menuTab').remove();
                    $('.mainContent .NFine_iframe').each(function () {
                        if ($(this).data('id') == closeTabId) {
                            $(this).remove();
                            return false;
                        }
                    });
                }
                if ($(this).parents('.menuTab').prev('.menuTab').size()) {
                    var activeId = $(this).parents('.menuTab').prev('.menuTab:last').data('id');                    
                    $.nfinetab.activeTab(activeId, $(this));

                    $(this).parents('.menuTab').prev('.menuTab:last').addClass('active');
                    $('.mainContent .NFine_iframe').each(function () {
                        if ($(this).data('id') == activeId) {
                            $(this).show().siblings('.NFine_iframe').hide();
                            return false;
                        }
                    });
                    $(this).parents('.menuTab').remove();
                    $('.mainContent .NFine_iframe').each(function () {
                        if ($(this).data('id') == closeTabId) {
                            $(this).remove();
                            return false;
                        }
                    });
                }
            }
            else {
                $(this).parents('.menuTab').remove();
                $('.mainContent .NFine_iframe').each(function () {
                    if ($(this).data('id') == closeTabId) {
                        $(this).remove();
                        return false;
                    }
                });
                window.parent.$.nfinetab.scrollToTab($('.menuTab.active'));
            }
            return false;
        },
        addTab: function () {
            $(".open>.dropdown-menu").hide();
            var dataId = $(this).attr('data-id');

            if (dataId != "") {
                top.$.cookie('nfine_currentmoduleid', dataId, { path: "/" });
            }
            var dataUrl = $(this).attr('href');
            var menuName = $.trim($(this).text());
            var flag = true;




            if (dataUrl == undefined || $.trim(dataUrl).length == 0) {
                return false;
            }

            if ($.trim(dataUrl).length > 4)
            {
                if($.trim(dataUrl).substring(0,4)=="http")
                {
                    //新标签页跳转.
                    window.open(dataUrl);
                    return false;
                }
            }




            window.parent.$('.menuTab').each(function () {
                if ($(this).data('id') == dataUrl) {
                    if (!$(this).hasClass('active')) {

                        // 给当前的页面所有的ID都加个字段
                        $("#operate").animate({ "left": '-100.1%' }, 200);
                        var nowtabId = window.parent.$('.page-tabs-content').find('.active').attr('data-id');
                        var nowtab = window.parent.$(".NFine_iframe[data-id='" + nowtabId + "']");
                        $(nowtab).find('[id]').each(function () {
                            var id = $(this).attr('id');
                            $(this).attr('id', nowtabId + id);
                        });

                        var nexttab = window.parent.$(".NFine_iframe[data-id='" + dataUrl + "']");
                        $(nexttab).find('[id]').each(function () {
                            var id = $(this).attr('id');
                            $(this).attr('id', id.replace(dataUrl, ''));
                        });

                        $(this).addClass('active').siblings('.menuTab').removeClass('active');
                        window.parent.$.nfinetab.scrollToTab(this);
                        window.parent.$('.mainContent .NFine_iframe').each(function () {
                            if ($(this).data('id') == dataUrl) {
                                $(this).show().siblings('.NFine_iframe').hide();
                                return false;
                            }
                        });
                    }
                    flag = false;
                    return false;
                }
            });
            if (flag) {
                var nowtabId = window.parent.$('.page-tabs-content').find('.active').attr('data-id');
                if (nowtabId == "" || nowtabId == null) {
                    nowtabId = "/Index/Default";
                } 
                var nowtab = window.parent.$(".NFine_iframe[data-id='" + nowtabId + "']");
                
                $(nowtab).find('[id]').each(function () {
                    var id = $(this).attr('id');
                    $(this).attr('id', nowtabId + id);
                });

                var str = '<a href="javascript:;" class="active menuTab" data-id="' + dataUrl + '">' + menuName + ' <i class="fa fa-remove"></i></a>';
                window.parent.$('.menuTab').removeClass('active');
                //var str1 = '<iframe class="NFine_iframe" id="iframe' + dataId + '" name="iframe' + dataId + '"  width="100%" height="100%" src="' + dataUrl + '" frameborder="0" data-id="' + dataUrl + '" seamless></iframe>';

                var str1 = '<div class="NFine_iframe div-tabpane" id="tabpane-' + dataId + '" data-id="' + dataUrl + '"></div>';

                window.parent.$('.mainContent').find('div.NFine_iframe').hide();
                window.parent.$('.mainContent').find('iframe.NFine_iframe').hide();
                window.parent.$('.mainContent').append(str1);
                window.parent.$('.menuTabs .page-tabs-content').append(str);

                // jQuery load窗体
                window.parent.$.loading(true);
                window.parent.$('#tabpane-' + dataId).load(dataUrl, function () {
                    $.loading(false);
                })

                window.parent.$.nfinetab.scrollToTab($('.menuTab.active'));
            }
            return false;
        },
        scrollTabRight: function () {
            var marginLeftVal = Math.abs(parseInt($('.page-tabs-content').css('margin-left')));
            var tabOuterWidth = $.nfinetab.calSumWidth($(".content-tabs").children().not(".menuTabs"));
            var visibleWidth = $(".content-tabs").outerWidth(true) - tabOuterWidth;
            var scrollVal = 0;
            if ($(".page-tabs-content").width() < visibleWidth) {
                return false;
            } else {
                var tabElement = $(".menuTab:first");
                var offsetVal = 0;
                while ((offsetVal + $(tabElement).outerWidth(true)) <= marginLeftVal) {
                    offsetVal += $(tabElement).outerWidth(true);
                    tabElement = $(tabElement).next();
                }
                offsetVal = 0;
                while ((offsetVal + $(tabElement).outerWidth(true)) < (visibleWidth) && tabElement.length > 0) {
                    offsetVal += $(tabElement).outerWidth(true);
                    tabElement = $(tabElement).next();
                }
                scrollVal = $.nfinetab.calSumWidth($(tabElement).prevAll());
                if (scrollVal > 0) {
                    $('.page-tabs-content').animate({
                        marginLeft: 0 - scrollVal + 'px'
                    }, "fast");
                }
            }
        },
        scrollTabLeft: function () {
            var marginLeftVal = Math.abs(parseInt($('.page-tabs-content').css('margin-left')));
            var tabOuterWidth = $.nfinetab.calSumWidth($(".content-tabs").children().not(".menuTabs"));
            var visibleWidth = $(".content-tabs").outerWidth(true) - tabOuterWidth;
            var scrollVal = 0;
            if ($(".page-tabs-content").width() < visibleWidth) {
                return false;
            } else {
                var tabElement = $(".menuTab:first");
                var offsetVal = 0;
                while ((offsetVal + $(tabElement).outerWidth(true)) <= marginLeftVal) {
                    offsetVal += $(tabElement).outerWidth(true);
                    tabElement = $(tabElement).next();
                }
                offsetVal = 0;
                if ($.nfinetab.calSumWidth($(tabElement).prevAll()) > visibleWidth) {
                    while ((offsetVal + $(tabElement).outerWidth(true)) < (visibleWidth) && tabElement.length > 0) {
                        offsetVal += $(tabElement).outerWidth(true);
                        tabElement = $(tabElement).prev();
                    }
                    scrollVal = $.nfinetab.calSumWidth($(tabElement).prevAll());
                }
            }
            $('.page-tabs-content').animate({
                marginLeft: 0 - scrollVal + 'px'
            }, "fast");
        },
        scrollToTab: function (element) {
            var marginLeftVal = $.nfinetab.calSumWidth($(element).prevAll()), marginRightVal = $.nfinetab.calSumWidth($(element).nextAll());
            var tabOuterWidth = $.nfinetab.calSumWidth($(".content-tabs").children().not(".menuTabs"));
            var visibleWidth = $(".content-tabs").outerWidth(true) - tabOuterWidth;
            var scrollVal = 0;
            if ($(".page-tabs-content").outerWidth() < visibleWidth) {
                scrollVal = 0;
            } else if (marginRightVal <= (visibleWidth - $(element).outerWidth(true) - $(element).next().outerWidth(true))) {
                if ((visibleWidth - $(element).next().outerWidth(true)) > marginRightVal) {
                    scrollVal = marginLeftVal;
                    var tabElement = element;
                    while ((scrollVal - $(tabElement).outerWidth()) > ($(".page-tabs-content").outerWidth() - visibleWidth)) {
                        scrollVal -= $(tabElement).prev().outerWidth();
                        tabElement = $(tabElement).prev();
                    }
                }
            } else if (marginLeftVal > (visibleWidth - $(element).outerWidth(true) - $(element).prev().outerWidth(true))) {
                scrollVal = marginLeftVal - $(element).prev().outerWidth(true);
            }
            $('.page-tabs-content').animate({
                marginLeft: 0 - scrollVal + 'px'
            }, "fast");
        },
        calSumWidth: function (element) {
            var width = 0;
            $(element).each(function () {
                width += $(this).outerWidth(true);
            });
            return width;
        },
        init: function () {
            $('.menuItem').on('click', $.nfinetab.addTab);
            $('.menuTabs').on('click', '.menuTab i', $.nfinetab.closeTab);
            $('.menuTabs').on('click', '.menuTab', $.nfinetab.activeTab);
            $('.tabLeft').on('click', $.nfinetab.scrollTabLeft);
            $('.tabRight').on('click', $.nfinetab.scrollTabRight);
            $('.tabReload').on('click', $.nfinetab.refreshTab);
            $('.tabCloseCurrent').on('click', function () {
                $('.page-tabs-content').find('.active i').trigger("click");
            });
            $('.tabCloseAll').on('click', function () {
                $('.page-tabs-content').children("[data-id]").find('.fa-remove').each(function () {
                    $('.NFine_iframe[data-id="' + $(this).data('id') + '"]').remove();
                    $(this).parents('a').remove();
                });
                $('.page-tabs-content').children("[data-id]:first").each(function () {
                    $('.NFine_iframe[data-id="' + $(this).data('id') + '"]').show();
                    $(this).addClass("active");
                });
                $('.page-tabs-content').css("margin-left", "0");
            });
            $('.tabCloseOther').on('click', $.nfinetab.closeOtherTabs);
            $('.fullscreen').on('click', function () {
                if (!$(this).attr('fullscreen')) {
                    $(this).attr('fullscreen', 'true');
                    requestFullScreen();
                } else {
                    $(this).removeAttr('fullscreen')
                    exitFullscreen();
                }
            });
        }
    };
    $(function () {
        $.nfinetab.init();
    });

    $.reload = $.nfinetab.refreshTab;

    $('#tab-btn-fullscreen').click(function () {
        if ($.nfinetab.fullscreenStatus) {
            $.nfinetab.exitFullscreen();
            $(this).find('i').attr('class', "fa fa-arrows-alt");
        } else {
            $.nfinetab.requestFullScreen();
            $(this).find('i').attr('class', "fa fa-arrows");
        }
        $.nfinetab.fullscreenStatus = !$.nfinetab.fullscreenStatus;
    });
})(jQuery);


