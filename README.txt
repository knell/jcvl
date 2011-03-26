jColumnListView

Creates a column view (like a Mac Finder) from <UL> list. Supports multiselect.

Requires jQuery 1.4+
See cvl.css for CSS rules

Control creates <input> element for each checked item with the same 
name (paramName[] for PHP, for example)

Parameters:
  id            - ID of ColumnListView control
  columnWidth   - ...
  columnHeight  - size of column
  columnMargin  - right margin of column
  columnNum     - maximum number of columns
  paramName     - name of form parameter
  elementId     - ID of <UL> list to get data from
  appendToId    - ID of element to append this control
  removeULAfter - if true remove <UL> list from DOM after get data
  showLabels    - show or not labels area

Usage example:

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
	});

Author:  Alexander Khizha <khizhaster@gmail.com>
Version: 0.1
Date:    23.03.2011
License: GPL v2.0
