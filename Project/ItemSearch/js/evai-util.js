var EVAIUtil = function() {
	return {
		getToken: function(name) {
			if (name == null) {
				name = "iPlanetDirectoryPro";
			}
			var reg = new RegExp(name + "=([^;]+)");
			var value = reg.exec(document.cookie);
			if (value != null) {
				var rawToken = value[1];
				var unescapeToken = unescape(value[1]);
				var aaaToken = btoa(unescape(value[1]));
			}
			return aaaToken;
    },

		getUrlParams: function(url) {
			var urlQuery = url.search.substr(1); //?product=xxx
			if (urlQuery != '') {
				var paraJson = {}, paraArray = urlQuery.split('&');
				for (var i = 0, length = paraArray.length; i < length; i++) {
					var para = paraArray[i];
					var paraObject = para.split('=');
					paraJson[paraObject[0]] = paraObject[1];
				}
			}
			return paraJson;
		},

		getPrivilege: function(callback) {
			EVAIUtil.sendAjaxRequest('get', 'getPrivilege', {token: EVAIUtil.getToken()}, function(data){
				callback(JSON.parse(data).list);
			});
		},

		addAudit: function(productName, action, modulename, details, result, callback) {
			var params = {
				productName: productName,
				audit: JSON.stringify({
					action: action,
					details: details,
					modulename: modulename,
					result: result,
					target: 'eikonapp'
				}),
				token: EVAIUtil.getToken()
			}
			EVAIUtil.sendAjaxRequest('post', 'insertAudit', params, function(data, status){
				data = JSON.parse(data.body);
				callback();
			});
		},

    formatFileSize: function(fileSize) {
			var result;
	        if (fileSize < 1024) {
	            result = fileSize + " Bytes";
	        } else if (fileSize < 1048576) {
	            result = Math.floor(fileSize / 1024) + " KB";
	        } else if (fileSize < 1073741824) {
	            result = Math.floor(fileSize / 1048576) + " MB";
	        } else {
	            result = Math.floor(fileSize / 1073741824) + " GB";
	        }
	        return result;
		},

		cgridDateFilter: function() {
			var dateFilter = {
			  attach: function(cell, filterBy, grid) {
			    var selector = $('<span style="display: inline-block; min-width: 250px;"><input type="text" class="cgrid-begin" style="width: 100px">To<input type="text" class="cgrid-end" style="width: 100px"></span>');
			    cell.setContent(selector[0]);
			    $(".cgrid-begin,.cgrid-end").datepicker({
					dateFormat: "yy-mm-dd",
					firstDay: 0,
					changeMonth: true,
					changeYear: true
				});
			    selector.change(function() {
			      //Getting selected value and create filter expression
			      var selectedItem = $(selector).find(":selected");
			      var filterId = $(this).data("filterId");
			      var filterExpression = "$" + filterBy + "=" + (selectedItem.val() == "true");

			      //Adding a filter method returns a filter ID so you can use it to modify the filter later
			      //This is mandatory action to modify the filter because the filtering in multiple columns
			      //are combinded together (AND logic) and we don't want to reset all filter of the table when
			      //the filtered value of a column is changed. We modify the filter instead.
			      if (filterId === null || filterId === undefined) {
			        var newFilterId = grid.addFilter(filterExpression);
			        $(this).data("filterId", newFilterId);
			      } else {
			        grid.modifyFilter(parseInt(filterId), filterExpression);
			      }
			    });
			  }
			}
			return dateFilter;
		},

		cgridActionFormatter: function(actions) {
			var actionFormatter = {
        bind: function (rowIndex, columnIndex, value, cell, columnDef, dataRow, dataTable) {
					var actionTexts = Object.keys(actions);
					var span = $('<span>');
					var linkObject, link;
					for (var i = 0; i < actionTexts.length; i++) {
						actionName = actionTexts[i];
						actionObject = actions[actionName];
						link = $('<a class="grid-action-btn" href="javascript:void(0);" title="' + actionName + '"><span class="' + actionObject.icon + '"></span></a>');
						link.on('click', function() {
							var target = $(this).attr('title');
							var currentAction = actions[target];
							currentAction.callback(rowIndex, columnIndex, value, cell, columnDef, dataRow, dataTable);
						});
						span.append(link);
					}
					cell.setContent(span[0]);
					cell.control = span[0];
          var control = cell.control;
        }
			}
			return actionFormatter;
		},
		cgridActionConditionFormatter: function(key, mapping) {
			//mapping
			var actionConditionFormatter = {
        bind: function (rowIndex, columnIndex, value, cell, columnDef, dataRow, dataTable) {
					var actions = null;
					var value = dataRow[key];
					if (mapping[value]) {
						actions = mapping[value];
					}
					else {
						return null;
					}
					var actionTexts = Object.keys(actions);
					var span = $('<span>');
					var linkObject, link;
					for(var i = 0; i < actionTexts.length; i++) {
						actionName = actionTexts[i];
						actionObject = actions[actionName];
						link = $('<a class="grid-action-btn" href="javascript:void(0);" title="' + actionName+ '"><span class="' + actionObject.icon + '"></span></a>');
						link.on('click', function(){
							var target = $(this).attr('title');
							var currentAction = actions[target];
							currentAction.callback(rowIndex, columnIndex, value, cell, columnDef, dataRow, dataTable);
						});
						span.append(link);
					}
					cell.setContent(span[0]);
					cell.control = span[0];
          var control = cell.control;
        }
			}
			return actionConditionFormatter;
		},
		cgridAjaxPagination: function(grid, pageState, ajaxCallback) {
			grid.showLoadingMask("full");

			grid.listen("ajaxStartLoading", function (e) {
				grid.showLoadingMask("full");
			});

			grid.listen("ajaxEndLoading", function (e) {
				grid.setPagingState(pageState.pageNum, pageState.totalRecords);
				grid.hideLoadingMask();
			});

			grid.listen("pageChanged", function (e) {
				var sortingStates = grid.getSortingStates();
				var sortingCol = "", sortingDir = "";
				sortingCol = sortingStates[0].colId;
				sortingDir = (sortingStates[0].order === "a") ? "asc" : "desc";
				pageState.pageNum = e.toPage;
				console.log("Page " + sortingStates[0].colId + " is sorted " + ((sortingStates[0].order === "a") ? "ascending" : "decending") + "\n");

				//At this point, you maybe use fetchAJAXData to fetch sorted data from the server.
				grid.fetchAJAXData({
				    dataPath: "",
				    settings: {
				        method: "POST",
				        dataType: "json",
				        url: "https://www.zawya.com/es/fetchSearch/fatwa/?includeFields=id%2Cname%2CisActive%2Cportals.platform%2Cdescription%2Ccompanies%2CshariahProvider%2Cscholars%2CshariahBoard%2CassetClasses.name%2CcontractStructures.type%2CproductTypes.type%2CissuingType.issueType%2CfinancialCategory.name%2Ccountries.name%2Cregions.name%2CcreationDate&orderDir=" + sortingDir + "&orderColumn=" + sortingCol + "&perPage=" + pageState.pageSize + "&excelLimit=5000&pageNum=" + pageState.pageNum,
				        dataFilter: function(data, type){
				        	grid._model.dataModel.ajax.settings.dataFilter(data, type);
				        }
				    }
				});
			});
		},

		openApp: function(appName) {
			event.preventDefault();
			var productName = EVAIUtil.getProductID();
			JET.navigate({
	            url: "cpurl://apps.cp./Apps/" + appName + "?product=" + encodeURI(productName),
	            target: 'tab'
	        });
		},
		/*
			@param {string} type : post, get, put, delete
		*/
		sendAjaxRequest: function(type, url, payload, successCallback, errorCallback, scope, timeOut) {
			if (!errorCallback) {
				errorCallback = function( xhr, status, error ) {
			        if(xhr && xhr.responseText && xhr.responseText.length > 0) {
			            console.log(xhr.responseText);
			        } else {
			            console.log(error);
									if (status == 'timeout') {
										EVAIUtil.showAlertDialog('Error: Timeout.<br>url: ' + url + '<br>payload: ' + JSON.stringify(payload) + '<br/>Please Contact <a href="mailto:Jian.Kang@thomsonreuters.com">Jian Kang</a>');
										EVAIUtil.hideLoadingMark();
										return false;
									}
			        }
			    }
			}
			var successCallbackFunction = successCallback;
			if (scope != undefined) {
				successCallbackFunction = function() {
					successCallback.apply(scope, arguments);
				}
			}
			$.ajax({
				type: type,
				url: url,
				data: payload,
				timeout: ((timeOut == undefined) || (timeOut == null))? 20000: timeOut
			})
			.error(errorCallback)
			.success(function(result, status, xhr) {
				if (result.statusCode == 404) {
					EVAIUtil.showAlertDialog('Admin Server Connection Error: 404. Please Contact <a href="mailto:Jian.Kang@thomsonreuters.com">Jian Kang</a>');
					EVAIUtil.hideLoadingMark();
					return false;
				}
				successCallbackFunction(result, status, xhr);
			});
		},

		showAlertDialog: function(info) {
			EVAIUtil.showSimpleDialog("Alert", info);
		},

		showInfomationDialog: function(info) {
			EVAIUtil.showSimpleDialog("Infomation", info);
		},

		showConfirmDialog: function(title, info, callback) {
			if ($('#confirm-dialog').length == 0) {
				var dialogHtml = '<div id="confirm-dialog" style="display:none;"><p class="ec-confirm-dialog-info">' + info + '</p></div>';
				$("body").append(dialogHtml);
			} else {
				$(".ec-confirm-dialog-info").html(info);
			}
			var confirmDialogInstance = $('#confirm-dialog').dialog({
		        width: 400,
		        dialogClass: 'dialog-class',
		        resizable: false,
		        dragable: true,
		        title: title,
		        closeText: "",
		        modal: true,
		        buttons: [{
		            text: 'OK',
		            click: function() {
			            confirmDialogInstance.dialog('close');
			            callback();
			        }
			    }, {
			    	text: 'Cancel',
			    	click: function(){
			    		confirmDialogInstance.dialog('close');
			    	}
			    }],
		        close: function(e) {
		            $(this).dialog('destroy');
		            confirmDialogInstance = null;
		        }
		    });
		},

		showSimpleDialog: function(title, info) {
			if ($('#global-simple-dialog').length == 0) {
				var dialogHtml = '<div id="global-simple-dialog" style="display:none;"><p class="ec-tip-dialog-info">' + info + '</p></div>';
				$("body").append(dialogHtml);
			} else {
				$(".ec-tip-dialog-info").html(info);
			}
			var globalDialogInstance = $('#global-simple-dialog').dialog({
		        width: 400,
		        dialogClass: 'dialog-class',
		        resizable: false,
		        dragable: true,
		        title: title,
		        closeText: "",
		        modal: true,
		        buttons: [{
		            text: 'OK',
		            click: function() {
			            globalDialogInstance.dialog('close');
			        }
			    }],
		        close: function(e) {
		            $(this).dialog('destroy');
		            globalDialogInstance = null;
		        }
		    });
		},

		showLoadingMark: function() {
			if ($(".loading-mark").length == 0) {
				$("body").append('<div class="loading-mark"><div class="loading-mark-inner"><div class="throbber"></div></div></div>');
			}
			$(".loading-mark").show();

		},

		hideLoadingMark: function() {
			$(".loading-mark").hide();
		}
	}
}();
