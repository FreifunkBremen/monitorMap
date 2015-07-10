'use strict';

angular.module('monitormapApp')
	.controller('GlobalMonitormapCtrl',function ($scope,socket) {
		$scope.g = {nodes:0,clients:0,clients24:0,clients50:0,rx_bytes:0,rx_packets:0,tx_bytes:0,tx_packets:0,mem_total:0};
		socket.forward('monitormap:global', $scope);
    $scope.$on('monitormap:global', function (ev, data) {
      $scope.g = data;
    });

		var load = function(){
		var rrd_data = undefined;
    try {
        FetchBinaryURLAsync("/data/global.rrd", rrd_handler);
    } catch (err) {
        alert("Failed loading rrd\n" + err);
    }
    function rrd_handler(bf) {
        var i_rrd_data = undefined;
        try {
            var i_rrd_data = new RRDFile(bf);
        } catch (err) {
            alert("File is not a valid RRD archive!");
        }
        if (i_rrd_data != undefined) {
            rrd_data = i_rrd_data;
            render_graph()
        }
    }
    function render_graph() {
        var f = new rrdFlot("graph", rrd_data, {
            // graph_options
            legend: { noColumns: 6 },
						lines: { show:true },
            //yaxes:  [ {}, { show: true, min: 0.1, max: 0.15 } ],
						yaxis: { autoscaleMargin: 0.20},
						tooltip: true,
						tooltipOpts: { content: "<h4>%s</h4> Value: %y.3 - %x" },
        }, {
            // ds_graph_options
            'nodes': {
                label: 'Nodes',
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
            'clients': {
                label: 'All Clients',
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
            checked_DSs: ["nodes", "clients50", "clients24", "clients"],
            use_windows: true,
            window_min: 1436400000,
            window_max: 1437350400,
            graph_width: "700px",
            graph_height: "300px",
            scale_width: "350px",
            scale_height: "200px",
            timezone: "+2"
        });
        $("#graph_time_sel").val("+2");
        f.callback_timezone_changed();
        f.scale.clearSelection();
			}
		};
		load();
	});
