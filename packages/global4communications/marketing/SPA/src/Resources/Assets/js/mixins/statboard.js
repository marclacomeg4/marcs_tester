export const statboard =
    {
        computed: {
            dateRange: {
                get() {
                    return this.$store.getters['date_range/date_range']
                },
                set(new_date_range) {
                    return this.$store.dispatch('date_range/dateRange', new_date_range)
                }
            }
        }
    }
