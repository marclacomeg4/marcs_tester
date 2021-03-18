import _ from 'lodash';

export default {
    data() {
        return {
            rules: {
                required: (v, args = {}) => {
                    if (v) return true;

                    if (!_.isUndefined(args.field)) return args.field + ' is required';

                    return 'Required field'
                },

                number: (v, args = {}) => {
                    let regex =  /^\d+$/;

                    return (regex.test(String(v).toLowerCase()) === true) ? true : 'Must be a number';
                },

                email: (v) => {

                    let regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

                    return (regex.test(String(v).toLowerCase()) === true) ? true : 'Need valid email address';
                },

                length: (v, args) => {

                    if (v.length >= args.min && v.length <= args.max) return true;

                    let result = args.field + ' ' + ' must be between ' + args.min + ' and ' + args.max + ' characters long.';

                    if (!_.isUndefined(args.comment)) result += ' ' + args.comment;

                    return result;
                },

                password: (v, args = {}) => {

                    if (v.length >= 8 && v.length <= 20) return true;

                    return 'Password must be between between 8 and 20 characters long';
                },
            },
        }
    }
}
