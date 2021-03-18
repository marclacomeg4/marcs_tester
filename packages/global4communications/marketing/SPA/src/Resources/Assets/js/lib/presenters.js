module.exports = {
    /**
     * Standard date format for phone monkeys to understand
     * @param date
     * @return {string}
     */
    date(date) {
        if (date.length === 10) return moment(date, 'YYYY-MM-DD').format('DD/MM/YYYY');

        if (date.length === 19) return moment(date, 'YYYY-MM-DD hh:mm:ss').format('DD/MM/YYYY hh:mm:ss');

        if (date.length === 27) return moment(date).format('DD/MM/YYYY hh:mm:ss');

        return 'Invalid Date'
    },

    dateHuman(date) {
        if (date.length === 10) return moment(date, 'YYYY-MM-DD').format('Do MMMM YYYY');

        if (date.length === 19) return moment(date, 'YYYY-MM-DD hh:mm:ss').format('Do MMMM YYYY');

        if (date.length === 27) return moment(date).format('Do MMMM YYYY');

        return 'Invalid Date'
    },

    contractType(contract_type){
        switch (contract_type) {
            case  'broadband_monthly' :
                return 'Monthly Broadband';
            case  'broadband_weekly' :
                return 'Weekly Broadband';
            case  'sim_only' :
                return 'SIM Only';
            case  'sky_tv' :
                return 'Sky TV';
            case  'energy' :
                return 'Energy';
        }
    },

    orderType(order_type){
        switch (order_type) {
            case  'new_order' :
                return 'New Orders';
            case  'home_move' :
                return 'Home Moves';
            case  'account_takeover' :
                return 'Account Take Over';
            case  'renewal' :
                return 'Renewal';
            case  'upgrade' :
                return 'Upgrade';
            case  'package_change' :
                return 'Package Change';
        }
    }
}

