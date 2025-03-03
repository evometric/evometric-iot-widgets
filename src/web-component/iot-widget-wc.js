// web component
import { setupIFrameResizeListener } from "./host-common";

const HOST = process.env.NODE_ENV === 'production' ? '4iot.link' : 'dev.4iot.link:3001'

export class _4IoTWidget extends HTMLElement {

    static define(tag = "iot-widget") {
        customElements.define(tag, this)
    }

    static hasAddedMsgListener = false
    static observedAttributes = ['asset', 'view', 'param1', 'period', 'window', 'module']

    constructor() {
        super();
        this.widgetId = Math.random().toString(16).substring(2, 10)

        this.mywidth = 0
    }

    reRender (elem) {
        const div = elem;
        const shadow = elem.shadowRoot

        if (!shadow) {
            return
        }

        this.myWidth = div.offsetWidth

        var el = document.createElement("iframe")
        el.classList.add("_4iot")
        el.scrolling = "no"
        el.style.overflow = "hidden"
        el.style.width = '100%';
        el.style.border = 0;
        el.style.height = '100%';
        el.style.overflow = 'hidden';
        el.style['scroll-behavior'] = 'smooth';

        const all_params = {
            widgetId: this.widgetId,
        }
        all_params.width = this.myWidth

        var maxDim = Math.max(document.documentElement.clientWidth || 0, document.documentElement.clientHeight || 0, window.innerWidth || 0, window.innerHeight || 0 )
        if (maxDim > 0) {
            all_params.maxDim = maxDim
        }

        div.getAttributeNames().filter((n) => _4IoTWidget.observedAttributes.includes(n)).forEach(name => {
            var arg = name.replace("data-4iot-", "")
            var value = div.getAttribute(name) || "true"
            if (arg === 'params') {
                var json_params = new Function([], `return ${value}`)() // like eval() dangerous!
                for (var prop in json_params) {
                    if (json_params.hasOwnProperty(prop)) {
                        all_params[prop] = json_params[prop];
                    }
                }
            }
            else {
                all_params[arg] = value
            }
        })

        var type = "-"
        var id = "-"
        if (all_params.hasOwnProperty("asset")) {
            type = "asset"
            id = all_params.asset
            delete all_params.asset
        }

        // var query = QueryParams.stringify(all_params)
        const usp = new URLSearchParams()


        // Alphabetically sort all_params properties and set each key/value on "usp"
        Object.keys(all_params)
            .sort()
            .forEach(key => usp.set(key, all_params[key]));

        const query = usp.toString(); // convert URLSearchParams to a query string
        const src = `//${HOST}/framed/v1/frame/${type}/${id}?` + query
        console.log("main.js frame src: ", src)

        el.setAttribute("src", src)

        shadow.replaceChildren(el)
    }

    // connect component
    connectedCallback() {
        this.attachShadow({ mode: "open" });

        this.style.display = 'block';
        this.setAttribute("data-widget-id", this.widgetId );

        this.reRender(this)

        if(!_4IoTWidget.hasAddedMsgListener) {
            console.log("adding msg listener")
            setupIFrameResizeListener()
            _4IoTWidget.hasAddedMsgListener = true
        } else {
            console.log("msg listener already added")
        }
    }

    attributeChangedCallback(attrName, oldVal, newVal) {
        this.reRender(this)
    }

}

customElements.define('iot-widget', _4IoTWidget)

