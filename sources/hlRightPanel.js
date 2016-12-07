/**
 * Created by HoseaLee on 16/12/6.
 */
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD
        define(['jquery'], factory);
    } else if (typeof exports === 'object') {
        // Node, CommonJS之类的
        module.exports = factory(require('jquery'));
    } else {
        // 浏览器全局变量(root 即 window)
        root.returnExports = factory(root.jQuery);
    }
}(this, function ($) {
    $.extend({
        hlRightPanel: function (_data) {
            //模版
            var uli_global_rightPanel = $('' +
                '<div id="uli-global-rightPanel">' +
                '   <div class="hl-rightPanel-wrap">' +
                '       <div class="hl-rightPanel">' +
                '           <div class="hl-rightPanel-panels"> </div>' +
                '           <div class="hl-rightPanel-tabs"> </div>' +
                '       </div>' +
                '   </div>' +
                '</div>');
            var uli_rightPanel_panel = '<div data-name="" class="hl-rightPanel-panel" style="visibility:hidden"></div>';
            var uli_rightPanel_tab = '<div data-name="" class="hl-rightPanel-tab"></div>';
            var uli_rightPanel_panel_header = '<h3 class="hl-rightPanel-panel-header"></h3>';
            var uli_rightPanel_panel_main = '<div class="hl-rightPanel-panel-main"></div>';
            var uli_rightPanel_panel_footer = '<div class="hl-rightPanel-panel-footer"></div>';

            //缓存, "bar_name":{"tab":jqObj, "panel":jqObj}
            var rightPanel_cache = {};

            //遍历数据集合,生成tab和panel,放入缓存, 调用绑定事件
            $.each(_data, function (k, v) {
                add(v);
            });
            //遍历缓存, 添加到主模版
//                $.each(rightPanel_cache, function (k, v) {
//                    $("div.hl-rightPanel-panels", uli_global_rightPanel).append(rightPanel_cache[k]['panel']);
//                    $("div.hl-rightPanel-tabs", uli_global_rightPanel).append(rightPanel_cache[k]['tab']);
//                });

            //主模版添加到视图中
            $("body").append(uli_global_rightPanel);

            //添加一个rightPanel
            function add(v){
                var tab = $(uli_rightPanel_tab).attr("data-name", v.name).attr("data-type", v.type);
                var panel = null;
                if (v.type == "bar") {
                    $(tab).append('<i class="tab-icon"></i><em class="tab-text"></em>');
                    $("i.tab-icon", tab).addClass(v.labelIcon);
                    $("em.tab-text", tab).html(v.label);
                    panel = $(uli_rightPanel_panel).attr("data-name", v.name).html(v.content);
                    panel.append(uli_rightPanel_panel_main);
                    $(".hl-rightPanel-panel-main", panel).css("height", "100%");
                    if (v.header) {
                        panel.append(uli_rightPanel_panel_header);
                        $(".hl-rightPanel-panel-header", panel).append(v.header);
                    }
                    if (v.footer) {
                        panel.append(uli_rightPanel_panel_footer);
                        $(".hl-rightPanel-panel-footer", panel).append(v.footer);
                        $(".hl-rightPanel-panel-main", panel).css("margin-bottom", $(".hl-rightPanel-panel-footer", panel).height());
                    }
                    if (v.content_type == "iframe") {
                        //第二次修改,使用下文的template作模版处理, iframe暂时不用,但是不删除该功能
                        tab.attr("data-content-type", v.content_type);
                        panel.attr("data-iframe", v.src)
                    }
                    if (v.template && /#((?:[\w\u00c0-\uFFFF-]|\\.)+)/.test(v.template)) {
                        //v.template是元素的ID选择器
                        var template = "";
                        if ($(v.template)[0].tagName == "SCRIPT") {
                            template = $($(v.template).html());
                        } else {
                            template = $(v.template);
                        }
                        $(".hl-rightPanel-panel-main", panel).append(template);
                    } else if (v.template && (typeof v.template == 'function')) {
                        //v.template不是ID选择器,而是function
                        var returnValue = v.template();
                        $(".hl-rightPanel-panel-main", panel).append($(returnValue));
                    } else if (v.template && (typeof v.template == 'string')) {
                        //v.template不是ID选择器, 不是function, 而是字符串
                        $(".hl-rightPanel-panel-main", panel).append($(v.template));
                    }
                    if (typeof v.template == 'undefined') {
                        //未定义template, 这里开始检查ajax
                        if (v.ajax && typeof v.ajax == "string") {
                            $.get(v.ajax).success(function (_r) {
                                $(".hl-rightPanel-panel-main", panel).append($(_r));
                            });
                        } else if (v.ajax && typeof v.ajax == "object") {
                            var opts = {
                                url: "",
                                method: "POST",
                                dataType: "json",
                                data: {}
                            };
                            opts = $.extend({}, opts, v.ajax);
                            $.ajax($.extend({}, opts, {
                                success: function (_r) {
                                    var _result = {data: _r, panel: panel, tab: tab};
                                    if (v.ajax.success) {
                                        v.ajax.success(_result);
                                    } else {
                                        $(".hl-rightPanel-panel-main", panel).append($(_r.content));
                                    }
                                },
                                complete: function () {

                                }
                            }))
                        }
                    }
                } else if (v.type == "link") {
                    var el = $('<a><i class="tab-icon"></i><em class="tab-text"></em></a>');
                    tab.append(el);
                    if (v.target) {
                        $("a", tab).attr("target", v.target);
                    }
                    if (v.href) {
                        $("a", tab).attr("href", v.href);
                    } else {
                        $("a", tab).attr("href", "#")
                    }
                    $("i.tab-icon", tab).addClass(v.labelIcon);
                    $("em.tab-text", tab).html(v.label);
                }
                processTabPanel(tab, panel);
                rightPanel_cache[v.name] = {
                    panel: panel,
                    tab: tab
                };
                $("div.hl-rightPanel-panels", uli_global_rightPanel).append(panel);
                $("div.hl-rightPanel-tabs", uli_global_rightPanel).append(tab);
            }

            //取得一个rightPanel(tab,panel)
            function get(name){
                return rightPanel_cache[name]
            }

            //删除一个rightPanel(tab,panel)
            function del(name){
                var rightPanel = get(name);
                var rightPanel_copy = $.extend(true, {}, rightPanel);
                $(rightPanel.panel).remove();
                $(rightPanel.tab).remove();
                delete rightPanel_cache[name];
                return rightPanel_copy;
            }

            //tab & panel的事件响应和对应关系的绑定
            function processTabPanel(_tab, _panel) {

                //鼠标悬停和移除事件
                _tab.hover(function () {
                    $(this).addClass("hl-rightPanel-tab-hover");
                }, function () {
                    $(this).removeClass("hl-rightPanel-tab-hover");
                });
                //tab点击
                _tab.on("click", function () {
                    if (_tab.attr("data-type") == "bar") {
                        if (!ifShowPanels()) {
                            //panels未打开
                            if (_tab.hasClass("hl-rightPanel-tab-selected")) {
                                _tab.removeClass("hl-rightPanel-tab-selected");
                                showPanel();
                                hidePanels();
                            } else {
                                showPanels();
                                showPanel(_tab.attr("data-name"));
                            }
                        } else {
                            //panels已打开
                            if (_tab.hasClass("hl-rightPanel-tab-selected")) {
                                //当前点击的tab是selected(打开的tab)_tab.removeClass("hl-rightPanel-tab-selected");
                                showPanel();
                                hidePanels();
                            } else {
                                //当前点击的tab不是selected(未打开的tab),切换panel
                                showPanel(_tab.attr("data-name"));
                            }
                        }

                        //panel内容加载

                    } else if (_tab.attr("data-type") == "link") {
                        return true;
                    }

                });
            }

            //检查panels是否显示
            function ifShowPanels() {
                return $("div.hl-rightPanel-wrap", uli_global_rightPanel).hasClass("hl-rightPanel-open");
            }

            //显示panels
            function showPanels() {
                $("div.hl-rightPanel-wrap", uli_global_rightPanel).addClass("hl-rightPanel-open");
            }

            //隐藏panels
            function hidePanels() {
                $("div.hl-rightPanel-wrap", uli_global_rightPanel).removeClass("hl-rightPanel-open");
            }

            //显示panel
            function showPanel(name) {
                $.each(rightPanel_cache, function (k, v) {
                    if ($(v.tab).hasClass("hl-rightPanel-tab-selected")) {
                        v.tab.removeClass("hl-rightPanel-tab-selected");
                        v.panel.removeClass("rightPanel-animate-in").addClass("rightPanel-animate-out").css("visibility", "hidden");
                        return false;
                    }
                });
                if (name != '' && name != undefined) {
                    rightPanel_cache[name].tab.addClass("hl-rightPanel-tab-selected");
                    rightPanel_cache[name].panel.removeClass("rightPanel-animate-out").addClass("rightPanel-animate-in").css("visibility", "visible");
                    panelLoaded(name);
                }
            }

            //组装加载panel内容
            function panelLoaded(name) {
                var rightPanel_dom = rightPanel_cache[name];
                if (!rightPanel_dom['panel'].data("iframeLoaded") && rightPanel_dom['tab'].data("contentType") == "iframe") {
                    $(".hl-rightPanel-panel-main", rightPanel_dom['panel']).append('<iframe class="hl-rightPanel-panel-iframe" src="' + rightPanel_dom['panel'].data("iframe") + '"></iframe>');
                    rightPanel_dom['panel'].data('iframeLoaded', true)
                }
            }

            return {
                add:add,
                get:get,
                del:del
            }
        }
    });
}));