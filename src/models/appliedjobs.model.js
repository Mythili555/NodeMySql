module.exports = (sequelize, Sequelize) => {
    const appliedJob = sequelize.define(
        'appliedjob',
        {
            applied_id: {
                type: Sequelize.BIGINT,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
            },
            job_details_id: {
                type: Sequelize.BIGINT,
                allowNull: false,
                autoIncrement: false
            },
            company_id: {
                type: Sequelize.STRING(20),
                allowNull: false,
            },
            notify_time: {
                type: Sequelize.STRING(20),
                allowNull: false,
            },
            user_id:{
                type:Sequelize.INTEGER,
                allowNull: false,
            },
            active:{
                type:Sequelize.BOOLEAN,
                defaultValue:true,
                allowNull: false,
            },
            applied:{
                type:Sequelize.BOOLEAN,
                defaultValue:true,
                allowNull: false,
            },
        }
    )
    return appliedJob;
}