module.exports = (sequelize, Sequelize) => {
  const favouriteJobs = sequelize.define("favouritejob", {
    favourite_id: {
      type: Sequelize.BIGINT,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    job_details_id: {
      type: Sequelize.BIGINT,
      allowNull: false,
      autoIncrement: false,
    },
    company_id: {
      type: Sequelize.STRING(20),
      allowNull: false,
    },
    liked_by: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
  });
  return favouriteJobs;
};
