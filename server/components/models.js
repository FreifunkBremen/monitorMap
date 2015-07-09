var config = require('../config/environment').database,
	Sequelize = require('sequelize'),
	DB = new Sequelize(config.db, config.user, config.password, {
		define: {freezeTableName: true},
		dialect: "mysql",
		port:    config.port,
	}),
	Node = DB.define('node',{
		id:{type:Sequelize.INTEGER,primaryKey: true,autoIncrement: true},
		name:{type: Sequelize.STRING},
		owner:{type: Sequelize.STRING},
		parent_id:{type:Sequelize.INTEGER},
		//parent_id:{type:Sequelize.INTEGER,references:{tableName:'node',key:'id'}},
		mac:{type: Sequelize.STRING, unique: true},
		lat:{type: Sequelize.FLOAT},
		lon:{type: Sequelize.FLOAT},
		channel_24:{type: Sequelize.INTEGER},
		channel_50:{type: Sequelize.INTEGER},
		channel_24_power:{type: Sequelize.INTEGER},
		channel_50_power:{type: Sequelize.INTEGER}
	},{tableName:'node'});

	Node.hasMany(Node,{foreignKey:'parent_id',as:'childrens'});
	Node.belongsTo(Node,{foreignKey:'parent_id',as:'parent'});


	Node_Statistic = DB.define('node_statistic',{
		//node_id:{type:Sequelize.INTEGER,references:{model:Node,key:'id'}},
		datetime:{type: Sequelize.DATE},
		status:{type:Sequelize.BOOLEAN},
		client_24:{type: Sequelize.INTEGER},
		client_50:{type: Sequelize.INTEGER},
		traffic_tx_bytes:{type: Sequelize.INTEGER},
		traffic_tx_packets:{type: Sequelize.INTEGER},
		traffic_rx_bytes:{type: Sequelize.INTEGER},
		traffic_rx_packets:{type: Sequelize.INTEGER},
	},{tableName:'node_statistic'});

	Node.hasMany(Node_Statistic,{foreignKey:'node_id',as:'statistics'});
	Node_Statistic.belongsTo(Node,{foreignKey:'node_id',as:'node'});

	DB.sync({ force: false })
	.then(function(err) {
		if (!!err) {
			console.log('An error occurred while creating the table:', err)
		}else{
			console.log('Success Database connection');
		}
	});

	module.exports = {Node:Node,Node_Statistic:Node_Statistic,_db:DB,_lib:Sequelize};
