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

	this.view.backBtn.addEventListener('click', function() {			
			CB.popController();
	});
	
	var tableData = [];
	for (var i = 0; i <= 20; i++) {
		var row = Ti.UI.createTableViewRow({
			//objName : 'row',
			//touchEnabled : true,
			height : '15%',
			title:'Testing row ' + i
		});
		
		//row.add(Ti.UI.createLabel(CB.Styles[this.view.name].rowText));
		tableData.push(row);
	}

	this.view.table.setData(tableData);
};



__exports.viewWillAppear = function(e) {
	if(e != undefined){		
		//add a refresh button for testing layout
		CB.Debug.addRefreshBtn(CB, e.view);
		CB.Common.setCurrMenu(e.view, CB.Styles.menuSelectedTop.setting);
		CB.Common.closeMenu(e.view);
	}
}; 