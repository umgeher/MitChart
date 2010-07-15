/* MitChart - Javascript's library for charts in canvas  */
/* Require {MitCanvas}                                   */
/* Developer: Thiago Tiveron Favaro {tiveron@mitgnu.com} */
/* MitGnu Software House - http://www.mitgnu.com         */


// using namespace mitchart
//var mitchart = window.mitchart || {};

var Mitchart = function(data){
    //properties
    this.data = data;
    this.option = {};
    this.canvas = null; // initiate a null object for canvas context
    this.conf = {
	'stage': {
	    'padding': 15,
	    'strokeColor': 'rgb(0, 0, 0)',
	    'strokeWidth': 1.7
	},
	'lines': {
	    'lineWidth': 2,
	    'lineColor': 'rgb(50, 50, 50)',
	    'ballFillColor': 'rgb(250, 250, 250)'
	},
	'labels': {
	    'font': 'arial',
	    'size': 12
	},
	'grid': {
	    'lineColor': 'rgb(30, 30, 30)',
	    'lineWidth': 0.1
	}
    };

    // gets the values from source
    this.__getValues__();

    return true;
};

// prototype methods
Mitchart.prototype = {
    // plot method, print chart on screen
    'plot': function(){
	// make the magic
	this.__makeCanvas__();
	this.canvas = this.__getCanvas__(); // get the canvas context to a object to make him global
	this.__makeStage__();
	this.__makeGrid__();
	this.__makeLabels__();
	this.__makeChart__();

	return true;
    },

    // getter method
    '__get__': function(arg){
	return this.option[arg];
    },

    // setter method
    '__set__': function(arg, value){
	return this.option[arg] = value;
    },

    // gets values from class data source
    '__getValues__': function(){
	this.option['target'] = this.__set__('target', this.data['target']);
	this.option['type'] = this.__set__('type', this.data['type']);
	this.option['xlabel'] = this.__set__('xlabel', this.data['data']['x']['label']);
	this.option['ylabel'] = this.__set__('ylabel', this.data['data']['y']['label']);
	this.option['xvalues'] = this.__set__('xvalues', this.data['data']['x']['values']);
	this.option['yvalues'] = this.__set__('yvalues', this.data['data']['y']['values']);
	this.option['width'] = this.__set__('width', this.data['width']);
	this.option['height'] = this.__set__('height', this.data['height']);
	this.option['ystep'] = this.__set__('ystep', ((this.__get__('width') - (2 * this.conf.stage.padding)) / (this.__get__('yvalues').length - 1)));
	this.option['xstep'] = this.__set__('xstep', (this.__get__('height') - (2 * this.conf.stage.padding)) / (this.__get__('xvalues').length - 1));
	this.option['stageBottom'] = this.__get__('height') - this.conf.stage.padding + (this.conf.grid.lineWidth / 2);
	this.option['stageLeft'] = this.conf.stage.padding;

	return true;
    },

    // returns canvas context
    '__getCanvas__': function(){
	var canvas = document.getElementById(this.__get__('target') + '_canvas');
	var context = canvas.getContext('2d');

	return context;
    },

    // gets the top value of list or lists
    '__getMaxValue__': function(){
	var data = this.__get__('yvalues');
	var max = 0;

	for(var x = 0; x < data.length; x++){
	    if(data[x] > max){
		max = data[x];
	    }
	}
	
	return max;
    },

    // makes the canvas element on placeholder
    '__makeCanvas__': function(){
	var newCanvas = document.createElement('canvas');
	newCanvas.setAttribute('id', this.__get__('target') + '_canvas');
	newCanvas.setAttribute('width', this.__get__('width'));
	newCanvas.setAttribute('height', this.__get__('height'));

	var target = document.getElementById(this.__get__('target'));
	target.appendChild(newCanvas);

	return true;
    },

    // makes the stage for chart
    '__makeStage__': function(){
	this.canvas.strokeStyle = this.conf.stage.strokeColor;
	this.canvas.lineWidth = this.conf.stage.strokeWidth;
	this.canvas.strokeRect(
	    this.conf.stage.padding,
	    this.conf.stage.padding,
	    (this.data['width'] - (this.conf.stage.padding * 2)),
	    (this.data['height'] - (this.conf.stage.padding * 2))
	);

	return true;
    },

    // makes labels for chart
    '__makeLabels__': function(){
	this.canvas.fillStyle = 'rgb(0, 0, 0)';
	this.canvas.textAlign = "center";
	this.canvas.font = "12px arial";

	// xlabels
	for(var x = 0; x < this.__get__('xvalues').length; x++){
	    this.canvas.fillText(
		this.__get__('xvalues')[x],
		this.__get__('stageLeft') + (x * this.__get__('ystep')),
		this.__get__('stageBottom') + 10
	    );
	}

	return true;
    },

    // makes a grid for chart
    '__makeGrid__': function(){	
	this.canvas.lineWidth = this.conf.grid.lineWidth;
	this.canvas.lineStyle = this.conf.grid.lineColor;
	
	// xgrid
	for(var x = 0; x < this.__get__('xvalues').length + 1; x++){
	    this.canvas.beginPath();
	    this.canvas.moveTo(
		this.conf.stage.padding,
		this.__get__('stageBottom') - (x * this.__get__('xstep'))
	    );
	    this.canvas.lineTo(
		this.__get__('width') - this.conf.stage.padding,
		this.__get__('stageBottom') - (x * this.__get__('xstep'))
	    );
	    this.canvas.stroke();
	    this.canvas.closePath();
	}
	
	// ygrid
	for(var y = 0; y < this.__get__('yvalues').length + 1; y++){
	    this.canvas.beginPath();
	    this.canvas.moveTo(
		this.__get__('stageLeft') + (y * this.__get__('ystep')),
		this.conf.stage.padding
		
	    );
	    this.canvas.lineTo(
		this.__get__('stageLeft') + (y * this.__get__('ystep')),
		this.__get__('height') - this.conf.stage.padding
	    );
	    this.canvas.stroke();
	    this.canvas.closePath();
	}

	return true;
    },

    // makes the chart according with type
    '__makeChart__': function(){
	var type = this.__get__('type');
	if(type == 'line'){
	    this.__makeLineChart__();
	} 
	else if(type == 'bar')
	    this.__makeBarChart__();
	else {
	    this.__makeLineChart__();
	}
	
	return true;
    },

    // makes the line chart
    '__makeLineChart__': function(){
	var data = this.__get__('yvalues');
	var stageHeight = this.__get__('height') - (2 * this.conf.stage.padding);
	var color = this.__randomColor__();
	

	// draw data line
	this.canvas.lineWidth = this.conf.lines.lineWidth;
	this.canvas.strokeStyle = color;
	this.canvas.shadowOffsetX = 2;
	this.canvas.shadowOffsetY = 1;
	this.canvas.shadowBlur = 4;
	this.canvas.shadowColor = 'rgba(0, 0, 0, 0.3)';
	this.__getMaxValue__();
	this.canvas.beginPath();
	
	for(var x = 0; x < data.length; x++){
	    var value = (data[x] * stageHeight) / this.__getMaxValue__();
	    if(x == 0){
		this.canvas.moveTo(
		    this.__get__('stageLeft'),
		    this.__get__('stageBottom') - value
		);
	    } else {
		
		this.canvas.lineTo(
		    this.__get__('stageLeft') + (x * this.__get__('ystep')),
		    this.__get__('stageBottom') - value
		);
	    }
	}
	
	this.canvas.stroke();


	// draw points
	this.canvas.lineWidth = this.conf.lines.lineWidth + 1;
	this.canvas.fillStyle = this.conf.lines.ballFillColor;

	for(var x = 0; x < data.length; x++){
	    var value = (data[x] * stageHeight) / this.__getMaxValue__();
	    this.canvas.beginPath();
	    this.canvas.arc(
		this.__get__('stageLeft') + (x * this.__get__('ystep')),
		this.__get__('stageBottom') - value,
		3.5,0,Math.PI*2,true); // Outer circle  
	    this.canvas.stroke(); 
	    this.canvas.fill();
	    this.canvas.closePath;
	}
	
	return true;
    },

    // makes the bar chart
    '__makeBarChart__': function(){
	return true;
    },

    // returns a random color
    '__randomColor__': function(){
	return 'rgb('+Math.floor(Math.random()*250)+','+Math.floor(Math.random()*250)+','+Math.floor(Math.random()*250)+')';
    }
};
