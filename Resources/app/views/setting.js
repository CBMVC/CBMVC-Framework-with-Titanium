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
	
	var view  = CB.Common.UI.createBaseViewWithMenu(__exports.viewName);

	view.contentView.backBtn = Ti.UI.createButton(CB.Styles[view.name].backBtn);
	view.contentView.add(view.contentView.backBtn);

	view.contentView.insertBtn = Ti.UI.createButton(CB.Styles[view.name].insertBtn);
	view.contentView.add(view.contentView.insertBtn);
	
	view.contentView.delBtn = Ti.UI.createButton(CB.Styles[view.name].delBtn);
	view.contentView.add(view.contentView.delBtn);
	
	view.contentView.editBtn = Ti.UI.createButton(CB.Styles[view.name].editBtn);
	view.contentView.add(view.contentView.editBtn);
	
	view.contentView.queryBtn = Ti.UI.createButton(CB.Styles[view.name].queryBtn);
	view.contentView.add(view.contentView.queryBtn);
	
	view.contentView.textCityId = Ti.UI.createTextField(CB.Styles[view.name].textCityId);
	view.contentView.add(view.contentView.textCityId);
	
	view.contentView.textFirstName = Ti.UI.createTextField(CB.Styles[view.name].textFirstName);
	view.contentView.add(view.contentView.textFirstName);
	
	
	view.add(Ti.UI.createLabel(CB.Styles[view.name].desc));
	
	view.contentView.pushToHomeBtn = Ti.UI.createButton(CB.Styles[view.name].pushToHomeBtn);
	view.contentView.add(view.contentView.pushToHomeBtn);	

	return view;
})();
