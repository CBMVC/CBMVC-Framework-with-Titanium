/**
 * @file overview This file contains the core framework class CBMVC.
 * @author Winson  winsonet@gmail.com
 * @copyright Winson http://www.coderblog.in
 * @license MIT License http://www.opensource.org/licenses/mit-license.php
 * 
 * @disclaimer THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" 
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED 
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. 
 * IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, 
 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, 
 * 	PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) 
 * HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, 
 * OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, 
 * EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

CB.Platform = {
	android : {
		menu : {}
	},
	osname : undefined,
	__isLargeScreen : undefined,
	__isAndroid : undefined
};

// init platform information
(function() {

	CB.Platform.osname = Ti.Platform.osname;

	CB.ApplicationDirectory = Ti.Filesystem.resourcesDirectory;

	CB.Platform.extend = function(obj) {
		var args = Array.prototype.slice.call(arguments, 1);
		for (var i = 0, l = args.length; i < l; i++) {
			var source = args[i];
			for (var prop in source) {
				if (source[prop] !==
					void 0)
					obj[prop] = source[prop];
			}
		}
		return obj;
	};

	CB.Platform.isLargeScreen = function() {
		if (CB.Platform.__isLargeScreen === undefined) {
			CB.Platform.__isLargeScreen = (Ti.Platform.displayCaps.platformWidth >= 600);
		}
		return CB.Platform.__isLargeScreen;
	};

	CB.Platform.isHighDensity = function() {
		return Ti.Platform.displayCaps.density == 'high';
	};

	CB.Platform.isAndroid = function() {
		if (CB.Platform.__isAndroid === undefined) {
			CB.Platform.__isAndroid = (CB.Platform.osname == 'android');
		}
		return CB.Platform.__isAndroid;
	}
	/*
	 * Get absolute measurements
	 * Reference :
	 * http://docs.appcelerator.com/titanium/2.0/index.html#!/guide/Layouts,_Positioning,_and_the_View_Hierarchy
	 */
	CB.Platform.px = function(dip) {

		var screen_density = Ti.Platform.displayCaps.getDpi();
		var actual_pixels = dip * screen_density / (CB.Platform.isAndroid ? 160 : 163);

		CB.Debug.echo(screen_density, 54);
		if (CB.Platform.isLargeScreen) {
			if (CB.Platform.isAndroid) {
				actual_pixels = actual_pixels * 2;
			} else {
				actual_pixels = actual_pixels * 5;
			}
			CB.Debug.echo('===is large screen after === ' + actual_pixels);
		}

		return actual_pixels;
	};

	CB.Platform.cleanSpecialChars = function(str) {
		if (str == null) {
			return '';
		}
		if ( typeof str === 'string') {
			return str.replace(/&quot;/g, '"').replace(/\&amp\;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&#039;/g, "'");
		}
		return '';
	};

	/**
	 * Show the activity indicator with cross platform
	 */
	CB.Platform.actInd = {
		actIndWin : undefined,
		init : function(win) {

			win.actInd = Titanium.UI.createActivityIndicator({
				height : '100%',
				width : '100%',
				zIndex : 100,
				//font : {fontFamily:'Helvetica Neue', fontSize:15,fontWeight:'bold'}
			});

			win.actInd.hide();
			win.actInd.isHide = true;

			if (CB.Platform.isAndroid()) {
				win.actInd.message = CB.Util.L('loading');
				win.add(win.actInd);
			} else {
				win.actInd.top = '-15%';
				
				win.actIndContainer = Ti.UI.createView({
					height : '100%',
					width : '100%',
				});
				win.add(win.actIndContainer);

				win.actIndContainer.mainBg = Ti.UI.createView({
					height : '100%',
					width : '100%',
					backgroundColor : '#333',
					opacity : 0.8
				});
				win.actIndContainer.add(win.actIndContainer.mainBg);

				win.actIndContainer.actIndBg = Ti.UI.createView({
					backgroundColor : '#000',
					center : {
						x : Ti.Platform.displayCaps.platformWidth / 2,
						y : Ti.Platform.displayCaps.platformHeight / 2
					},
					width : 150,
					height : 100,
					borderRadius : 10
				});
				win.actIndContainer.add(win.actIndContainer.actIndBg);

				win.actIndContainer.actIndBg.loading = Ti.UI.createLabel({
					text : CB.Util.L('loading'),
					color : '#fff',
					textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
					//left : '30%',
					bottom : '25%'
				});
				win.actIndContainer.actIndBg.add(win.actIndContainer.actIndBg.loading);
				
				win.actIndContainer.hide();
			
				win.actIndContainer.actIndBg.add(win.actInd);
				win.style = Titanium.UI.iPhone.ActivityIndicatorStyle.DARK;
			}

			CB.Platform.actInd.actIndWin = win;
		},
		setMessage : function(message){
			if(!CB.Platform.isAndroid()){
				CB.Platform.actInd.actIndWin.actIndContainer.actIndBg.loading.text = message;
			}else{
				CB.Platform.actInd.actIndWin.actInd.message = message;
			}
		},
		show : function() {
			if(CB.Platform.actInd.actIndWin && CB.Platform.actInd.actIndWin.actInd.isHide){
				CB.Platform.actInd.actIndWin.actInd.isHide = false;
				CB.Platform.actInd.actIndWin.actInd.show();
				if (!CB.Platform.isAndroid()) {
					CB.Platform.actInd.actIndWin.actIndContainer.show();
				}
			}
		},
		hide : function() {
			if(CB.Platform.actInd.actIndWin && !CB.Platform.actInd.actIndWin.actInd.isHide){
				CB.Platform.actInd.actIndWin.actInd.isHide = true;
				CB.Platform.actInd.actIndWin.actInd.hide();
				if (!CB.Platform.isAndroid()) {
					CB.Platform.actInd.actIndWin.actIndContainer.hide();
				}
			}
		}
	};

	CB.Platform.android.menu = {
		data : [],
		init : function(params) {
			Ti.Android.currentActivity.onCreateOptionsMenu = function(e) {
				var optionsmenu = e.menu;
				for ( k = 0; k < params.buttons.length; k++) {
					CB.Platform.android.menu.data[k] = optionsmenu.add({
						title : params.buttons[k].title
					});
					CB.Platform.android.menu.data[k].setIcon(params.buttons[k].icon);
					CB.Platform.android.menu.data[k].addEventListener("click", params.buttons[k].clickevent);
				}
			};
		}
	};

})();


