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

/**
 * The styles of the apps
 */
CB.Styles = {

	//image's path with this style
	imagePath : CB.ApplicationDirectory + 'images/',
	//menu select mask view's top
	menuSelectedTop:{
		home : '7%',
		setting: '27%',
	},
	barBottom : function() {
		CB.Debug.echo(Ti.Platform.displayCaps.platformHeight, 7, 'styles.js');
		if (Ti.Platform.displayCaps.platformHeight <= 480 && CB.Platform.isAndroid()) {
			return '3%';
		} else {
			return '2%';
		}
	},

	/**
	 * just for debug model, add the border to the view or button
	 */
	debugLayout : {
		borderWidth : 1,
		borderColor : 'blue'
	}
};

(function() {
	/**
	 * common styles
	 */
	CB.Styles.common = {
		baseView : {
			width : CB.screenWidth,
			//if show the statusbar, then need to minus the statusbar height
			height : (CB.screenHeight - CB.screenHeight * 0.02),
			backgroundImage : CB.Styles.imagePath + 'bg.png'
		},
		barTitle : {
			width : 'auto',
			textAlign : 'center',
			color : '#9E0402',
			font : {
				fontSize : '14dp',
				fontWeight : 'bold'
			}
		}
	}
	/**
	 * menu style
	 */
	CB.Styles.menu = {
		baseView : {
			width : CB.screenWidth,
			//if show the statusbar, then need to minus the statusbar height
			height : (CB.screenHeight - CB.screenHeight * 0.02),
			backgroundImage : CB.Styles.imagePath + 'bg.png'
		},
		mainFrame:{
			left: -CB.screenWidth,
			top: 0,
			width: CB.screenWidth,
			height: CB.screenHeight,
			zIndex: 999
		},
		mainMenu : {
			title:'Menu',
		    left: 0,
		    top: 0,
		    width: CB.screenWidth,
		    height: CB.screenHeight,
		    backgroundColor:'#fff',
		    backgroundImage : CB.Styles.imagePath + 'bg.png'
		},
		mainMenuBar : {
		    right: 0,
		    top: 0,
		    width: '30%',
		    height: CB.screenHeight,
			backgroundImage : CB.Styles.imagePath + 'menu-bar.png'
		},
		menuSelected : {
			right : '1%',
			top : '27%',
			width : '19%',
			height : '13%',
			backgroundImage : CB.Styles.imagePath + 'menu-selected.png'
		},
		menuBtn : {
			right : '0',
			top : '1%',
			width : '30%',
			height : '7%',
			backgroundImage : CB.Styles.imagePath + 'menu-btn-right.png'
		},
		homeBtn : {
			right : '7%',
			top : '10%',
			width : '11%',
			height : '7%',
			backgroundImage : CB.Styles.imagePath + 'icon-home.png'
		},
		settingBtn : {
			right : '7%',
			top : '30%',
			width : '11%',
			height : '7%',
			backgroundImage : CB.Styles.imagePath + 'icon-setting.png'
		}
	}
	/**
	 * home view's styles
	 */
	CB.Styles.home = {
		logo : {
			width : 'auto',
			top: '15%',
			textAlign : 'center',
			color : 'blue',
			font : {
				fontSize : '18dp',
				fontWeight : 'bold'
			},
			text: CB.Util.L('logo')
		},
		goBtn : {
			top : '50%',
			height : '6%',
			font : {
				fontSize : '17dp',
				fontWeight : 'bold'
			},
			title: 'Go Next'
		},
		switchLangBtn : {
			top : '30%',
			height : '6%',
			font : {
				fontSize : '17dp',
				fontWeight : 'bold'
			},
			title: CB.Util.L('switchLang')
		}
	}

	/**
	 * login view's styles
	 */
	CB.Styles.setting = {
		table : {
			width:'90%',
			height:'80%',
			top: '10%',
			//objName : 'table'
		},
		backBtn : {
			top : '1%',
			left : '7%',
			title : 'Back',
			color : '#000'
		},
		rowText : {
			left : '28%',
			width : '55%',
			text : 'Just for testing',
			color : '#E25C00',
			font : {
				fontSize : '14dp',
				fontWeight : 'bold'
			}
		}
	}

	
	/**
	 * ============================================================================================
	 *
	 * There are some logics for handle the different styles in mutlple platform or debug mode
	 *
	 * ============================================================================================
	 */

	/**
	 * Add the border layout within the elements in debug mode
	 */
	if (CB.DebugMode.style) {
		//home's debug layout:
		CB.Platform.extend(CB.Styles.home.logo, CB.Styles.logo);

	}
})();
