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
 * Utility
 *
 */

var __defaultLanguage = 'en';

function setDefaultLang(lang) {
	if (lang != undefined)
		this.__defaultLanguage = lang;
}

/**
 * show the alert dialog box
 * @param {String} message, alert message 
 * @param {String} title, alert box title
 */
function alert(message, title){
	 var dialog = Ti.UI.createAlertDialog({
	 	ok: 'Ok',
	    //cancel: 1,
	    //buttonNames: ['Confirm', 'Cancel', 'Help'],
	    message: message,
	    title: title == undefined ? this.L('alert') : title
	 }).show();
}


/**
 * show the alert dialog box
 * @param {String} message, alert message 
 * @param {String} title, alert box title
 * @param {Object} callback function after click yes
 */
function confirm(message, title, callback){
	 var dialog = Ti.UI.createAlertDialog({	 	
	    buttonNames: [this.L('yes'), this.L('no')],
	    message: message,
	    cancel: 1,
	    title: title == undefined ? this.L('confirm') : title
	 });
	 
	 dialog.addEventListener('click', function(e) {
		 if (e.cancel === e.index || e.cancel === true) {
		      return;
		 }		 
		 callback();
	 });
	 
	 dialog.show();
}

/**
 * Trim string
 * @param {String} str
 * @returns a trim string
 */
function trim(str) {
	var str = str.replace(/^\s\s*/, ''), ws = /\s/, i = str.length;
	while (ws.test(str.charAt(--i)));
	return str.slice(0, i + 1);
}

/**
 * Uppercase first letter in string
 * @param {String} str
 * @returns an ucfirst string
 */
function ucFirst(str) {
	str += '';
	var f = str.charAt(0).toUpperCase();
	return f + str.substr(1);
}

/**
 * Check whether has the property by key
 * @param {string} key, property's key
 * @returns a bool
 */
exports.hasProperty = function(/*String*/key) {
	return Ti.App.Properties.hasProperty(key);
};
/**
 * Save the property
 * @param {string} key, property's key
 * @param {Object} val, property's value(JSON format object)
 */
function saveObject(/*String*/key, /*Object*/val) {
	Ti.App.Properties.setString(key, JSON.stringify(val));
};
/**
 * Gets property by key
 * @param {String} property's key
 * @returns JSON format object
 */
function loadObject(/*String*/key) {
	var value = Ti.App.Properties.getString(key);
	try {
		return JSON.parse(value);
	} catch (e) {
		return value;
	}
};

/**
 * Remove the property
 * @param {string} key, property's key
 */
function removeObject(/*String*/key) {
	Ti.App.Properties.removeProperty(key);
};

/**
 * switch cuttent language
 */
function switchLang(lang) {
	this.saveObject('lang', lang);
}

/**
 * get language by key
 */
function L(key) {
	try {
		var lang = this.loadObject('lang');

		if (lang == null) {
			lang = this.__defaultLanguage;
			this.saveObject('lang', lang);
		}
		var file = Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory + 'app/languages/' + lang + '.xml');
		var xmltext = file.read().text;

		var xmldata = Ti.XML.parseString(xmltext);
		//var data = xmldata.documentElement.getElementsByTagName(key);
		//var data = xmldata.getElementById(key).attributes.getNamedItem('value');
		var data = xmldata.getElementById(key).getFirstChild();

		if (data != null) {
			//self.debugObj('lang data',data.item(0).text);
			return data.getNodeValue();
		}
		return "";
	} catch(e) {
		var dialog = Titanium.UI.createAlertDialog({
			ok: 'Ok',
			title : 'Error: lang key ' + key,
			message : 'Cannot found the language key!' + e
		});
		//dialog.show();
	}
}

/**
 * get current language
 */
function getCurrLang() {

	var lang = this.loadObject('lang');

	if (lang == null) {
		lang = this.__defaultLanguage;
	}
	return lang;
}

exports.L = L;
exports.getCurrLang = getCurrLang;
exports.setDefaultLang = setDefaultLang;
exports.trim = trim;
exports.alert = alert;
exports.ucFirst = ucFirst;
exports.saveObject = saveObject;
exports.removeObject = removeObject;
exports.switchLang = switchLang;
exports.loadObject = loadObject;
