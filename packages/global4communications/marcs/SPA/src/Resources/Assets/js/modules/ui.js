export default {
    namespaced: true,
    state: {

    },

    getters: {

    },

    actions: {
        openAffinitySite(context, payload) {
            axios.post('/api/v1/affinity/open-site', {site_id: payload.site_id})
                .then((response) => {
                    console.log(response);
                })
        }
    }
}
