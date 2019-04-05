var bcrypt = require('bcrypt-nodejs');
var _ = require('underscore');
var cryptojs = require('crypto-js');
var jwt = require('jsonwebtoken');

module.exports = function (sequelize, DataTypes) {
    var user = sequelize.define('user', {
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true
            }
        },
        salt: {
            type: DataTypes.STRING
        },
        password_hash: {
            type: DataTypes.STRING
        },
        password: {
            type: DataTypes.VIRTUAL,
            allowNull: false,
            validate: {
                len: [7, 100]
            },
            set: function (value) {
                var salt = bcrypt.genSaltSync(10);
                var hashedPassword = bcrypt.hashSync(value, salt);

                this.setDataValue('password', value);
                this.setDataValue('salt', salt);
                this.setDataValue('password_hash', hashedPassword);
            }
        }
    }, {
            hooks: {
                beforeValidate: function (user, options) {
                    if (typeof user.email === 'string') {
                        user.email = user.email.toLowerCase();
                    }
                }
            }
        });

    // (prototype) Instance level methods..
    user.prototype.toPublicJSON = function () {
        var json = this.toJSON();
        return _.pick(json, 'id', 'email', 'createdAt', 'updatedAt');
    }

    user.prototype.generateToken = function () {
        if (!_.isString(type)) {
            return undefined;
        }

        try {
            var stringData = JSON.stringify({ id: this.get('id'), type: type });
            var encryptedData = cryptojs.AES.encrypt(stringData, 'abc123!#1!').toString();
            var token = jwt.sign({
                token: encryptedData
            }, 'qwerty098');

            return token;

        } catch (e) {
            console.log(e);
            return undefined;
        }
    }

    // classLevel methods..
    user.authenticate = function(body) {
        return new Promise(function (resolve, reject) {
            if (typeof body.email !== 'string' || typeof body.password !== 'string') {
                return reject();
            }

            db.user.findOne({
                where: {
                    email: body.email
                }
            }).then(function (user) {
                // compare sync to verify password
                if (!user || !bcrypt.compareSync(body.password, user.get('password_hash'))) {
                    return reject();
                }
                // if successful return user json
                resolve(user);
            }, function (e) {
                reject();
            });
        });
    }

    return user;
}