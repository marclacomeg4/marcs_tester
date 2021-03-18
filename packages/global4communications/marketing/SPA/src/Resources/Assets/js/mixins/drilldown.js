/**
 * This mix adds general functions to drilldown dialogs
 * @type {{computed: {displayColumns(): *[]}, watch: {deep: boolean, options: {handler(): void}}, methods: {convertToCSV(*=): string, downloadData(): void, downloadCSV(): void, getHeaders(): {}, retrieveData(*=, *=): void, getDrilldownData(): void, prepareDrilldown(*): void}, created(): void}}
 */

export const drilldown =
    {
        data() {
            return {
                loading: false,
                downloading: false,
                query: {},
                options: {
                    itemsPerPage: 5,
                    page: 1
                },
                server_total_rows: 0,
                rows: [],
                responseData:[],
                download_rows: [],
            }
        },

        methods: {
            disablePaging(){
                this.options.itemsPerPage = -1;
            },
            /**
             * Payload may have some overrides from an init_query
             * @param payload
             */
            prepareDrilldown(payload) {
                this.rows = [];

                this.query.endpoint = (_.isUndefined(payload.endpoint)) ? this.default_query.endpoint : payload.endpoint;

                this.query.fields = (_.isUndefined(payload.fields)) ? this.default_query.fields : payload.fields;

                this.query.relations = (_.isUndefined(payload.relations)) ? this.default_query.relations : payload.relations;

                this.query.order_by = (_.isUndefined(payload.order_by)) ? this.default_query.order_by : payload.order_by;

                this.query.params = (_.isUndefined(payload.params)) ? this.default_query.params : payload.params;

                console.log('Prepare Query', this.query);

                this.getDrilldownData();
            },

            /**
             * Gets the data from the server in a paginated forms
             */
            getDrilldownData() {
                let request = {
                    endpoint: this.query.endpoint,
                    fields: this.query.fields,
                    relations: this.query.relations,
                    params: this.query.params,
                }
                if(this.options.itemsPerPage >= 0)
                {
                    request.order_by = this.query.order_by,
                    request.paginate = {first: this.options.itemsPerPage, page: this.options.page}
                }
console.log('retreive data ' + JSON.stringify(request))
                this.retrieveData(request, false);
            },

            /**
             * Gets the tickets from the server and adds to the data
             * @param request
             * @param download_request - download all files ready for download btn
             */
            retrieveData(request, download_request) {
                this.loading = true;

                console.log('Drilldown Request', request);

                this.$graph.getEndPointQuery(request)
                    .then((response) => {
                        console.log('Drilldown Response', response);
                        if(this.options.itemsPerPage) {
                            this.rows = response.data;
                            this.server_total_rows = response.paginatorInfo.total;
                        }
                        else
                        {
                            this.rows = [response];
                            this.server_total_rows = 1;
                            console.log("rows", this.rows, response)
                        }
                    })
                    .catch((error) => {
                        console.error(error);
                    })
                    .finally(() => {
                        this.loading = false;
                    })
            },

            download() {
                this.downloading = true;

                if (this.download_setup.columns === null) this.download_setup.columns = this.columns;

                if (!_.isNull(this.download_setup.fields) && !_.isUndefined(this.download_setup.fields)) this.query.fields = this.download_setup.fields;

                if (!_.isNull(this.download_setup.relations) && !_.isUndefined(this.download_setup.relations)) this.query.relations = this.download_setup.relations;

                this.$graph.download(this.query, this.download_setup)
                    .then((response) => {
                        console.log('DOWNLOAD', response);
                    }).finally(() => {
                    this.downloading = false
                });
            }
        },

        watch: {
            display_dialog: function (newVal, oldValue) {
                if (newVal === true) {
                    console.log('Drilldown Query', this.query);

                    this.prepareDrilldown(this.init_query);
                }
            },
            options: {
                handler() {
                    console.log('query ' + JSON.stringify(this.query));
                    if(!this.query.endpoint)
                        return;
                    if (this.options.sortBy.length > 0) {
                        this.query.order_by = [
                            {
                                field: this.options.sortBy[0].toUpperCase(),
                                order: (this.options.sortDesc[0]) ? 'DESC' : 'ASC'
                            }
                        ];
                    }

                    this.getDrilldownData();
                }
            },
            deep: true
        },


        computed: {
            /**
             * Compute the columns that should be displayed on the screen
             * @return {[]}
             */
            displayColumns() {
                let display_columns = [];

                _.each(this.columns, (obj) => {
                    display_columns.push(obj);
                });

                return display_columns;
            },

            dateRange() {
                return this.$store.getters['date_range/date_range']
            }
        }
    }
