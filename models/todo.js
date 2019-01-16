module.exports = function (sequelize, DataTypes) {
    return sequelize.define('todo', { // ID is created automatically, PRIMARY_KEY(?)
        description: {
            type: DataTypes.STRING, // has to be a string..
            allowNull: false, // must exist, every todo must have description..
            validate: {
                len: [1, 250] // description is only valid if 1 < length < 250 characters..
            }
        },
        completed: {
            type: DataTypes.BOOLEAN, // has to be a boolean (T/F)
            allowNull: false, // cannot be null, must exist..
            defaultValue: false // default value is TRUE
        }
    });

};