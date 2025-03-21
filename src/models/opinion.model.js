module.exports = (sequelize, Sequelize) => {
    const opinion = sequelize.define(
        'opinion',
        {
            opinion_id: {
                type: Sequelize.BIGINT,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
            },
            district: {
                type:Sequelize.STRING(30),
                allowNull: false,
                autoIncrement: false
            },
            description: {
                type: Sequelize.STRING(200),
                allowNull: false,
            },
            posted_by:{
                type:Sequelize.INTEGER,
                allowNull: false,
            },
            name:{
                type:Sequelize.STRING(30),
                allowNull: false,
            }
        }
    )
    return opinion;
}