### Vugluscr


Vugluscr is a scrollbar that quietly sits in the corner of the page or a scrollable container, waiting for you to do some scrolling or jumping around.

Unlike the standard browser scrollbar with vugluscr you can:

* Navigate to any point of the page with one click on the scrollbar track, while standard behavior is to scroll the length of one screen (client height)
* Add markers indicating positions of elements of your choice. Similar to the behavior to the behavior of many IDEs and text editors and how browsers indicate the position of search term occurrences.

*Work in progress, see also [TODO](TODO.md)*


# How to 


To use `vugluscr` insanciate the instance of `new Vugluscr(scrollable?, sidebar?);`

Where `scrollable` is the element containing the content that should be scrolled, e.g. contaner that is smaller in size then its content. If scrolleble is null or undefined, the [`document.documentElement`](https://developer.mozilla.org/en-US/docs/Web/API/Document/documentElement) is assumed.

And `scrollbar` is the element that will be transformed to scrollbar. 

*Default*: If null or undefined, the element scrollbar will be created and appedned to `scrollable`.


Consider passing `scrollbar` only if you need it be positioned somewhere outside of the `scrollable element`.


`vugluscr` assumes that `scrollable` will have `display: flex` so that `scrollbar` will attached itself to top and left using `display: sticky` if scrollable is other the `document.documentElement`;



