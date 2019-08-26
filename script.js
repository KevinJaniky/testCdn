$(document).ready(function () {
    if (typeof smartfactoryModulePToken !== "undefined") {
        if ($('.smartfactory_modulep_action').length > 0) {
            $(document).on('click', '.smartfactory_modulep_action', function () {
                let uuid = sessionStorage.getItem('smartfactory_modulep_uuid');
                let obj = {};
                if (uuid !== undefined && uuid !== '' && uuid !== null) {
                    //déja cliqué
                    let t = getCurrentTerminal();
                    getCurrentPosition(function (data) {
                        let coord;
                        if (data.error === true) {
                            coord = {
                                lon: null,
                                lat: null
                            }
                        } else {
                            data.error = undefined;
                            coord = data;
                        }
                        obj = {
                            uuid,
                            idp: $(this).data('modulepid'),
                            geoJson: coord,
                            terminal: t,
                            bundle: 'duplicate',
                            created_at: Math.floor(Date.now() / 1000)
                        };
                        console.log(obj);

                    });
                } else {
                    // premier click
                    let generateUuid = generateUUID();
                    let uuid = sessionStorage.setItem('smartfactory_modulep_uuid', generateUuid);
                    let t = getCurrentTerminal();
                    getCurrentPosition(function (data) {
                        let coord = {};
                        if (data.error === true) {
                            coord = {
                                lon: null,
                                lat: null
                            }
                        } else {
                            data.error = undefined;
                            coord = data;
                        }
                        obj = {
                            generateUuid,
                            idp: $(this).data('modulepid'),
                            geoJson: coord,
                            terminal: t,
                            bundle: 'unique',
                            created_at: Math.floor(Date.now() / 1000)
                        };
                    });
                    console.log(obj);

                }


                // Send to nodejsPasserelle
            });
        }
    } else {
        console.error('smartfactoryModulePToken : Token is missing');
    }
});


let getCurrentTerminal = () => {
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))
        return 'mobile';
    return 'desktop';
};

let getCurrentPosition = (callback) => {
    window.navigator.geolocation.getCurrentPosition(function (position) {
        return callback({
            error: false,
            lat: position.coords.latitude,
            lon: position.coords.longitude,
        });
    }, function (e) {
        return callback({
            error: true,
            message: e.message,
            code: e.code,
        });
    })
};


let generateUUID = () => {
    let dt = new Date().getTime();
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (dt + Math.random() * 16) % 16 | 0;
        dt = Math.floor(dt / 16);
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
}
