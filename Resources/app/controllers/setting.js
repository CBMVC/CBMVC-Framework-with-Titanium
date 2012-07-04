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

	this.view.insertBtn.addEventListener('click', function() {
		//truncate the table at first
		CB.Models.human.truncate();

		//batch add records
		var data = [{
			city_id : '1',
			first_name : 'testing',
			last_name : 'blog'
		}, {
			city_id : '2',
			first_name : 'coder',
			last_name : 'blog'
		}, {
			city_id : '3',
			first_name : 'roger',
			last_name : 'win'
		}, {
			city_id : '4',
			first_name : 'abc',
			last_name : 'bbb'
		}, {
			city_id : '5',
			first_name : 'ddd',
			last_name : 'ccc'
		}];
		CB.DB.each(data, function(properties, key) {
			CB.Models.human.newRecord(properties).save();
		});

		e.showRecords();

	});

	this.view.editBtn.addEventListener('click', function() {
		if (e.view.textCityId.value != '' && e.view.textFirstName.value != '') {

			var result = new CB.DB.query().update('human').set({
				first_name : e.view.textFirstName.value
			}).where(' city_id = ?', e.view.textCityId.value).execute();

		}

		e.showRecords();
	});

	this.view.delBtn.addEventListener('click', function() {
		if (e.view.textCityId.value != '') {
			var q = new CB.DB.query().destroy().from('human').
			where(' city_id = ?', e.view.textCityId.value).execute();
		}
		e.showRecords();
	});

	this.view.queryBtn.addEventListener('click', function() {
		if (e.view.textFirstName.value != '') {
			var mp = CB.Models.human.getByFirstName(e.view.textFirstName.value);
			CB.Debug.dump(mp, 80, 'setting.js');
		}
	});

	/*
	 var tableData = [];
	 for (var i = 0; i <= 20; i++) {
	 var row = Ti.UI.createTableViewRow({
	 //objName : 'row',
	 //touchEnabled : true,
	 height : '35dp',
	 title:'Testing row ' + i
	 });

	 //row.add(Ti.UI.createLabel(CB.Styles[this.view.name].rowText));
	 tableData.push(row);
	 }

	 this.view.table.setData(tableData);
	 CB.Debug.dump(this.view.table.data,38);
	 */
};

__exports.viewWillAppear = function(e) {
	if (e != undefined) {
		//add a refresh button for testing layout
		CB.Debug.addRefreshBtn(CB, e.view);
		CB.Common.setCurrMenu(e.view, CB.Styles.menuSelectedTop.setting);
		CB.Common.closeMenu(e.view);
	}
};

__exports.showRecords = function() {
	//show the table list, just for debug:
	var result = CB.Models.human.all();
	for (var rs in result) {
		CB.Debug.echo('city_id: ' + result[rs].city_id + 
		'   first_name:' + result[rs].first_name + 
		'   last_name:' + result[rs].last_name, 116, 'setting.js');
	}

	var q = new CB.DB.query().count().from('human').execute();
	CB.Debug.dump(q, 122, 'setting.js');
}
