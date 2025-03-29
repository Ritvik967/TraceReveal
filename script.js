function TraceReveal() {
    const [browserData, setBrowserData] = React.useState(null);
    const [loadingProgress, setLoadingProgress] = React.useState("Initializing...");
    const [isMounted, setIsMounted] = React.useState(true);

    React.useEffect(() => {
        setIsMounted(true);
        return () => setIsMounted(false);
    }, []);

    const safeSetBrowserData = (data) => {
        if (isMounted) setBrowserData(data);
    };

    const safeSetLoadingProgress = (progress) => {
        if (isMounted) setLoadingProgress(progress);
    };

    const collectBrowserData = () => {
        safeSetLoadingProgress("Collecting basic browser info...");
        const data = {
            // Basic Browser Information
            userAgent: navigator.userAgent,
            platform: navigator.platform,
            appVersion: navigator.appVersion,
            product: navigator.product,
            vendor: navigator.vendor,
            language: navigator.language,
            languages: navigator.languages || [],
            cookieEnabled: navigator.cookieEnabled,
            doNotTrack: navigator.doNotTrack,
            pdfViewerEnabled: navigator.pdfViewerEnabled,
            webdriver: navigator.webdriver,
            deviceMemory: navigator.deviceMemory,
            connection: navigator.connection ? {
                downlink: navigator.connection.downlink,
                effectiveType: navigator.connection.effectiveType,
                rtt: navigator.connection.rtt,
                saveData: navigator.connection.saveData
            } : null,

            // Screen and Display
            screenResolution: `${screen.width}x${screen.height}`,
            availableScreenResolution: `${screen.availWidth}x${screen.availHeight}`,
            colorDepth: screen.colorDepth,
            pixelRatio: window.devicePixelRatio,
            screenOrientation: screen.orientation ? screen.orientation.type : null,
            screenDetails: window.screen ? {
                availTop: window.screen.availTop,
                availLeft: window.screen.availLeft,
                colorGamut: window.screen.colorGamut,
                orientation: window.screen.orientation,
                pixelDepth: window.screen.pixelDepth
            } : null,

            // Network and Location
            onlineStatus: navigator.onLine,
            referrer: document.referrer,
            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            timezoneOffset: new Date().getTimezoneOffset(),

            // Battery Status (if available)
            batteryStatus: navigator.getBattery ? (() => {
                try {
                    const battery = navigator.getBattery();
                    return {
                        charging: battery.charging,
                        level: battery.level,
                        chargingTime: battery.chargingTime,
                        dischargingTime: battery.dischargingTime
                    };
                } catch (e) {
                    return "Not available";
                }
            })() : "Not supported",

            // Geolocation (if available)
            geolocation: null,

            // Device Capabilities
            touchSupport: 'ontouchstart' in window,
            hardwareConcurrency: navigator.hardwareConcurrency,
            maxTouchPoints: navigator.maxTouchPoints || 0,
            pointer: {
                maxPoints: navigator.maxTouchPoints || 0,
                primaryPointer: navigator.pointerEnabled ? "Pointer" : "Touch/Mouse"
            },
            vibration: navigator.vibrate ? "Supported" : "Not supported",
            mediaDevices: navigator.mediaDevices ? "Available" : "Not available",

            // Storage Information
            localStorage: localStorage ? "Available" : "Not available",
            sessionStorage: sessionStorage ? "Available" : "Not available",
            indexedDB: window.indexedDB ? "Available" : "Not available",
            storageEstimate: null,

            // Audio/Video Capabilities
            audioContext: getAudioContextFingerprint(),
            videoCodecs: getVideoCodecSupport(),
            audioCodecs: getAudioCodecSupport(),

            // Advanced Browser Fingerprinting
            canvas: getCanvasFingerprint(),
            webgl: getWebGLInfo(),
            fonts: getInstalledFonts(),
            webRTC: getWebRTCInfo(),
            performance: {
                timing: window.performance ? window.performance.timing : null,
                memory: window.performance && window.performance.memory ? window.performance.memory : null
            },

            // Browser Extensions
            extensions: detectExtensions(),

            // Social Media Logins
            loggedInAccounts: detectSocialMediaLogins(),

            // Browsing Context
            currentURL: window.location.href,
            windowSize: `${window.innerWidth}x${window.innerHeight}`,
            historyLength: window.history.length,
            documentCookies: document.cookie,
            documentTitle: document.title,
            documentCharset: document.characterSet
        };

        // Get storage estimate if available
        safeSetLoadingProgress("Checking storage capabilities...");
        if (navigator.storage && navigator.storage.estimate) {
            navigator.storage.estimate().then(estimate => {
                data.storageEstimate = estimate;
                safeSetBrowserData(prev => ({
                    ...prev,
                    storageEstimate: estimate
                }));
            }).catch(() => {
                data.storageEstimate = "Error retrieving";
            });
        }

        // Attempt Geolocation
        safeSetLoadingProgress("Attempting geolocation...");
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    data.geolocation = {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        accuracy: position.coords.accuracy,
                        altitude: position.coords.altitude,
                        altitudeAccuracy: position.coords.altitudeAccuracy,
                        heading: position.coords.heading,
                        speed: position.coords.speed
                    };
                    safeSetBrowserData(data);
                },
                (error) => {
                    data.geolocation = `Geolocation error: ${error.message}`;
                    safeSetBrowserData(data);
                }, {
                    enableHighAccuracy: true,
                    timeout: 10000
                }
            );
        } else {
            data.geolocation = "Geolocation not supported";
            safeSetBrowserData(data);
        }

        return data;
    };

    const getCanvasFingerprint = () => {
        try {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const txt = 'TraceReveal Fingerprint';

            // Draw complex canvas fingerprint
            ctx.textBaseline = "top";
            ctx.font = "14px 'Arial'";
            ctx.textBaseline = "alphabetic";
            ctx.fillStyle = "#f60";
            ctx.fillRect(125, 1, 62, 20);
            ctx.fillStyle = "#069";
            ctx.fillText(txt, 2, 15);
            ctx.fillStyle = "rgba(102, 204, 0, 0.7)";
            ctx.fillText(txt, 4, 17);

            // Add more complexity
            ctx.globalCompositeOperation = "multiply";
            ctx.fillStyle = "rgb(255,0,255)";
            ctx.beginPath();
            ctx.arc(50, 50, 50, 0, Math.PI * 2, true);
            ctx.closePath();
            ctx.fill();
            ctx.fillStyle = "rgb(0,255,255)";
            ctx.beginPath();
            ctx.arc(100, 50, 50, 0, Math.PI * 2, true);
            ctx.closePath();
            ctx.fill();
            ctx.fillStyle = "rgb(255,255,0)";
            ctx.beginPath();
            ctx.arc(75, 100, 50, 0, Math.PI * 2, true);
            ctx.closePath();
            ctx.fill();
            ctx.fillStyle = "rgb(255,0,255)";
            ctx.arc(75, 75, 75, 0, Math.PI * 2, true);
            ctx.arc(75, 75, 25, 0, Math.PI * 2, true);
            ctx.fill("evenodd");

            return canvas.toDataURL();
        } catch (e) {
            return `Canvas error: ${e.message}`;
        }
    };

    const getWebGLInfo = () => {
        try {
            const canvas = document.createElement('canvas');
            const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
            if (!gl) return {
                supported: false
            };

            const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
            const info = {
                supported: true,
                vendor: debugInfo ? gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) : null,
                renderer: debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : null,
                parameters: {}
            };

            // Collect WebGL parameters
            const params = [
                'VERSION', 'SHADING_LANGUAGE_VERSION', 'VENDOR', 'RENDERER',
                'MAX_TEXTURE_SIZE', 'MAX_CUBE_MAP_TEXTURE_SIZE', 'MAX_RENDERBUFFER_SIZE',
                'MAX_VIEWPORT_DIMS', 'MAX_TEXTURE_IMAGE_UNITS', 'MAX_COMBINED_TEXTURE_IMAGE_UNITS',
                'MAX_VERTEX_TEXTURE_IMAGE_UNITS', 'MAX_VERTEX_ATTRIBS', 'MAX_VERTEX_UNIFORM_VECTORS',
                'MAX_VARYING_VECTORS', 'MAX_FRAGMENT_UNIFORM_VECTORS'
            ];

            params.forEach(param => {
                try {
                    info.parameters[param] = gl.getParameter(gl[param]);
                } catch (e) {
                    info.parameters[param] = `Error: ${e.message}`;
                }
            });

            return info;
        } catch (e) {
            return {
                supported: false,
                error: e.message
            };
        }
    };

    const getAudioContextFingerprint = () => {
        try {
            if (!window.AudioContext && !window.webkitAudioContext) {
                return "AudioContext not supported";
            }

            const audioContext = new(window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const analyser = audioContext.createAnalyser();
            const gainNode = audioContext.createGain();
            const scriptProcessor = audioContext.createScriptProcessor(4096, 1, 1);

            let fingerprint = "";

            oscillator.type = 'triangle';
            oscillator.connect(analyser);
            analyser.connect(scriptProcessor);
            scriptProcessor.connect(gainNode);
            gainNode.connect(audioContext.destination);

            oscillator.start(0);

            scriptProcessor.onaudioprocess = function(e) {
                const data = new Float32Array(analyser.frequencyBinCount);
                analyser.getFloatFrequencyData(data);

                for (let i = 0; i < data.length; i++) {
                    fingerprint += data[i];
                }

                oscillator.stop();
                audioContext.close();
            };

            return "Audio fingerprint generated";
        } catch (e) {
            return `AudioContext error: ${e.message}`;
        }
    };

    const getInstalledFonts = () => {
        try {
            const fonts = [
                // Windows fonts
                'Arial', 'Arial Black', 'Arial Narrow', 'Arial Unicode MS',
                'Calibri', 'Cambria', 'Cambria Math', 'Comic Sans MS', 'Consolas',
                'Constantia', 'Corbel', 'Courier New', 'Georgia', 'Lucida Console',
                'Lucida Sans Unicode', 'Microsoft Sans Serif', 'Palatino Linotype',
                'Segoe UI', 'Tahoma', 'Times New Roman', 'Trebuchet MS', 'Verdana',
                'Webdings', 'Wingdings',

                // Mac fonts
                'American Typewriter', 'Andale Mono', 'Apple Braille', 'Apple Chancery',
                'Apple Symbols', 'AppleGothic', 'AppleMyungjo', 'Arial Hebrew',
                'Arial Rounded MT Bold', 'Avenir', 'Avenir Next', 'Avenir Next Condensed',
                'Baskerville', 'Big Caslon', 'Brush Script MT', 'Chalkboard',
                'Chalkboard SE', 'Chalkduster', 'Charcoal CY', 'Cochin', 'Comic Sans MS',
                'Copperplate', 'Corsiva Hebrew', 'Courier', 'DecoType Naskh',
                'Devanagari MT', 'Didot', 'Euphemia UCAS', 'Futura', 'Geeza Pro',
                'Geneva', 'Gill Sans', 'Hei', 'Helvetica', 'Helvetica Neue', 'Herculanum',
                'Hoefler Text', 'Impact', 'InaiMathi', 'Krungthep', 'Lao UI', 'Lucida Grande',
                'Marker Felt', 'Menlo', 'Microsoft Sans Serif', 'Monaco', 'Mshtakan',
                'New Peninim MT', 'Optima', 'Osaka', 'PT Sans', 'PT Sans Caption',
                'PT Sans Narrow', 'PT Serif', 'PT Serif Caption', 'Palatino', 'Papyrus',
                'Phosphate', 'PilGi', 'Plantagenet Cherokee', 'Raanana', 'Sathu',
                'Silom', 'Skia', 'Snell Roundhand', 'STHeiti', 'Symbol', 'Tahoma',
                'Thonburi', 'Times', 'Times New Roman', 'Zapf Dingbats', 'Zapfino'
            ];

            const availableFonts = [];
            const div = document.createElement('div');
            div.style.position = 'absolute';
            div.style.left = '-9999px';
            div.style.fontFamily = 'monospace';
            div.innerHTML = 'mmmmmmmmmmlli';

            const defaultWidth = {};
            const defaultHeight = {};

            const span = document.createElement('span');
            span.style.fontFamily = 'monospace';
            span.innerHTML = 'mmmmmmmmmmlli';
            div.appendChild(span);
            document.body.appendChild(div);

            defaultWidth.monospace = span.offsetWidth;
            defaultHeight.monospace = span.offsetHeight;

            fonts.forEach(font => {
                span.style.fontFamily = `'${font}', monospace`;
                if (span.offsetWidth !== defaultWidth.monospace ||
                    span.offsetHeight !== defaultHeight.monospace) {
                    availableFonts.push(font);
                }
            });

            document.body.removeChild(div);
            return availableFonts;
        } catch (e) {
            return `Font detection error: ${e.message}`;
        }
    };

    const getVideoCodecSupport = () => {
        const video = document.createElement('video');
        const codecs = [
            'video/webm; codecs="vp8, vorbis"',
            'video/webm; codecs="vp9, opus"',
            'video/mp4; codecs="avc1.42E01E"',
            'video/mp4; codecs="avc1.42E01E, mp4a.40.2"',
            'video/mp4; codecs="hev1.1.6.L93.B0"',
            'video/ogg; codecs="theora, vorbis"',
            'video/x-matroska; codecs="theora, vorbis"'
        ];

        const support = {};
        codecs.forEach(codec => {
            support[codec] = video.canPlayType(codec);
        });

        return support;
    };

    const getAudioCodecSupport = () => {
        const audio = document.createElement('audio');
        const codecs = [
            'audio/mpeg',
            'audio/ogg; codecs="vorbis"',
            'audio/wav; codecs="1"',
            'audio/aac',
            'audio/mp4; codecs="mp4a.40.2"',
            'audio/ogg; codecs="opus"',
            'audio/webm; codecs="opus"'
        ];

        const support = {};
        codecs.forEach(codec => {
            support[codec] = audio.canPlayType(codec);
        });

        return support;
    };

    const getWebRTCInfo = () => {
        try {
            if (!window.RTCPeerConnection) return "WebRTC not supported";

            const pc = new RTCPeerConnection({
                iceServers: [{
                    urls: 'stun:stun.l.google.com:19302'
                }]
            });

            const info = {
                supported: true,
                localIP: null,
                iceConnectionState: pc.iceConnectionState,
                iceGatheringState: pc.iceGatheringState,
                signalingState: pc.signalingState
            };

            pc.createDataChannel('traceReveal');
            pc.createOffer()
                .then(offer => pc.setLocalDescription(offer))
                .catch(e => console.error(e));

            pc.onicecandidate = (ice) => {
                if (!ice || !ice.candidate || !ice.candidate.candidate) return;
                const ipRegex = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/;
                const ip = ipRegex.exec(ice.candidate.candidate);
                if (ip) info.localIP = ip[0];
            };

            setTimeout(() => {
                pc.close();
            }, 1000);

            return info;
        } catch (e) {
            return `WebRTC error: ${e.message}`;
        }
    };

    const detectExtensions = () => {
        // Detect common extensions by checking for unique behaviors
        const extensions = {};

        // Chrome Extensions
        extensions.chrome = {
            adBlock: isExtensionInstalled('adblockplus'),
            grammarly: isExtensionInstalled('grammarly'),
            lastPass: isExtensionInstalled('lastpass'),
            uBlockOrigin: isExtensionInstalled('ublock')
        };

        // Firefox Add-ons
        extensions.firefox = {
            adBlock: isExtensionInstalled('adblockplus'),
            noScript: isExtensionInstalled('noscript'),
            ghostery: isExtensionInstalled('ghostery'),
            httpsEverywhere: isExtensionInstalled('https-everywhere')
        };

        return extensions;

        function isExtensionInstalled(extensionId) {
            try {
                // Try to access extension-specific CSS
                const el = document.createElement('div');
                el.className = `__${extensionId}__`;
                document.body.appendChild(el);
                const style = window.getComputedStyle(el);
                document.body.removeChild(el);

                // Some extensions add special styles to their elements
                if (style && style.display === 'none') return true;

                // Try to detect by extension-specific objects
                if (extensionId === 'adblockplus' && window.adblockplus !== undefined) return true;
                if (extensionId === 'ublock' && window.ublock !== undefined) return true;
                if (extensionId === 'ghostery' && window.Ghostery !== undefined) return true;

                return false;
            } catch (e) {
                return false;
            }
        }
    };

    const detectSocialMediaLogins = () => {
        // This is a very limited detection that only works for some cases
        const accounts = {};

        // Facebook
        try {
            accounts.facebook = document.cookie.includes('c_user=');
        } catch (e) {
            accounts.facebook = 'Unknown';
        }

        // Twitter
        try {
            accounts.twitter = document.cookie.includes('auth_token=');
        } catch (e) {
            accounts.twitter = 'Unknown';
        }

        // Google
        try {
            accounts.google = document.cookie.includes('SID=') ||
                document.cookie.includes('HSID=') ||
                document.cookie.includes('SSID=');
        } catch (e) {
            accounts.google = 'Unknown';
        }

        return accounts;
    };

    React.useEffect(() => {
        collectBrowserData();
    }, []);

    const renderDataSection = (title, data) => {
        return React.createElement('div', {
            className: 'section',
            key: title
        }, [
            React.createElement('h2', {
                className: 'section-title',
                key: `${title}-header`
            }, title),
            ...Object.entries(data).map(([key, value]) =>
                React.createElement('div', {
                    key: `${title}-${key}`,
                    className: 'data-row'
                }, [
                    React.createElement('span', {
                        className: 'data-label',
                        key: `${title}-${key}-label`
                    }, key),
                    React.createElement('span', {
                            className: 'data-value',
                            key: `${title}-${key}-value`
                        },
                        typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value)
                    )
                ])
            )
        ]);
    };

    if (!browserData) {
        return React.createElement('div', {
            className: 'loading',
            key: 'loading'
        }, loadingProgress);
    }

    return React.createElement('div', {
        className: 'container',
        key: 'container'
    }, [
        React.createElement('div', {
            className: 'header',
            key: 'header'
        }, [
            React.createElement('h1', {
                className: 'title',
                key: 'title'
            }, 'TraceReveal'),
            React.createElement('p', {
                className: 'subtitle',
                key: 'subtitle'
            }, 'Discover every digital breadcrumb your browser leaves behind')
        ]),
        renderDataSection("Core Browser Information", {
            "User Agent": browserData.userAgent,
            "Platform": browserData.platform,
            "App Version": browserData.appVersion,
            "Product": browserData.product,
            "Vendor": browserData.vendor,
            "Language": browserData.language,
            "Languages": browserData.languages ? browserData.languages.join(', ') : 'Not available',
            "Cookies Enabled": browserData.cookieEnabled,
            "Do Not Track": browserData.doNotTrack,
            "PDF Viewer Enabled": browserData.pdfViewerEnabled,
            "WebDriver": browserData.webdriver,
            "Device Memory": browserData.deviceMemory ? `${browserData.deviceMemory} GB` : 'Unknown',
            "Connection": browserData.connection ? JSON.stringify(browserData.connection) : 'Not available'
        }),
        renderDataSection("Screen & Display", {
            "Screen Resolution": browserData.screenResolution,
            "Available Screen Resolution": browserData.availableScreenResolution,
            "Color Depth": `${browserData.colorDepth} bits`,
            "Pixel Ratio": browserData.pixelRatio,
            "Screen Orientation": browserData.screenOrientation,
            "Screen Details": browserData.screenDetails ? JSON.stringify(browserData.screenDetails) : 'Not available'
        }),
        renderDataSection("Network & Location", {
            "Online Status": browserData.onlineStatus ? "Online" : "Offline",
            "Referrer": browserData.referrer || "No referrer",
            "Time Zone": browserData.timeZone,
            "Timezone Offset": `${browserData.timezoneOffset} minutes`,
            "Battery Status": typeof browserData.batteryStatus === 'object' ?
                JSON.stringify(browserData.batteryStatus) : browserData.batteryStatus,
            "Geolocation": typeof browserData.geolocation === 'object' ?
                `Lat: ${browserData.geolocation.latitude}, Lon: ${browserData.geolocation.longitude}, Accuracy: ${browserData.geolocation.accuracy}m` : browserData.geolocation
        }),
        renderDataSection("Device Capabilities", {
            "Touch Support": browserData.touchSupport ? "Yes" : "No",
            "CPU Cores": browserData.hardwareConcurrency,
            "Max Touch Points": browserData.maxTouchPoints,
            "Pointer Type": (browserData.pointer && browserData.pointer.primaryPointer) || "Not available",
            "Vibration API": browserData.vibration,
            "Media Devices": browserData.mediaDevices
        }),
        renderDataSection("Storage Information", {
            "Local Storage": browserData.localStorage,
            "Session Storage": browserData.sessionStorage,
            "IndexedDB": browserData.indexedDB,
            "Storage Estimate": browserData.storageEstimate ?
                `Quota: ${Math.round(browserData.storageEstimate.quota / (1024 * 1024))}MB, Usage: ${Math.round(browserData.storageEstimate.usage / (1024 * 1024))}MB` : "Not available"
        }),
        renderDataSection("Media Capabilities", {
            "Audio Context Fingerprint": browserData.audioContext,
            "Video Codec Support": JSON.stringify(browserData.videoCodecs, null, 2),
            "Audio Codec Support": JSON.stringify(browserData.audioCodecs, null, 2)
        }),
        renderDataSection("Advanced Fingerprinting", {
            "WebGL Vendor": (browserData.webgl && browserData.webgl.vendor) || "Not available",
            "WebGL Renderer": (browserData.webgl && browserData.webgl.renderer) || "Not available",
            "WebGL Parameters": (browserData.webgl && browserData.webgl.parameters) ? JSON.stringify(browserData.webgl.parameters, null, 2) : "Not available",
            "Canvas Fingerprint": (browserData.canvas && browserData.canvas.includes('data:image')) ? "Generated (unique)" : browserData.canvas || "Not available",
            "Installed Fonts": Array.isArray(browserData.fonts) && browserData.fonts.length > 0 ? browserData.fonts.join(', ') : "Font detection failed",
            "WebRTC Info": (browserData.webRTC && browserData.webRTC.supported) ?
                `Local IP: ${(browserData.webRTC && browserData.webRTC.localIP) || 'Not detected'}, ICE State: ${(browserData.webRTC && browserData.webRTC.iceConnectionState)}` : browserData.webRTC || "Not available"
        }),
        renderDataSection("Performance Metrics", {
            "Performance Timing": (browserData.performance && browserData.performance.timing) ? "Available" : "Not available",
            "Memory Usage": (browserData.performance && browserData.performance.memory) ?
                `Used: ${Math.round(browserData.performance.memory.usedJSHeapSize / 1048576)}MB, Total: ${Math.round(browserData.performance.memory.totalJSHeapSize / 1048576)}MB` : "Not available"
        }),
        renderDataSection("Browser Extensions", {
            "Chrome Extensions": (browserData.extensions && browserData.extensions.chrome) ? JSON.stringify(browserData.extensions.chrome, null, 2) : "Not available",
            "Firefox Add-ons": (browserData.extensions && browserData.extensions.firefox) ? JSON.stringify(browserData.extensions.firefox, null, 2) : "Not available"
        }),
        renderDataSection("Social Media Logins", {
            "Facebook": (browserData.loggedInAccounts && browserData.loggedInAccounts.facebook) ? "Likely logged in" : "Not detected",
            "Twitter": (browserData.loggedInAccounts && browserData.loggedInAccounts.twitter) ? "Likely logged in" : "Not detected",
            "Google": (browserData.loggedInAccounts && browserData.loggedInAccounts.google) ? "Likely logged in" : "Not detected"
        }),
        renderDataSection("Browsing Context", {
            "Current URL": browserData.currentURL,
            "Window Size": browserData.windowSize,
            "History Length": browserData.historyLength,
            "Document Cookies": browserData.documentCookies || "No cookies",
            "Document Title": browserData.documentTitle,
            "Document Charset": browserData.documentCharset
        })
    ]);
}

ReactDOM.render(
    React.createElement(TraceReveal),
    document.getElementById('root')
);