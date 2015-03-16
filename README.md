# jColumnListView

## Description
Simple Finder-like control that can be used instead of ```<select>``` to display hierarchical data in columns view. Supports multiselect, separate selecting and checking for items and has labels area to display selected items. 
Creates an ```<input>``` element for each checked item, so you can grab an array of elements on the server. Uses a separate CSS with class names prefixed with 'cvl-'.

## Issues and Wishes
Please, feel free to contact me by e-mail (can be found in .js file) or create an [http://code.google.com/p/jcvl/issues/list issue] in case you found some errors or want some features to be implemented.

## History
### Version 0.2
Splitters added for column. Now it's possible to set min and max width of columns, enable useSplitters flag and change column width with mouse dragging. Also leftMode is available, in this mode only left column will be modified.

### Version 0.2.3
Added function setValues(). It allows to set up checked items with given values. This function will search for items, makes it checked and sets labels.

### Version 0.2.4
Implemented single check mode. Set 'singleCheck' parameter to true and only one item can be check at one time.

### Version 0.3
Implemented auto-scroll. It works in two ways:
  * If you click item with children and new column will not fit view area then view will be scrolled to show new column completely.
  * If you click item without children or empty space of column and current column does not fit view area then view will be scrolled to show current column completely.

Fixed removing of check marks for children items.

### Version 0.3.1
  * Implemented support of values for items. Now control can read 'itemValue' attribute for ```<li>``` items in list. See updated example below. If attribute 'itemValue' is not present then text will take as value.
  * Removed dependency on comma (,) item's text or value. Now it's possible to set text for item with commas, and for values too. Also, it will be useful for similar items in different categories. Now you can set different values for them.

### Version 0.4 (0.3.2)
Implemented 'leafMode'. If this mode enabled control will store only leaf elements (that have not any children items).
Version 0.3.2 promoted to 0.4 (Today is 04.04 :)).

### Version 0.4.1
From version 0.4.1 it's possible to set up format of item's text. There are three parameters to do it.
  * *textFormat*. It supports two meta tags: ```%cvl-text%``` and ```%cvl-children-counter%```. First tag will be replaced with item's text. Second one will be replaced with children counter, obvious, heh? By default this parameter has value ```%cvl-text%``` and item will have only text. But you can add any text that you want, for example: ```'Item %cvl-text% has %cvl-children-counter% item(s)'```.
  * *childrenCounterFormat*. This string defines a format for children counter. This parameter supports only one meta tag ```%cvl-count%``` which will be replaced with number of children of current item. For example, you can set this format ```'[%cvl-count%]'``` and textFormat to ```'%cvl-children-counter% %cvl-text%'``` and you will get items like ```'[3] First Item'```, ```'[7] Another Item'``` or ```'[5] Third Item'```.
  * *emptyChildrenCounter*. Flag is used when item has no children. If this parameter is true then ```%cvl-children-counter%``` tag will be rendered when children number is 0. Otherwise it will be removed. For example, suppose textFormat is ```'%cvl-children-counter% %cvl-text%'``` and childrenCounterFormat is ```'[ %cvl-count% ]'``` and our item has no children. So, if emptyChildrenCounter is true then you will get ```'[ 0 ] Item Text'``` and ```'Item Text'``` otherwise.

You can change parameters of each column item and of whole column separately. Imagine you have created control and have variable 'cl':
```
// Single item
cl.getColumnList().getColumn(0).getItem(2).setChildrenCounterFormat('{%cvl-count%}');
cl.getColumnList().getColumn(1).getItem(1).setChildrenCounterFormat('=%cvl-count%=');

// Whole columns
cl.getColumnList().getColumn(0).setChildrenCounterFormat('[%cvl-count%]');
cl.getColumnList().getColumn(0).setTextFormat('%cvl-children-counter% %cvl-text%');
cl.getColumnList().getColumn(0).setEmptyChildrenCounter(true);
cl.getColumnList().getColumn(1).setChildrenCounterFormat('{ %cvl-count% }');
cl.getColumnList().getColumn(1).setTextFormat('%cvl-text% %cvl-children-counter%');
```

And, of course, you can change tags! It stored in global object ```jCVL_ColumnItemTags``` and by default it looks like:
```
var jCVL_ColumnItemTags = {
    'text':             '%cvl-text%',
    'childrenCounter':  '%cvl-children-counter%',
    'childrenNumber':   '%cvl-count%'
};
```
So, you can simply do the following:
```
jCVL_ColumnItemTags.text = '$my-text-tag$';
jCVL_ColumnItemTags.childrenCounter = '$my-kids-counter$';
columnItem.setTextFormat('Item: $my-text-tag$ $my-kids-counter$');
// Items will be update automatically
```

*Note*. Take in mind that global tag's object is used by all jColumnListView controls, so your changes will affect all control instances and probably you will need to update formats everywhere.

### Version 0.4.2
  * Implemented visual indicator for items with children. There are two parameters ```childIndicator and ```childIndicatorTextFormat```. First parameter specifies to show or not children indicator. Second parameter defines a format for text in indicator. If second parameter is ```null``` text will not be rendered. This format supports only one tag ```%cvl-count%```. See new screenshots below.
  * Added two CSS classes: ```cvl-column-item-indicator``` and ```cvl-column-item-indicator-selected```. Use these classes to customize your indicator. Structure of text label with indicator element:
```
<span class="cvl-column-item-label">
    <span>Motherboards</span>
    <div class="cvl-column-item-indicator"></div>
</span>
```
  * Functions for operate on text formats (0.4.1) and children indicator (0.4.2) implemented for `Item`, `Column` and `ColumnList`. You can easily change look of control:
```
// List
cl.getColumnList().setChildIndicator(false)
// Column
cl.getColumnList().getColumn(0).setChildIndicator(true)
cl.getColumnList().getColumn(0).setChildIndicatorTextFormat('A')
// Item
cl.getColumnList().getColumn(0).getItem(2).setChildIndicatorTextFormat('(%cvl-count%)')
cl.getColumnList().getColumn(0).getItem(3).setChildIndicatorTextFormat('[%cvl-count%]')
```

### Version 0.5.0
  * Basic AJAX support. Added ```ajaxSource``` option to configure AJAX request and ```setFromURL()``` to load data in list by URL. ```ajaxSource``` objects contains of following parameters:
    * *url* - URL to get data. By default is ```null```. _See notes below._
    * *method* - 'GET' or 'POST'.
    * *dataType* - Type of data from URL. _See notes below._
    * *waiterClass* - class name for _waiter_ element (e.g., load spinner). See CSS file for example.
    * *onSuccess* - callback to be called when data retrieved successfuly and _after_ this data setted to list.
    * *onFailure* - callback to be called when some errors occured during request.
  Both of callbacks has the same signature:
  ```
  function onSuccess(reqObj, respStatus, respData)
  function onFailure(reqObj, respStatus, errObj)
  ```
  where ```reqObj``` is an XMLHttpRequest, ```respStatus``` is a text status, ```respData``` is a data object with required type, ```errObj``` is an error object. (See [http://api.jquery.com/jQuery.ajax/ jQuery.ajax()] for more details about _dataType_ and callbacks).

  * New ```setFromURL()``` function of ```jCVL_ColumnListView``` object. When you create a list view object you can leave ```ajaxSource.url``` field empty (null). Control will be constructed without any data, but required parameters for AJAX will be ready for use (method, callbacks, etc). Later you just call to ```setFromURL(data_url)``` and your control will be filled with data.

_Notes_. Now only whole list update is supported. Request must returns simple HTML fragment with ```<UL>``` list like example below. Control will parse this list and set data. Separate URLs and URL parameters for columns and items, different data types (e.g. JSON, text, etc) will be supported in future versions of 0.5.x branch. 

### Version 0.5.1
License changed to BSD 2-clause License.

### Version 0.5.2
Added function ```jCVL_ColumnList.getSelectedItems(onlyLeafs)``` that returns an array of objects in the following format:
  * item - selected item itself
  * fullPath - path to item from the root of the list.
Is ```onlyLeafs``` parameter is ```true``` then only leaf items will be returned.
```
// All selected items
cl.getColumnList().getSelectedItems();
// Only leaf items
cl.getColumnList().getSelectedItems(true);
```

Function ```getIndex()``` has beed added for  ```jCVL_ColumnItem``` and ```jCVL_Column```. Remember that these values represent only the current visual state of the list and do not describe the global position of item in whole data tree that can be obtained by call to ```item.getFullPath()```.

Added two callbacks: ```onItemChecked```/```onItemUnchecked```. Both callbacks called with only one parameter: ```item```. According to previous news you can access indexes by the simple code:
```
// Indexes of item
item.getParentColumn().getIndex();
item.getIndex();
// Item global position described by path
item.getFullPath();
```

### Version 0.5.3
Added support to fill columns from URL for every item. Please, use two following parameters in ```ajaxSource``` section:
  * itemUrl - URL used to retrieve data for column.
  * pathSeparator - separator used to join path indexes into string (default is comma ',')

_Path_ is an array of indexes from item to the root of data tree. Consider example below and en element ```M4A77```, a path for it will be ```[1, 0, 3]```. Index of this array means a column and value is an index of item in the column. In path ```[1, 0, 3]``` first value 1 have index 0, it's means user in first (0 index) column selected second (1 index) item (```Motherboards```). Next value 0 has index 1, this means that user selected ```ASUS```. And last value 3 means fourth value in third column.
```itemUrl``` value should has tag ```%cvl-url-item-path%``` where a path string will be placed. Also, there are two other tags ```%cvl-url-item-name%``` and ```%cvl-url-item-value%``` for item text and value respectively. Values from path array join to string using ```pathSeparator``` parameter. So, consider we have URL _http://example.com/data.php?get=_ then ```itemUrl``` parameter should look like:
```
    itemUrl: 'http://example.com/data.php?get=%cvl-url-item-path%'
```
If you would like to send item's text or value to server then you should use such tags:
```
    itemUrl: 'http://example.com/data.php?get=%cvl-url-item-path%&text=%cvl-url-item-name%&value=%cvl-url-item-value%
```
Server should return data in HTML or JSON format. In first case it should be just ```<ul>``` element. If server responses in JSON format a plugin waits for correct data object. Data should be an array of hashes where each array item is a column item and each hash is an item description and should contain at least ```name``` parameter.

Basic parameters are: ```name``` (required), ```value``` (equal to name if not defined) and ```hasChildren``` (0 by default). ```data``` is an array of the items of the children items of the current (clicked) item (optional, of course). For example:
```
[
    { name: 'Item 1', value '1' },
    { name: 'Item 2', value '2', hasChildren: 1, data: [
        { name: 'Item 2.1', value: '2.1' },
        { name: 'Item 2.2', value: '2.12 }
    ] },
    ....
]
```

Changed name of ```setValues``` function to ```setItemsChecked``` because of too confusing name. Added refresh(), addItem(), removeItem() and setItemData() functions for jCVL_Column. 
Implemented new ```checkAndClick``` mode. When it enabled then items will be checked when clicked and vice versa. Look for a new parameter in example below.

### Version 0.5.4
Now leaf items support html tags. Default value for such items will be 'all text' content (```$(item).text()```).
```
    <li><a href="http://google.com">Google</a></li>
```

### Version 0.5.6
Added option _checkAllChildren_. When it set to true all children items of currently checked item will be checked.

## Parameters
|id|ID of control|
|--|-------------|
|columnWidth|...|
|columnHeight|size of column|
|columnMargin|right margin of column|
|columnNum|maximum number of columns|
|paramName|name of form parameter|
|elementId|ID of ```<UL>``` list to get data from|
|appendToId|ID of element to append this control|
|removeULAfter|if true remove ```<UL>``` list from DOM after get data|
|showLabels|show or not labels area|

### Version 0.2
|useSplitters|If true splitters will be used|
|columnMinWidth|...|
|columnMaxWidth|Min/Max values for width (used as constraints for splitters)|
|splitterLeftMode|If true splitter will modify only left column (both columns otherwise)|

### Version 0.2.4
|singleCheck|If true only one item can be checked at one time|


### Version 0.4 (0.3.2)
|leafMode|If true only leaf items will be stored as values|

### Version 0.4.1
|textFormat|Format of text of item|
|childrenCounterFormat|Format of children counter|
|emptyChildrenCounter|Render or not children counter if item has no children|

### Version 0.4.2
|childIndicator|If true indicator will be visible|
|childIndicatorTextFormat|Format of text for indicator. Can be ```null``` to not render text|

### Version 0.5.0
|ajaxSource|Object with parameters for AJAX requests|

### Version 0.5.2
|onItemChecked/onItemUnchecked|Callbacks called when item changes check state|

### Version 0.5.3
|ajaxSource.itemUrl|URL to retrieve data for column by user click|
|ajaxSource.pathSeparator|Separator used to join item path indexes to string|
|checkAndClick|Enables mode when checks and clicks works together|

### Version 0.5.6
|checkAllChildren|Checks all children of a checked item|

## Usage example
```
jQuery.fn.jColumnListView({
        id:            'cl2',
        columnWidth:   120,
        columnHeight:  180,
        columnMargin:  5,
        paramName:     'product_categories',
        columnNum:     3,
        appendToId:    't2',
        elementId:     'categories',
        removeULAfter: true,
        showLabels:    false
// Version 0.2
        useSplitters:     true,
        splitterLeftMode: false,
        columnMinWidth:   80,
        columnMaxWidth:   180
// Version 0.2.4
        singleCheck:      true
// Version 0.4
        leafMode:         false
// Version 0.4.1
        textFormat:            '%cvl-children-counter% %cvl-text%',
        childrenCounterFormat: '[%cvl-count%]',
        emptyChildrenCounter:  false
// Version 0.4.2
        childIndicator:           true,
        childIndicatorFormatText: '(%cvl-count%)',
// Version 0.5.0
        ajaxSource: {
                url:         null,
                method:      'get',
                dataType:    'html xml',
                onSuccess:   function (reqObj, respStatus, respData) {},
                onFailure:   function (reqObj, respStatus, errObj) {},
                waiterClass: 'cvl-column-waiter',
// Version 0.5.3
                itemUrl:       null, // 'http://example.com/data.php?get=%cvl-url-item-path%'
                pathSeparator: ','
        }
// Version 0.5.2
        onItemChecked: function (item) { /* ... */ },
        onItemUnchecked: function (item) {/* ... */ }
// Version 0.5.3
        checkAndClick: false,
// Version 0.5.6
        checkAllChildren: false
});

// Version 0.2.3.
// You must save returned variable, like:
// var cl = jQuery.fn.jColumnListView({ ...
// Imagine we have values generated on server:
var values_arr = [ 'P7P55', 'M4A78', 'Zalman 3', 'Athlon FX' ];

jQuery(document).ready(function () {
        cl.setItemsChecked(values_arr);
});
```

## View of control
http://i56.tinypic.com/2cf41j.jpg

## With splitters (v0.2)
http://i55.tinypic.com/2r54v10.jpg

## With commas and values (v0.3.1)
http://i56.tinypic.com/34674lw.jpg

## leafMode enabled (v0.4)
http://i52.tinypic.com/dgs7bt.jpg

## Custom item text's formats (v0.4.1)
http://i53.tinypic.com/29dbw5u.jpg

## Children Indicator (v0.4.2)
### Just element without text
http://i56.tinypic.com/23lm88z.jpg

### With text
http://i51.tinypic.com/208h5xf.jpg

### HTML formatting in leaf items (v0.5.4)
http://i56.tinypic.com/2qc1b2p.jpg

## Example of source ```<UL>``` list
```
<ul id="categories" style="display: none"> 
	<li>CPU
		<ul> 
		<li>Intel
			<ul> 
			<li itemValue="Core 2 Group">Core 2 Duo, Core 2 Quad, Core 2 Extreme</li> 
			<li itemValue="Core i Group">Core i3, Core i5, Core i7</li>
			</ul> 
		</li> 
		<li>AMD
			<ul> 
			<li>Sempron</li> 
			<li>Athlon</li> 
			<li>Athlon FX</li> 
			<li>Athlon X2</li> 
			<li>Athlon II X2</li> 
			</ul> 
		</li> 
		</ul> 
	</li> 
	<li>Motherboards
		<ul> 
		<li>ASUS
			<ul> 
			<li>P7P55</li> 
			<li>P8P67</li> 
			<li>M4A78</li> 
			<li>M4A77</li> 
			</ul> 
		</li> 
		<li>MSI
			<ul> 
			<li>P55-GD80</li> 
			<li>P55M-GD45</li> 
			<li>GF615M-P33</li> 
			</ul> 
		</li> 
		</ul> 
	</li> 
</ul> 
```
