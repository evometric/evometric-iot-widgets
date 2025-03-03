export function setupIFrameResizeListener() {
    /*
    * message listener which listens for messages from child objects to (this) parent.
    *
    * handles messages from iframes in the format {
    *
    */
    function onMessageHandler(e) {
        if( typeof e.data === 'object' && e.data.hasOwnProperty('frame_height') ) {
            console.log("resizer: got msg", e.data)
            if (e.data.hasOwnProperty('widgetId')){
                const selector = `iot-widget[data-widget-id="${e.data.widgetId}"]`
                const div = document.querySelector(selector)
                if (div) {
                    div.style.height = e.data.frame_height + "px"
                } else {
                    console.log("Widget resize selector not found", selector)
                }
            }
            else {
                var child_frame_source = e.source.location.href;
                var iframes = document.getElementsByTagName("iframe")
                for (let i = 0; i < iframes.length; i++) {
                    if (iframes[i].contentWindow.location.href === child_frame_source) {
                        console.log("adjust frame height: ", e.data.frame_height)
                        iframes[i].style.height = e.data.frame_height + "px";
                        break
                    }
                }
            }
        } else {
            console.log("unknown message type: ", typeof e.data, e.data.hasOwnProperty('frame_height'))
        }
    }

    /*
     * add message receiver
     */
    if (window.addEventListener) {
        window.addEventListener('message', onMessageHandler, false);
    } else if (window.attachEvent) {
        window.attachEvent('onmessage', onMessageHandler);
    }
}
