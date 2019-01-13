var nytg = nytg || {};
var $j = jQuery;
var chart = null;
nytg.ChooseList = function (node, changeCallback, index) {
    this.container = $j(node);
    this.selectedNode = null;
    this.currentIndex = null;
    this.onChange = changeCallback;
    this.elements = this.container.find('li');
    this.container.find('li').on('click', $j.proxy(this.onClickHandler, this));
    this.currentIndex = (index == undefined || index == null || index == '') ? 0 : index
    this.selectByIndex(this.currentIndex);
};

nytg.ChooseList.prototype.onClickHandler = function (evt) {
    evt.preventDefault();
    this.selectByElement(evt.currentTarget);
};


nytg.ChooseList.prototype.selectByIndex = function (i) {
    this.currentIndex = (i == undefined || i == null || i == '') ? 0 : i;
    this.selectByElement(this.elements[this.currentIndex])
};

nytg.ChooseList.prototype.getSelectValue = function () {
    return this.currentIndex;
}

nytg.ChooseList.prototype.selectByElement = function (el) {
    if (this.selectedNode) {
        $j(this.selectedNode).removeClass("selectl");
    }
    ;
    $j(el).addClass("selectl");
    for (var i = 0; i < this.elements.length; i++) {
        if (this.elements[i] === el) {
            this.currentIndex = i;
        }
    }
    ;
    this.selectedNode = el;
    this.onChange(this);
};