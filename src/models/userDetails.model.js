module.exports = (sequelize, Sequelize) => {
  const userDetails = sequelize.define("userdetails", {
    userdetails_id: {
      type: Sequelize.BIGINT,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: Sequelize.BIGINT,
      allowNull: false,
      autoIncrement: false,
    },
    district: {
      type: Sequelize.STRING(20),
      allowNull: false,
    },
    city: {
      type: Sequelize.STRING(20),
      allowNull: false,
    },
    gender: {
      type: Sequelize.STRING(20),
      allowNull: false,
    },
    dob: {
      type: Sequelize.STRING(20),
      allowNull: false,
    },
    education: {
      type: Sequelize.STRING(20),
      allowNull: false,
    },
    qualification: {
      type: Sequelize.STRING(20),
      allowNull: false,
    },
    jobtype: {
      type: Sequelize.STRING(20),
      allowNull: false,
    },
    selected_district: {
      type: Sequelize.JSON,
      allowNull: false,
    },
    designation: {
      type: Sequelize.JSON,
      allowNull: false,
    },
  });
  return userDetails;
};
