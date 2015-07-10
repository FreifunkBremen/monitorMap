var config = require('../config/environment').database,
	Sequelize = require('sequelize'),
	DB = new Sequelize(config.db, config.user, config.password, {
		define: {freezeTableName: true},
		dialect: "mysql",
		port:    config.port,
		logging: false
	}),
	Node = DB.define('node',{
		id:{type:Sequelize.INTEGER,primaryKey: true,autoIncrement: true},
		name:{type: Sequelize.STRING},
		mon:{type: Sequelize.BOOLEAN,defaultValue:false},
		owner:{type: Sequelize.STRING},
		parent_id:{type:Sequelize.INTEGER},
		//parent_id:{type:Sequelize.INTEGER,references:{tableName:'node',key:'id'}},
		mac:{type: Sequelize.STRING, unique: true},
		lat:{type: Sequelize.FLOAT},
		lon:{type: Sequelize.FLOAT},
		channel_24:{type: Sequelize.INTEGER},
		channel_50:{type: Sequelize.INTEGER},
		channel_24_power:{type: Sequelize.INTEGER},
		channel_50_power:{type: Sequelize.INTEGER},
		datetime:{type: Sequelize.DATE},
		status:{type:Sequelize.BOOLEAN},
		client_24:{type: Sequelize.INTEGER},
		client_50:{type: Sequelize.INTEGER},
		traffic_tx_bytes:{type: Sequelize.INTEGER},
		traffic_tx_packets:{type: Sequelize.INTEGER},
		traffic_rx_bytes:{type: Sequelize.INTEGER},
		traffic_rx_packets:{type: Sequelize.INTEGER},
	},{tableName:'node'});

	Node.hasMany(Node,{foreignKey:'parent_id',as:'childrens'});
	Node.belongsTo(Node,{foreignKey:'parent_id',as:'parent'});

	DB.sync({ force: true });
	/*
	.then(function(err) {
		if (!!err) {
			console.log('An error occurred while creating the table:', err)
		}else{
			console.log('Success Database connection');
		}
	});
*/
	module.exports = {Node:Node,_db:DB,_lib:Sequelize};
