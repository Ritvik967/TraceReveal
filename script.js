function TraceReveal() {
    const [browserData, setBrowserData] = React.useState(null);

    const collectBrowserData = () => {
        const data = {
            // Basic Browser Information
            userAgent: navigator.userAgent,
            platform: navigator.platform,
            language: navigator.language,
            languages: navigator.languages,
            cookiesEnabled: navigator.cookieEnabled,
            doNotTrack: navigator.doNotTrack,

            // Screen and Display
            screenResolution: `${screen.width}x${screen.height}`,
            colorDepth: screen.colorDepth,
            pixelRatio: window.devicePixelRatio,

            // Network and Location
            onlineStatus: navigator.onLine,
            referrer: document.referrer,
            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,

            // Geolocation (if available)
            geolocation: null,

            // Browser Capabilities
            touchSupport: 'ontouchstart' in window,
            hardwareConcurrency: navigator.hardwareConcurrency,
            maxTouchPoints: navigator.maxTouchPoints,

            // Advanced Browser Fingerprinting
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            canvas: getCanvasFingerprint(),
            webglVendor: getWebGLVendor(),

            // Browsing Context
            currentURL: window.location.href,
            windowSize: `${window.innerWidth}x${window.innerHeight}`,
        };

        // Attempt Geolocation
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    data.geolocation = {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    };
                    setBrowserData(data);
                },
                () => {
                    data.geolocation = "Permission denied";
                    setBrowserData(data);
                }
            );
        } else {
            data.geolocation = "Geolocation not supported";
            setBrowserData(data);
        }

        return data;
    };

    const getCanvasFingerprint = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const txt = 'TraceReveal Fingerprint';
        ctx.textBaseline = "top";
        ctx.font = "14px 'Arial'";
        ctx.textBaseline = "alphabetic";
        ctx.fillStyle = "#f60";
        ctx.fillRect(125, 1, 62, 20);
        ctx.fillStyle = "#069";
        ctx.fillText(txt, 2, 15);
        ctx.fillStyle = "rgba(102, 204, 0, 0.7)";
        ctx.fillText(txt, 4, 17);
        return canvas.toDataURL();
    };

    const getWebGLVendor = () => {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl');
        if (!gl) return "WebGL not supported";
        const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
        return debugInfo ? gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) : "Unknown";
    };

    React.useEffect(() => {
        collectBrowserData();
    }, []);

    const renderDataSection = (title, data) => {
        return React.createElement('div', {
            className: 'section'
        }, [
            React.createElement('h2', {
                className: 'section-title'
            }, title),
            ...Object.entries(data).map(([key, value]) =>
                React.createElement('div', {
                    key: key,
                    className: 'data-row'
                }, [
                    React.createElement('span', {
                        className: 'data-label'
                    }, key),
                    React.createElement('span', {
                            className: 'data-value'
                        },
                        typeof value === 'object' ? JSON.stringify(value) : String(value)
                    )
                ])
            )
        ]);
    };

    if (!browserData) {
        return React.createElement('div', {
            className: 'loading'
        }, 'Collecting browser data...');
    }

    return React.createElement('div', {
        className: 'container'
    }, [
        React.createElement('div', {
            className: 'header'
        }, [
            React.createElement('h1', {
                className: 'title'
            }, 'TraceReveal'),
            React.createElement('p', {
                className: 'subtitle'
            }, 'Discover the digital breadcrumbs your browser leaves behind')
        ]),
        renderDataSection("Browser Information", {
            userAgent: browserData.userAgent,
            platform: browserData.platform,
            language: browserData.language,
            languages: browserData.languages,
            cookiesEnabled: browserData.cookiesEnabled,
            doNotTrack: browserData.doNotTrack
        }),
        renderDataSection("Screen & Display", {
            screenResolution: browserData.screenResolution,
            colorDepth: browserData.colorDepth,
            pixelRatio: browserData.pixelRatio
        }),
        renderDataSection("Network & Location", {
            onlineStatus: browserData.onlineStatus,
            referrer: browserData.referrer,
            timeZone: browserData.timeZone,
            geolocation: browserData.geolocation ?
                `Lat: ${browserData.geolocation.latitude}, Lon: ${browserData.geolocation.longitude}` : browserData.geolocation
        }),
        renderDataSection("Device Capabilities", {
            touchSupport: browserData.touchSupport,
            hardwareConcurrency: browserData.hardwareConcurrency,
            maxTouchPoints: browserData.maxTouchPoints
        }),
        renderDataSection("Browser Fingerprint", {
            webglVendor: browserData.webglVendor,
            canvasFingerprint: browserData.canvas ? "Generated" : "Not Available"
        })
    ]);
}

ReactDOM.render(
    React.createElement(TraceReveal),
    document.getElementById('root')
);