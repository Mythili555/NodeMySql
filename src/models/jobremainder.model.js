module.exports = (sequelize, Sequelize) => {
    const jobRemainder = sequelize.define(
        'jobremainder',
        {
            job_remainder_id: {
                type: Sequelize.BIGINT,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
            },
          
            job_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            remainded_by:{
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            notify_time: {
                type: 'DateTime',
                allowNull: false,
            }

        }
    )
    return jobRemainder;
}