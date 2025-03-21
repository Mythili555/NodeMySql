const Sequelize = require("sequelize");
const sequelize = require("../config/dbconfig");
const db = {};
db.sequelize = sequelize;
db.Sequelize = Sequelize;
db.user = require("./user.model")(sequelize, Sequelize);
db.token = require("./token.model")(sequelize, Sequelize);
db.userDevice = require("./userDevice.model")(sequelize, Sequelize);
db.userDetails = require("./userDetails.model")(sequelize, Sequelize);
db.district = require("./district.model")(sequelize, Sequelize);
db.jobDetails = require("./jobdetails.model")(sequelize, Sequelize);
db.appliedJobs = require("./appliedjobs.model")(sequelize, Sequelize);
db.favouriteJobs = require("./favouritejobs.model")(sequelize, Sequelize);
db.scamJob = require("./scamjobs.model")(sequelize, Sequelize);
db.designation=require("./designation.model")(sequelize,Sequelize)
db.jobremainder=require("./jobremainder.model")(sequelize,Sequelize)
db.pushNotificationTemplates = require("./pushNotifications.model")(sequelize, Sequelize)

db.appliedJobs.belongsTo(db.jobDetails, {
  foreignKey: {
    name: "job_details_id",
  },
});
db.favouriteJobs.hasOne(db.jobDetails, {
  foreignKey: { name: "job_details_id" },
});
db.scamJob.hasOne(db.jobDetails, { foreignKey: { name: "job_details_id" } });
sequelize.sync({ alter: true });
module.exports = db;
