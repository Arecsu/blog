---
title: Lorem Ipsum
description: Aliquam erat volutpat. Morbi eget arcu vel nibh molestie rutrum. Suspendisse id mi lacus. Suspendisse sed metus at neque tempus elementum. Donec malesuada arcu sit amet mi tristique mattis. Integer imperdiet semper lectus. Mauris eget magna dolor.
cover: second.webp
alt: my first blog post
---

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam in leo vitae justo condimentum bibendum. Proin malesuada tellus ac lacus faucibus placerat. Vestibulum vulputate luctus libero at dapibus. Praesent eget ante a purus pharetra sagittis. Phasellus malesuada nisi aliquam eros auctor, eu accumsan diam tristique. Mauris hendrerit risus id risus finibus, ut tincidunt massa cursus. Ut leo ante, malesuada vehicula risus in, pellentesque auctor nisi. 🐣 Vestibulum cursus sapien id pharetra tincidunt. Curabitur dui odio, euismod eget sapien ac, lacinia ultricies leo. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Cras sagittis in quam et vehicula. Aliquam aliquet ipsum id felis consequat dignissim. Sed porta faucibus tortor in placerat. Curabitur convallis euismod luctus.

Aliquam erat volutpat. Morbi eget arcu vel nibh molestie rutrum. Suspendisse id mi lacus. Suspendisse sed metus at neque tempus elementum. Donec malesuada arcu sit amet mi tristique mattis. Integer imperdiet semper lectus. Mauris eget magna dolor. Fusce eget ex semper, venenatis dui non, cursus enim. Duis metus mi, commodo id fringilla in, vulputate rhoncus tortor. Praesent nunc nisl, tincidunt eget ante et, ultricies faucibus ipsum.

Phasellus lacinia nibh id pulvinar iaculis. Duis suscipit vestibulum pellentesque. Morbi facilisis accumsan condimentum. Pellentesque ac libero et ante scelerisque tempus. Proin quis nunc quis nunc viverra scelerisque. Phasellus suscipit massa libero, sit amet vehicula mi placerat id. Etiam convallis ullamcorper diam sed fermentum.

## h2 Heading

### h3 Heading

#### h4 Heading

##### h5 Heading

###### h6 Heading

## Horizontal Rules

---

## Emphasis

**This is bold text**

**This is bold text**

_This is italic text_

_This is italic text_

~~Strikethrough~~

## Blockquotes

> _Blockquotes can also be nested can also be nested Blockquotes can also be nested Blockquotes can also be nested Blockquotes can also be nested Blockquotes can also be nested can also be nested_
>
> — wtf

## Lists

Unordered

-  Create a list by starting a line with `+`, `-`, or `*`
-  Sub-lists are made by indenting 2 spaces:
   -  Marker character change forces new list start:
      -  Ac tristique libero volutpat at
      *  Facilisis in pretium nisl aliquet
      -  Nulla volutpat aliquam velit
-  Very easy!

Ordered

1. asdasd
2. asdasdasdds2
3. asdasdsad
   -  asdasd
   -  asdad
   -  asdasd
4. adsasd asd asd ass asdasd as asad asdsa

asd

102. asd
1. asdasd

Start numbering with offset:

57. foo
1. bar

## Code

Inline `code`

Indented code

    // Some comments
    line 1 of code
    line 2 of code
    line 3 of code

Block code "fences"

```
Sample text here...
```

Syntax highlighting

```js
var foo = function (bar) {
   return bar++;
};

console.log(foo(5));
```

## Tables

| Option | Description  |
| ------ | ------------ |
| data   | path to data |
| engine | engine to be |
| ext    | extension to |

Right aligned columns

| Option |           Description |
| -----: | --------------------: |
|   data | path to data files to |
| engine |   engine to be used f |
|    ext |  extension to be used |

## Links

[link text](http://dev.nodeca.com)

[link with title](http://nodeca.github.io/pica/demo/ 'title text!')

Autoconverted link https://github.com/nodeca/pica (enable linkify to see)

## Images

![Minion](https://octodex.github.com/images/minion.png)
![Stormtroopocat](https://octodex.github.com/images/stormtroopocat.jpg 'The Stormtroopocat')

Like links, Images also have a footnote style syntax

![Alt text][id]

With a reference later in the document defining the URL location:

[id]: https://octodex.github.com/images/dojocat.jpg 'The Dojocat'

## Plugins

The killer feature of `markdown-it` is very effective support of
[syntax plugins](https://www.npmjs.org/browse/keyword/markdown-it-plugin).

### [Emojies](https://github.com/markdown-it/markdown-it-emoji)

> Classic markup: :wink: :crush: :cry: :tear: :laughing: :yum:
>
> Shortcuts (emoticons): :-) :-( 8-) ;)

see [how to change output](https://github.com/markdown-it/markdown-it-emoji#change-output) with twemoji.

### [Subscript](https://github.com/markdown-it/markdown-it-sub) / [Superscript](https://github.com/markdown-it/markdown-it-sup)

-  19^th^
-  H~2~O

### [\<ins>](https://github.com/markdown-it/markdown-it-ins)

++Inserted text++

### [\<mark>](https://github.com/markdown-it/markdown-it-mark)

==Marked text==

### [Footnotes](https://github.com/markdown-it/markdown-it-footnote)

Footnote 1 link[^first].

Footnote 2 link[^second].

Inline footnote^[Text of inline footnote] definition.

Duplicated footnote reference[^second].

[^first]: Footnote **can have markup**

    and multiple paragraphs.

[^second]: Footnote text.

### [Definition lists](https://github.com/markdown-it/markdown-it-deflist)

Term 1

: Definition 1
with lazy continuation.

Term 2 with _inline markup_

: Definition 2

        { some code, part of Definition 2 }

    Third paragraph of definition 2.

_Compact style:_

Term 1
~ Definition 1

Term 2
~ Definition 2a
~ Definition 2b

### [Abbreviations](https://github.com/markdown-it/markdown-it-abbr)

This is HTML abbreviation example.

It converts "HTML", but keep intact partial entries like "xxxHTMLyyy" and so on.

\*[HTML]: Hyper Text Markup Language

### [Custom containers](https://github.com/markdown-it/markdown-it-container)

::: warning
_here be dragons_
:::
d