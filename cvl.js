/*
 * jColumnListView
 *
 * Creates a column view (like a Mac Finder) from <UL> list. Supports multiselect.
 *
 * Requires jQuery 1.4+
 * See cvl.css for CSS rules
 *
 * Control creates <input> element for each checked item with the same 
 * name (paramName[] for PHP, for example)
 *
 * Parameters:
 *   id            - ID of ColumnListView control
 *   columnWidth   - ...
 *   columnHeight  - size of column
 *   columnMargin  - right margin of column
 *   columnNum     - maximum number of columns
 *   paramName     - name of form parameter
 *   elementId     - ID of <UL> list to get data from
 *   appendToId    - ID of element to append this control
 *   removeULAfter - if true remove <UL> list from DOM after get data
 *   showLabels    - show or not labels area
 *
 * Usage example:
 * 
 *		jQuery.fn.jColumnListView({
 *			id:            'cl2',
 *			columnWidth:   120,
 *			columnHeight:  180,
 *			columnMargin:  5,
 *			paramName:     'product_categories',
 *			columnNum:     3,
 *			appendToId:    't2',
 *			elementId:     'categories',
 *			removeULAfter: true,
 *			showLabels:    false
 *		});
 *
 * Author:  Alexander Khizha <khizhaster@gmail.com>
 * Version: 0.1.2
 * Date:    23.03.2011
 * License: GPL v2.0
 */


// -----------------------------------------------------------------------------
// Jaws (labels like [x|Some Label])
// 
// Parameters:
//   id          - ID for Jaw
//   text        - Text label
//   onDelClick  - onClick handler for Del button
//   onNameClick - onClick handler for name element
//
function jCVL_Jaw (opts)
{
	var emptyHandler = function (ev, id, text) {};

	this.id          = opts.id          || 'cvl-jaw';
	this.text        = opts.text        || "";
	this.onDelClick  = opts.onDelClick  || emptyHandler;
	this.onNameClick = opts.onNameClick || emptyHandler;
	this.paramName   = opts.paramName   || 'cvl-param';
	
	
	var clSel = 'cvl-selected-jaw', clDel = 'cvl-selected-del', clName = 'cvl-selected-name';
	
	var elem    = $('<span>')
		.attr('class', clSel)
		.attr('id',    this.id);
	var that = this;
	var delElem = $('<span>')
		.attr('class', clDel)
		.text('x')
		.click(function (ev) { that.doOnDelClick(ev); });
	var nameElem = $('<span>')
		.attr('class', clName)
		.text(this.text)
		.click(function (ev) { that.doOnNameClick(ev); });
	var valElem = $('<input type="hidden">')
		.attr('name',  this.paramName)
		.attr('value', this.text);

	elem.append(valElem).append(delElem).append(nameElem);
	this.elems = { 'elem': elem, 'delElem': delElem, 'nameElem': nameElem, 'valElem': valElem };
}

// Sets text for jaw label
jCVL_Jaw.prototype.setText = function (text) {
	this.text = text;
	this.elems.nameElem.text(this.text);
	this.elems.valElem.attr('value', text);
}

// Returns a text from label
jCVL_Jaw.prototype.getText = function () {
	return this.text;
}

// Sets onClick Del handler
jCVL_Jaw.prototype.setOnDelClick = function (cb) {
	this.onDelClick = cb;
}

// Real onClick Del handler
jCVL_Jaw.prototype.doOnDelClick = function (event) {
	this.onDelClick(event, this.id, this.text);
}

// Sets onClick name handler
jCVL_Jaw.prototype.setOnNameClick = function (cb) {
	this.onNameClick = cb;
}

// Real onClick name handler
jCVL_Jaw.prototype.doOnNameClick = function (event) {
	this.onNameClick(event, this.id, this.text);
}

// Returns HTML element itself
jCVL_Jaw.prototype.get = function () {
	return this.elems.elem;
}

// Appends element to given one
jCVL_Jaw.prototype.appendTo = function (elem) {
	if ($(elem).length != 0)
		$(elem).append(this.elems.elem);
}

// Removes jaw from DOM with a little animation
jCVL_Jaw.prototype.remove = function (cb) {
	var that = this;
	this.elems.elem.fadeOut(200, function () { that.get().remove(); if (cb) cb(); });
}

// -----------------------------------------------------------------------------
// Jaw Area
//
// Parameters:
//   id            - Create with this ID
//   unique        - Store only unique values
//   onDelClick    - onClick handler for item's Del
//   onNameClick   - onClick handler for item's name
//   
// Note: If 'elementId' is defined it prefer to 'id'.
//
function jCVL_JawArea (opts)
{
	var emptyHandler = function (ev, id, text) {};
	this.jaws = [];
	
	this.unique      = typeof(opts.unique) == 'boolean' ? opts.unique : true;
	this.id          = opts.id || 'cvl-jaw-area';
	this.onDelClick  = opts.onDelClick  || emptyHandler;
	this.onNameClick = opts.onNameClick || emptyHandler;
	this.paramName   = opts.paramName   || 'cvl-param';

	this.elem   = $('<div>')
		.attr('class', 'cvl-jaw-area')
		.attr('id', this.id);
}

// Returns area HTML element
jCVL_JawArea.prototype.get = function () {
	return this.elem;
}

// Appends element to given one
jCVL_JawArea.prototype.appendTo = function (elem) {
	if ($(elem).length != 0)
		$(elem).append(this.elem);
}

// Returns true if area has label with 'text'
jCVL_JawArea.prototype.has = function (text) {
	var h = false;
	for (var i=0; i<this.jaws.length; i++)
	{
		if (this.jaws[i].getText() == text)
		{
			h = true;
			break;
		}
	}
	return h;
}

// Add new label to area
// Skip existing labels if this.unique is true
jCVL_JawArea.prototype.addJaw = function (text) {
	if (!this.unique || !this.has(text))
	{
		var that = this;
		var arrId = this.jaws.length;
		var id    = this.id + '-jaw' + arrId;
		var that  = this;
		var j = new jCVL_Jaw({
			id:         id,
			text:       text,
			paramName:  this.paramName
		});
		j.setOnDelClick(function (ev, ev_id, ev_text) { that.onJawDelClick(ev, ev_id, ev_text, j); });
		j.setOnNameClick(function (ev, ev_id, ev_text) { that.onJawNameClick(ev, ev_id, ev_text, j); });
		this.jaws.push(j);
		this.elem.append(j.get());
	}
}

// Removes a label with given text
jCVL_JawArea.prototype.delJaw = function (text, cb) {
	for (var i=0; i<this.jaws.length; i++)
	{
		if (this.jaws[i].getText() == text)
		{
			var j = this.jaws.splice(i, 1)[0];
			j.remove(cb);
			break;
		}
	}
}

// onClick handler for Del button of each label
jCVL_JawArea.prototype.onJawDelClick = function (ev, id, text, jaw) {
	var that = this;
	this.delJaw(text, function () {
		that.onDelClick(ev, id, text);
	});
}

// onClick handler for name element of each label
jCVL_JawArea.prototype.onJawNameClick = function (ev, id, text, jaw) {
	this.onNameClick(ev, id, text);
}

jCVL_JawArea.prototype.setOnDelClick = function (cb) {
	this.onDelClick = cb;
}

jCVL_JawArea.prototype.setOnNameClick = function (cb) {
	this.onNameClick = cb;
}

// Returns a string combined of all labels
jCVL_JawArea.prototype.getString = function () {
	var str = [];
	jQuery.each(this.jaws, function (i, e) {
		str.push(e.getText());
	});
	return str.join(',');
}

jCVL_JawArea.prototype.hide = function () {
	this.elem.hide();
}

jCVL_JawArea.prototype.show = function () {
	this.elem.show();
}

// -----------------------------------------------------------------------------
// ColumnItem 
// Item with checkbox for lsit column
//
// Parameters:
//   id      - ID of item
//   text    - label string
//   checked - initial state of checkbox
//   onClick - handler for whole item
//   onCheckboxClick - handler for checkbox only 
function jCVL_ColumnItem (opts)
{
	var emptyHandler = function (ev, item) {};

	this.id        = opts.id              || 'cvl-column-item';
	this.text      = opts.text            || 'Column Item';
	this.onClick   = opts.onClick         || emptyHandler;
	this.onCBClick = opts.onCheckboxClick || emptyHandler;
	this.parentCol = opts.parentCol       || undefined;
	this.checked   = typeof(opts.checked) == 'boolean' ? opts.checked : false;
	this.fullPath  = undefined;
	
	var that = this;
	this.cl = { 
		'Elem':     'cvl-column-item',
		'CB':       'cvl-column-item-checkbox',
		'CBBox':    'cvl-column-item-checkbox-box',
		'Label':    'cvl-column-item-label',
		'Selected': 'cvl-column-item-selected'
	};

	var elem = $('<div>')
		.attr('class', this.cl.Elem)
		.attr('id',    this.id);
	var cbBoxElem = $('<div>')
		.attr('class', this.cl.CBBox);
	var cbElem = $('<input type="checkbox">')
		.attr('class',   this.cl.CB)
		.attr('checked', this.checked)
		.click(function(ev) { that.doOnCheckboxClick(ev); });
	var labelElem = $('<span>')
		.attr('class', this.cl.Label)
		.text(this.text)
		.click(function (ev) { that.doOnClick(ev); });
	cbBoxElem.append(cbElem);
	elem.append(cbBoxElem).append(labelElem);
		
	this.elems = { 'elem': elem, 'checkbox': cbElem, 'label': labelElem };
}

// Returns html element itself
jCVL_ColumnItem.prototype.get = function () {
	return this.elems.elem;
}

// Appends element to given one
jCVL_ColumnItem.prototype.appendTo = function (elem) {
	if ($(elem).length != 0)
		$(elem).append(this.elems.elem);
}

// Return true if checkbox is checked
jCVL_ColumnItem.prototype.isChecked = function () {
	return this.elems.checkbox.is(':checked');
}

jCVL_ColumnItem.prototype.setChecked = function (bCheck) {
	this.elems.checkbox.attr('checked', !!bCheck);
}

// Toggle checkbox state
jCVL_ColumnItem.prototype.toggle = function () {
	this.elems.checkbox.attr('checked', !this.isChecked());
}

// Returns text label of item
jCVL_ColumnItem.prototype.getText = function () {
	return this.text;
}

// Sets text label of item
jCVL_ColumnItem.prototype.setText = function (text) {
	this.text = text;
	this.elems.label.text(this.text);
}

jCVL_ColumnItem.prototype.setFullPath = function (path) {
	this.fullPath = path;
}

jCVL_ColumnItem.prototype.getFullPath = function () {
	return this.fullPath;
}

// Return true if whole item is selected
jCVL_ColumnItem.prototype.isSelected = function () {
	return this.elems.elem.hasClass(this.cl.Selected);
}

// Sets selected state
jCVL_ColumnItem.prototype.setSelected = function (bSelected) {
	var bs = typeof(bSelected == 'boolean') ? bSelected : true;
	var is = this.isSelected();

	if (bs && !is)
		this.elems.elem.addClass(this.cl.Selected);
	else if (!bs && is)
		this.elems.elem.removeClass(this.cl.Selected);
}

// Sets onClick handler
jCVL_ColumnItem.prototype.setOnClick = function (cb) {
	this.onClick = cb;
}

jCVL_ColumnItem.prototype.fireOnClick = function () {
	this.elems.label.click();
}

// Calls client onClick handler
jCVL_ColumnItem.prototype.doOnClick = function (ev) {
	this.setSelected(true);
	this.onClick(ev, this);
};

// Sets onClick handler
jCVL_ColumnItem.prototype.setOnCheckboxClick = function (cb) {
	this.onCBClick = cb;
}

jCVL_ColumnItem.prototype.fireOnCheckboxClick = function () {
	this.elems.checkbox.click();
}

// Calls client onCheckboxClick handler
jCVL_ColumnItem.prototype.doOnCheckboxClick = function (ev) {
	this.checked = this.elems.checkbox.is(':checked');
	this.onCBClick(ev, this);
}

// Returns parent column object
jCVL_ColumnItem.prototype.getParentColumn = function () { return this.parentCol; }


// -----------------------------------------------------------------------------
// Column
//
// Parameters:
//   id       - ID of column element
//   width    - column width
//   height   - column height
//   margin   - margin-right for column
//   parent   - parent item of this column
//
function jCVL_Column(opts)
{
	var emptyHandler = function (ev, index, item) {};

	this.opts = {
		id:         opts.id        || 'cvl-column',
		width:      opts.width     || 250,
		height:     opts.height    || 200,
		margin:     opts.margin    || 10,
		parentItem: opts.parent    || undefined,
		onClick:    opts.onClick   || emptyHandler,
		onCheckboxClick: opts.onCheckboxClick || emptyHandler
	};

	this.id              = this.opts.id;
	this.data            = [];
	this.parentItem      = this.opts.parentItem;
	this.parentText      = this.parentItem ? this.parentItem.getText() : undefined;
	this.items           = [];
	this.curItem         = undefined;
	this.curItemIndex    = -1;
	this.onClick         = this.opts.onClick;
	this.onCheckboxClick = this.opts.onCheckboxClick;
	this.simpleMode      = false;
	
	this.elem = $('<div>')
		.attr('id', this.id)
		.attr('class', 'cvl-column')
		.css({ 'width': this.opts.width, 'height': this.opts.height, 'margin-right': this.opts.margin });
}

// Returns html element itself
jCVL_Column.prototype.get = function () {
	return this.elem;
}

// Appends element to given one
jCVL_Column.prototype.appendTo = function (elem) {
	if ($(elem).length != 0)
		$(elem).append(this.elem);
}

// Creates new ColumnItem with 'text' label
jCVL_Column.prototype._createItem = function (index, text) {
	var id = this.id + '-item' + this.items.length;
	var item = new jCVL_ColumnItem({ id: id, text: text, parentCol: this });
	var that = this;
	item.setOnClick(function (ev, item) { that.onItemClick(ev, index, item); });
	item.setOnCheckboxClick(function (ev, item) { that.onItemCheckboxClick(ev, index, item); });

	return item;
}

// Removes column items. If bTotal is set also clears parent* and data
jCVL_Column.prototype.clear = function (bTotal) {
	this.elem.find('div').remove();
	this.items = [];
	this.curItem = undefined;
	this.curItemIndex = -1;
	if (!!bTotal)
	{
		this.parentCol = this.parentText = undefined;
		this.data  = [];
	}
}

// Creates and adds elements from data
jCVL_Column.prototype._fillItems = function (data) {
	var that = this;
	this.clear();
	jQuery.each(data, function (index, d) {
		var item = that._createItem(index, d.name);
		that.items.push(item);
		item.setFullPath(that.getFullPath(index));
		item.appendTo(that.elem);
	});
}

// Sets new data for column
jCVL_Column.prototype.setData = function (data, parentItem) {
	this.data       = data;
	this.parentItem = (parentItem) ? parentItem : undefined;
	this.parentText = (parentItem) ? parentItem.getText() : undefined;
	this._fillItems(this.data);
}

// Change selected state of column items and call client's onClick handler
jCVL_Column.prototype.onItemClick = function (ev, index, item) {
	if (this.curItem && this.curItem != item)
		this.curItem.setSelected(false);
	this.curItem = item;
	this.curItemIndex = index;

	this.onClick(ev, index, item);
}

// Calls client's handler
jCVL_Column.prototype.onItemCheckboxClick = function (ev, index, item) {
	this.onCheckboxClick(ev, index, item);
}

// Gets current item/index 
jCVL_Column.prototype.getSelectedItem = function () { return this.curItem; }
jCVL_Column.prototype.getSelectedIndex = function () { return this.curItemIndex; }

jCVL_Column.prototype.getCheckedItems = function () {
	var items = [];
	for (var i=0; i<this.items.length; i++)
		if (this.items[i].isChecked())
			items.push(this.items[i]);
	return items;
}

// Returns a string of checked items joined by separator (',' by default)
jCVL_Column.prototype.getCheckedString = function (separator) {
	var sep = separator || ',';
	var str = [];
	var items = this.getCheckedItems();
	for (var i=0; i<items.length; i++)
		str.push(items[i].getText());
	return str.join(sep);
}

// Gets/Sets parent item and text
jCVL_Column.prototype.getParentItem = function () { return this.parentItem; }
jCVL_Column.prototype.getParentText = function () { return this.parentText; }

jCVL_Column.prototype.setParentItem = function (item) {
	if (item)
	{
		this.parentItem = item;
		this.parentText = item.getText();
	}
}

// Return array of items' text
jCVL_Column.prototype.getItemsString = function () {
	var str = [];
	jQuery.each(this.items, function (index, item) { str.push(item.getText()); });
	return str;
}

// Returns full string from index to root column item joined by separator
// If defined toColumnIndex search will be stopped at column with such index
jCVL_Column.prototype.getFullPath = function (index, separator, toLevel_CurrentIndex, toLevel_ColumnIndex) {
	var str = [];
	var sep = separator || ',';
	
	var curLevel = toLevel_CurrentIndex || -1;
	var toLevel  = toLevel_ColumnIndex  || -1;

	if (index >= 0 && index < this.items.length)
	{
		str.push(this.items[index].getText());
		var p = this.getParentItem();
		while (p && (curLevel == -1 || --curLevel >= toLevel))
		{
			str.push(p.getText());
			p = p.getParentColumn().getParentItem();
		}
	}

	return str.reverse().join(sep);
}

// Returns array of full pathes of checked items
jCVL_Column.prototype.getFullCheckedPathes = function () {
	var pathes = [];
	var items  = this.getCheckedItems();
	for (var i=0; i<items.length; i++)
		pathes.push(items[i].getFullPath());
	return pathes;
}

// Gets item and item data
jCVL_Column.prototype.getItem = function (index) {
	return (index >= 0 && index < this.items.length) ? this.items[index] : undefined;
}

// Returns item data
jCVL_Column.prototype.getItemData = function (index) {
	return (index >= 0 && index < this.items.length) ? this.data[index].data : [];
}

// Returns true if 'index' item has children
jCVL_Column.prototype.itemHasChildren = function (index) {
	return (index >= 0 && index < this.items.length) && this.data[index].hasChildren;
}

// Returns true if any of items has children
jCVL_Column.prototype.hasChildren = function () {
	var has = false;
	var that = this;
	jQuery.each(this.items, function (index, item) { if (that.data[index].hasChildren) has = true; });
	return has;
}

jCVL_Column.prototype.setSimpleMode = function (bMode) {
	this.simpleMode = !!bMode;
}

jCVL_Column.prototype.getSimpleMode = function () {
	return this.simpleMode;
}

// Hides column (if !simple - with animation)
jCVL_Column.prototype.hide = function (cb) {
	if (!!this.simpleMode)
	{
		this.elem.hide();
		if (cb)
			cb();
	}
	else if (this.elem.is(':visible'))
		this.elem.animate({ width: 'hide' }, 'fast', function () { if (cb) cb(); });
}

// Shows column
jCVL_Column.prototype.show = function (cb) {
	if (!!this.simpleMode)
	{
		this.elem.show();
		if (cb)
			cb();
	}
	else if (!this.elem.is(':visible'))
		this.elem.animate({ width: 'show' }, 'fast', function () { if (cb) cb(); });
}

// Sets checkbox state for all items
jCVL_Column.prototype.checkAll = function (bCheck) {
	jQuery.each(this.items, function (index, item) {
		item.setChecked(!!bCheck);
	});
}

// -----------------------------------------------------------------------------
// ColumnList
//
function jCVL_ColumnList (opts)
{
	var defOpts = {
		columnWidth:  150,
		height:       200,
		columnMargin: 10,
		columnNum:    3,
		id:           '',
		data:         [],
		onClick:      function () {},
		onCheckboxClick: function () {}
	};
	this.opts = jQuery.extend(defOpts, opts);
	this.cols = [];
	this.data = this.opts.data;
	
	this.elem = $('<div>')
		.attr('id', this.opts.id)
		.attr('class', 'cvl-column-list');
	
	this._createColumns();
}

// Returns html element itself
jCVL_ColumnList.prototype.get = function () {
	return this.elem;
}

// Appends element to given one
jCVL_ColumnList.prototype.appendTo = function (elem) {
	if ($(elem).length != 0)
		$(elem).append(this.elem);
}

jCVL_ColumnList.prototype.getColumn = function (index) {
	return (index >= 0 && index < this.cols.length) ? this.cols[index] : undefined;
}

jCVL_ColumnList.prototype._createColumns = function () {
	var that = this;
	for (var i=0; i<this.opts.columnNum; i++)
	{
		var colId = this.opts.id + '-col' + i;
		var col = new jCVL_Column({
			width:     this.opts.columnWidth,
			height:    this.opts.height,
			margin:    this.opts.columnMargin,
			id:        colId,
			onClick:  (function (colIndex) { return function (ev, index, item) { 
				that.onColumnItemClick(ev, colIndex, index, item); }; })(i),
			onCheckboxClick: (function (colIndex) { return function (ev, index, item) { 
				that.onColumnItemCheckboxClick(ev, colIndex, index, item); }; })(i)
		});
		col.setSimpleMode(true);
		col.appendTo(this.elem);
		if (i > 0)
			col.hide();
		else if (this.data.length)
			col.setData(this.data);
		this.cols.push(col);
		col.setSimpleMode(false);
	}
}

jCVL_ColumnList.prototype.clear = function () {
	jQuery.each(this.cols, function (index, item) { item.clear(); if (index > 0) item.hide(); });
}

jCVL_ColumnList.prototype.onColumnItemClick = function (ev, colIndex, itemIndex, item) {
	// console.log('Click: colIndex: ' + colIndex + ', itemIndex: ' + itemIndex + ' - ' + item.getText());
	var that = this;
	var bEx = true;
	if (colIndex < this.cols.length - 1)
	{
		jQuery.each(this.cols, function (index, col) { 
			if (index > colIndex) 
			{
				var m = col.getSimpleMode();
				col.setSimpleMode(true);
				col.hide();
				col.setSimpleMode(m);
			}
		});
		
		if (this.cols[colIndex].itemHasChildren(itemIndex))
		{
			var nextCol = this.cols[colIndex + 1];
			nextCol.clear();
			nextCol.show(function () {
				nextCol.setData(that.cols[colIndex].getItemData(itemIndex));
				nextCol.setParentItem(item);
				that.opts.onClick(ev, colIndex, itemIndex, item);
			});
			bEx = false;
		}
	}

	if (bEx)
		this.opts.onClick(ev, colIndex, itemIndex, item);
}

jCVL_ColumnList.prototype.fireColumnItemClick = function (colIndex, itemIndex)
{
	if (colIndex >= 0 && colIndex < this.cols.length)
	{
		var col = this.cols[colIndex];
		if (itemIndex >= 0 && itemIndex < col.items.length)
			col.getItem(itemIndex).fireOnClick();
	}
}

jCVL_ColumnList.prototype.setData = function (data) {
	this.clear();
	this.data = data;
	this.cols[0].setData(this.data);
}

jCVL_ColumnList.prototype.getData = function () {
	return this.data;
}

jCVL_ColumnList.prototype.onColumnItemCheckboxClick = function (ev, colIndex, itemIndex, item) {
	if (item.isChecked())
	{
		// Check items in path to root
		var it = item.getParentColumn().getParentItem();
		while (it)
		{
			it.setChecked(true);
			it = it.getParentColumn().getParentItem();
		}
		
		// Call after
		this.opts.onCheckboxClick(ev, colIndex, itemIndex, item);
	}
	else // Uncheck all items in child columns
	{
		// Call before
		this.opts.onCheckboxClick(ev, colIndex, itemIndex, item);

		for (var i=colIndex+1; i<this.cols.length; i++)
			this.cols[i].checkAll(false);
	}
}


// -----------------------------------------------------------------------------
// Column List View
//
function jCVL_ColumnListView(opts) 
{
	var defOpts = {
		id:              'col-list-view',
		columnWidth:     150,
		columnHeight:    200,
		columnMargin:    10,
		columnNum:       3,
		paramName:       'columnview[]',
		elementId:       '',
		removeULAfter:   false,
		showLabels:      true
	};
	this.opts = jQuery.extend(defOpts, opts);
	var that = this;
	
	this.elem = $('<div>')
		.attr('id', this.opts.id)
		.attr('class', 'cvl-column-list-view');
	this.list = new jCVL_ColumnList({
		id:           this.opts.id + '-column-list',
		columnWidth:  this.opts.columnWidth,
		height:       this.opts.columnHeight,
		columnMargin: this.opts.columnMargin,
		columnNum:    this.opts.columnNum,
		onClick:      function (ev, ci, ii, it) { that.onColumnItemClick(ev, ci, ii, it); },
		onCheckboxClick: function (ev, ci, ii, it) { that.onColumnItemCheckboxClick(ev, ci, ii, it); }
	});
	this.jaws = new jCVL_JawArea({
		id:          this.opts.id + '-jaws-area',
		unique:      true,
		paramName:   this.opts.paramName,
		onDelClick:  function (ev, id, text) { that.onJawDelClick(ev, id, text); },
		onNameClick: function (ev, id, text) { that.onJawNameClick(ev, id, text); }
	});
	this.labels = {};
	
	this.list.appendTo(this.elem);
	this.jaws.appendTo(this.elem);
	
	if (!this.opts.showLabels)
		this.jaws.hide();
	
	if (this.opts.elementId != '')
		this.setFromElement(this.opts.elementId, !!this.opts.removeULAfter);
}

// Returns html element itself
jCVL_ColumnListView.prototype.get = function () {
	return this.elem;
}

// Appends element to given one
jCVL_ColumnListView.prototype.appendTo = function (elem) {
	if ($(elem).length != 0)
		$(elem).append(this.elem);
}

// Set up list view from data list stoted in <UL> on page
jCVL_ColumnListView.prototype.setFromElement = function (elem_id, bRemoveListAfter) {
	var ul = typeof(elem_id) == 'string' ? $('#' + elem_id) : $(elem_id);
	if (ul.length == 0)
	{
		if (console)
			console.error('jColumnListView: Element with ID "' + elem_id + '" was not found');
	}
	else if (!ul.is('ul'))
	{
		if (console)
			console.error('jColumnListView: Element with ID "' + elem_id + '" is not <UL> element');
	}
	else
	{
		var data = this._parseData(ul);
		this.list.setData(data);
		if (!!bRemoveListAfter)
			ul.remove();
	}
}

// Parses <UL> list and retuns data
jCVL_ColumnListView.prototype._parseData = function (ul_elem, data) {
	if (!data)
		data = [];

	var that = this;
	$(ul_elem).children('li').each(function (index, item) {
		var name = $.trim($($(item).contents()[0]).text());
		var childrenData = [];
		var ulChild = $(item).children('ul');
		if (ulChild.length)
			that._parseData(ulChild[0], childrenData);

		data.push({ name: name, data: childrenData, hasChildren: childrenData.length != 0 });
	});
	
	return data;
}

jCVL_ColumnListView.prototype.onColumnItemClick = function (event, colIndex, itemIndex, item) {
	var aKeys = function (obj) {
		var keys = [];
		for(i in obj) if (obj.hasOwnProperty(i))
		{
			keys.push(i);
		}
		return keys;
	};

	// Check items in the next column if we have it in jaws
	var nextCol = (colIndex + 1 < this.opts.columnNum) ? this.list.getColumn(colIndex + 1) : undefined;
	if (nextCol)
	{
		var jaws  = aKeys(this.labels);
		var items = nextCol.getItemsString();
		jQuery.each(items, function (index, item) {
			if (jQuery.inArray(item, jaws) > -1)
				nextCol.getItem(index).setChecked(true);
		});
	}
}

jCVL_ColumnListView.prototype.onColumnItemCheckboxClick = function (event, colIndex, itemIndex, item) {
	var that = this;
	if (item.isChecked())
	{
		// Get path to root column
		var path = this.list.getColumn(colIndex).getFullPath(itemIndex);
		// Store labels and update jaws
		jQuery.each(path.split(','), function (index, item) {
			if (typeof(that.labels[item]) == 'undefined')
			{
				that.labels[item] = 1;
				that.jaws.addJaw(item);
			}
			else
				that.labels[item]++;
		});
	}
	else
	{
		// Uncheck current and all checked children items if current item equal to selected
		var rems = [];
		
		if (item == this.list.getColumn(colIndex).getSelectedItem())
		{
			// Iterate columns and find checked item's pathes to remove
			for (var i = colIndex + 1; i < this.opts.columnNum; i++)
			{
				var col  = this.list.getColumn(i);
				var strs = col.getItemsString();
				jQuery.each(strs, function (index, item) {
					if (col.getItem(index).isChecked())
					{
						var pp = col.getFullPath(index, ',', i, colIndex).split(',');
						jQuery.merge(rems, pp);
					}
				});
			}
		}

		// Remove collected items
		jQuery.each(rems, function (index, item) {
			if (typeof(that.labels[item]) != 'undefined' && --that.labels[item] <= 0)
			{
				that.jaws.delJaw(item);
				delete that.labels[item];
			}
		});
		// Remove current item
		that.jaws.delJaw(item.getText());
		delete that.labels[item.getText()];
	}
}

// Returns path to given element in array, where array index is colIndex and array value is itemIndex
jCVL_ColumnListView.prototype._findListItemPath = function (data, text) {
	var path_to_col = [];

	// Traverse tree in postorder
	var findLevel = function (data) {
		var ret = -1;
		for (var i=0; i<data.length; i++)
		{
			if (data[i].hasChildren && findLevel(data[i].data) >= 0 || data[i].name == text)
			{
				path_to_col.push(ret = i);
				break;
			}
		}
		return ret;
	}

	findLevel(data);
	
	return path_to_col.reverse();
}

jCVL_ColumnListView.prototype._selectColumnItemByPath = function (col, ptc, cb) {
	var that = this;

	for (var colIndex = col; colIndex < this.opts.columnNum && ptc.length; colIndex++)
	{
		var oldMode, hasNext = colIndex + 1 < this.opts.columnNum;
		if (hasNext)
		{
			var nextCol = this.list.getColumn(colIndex + 1);
			oldMode = nextCol.getSimpleMode();
			nextCol.setSimpleMode(true);
		}
		this.list.getColumn(colIndex).getItem(ptc.shift()).fireOnClick();
		if (hasNext)
			this.list.getColumn(colIndex + 1).setSimpleMode(oldMode);
	}

	if (cb)
		cb();
}

jCVL_ColumnListView.prototype.onJawDelClick = function (event, id, text) {
	var ptc  = this._findListItemPath(this.list.getData(), text);
	var col  = ptc.length - 1;
	var itm  = ptc[ptc.length - 1];
	var that = this;
	if (ptc.length)
		this._selectColumnItemByPath(0, ptc, function () {
			var item = that.list.getColumn(col).getItem(itm);
			item.setChecked(false);
			// item.fireOnCheckboxClick();
			that.list.onColumnItemCheckboxClick(null, col, itm, item);
		});
}

jCVL_ColumnListView.prototype.onJawNameClick = function (event, id, text) {
	var ptc = this._findListItemPath(this.list.getData(), text);
	if (ptc.length)
		this._selectColumnItemByPath(0, ptc);
}



/* -----------------------------------------------------------------------------
 * jColumnListView
 * 
 * See description on the top of file
 */
jQuery.fn.jColumnListView = function (options) {
	var defOpts = {
		id:              'col-list-view',
		columnWidth:     150,
		columnHeight:    200,
		columnMargin:    10,
		columnNum:       3,
		paramName:       'columnview',
		elementId:       '',
		appendToId:      '',
		removeULAfter:   false,
		showLabels:      true
	};
	var opts = $.extend(defOpts, options);

	this.cvl = new jCVL_ColumnListView(opts);
	if (opts.appendToId != '')
		this.cvl.appendTo($('#' + opts.appendToId));
};

// Returns ColumnListView object
jQuery.fn.jColumnListView.prototype.get = function () {
	return this.cvl;
}

// Appends element to given one
jQuery.fn.jColumnListView.prototype.appendTo = function (elem) {
	this.cvl.appendTo(elem);
}
