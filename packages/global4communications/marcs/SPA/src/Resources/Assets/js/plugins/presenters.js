import presenters from "./../lib/presenters"

const vuePresenter = {
    install(Vue, options) {
        if (!Vue.prototype.hasOwnProperty('$presenter')) {
            Object.defineProperty(Vue.prototype, '$presenter', {
                get() {
                    return presenters;
                }
            })
        }
    }
}

export default vuePresenter;

