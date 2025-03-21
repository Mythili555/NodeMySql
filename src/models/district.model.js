module.exports = (sequelize, Sequelize) => {
    const district = sequelize.define(
        'district',
        {
            district_id: {
                type: Sequelize.BIGINT,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
            },
            district: {
                type: Sequelize.STRING(20),
                allowNull: false,
            },
            nearest_district: {
                type: Sequelize.JSON,
                allowNull: false,
            },
            sort_district:{
                type: Sequelize.STRING(10),
                allowNull: false,
            },
            createdAt: {
                type: "DateTime",
                field: "created_at",
                allowNull: true,
              },
              updatedAt: {
                type: "DateTime",
                field: "updated_at",
                allowNull: true,
              },
        }
    )
    return district;
}