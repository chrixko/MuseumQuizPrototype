var app = new function() {
	this.collectedEpochs = [];
	this.collectedPainters = [];
	this.collectedContexts = [];

	this.selectedEpoch = -1;
	this.selectedPainter = -1;
	this.selectedContext = -1;

	this.getBlurRadius = function() {
		if(this.collectedEpochs.length < 3 || this.collectedEpochs.length < 3 || this.collectedEpochs.length < 3) {
			return 20;
		}

		return 0;
	};

	this.addWord = function(category, word) {
		this.getCollectionByCategory(category).push(word);		
	}

	this.removeWord = function(category, word) {
		var collection = this.getCollectionByCategory(category);

		var index = collection.indexOf(word);
		collection.splice(index, 1);
	}

	this.updateSelector = function(category) {		
		var select = $('select#select_' + category);
		var collection = this.getCollectionByCategory(category);		

		collection.sort();

		select.find('option').remove().end();
		if(collection.length == 0) {
			select.append($('<option></option>').val('').html(''));
		} 

		for(var i = 0; i< collection.length; i++) {
			var value = collection[i];
			select.append($('<option></option>').val(value).html(value));
		}

		$('.ui-slider').remove();				

		$('select#select_epoch').selectToUISlider().hide();
		$('select#select_painter').selectToUISlider().hide();
		$('select#select_context').selectToUISlider().hide();	
	}

	this.getCollectionByCategory = function(category) {
		switch(category)
		{
		case 'epoch':
			return this.collectedEpochs;
			break;
		case 'painter':
			return this.collectedPainters;
			break;
		case 'context':
			return this.collectedContexts;
			break;		  
		default:
			return null;
		}
	}
}