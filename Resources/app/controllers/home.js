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

__exports.viewLoaded = function(e) {

	//var currLang = CB.Util.getCurrLang();
	this.view.contentView.goBtn.addEventListener('click', function() {
		CB.pushController(CB.controllers.setting);
	});
	/*
	this.view.contentView.backBtn.addEventListener('click', function() {
		CB.popController();
	});*/

	this.view.contentView.switchLangBtn.addEventListener('click', function() {
		var currLang = CB.Util.getCurrLang();
		if (currLang == 'en') {
			CB.Util.switchLang('cn');
		} else {
			CB.Util.switchLang('en');
		}
		CB.Platform.actInd.setMessage(CB.Util.L('loading'));
		CB.Launch('home', true, 'down');
	});

	this.view.john2 = CB.DB.instance.models.get('human').newRecord({
		first_name : 'John',
		last_name : 'Doe'
	});
	this.view.john2.save();

	// create an other "human" record (persisted)
	this.view.sarah2 = CB.DB.instance.models.get('human').newRecord({
		first_name : 'Sarah',
		last_name : 'Sure'
	});
	this.view.sarah2.save();

	this.view.contentView.loadingBtn.addEventListener('click', function() {
		CB.Platform.actInd.show();
		setInterval(function() {
			CB.Platform.actInd.hide();
		}, 2000);
	});

	this.view.contentView.popupBtn.addEventListener('click', function() {
		
		CB.Common.UI.createPopupWin(e.view);
		var popView = e.view.popWin.popView;

		popView.content = Ti.UI.createWebView(CB.Styles.common.webview);
		popView.content.html = '<h1>Test...</h1><p>This is a popup window of CBMVC demo!</p>';
		popView.add(popView.content);

		popView.okBtn = Ti.UI.createButton(CB.Styles.common.okBtn);
		popView.add(popView.okBtn);

		popView.okBtn.addEventListener('click', function(ce) {
			CB.Common.UI.closePopupWin(e.view);
		});
	});

	CB.Debug.dump('====home viewloaded====');
};

__exports.viewWillAppear = function(e) {
	CB.Debug.dump('====home viewWillAppear====');
	if (e != undefined) {
		//CB.Common.setCurrMenu(e.view.mainFrame, CB.Styles.menuSelectedTop.home);
		//CB.Common.closeMenu(e.view.mainFrame);
	}
};
