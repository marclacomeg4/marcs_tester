export const stat_panel =
    {
        watch: {
            user_id:{
                handler(){
                    this.getStatistics()
                },
            },

            affinity_team_id:{
                handler(){
                    this.getStatistics()
                },
            },

            dateRange:{
                handler(){
                    this.getStatistics()
                },
                deep:true
            }
        },

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
