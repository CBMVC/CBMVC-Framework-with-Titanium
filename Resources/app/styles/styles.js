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
	menuLeft : CB.screenWidth * 0.07,
	tableHeight : function() {
		//CB.Debug.echo(Ti.Platform.displayCaps.platformHeight, 7, 'styles.js');
		if (CB.Platform.isAndroid()) {
			return '85%';
		} else {
			return '88%';
		}
	},

	/**
	 * just for debug model, add the border to the view or button
	 */
	debugLayout : {
		borderWidth : 1,
		borderColor : 'blue'
	}
	,
	debugLayoutRed : {
		borderWidth : 1,
		borderColor : 'red'
	}
};

(function() {
	/**
	 * common styles
	 */
	CB.Styles.common = {
		baseView : {
			width : CB.screenWidth,
			//left : (CB.screenWidth * 0.07),
			right: 0,
			top: 0,
			//if show the statusbar, then need to minus the statusbar height
			height : (CB.screenHeight - CB.screenHeight * 0.02),
			backgroundImage : CB.Styles.imagePath + 'bg.jpg'
		},
		barTitle : {
			width : 'auto',
			textAlign : 'center',
			color : '#9E0402',
			font : {
				fontSize : '14dp',
				fontWeight : 'bold'
			}
		},
		popCloseBtn : {
			//left : '4%',
			//top : '4%',
			width : '9%',
			height : '6.4%',
			backgroundImage : CB.Styles.imagePath + 'btn-close.png'
		},
		webview : {
			top : CB.screenHeight * 0.03,
			left: CB.screenHeight * 0.03,
			width : '90%',
			height : '85%',
			borderColor: '#fff',
			//backgroundColor:'blue'
		},
		okBtn : {
			left : '40%',
			width : '18%',
			bottom: '2%',
			title: 'OK',
			height : CB.screenHeight * 0.06
		},
		
		arrowIcon : {
			width : '2%',
			right : '10%',
			image : CB.Styles.imagePath+ 'arrow-btn.png'
		},
		rowText : {
			left : '5%',
			top: '10%',
			width : 'auto',
			color : '#000',
			font : {
				fontSize : '15dp',
				fontWeight : 'bold'
			}
		},
		rowSubText : {
			left : '15%',
			bottom: '2%',
			width : 'auto',
			color : '#817f7f',
			font : {
				fontSize : '11dp'
			}
		},
		tableList : {
			top : '8%',
			height : CB.Styles.tableHeight()
		},
		rowView : {
			hasDetail : true,
			hasChild: true,
			height : '60dp',
			backgroundImage : CB.Styles.imagePath + 'row-bg.png'
		},
		detaiView : {
			top : '11%',
			width: '100%',
			height : '70%'
		}
	}
	
	/**
	 * search bar style
	 */
	CB.Styles.searchBar = {
		mainBar : {
			top: '0',
			height:'7%',
			backgroundImage: CB.Styles.imagePath + 'bar-top.png'
		},
		searchInput : {
			top : '10%',
			right : '20%',
			width : '60%',
			height : '99%',
			font: {
				fontSize:'13dp'
			},
			hintText:  CB.Util.L('search'),
			backgroundImage: CB.Styles.imagePath + 'search_bg.png'
		},
		searchView:{
			top : '10%',
			right : '1%',
			width : '45%',
			height : '90%',
			backgroundImage: CB.Styles.imagePath + 'search_view.png'
		},
		cancelBtn:{
			top : '19%',
			right : '5%',
			width : '15%',
			height : '60%',
			backgroundImage: CB.Styles.imagePath + 'cancel.png'
		}
	}
	/**
	 * menu style
	 */
	CB.Styles.menu = {
		baseView : {
			width : CB.screenWidth,
			height : (CB.screenHeight - CB.screenHeight * 0.02),
			backgroundImage : CB.Styles.imagePath + 'bg.jpg'
		},
		mainFrame:{
			left: -CB.screenWidth * 1,
			top: 0,
			width: CB.screenWidth * 2,
			height: CB.screenHeight,
			//zIndex: 999
		},
		mainMenu : {
			title:'Menu',
		    left: CB.Styles.menuLeft,
		    top: 0,
		    width: CB.screenWidth,
		    height: CB.screenHeight,
		    backgroundImage : CB.Styles.imagePath + 'bg.jpg',
		    zIndex:999
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
			title: 'DB Testing'
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
	 * Setting view's styles
	 */
	CB.Styles.setting = {
		table : {
			width:'90%',
			height:'80%',
			top: '10%'
			//objName : 'table'
		},
		backBtn : {
			top : '1%',
			left : '7%',
			title : 'Back',
			color : '#000'
		},
		insertBtn : {
			top : '10%',
			left : '7%',
			title : 'Insert Testing',
			color : '#000'
		},
		delBtn : {
			top : '20%',
			left : '7%',
			title : 'Del Testing',
			color : '#000'
		},
		editBtn : {
			top : '30%',
			left : '7%',
			title : 'Edit Testing',
			color : '#000'
		},
		pushToHomeBtn : {
			top : '80%',
			left : '7%',
			title : 'Push to home',
			color : '#000'
		},
		queryBtn : {
			top : '40%',
			left : '7%',
			title : 'Query FirstName',
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
		},
		textCityId : {
			hintText : 'city id(query,edit,del)',
			height : '9%',
			top : '20%',
			right : '1%',
			width : '55%',
			borderStyle : Ti.UI.INPUT_BORDERSTYLE_ROUNDED
		},
		textFirstName : {
			hintText : 'first name(update)',
			height : '9%',
			top : '30%',
			right : '1%',
			width : '55%',
			borderStyle : Ti.UI.INPUT_BORDERSTYLE_ROUNDED
		},
		desc : {
			width : '80%',
			bottom: '20%',
			textAlign : 'center',
			color : 'blue',
			font : {
				fontSize : '18dp',
				fontWeight : 'bold'
			},
			text: 'Please look at the console to display the result after click the above buttons!'
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
		CB.Platform.extend(CB.Styles.menu.mainMenu, CB.Styles.debugLayout);
		CB.Platform.extend(CB.Styles.menu.mainFrame, CB.Styles.debugLayoutRed);
	}
})();
