var app = new function() {
	this.collectedEpochs = [];
	this.collectedPainters = [];
	this.collectedContexts = [];

	this.selectedEpoch = -1;
	this.selectedPainter = -1;
	this.selectedContext = -1;

	//this.epochSlider = null;

	this.getBlurRadius = function() {
		if(this.collectedEpochs.length < 3 || this.collectedPainters.length < 3 || this.collectedContexts.length < 3) {
			return 20;
		}

		return 0;
	};

	this.getScrollbarsEnabled = function () {
		return (this.collectedEpochs.length >= 3 && this.collectedPainters.length >= 3 && this.collectedContexts.length >= 3);
	}

	this.initSliders = function() {			
		var self = this;		
		var epoch = $('select#select_epoch').selectToUISlider({
		    sliderOptions: {
		        change: function(e, ui) { 
		            self.checkEpoch(ui.value);
		        }
		    }
		}).hide();

		var painter = $('select#select_painter').selectToUISlider({
		    sliderOptions: {
		        change: function(e, ui) { 
		            self.checkPainter(ui.value);
		        }
		    }
		}).hide();

		var context = $('select#select_context').selectToUISlider({
		    sliderOptions: {
		        change: function(e, ui) { 
		            self.checkContext(ui.value);
		        }
		    }
		}).hide();

		if(this.getScrollbarsEnabled()) {
			$('.ui-slider').slider('enable');			
		} else {
			$('.ui-slider').slider('disable');
		}
	}

	this.checkEpoch = function(value) {
		this.selectedEpoch = value;
	}

	this.checkPainter = function(value) {
		this.selectedPainter = value;
	}

	this.checkContext = function(value) {
		this.selectedContext = value;
	}	


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

		this.initSliders();

		//this.epochSlider.slider("refresh");
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