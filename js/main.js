

var main = {

	audio : null,
	canvas : null,
	canvasContext : null,
	audioContext : null,
	analyser : null,
	source : null,
	freqByteData : null,
	typeNum : 0,
	colorThief : null,

	init : function()
	{
		$( '#btn' ).click( main.switchType );
		main.setUpAudio();
		main.renderConfig();
		main.render();

	},

	setUpAudio : function()
	{
		main.audio = document.getElementById('mp3Music');

		main.audioContext = new webkitAudioContext();

		main.analyser = main.audioContext.createAnalyser();

		main.source = main.audioContext.createMediaElementSource( main.audio );

		main.source.connect( main.analyser );

		main.analyser.connect( main.audioContext.destination );

		main.audio.play();

		main.audio.volume = 1;
	},

	renderConfig : function()
	{
		main.canvas = document.createElement('canvas');		
		
		document.body.appendChild( main.canvas );
		
		main.canvasContext = main.canvas.getContext( '2d' );

		
	},

	render : function()
	{
		/** FPS METER **/
		meter.tick();

		main.canvas.width = window.innerWidth;
		
		main.canvas.height = window.innerHeight;
		
		webkitRequestAnimationFrame( main.render );

		main.freqByteData = new Uint8Array( main.analyser.frequencyBinCount );

		main.analyser.getByteFrequencyData( main.freqByteData );

		main.canvasContext.clearRect( 0, 0, main.canvas.width, main.canvas.height);



		//main.genSpectrum();
		

		switch( main.typeNum )
		{
			case 0:
				main.genSpectrum()
			break;

			case 1:
				main.genCicrleSpectrum()
			break;

			case 2:
				main.genGridSpectrum();
			break;
		}
		
		
		/** FPS METER **/
		meter.tickStart();

	},

	genSpectrum : function()
	{
		var posX = main.canvas.width / 2;
		var posXM = main.canvas.width / 2;		
		var barWidth = Math.round( main.canvas.width / main.freqByteData.length );
		

		for ( var i = 0; i < main.freqByteData.length; ++i ) 
		{
		
			if( main.freqByteData[ i ] > 0 )
			{
				main.canvasContext.fillStyle = main.returnColour( main.freqByteData[ i ] );
				posX++;
				main.canvasContext.fillRect( posX, ( main.canvas.height / 2 )  -  main.freqByteData[ i ], barWidth, 3 );
				main.canvasContext.fillRect( posX, ( main.canvas.height / 2 )  +  main.freqByteData[ i ], barWidth, 1 );

				/** MIRROR **/
				main.canvasContext.fillStyle = main.returnColour( main.freqByteData[ i ] );
				posXM--;
				main.canvasContext.fillRect( posXM, ( main.canvas.height / 2 )  -  main.freqByteData[ i ], barWidth, 3 );
				main.canvasContext.fillRect( posXM, ( main.canvas.height / 2 )  +  main.freqByteData[ i ], barWidth, 1 );
			}
			
		}
	},

	genCicrleSpectrum : function()
	{
		var dex;
		var randStart;

		console.log( main.freqByteData.length );

		for ( var i = 0; i < main.freqByteData.length; ++i ) 
		{
			if( main.freqByteData[ i ] < 200 )
			{
				randStart = dex * ( i / 300 );
				// defining angle by frequency 
				dex = main.freqByteData[ i ] / 100;			

				main.canvasContext.beginPath();
				// x, y, radius, starting angle, ending angle
				main.canvasContext.arc( main.canvas.width / 2, main.canvas.height / 2, i / 2 , randStart, ( dex * Math.PI ) + randStart );
				
				// Apply stroke				
				main.canvasContext.strokeStyle = main.returnColour( main.freqByteData[ i ] );
				main.canvasContext.stroke();

				main.canvasContext.globalAlpha = main.returnOpacity( main.freqByteData[ i ] );

			}
		}
	},

	genGridSpectrum : function()
	{
		var sWidth = main.canvas.width / 50;
		var sHeight = main.canvas.height / 25;
		var posX = 0;
		var posY = main.canvas.height - sHeight;

		for ( var i = 0; i < main.freqByteData.length; ++i ) 
		{
			if( main.freqByteData[ i ] > 0 )
			{
				main.canvasContext.fillStyle = main.returnColour( main.freqByteData[ i ] );
				
				if( ( posX - sWidth ) < main.canvas.width )
				{
					posX += sWidth;				
				
				} else {
					
					posX = 0;
					posY -= sHeight;
					
				}
				main.canvasContext.fillRect( posX, posY, sWidth, sHeight );
				main.canvasContext.globalAlpha = main.returnOpacity( main.freqByteData[ i ] );
			}
		}
	},

	switchType : function( e )
	{
		if( main.typeNum < 2 )
		{
			main.typeNum++;
		} else {
			main.typeNum = 0;
		}
		
		
	},

	returnColour : function( frequency )
	{		
		if( frequency >= 0 && frequency < 25 )
			return '#a31701';
		else if( frequency >= 25 && frequency < 75 )
			return '#f27e29';
		else if( frequency >= 75 && frequency < 100 )
			return '#f0b83c';
		else if( frequency >= 100 && frequency < 125 )
			return '#000';
		else if( frequency >= 125 && frequency < 150 )
			return '#125893';
		else if( frequency >= 150 && frequency < 175 )
			return '#5e92cb';
		else if( frequency >= 175 && frequency <= 200 )
			return '#f0f8ff';		
	},

	returnOpacity : function( frequency )
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

	


}



window.addEventListener('load', main.init, false);