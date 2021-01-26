window.epubfunc = () => {


    //#region Render Start Epub
    if (document.getElementById('ProductId')) {
        var productId = document.getElementById('ProductId').textContent.trim();
        var params = URLSearchParams && new URLSearchParams(document.location.search.substring(1));
        var url = params && params.get("url") && decodeURIComponent(params.get("url"));
        var bookUrl = document.getElementById("FileText").textContent;
        var token = localStorage.getItem("authToken");
        $.ajaxSetup({
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", "Bearer " + token);
            }
        });

        // Load the opf
        var book = ePub(url || bookUrl, {
            canonical: function (path) {
                return window.location.origin + window.location.pathname;
            }
        });

        var rendition = book.renderTo("pages", {
            ignoreClass: "annotator-hl",
            width: "100%",
            height: "100%",
            direction: "rtl"
        });
        rendition.themes.register("IRANSans", "/Content/css/font-style-IRANSans.css");
        rendition.themes.register("Shabnam-FD", "/Content/css/font-style-Shabnam-FD.css");

        var loc = window.location.href.indexOf("?loc=");


        // var hash = window.location.hash.slice(2);
        if (loc > -1) {
            var href = window.location.href.slice(loc + 5);
            var hash = decodeURIComponent(href);
        }
        rendition.display(hash || undefined);

        var flaglastpage = false;
        var firstload = true;
        var fontFamily = "IRANSans";
        var fontSize = "12px";
        var background = "#fff";
        var textColor = "#000";
        //#endregion

        //#region Theme Handler
        function applyFont(ffc, fsc) {
            if (fsc == "") {
                fsc = "11pt";
            }


            //var token = document.getElementById("Token").textContent;

            var epubRequest = {
                //token: token,
                productId: productId,
                fontFamily: ffc,
                fontSize: fsc
            }
            $.ajax({
                url: '/api/UpdateBookSetting',
                data: JSON.stringify(epubRequest),
                type: "post",
                dataType: 'json',
                contentType: 'application/json',
                cache: false,
                success: function (data) {
                    if (data.Status == 1) {
                        console.log(data.Message + " UpdateBookSetting ");
                    } else {
                        console.log(data.Message + " UpdateBookSetting ");
                    }
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    console.log("Server Error UpdateBookSetting");
                }
            });
            rendition.themes.select(ffc);
            rendition.themes.font(ffc);
            rendition.themes.fontSize(parseInt(fsc));

            //rendition.getContents().forEach(c => c.addStylesheetRules({
            //    "body": {
            //        "font-family": `${theme.ff} !important`,
            //        "font-size": `${theme.fs} !important`
            //  },
            //}));
        }

        $('#theme-font').on('click', 'li', function () {
            applyFont($(this).find('a').attr("id"), "")
        });
        function applyTheme(bgc, fgc) {
            let theme = {
                bg: bgc,
                fg: fgc
                //l: "#0B4085",
                //ff: "Shabnam-FD"
                //fs: "11pt",
                //lh: "1.4",
                //ta: "justify",
                //m: "0"
            };


            //var token = document.getElementById("Token").textContent;

            var epubRequest = {
                //token: token,
                productId: productId,
                background: bgc,
                textColor: fgc
            }
            $.ajax({
                url: '/api/UpdateBookSetting',
                data: JSON.stringify(epubRequest),
                type: "post",
                dataType: 'json',
                contentType: 'application/json',
                cache: false,
                success: function (data) {
                    if (data.Status == 1) {
                        console.log(data.Message + " UpdateBookSetting ");
                    } else {
                        console.log(data.Message + " UpdateBookSetting ");
                    }
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    console.log("Server Error UpdateBookSetting");
                }
            });




            rendition.getContents().forEach(c => c.addStylesheetRules({
                "body": {
                    "background": theme.bg,
                    "color": theme.fg
                    //"font-family": `${theme.ff} !important`
                    //"font-size": `${theme.fs} !important`,
                    //"line-height": `${theme.lh} !important`,
                    //"text-align": `${theme.ta} !important`,
                    //"padding-top": theme.m,
                    //"padding-bottom": theme.m
                }
                // "a": {
                //     "color": "inherit !important",
                //     "text-decoration": "none !important",
                //     "-webkit-text-fill-color": "inherit !important"
                // },
                // "a:link": {
                //     "color": `${theme.l} !important`,
                //     "text-decoration": "none !important",
                //     "-webkit-text-fill-color": `${theme.l} !important`
                // },
                // "a:link:hover": {
                //     "background": "rgba(0, 0, 0, 0.1) !important"
                // },
                // "img": {
                //     "max-width": "100% !important"
                // },
            }));
        }
        class PageColor {
            constructor(name, active, background, text) {
                this._background = background;
                this._text = text;
                this._name = name;
                this._active = active;
            }

            get background() {
                return this._background;
            }

            get text() {
                return this._text;
            }

            get name() {
                return this._name;
            }

            get active() {
                return this._active;
            }
        }
        let anchorOffset;
        let focusOffset;
        let text;

        let pageColorList = [
            new PageColor("Dark", true, "#222222", "#ffffff"),
            new PageColor("Light", false, "#ffffff", "#363636"),

        ];

        // int to list theme colors
        pageColorList.forEach(item => {
            if (item.active)
                $("#theme-color").append(`<li class="uk-active"><a style="background-color: ${item.background}">${item.name}</a></li>`)
            else
                $("#theme-color").append(`<li><a style="background-color: ${item.background}">${item.name}</a></li>`)
        });

        // region Meysam ♥
        $('#theme-color').on('click', 'li', function () {
            let index = $(this).index();
            let pageColor = pageColorList[index];
            applyTheme(pageColor.background, pageColor.text);

        });
        //#endregion

        //#region Next / Prev Button EventListener
        var next = document.getElementById("next");
        next.addEventListener("click", function (e) {
            rendition.next();
            e.preventDefault();
            flaglastpage = true;


        }, false);

        var prev = document.getElementById("prev");
        prev.addEventListener("click", function (e) {
            rendition.prev();
            e.preventDefault();
            flaglastpage = true;

        }, false);
        //#endregion

        //#region rendered
        rendition.on("rendered", function (section) {
            var current = book.navigation && book.navigation.get(section.href);
            if (current) {
                document.title = current.label;
            }
        });
        //#endregion

        //#region keyListener
        var keyListener = function (e) {

            // Left Key
            if ((e.keyCode || e.which) == 37) {
                rendition.prev();
            }

            // Right Key
            if ((e.keyCode || e.which) == 39) {
                rendition.next();
            }

        };
        rendition.on("keyup", keyListener);
        document.addEventListener("keyup", keyListener, false);
        //#endregion

        //#region Note For One Page Handler
        $('.uk-navbar-right').on('click', 'li', function () {
            //let color = $(this).find("a").attr("style").replace("background-color:", "");
            var highlighterText = $(this).find("#add-note");
            if (highlighterText != null) {
                cfiRange = highlighterText.attr('value');
                if (highlighterText.attr('value')) {
                    $(".popup").hide();

                    var index = document.getElementById('current-page').textContent;



                    if (highlighterText.attr('name') != "white") {
                        rendition.annotations.highlight(highlighterText.attr('value'), highlighterText.attr('name'), {}, (e) => {
                            console.log("highlight clicked", e.target);
                        });
                    }

                    var cfiRange = highlighterText.attr('value');
                    var color = highlighterText.attr('name');
                    var highlightText = highlighterText.attr('title');
                    var productId = document.getElementById('ProductId').textContent.trim();
                    var href = rendition.location.start.href;

                    //var token = document.getElementById("Token").textContent;

                    var epubRequest = {
                        //token: token,
                        cfiRange: cfiRange,
                        href: href,
                        productId: productId,
                        indexNumber: index,
                        color: color,
                        text: highlightText
                    }
                    $.ajax({
                        url: '/api/SaveUserHighlightOfBook',
                        data: JSON.stringify(epubRequest),
                        type: "post",
                        dataType: 'json',
                        contentType: 'application/json',
                        cache: false,
                        success: function (data) {
                            if (data.EpubBookTagNote != null) {
                                var note = "";
                                if (data.EpubBookTagNote.Note != null) {
                                    note = data.EpubBookTagNote.Note;
                                }
                                $(".page-wrapper").addClass("toggled");
                                var divcard = document.createElement('div');
                                divcard.classList.add('card');
                                divcard.style.margin = '5px';
                                divcard.setAttribute("id", "tag" + data.EpubBookTagNote.Id);
                                divcard.innerHTML = "<div class='uk-card uk-card-default uk-text-right' title='" + data.EpubBookTagNote.Id + "'><div class='uk-card-header uk-padding-small uk-padding-remove-bottom'><div class='uk-flex-middle'><h5 class='uk-card-title uk-margin-small-bottom uk-text-bold'><span class='uk-label' style='background-color:" + data.EpubBookTagNote.HighlightColor + "!important'><a id='gotocfi_" + data.EpubBookTagNote.Id + "'>" + data.EpubBookTagNote.HighlightText + "</a></span></h5><p class='uk-text-meta uk-margin-remove'><time datetime='2016-04-01T19:00'>" + data.EpubBookTagNote.CDate + "</time></p></div></div><div class='uk-card-body uk-padding-small uk-padding'><p>یادداشت ندارد</p></div></div>";
                                //divcard.innerHTML = "<div class='card-header'>" + data.EpubBookTagNote.CDate + "<i class='fas fa-tint' style='color:" + data.EpubBookTagNote.HighlightColor + "'></i></div><div class='card-body'><a href='" + data.EpubBookTagNote.CfiRange + "' id='gotocfi_" + data.EpubBookTagNote.Id + "'>" + data.EpubBookTagNote.HighlightText + "</a></div><div class='card-footer'><div class='form-group'><form action='/Products/UpdateUserHighlightOfBook' data-ajax='true' data-ajax-method='Post' data-ajax-mode='replace' data-ajax-update='#result' id='form0' method='post'><div class='row'><div class='col-9'><textarea class='form-control' name='Note' id='Note' placeholder='یادداشت' rows='1'>" + note + "</textarea></div><div class='col-2'><input type='number' name='Id' value='" + data.EpubBookTagNote.Id + "' hidden=''><input class='btn btn-success' type='submit' value='ثبت'></div></div></div></form></div></div>";
                                var highlightdiv = document.getElementById("tag");
                                if (data.EpubBookTagNote.HighlightColor == "white") {
                                    divcard.innerHTML = "<div class='uk-card uk-card-default uk-text-right' title='" + data.EpubBookTagNote.Id + "'><div class='uk-card-header uk-padding-small uk-padding-remove-bottom'><div class='uk-flex-middle'><h5 class='uk-card-title uk-margin-small-bottom uk-text-bold'><span class='uk-label' style='background-color:" + data.EpubBookTagNote.HighlightColor + "!important'><a style='color:#000 !important' id='gotocfi_" + data.EpubBookTagNote.Id + "'>" + data.EpubBookTagNote.HighlightText + "</a></span></h5><p class='uk-text-meta uk-margin-remove'><time datetime='2016-04-01T19:00'>" + data.EpubBookTagNote.CDate + "</time></p></div></div><div class='uk-card-body uk-padding-small uk-padding'><p>یادداشت ندارد</p></div></div>";

                                    highlightdiv = document.getElementById("note");

                                    $("#tagId").val(data.EpubBookTagNote.Id);
                                    $("#text-tag-message").val("");

                                    UIkit.offcanvas("#offcanvas-slide").show();
                                    UIkit.switcher("#switcher-item").show(2);
                                }
                                highlightdiv.appendChild(divcard);

                                var gotonote = document.getElementById("gotocfi_" + data.EpubBookTagNote.Id);
                                gotonote.onclick = function () {

                                    rendition.display(data.EpubBookTagNote.CfiRange);
                                    $(".page-wrapper").removeClass("toggled");
                                    flaglastpage = true;

                                };
                                var getnote = document.getElementById("tag" + data.EpubBookTagNote.Id);
                                getnote.onclick = function () {
                                    $("#tagId").val(data.EpubBookTagNote.Id);
                                    $("#text-tag-message").val("");
                                    openBottomSheet("bottom-sheet-add-tag");
                                };
                            }

                        },
                        error: function (xhr, ajaxOptions, thrownError) {
                        }
                    });

                }
            }
        });
        //#endregion

        //#region Highlight And Selected Handler
        $('.popupHbtn').on('click', function () {
            //let color = $(this).find("a").attr("style").replace("background-color:", "");
            $(".popup").hide();
            UIkit.offcanvas("#offcanvas-slide").show();
            UIkit.switcher("#switcher-item").show(1);
            var index = document.getElementById('current-page').textContent;


            var highlighterText = $(this)[0];


            if (highlighterText != null) {
                cfiRange = $("#highlightinfo").attr('value');
                if (cfiRange != "" && cfiRange != 0) {
                    if (rendition.annotations._annotationsBySectionIndex[index] != undefined) {
                        if (rendition.annotations._annotationsBySectionIndex[index].filter(p => p != cfiRange)) {
                            flag = false;
                        }
                    }


                    if (flag) {
                        rendition.annotations.remove(cfiRange);
                        flag = false;
                    } else {
                        if (highlighterText.innerText != "white") {
                            rendition.annotations.highlight(cfiRange, highlighterText.innerText, {}, (e) => {
                                console.log("highlight clicked", e.target);
                            });
                        }

                        var cfiRange = cfiRange;
                        var color = highlighterText.innerText;
                        var highlightText = $("#highlightinfo").attr('title');
                        var productId = document.getElementById('ProductId').textContent.trim();
                        var href = rendition.location.start.href;
                        //var token = document.getElementById("Token").textContent;

                        var epubRequest = {
                            //token: token,
                            cfiRange: cfiRange,
                            href: href,
                            productId: productId,
                            indexNumber: index,
                            color: color,
                            text: highlightText
                        }
                        $.ajax({
                            url: '/api/SaveUserHighlightOfBook',
                            data: JSON.stringify(epubRequest),
                            type: "post",
                            dataType: 'json',
                            contentType: 'application/json',
                            cache: false,
                            success: function (data) {
                                if (data.EpubBookTagNote != null) {
                                    var note = "";
                                    if (data.EpubBookTagNote.Note != null) {
                                        note = data.EpubBookTagNote.Note;
                                    }
                                    $(".page-wrapper").addClass("toggled");
                                    var divcard = document.createElement('div');
                                    divcard.classList.add('card');
                                    divcard.style.margin = '5px';
                                    divcard.setAttribute("id", "tag" + data.EpubBookTagNote.Id);
                                    divcard.innerHTML = "<div class='uk-card uk-card-default uk-text-right' title='" + data.EpubBookTagNote.Id + "'><div class='uk-card-header uk-padding-small uk-padding-remove-bottom'><div class='uk-flex-middle'><h5 class='uk-card-title uk-margin-small-bottom uk-text-bold'><span class='uk-label' style='background-color:" + data.EpubBookTagNote.HighlightColor + "!important'><a id='gotocfi_" + data.EpubBookTagNote.Id + "'>" + data.EpubBookTagNote.HighlightText + "</a></span></h5><p class='uk-text-meta uk-margin-remove'><time datetime='2016-04-01T19:00'>" + data.EpubBookTagNote.CDate + "</time></p></div></div><div class='uk-card-body uk-padding-small uk-padding'><p>یادداشت ندارد</p></div></div>";
                                    //divcard.innerHTML = "<div class='card-header'>" + data.EpubBookTagNote.CDate + "<i class='fas fa-tint' style='color:" + data.EpubBookTagNote.HighlightColor + "'></i></div><div class='card-body'><a href='" + data.EpubBookTagNote.CfiRange + "' id='gotocfi_" + data.EpubBookTagNote.Id + "'>" + data.EpubBookTagNote.HighlightText + "</a></div><div class='card-footer'><div class='form-group'><form action='/Products/UpdateUserHighlightOfBook' data-ajax='true' data-ajax-method='Post' data-ajax-mode='replace' data-ajax-update='#result' id='form0' method='post'><div class='row'><div class='col-9'><textarea class='form-control' name='Note' id='Note' placeholder='یادداشت' rows='1'>" + note + "</textarea></div><div class='col-2'><input type='number' name='Id' value='" + data.EpubBookTagNote.Id + "' hidden=''><input class='btn btn-success' type='submit' value='ثبت'></div></div></div></form></div></div>";
                                    var highlightdiv = document.getElementById("tag");
                                    if (data.EpubBookTagNote.HighlightColor == "white") {
                                        divcard.innerHTML = "<div class='uk-card uk-card-default uk-text-right' title='" + data.EpubBookTagNote.Id + "'><div class='uk-card-header uk-padding-small uk-padding-remove-bottom'><div class='uk-flex-middle'><h5 class='uk-card-title uk-margin-small-bottom uk-text-bold'><span class='uk-label' style='background-color:" + data.EpubBookTagNote.HighlightColor + "!important'><a style='color:#000 !important' id='gotocfi_" + data.EpubBookTagNote.Id + "'>" + data.EpubBookTagNote.HighlightText + "</a></span></h5><p class='uk-text-meta uk-margin-remove'><time datetime='2016-04-01T19:00'>" + data.EpubBookTagNote.CDate + "</time></p></div></div><div class='uk-card-body uk-padding-small uk-padding'><p>یادداشت ندارد</p></div></div>";

                                        highlightdiv = document.getElementById("note");

                                        $("#tagId").val(data.EpubBookTagNote.Id);
                                        $("#text-tag-message").val("");

                                        UIkit.offcanvas("#offcanvas-slide").show();
                                        UIkit.switcher("#switcher-item").show(2);
                                    }
                                    highlightdiv.appendChild(divcard);

                                    var gotonote = document.getElementById("gotocfi_" + data.EpubBookTagNote.Id);
                                    gotonote.onclick = function () {
                                        rendition.display(data.EpubBookTagNote.CfiRange);
                                        $(".page-wrapper").removeClass("toggled");
                                        flaglastpage = true;

                                    };
                                    var getnote = document.getElementById("tag" + data.EpubBookTagNote.Id);
                                    getnote.onclick = function () {
                                        $("#tagId").val(data.EpubBookTagNote.Id);
                                        $("#text-tag-message").val("");
                                        openBottomSheet("bottom-sheet-add-tag");
                                    };
                                }

                            },
                            error: function (xhr, ajaxOptions, thrownError) {
                            }
                        });

                        flag = true;
                    }
                }
            }
        });
        $('.popup').on('click', 'span', function () {
            //let color = $(this).find("a").attr("style").replace("background-color:", "");
            $(".popup").hide();
            UIkit.offcanvas("#offcanvas-slide").show();
            UIkit.switcher("#switcher-item").show(1);
            var index = document.getElementById('current-page').textContent;
            var highlighterText = $(this).find("a");
            if (highlighterText != null) {
                cfiRange = highlighterText.attr('value');
                if (highlighterText.attr('value') != "" && highlighterText.attr('value') != 0) {
                    if (rendition.annotations._annotationsBySectionIndex[index] != undefined) {
                        if (rendition.annotations._annotationsBySectionIndex[index].filter(p => p != cfiRange)) {
                            flag = false;
                        }
                    }


                    if (flag) {
                        rendition.annotations.remove(highlighterText.attr('value'));
                        flag = false;
                    } else {
                        if (highlighterText.attr('name') != "white") {
                            rendition.annotations.highlight(highlighterText.attr('value'), highlighterText.attr('name'), {}, (e) => {
                                console.log("highlight clicked", e.target);
                            });
                        }

                        var cfiRange = highlighterText.attr('value');
                        var color = highlighterText.attr('name');
                        var highlightText = highlighterText.attr('title');
                        var productId = document.getElementById('ProductId').textContent.trim();
                        var href = rendition.location.start.href;
                        //var token = document.getElementById("Token").textContent;

                        var epubRequest = {
                            //token: token,
                            cfiRange: cfiRange,
                            href: href,
                            productId: productId,
                            indexNumber: index,
                            color: color,
                            text: highlightText
                        }
                        $.ajax({
                            url: '/api/SaveUserHighlightOfBook',
                            data: JSON.stringify(epubRequest),
                            type: "post",
                            dataType: 'json',
                            contentType: 'application/json',
                            cache: false,
                            success: function (data) {
                                if (data.EpubBookTagNote != null) {
                                    var note = "";
                                    if (data.EpubBookTagNote.Note != null) {
                                        note = data.EpubBookTagNote.Note;
                                    }
                                    $(".page-wrapper").addClass("toggled");
                                    var divcard = document.createElement('div');
                                    divcard.classList.add('card');
                                    divcard.style.margin = '5px';
                                    divcard.setAttribute("id", "tag" + data.EpubBookTagNote.Id);
                                    divcard.innerHTML = "<div class='uk-card uk-card-default uk-text-right' title='" + data.EpubBookTagNote.Id + "'><div class='uk-card-header uk-padding-small uk-padding-remove-bottom'><div class='uk-flex-middle'><h5 class='uk-card-title uk-margin-small-bottom uk-text-bold'><span class='uk-label' style='background-color:" + data.EpubBookTagNote.HighlightColor + "!important'><a id='gotocfi_" + data.EpubBookTagNote.Id + "'>" + data.EpubBookTagNote.HighlightText + "</a></span></h5><p class='uk-text-meta uk-margin-remove'><time datetime='2016-04-01T19:00'>" + data.EpubBookTagNote.CDate + "</time></p></div></div><div class='uk-card-body uk-padding-small uk-padding'><p>یادداشت ندارد</p></div></div>";
                                    //divcard.innerHTML = "<div class='card-header'>" + data.EpubBookTagNote.CDate + "<i class='fas fa-tint' style='color:" + data.EpubBookTagNote.HighlightColor + "'></i></div><div class='card-body'><a href='" + data.EpubBookTagNote.CfiRange + "' id='gotocfi_" + data.EpubBookTagNote.Id + "'>" + data.EpubBookTagNote.HighlightText + "</a></div><div class='card-footer'><div class='form-group'><form action='/Products/UpdateUserHighlightOfBook' data-ajax='true' data-ajax-method='Post' data-ajax-mode='replace' data-ajax-update='#result' id='form0' method='post'><div class='row'><div class='col-9'><textarea class='form-control' name='Note' id='Note' placeholder='یادداشت' rows='1'>" + note + "</textarea></div><div class='col-2'><input type='number' name='Id' value='" + data.EpubBookTagNote.Id + "' hidden=''><input class='btn btn-success' type='submit' value='ثبت'></div></div></div></form></div></div>";
                                    var highlightdiv = document.getElementById("tag");
                                    if (data.EpubBookTagNote.HighlightColor == "white") {
                                        divcard.innerHTML = "<div class='uk-card uk-card-default uk-text-right' title='" + data.EpubBookTagNote.Id + "'><div class='uk-card-header uk-padding-small uk-padding-remove-bottom'><div class='uk-flex-middle'><h5 class='uk-card-title uk-margin-small-bottom uk-text-bold'><span class='uk-label' style='background-color:" + data.EpubBookTagNote.HighlightColor + "!important'><a style='color:#000 !important' id='gotocfi_" + data.EpubBookTagNote.Id + "'>" + data.EpubBookTagNote.HighlightText + "</a></span></h5><p class='uk-text-meta uk-margin-remove'><time datetime='2016-04-01T19:00'>" + data.EpubBookTagNote.CDate + "</time></p></div></div><div class='uk-card-body uk-padding-small uk-padding'><p>یادداشت ندارد</p></div></div>";

                                        highlightdiv = document.getElementById("note");

                                        $("#tagId").val(data.EpubBookTagNote.Id);
                                        $("#text-tag-message").val("");

                                        UIkit.offcanvas("#offcanvas-slide").show();
                                        UIkit.switcher("#switcher-item").show(2);
                                    }
                                    highlightdiv.appendChild(divcard);

                                    var gotonote = document.getElementById("gotocfi_" + data.EpubBookTagNote.Id);
                                    gotonote.onclick = function () {
                                        rendition.display(data.EpubBookTagNote.CfiRange);
                                        $(".page-wrapper").removeClass("toggled");
                                        flaglastpage = true;

                                    };
                                    var getnote = document.getElementById("tag" + data.EpubBookTagNote.Id);
                                    getnote.onclick = function () {
                                        $("#tagId").val(data.EpubBookTagNote.Id);
                                        $("#text-tag-message").val("");
                                        openBottomSheet("bottom-sheet-add-tag");
                                    };
                                }

                            },
                            error: function (xhr, ajaxOptions, thrownError) {
                            }
                        });

                        flag = true;
                    }
                }
            }
        });

        var flag = false;


        function drawBorderAroundSelection(contents, cfiRange) {
            $(".popup").show();

            var selection = contents.window.getSelection(), // get the selection then
                range = selection.getRangeAt(0), // the range at first selection group
                rect = range.getBoundingClientRect(); // and convert this to useful data
            var selectText = range.startContainer.wholeText.substr(range.startOffset, (range.endOffset - range.startOffset));
            $("#highlightinfo").attr("value", cfiRange);
            $("#highlightinfo").attr("title", selectText);
            //$(".popup .uk-dotnav > li").each(function (index) {
            //    var thiselement = $(this).find("a");
            //    var color = thiselement.text();
            //    thiselement.attr("value", cfiRange);
            //    thiselement.attr("name", color);
            //    thiselement.attr("title", selectText);
            //    console.log(index + ": " + $(this).text());
            //});
            $(".popup >span> #add-tag").each(function (index) {
                var color = $(this).attr("data-color");
                $(this).attr("value", cfiRange);
                $(this).attr("name", color);
                $(this).attr("title", selectText);
                console.log(index + ": " + $(this).text());
            });

        }


        function onmousedownselected(e, contents) {
            contents.window.getSelection().removeAllRanges();
            $(".popup").hide();
        }


        function ontouchendselected(e) {
            $(".popup").css({ left: e.changedTouches[0].screenX - 280 });
            $(".popup").css({ top: e.changedTouches[0].pageY });

        }
        $("#chosecolor").click(function () {
            setTimeout(function () {
                var chosecolordiv = $(".popup").find("div").offset();
                var windowsWidth = $(window).width();
                if ((chosecolordiv.left + $(".popup").find("div").width()) > windowsWidth) {
                    var left = $(".popup").find("div").position().left - ((chosecolordiv.left + $(".popup").find("div").width()) - windowsWidth);

                    $(".popup").find("div").css('left', left);

                }
            },
                500);
        });
        // Apply a class to selected text
        rendition.on("selected", function (cfiRange, contents) {
            $(".popup").hide();
            //$(".popup").find("div").css('display', 'none');

            var mouse = contents.window.getSelection().getRangeAt(0).getClientRects()[0];





            //if device is mobile
            //if (
            //    /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i
            //        .test(navigator.userAgent) ||
            //        /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i
            //        .test(navigator.userAgent.substr(0, 4))) {
            //    $(".popup").css({ left: mouse.x -400});

            //} else {
            //    $(".popup").css({ left: mouse.x });

            //}
            $(".popup").css({ left: mouse.x });

            $(".popup").css({ top: mouse.y });


            drawBorderAroundSelection(contents, cfiRange)
            contents.window.onmousedown = function (e) { onmousedownselected(e, contents); };
            //contents.window.ontouchend = function (e) { ontouchendselected(e); };

        });

        //#endregion

        //#region Book Ready
        book.ready.then(function () {
            var $viewer = document.getElementById("pages");
            $viewer.classList.remove("loading");

        });
        //#endregion

        //#region Load Navigation
        book.loaded.navigation.then(function (toc) {
            var $nav = document.getElementById("toc"),
                docfrag = document.createDocumentFragment();

            toc.forEach(function (chapter, index) {
                var item = document.createElement("li");
                var link = document.createElement("a");
                link.id = "chap-" + chapter.id;
                link.textContent = chapter.label;
                link.href = chapter.href;
                item.appendChild(link);
                docfrag.appendChild(item);

                link.onclick = function () {
                    var url = link.getAttribute("href");
                    flaglastpage = true;
                    rendition.display(url);
                    UIkit.offcanvas("#offcanvas-slide").hide();

                    return false;
                };

            });

            $nav.appendChild(docfrag);


        });
        //#endregion

        //#region Load Metadata
        book.loaded.metadata.then(function (meta) {
            var $title = document.getElementById("title");
            var $author = document.getElementById("author");
            var $cover = document.getElementById("cover");
            var $bookcover = document.getElementById("book-cover");
            var $nav = document.getElementById('navigation');

            $title.textContent = meta.title;
            $author.textContent = meta.creator;
            if (book.archive) {
                book.archive.createUrl(book.cover)
                    .then(function (url) {
                        $cover.src = url;
                        $bookcover.style.backgroundImage = "url('" + url + "')";
                    })
            } else {
                $cover.src = book.cover;
                $bookcover.style.backgroundImage = "url('" + book.cover + "')";
            }

        });
        //#endregion

        //#region When navigating to the next/previous page
        rendition.on('relocated', function (locations) {



            var productId = document.getElementById('ProductId').textContent.trim();
            //var token = document.getElementById("Token").textContent;
            //note config for send note
            var cfiRange = locations.start.cfi;
            $("#add-note").attr("value", cfiRange);
            $("#add-note").attr("name", "white");
            $("#add-note").attr("title", "صفحه " + locations.start.displayed.page);


            //currnt page / total pages
            var currentPage = locations.start.displayed.page;
            var EndPage = locations.start.displayed.total;
            $("#current-page").text(currentPage);
            $("#total-page").text(EndPage);

            //empty tag div for load current page options(note,highlight,...)
            $("#tag").empty();
            $("#note").empty();


            //End of Book
            if (locations.atEnd == true) {
                //var token = document.getElementById("Token").textContent;

                var productId = document.getElementById("ProductId").textContent;

                var epubRequest = {
                    //token: token,
                    productId: productId
                }
                $.ajax({
                    url: '/api/CompleteReadProduct',
                    data: JSON.stringify(epubRequest),
                    type: "post",
                    dataType: 'json',
                    contentType: 'application/json',
                    cache: false,
                    success: function (data) {
                        if (data.Status == 1) {
                            console.log(data.Message + " CompleteReadProduct ");
                        } else {
                            console.log(data.Message + " CompleteReadProduct ");
                        }

                    },
                    error: function () {
                        console.log("Server Error CompleteReadProduct ");
                    }

                });
            }

            //load book setting
            if (firstload) {
                var epubRequest = {
                    //token: token,
                    productId: productId
                }
                $.ajax({
                    url: '/api/BookSetting',
                    data: JSON.stringify(epubRequest),
                    type: "post",
                    dataType: 'json',
                    contentType: 'application/json',
                    cache: false,
                    success: function (data) {
                        if (data.UsersEpubBookInfo)
                            applyFont(data.UsersEpubBookInfo.FontFamily, data.UsersEpubBookInfo.FontSize);
                        if (data.UsersEpubBookInfo.FontFamily)
                            fontFamily = data.UsersEpubBookInfo.FontFamily;
                        if (data.UsersEpubBookInfo.FontSize)
                            fontSize = data.UsersEpubBookInfo.FontSize;

                        var thems = data;
                        setTimeout(() => {
                            //LastPageOfBook
                            $.ajax({
                                url: '/api/LastPageOfBook',
                                data: JSON.stringify(epubRequest),
                                type: "post",
                                dataType: 'json',
                                contentType: 'application/json',
                                success: function (data) {
                                    if (data.ProductSeenInfo) {
                                        if (data.ProductSeenInfo.BookLastseenPage) {
                                            var cfi = new ePub.CFI(data.ProductSeenInfo.BookLastseenPage).toString();
                                            if (cfi) {
                                                book.rendition.display(cfi);

                                            }
                                        }

                                        if (thems.UsersEpubBookInfo.Background && thems.UsersEpubBookInfo.TextColor) {
                                            setTimeout(() => {
                                                applyTheme(thems.UsersEpubBookInfo.Background, thems.UsersEpubBookInfo.TextColor);
                                                if (thems.UsersEpubBookInfo.Background)
                                                    background = thems.UsersEpubBookInfo.Background;
                                                if (thems.UsersEpubBookInfo.TextColor)
                                                    textColor = thems.UsersEpubBookInfo.TextColor;
                                                $('.spinner').css('display', 'none');

                                            }, 2000);
                                        }

                                    }
                                    else {
                                        $('.spinner').css('display', 'none');
                                    }
                                },
                                error: function (xhr, ajaxOptions, thrownError) {
                                }
                            });

                            //LastPageOfBook
                        }, 2000);
                    },
                    error: function (xhr, ajaxOptions, thrownError) {
                    }
                });
                firstload = false;
            }


            //#region Load HighlightList
            //var token = document.getElementById("Token").textContent;
            var index = document.getElementById('current-page').textContent;
            var href = locations.start.href;
            var epubRequest = {
                //token: token,
                productId: productId,
                href: href,
                pageNumber: index
            }
            $.ajax({
                url: '/api/HighlightListOfBook',
                data: JSON.stringify(epubRequest),
                type: "post",
                dataType: 'json',
                contentType: 'application/json',
                cache: false,
                success: function (data) {
                    if (data.EpubBookTagNotes)
                        if (data.EpubBookTagNotes.length > 0) {
                            data.EpubBookTagNotes.forEach(cfiFunction);

                        }
                },
                error: function (xhr, ajaxOptions, thrownError) {
                }
            });

            function cfiFunction(item, index) {
                var note = "";
                if (item.Note != null) {
                    note = item.Note;
                }
                var divcard = document.createElement('div');
                divcard.classList.add('card');
                divcard.style.margin = '5px';
                divcard.setAttribute("id", "tag" + item.Id);
                //divcard.innerHTML = "<div class='card-header'>"+item.CDate+"<i class='fas fa-tint' style='color:"+item.HighlightColor+"'></i></div><div class='card-body'><a href='"+item.CfiRange+"' id='gotocfi_"+item.Id+"'>"+item.HighlightText+"</a></div><div class='card-footer'><div class='form-group'><form action='/Products/UpdateUserHighlightOfBook' data-ajax='true' data-ajax-method='Post' data-ajax-mode='replace' data-ajax-update='#result' id='form0' method='post'><div class='row'><div class='col-9'><textarea class='form-control' name='Note' id='Note' placeholder='یادداشت' rows='1'>"+note+"</textarea></div><div class='col-2'><input type='number' name='Id' value='"+item.Id+"' hidden=''><input class='btn btn-success' type='submit' value='ثبت'></div></div></div></form></div></div>";
                var highlightdiv = document.getElementById("tag");
                if (item.HighlightColor == "white") {
                    divcard.innerHTML = "<div class='uk-card uk-card-default uk-text-right' title='" + item.Id + "'><div class='uk-card-header uk-padding-small uk-padding-remove-bottom'><div class='uk-flex-middle'><h5 class='uk-card-title uk-margin-small-bottom uk-text-bold'><span class='uk-label' style='background-color:" + item.HighlightColor + "!important'><a style='color:#000 !important' id='gotocfi_" + item.Id + "'>" + item.HighlightText + "</a></span></h5><p class='uk-text-meta uk-margin-remove'><time datetime='2016-04-01T19:00'>" + item.CDate + "</time></p></div></div><div class='uk-card-body uk-padding-small uk-padding'><p>" + note + "</p></div></div>";

                    highlightdiv = document.getElementById("note");
                } else {
                    divcard.innerHTML = "<div class='uk-card uk-card-default uk-text-right' title='" + item.Id + "'><div class='uk-card-header uk-padding-small uk-padding-remove-bottom'><div class='uk-flex-middle'><h5 class='uk-card-title uk-margin-small-bottom uk-text-bold'><span class='uk-label' style='background-color:" + item.HighlightColor + "!important'><a id='gotocfi_" + item.Id + "'>" + item.HighlightText + "</a></span></h5><p class='uk-text-meta uk-margin-remove'><time datetime='2016-04-01T19:00'>" + item.CDate + "</time></p></div></div><div class='uk-card-body uk-padding-small uk-padding'><p>" + note + "</p></div></div>";

                    rendition.annotations.highlight(item.CfiRange, item.HighlightColor, {}, (e) => {
                        console.log("highlight clicked", e.target);
                    });
                }

                highlightdiv.appendChild(divcard);
                var gotonote = document.getElementById("gotocfi_" + item.Id);
                gotonote.onclick = function () {
                    rendition.display(item.CfiRange);
                    $(".page-wrapper").removeClass("toggled");
                    flaglastpage = true;

                };
                var getnote = document.getElementById("tag" + item.Id);
                getnote.onclick = function () {
                    $("#tagId").val(item.Id);
                    $("#text-tag-message").val("");
                    openBottomSheet("bottom-sheet-add-tag");
                };

            }
            //#endregion

            //save last page
            if (flaglastpage) {
                //var token = document.getElementById("Token").textContent;
                var productId = document.getElementById('ProductId').textContent.trim();

                var href = locations.start.cfi;
                var epubRequest = {
                    //token: token,
                    href: href,
                    productId: productId
                }
                $.ajax({
                    url: '/api/SaveLastPageOfBook',
                    data: JSON.stringify(epubRequest),
                    type: "post",
                    dataType: 'json',
                    contentType: 'application/json',
                    cache: false,
                    success: function (data) {
                        if (data.Status == 1) {
                            console.log(data.Message + " SaveLastPageOfBook ");
                        } else {
                            console.log(data.Message + " SaveLastPageOfBook ");
                        }


                    },
                    error: function (xhr, ajaxOptions, thrownError) {

                        console.log("Server Error SaveLastPageOfBook");

                    }
                });
            }


            applyFont(fontFamily, fontSize);
            applyTheme(background, textColor);
        });
        //#endregion

        //#region Register
        book.rendition.hooks.content.register(function (contents, view) {

            contents.window.addEventListener('scrolltorange', function (e) {
                var range = e.detail;
                var cfi = new ePub.CFI(range, contents.cfiBase).toString();
                if (cfi) {
                    book.rendition.display(cfi);
                }
                e.preventDefault();
            });
            contents.window.addEventListener('contextmenu', function (e) {
                e.preventDefault();
            });

        });
        //#endregion

        function openBottomSheet(id) {
            $(".popup").hide();
            $("#" + id).removeClass("bottom-sheet-dialog-close");
            $("#" + id + " .bottom-sheet-dialog-child .animated").addClass("slideInUp");
            $("#" + id + " .bottom-sheet-dialog-child .animated").removeClass("slideInDown");
        }
    };

    //#region sendAnnotation
    window.sendAnnotation = () => {
        //var token = document.getElementById("Token").textContent;


        var tagId = $("#tagId").val();
        var text = $("#text-tag-message").val();
        var epubRequest = {
            //token: token,
            Id: tagId,
            text: text
        }
        $.ajax({
            url: '/api/SaveAnnotation',
            data: JSON.stringify(epubRequest),
            type: "post",           
            dataType: 'json',
            contentType: 'application/json',
            cache: false,
            success: function (data) {
                if (data.Status == 1) {
                    $("#tag" + tagId).html(data.Message);
                } else {
                    console.log("برنگشت");
                }

                closeBottomSheet("bottom-sheet-add-tag");
                UIkit.offcanvas("#offcanvas-slide").show();
            },
            error: function (xhr, ajaxOptions, thrownError) {

                console.log("Server Error SaveAnnotation");

            }
        });
    }
    
};
//#endregion
