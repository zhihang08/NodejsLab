AlternativeSettings = {
  TitleName: "",
  Types: [], //Item, Tolerance, Template, Examine
  Route: "", //ID name
  ShowMultipleEngines: true, //true, false
  CallbackForChoosenResult: null,
  CallbackForRenderComplete: null,
  InternalAlert: true,
  StatusPanel: true
}
ItemSearchErrorHandler = function(result, detail) {
  //Pop up alert window
  //Update status panel
}
const defaultSetting= {
  Types: ["Item"]
}

$.fn.ItemSearch = function(prodcutInfo, inputSettings){
  return this.each(()=>{
    //Render Structure
    var settings = inputSettings || defaultSetting;
    if (settings.Types.length > 1) {
      ItemStructure.renderSearchTab(this, settings.Types);
      settings.Types.forEach((_type)=>{
        ItemStructure.renderSearchStructure(this, _type);
      });
      ItemSearch.tolTabs = $(this).tabs({
        hide:{effect: "slide", direction:"right"},
        show:{effect: "slide", direction:"right"}
      });
    }
    else{
      ItemStructure.renderSearchStructure(this, settings.Types[0]);
    }
    ItemStructure.renderStatusStructure(this);
    ItemStructure.renderResultStructure(this);

    ItemSearch.init(prodcutInfo);

    //Binding Search
    $(this).find("[class*=-btn]").each((index, $elem)=>{
      var currentType = $($elem).attr('class').split('-')[0];
      $($elem).click(()=>{
        ItemSearch.searchSync($($elem).parent()
          .find("input[type=search]").val(), "VAA", (table)=>{
            ItemSearch[currentType +"-table"] = table;
          });
      })
    });
  })
}

var ItemSearch = function(){
  return {
    tolTabs: null,
    mainID: null,
    setting: null,
    productInfo: null,
    resultData: null,
    defaultSetting: {
      types: null,
      name: "Item search"
    },
    init: function(productInfo, setting){
      ItemSearch.productInfo = productInfo;
      if (!setting) {
        ItemSearch.setting = ItemSearch.defaultSetting;
      }
      else {
        ItemSearch.setting = setting;
      }
      var tag = false;
      //Promt
      $(".ico-prompt").click(function(){
        if(tag){
          $(".prompt").hide("fade", { direction: "bottom" }, 400);
        }
        else{
          $(".prompt").show("fade", { direction: "bottom" }, 400).css('display', 'block');
        }
        $( ".ico-prompt" ).toggleClass( "icon-fx-tick" );
        $( ".ico-prompt" ).toggleClass( "icon-info-2" );
        tag = !tag;
      });
      $(".closePrompt").click(function(){
        $(".prompt").hide("fade", { direction: "bottom" }, 400);
        $( ".ico-prompt" ).toggleClass( "icon-fx-tick" );
        $( ".ico-prompt" ).toggleClass( "icon-info-2" );
        tag = !tag;
      });

      //Tolerance Search
      $("#tol-btn").click(function(){
				ItemSearch.searchSync($("#tol-name").val(), "VAA", function(table){
          main.manageGrid = table;
        });
        $("#tmp-name").val("");
			});

      // ItemSearch.autocomplete();
      $("#itemMultiselect").change(function(){
         $(".slideBtn").text($("#itemMultiselect").val() + " Search");
      });
    },
    export:function(){
      if(!ItemSearch.resultData) return;
      var csvFile = ItemSearch.toCSV(ItemSearch.resultData);
      main.Export(csvFile, "ItemSearch.csv", "text/csv");
    },
    toCSV:function(array) {
      return array
          .map(function(row) {
              return row
                  .map(function(cell) {
                      if (cell.replace(/ /g, '').match(/[\s,"]/)) {
                          return '"' + cell.replace(/"/g, '""') + '"';
                      }
                      return cell;
                  })
                  .join(',');
          })
          .join('\n');
    },
    searchSync: function(item, type, callback){
      ItemSearch.resultData = null;
      if (item == "") {
        EVAIUtil.showAlertDialog("Can not find with empty item name!");
        return;
      }
      if (item == "*") {
        EVAIUtil.showAlertDialog("Didn`t support wild case search!");
        return;
      }
      if (!type) {
        type = "Item";
      }
      EVAIUtil.showLoadingMark();

      $.post('ItemSearch',
          {
            "productName": ItemSearch.productInfo.name,
            "lnode": ItemSearch.productInfo.logical_nodes,
            "itemData": item,
            "token": EVAIUtil.getToken()
          }, function(res){
          var result = JSON.parse(res.body).data;
          if (result != null && result != undefined) {
            ItemSearch.resultData = ItemSearch.mergeArryData(ItemSearch.convertArryData(result, '|'), type);
            var table = ItemSearch.renderTable("search-result", ItemSearch.resultData, type);
            if (callback) {
              callback(table);
            }
          }
          else {
            var table = ItemSearch.renderTable("search-result", "", type);
            if (callback) {
              callback(table);
            }
          }
          EVAIUtil.hideLoadingMark();
        });
    },
    convertArryData: function(data, spliter) {
      var result = [];
      var temp1 = data.split('\n');
      for (var i = 0; i < temp1.length; i++) {
        var temp = [];
        temp1[i].split(spliter).forEach(function(e){
          temp.push(e);
        });
        if (temp != "") {
          result.push(temp);
        }
      }
      return result;
    },
    renderTable: function(id, searchData, type){
      if(!searchData){
        return null;
      }
      var $resultPanel = $("#" + id);
      var $successInfo = $("<span>Result:</span>");
      $resultPanel.empty();
      var $export = $("<input id='tol-export' type='button' value='Export'></input>");
      $resultPanel.append($successInfo).append($export);
      $("#tol-export").click(()=>{
        ItemSearch.export();
      });
      var editActions = {"View": {icon: 'icon-dsc-monitor', callback: function(rowIndex, columnIndex, value, cell, columnDef, dataRow, dataTable){
  						main.showEditor(dataRow.RICname, dataRow.partition, "view", dataRow.tag);
  				}},"Edit": {icon: 'icon-edit', callback: function(rowIndex, columnIndex, value, cell, columnDef, dataRow, dataTable){
  						main.showEditor(dataRow.RICname, dataRow.partition, "edit", dataRow.tag);
  				}},"Exam": {icon: 'icon-switch-normal', callback: function(rowIndex, columnIndex, value, cell, columnDef, dataRow, dataTable){
  						main.showExam(dataRow.RICname, dataRow.partition, dataRow.tag);
  		    }},"Audit": {icon: 'icon-access', callback: function(rowIndex, columnIndex, value, cell, columnDef, dataRow, dataTable){
  						main.showAudit(dataRow.RICname, dataRow.partition, dataRow.tag);
  		    }}
  		  };
      var viewActions = {
            "Navigate to Template": {icon: 'icon-extend-heatmap-section', callback: function(rowIndex, columnIndex, value, cell, columnDef, dataRow, dataTable){
    						main.sourceTemplate(dataRow.RICname, dataRow.partition, "source", dataRow.tag);
            }},
            "Exam": {icon: 'icon-switch-normal', callback: function(rowIndex, columnIndex, value, cell, columnDef, dataRow, dataTable){
    						main.showExam(dataRow.RICname, dataRow.partition, dataRow.tag);
    		    }},
            "Create": {icon: 'icon-add', callback: function(rowIndex, columnIndex, value, cell, columnDef, dataRow, dataTable){
      					 main.showEditor(dataRow.RICname, dataRow.partition, "create", dataRow.tag);
      			}},"Audit": {icon: 'icon-access', callback: function(rowIndex, columnIndex, value, cell, columnDef, dataRow, dataTable){
    						main.showAudit(dataRow.RICname, dataRow.partition, dataRow.tag);
    		    }}
      };
      var editTemplateActions = {"View": {icon: 'icon-dsc-monitor', callback: function(rowIndex, columnIndex, value, cell, columnDef, dataRow, dataTable){
  						main.showEditor(dataRow.RICname, dataRow.partition, "view", dataRow.tag);
  				}},"Edit": {icon: 'icon-edit', callback: function(rowIndex, columnIndex, value, cell, columnDef, dataRow, dataTable){
  						main.showEditor(dataRow.RICname, dataRow.partition, "edit", dataRow.tag);
  				}},
          "Item List": {icon: 'icon-snippets', callback: function(rowIndex, columnIndex, value, cell, columnDef, dataRow, dataTable){
               main.showTemplateBind(dataRow.RICname, dataRow.partition, "create", dataRow.tag);
          }},"Audit": {icon: 'icon-access', callback: function(rowIndex, columnIndex, value, cell, columnDef, dataRow, dataTable){
  						main.showAudit(dataRow.RICname, dataRow.partition, dataRow.tag);
  		    }}
  		  };
      var creartActions = {"Create": {icon: 'icon-add', callback: function(rowIndex, columnIndex, value, cell, columnDef, dataRow, dataTable){
					 main.showEditor(dataRow.RICname, dataRow.partition, "create", dataRow.tag);
			 	  }},"Audit": {icon: 'icon-access', callback: function(rowIndex, columnIndex, value, cell, columnDef, dataRow, dataTable){
  						main.showAudit(dataRow.RICname, dataRow.partition, dataRow.tag);
  		    }}
			  };
      var DateTimeFormatter = {
        transform: function(value, dataRow){
          var timeArray = value.slice(0, 19).split(',');
          return timeArray[0] + " " +  timeArray[1];
        }
      }
      var DomainDataFormatter = {
    			 transform: function(value, dataRow){
    				 return  Object.keys(DomianMapping).find(k => DomianMapping[k] === parseInt(value));
    			 }
    		 };
  		var ServiceTypeDataFormatter = {
			   transform: function(value, dataRow){
			       return Object.keys(SerivceIDMapping).find(k => SerivceIDMapping[k] === parseInt(value));
  				}
  			};
			var TagDataFormatter = {
  			 transform: function(value, dataRow){
  				 return Object.keys(TagMapping).find(k => TagMapping[k] == value);
         },
			 };
			var LocationDataFormatter = {
        bind: function(rowIndex, columnIndex, value, cell, columnDef, dataRow, dataTable) {
          var itemLocation = ItemSearch.productInfo.logical_nodes.name + " > "
          + ItemSearch.productInfo.logical_nodes.engines[0].name + " > " + value;
          cell.setContent(itemLocation);
        }
	    };
      var AdditionalDataFormatter = {
        bind: function(rowIndex, columnIndex, value, cell, columnDef, dataRow, dataTable) {
          var additionalInfo = "";
          value.split(',').forEach(function(e) {
            var data = e.split("=");
            switch (data[0]) {
              case "Template":
                additionalInfo += data[1];
                break;
              case "Version":
                additionalInfo += data[1];
                break;
              default:
                break;
            }
          });
          cell.setContent(additionalInfo);
        }
      };
			var options = {
					paging: {
				    page: 1,
				    pageSize: 10
				  },
				  rowHighlight: true,
				  rowSelection: true,
					filterRow: true,
					columns: [
				    {id: "c0", title: "Name", field: "RICname", sortBy: "RICname", filterBy: "RICname",
     					filter: new tr.cgrid.filter.TextBox("Search Name", tr.cgrid.filter.CONTAINS, false)},
						// {id: "c2", title: "ServiceType", field: "serviceid", sortBy: "serviceid", filterBy: "serviceid", formatter: ServiceTypeDataFormatter},
            {id: "c2", title: "Last Active Time", field: "datetime", sortBy: "datetime", filterBy: "datetime",
            filter: new tr.cgrid.filter.TextBox("Search Time", tr.cgrid.filter.CONTAINS, false),
            formatter: DateTimeFormatter},
						{id: "c6", title: "Location", field: "partition", sortBy: "partition", filterBy: "partition",
            filter: new tr.cgrid.filter.TextBox("Search Location", tr.cgrid.filter.CONTAINS, false),
            formatter: LocationDataFormatter}
				  ],
				  dataModel: {
				    fields: ['datetime','operation','RICname', 'partition', 'tag', 'domain', 'opaque', 'serviceid', 'additional_data', 'mode', 'data_state'],
				    format: "array",
				    data: searchData
				  }
				};
      var grid = new tr.CompositeGrid($("#" + id)[0], options);
      if (type == "Template") {
        grid.setColumnVisible(1, false);
        grid.setColumnVisible(5, false);
      }
			return grid;
    },
    mergeArryData: function(array, option){
      var tolArray = [];
      var tolName = [];
      var ddnArray = [];
      var tmpArray = [];
      switch (option) {
        case "Template":
          array.forEach(function(ele){
            if (ele[4] == "TTP") {
              tolArray.push(ele);
            }
          });
          break;
        case "VAA":
          array.forEach(function(ele){
            if (ele[4] == "VAA") {
              tolArray.push(ele);
            }
          });
          break;
        case "Item":
          //Merge DDN(ITEM) with TOL(TOLERANCE)
          array.forEach(function(ele){
            if (ele[4] == "DDN") {
              ddnArray.push(ele);
            }
            if (ele[4] == "TTI") {
              ddnArray.push(ele);
            }
            if (ele[4] == "TOL") {
              tolArray.push(ele);
              tolName.push(ele[2]);
            }
          });
          ddnArray.forEach(function(ele){
            if (tolName.indexOf(ele[2]) == -1) {
              tolArray.push(ele);
            }
          });
          break;
        case "All":
          //Merge DDN(ITEM) with TOL(TOLERANCE)
          array.forEach(function(ele){
            if (ele[4] == "DDN") {
              ddnArray.push(ele);
            }
            if (ele[4] == "TTI") {
              ddnArray.push(ele);
            }
            if (ele[4] == "TOL") {
              tolArray.push(ele);
              tolName.push(ele[2]);
            }
            if (ele[4] == "TTP") {
              tolArray.push(ele);
            }
          });
          ddnArray.forEach(function(ele){
            if (tolName.indexOf(ele[2]) == -1) {
              tolArray.push(ele);
            }
          });
          break;
        default:
          break;
      }
      return tolArray;
    },
    autocomplete: function() {
      var availableItem = [
        "EUR=",
        "JPY=",
        "AUD=",
        "zhihang_*",
        "DemoItem*"
      ];
      $("#tol-name").autocomplete({source: availableItem});
      // $("#tmp-name").autocomplete({source: availableItem});
    },
  }
}();

var ItemStructure = function(){
  return{
    renderSearchTab: function($searchDiv, searchTypes){
      var $tabPanel = $("<ul></ul>");
      searchTypes.forEach((ele)=>{
        $tabPanel.append("<li><a href='#" + ele + "-search'>" + ele + " Search</a></li>")
      });
      var $infoPanel = $("<span class='ico-prompt icon-info-2'></span>");
      $searchDiv.append($tabPanel);
    },
    renderSearchStructure: function($searchDiv, searchType){
      var $inputPanel = $("<span>" + searchType + "Name: </span> <input type='search' name='" + searchType + "-input' placeholder='EUR=' value='D*' autocomplete='on'>");
      var $buttonPanel = $("<input class='" + searchType + "-btn'  type='button' name='button' value='Search'></input>");
      var $containnerPanel = $("<div id='" + searchType + "-search' class='examineParameter'></div>");
      $containnerPanel.append($inputPanel).append($buttonPanel);

      var $prompt = $("<div class='prompt hidden'></div>");
      var $closePrompt = $("<span class='closePrompt icon-cross'><span>");
      var $supportPromt = $("<span>Support:</span><p> . # _ - = | [] {} <> ? !</p><p class='warn'>e.g. EUR= (Case is sensitive)</p>");
      var $startPrompt = $("<span>Special:</span><p> <span>*</span> means zero or more characters will match. </p><p class='warn'>e.g. EUR* (Doesn`t support single *) </p>");
      var $percentagePrompt = $("<span>Special:</span><p><span>%</span> means exact one character will match. </p><p class='warn'>e.g. E%R=</p>");
      var $additionPromt = $("<span>Special:</span><p> <span>\'</span>  If there is \' within pattern, please use / \' within it. </p><p class='warn'>e.g. 'E%\\'R='</p>")
      $prompt.append($closePrompt).append($supportPromt).append($startPrompt).append($percentagePrompt).append($additionPromt);
      
      // ItemSearch.tolTabs = $('#searchPanel').tabs({hide:{effect: "slide", direction:"right"}, show:{effect: "slide", direction:"right"}});
      $searchDiv.append($containnerPanel);
      // $('#searchPanel').append($tmpPanel);
      // setTimeout(function(){$('#searchPanel').tabs('refresh')},200);
      // $('#searchPanel>ul').append($infoPanel);
      // $('#searchPanel').append($prompt);
    },
    renderStatusStructure: function($searchDiv){
      $searchDiv.append($("<div class='searchStatus hidden'><span>Status:<span><div class='statusDetail'></div></div>"));
    },
    renderResultStructure: function($searchDiv){
      $searchDiv.append($("<div class='searchResult hidden'><span>Result:<span><div class='resultPanel'></div></div>"));
    },
    renderResultTable: function(){

    }
  }
}();

Array.prototype.remove = function(tag, value) {
    var a = value, L = this.length, ax;
    while (L) {
        if((ax = tag.indexOf(a)) !== -1) {
            this.splice([L-1], 1);
            break;
        }
        L--;
    }
    return this;
};
