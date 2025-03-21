module.exports = (sequelize, Sequelize) => {
    const designation = sequelize.define(
        'designation',
        {
            designation_id: {
                type: Sequelize.BIGINT,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
            },
            designation: {
                type: Sequelize.STRING(30),
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
    return designation;
}