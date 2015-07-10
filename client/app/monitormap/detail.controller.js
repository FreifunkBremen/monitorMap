'use strict';

angular.module('monitormapApp')
	.controller('DetailMonitormapCtrl',function ($scope,$stateParams,nodes) {
		$scope.$on('factory:nodes:list:change',function(event,newValue){
			$scope.obj = nodes.list[$stateParams.id]
			$scope.node_id = $scope.obj.mac.split(':').join('');
		});

		nodes.detail($stateParams.id,function(){
			$scope.obj = nodes.list[$stateParams.id]
			$scope.node_id = $scope.obj.mac.split(':').join('');
			var rrd_data = undefined;
			try {
					FetchBinaryURLAsync("/data/"+$scope.node_id+".rrd", rrd_handler);
			} catch (err) {
					//alert("Failed loading rrd\n" + err);
			}
	    function rrd_handler(bf) {
	        var i_rrd_data = undefined;
	        try {
	            var i_rrd_data = new RRDFile(bf);
	        } catch (err) {
	            //alert("File is not a valid RRD archive!");
	        }
	        if (i_rrd_data != undefined) {
	            rrd_data = i_rrd_data;
	            render_graph()
	        }
	    }
	    function render_graph() {
	        var f = new rrdFlot("clientGraph", rrd_data, {
	            // graph_options
	            legend: { noColumns: 6 },
							lines: { show:true },
	            //yaxes:  [ {}, { show: true, min: 0.1, max: 0.15 } ],
							yaxis: { autoscaleMargin: 0.20},
							tooltip: true,
							tooltipOpts: { content: "<h4>%s</h4> Value: %y.3 - %x" },
	        }, {
	            // ds_graph_options
	            'load': {
	                label: 'Load',
	                color: "#00ff00"
	            },
	            'clients50': {
	                label: 'Clients 5.0 Ghz',
	                color: "#0000ff"
	            },
	            'clients24': {
	                label: 'Clients 2.4 Ghz',
	                color: "#ff0000"
	            },
	            'upstate': {
	                label: 'Uptime',
	                color: "#ffcccc",
	                yaxis: 2,
	                lines: { fill: true }
	            }
	        }, {
	            // rrdflot_defaults
	            num_cb_rows: 9,
	            use_element_buttons: true,
	            multi_ds: false,
	            multi_rra: true,
	            use_rra: false,
	            rra: 0,
	            use_checked_DSs: true,
	            checked_DSs: ["load", "clients50", "clients24", "upstate"],
	            use_windows: true,
	            window_min: 1436400000,
	            window_max: 1437350400,
	            graph_width: "700px",
	            graph_height: "300px",
	            scale_width: "350px",
	            scale_height: "200px",
	            timezone: "+2"
	        });
	        $("#clientGraph_time_sel").val("+2");
	        f.callback_timezone_changed();
	        f.scale.clearSelection();
				}
		});
	});
