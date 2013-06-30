var app = new function() {
	this.collectedEpochs = [];
	this.collectedPainters = [];
	this.collectedContexts = [];

	this.selectedEpoch = -1;
	this.selectedPainter = -1;
	this.selectedContext = -1;

	this.correctEpoch = '17th century';
	this.correctPainter = 'Johannes Vermeer';
	this.correctContext = 'Dutch Golden Age';
	//this.epochSlider = null;

	this.getBlurRadius = function() {
		var radius = 20;

		if(!this.getScrollbarsEnabled()) {
			return radius;
		}

		if(this.checkEpoch(this.selectedEpoch)) {
			radius -= 8;
		}

		if(this.checkPainter(this.selectedPainter)) {
			radius -= 4;
		}

		if(this.checkContext(this.selectedContext)) {
			radius -= 8;
		}		

		return radius;
	}

	this.getScrollbarsEnabled = function () {
		return (this.collectedEpochs.length == 3 && this.collectedPainters.length == 5 && this.collectedContexts.length == 4);
	}

	this.initSliders = function() {			
		var self = this;		
		var epoch = $('select#select_epoch').selectToUISlider({
		    sliderOptions: {
		        change: function(e, ui) { 
		            self.checkEpoch(ui.value);
		            self.blurImage();
		        }
		    }
		}).hide();

		var painter = $('select#select_painter').selectToUISlider({
		    sliderOptions: {
		        change: function(e, ui) { 
		            self.checkPainter(ui.value);
		            self.blurImage();
		        }
		    }
		}).hide();

		var context = $('select#select_context').selectToUISlider({
		    sliderOptions: {
		        change: function(e, ui) { 
		            self.checkContext(ui.value);
		            self.blurImage();
		        }
		    }
		}).hide();

		if(this.getScrollbarsEnabled()) {
			$('.ui-slider').slider('enable');
			this.checkEpoch(0);
			this.checkPainter(0);
			this.checkContext(0);

			this.blurImage();
		} else {
			$('.ui-slider').slider('disable');
		}
	}

	this.checkEpoch = function(value) {
		this.selectedEpoch = value;			
		$('div#indicators_epoch').html('');		

		var word = this.collectedEpochs[this.selectedEpoch];
		var correctAnswer = (word == this.correctEpoch);

		var rightClass = correctAnswer == 1 ? 'active' : 'inactive';
		var wrongClass = rightClass == 'active' ? 'inactive' : 'active';

		$('div#indicators_epoch').prepend('<img class="indicator_' + wrongClass + '" width="24px" src="images/wrong.png" />')
		$('div#indicators_epoch').prepend('<img class="indicator_' + rightClass + '" width="24px" src="images/right.png" />')

		return correctAnswer;
	}

	this.checkPainter = function(value) {
		this.selectedPainter = value;
		$('div#indicators_painter').html('');		

		var word = this.collectedPainters[this.selectedPainter];
		var correctAnswer = (word == this.correctPainter);

		var rightClass = correctAnswer == 1 ? 'active' : 'inactive';
		var wrongClass = rightClass == 'active' ? 'inactive' : 'active';

		$('div#indicators_painter').prepend('<img class="indicator_' + wrongClass + '" width="24px" src="images/wrong.png" />')
		$('div#indicators_painter').prepend('<img class="indicator_' + rightClass + '" width="24px" src="images/right.png" />')		

		return correctAnswer;
	}

	this.checkContext = function(value) {
		this.selectedContext = value;
		$('div#indicators_context').html('');		

		var word = this.collectedContexts[this.selectedContext];
		var correctAnswer = (word == this.correctContext);

		var rightClass = correctAnswer == 1 ? 'active' : 'inactive';
		var wrongClass = rightClass == 'active' ? 'inactive' : 'active';

		$('div#indicators_context').prepend('<img class="indicator_' + wrongClass + '" width="24px" src="images/wrong.png" />')
		$('div#indicators_context').prepend('<img class="indicator_' + rightClass + '" width="24px" src="images/right.png" />')				

		return correctAnswer;
	}	

	this.blurImage = function() {
		$("#painting").foggy({
			blurRadius: this.getBlurRadius(),          // In pixels.
			opacity: 1,           // Falls back to a filter for IE.			
		}); 		
	}


	this.addWord = function(category, word) {
		var collection = this.getCollectionByCategory(category);
		var max = this.getMaxItemsByCategory(category);

		if(collection.length >= max) {
			return false;
		}

		collection.push(word);

		return true;		
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

		var epoch_count = this.getMaxItemsByCategory('epoch') - this.collectedEpochs.length;
		$('#epoch_word_count').html('<b>- Epoch: (' + epoch_count +' left)</b>');
		
		if(epoch_count == 0) {			
			$('#epoch_word_count').addClass('green');
		} else {
			$('#epoch_word_count').removeClass('green');
		}

		var painter_count = this.getMaxItemsByCategory('painter') - this.collectedPainters.length;
		$('#painter_word_count').html('<b>- Painter: (' + painter_count +' left)</b>');

		if(painter_count == 0) {			
			$('#painter_word_count').addClass('green');
		} else {
			$('#painter_word_count').removeClass('green');
		}

		var context_count = this.getMaxItemsByCategory('context') - this.collectedContexts.length;
		$('#context_word_count').html('<b>- Context: (' + context_count +' left)</b>');

		if(context_count == 0) {			
			$('#context_word_count').addClass('green');
		} else {
			$('#context_word_count').removeClass('green');
		}		
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

	this.getMaxItemsByCategory = function(category) {
		switch(category)
		{
			case 'epoch':
				return 3;
				break;
			case 'painter':
				return 5;
				break;
			case 'context':
				return 4;
				break;		  
			default:
				return null;
		}
	}	
}