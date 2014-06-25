function AudioSpectrum( $path )
{
	this.audio = null;
	this.canvas = null;
	this.canvasCTX = null;
	this.audioCTX = null;
	this.analyser = null;
	this.source = null;
	this.freqByteData = null;
	this.typeNum = 0;
	this.audioVol = 1;
	this.path = $path;
	this.setUpAudio();
	this.meter = new FPSMeter();
	
	this.button = document.createElement('div');
	this.button.id = 'btn';
	document.body.appendChild( this.button );

	$( this.button ).click( $.proxy(function() 
	{
        this.typeNum < 2 ? this.typeNum++ : this.typeNum = 0;

    }, this ));		
	
};



AudioSpectrum.prototype.setUpAudio = function() 
{	

	this.audio = document.createElement('audio');
	this.audio.id = 'AudioSpectrum';
	this.audio.src = this.path;
	document.body.appendChild( this.audio );

	this.audioCTX = new webkitAudioContext();

	this.analyser = this.audioCTX.createAnalyser();

	this.source = this.audioCTX.createMediaElementSource( this.audio );

	this.source.connect( this.analyser );



	this.analyser.connect( this.audioCTX.destination );



	this.audio.play();

	this.audio.volume = this.audioVol;

	this.setUpCanvas();
};

AudioSpectrum.prototype.setUpCanvas = function() 
{
	
	this.canvas = document.createElement('canvas');		
	this.canvas.id = 'AudioSpectrumCanvas';
	document.body.appendChild( this.canvas );
		
	this.canvasCTX = this.canvas.getContext( '2d' );

	//console.log( this.analyser );
	this.render();
	
};

AudioSpectrum.prototype.render = function() 
{
	/** FPS METER **/
	//this.meter.tick();
	
	this.canvas.width = window.innerWidth;
	
	this.canvas.height = window.innerHeight;
	
	requestAnimationFrame( this.render.bind( this ) );

	this.freqByteData = new Uint8Array( this.analyser.frequencyBinCount );

	

	this.analyser.getByteFrequencyData( this.freqByteData );

	this.canvasCTX.clearRect( 0, 0, this.canvas.width, this.canvas.height);


	switch( this.typeNum )
	{
		case 0:
			this.genParticleSpectrum()
		break;

		case 1:
			this.genCicrleSpectrum()
		break;

		case 2:
			this.genGridSpectrum();
		break;
	}

	
	/** FPS METER **/
	//this.meter.tickStart();
};


AudioSpectrum.prototype.genParticleSpectrum = function() 
{

	var posX = this.canvas.width / 2;
	var posXM = this.canvas.width / 2;		
	var barWidth = Math.round( this.canvas.width / this.freqByteData.length );
	

	for ( var i = 0; i < this.freqByteData.length; ++i ) 
	{
	
		if( this.freqByteData[ i ] > 0 )
		{
			this.canvasCTX.fillStyle = this.returnColour( this.freqByteData[ i ] );
			posX++;
			this.canvasCTX.fillRect( posX, ( this.canvas.height / 2 )  -  this.freqByteData[ i ], barWidth, 3 );
			this.canvasCTX.fillRect( posX, ( this.canvas.height / 2 )  +  this.freqByteData[ i ], barWidth, 1 );

			/** MIRROR **/
			this.canvasCTX.fillStyle = this.returnColour( this.freqByteData[ i ] );
			posXM--;
			this.canvasCTX.fillRect( posXM, ( this.canvas.height / 2 )  -  this.freqByteData[ i ], barWidth, 3 );
			this.canvasCTX.fillRect( posXM, ( this.canvas.height / 2 )  +  this.freqByteData[ i ], barWidth, 1 );
		}
		
	}
};


AudioSpectrum.prototype.genCicrleSpectrum = function() 
{
	var dex;
	var randStart;

	for ( var i = 0; i < this.freqByteData.length; ++i ) 
	{
		if( this.freqByteData[ i ] < 200 )
		{
			randStart = dex * ( i / 300 );
			// defining angle by frequency 
			dex = this.freqByteData[ i ] / 100;			

			this.canvasCTX.beginPath();
			// x, y, radius, starting angle, ending angle
			this.canvasCTX.arc( this.canvas.width / 2, this.canvas.height / 2, i / 2 , randStart, ( dex * Math.PI ) + randStart );
			
			// Apply stroke				
			this.canvasCTX.strokeStyle = this.returnColour( this.freqByteData[ i ] );
			this.canvasCTX.stroke();

			this.canvasCTX.globalAlpha = this.returnOpacity( this.freqByteData[ i ] );

		}
	}

};

AudioSpectrum.prototype.genGridSpectrum = function() 
{
	var sWidth = this.canvas.width / 50;
	var sHeight = this.canvas.height / 25;
	var posX = 0;
	var posY = this.canvas.height - sHeight;

	for ( var i = 0; i < this.freqByteData.length; ++i ) 
	{
		if( this.freqByteData[ i ] > 0 )
		{
			this.canvasCTX.fillStyle = this.returnColour( this.freqByteData[ i ] );
			
			if( ( posX - sWidth ) < this.canvas.width )
			{
				posX += sWidth;				
			
			} else {
				
				posX = 0;
				posY -= sHeight;
				
			}
			this.canvasCTX.fillRect( posX, posY, sWidth, sHeight );
			this.canvasCTX.globalAlpha = this.returnOpacity( this.freqByteData[ i ] );
		}
	}
};

AudioSpectrum.prototype.returnColour = function( frequency ) 
{
	if( frequency >= 0 && frequency < 25 )
		return '#a31701';
	else if( frequency >= 25 && frequency < 75 )
		return '#f27e29';
	else if( frequency >= 75 && frequency < 100 )
		return '#f0b83c';
	else if( frequency >= 100 && frequency < 125 )
		return '#0a355a';
	else if( frequency >= 125 && frequency < 150 )
		return '#125893';
	else if( frequency >= 150 && frequency < 175 )
		return '#5e92cb';
	else if( frequency >= 175 )
		return '#f0f8ff';		
};

AudioSpectrum.prototype.returnOpacity = function( frequency ) 
{
	if( frequency >= 0 && frequency < 25 )
		return 1;
	else if( frequency >= 25 && frequency < 75 )
		return 0.9;
	else if( frequency >= 75 && frequency < 100 )
		return 0.8;
	else if( frequency >= 100 && frequency < 125 )
		return 0.7;
	else if( frequency >= 125 && frequency < 150 )
		return 0.6;
	else if( frequency >= 150 && frequency < 175 )
		return 0.5;
	else if( frequency >= 175 && frequency <= 200 )
		return 0.4;		
}