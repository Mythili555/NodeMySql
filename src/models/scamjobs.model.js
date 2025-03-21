module.exports = (sequelize, Sequelize) => {
    const scamJobs = sequelize.define(
        'scamjob',
        {
            scam_id: {
                type: Sequelize.BIGINT,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
            },
            job_details_id: {
                type: Sequelize.BIGINT,
                allowNull: false,
            },
            company_id: {
                type: Sequelize.STRING(20),
                allowNull: false,
            },
            reported_by:{
                type: Sequelize.BIGINT,
                allowNull: false,
            }
        }
    )
    return scamJobs;
}