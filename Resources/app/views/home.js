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

__exports = (function() {

	//var view  = CB.Common.UI.createBaseViewWithMenu(__exports.viewName);
	var view = Ti.UI.createView(CB.Styles.common.baseView);	
	view.name = __exports.viewName;
	view.contentView = Ti.UI.createView();
	view.add(view.contentView);
	view.contentView.add(Ti.UI.createLabel(CB.Styles[view.name].logo));	
	/*
	view.contentView.backBtn = Ti.UI.createButton(CB.Styles[view.name].backBtn);
	view.contentView.add(view.contentView.backBtn);
	*/
	view.contentView.goBtn = Ti.UI.createButton(CB.Styles[view.name].goBtn);
	view.contentView.add(view.contentView.goBtn);
	
	view.contentView.switchLangBtn = Ti.UI.createButton(CB.Styles[view.name].switchLangBtn);
	view.contentView.add(view.contentView.switchLangBtn);
	

	view.contentView.loadingBtn = Ti.UI.createButton({
		bottom: '30%',
		title : 'Loading Test',
		color : '#000'
	});
	view.contentView.add(view.contentView.loadingBtn);
	
	view.contentView.popupBtn = Ti.UI.createButton({
		bottom: '55%',
		title : 'Test Popup Window',
		color : '#000'
	});
	view.contentView.add(view.contentView.popupBtn);

	return view;
})();
