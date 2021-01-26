# BlazorEpub
BlazorEpub is a Razor Class Library using the [Epub.js](https://github.com/futurepress/epub.js/) library for handle and render epub documents in Razor pages.
Tested on Blazor Wasm projects without need to any css resourse and style.This package is currently in Persian, you add other languages.

# What Is an EPUB File?
EPUB files can store words, images, stylesheets, fonts, metadata details, and tables of content.
They are considered layout agnostic, meaning that screen size doesn’t affect the formatting—EPUB files can display content on screens as small as 3.5″.
This and the fact it’s a freely available standard is why a majority of eReaders support EPUB files.

# Install
Install this package in client_side project packages with:
```
Install-Package BlazorEpubReader -Version x.x
``` 
x.x is version of package for use last version see https://www.nuget.org/packages/BlazorEpubReader

# How to use
add js files in client_side _Host.cshml or index.html

Befor closed body tag:
```
<script src="_content/BlazorEpub/jszip.min.js"></script>
<script src="_content/BlazorEpub/epub.js"></script>
```
then use:
```
<BlazorEpub.Epub FontSize="" FontFace="" EpubFile="" LastPageCfi="" Background="" Highlights="" OnHighlightText="" OnUpdateHighlightText="" OnNavigatingPage="" OnChangeBackground="" OnChangeFontFace="" OnChangeFontSize=""  />
```
in your Components

## Property

### FontSize
your default font size.

### FontFace
your default fontfamily, Currently available Shabnam-FD, IRANSans, B NazaninB and Tahoma fonts.

### EpubFile
your epub file url link.

### LastPageCfi
your default [cfi Range](http://idpf.org/epub/linking/cfi/epub-cfi.html).

### Background
your default background color.

### Highlights
List of highlights in the template Highlight Class in Package.

## Events

### OnHighlightText
call when user select and highlight part of text.return object as Highlight Class.

### OnUpdateHighlightText
call when user edit exist highlight.return object as Highlight Class.

### OnNavigatingPage
When navigating to the next/previous page or in any way navigat to special page.return cfiRange and page number.

### OnChangeBackground
when user change background color.return color hex code.

### OnChangeFontFace
when user change font face.return a string of font face.

### OnChangeFontSize
when user change font size.return a integer of font face.
