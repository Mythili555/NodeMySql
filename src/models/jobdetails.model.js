module.exports = (sequelize, Sequelize) => {
    const jobDetails = sequelize.define(
        'jobdetails',
        {
            job_id: {
                type: Sequelize.BIGINT,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
            },
            company_id: {
                type: Sequelize.BIGINT,
                allowNull: false,
                autoIncrement: false
            },
            job_type: {
                type: Sequelize.STRING(20),
                allowNull: false,
            },
            location: {
                type: Sequelize.STRING(20),
                allowNull: false,
            },
            job_name: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            start_date: {
                type: Sequelize.STRING(20),
                allowNull: false,
            },
            end_date: {
                type: Sequelize.STRING(20),
                allowNull: false,
            },
            address: {
                type: Sequelize.STRING(20),
                allowNull: false,
            },
            qualification: {
                type: Sequelize.STRING(20),
                allowNull: false,
            },
            experience: {
                type: Sequelize.STRING(20),
                allowNull: false,
            },
            martial_status: {
                type: Sequelize.STRING(20),
                allowNull: false,
            },
            job_description: {
                type: Sequelize.STRING(120),
                allowNull: false,
            },
            skills: {
                type: Sequelize.STRING(70),
                allowNull: false,
            },
            job_vacancy_places: {
                type: Sequelize.STRING(30),
                allowNull: false,
            },
            other_details: {
                type: Sequelize.STRING(60),
                allowNull: false,
            },
            phone_number: {
                type: Sequelize.STRING(20),
                allowNull: false,
            },
            scam:{
                type:Sequelize.BOOLEAN,
                allowNull:false,
                defaultValue:false
            },
            start_age: {
                type: Sequelize.STRING(20),
                allowNull: false,
            },
            end_age: {
                type: Sequelize.STRING(20),
                allowNull: false,
            },
            salary: {
                type: Sequelize.STRING(20),
                allowNull: false,
            },
            incentive:{
                type: Sequelize.STRING(50),
                allowNull: false,
            },
            created_by: {
                type: Sequelize.STRING(20),
                allowNull: false,
            },
            district: {
                type: Sequelize.STRING(20),
                allowNull: false,
            },
            town: {
                type: Sequelize.STRING(30),
                allowNull: false,
            },
            job_groups: {
                type: Sequelize.STRING(30),
                allowNull: false,
            },
            well_established: {
                type:Sequelize.BOOLEAN,
                allowNull:false,
                defaultValue:false
            },
            interview_type: {
                type: Sequelize.STRING(10),
                allowNull: false,
            },

        }
    )
    return jobDetails;
}