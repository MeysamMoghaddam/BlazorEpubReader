export function epubfunc(epubFile, LastPageCfi, background, highlights, fontsize, fontface) {

    let selectedCfiRange = "";
    let selectedtext = "";
    let currentPageNumber = 0;
    let isAnnotation = false;
    let FirstRender = 0;
    var book = ePub(epubFile);
    var rendition = book.renderTo("area", {
        width: "100%",
        height: "100%",
        direction: "rtl"
    });

    if (LastPageCfi) {
        rendition.display(LastPageCfi);
    } else {
        rendition.display();
    }
  
    //register FontFace
    rendition.themes.register("Style", "/_content/BlazorEpub/BlazorEpub.bundle.scp.css");
    rendition.themes.select("Style");
    rendition.on("click", function (e) {
        DotNet.invokeMethodAsync('BlazorEpub', 'OnCloseSideBarFromJs');
    });

   
    //#region Next / Prev Button EventListener
    var next = document.getElementById("next");
    next.addEventListener("click", function (e) {
        rendition.next();
        e.preventDefault();
        //flaglastpage = true;


    }, false);

    var prev = document.getElementById("prev");
    prev.addEventListener("click", function (e) {
        rendition.prev();
        e.preventDefault();
        //flaglastpage = true;

    }, false);
    //#endregion

    //#region rendered
    rendition.on("rendered", function (section) {

        var current = book.navigation && book.navigation.get(section.href);
        if (current) {
            document.title = current.label;
        }
        if (background) {
            switch (background) {
                case "dark":
                    rendition.getContents().forEach(c => c.addStylesheetRules({
                        "body": {
                            "background": "#343a40",
                            "color": "#f8f9fa"
                        }

                    }));
                    break;
                case "secondary":
                    rendition.getContents().forEach(c => c.addStylesheetRules({
                        "body": {
                            "background": "#6c757d",
                            "color": "#f8f9fa"
                        }

                    }));
                    break;
                case "light":
                    rendition.getContents().forEach(c => c.addStylesheetRules({
                        "body": {
                            "background": "#f8f9fa",
                            "color": "#6c757d"
                        }

                    }));
                    break;
                case "white":
                    rendition.getContents().forEach(c => c.addStylesheetRules({
                        "body": {
                            "background": "#fff",
                            "color": "#343a40"
                        }

                    }));
                    break;
                default:
                    break;

            }
        }

        //#region font Setting
        if (fontface) {
            //rendition.themes.select(fontface);
            //rendition.themes.font(fontface);
            rendition.getContents().forEach(c => c.addStylesheetRules({
                "body": {
                    "font-family": `${fontface} !important`
                },
            }));
        }
        if (fontsize) {
            //rendition.themes.fontSize(parseInt(fontsize));
            rendition.getContents().forEach(c => c.addStylesheetRules({
                "body": {
                    "font-size": `${fontsize}px !important`
                },
            }));
        }
    //#endregion
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

    //#region Book Ready
    book.ready.then(function () {
        var $viewer = document.getElementById("spinerdiv");
        $viewer.classList.remove("d-block");
        $viewer.classList.add("d-none");

    });
    //#endregion

    //#region Load Navigation
    book.loaded.navigation.then(function (toc) {
        var $nav = document.getElementById("toc"),
            docfrag = document.createDocumentFragment();

        toc.forEach(function (chapter, index) {
            var item = document.createElement("li");
            var link = document.createElement("a");
            link.classList.add("text-white");
            item.classList.add("border-bottom");
            link.id = "chap-" + chapter.id;
            link.textContent = chapter.label;
            link.href = chapter.href;
            item.appendChild(link);
            docfrag.appendChild(item);

            link.onclick = function () {
                var url = link.getAttribute("href");
                //flaglastpage = true;
                rendition.display(url);
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
        //note config for send note
        //سی اف آی جاری
        var cfiRange = locations.start.cfi;
        //اچ رف جاری
        var href = locations.start.href;
        //شماره صفحه جاری
        currentPageNumber = locations.start.displayed.page;
        //تعداد کل صفحات
        var EndPage = locations.start.displayed.total;

        highlights.filter(p => p.cfiRange.split("!")[0] == cfiRange.split("!")[0] && p.pageNumber == currentPageNumber).forEach(p => {
            rendition.annotations.remove(p.cfiRange);
        });
        highlights.filter(p => p.cfiRange.split("!")[0] == cfiRange.split("!")[0] && p.pageNumber == currentPageNumber).forEach(p => {
            rendition.annotations.highlight(p.cfiRange, p.highlightColor, {}, (e) => {
                console.log("highlight clicked", e.target);
            });
        });

        DotNet.invokeMethodAsync('BlazorEpub', 'OnNavigatingPageFromJs', cfiRange, locations.start.displayed.page);

        //currnt page / total pages   
        document.getElementById("current-page").innerText = currentPageNumber;
        document.getElementById("total-page").innerText = EndPage;
        //$("#current-page").text(currentPageNumber);
        //$("#total-page").text(EndPage);


        //End of Book
        if (locations.atEnd == true) {
            alert("EndBook");
        }
       
        var highlightBlocks = document.querySelectorAll(".highlightBlock");
        highlightBlocks.forEach(p => {
            p.onclick = function () {
                selectedCfiRange = this.dataset.cfirange;
            }
        });
        //$('.highlightBlock').on('click', function () {

        //    selectedCfiRange = this.dataset.cfirange;
        //});

        if (LastPageCfi && fontface && fontsize && FirstRender < 2) {
            rendition.display(LastPageCfi);
            FirstRender++;
        }

    });
    //#endregion

    //#region Apply a class to selected text
    rendition.on("selected", function (cfiRange, contents) {
        var selection = contents.window.getSelection(), // get the selection then
            range = selection.getRangeAt(0), // the range at first selection group
            rect = range.getBoundingClientRect(); // and convert this to useful data
        var selectText = range.startContainer.wholeText.substr(range.startOffset, (range.endOffset - range.startOffset));

        selectedtext = selectText;
        selectedCfiRange = cfiRange;
        //سایدبار رو باز میکنه
        DotNet.invokeMethodAsync('BlazorEpub', 'OnSelectTextFromJs');
        var pageHref = rendition.location.start.href;
        isAnnotation = false;
        //ارسال مقادیر پیشفرض
        DotNet.invokeMethodAsync('BlazorEpub', 'OnHighlightTextFromJs', selectedCfiRange, "transparent", selectedtext, pageHref, currentPageNumber, isAnnotation);

    });
    //#endregion

    //#region Change background
    var backgroundoptions = document.querySelectorAll(".ebackgroundcolor");
    backgroundoptions.forEach(p => {
        p.onclick = function () {
            switch (this.dataset.ebgcolor) {
                case "dark":
                    rendition.getContents().forEach(c => c.addStylesheetRules({
                        "body": {
                            "background": "#343a40",
                            "color": "#f8f9fa"
                        }

                    }));
                    DotNet.invokeMethodAsync('BlazorEpub', 'OnChangeBackgroundFromJs', "dark");
                    break;
                case "secondary":
                    rendition.getContents().forEach(c => c.addStylesheetRules({
                        "body": {
                            "background": "#6c757d",
                            "color": "#f8f9fa"
                        }

                    }));
                    DotNet.invokeMethodAsync('BlazorEpub', 'OnChangeBackgroundFromJs', "secondary");
                    break;
                case "light":
                    rendition.getContents().forEach(c => c.addStylesheetRules({
                        "body": {
                            "background": "#f8f9fa",
                            "color": "#6c757d"
                        }

                    }));
                    DotNet.invokeMethodAsync('BlazorEpub', 'OnChangeBackgroundFromJs', "light");
                    break;
                case "white":
                    rendition.getContents().forEach(c => c.addStylesheetRules({
                        "body": {
                            "background": "#fff",
                            "color": "#343a40"
                        }

                    }));
                    DotNet.invokeMethodAsync('BlazorEpub', 'OnChangeBackgroundFromJs', "white");
                    break;
                default:
            }
            background = this.dataset.ebgcolor;
        }
    });
    //$('#background-dark').on('click', function () {
    //    background = "dark";
       
    //    rendition.getContents().forEach(c => c.addStylesheetRules({
    //        "body": {
    //            "background": "#343a40",
    //            "color": "#f8f9fa"
    //        }

    //    }));
    //    DotNet.invokeMethodAsync('BlazorEpub', 'OnChangeBackgroundFromJs', "dark");
    //});
    //$('#background-secondary').on('click', function () {
    //    background = "secondary";

    //    rendition.getContents().forEach(c => c.addStylesheetRules({
    //        "body": {
    //            "background": "#6c757d",
    //            "color": "#f8f9fa"
    //        }

    //    }));
    //    DotNet.invokeMethodAsync('BlazorEpub', 'OnChangeBackgroundFromJs', "secondary");

    //});
    //$('#background-light').on('click', function () {
    //    background = "light";

    //    rendition.getContents().forEach(c => c.addStylesheetRules({
    //        "body": {
    //            "background": "#f8f9fa",
    //            "color": "#6c757d"
    //        }

    //    }));
    //    DotNet.invokeMethodAsync('BlazorEpub', 'OnChangeBackgroundFromJs', "light");

    //});
    //$('#background-white').on('click', function () {
    //    background = "white";

    //    rendition.getContents().forEach(c => c.addStylesheetRules({
    //        "body": {
    //            "background": "#fff",
    //            "color": "#343a40"
    //        }

    //    }));
    //    DotNet.invokeMethodAsync('BlazorEpub', 'OnChangeBackgroundFromJs', "white");

    //});
    //#endregion

    //#region selectHighlight
    var highlightselectoptions = document.querySelectorAll(".highlight-select-option");
    highlightselectoptions.forEach(p => {
        p.onclick = function () {
            var color = this.dataset.color;
            var highlightselectoptions = document.querySelectorAll(".highlight-select-option");
            highlightselectoptions.forEach(p => {
                p.classList.remove("border");
            });
            this.classList.add("border");

            //اگر حاشیه نویسی نبود
            if (!isAnnotation) {
                rendition.annotations.remove(selectedCfiRange);
                rendition.annotations.highlight(selectedCfiRange, color, {}, (e) => {
                    console.log("highlight clicked", e.target);
                });

            }
            var pageHref = rendition.location.start.href;

            DotNet.invokeMethodAsync('BlazorEpub', 'OnHighlightTextFromJs', selectedCfiRange, color, selectedtext, pageHref, currentPageNumber, isAnnotation);

        }
    });
    //$('.highlight-select-option').on('click', function () {

    //    var color = this.dataset.color;
    //    var highlightselectoptions = document.querySelectorAll(".highlight-select-option");
    //    highlightselectoptions.forEach(p => {
    //        p.classList.remove("border");
    //    });
    //    this.classList.add("border");

    //    //اگر حاشیه نویسی نبود
    //    if (!isAnnotation) {
    //        rendition.annotations.remove(selectedCfiRange);
    //        rendition.annotations.highlight(selectedCfiRange, color, {}, (e) => {
    //            console.log("highlight clicked", e.target);
    //        });

    //    }
    //    var pageHref = rendition.location.start.href;

    //    DotNet.invokeMethodAsync('BlazorEpub', 'OnHighlightTextFromJs', selectedCfiRange, color, selectedtext, pageHref, currentPageNumber, isAnnotation);



    //});

    //#endregion
    var addAnnotations = document.querySelectorAll(".add-Annotation");
    addAnnotations.forEach(p => {
        p.onclick = function () {
            isAnnotation = true;
            selectedCfiRange = "";
            var highlightselectoptions = document.querySelectorAll(".highlight-select-option");
            highlightselectoptions.forEach(p => {
                p.classList.remove("border");
            });
        }
    });
    //$('.add-Annotation').on('click', function () {

    //    isAnnotation = true;
    //    selectedCfiRange = "";
    //    var highlightselectoptions = document.querySelectorAll(".highlight-select-option");
    //    highlightselectoptions.forEach(p => {
    //        p.classList.remove("border");
    //    });
    //});
    var fontSizeOptions = document.querySelectorAll(".FontSizeOption");
    fontSizeOptions.forEach(p => {
        p.onclick = function () {
            fontsize = this.dataset.size;
            rendition.getContents().forEach(c => c.addStylesheetRules({
                "body": {
                    "font-size": `${this.dataset.size}px !important`
                },
            }));
        }
    });
    //$('.FontSizeOption').on('click', function () {
    //    fontsize = this.dataset.size;
    //    rendition.getContents().forEach(c => c.addStylesheetRules({
    //        "body": {
    //            "font-size": `${this.dataset.size}px !important`
    //        },
    //    }));
    //});
    var fontFaceOptions = document.querySelectorAll(".FontFaceOption");
    fontFaceOptions.forEach(p => {
        p.onclick = function () {
            fontface = this.dataset.fontface;
            rendition.getContents().forEach(c => c.addStylesheetRules({
                "body": {
                    "font-family": `${this.dataset.fontface} !important`
                },
            }));
        }
    });
    document.body.style.overflow = "hidden";
    //$('.FontFaceOption').on('click', function () {
    //    fontface = this.dataset.fontface;
    //    rendition.getContents().forEach(c => c.addStylesheetRules({
    //        "body": {
    //            "font-family": `${this.dataset.fontface} !important`
    //        },
    //    }));
    //});

   
}

